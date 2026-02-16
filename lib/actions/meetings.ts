"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getMeetings(filters?: {
    groupId?: string
    status?: string
}) {
    try {
        const { userId: clerkUserId } = await auth()

        if (!clerkUserId) {
            return []
        }

        // Get database user
        const user = await prisma.user.findUnique({
            where: { clerkUserId }
        })

        if (!user) {
            return []
        }

        // Build where clause
        const where: any = {}

        // Filter by group if specified
        if (filters?.groupId && filters.groupId !== "all") {
            where.groupId = filters.groupId
        }

        // Get meetings where user is a member of the group
        const meetings = await (prisma.meeting as any).findMany({
            where: {
                ...where,
                group: {
                    memberships: {
                        some: {
                            userId: user.id,
                            status: "ACTIVE"
                        }
                    }
                }
            },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true,
                        _count: {
                            select: {
                                memberships: true
                            }
                        }
                    }
                },
                attendees: {
                    include: {
                        membership: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                chairperson: {
                    include: {
                        user: true
                    }
                },
                noteTaker: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                date: "asc"
            }
        })

        // Transform to match the expected format
        return (meetings as any[]).map((meeting) => {
            const userAttendee = (meeting.attendees as any[]).find(
                (a: any) => a.membership.userId === user.id
            )

            // Determine status based on date
            const meetingDate = new Date(meeting.date)
            const now = new Date()
            const status = meetingDate > now ? "upcoming" : "completed"

            const isChairperson = meeting.chairperson?.userId === user.id
            const isNoteTaker = meeting.noteTaker?.userId === user.id

            const myRole = isChairperson
                ? "chairperson"
                : isNoteTaker
                    ? "note_taker"
                    : "member"

            const chairUser = meeting.chairperson?.user
            const noteTakerUser = meeting.noteTaker?.user

            return {
                id: meeting.id,
                title: meeting.title,
                description: meeting.description || "",
                agenda: meeting.agenda ?? [],
                date: meeting.date.toISOString().split("T")[0],
                time: meeting.date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }),
                duration: "1 hour", // Default duration
                location: meeting.location || "TBD",
                isVirtual: meeting.isVirtual,
                meetingLink: meeting.meetingLink,
                status,
                group: {
                    id: meeting.group.id,
                    name: meeting.group.name,
                    members: meeting.group._count.memberships
                },
                myRsvp: userAttendee?.status === "PRESENT" ? "confirmed" :
                    userAttendee?.status === "ABSENT" ? "declined" :
                        "pending",
                attendees: (meeting.attendees as any[]).filter((a: any) => a.status === "PRESENT").length,
                totalMembers: meeting.group._count.memberships,
                myRole,
                organizer: {
                    name: chairUser?.name || chairUser?.email || "Group Admin",
                    avatar: null,
                    role: "chairperson"
                },
                chairperson: chairUser
                    ? {
                        name: chairUser.name || chairUser.email,
                        email: chairUser.email
                    }
                    : null,
                noteTaker: noteTakerUser
                    ? {
                        name: noteTakerUser.name || noteTakerUser.email,
                        email: noteTakerUser.email
                    }
                    : null
            }
        })
    } catch (error) {
        console.error("Error fetching meetings:", error)
        return []
    }
}

export async function updateMeetingRSVP(
    meetingId: string,
    status: "PRESENT" | "ABSENT" | "PENDING"
) {
    try {
        const { userId: clerkUserId } = await auth()

        if (!clerkUserId) {
            return { success: false, error: "Not authenticated" }
        }

        // Get database user
        const user = await prisma.user.findUnique({
            where: { clerkUserId }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Find the user's membership in the meeting's group
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: {
                group: {
                    include: {
                        memberships: {
                            where: {
                                userId: user.id
                            }
                        }
                    }
                }
            }
        })

        if (!meeting) {
            return { success: false, error: "Meeting not found" }
        }

        const membership = meeting.group.memberships[0]
        if (!membership) {
            return { success: false, error: "You are not a member of this group" }
        }

        // Update or create the attendee record
        await prisma.meetingAttendee.upsert({
            where: {
                meetingId_membershipId: {
                    meetingId: meetingId,
                    membershipId: membership.id
                }
            },
            update: {
                status: status
            },
            create: {
                meetingId: meetingId,
                membershipId: membership.id,
                status: status
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error updating RSVP:", error)
        return { success: false, error: "Failed to update RSVP" }
    }
}
