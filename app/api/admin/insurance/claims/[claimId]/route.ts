import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// PATCH - Approve or reject an insurance claim
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ claimId: string }> }
) {
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

    const { claimId } = await params
    const body = await req.json()
    const { action, approvedAmount, rejectionReason, internalNotes } = body

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    // Find the claim
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id: claimId },
      include: {
        policy: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 })
    }

    // Update claim based on action
    const updateData: any = {
      reviewedBy: userId,
      reviewedAt: new Date(),
      internalNotes: internalNotes || claim.internalNotes || null,
    }

    if (action === "approve") {
      updateData.status = "approved"
      updateData.approvedBy = userId
      updateData.approvedAt = new Date()
      updateData.approvedAmount = approvedAmount
        ? parseFloat(approvedAmount.toString())
        : parseFloat(claim.claimAmount.toString())
      updateData.rejectionReason = null
    } else if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 }
        )
      }
      updateData.status = "rejected"
      updateData.rejectionReason = rejectionReason
    }

    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id: claimId },
      data: updateData,
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
    })

    console.log(`[CLAIM_${action.toUpperCase()}] Claim ${claim.claimNumber} ${action}d by ${userId}`)

    return NextResponse.json({
      success: true,
      message: `Claim ${action}d successfully`,
      claim: {
        id: updatedClaim.claimNumber,
        status: updatedClaim.status,
        approvedAmount: updatedClaim.approvedAmount?.toString(),
        rejectionReason: updatedClaim.rejectionReason,
      },
    })
  } catch (error) {
    console.error("[CLAIM_UPDATE_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to update claim",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

