import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch all groups for admin
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const privacy = searchParams.get("privacy")
    const governance = searchParams.get("governance")
    const search = searchParams.get("search")

    // Build where clause
    const where: any = {}

    if (status && status !== "all") {
      where.status = status
    }

    if (privacy && privacy !== "all") {
      where.privacy = privacy
    }

    if (governance && governance !== "all") {
      where.governanceType = governance
    }

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
            avatar: true,
          },
        },
        memberships: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            role: true,
            status: true,
            balance: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        loanRequests: {
          select: {
            id: true,
            status: true,
          },
        },
        transactions: {
          select: {
            id: true,
            type: true,
            amount: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 3,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate stats and transform data
    const transformedGroups = await Promise.all(
      groups.map(async (group) => {
        const activeMembers = group.memberships.length
        const totalTransactions = await prisma.transaction.count({
          where: {
            groupId: group.id,
          },
        })

        const activeLoans = group.loanRequests.filter((lr) => 
          lr.status === "APPROVED" || lr.status === "DISBURSED" || lr.status === "REPAYING"
        ).length

        // Calculate total balance from transactions
        const balanceResult = await prisma.transaction.aggregate({
          where: {
            groupId: group.id,
            type: {
              in: ["CONTRIBUTION", "INTEREST", "LOAN_REPAYMENT"],
            },
          },
          _sum: {
            amount: true,
          },
        })

        const withdrawalResult = await prisma.transaction.aggregate({
          where: {
            groupId: group.id,
            type: {
              in: ["WITHDRAWAL", "LOAN_DISBURSEMENT"],
            },
          },
          _sum: {
            amount: true,
          },
        })

        const balance = Number(balanceResult._sum.amount || 0) - Number(withdrawalResult._sum.amount || 0)

        // Calculate contribution rate (percentage of members who contributed in last period)
        const recentContributions = await prisma.transaction.count({
          where: {
            groupId: group.id,
            type: "CONTRIBUTION",
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        })

        const contributionRate = activeMembers > 0 
          ? Math.round((recentContributions / activeMembers) * 100)
          : 0

        const averageBalance = activeMembers > 0 ? balance / activeMembers : 0

        // Get recent transactions
        const recentTransactions = group.transactions.map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: Number(tx.amount),
          user: tx.user?.name || "System",
          date: tx.createdAt.toISOString().split("T")[0],
        }))

        // Get members list
        const members_list = group.memberships.map((membership) => ({
          id: membership.id,
          name: membership.user?.name || "Unknown",
          role: membership.role,
          balance: Number(membership.balance || 0),
          status: membership.status,
          joinedAt: membership.joinedAt?.toISOString().split("T")[0] || "",
        }))

        // Get loan requests
        const loanRequestsData = await prisma.loanRequest.findMany({
          where: {
            groupId: group.id,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
            votes: {
              select: {
                vote: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        })

        const loanRequests = loanRequestsData.map((lr) => {
          const approveVotes = lr.votes.filter((v) => v.vote === true).length
          const totalVotes = lr.votes.length
          return {
            id: lr.id,
            user: lr.user?.name || "Unknown",
            amount: Number(lr.amount),
            purpose: lr.purpose,
            status: lr.status,
            votes: `${approveVotes}/${activeMembers}`,
          }
        })

        return {
          id: group.id,
          name: group.name,
          description: group.description || "",
          logo: group.logo || null,
          members: activeMembers,
          maxMembers: group.maxMembers || 0,
          balance: balance,
          depositGoal: Number(group.depositGoal || 0),
          status: group.status || "ACTIVE",
          privacy: group.privacy || "PRIVATE",
          governanceType: group.governanceType || "ADMIN",
          contributionAmount: Number(group.contributionAmount || 0),
          contributionFrequency: group.contributionFrequency || "MONTHLY",
          interestRate: Number(group.interestRate || 0),
          createdAt: group.createdAt.toISOString().split("T")[0],
          owner: {
            name: group.owner?.name || "Unknown",
            avatar: group.owner?.avatar || null,
          },
          stats: {
            totalTransactions,
            activeLoans,
            upcomingMeetings: 0, // Would need to fetch from meetings table
            contributionRate,
            averageBalance,
          },
          recentTransactions,
          members_list,
          loanRequests,
        }
      })
    )

    return NextResponse.json(transformedGroups)
  } catch (error) {
    console.error("[ADMIN_GROUPS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    )
  }
}

