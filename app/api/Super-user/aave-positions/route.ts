import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's organization memberships from Clerk
    const clerkClientInstance = await clerkClient()
    const userOrganizations = await clerkClientInstance.users.getOrganizationMembershipList({
      userId: userId,
    })

    // Check if user has admin role in any organization
    const hasAdminRole = userOrganizations.data?.some((orgMembership) => {
      const role = orgMembership.role
      return role === "org:admin" || role === "admin" || role?.includes("admin")
    })

    if (!hasAdminRole) {
      console.error(`[AAVE Positions API] User ${userId} does not have admin role in any organization`)
      const roles = userOrganizations.data?.map((org) => org.role) || []
      return NextResponse.json(
        { 
          error: "Forbidden - Admin access required",
          message: "You need admin privileges in your organization to access AAVE positions.",
          userId: userId,
          organizationRoles: roles
        },
        { status: 403 }
      )
    }

    console.log(`[AAVE Positions API] Admin user ${userId} accessing positions`)

    // Fetch all groups with their AAVE positions
    const groups = await prisma.group.findMany({
      where: {
        status: "ACTIVE",
        aavePosition: {
          isNot: null,
        },
      },
      include: {
        aavePosition: {
          include: {
            supplies: true,
            borrows: true,
            transactions: {
              orderBy: { timestamp: "desc" },
              take: 5, // Get last 5 transactions
            },
          },
        },
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            memberships: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform data to match the expected format
    const positions = groups.map((group) => {
      const position = group.aavePosition!
      const supplies = position.supplies.map((s) => ({
        asset: s.assetSymbol,
        amount: Number(s.amount),
        apy: Number(s.apy),
        ltv: Number(s.ltv),
        balance: Number(s.balance),
        valueUSD: Number(s.valueUSD),
      }))

      const borrows = position.borrows.map((b) => ({
        asset: b.assetSymbol,
        amount: Number(b.amount),
        apy: Number(b.apy),
        balance: Number(b.balance),
        valueUSD: Number(b.valueUSD),
      }))

      const recentActivity = position.transactions.map((tx) => ({
        type: tx.type,
        asset: tx.assetSymbol,
        amount: Number(tx.amount),
        date: tx.timestamp.toISOString(),
        txHash: tx.txHash || "",
      }))

      return {
        id: position.id,
        groupId: group.id,
        groupName: group.name,
        spokeAddress: position.spokeAddress || "",
        healthFactor: Number(position.healthFactor),
        totalSupplied: Number(position.totalSupplied),
        totalBorrowed: Number(position.totalBorrowed),
        availableToBorrow: Number(position.availableToBorrow),
        netAPY: Number(position.netAPY),
        liquidationThreshold: Number(position.liquidationThreshold),
        loanToValue: Number(position.totalBorrowed) > 0 
          ? Number(position.totalBorrowed) / Number(position.totalSupplied)
          : 0,
        supplies,
        borrows,
        recentActivity,
        memberCount: group._count.memberships,
        owner: group.owner.name || group.owner.email,
      }
    })

    // Calculate stats
    const stats = {
      totalSupplied: positions.reduce((sum, p) => sum + p.totalSupplied, 0),
      totalBorrowed: positions.reduce((sum, p) => sum + p.totalBorrowed, 0),
      activePositions: positions.length,
      avgHealthFactor: positions.length > 0
        ? positions.reduce((sum, p) => sum + p.healthFactor, 0) / positions.length
        : 0,
      atRiskPositions: positions.filter((p) => p.healthFactor < 1.5).length,
      totalAvailableToBorrow: positions.reduce((sum, p) => sum + p.availableToBorrow, 0),
    }

    return NextResponse.json({
      positions,
      stats,
    })
  } catch (error) {
    console.error("Error fetching AAVE positions:", error)
    return NextResponse.json(
      { error: "Failed to fetch AAVE positions" },
      { status: 500 }
    )
  }
}

