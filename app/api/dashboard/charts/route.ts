import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// Default chart data for new users
const DEFAULT_CHART_DATA = {
    depositData: [
        { name: "Jan", amount: 0 },
        { name: "Feb", amount: 0 },
        { name: "Mar", amount: 0 },
        { name: "Apr", amount: 0 },
        { name: "May", amount: 0 },
        { name: "Jun", amount: 0 },
    ],
    membershipData: [
        { name: "No Groups Yet", value: 1 }
    ],
    activityData: [
        { date: "Week 1", deposits: 0, withdrawals: 0 },
        { date: "Week 2", deposits: 0, withdrawals: 0 },
        { date: "Week 3", deposits: 0, withdrawals: 0 },
        { date: "Week 4", deposits: 0, withdrawals: 0 },
        { date: "Week 5", deposits: 0, withdrawals: 0 },
    ]
}

export async function GET() {
    try {
        const { userId } = await auth()

        // Return default data for unauthenticated users
        if (!userId) {
            return NextResponse.json({
                success: true,
                data: DEFAULT_CHART_DATA
            })
        }

        // Get user from database (only active memberships)
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                memberships: {
                    where: {
                        status: 'ACTIVE' // Only include active memberships
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
                        status: 'COMPLETED' // Only completed transactions
                    },
                    orderBy: { createdAt: 'asc' }
                },
            }
        })

        // Return default data if user not found
        if (!user) {
            return NextResponse.json({
                success: true,
                data: DEFAULT_CHART_DATA
            })
        }

        // Generate deposit data for last 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const now = new Date()
        const depositData = []

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
            
            // Filter transactions to only include groups where user is a member
            const userGroupIds = user.memberships.map(m => m.groupId)

            const monthDeposits = user.transactions.filter(t => {
                const txDate = new Date(t.createdAt)
                return txDate >= monthDate &&
                       txDate <= monthEnd &&
                       t.status === 'COMPLETED' &&
                       t.type === 'DEPOSIT' &&
                       t.groupId &&
                       userGroupIds.includes(t.groupId)
            })

            const total = monthDeposits.reduce((sum, t) => sum + Number(t.amount), 0)
            
            depositData.push({
                name: months[monthDate.getMonth()],
                amount: total
            })
        }

        // Generate membership distribution data (only for groups user is member of)
        const membershipData = user.memberships
            .filter(m => m.status === 'ACTIVE' && m.group.status === 'ACTIVE')
            .map(membership => ({
                name: membership.group.name,
                value: membership.group.memberships.filter(mem => mem.status === 'ACTIVE').length
            }))

        // Generate activity data for last 5 weeks
        const activityData = []
        for (let i = 4; i >= 0; i--) {
            const weekStart = new Date()
            weekStart.setDate(weekStart.getDate() - (i * 7) - 6)
            const weekEnd = new Date()
            weekEnd.setDate(weekEnd.getDate() - (i * 7))

            // Filter transactions to only include groups where user is a member
            const userGroupIds = user.memberships.map(m => m.groupId)

            const weekDeposits = user.transactions.filter(t => {
                const date = new Date(t.createdAt)
                return date >= weekStart &&
                       date <= weekEnd &&
                       t.type === 'DEPOSIT' &&
                       t.groupId &&
                       userGroupIds.includes(t.groupId)
            }).length

            const weekWithdrawals = user.transactions.filter(t => {
                const date = new Date(t.createdAt)
                return date >= weekStart &&
                       date <= weekEnd &&
                       t.type === 'WITHDRAWAL' &&
                       t.groupId &&
                       userGroupIds.includes(t.groupId)
            }).length

            activityData.push({
                date: `${weekEnd.getDate()} ${months[weekEnd.getMonth()]}`,
                deposits: weekDeposits,
                withdrawals: weekWithdrawals
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                depositData: depositData.length > 0 ? depositData : DEFAULT_CHART_DATA.depositData,
                membershipData: membershipData.length > 0 ? membershipData : DEFAULT_CHART_DATA.membershipData,
                activityData: activityData.length > 0 ? activityData : DEFAULT_CHART_DATA.activityData
            }
        })
    } catch (error) {
        console.error("Dashboard charts error:", error)
        // Return default data on error
        return NextResponse.json({
            success: true,
            data: DEFAULT_CHART_DATA
        })
    }
}
