import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role in any organization
    const clerkClientInstance = await clerkClient()
    const userOrganizations = await clerkClientInstance.users.getOrganizationMembershipList({
      userId: userId,
    })

    const hasAdminRole = userOrganizations.data?.some((orgMembership) => {
      const role = orgMembership.role
      return role === "org:admin" || role === "admin" || role?.includes("admin")
    })

    if (!hasAdminRole) {
      console.error(`[Village Ledgers API] User ${userId} does not have admin role in any organization`)
      const roles = userOrganizations.data?.map((org) => org.role) || []
      return NextResponse.json(
        {
          error: "Forbidden - Admin access required",
          message: "You need admin privileges in your organization to access village ledgers.",
          userId: userId,
          organizationRoles: roles,
        },
        { status: 403 }
      )
    }

    console.log(`[Village Ledgers API] Admin user ${userId} accessing village ledgers`)

    // Fetch all groups with their financial data
    const groups = await prisma.group.findMany({
      include: {
        memberships: {
          where: {
            status: "ACTIVE",
          },
        },
        contributions: {
          where: {
            status: "COMPLETED",
          },
        },
        loanRequests: true,
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Just to get the latest transaction date
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate ledger data for each group
    const villageLedgers = await Promise.all(
      groups.map(async (group) => {
        // Calculate contributions (from Contribution model)
        const contributions = group.contributions.reduce(
          (sum, contrib) => sum + parseFloat(contrib.amount.toString()),
          0
        )

        // Calculate loans issued (from LoanRequest with APPROVED/DISBURSED status)
        const loansIssued = group.loanRequests
          .filter((loan) => loan.status === "APPROVED" || loan.status === "DISBURSED")
          .reduce((sum, loan) => sum + parseFloat(loan.amount.toString()), 0)

        // Calculate repayments from transactions
        const repaymentsResult = await prisma.transaction.aggregate({
          where: {
            groupId: group.id,
            type: "LOAN_REPAYMENT",
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        })
        const repayments = parseFloat(repaymentsResult._sum.amount?.toString() || "0")

        // Calculate penalties from transactions (FEE or PENALTY types)
        const penaltiesResult = await prisma.transaction.aggregate({
          where: {
            groupId: group.id,
            type: {
              in: ["FEE", "PENALTY"],
            },
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        })
        const penalties = parseFloat(penaltiesResult._sum.amount?.toString() || "0")

        // Get active and total member counts
        const activeMemberCount = group.memberships.length
        const totalMemberCount = await prisma.membership.count({
          where: {
            groupId: group.id,
          },
        })

        // Get last activity date
        const lastActivityAt = group.transactions[0]?.createdAt || null

        // Calculate balance: contributions + repayments - loansIssued - penalties
        const balance = contributions + repayments - loansIssued - penalties

        return {
          groupId: group.id,
          groupName: group.name,
          contributions,
          loansIssued,
          repayments,
          penalties,
          balance,
          activeMemberCount,
          totalMemberCount,
          status: group.status || "ACTIVE",
          lastActivityAt: lastActivityAt?.toISOString() || null,
        }
      })
    )

    // Calculate totals
    const totals = {
      totalContributions: villageLedgers.reduce((sum, ledger) => sum + ledger.contributions, 0),
      totalLoansIssued: villageLedgers.reduce((sum, ledger) => sum + ledger.loansIssued, 0),
      totalRepayments: villageLedgers.reduce((sum, ledger) => sum + ledger.repayments, 0),
      totalPenalties: villageLedgers.reduce((sum, ledger) => sum + ledger.penalties, 0),
      totalBalance: villageLedgers.reduce((sum, ledger) => sum + ledger.balance, 0),
    }

    return NextResponse.json({
      ledgers: villageLedgers,
      totals,
    })
  } catch (error) {
    console.error("[VILLAGE_LEDGERS_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch village ledgers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

