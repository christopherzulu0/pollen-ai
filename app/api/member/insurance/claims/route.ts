import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch user's insurance claims
export async function GET(req: Request) {
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

    // Fetch user's claims with policy details
    const claims = await prisma.insuranceClaim.findMany({
      where: {
        policy: {
          userId: user.id,
        },
      },
      include: {
        policy: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                productType: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform claims to match component's expected format
    const transformedClaims = claims.map((claim) => ({
      id: claim.id,
      claimNumber: claim.claimNumber,
      policyNumber: claim.policy.policyNumber,
      type: claim.policy.product.name,
      claimType: claim.claimType,
      claimAmount: parseFloat(claim.claimAmount.toString()),
      approvedAmount: claim.approvedAmount ? parseFloat(claim.approvedAmount.toString()) : null,
      status: claim.status,
      incidentDate: claim.incidentDate.toISOString(),
      submittedDate: claim.createdAt.toISOString(),
      resolvedDate: claim.approvedAt?.toISOString() || claim.reviewedAt?.toISOString() || null,
      description: claim.description,
      documents: claim.documents,
      evidenceUrls: claim.evidenceUrls,
      rejectionReason: claim.rejectionReason,
      priority: claim.priority,
    }))

    return NextResponse.json({ claims: transformedClaims })
  } catch (error) {
    console.error("[INSURANCE_CLAIMS_GET_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch insurance claims",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

// POST - Create a new insurance claim
export async function POST(req: Request) {
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

    const body = await req.json()
    const { policyId, claimType, claimAmount, incidentDate, description, documents, evidenceUrls } = body

    // Validate required fields
    if (!policyId || !claimType || !claimAmount || !incidentDate || !description) {
      return NextResponse.json(
        { error: "Missing required fields: policyId, claimType, claimAmount, incidentDate, description" },
        { status: 400 }
      )
    }

    // Verify policy belongs to user
    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: policyId,
        userId: user.id,
        status: "active",
      },
    })

    if (!policy) {
      return NextResponse.json(
        { error: "Policy not found or not active" },
        { status: 404 }
      )
    }

    // Generate unique claim number
    const latestClaim = await prisma.insuranceClaim.findFirst({
      orderBy: { createdAt: "desc" },
      select: { claimNumber: true },
    })

    let claimNumber = "CLM-2024-001"
    if (latestClaim?.claimNumber) {
      const match = latestClaim.claimNumber.match(/CLM-\d{4}-(\d+)/)
      if (match) {
        const number = parseInt(match[1]) + 1
        const year = new Date().getFullYear()
        claimNumber = `CLM-${year}-${number.toString().padStart(3, "0")}`
      }
    }

    // Create claim
    const claim = await prisma.insuranceClaim.create({
      data: {
        claimNumber,
        policyId: policy.id,
        claimType,
        claimAmount: parseFloat(claimAmount.toString()),
        incidentDate: new Date(incidentDate),
        description,
        documents: documents || [],
        evidenceUrls: evidenceUrls || [],
        status: "submitted",
        priority: "normal",
      },
      include: {
        policy: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                productType: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      claim: {
        id: claim.id,
        claimNumber: claim.claimNumber,
        policyNumber: claim.policy.policyNumber,
        type: claim.policy.product.name,
        claimType: claim.claimType,
        claimAmount: parseFloat(claim.claimAmount.toString()),
        status: claim.status,
        incidentDate: claim.incidentDate.toISOString(),
        submittedDate: claim.createdAt.toISOString(),
        description: claim.description,
      },
    })
  } catch (error) {
    console.error("[INSURANCE_CLAIMS_POST_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to create insurance claim",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

