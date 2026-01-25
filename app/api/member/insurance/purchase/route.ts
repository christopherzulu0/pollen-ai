import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// POST - Purchase/Create an insurance policy
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          take: 1,
        },
        wallet: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { productId, startDate, coverageAmount, notes } = body

    // Validate required fields
    if (!productId || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields: productId and startDate" },
        { status: 400 }
      )
    }

    // Fetch product details
    const product = await prisma.insuranceProduct.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Insurance product not found" }, { status: 404 })
    }

    if (product.status !== "active") {
      return NextResponse.json({ error: "Product is not available for purchase" }, { status: 400 })
    }

    // Calculate end date based on premium frequency
    const start = new Date(startDate)
    const end = new Date(start)
    
    switch (product.premiumFrequency.toLowerCase()) {
      case "monthly":
        end.setMonth(end.getMonth() + 12) // 1 year for monthly
        break
      case "seasonal":
        end.setMonth(end.getMonth() + 6) // 6 months for seasonal
        break
      case "annual":
        end.setFullYear(end.getFullYear() + 1)
        break
      default:
        end.setFullYear(end.getFullYear() + 1) // Default to 1 year
    }

    // Calculate next premium due date
    const nextPremiumDue = new Date(start)
    switch (product.premiumFrequency.toLowerCase()) {
      case "monthly":
        nextPremiumDue.setMonth(nextPremiumDue.getMonth() + 1)
        break
      case "seasonal":
        nextPremiumDue.setMonth(nextPremiumDue.getMonth() + 6)
        break
      case "annual":
        nextPremiumDue.setFullYear(nextPremiumDue.getFullYear() + 1)
        break
      default:
        nextPremiumDue.setMonth(nextPremiumDue.getMonth() + 1)
    }

    // Generate unique policy number
    const latestPolicy = await prisma.insurancePolicy.findFirst({
      orderBy: { createdAt: "desc" },
      select: { policyNumber: true },
    })

    let policyNumber = "POL-2024-001"
    if (latestPolicy?.policyNumber) {
      const match = latestPolicy.policyNumber.match(/POL-\d{4}-(\d+)/)
      if (match) {
        const number = parseInt(match[1]) + 1
        const year = new Date().getFullYear()
        policyNumber = `POL-${year}-${number.toString().padStart(3, "0")}`
      }
    }

    // Use provided coverage amount or product default
    const finalCoverageAmount = coverageAmount ? parseFloat(coverageAmount.toString()) : parseFloat(product.coverageAmount.toString())
    const premiumAmount = parseFloat(product.premiumAmount.toString())

    // Get user's group ID if available
    const userGroupId = user.memberships && user.memberships.length > 0 ? user.memberships[0].groupId : null

    // Create insurance policy
    const policy = await prisma.insurancePolicy.create({
      data: {
        policyNumber,
        productId: product.id,
        userId: user.id,
        groupId: userGroupId || undefined,
        coverageAmount: finalCoverageAmount,
        premiumAmount: premiumAmount,
        premiumFrequency: product.premiumFrequency,
        startDate: start,
        endDate: end,
        renewalDate: end,
        nextPremiumDue: nextPremiumDue,
        status: "active",
        paymentStatus: "pending",
        notes: notes || null,
        beneficiaries: [],
        documents: [],
      },
    })

    // Generate ledger entry ID
    let entryId = "L001"
    try {
      const latestEntry = await prisma.ledgerEntry.findFirst({
        orderBy: { createdAt: "desc" },
        select: { entryId: true },
      })

      if (latestEntry?.entryId) {
        const match = latestEntry.entryId.match(/L(\d+)/)
        if (match) {
          const entryNumber = parseInt(match[1]) + 1
          entryId = `L${entryNumber.toString().padStart(3, "0")}`
        }
      }
    } catch (entryIdError) {
      console.error("[INSURANCE_PURCHASE] Error generating entry ID:", entryIdError)
      entryId = `L${Date.now().toString().slice(-6)}`
    }

    // Create ledger entry for premium payment
    const ledgerEntry = await prisma.ledgerEntry.create({
      data: {
        entryId,
        type: "CONTRIBUTION", // Using CONTRIBUTION for insurance premium
        amount: premiumAmount,
        asset: "ZMK",
        currency: "ZMK",
        userId: user.id,
        groupId: userGroupId || undefined,
        description: `Insurance premium payment for policy ${policyNumber} - ${product.name}`,
        reference: policy.id,
        txHash: null,
        blockNumber: null,
        gasUsed: null,
        walletAddress: user.wallet?.celoAddress || undefined,
        networkId: user.wallet?.network || undefined,
        status: "PENDING",
        confirmations: 0,
        confirmedAt: null,
        createdBy: userId,
      },
    })

    console.log(`[INSURANCE_PURCHASE] ✅ Created policy ${policyNumber} and ledger entry ${entryId}`)

    return NextResponse.json({
      success: true,
      message: "Insurance policy purchased successfully",
      policy: {
        id: policy.id,
        policyNumber: policy.policyNumber,
        productName: product.name,
        coverageAmount: policy.coverageAmount.toString(),
        premiumAmount: policy.premiumAmount.toString(),
        startDate: policy.startDate.toISOString(),
        endDate: policy.endDate.toISOString(),
        status: policy.status,
      },
      ledgerEntry: {
        id: ledgerEntry.id,
        entryId: ledgerEntry.entryId,
        amount: ledgerEntry.amount.toString(),
      },
    })
  } catch (error) {
    console.error("[INSURANCE_PURCHASE_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to purchase insurance policy",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

