import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// Default stats for new users or when data can't be fetched
const DEFAULT_STATS = {
    totalSavings: 0,
    savingsChange: 0,
    activeGroups: 0,
    newGroupsThisMonth: 0,
    upcomingPayments: 0,
    paymentsDueThisWeek: 0,
    totalMembers: 0,
    newMembersThisMonth: 0,
}

export async function GET() {
    try {
        const { userId } = await auth()

        // Return default stats for unauthenticated users
        if (!userId) {
            return NextResponse.json({
                success: true,
                data: DEFAULT_STATS
            })
        }

        // Get user from database (only active memberships)
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                memberships: {
                    where: {
                        status: 'ACTIVE', // Only include active memberships
                        group: {
                            status: 'ACTIVE' // Only active groups
                        }
                    },
                    include: {
                        group: {
                            include: {
                                memberships: {
                                    where: {
                                        status: 'ACTIVE' // Only count active members
                                    }
                                }
                            }
                        }
                    }
                },
                transactions: {
                    where: {
                        status: 'COMPLETED',
                        type: 'DEPOSIT',
                        groupId: { not: null } // Only group transactions
                    }
                },
                contributions: {
                    where: {
                        status: 'COMPLETED',
                        group: {
                            status: 'ACTIVE'
                        }
                    },
                    include: {
                        group: true
                    }
                }
            }
        })

        // Return default stats if user not found in DB yet
        if (!user) {
            return NextResponse.json({
                success: true,
                data: DEFAULT_STATS
            })
        }

        // Filter transactions to only include groups where user is a member
        const userGroupIds = user.memberships.map(m => m.groupId)

        const filteredTransactions = user.transactions.filter(t =>
            t.groupId && userGroupIds.includes(t.groupId)
        )

        const filteredContributions = user.contributions.filter(c =>
            userGroupIds.includes(c.groupId)
        )

        // Calculate total savings from transactions (deposits)
        const depositTotal = filteredTransactions
            .filter(t => t.type === 'DEPOSIT')
            .reduce((sum, t) => sum + Number(t.amount), 0)

        // Add contributions
        const contributionTotal = filteredContributions.reduce((sum, c) => sum + Number(c.amount), 0)

        const totalSavings = depositTotal + contributionTotal

        // Get previous month savings for comparison
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)

        const lastMonthDeposits = filteredTransactions.filter(t =>
            t.createdAt < lastMonth && t.type === 'DEPOSIT' && t.status === 'COMPLETED'
        )
        const lastMonthTotal = lastMonthDeposits.reduce((sum, t) => sum + Number(t.amount), 0)

        const savingsChange = lastMonthTotal > 0
            ? ((totalSavings - lastMonthTotal) / lastMonthTotal) * 100
            : 0

        // Count active groups
        const activeGroups = user.memberships.filter(
            m => m.group.status === 'ACTIVE' && m.status === 'ACTIVE'
        ).length

        // Count new groups this month
        const thisMonth = new Date()
        thisMonth.setDate(1)
        thisMonth.setHours(0, 0, 0, 0)

        const newGroupsThisMonth = user.memberships.filter(
            m => m.joinedAt >= thisMonth
        ).length

        // Get upcoming payments (pending transactions for user's groups)
        const upcomingPayments = await prisma.transaction.count({
            where: {
                userId: user.id,
                groupId: { in: userGroupIds.length > 0 ? userGroupIds : ['none'] },
                status: 'PENDING',
            }
        })

        // Count total members across all user's groups
        const totalMembers = new Set(
            user.memberships.flatMap(m => m.group.memberships.map(member => member.userId))
        ).size

        // New members this month
        const newMembersThisMonth = user.memberships.reduce((count, membership) => {
            return count + membership.group.memberships.filter(
                m => m.joinedAt >= thisMonth
            ).length
        }, 0)

        return NextResponse.json({
            success: true,
            data: {
                totalSavings,
                savingsChange: Math.round(savingsChange * 10) / 10,
                activeGroups,
                newGroupsThisMonth,
                upcomingPayments,
                paymentsDueThisWeek: Math.min(upcomingPayments, 1),
                totalMembers,
                newMembersThisMonth,
            }
        })
    } catch (error) {
        console.error("Dashboard stats error:", error)
        // Return default stats on error
        return NextResponse.json({
            success: true,
            data: DEFAULT_STATS
        })
    }
}
