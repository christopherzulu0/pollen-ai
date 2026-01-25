import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// POST endpoint to create a new insurance product
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Log received data for debugging
    console.log("[ADMIN_INSURANCE_POST] Received data:", JSON.stringify(data, null, 2))

    // Validate required fields
    if (!data.name || !data.productType || !data.coverageAmount || !data.premiumAmount) {
      return NextResponse.json(
        { error: "Missing required fields: name, productType, coverageAmount, premiumAmount" },
        { status: 400 }
      )
    }

    // Map product type from form to schema format
    const productTypeMap: Record<string, string> = {
      crop: "crop",
      health: "health",
      loan: "loan_protection",
      fraud: "savings_fraud",
      mobile: "mobile",
      weather: "weather",
    }

    const productType = productTypeMap[data.productType] || data.productType

    // Map premium frequency
    const frequencyMap: Record<string, string> = {
      monthly: "MONTHLY",
      quarterly: "QUARTERLY",
      seasonal: "SEASONAL",
      annual: "ANNUAL",
    }

    const premiumFrequency = frequencyMap[data.premiumFrequency.toLowerCase()] || "MONTHLY"

    // Validate and parse numeric values
    const coverageAmount = parseFloat(data.coverageAmount)
    const premiumAmount = parseFloat(data.premiumAmount)

    if (isNaN(coverageAmount) || coverageAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid coverage amount. Must be a positive number." },
        { status: 400 }
      )
    }

    if (isNaN(premiumAmount) || premiumAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid premium amount. Must be a positive number." },
        { status: 400 }
      )
    }

    // Prepare the data object for creation
    const productData = {
      name: data.name.trim(),
        productType: productType,
      description: data.description ? data.description.trim() : "",
      coverageAmount: coverageAmount,
      premiumAmount: premiumAmount,
        premiumFrequency: premiumFrequency,
        features: [],
        requirements: [],
        status: "active",
        claimProcessingTime: data.claimProcessingTime || null,
        maxClaimAmount: null,
        deductible: 0,
      coverageTerms: data.coverageTerms ? data.coverageTerms.trim() : null,
      exclusions: data.exclusions ? data.exclusions.trim() : null,
    }

    // Log data being saved
    console.log("[ADMIN_INSURANCE_POST] Creating product with data:", JSON.stringify(productData, null, 2))

    // Create the insurance product
    const newProduct = await prisma.insuranceProduct.create({
      data: productData,
    })

    console.log("[ADMIN_INSURANCE_POST] Product created successfully:", newProduct.id)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("[ADMIN_INSURANCE_POST_ERROR]", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error("[ADMIN_INSURANCE_POST_ERROR] Details:", errorDetails)
    return NextResponse.json(
      { error: "Failed to create insurance product", details: errorMessage },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch insurance products and claims for admin
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") // "products" or "claims"

    if (type === "claims") {
      // Fetch claims
      const status = searchParams.get("status")
      const search = searchParams.get("search")

      const where: any = {}
      if (status && status !== "all") {
        where.status = status
      }
      if (search) {
        where.OR = [
          { claimNumber: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { policy: { user: { name: { contains: search, mode: "insensitive" } } } },
          { policy: { user: { email: { contains: search, mode: "insensitive" } } } },
        ]
      }

      const claims = await prisma.insuranceClaim.findMany({
        where,
        include: {
          policy: {
            include: {
              product: {
                select: {
                  name: true,
                  productType: true,
                },
              },
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      const transformedClaims = claims.map((claim) => {
        // Ensure documents and evidenceUrls are arrays
        const documents = Array.isArray(claim.documents) ? claim.documents : []
        const evidenceUrls = Array.isArray(claim.evidenceUrls) ? claim.evidenceUrls : []
        
        return {
          id: claim.claimNumber,
          policyHolder: claim.policy.user?.name || "Unknown",
          insuranceType: claim.policy.product?.name || "Unknown",
          claimAmount: `ZMW ${Number(claim.claimAmount).toLocaleString()}`,
          status: claim.status === "submitted" ? "pending" : claim.status === "under_review" ? "processing" : claim.status,
          dateSubmitted: claim.claimDate.toISOString().split("T")[0],
          description: claim.description,
          claimId: claim.id,
        claimNumber: claim.claimNumber,
        claimType: claim.claimType,
        incidentDate: claim.incidentDate.toISOString().split("T")[0],
        documents: documents.filter((doc: string) => doc && doc.trim() !== ""),
        evidenceUrls: evidenceUrls.filter((url: string) => url && url.trim() !== ""),
        rejectionReason: claim.rejectionReason || null,
        approvedAmount: claim.approvedAmount ? `ZMW ${Number(claim.approvedAmount).toLocaleString()}` : null,
      }
      })

      return NextResponse.json(transformedClaims)
    } else {
      // Fetch products with stats
      const products = await prisma.insuranceProduct.findMany({
        where: {
          status: "active",
        },
        include: {
          policies: {
            where: {
              status: "active",
            },
            include: {
              claims: {
                select: {
                  id: true,
                  claimAmount: true,
                  approvedAmount: true,
                  status: true,
                },
              },
              payments: {
                where: {
                  status: "paid",
                },
                select: {
                  amount: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      // Icon mapping based on product type
      const iconMap: Record<string, string> = {
        crop: "Sprout",
        health: "Heart",
        loan_protection: "Skull",
        savings_fraud: "Users",
        mobile: "Smartphone",
        weather: "Cloud",
      }

      const transformedProducts = products.map((product) => {
        const activePolicies = product.policies.length
        const totalCoverage = product.policies.length > 0
          ? product.policies.reduce((sum, p) => sum + Number(p.coverageAmount), 0)
          : Number(product.coverageAmount) // Use product default if no policies
        const premiumCollected = product.policies.length > 0
          ? product.policies.reduce((sum, p) => {
              const paidPremiums = p.payments.reduce((premSum, prem) => premSum + Number(prem.amount), 0)
              return sum + paidPremiums
            }, 0)
          : 0 // No premiums collected if no policies
        const claims = product.policies.reduce((sum, p) => sum + p.claims.length, 0)
        const claimsPaid = product.policies.reduce((sum, p) => {
          const paidClaims = p.claims
            .filter((c) => c.status === "paid" || c.status === "approved")
            .reduce((claimSum, c) => claimSum + Number(c.approvedAmount || c.claimAmount), 0)
          return sum + paidClaims
        }, 0)

        // Map premium frequency for display
        const frequencyMap: Record<string, string> = {
          MONTHLY: "monthly",
          QUARTERLY: "quarterly",
          SEASONAL: "seasonal",
          ANNUAL: "annual",
        }

        // Extract waiting period from claimProcessingTime
        const waitingPeriodMatch = product.claimProcessingTime?.match(/(\d+)/)
        const waitingPeriod = waitingPeriodMatch ? waitingPeriodMatch[1] : "30"

        // Format coverage - show in millions if >= 1M, otherwise show full amount
        // Ensure we always have a value to display
        const coverageValue = totalCoverage > 0 ? totalCoverage : Number(product.coverageAmount || 0)
        const coverageDisplay = coverageValue >= 1000000
          ? `ZMW ${(coverageValue / 1000000).toFixed(1)}M`
          : `ZMW ${coverageValue.toLocaleString()}`

        // Format premium collected - always show formatted, even if 0
        const premiumDisplay = `ZMW ${premiumCollected.toLocaleString()}`

        return {
          id: product.id,
          name: product.name,
          type: product.productType,
          icon: iconMap[product.productType] || "Shield",
          activePolicies,
          totalCoverage: coverageDisplay,
          premiumCollected: premiumDisplay,
          claims,
          claimsPaid: `ZMW ${claimsPaid.toLocaleString()}`,
          status: product.status,
          description: product.description || "",
          // Raw values for editing
          coverageAmount: Number(product.coverageAmount),
          premiumAmount: Number(product.premiumAmount),
          premiumFrequency: frequencyMap[product.premiumFrequency] || product.premiumFrequency.toLowerCase(),
          waitingPeriod,
          coverageTerms: product.coverageTerms || "",
          exclusions: product.exclusions || "",
        }
      })

      return NextResponse.json(transformedProducts)
    }
  } catch (error) {
    console.error("[ADMIN_INSURANCE_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch insurance data" },
      { status: 500 }
    )
  }
}

