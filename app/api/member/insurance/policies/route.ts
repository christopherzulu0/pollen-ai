import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch user's insurance policies
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch user's active policies
    const policies = await prisma.insurancePolicy.findMany({
      where: {
        userId: user.id,
        status: "active",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            productType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform policies to match component's expected format
    const transformedPolicies = policies.map((policy) => ({
      id: policy.id,
      policyNumber: policy.policyNumber,
      productId: policy.productId,
      productName: policy.product.name,
      productType: policy.product.productType,
      coverageAmount: parseFloat(policy.coverageAmount.toString()),
      premiumAmount: parseFloat(policy.premiumAmount.toString()),
      premiumFrequency: policy.premiumFrequency,
      startDate: policy.startDate.toISOString(),
      endDate: policy.endDate.toISOString(),
      nextPremiumDue: policy.nextPremiumDue ? policy.nextPremiumDue.toISOString() : null,
      status: policy.status,
    }))

    return NextResponse.json({ policies: transformedPolicies })
  } catch (error) {
    console.error("[INSURANCE_POLICIES_GET_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch insurance policies",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

