import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

// Default activities for new users
const getDefaultActivities = () => ({
    upcomingEvents: [
        {
            id: "welcome-event",
            title: "Welcome to Pollen!",
            date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            time: "—",
            group: "Getting Started",
        }
    ],
    recentActivities: [
        {
            id: "welcome-activity",
            type: "info",
            date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            group: "Pollen",
            user: "Welcome! Start by joining a group.",
        }
    ]
})

export async function GET() {
    try {
        const { userId } = await auth()

        // Return default activities for unauthenticated users
        if (!userId) {
            return NextResponse.json({
                success: true,
                data: getDefaultActivities()
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
                            where: {
                                status: 'ACTIVE' // Only active groups
                            }
                        }
                    }
                }
            }
        })

        // Return default activities if user not found
        if (!user) {
            return NextResponse.json({
                success: true,
                data: getDefaultActivities()
            })
        }

        // Only get group IDs from active memberships
        const groupIds = user.memberships.map(m => m.groupId)

        // Get upcoming meetings from scheduled meetings (only for user's groups)
        const upcomingMeetings = groupIds.length > 0
            ? await prisma.meetingRequest.findMany({
                where: {
                    status: { in: ['pending', 'confirmed'] },
                    meetingDate: { gte: new Date() },
                    // Note: meetingRequest doesn't have groupId, so we'll show all for now
                    // In production, you might want to add groupId to MeetingRequest model
                },
                orderBy: { meetingDate: 'asc' },
                take: 5
            })
            : []

        const upcomingEvents = upcomingMeetings.map(meeting => ({
            id: meeting.id,
            title: meeting.purpose || "Scheduled Meeting",
            date: meeting.meetingDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            time: meeting.meetingTime,
            group: "Pollen Support",
        }))

        // Get recent transactions for user's groups (only where user is a member)
        const recentTransactions = groupIds.length > 0
            ? await prisma.transaction.findMany({
                where: {
                    groupId: { in: groupIds },
                    group: {
                        memberships: {
                            some: {
                                userId: user.id,
                                status: 'ACTIVE'
                            }
                        }
                    }
                },
                include: {
                    user: true,
                    group: true
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
            : []

        // Get recent member joins (only for groups user is member of)
        const recentMemberJoins = groupIds.length > 0
            ? await prisma.membership.findMany({
                where: {
                    groupId: { in: groupIds },
                    joinedAt: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                    },
                    // Ensure the group has the requesting user as an active member
                    group: {
                        memberships: {
                            some: {
                                userId: user.id,
                                status: 'ACTIVE'
                            }
                        }
                    }
                },
                include: {
                    user: true,
                    group: true
                },
                orderBy: { joinedAt: 'desc' },
                take: 5
            })
            : []

        // Combine and sort activities
        const activities: {
            id: string
            type: 'deposit' | 'withdrawal' | 'member_joined' | 'info'
            amount?: number
            date: string
            group: string
            user: string
            timestamp: Date
        }[] = []

        recentTransactions.forEach(tx => {
            activities.push({
                id: tx.id,
                type: tx.type === 'DEPOSIT' ? 'deposit' : 'withdrawal',
                amount: Number(tx.amount),
                date: tx.createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                group: tx.group?.name || 'Personal',
                user: tx.user.name || tx.user.email,
                timestamp: tx.createdAt
            })
        })

        recentMemberJoins.forEach(member => {
            activities.push({
                id: member.id,
                type: 'member_joined',
                date: member.joinedAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                group: member.group.name,
                user: member.user.name || member.user.email,
                timestamp: member.joinedAt
            })
        })

        // Sort by timestamp and take top 10
        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        const recentActivities = activities.slice(0, 10).map(({ timestamp, ...activity }) => activity)

        return NextResponse.json({
            success: true,
            data: {
                upcomingEvents: upcomingEvents.length > 0 ? upcomingEvents : getDefaultActivities().upcomingEvents,
                recentActivities: recentActivities.length > 0 ? recentActivities : getDefaultActivities().recentActivities
            }
        })
    } catch (error) {
        console.error("Dashboard activities error:", error)
        // Return default activities on error
        return NextResponse.json({
            success: true,
            data: getDefaultActivities()
        })
    }
}
