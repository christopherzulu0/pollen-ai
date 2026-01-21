import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch a single insurance product by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await params

    const product = await prisma.insuranceProduct.findUnique({
      where: { id: productId },
      include: {
        policies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            claims: {
              select: {
                id: true,
                claimNumber: true,
                claimAmount: true,
                approvedAmount: true,
                status: true,
                claimDate: true,
                description: true,
              },
              orderBy: {
                claimDate: "desc",
              },
            },
            payments: {
              select: {
                id: true,
                amount: true,
                status: true,
                dueDate: true,
                paidDate: true,
                createdAt: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Icon mapping based on product type
    const iconMap: Record<string, string> = {
      crop: "Sprout",
      health: "Heart",
      loan_protection: "Skull",
      savings_fraud: "Users",
      mobile: "Smartphone",
      weather: "Cloud",
    }

    const activePolicies = product.policies.filter((p) => p.status === "active").length
    const totalCoverage = product.policies.reduce((sum, p) => sum + Number(p.coverageAmount), 0)
    const premiumCollected = product.policies.reduce((sum, p) => {
      const paidPremiums = p.payments
        .filter((pay) => pay.status === "paid")
        .reduce((premSum, prem) => premSum + Number(prem.amount), 0)
      return sum + paidPremiums
    }, 0)
    const claims = product.policies.reduce((sum, p) => sum + p.claims.length, 0)
    const claimsPaid = product.policies.reduce((sum, p) => {
      const paidClaims = p.claims
        .filter((c) => c.status === "paid" || c.status === "approved")
        .reduce((claimSum, c) => claimSum + Number(c.approvedAmount || c.claimAmount), 0)
      return sum + paidClaims
    }, 0)

    // Get policy holders
    const policyHolders = product.policies.map((policy) => ({
      id: policy.policyNumber,
      name: policy.user?.name || "Unknown",
      dateJoined: policy.createdAt.toISOString().split("T")[0],
      premium: `ZMW ${Number(policy.premiumAmount).toLocaleString()}`,
      coverage: `ZMW ${Number(policy.coverageAmount).toLocaleString()}`,
      status: policy.status,
    }))

    // Get recent activity (last 10 items)
    const recentActivities: any[] = []
    
    // Add recent policies
    product.policies.slice(0, 5).forEach((policy) => {
      recentActivities.push({
        type: "policy_issued",
        icon: "CheckCircle",
        color: "green",
        title: "New policy issued",
        description: `${policy.user?.name || "Unknown"} enrolled in ${product.name}`,
        date: policy.createdAt,
      })
    })

    // Add recent premium payments
    product.policies.forEach((policy) => {
      policy.payments
        .filter((pay) => pay.status === "paid")
        .slice(0, 3)
        .forEach((payment) => {
          recentActivities.push({
            type: "premium_collected",
            icon: "DollarSign",
            color: "blue",
            title: "Premium collected",
            description: `ZMW ${Number(payment.amount).toLocaleString()} from ${policy.user?.name || "Unknown"}`,
            date: payment.paidDate || payment.createdAt,
          })
        })
    })

    // Add recent claims
    product.policies.forEach((policy) => {
      policy.claims.slice(0, 3).forEach((claim) => {
        recentActivities.push({
          type: claim.status === "approved" || claim.status === "paid" ? "claim_approved" : "claim_submitted",
          icon: claim.status === "approved" || claim.status === "paid" ? "CheckCircle" : "FileText",
          color: claim.status === "approved" || claim.status === "paid" ? "green" : "yellow",
          title: claim.status === "approved" || claim.status === "paid" ? "Claim approved" : "Claim submitted",
          description:
            claim.status === "approved" || claim.status === "paid"
              ? `ZMW ${Number(claim.approvedAmount || claim.claimAmount).toLocaleString()} payout to ${policy.user?.name || "Unknown"}`
              : `${policy.user?.name || "Unknown"} filed: ${claim.description?.substring(0, 50) || "N/A"}`,
          date: claim.claimDate,
        })
      })
    })

    // Sort by date and take most recent 10
    recentActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const recentActivity = recentActivities.slice(0, 10).map((activity) => ({
      ...activity,
      date: new Date(activity.date).toISOString(),
    }))

    // Calculate policy growth over last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const monthlyPolicies: Record<string, number> = {}
    product.policies.forEach((policy) => {
      const month = new Date(policy.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      monthlyPolicies[month] = (monthlyPolicies[month] || 0) + 1
    })

    const policyGrowthData = Object.entries(monthlyPolicies)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-6)
      .map(([month, count]) => ({
        month: month.split(" ")[0], // Just the month abbreviation
        policies: count,
      }))

    // Calculate claims activity over last 6 months
    const monthlyClaims: Record<string, { claims: number; paid: number }> = {}
    product.policies.forEach((policy) => {
      policy.claims.forEach((claim) => {
        const month = new Date(claim.claimDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        if (!monthlyClaims[month]) {
          monthlyClaims[month] = { claims: 0, paid: 0 }
        }
        monthlyClaims[month].claims++
        if (claim.status === "paid" || claim.status === "approved") {
          monthlyClaims[month].paid++
        }
      })
    })

    const claimsData = Object.entries(monthlyClaims)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-6)
      .map(([month, data]) => ({
        month: month.split(" ")[0],
        claims: data.claims,
        paid: data.paid,
      }))

    // Map premium frequency back to lowercase for form
    const frequencyMap: Record<string, string> = {
      MONTHLY: "monthly",
      QUARTERLY: "quarterly",
      SEASONAL: "seasonal",
      ANNUAL: "annual",
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      type: product.productType,
      icon: iconMap[product.productType] || "Shield",
      activePolicies,
      totalCoverage: `ZMW ${(totalCoverage / 1000000).toFixed(1)}M`,
      premiumCollected: `ZMW ${premiumCollected.toLocaleString()}`,
      claims,
      claimsPaid: `ZMW ${claimsPaid.toLocaleString()}`,
      status: product.status,
      description: product.description,
      premiumAmount: Number(product.premiumAmount),
      coverageAmount: Number(product.coverageAmount),
      frequency: frequencyMap[product.premiumFrequency] || product.premiumFrequency.toLowerCase(),
      waitingPeriod: product.claimProcessingTime ? parseInt(product.claimProcessingTime.replace(/\D/g, "")) || 0 : 0,
      coverageTerms: product.coverageTerms || "",
      exclusions: product.exclusions || "",
      createdAt: product.createdAt.toISOString().split("T")[0],
      policyHolders,
      recentActivity,
      policyGrowthData,
      claimsData,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("[ADMIN_INSURANCE_PRODUCT_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch insurance product" },
      { status: 500 }
    )
  }
}

// PATCH endpoint to update an insurance product
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await params
    const data = await req.json()

    // Map premium frequency
    const frequencyMap: Record<string, string> = {
      monthly: "MONTHLY",
      quarterly: "QUARTERLY",
      seasonal: "SEASONAL",
      annual: "ANNUAL",
    }

    const updateData: any = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.premiumAmount !== undefined) updateData.premiumAmount = parseFloat(data.premiumAmount)
    if (data.coverageAmount !== undefined) updateData.coverageAmount = parseFloat(data.coverageAmount)
    if (data.premiumFrequency !== undefined) {
      updateData.premiumFrequency = frequencyMap[data.premiumFrequency.toLowerCase()] || "MONTHLY"
    }
    if (data.status !== undefined) updateData.status = data.status
    if (data.waitingPeriod !== undefined) {
      updateData.claimProcessingTime = `${data.waitingPeriod} days`
    }
    if (data.coverageTerms !== undefined) updateData.coverageTerms = data.coverageTerms || null
    if (data.exclusions !== undefined) updateData.exclusions = data.exclusions || null

    const updatedProduct = await prisma.insuranceProduct.update({
      where: { id: productId },
      data: updateData,
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("[ADMIN_INSURANCE_PRODUCT_PATCH_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to update insurance product" },
      { status: 500 }
    )
  }
}

