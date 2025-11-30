import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic' // Disable caching for fresh data

export async function GET(request: Request) {
  try {
    // Get current user (optional - for checking membership status)
    const { userId: clerkUserId } = await auth()
    let currentUserId: string | null = null

    if (clerkUserId) {
      const dbUser = await prisma.user.findFirst({
        where: { clerkUserId },
        select: { id: true },
      })
      currentUserId = dbUser?.id || null
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const privacy = searchParams.get("privacy") || "all"
    const status = searchParams.get("status") || "all"

    // Build the where clause
    const where: any = {}

    // Privacy filter
    if (privacy && privacy !== "all") {
      where.privacy = privacy
    }

    // Status filter
    if (status && status !== "all") {
      where.status = status
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Fetch groups with related data
    const groups = await prisma.group.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        memberships: {
          select: {
            id: true,
            role: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            memberships: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },
      orderBy: [
        { status: "desc" }, // ACTIVE groups first
        { createdAt: "desc" }, // Newer groups first
      ],
    })

    // Transform the data to match the GroupWithDetails type
    const transformedGroups = groups.map((group) => {
      // Check if current user is a member of this group
      const userMembership = currentUserId
        ? group.memberships.find((m) => m.user.id === currentUserId)
        : null

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        logo: group.logo,
        privacy: group.privacy,
        status: group.status,
        contributionAmount: Number(group.contributionAmount),
        contributionFrequency: group.contributionFrequency,
        interestRate: Number(group.interestRate),
        maxMembers: group.maxMembers,
        memberCount: group._count.memberships,
        depositGoal: group.depositGoal ? Number(group.depositGoal) : null,
        groupRules: group.groupRules,
        bylaws: group.bylaws,
        adminName: group.owner.name,
        adminEmail: group.owner.email,
        adminPhone: null, // Not stored in the database
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        requireApproval: group.requireApproval,
        // User membership status
        userMembershipId: userMembership?.id || null,
        userMembershipRole: userMembership?.role || null,
        userMembershipStatus: userMembership?.status || null,
        isUserMember: userMembership?.status === "ACTIVE",
      }
    })

    return NextResponse.json(transformedGroups)
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json(
      { error: "Failed to fetch groups", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

