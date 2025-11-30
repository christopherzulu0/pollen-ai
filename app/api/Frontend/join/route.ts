import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/Frontend/join
 * Join a PUBLIC group directly (no approval needed)
 * Request body: { groupId: string, inviteCode?: string }
 */
export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { groupId, inviteCode } = await req.json()

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
        owner: true,
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

    // Check if group is PUBLIC or INVITE_ONLY with valid code
    if (group.privacy === "PRIVATE") {
      return NextResponse.json(
        {
          error: "This is a private group. Please use the request endpoint instead.",
        },
        { status: 403 }
      )
    }

    // For INVITE_ONLY groups, validate invitation code
    if (group.privacy === "INVITE_ONLY") {
      if (!inviteCode) {
        return NextResponse.json(
          { error: "Invitation code is required for this group" },
          { status: 400 }
        )
      }

      // Verify invitation code
      const invitation = await prisma.groupInvitation.findFirst({
        where: {
          groupId: group.id,
          inviteeId: dbUser.id,
          code: inviteCode,
          status: "PENDING",
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      })

      if (!invitation) {
        return NextResponse.json(
          { error: "Invalid or expired invitation code" },
          { status: 403 }
        )
      }

      // Mark invitation as accepted
      await prisma.groupInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      })
    }

    // Check if user is already a member
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
          { error: "You have a pending request for this group" },
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
        // Reactivate inactive membership
        await prisma.membership.update({
          where: { id: existingMembership.id },
          data: {
            status: "ACTIVE",
            joinedAt: new Date(),
          },
        })

        return NextResponse.json({
          success: true,
          message: `Welcome back to ${group.name}!`,
          membership: {
            id: existingMembership.id,
            groupId: existingMembership.groupId,
            role: existingMembership.role,
            status: "ACTIVE",
            joinedAt: new Date(),
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

    // Create new membership with ACTIVE status
    const membership = await prisma.membership.create({
      data: {
        userId: dbUser.id,
        groupId: group.id,
        role: "MEMBER",
        status: "ACTIVE",
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
  } catch (error) {
    console.error("Error joining group:", error)
    return NextResponse.json(
      {
        error: "Failed to join group",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

