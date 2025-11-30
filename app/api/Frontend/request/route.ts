import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/Frontend/request
 * Request to join a PRIVATE group (requires admin approval)
 * Request body: { groupId: string, message?: string }
 */
export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { groupId, message } = await req.json()

    if (!groupId) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 })
    }

    // Get or create the user in our database
    const clerkUser = await currentUser()
    let dbUser = await prisma.user.findFirst({
      where: { clerkUserId },
    })

    if (!dbUser) {
      // Create a new user in our database
      dbUser = await prisma.user.create({
        data: {
          clerkUserId,
          name:
            clerkUser?.firstName && clerkUser?.lastName
              ? `${clerkUser.firstName} ${clerkUser.lastName}`
              : clerkUser?.username || "User" + Date.now(),
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${clerkUserId}@example.com`,
          avatar: clerkUser?.imageUrl || null,
        },
      })
    }

    // Find the group
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        memberships: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    // Check if group is PRIVATE
    if (group.privacy === "PUBLIC") {
      return NextResponse.json(
        {
          error: "This is a public group. Please use the join endpoint instead.",
        },
        { status: 400 }
      )
    }

    if (group.privacy === "INVITE_ONLY") {
      return NextResponse.json(
        {
          error: "This group requires an invitation code. Please use the join endpoint with a valid code.",
        },
        { status: 403 }
      )
    }

    // Check if user is already a member or has pending request
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: dbUser.id,
        groupId: group.id,
      },
    })

    if (existingMembership) {
      if (existingMembership.status === "ACTIVE") {
        return NextResponse.json(
          { error: "You are already a member of this group" },
          { status: 400 }
        )
      }
      if (existingMembership.status === "PENDING") {
        return NextResponse.json(
          { error: "You already have a pending request for this group" },
          { status: 400 }
        )
      }
      if (existingMembership.status === "SUSPENDED") {
        return NextResponse.json(
          { error: "Your membership in this group has been suspended" },
          { status: 403 }
        )
      }
      if (existingMembership.status === "INACTIVE") {
        // Allow reapplication after becoming inactive
        await prisma.membership.update({
          where: { id: existingMembership.id },
          data: {
            status: "PENDING",
            joinedAt: new Date(),
          },
        })

        return NextResponse.json({
          success: true,
          message: "Your request has been resubmitted to the group admin for review",
          membership: {
            id: existingMembership.id,
            groupId: existingMembership.groupId,
            status: "PENDING",
            groupName: group.name,
          },
        })
      }
    }

    // Check if group is at capacity
    if (group.maxMembers && group.memberships.length >= group.maxMembers) {
      return NextResponse.json(
        { error: "This group is at full capacity" },
        { status: 400 }
      )
    }

    // Check if late joining is allowed
    if (!group.allowLateJoining) {
      const groupAge = Date.now() - new Date(group.createdAt).getTime()
      const gracePeriodMs = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      if (groupAge > gracePeriodMs) {
        return NextResponse.json(
          { error: "This group no longer allows late joining" },
          { status: 403 }
        )
      }
    }

    // Check if approval is required (should be true for PRIVATE groups)
    if (!group.requireApproval) {
      // Edge case: PRIVATE group with no approval required
      // Create active membership directly
      const membership = await prisma.membership.create({
        data: {
          userId: dbUser.id,
          groupId: group.id,
          role: "MEMBER",
          status: "PENDING",
          balance: 0,
          totalContributed: 0,
        },
        include: {
          group: {
            select: {
              name: true,
            },
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: `Successfully joined ${group.name}!`,
        membership: {
          id: membership.id,
          groupId: membership.groupId,
          role: membership.role,
          status: membership.status,
          joinedAt: membership.joinedAt,
          groupName: membership.group.name,
        },
      })
    }

    // Create pending membership (requires approval)
    const membership = await prisma.membership.create({
      data: {
        userId: dbUser.id,
        groupId: group.id,
        role: "MEMBER",
        status: "PENDING",
        balance: 0,
        totalContributed: 0,
      },
      include: {
        group: {
          select: {
            name: true,
            privacy: true,
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

    // TODO: Send notification to group admin about the new request
    // This would typically integrate with your notification system (e.g., Knock Labs)
    console.log(`📩 New membership request for group "${group.name}"`)
    console.log(`   Requester: ${dbUser.name} (${dbUser.email})`)
    console.log(`   Admin: ${group.owner.name} (${group.owner.email})`)
    if (message) {
      console.log(`   Message: ${message}`)
    }

    return NextResponse.json({
      success: true,
      message: `Your request to join ${group.name} has been sent to the group admin for review`,
      membership: {
        id: membership.id,
        groupId: membership.groupId,
        role: membership.role,
        status: membership.status,
        joinedAt: membership.joinedAt,
        groupName: membership.group.name,
        adminName: group.owner.name,
        adminEmail: group.owner.email,
      },
    })
  } catch (error) {
    console.error("Error requesting to join group:", error)
    return NextResponse.json(
      {
        error: "Failed to submit request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/Frontend/request
 * Get all pending membership requests for the authenticated user
 * (Groups they've requested to join that are awaiting approval)
 */
export async function GET(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user in database
    const dbUser = await prisma.user.findFirst({
      where: { clerkUserId },
    })

    if (!dbUser) {
      return NextResponse.json({ pendingRequests: [] })
    }

    // Get all pending membership requests
    const pendingRequests = await prisma.membership.findMany({
      where: {
        userId: dbUser.id,
        status: "PENDING",
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            privacy: true,
            status: true,
            contributionAmount: true,
            contributionFrequency: true,
            owner: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      count: pendingRequests.length,
      pendingRequests: pendingRequests.map((request) => ({
        membershipId: request.id,
        groupId: request.groupId,
        groupName: request.group.name,
        groupDescription: request.group.description,
        groupLogo: request.group.logo,
        privacy: request.group.privacy,
        contributionAmount: request.group.contributionAmount,
        contributionFrequency: request.group.contributionFrequency,
        adminName: request.group.owner.name,
        requestedAt: request.joinedAt,
        status: request.status,
      })),
    })
  } catch (error) {
    console.error("Error fetching pending requests:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch pending requests",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

