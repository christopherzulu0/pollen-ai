import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all insurance policies for admin
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const clerkClientInstance = await clerkClient()
    const userOrganizations = await clerkClientInstance.users.getOrganizationMembershipList({
      userId: userId,
    })

    const hasAdminRole = userOrganizations.data?.some((orgMembership) => {
      const role = orgMembership.role
      return role === "org:admin" || role === "admin" || role?.includes("admin")
    })

    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const productId = searchParams.get("productId")
    const search = searchParams.get("search")

    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }
    if (productId) {
      where.productId = productId
    }
    if (search) {
      where.OR = [
        { policyNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    const policies = await prisma.insurancePolicy.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            productType: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const transformedPolicies = policies.map((policy) => ({
      id: policy.id,
      policyNumber: policy.policyNumber,
      productName: policy.product.name,
      productType: policy.product.productType,
      userName: policy.user.name || policy.user.email || "Unknown",
      userEmail: policy.user.email,
      groupName: policy.group?.name || null,
      coverageAmount: `ZMW ${Number(policy.coverageAmount).toLocaleString()}`,
      premiumAmount: `ZMW ${Number(policy.premiumAmount).toLocaleString()}`,
      premiumFrequency: policy.premiumFrequency,
      startDate: policy.startDate.toISOString().split("T")[0],
      endDate: policy.endDate.toISOString().split("T")[0],
      status: policy.status,
      paymentStatus: policy.paymentStatus,
      nextPremiumDue: policy.nextPremiumDue?.toISOString().split("T")[0] || null,
      createdAt: policy.createdAt.toISOString(),
    }))

    return NextResponse.json(transformedPolicies)
  } catch (error) {
    console.error("[ADMIN_POLICIES_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 }
    )
  }
}

// POST - Create a new insurance policy (admin)
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const clerkClientInstance = await clerkClient()
    const userOrganizations = await clerkClientInstance.users.getOrganizationMembershipList({
      userId: userId,
    })

    const hasAdminRole = userOrganizations.data?.some((orgMembership) => {
      const role = orgMembership.role
      return role === "org:admin" || role === "admin" || role?.includes("admin")
    })

    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { productId, userId: policyUserId, groupId, coverageAmount, startDate, notes } = body

    // Validate required fields
    if (!productId || !policyUserId || !coverageAmount || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields: productId, userId, coverageAmount, startDate" },
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

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: policyUserId },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          take: 1,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Use provided groupId or get user's active group
    const finalGroupId = groupId || (user.memberships && user.memberships.length > 0 ? user.memberships[0].groupId : null)

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
    const finalCoverageAmount = parseFloat(coverageAmount.toString())
    const premiumAmount = parseFloat(product.premiumAmount.toString())

    // Create insurance policy
    const policy = await prisma.insurancePolicy.create({
      data: {
        policyNumber,
        productId: product.id,
        userId: user.id,
        groupId: finalGroupId || undefined,
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
    })

    console.log(`[ADMIN_POLICY_CREATE] ✅ Created policy ${policyNumber} for user ${user.email}`)

    return NextResponse.json({
      success: true,
      message: "Insurance policy created successfully",
      policy: {
        id: policy.id,
        policyNumber: policy.policyNumber,
        productName: policy.product.name,
        userName: policy.user.name || policy.user.email,
      },
    })
  } catch (error) {
    console.error("[ADMIN_POLICY_CREATE_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to create insurance policy",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

