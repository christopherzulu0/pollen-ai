"use server"

import { mockGroups } from "@/lib/mock-data/groups"
import type { GroupWithDetails } from "@/lib/types/groups"
import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getCalendarClient } from "@/lib/google-calendar"
import { revalidatePath } from "next/cache"
import { client } from "@/sanity/lib/client"
import { USER_WITH_TOKENS_QUERY } from "@/sanity/queries/users"

export async function getGroups(filters?: {
  search?: string
  privacy?: string
  status?: string
}): Promise<GroupWithDetails[]> {
  try {
    const { userId: clerkUserId } = await auth()

    // 1. Get database user to include their membership status
    const dbUser = clerkUserId
      ? await prisma.user.findUnique({ where: { clerkUserId } })
      : null

    // 2. Build where clause
    const where: any = {}

    if (filters?.status && filters.status !== "all") {
      where.status = filters.status
    }

    if (filters?.privacy && filters.privacy !== "all") {
      where.privacy = filters.privacy
    }

    // Combine complex conditions using AND
    const andConditions: any[] = []

    if (filters?.search) {
      andConditions.push({
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ]
      })
    }

    if (dbUser) {
      andConditions.push({
        OR: [
          { memberships: { some: { userId: dbUser.id } } },
          { ownerId: dbUser.id }
        ]
      })
    } else {
      // If user is not logged in / not found, they shouldn't see any private groups 
      return []
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    // 3. Fetch groups
    const groups = await prisma.group.findMany({
      where,
      include: {
        memberships: {
          where: { userId: dbUser?.id }
        },
        _count: {
          select: { memberships: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    // 4. Transform to GroupWithDetails
    return groups.map((g) => {
      const membership = g.memberships?.[0]
      const isOwner = dbUser && g.ownerId === dbUser.id

      return {
        id: g.id,
        name: g.name,
        description: g.description,
        logo: g.logo,
        privacy: g.privacy as any,
        status: g.status as any,
        contributionAmount: Number(g.contributionAmount),
        contributionFrequency: g.contributionFrequency as any,
        depositGoal: g.depositGoal ? Number(g.depositGoal) : null,
        interestRate: Number(g.interestRate),
        maxMembers: g.maxMembers,
        memberCount: g._count.memberships,
        requireApproval: g.requireApproval,
        createdAt: g.createdAt,
        userMembershipId: membership?.id || null,
        userMembershipRole: membership?.role || (isOwner ? "OWNER" : null),
        userMembershipStatus: membership?.status as any || (isOwner ? "ACTIVE" : null),
        isUserMember: !!membership || !!isOwner,
      } as GroupWithDetails
    })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return []
  }
}

export async function joinGroup(groupId: string, inviteCode?: string) {
  // ... existing implementation ...
  try {
    const group = mockGroups.find((g) => g.id === groupId)

    if (!group) {
      return { success: false, error: "Group not found" }
    }

    // Simulate different behaviors based on privacy
    if (group.privacy === "INVITE_ONLY" && !inviteCode) {
      return { success: false, error: "Invitation code required" }
    }

    if (group.privacy === "INVITE_ONLY" && inviteCode !== "DEMO123") {
      return { success: false, error: "Invalid invitation code" }
    }

    // Simulate successful join/request
    const actionMessage =
      group.privacy === "PUBLIC"
        ? "Successfully joined the group!"
        : group.privacy === "PRIVATE"
          ? "Join request submitted! Waiting for admin approval."
          : "Successfully joined with invitation code!"

    return { success: true, message: actionMessage }
  } catch (error) {
    console.error("Error joining group:", error)
    return { success: false, error: "Failed to join group" }
  }
}

export async function requestToJoin(groupId: string) {
  return joinGroup(groupId)
}

/** Returns active group memberships for chairperson/note-taker selection when creating a meeting. Caller must be a member of the group. */
export async function getGroupMemberships(groupId: string): Promise<{ id: string; user: { name: string | null; email: string } }[]> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return []
    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } })
    if (!dbUser) return []
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: {
        ownerId: true,
        memberships: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            userId: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    })
    if (!group) return []
    const isMember = group.ownerId === dbUser.id || group.memberships.some((m) => m.userId === dbUser.id)
    if (!isMember) return []
    return group.memberships.map((m) => ({
      id: m.id,
      user: { name: m.user.name, email: m.user.email },
    }))
  } catch {
    return []
  }
}

export async function createGroupMeeting(data: {
  groupId: string;
  title: string;
  description?: string;
  agenda?: string[];
  date: Date;
  isVirtual: boolean;
  location?: string;
  chairpersonMembershipId?: string;
  noteTakerMembershipId?: string;
}): Promise<{ success: boolean; error?: string; warning?: string; meeting?: any }> {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    // 1. Get database user and group details
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    // Fetch Google tokens from Sanity (as seen in booking.ts)
    const sanityUser = await client.fetch(USER_WITH_TOKENS_QUERY, {
      clerkId: clerkUserId,
    });

    const googleAccount = sanityUser?.connectedAccounts?.find(
      (a: any) => a.provider === "google" && a.isDefault
    ) || sanityUser?.connectedAccounts?.find((a: any) => a.provider === "google");

    const group = await prisma.group.findUnique({
      where: { id: data.groupId },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          include: { user: true },
        },
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    // 2. Validate user is a member of the group
    const membership = group.memberships.find((m) => m.user.clerkUserId === clerkUserId)

    if (!membership || membership.status !== "ACTIVE") {
      throw new Error("Only active group members can create meetings")
    }

    const validMembershipIds = new Set(group.memberships.map((m) => m.id))
    const chairpersonMembershipId =
      data.chairpersonMembershipId && validMembershipIds.has(data.chairpersonMembershipId)
        ? data.chairpersonMembershipId
        : null
    const noteTakerMembershipId =
      data.noteTakerMembershipId && validMembershipIds.has(data.noteTakerMembershipId)
        ? data.noteTakerMembershipId
        : null

    let meetingLink = data.location || null;
    let googleEventId = null;
    let warning: string | undefined;

    // 3. Handle Google Meet creation if it's a virtual meeting
    if (data.isVirtual) {

      if (googleAccount?.accessToken && googleAccount?.refreshToken) {
        try {
          const calendar = await getCalendarClient(googleAccount as any);

          const event = await calendar.events.insert({
            calendarId: "primary",
            sendUpdates: "all",
            conferenceDataVersion: 1,
            requestBody: {
              summary: `${group.name}: ${data.title}`,
              description: data.description,
              start: {
                dateTime: data.date.toISOString(),
              },
              end: {
                // Default to 1 hour
                dateTime: new Date(data.date.getTime() + 60 * 60 * 1000).toISOString(),
              },
              attendees: group.memberships.map((m) => ({ email: m.user.email })),
              conferenceData: {
                createRequest: {
                  requestId: `group-meeting-${Date.now()}`,
                  conferenceSolutionKey: {
                    type: "hangoutsMeet",
                  },
                },
              },
            },
          });

          googleEventId = event.data.id || null;
          meetingLink = event.data.hangoutLink || meetingLink;
        } catch (error: any) {
          console.error("Failed to create Google Calendar event:", error);

          if (error.message?.includes("invalid_grant") || error.message?.includes("reconnect")) {
            warning = "Meeting created, but Google Meet link failed. Please reconnect your Google Calendar in Settings.";
          } else {
            warning = "Meeting created, but Google Meet link generation failed. Please try adding it manually.";
          }
        }
      } else {
        warning = "Meeting created, but no Google Calendar connection found. Please connect your account in Settings.";
      }
    }

    // 4. Create meeting in database
    const meeting = await prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        agenda: data.agenda?.filter((s) => s.trim().length > 0) ?? [],
        date: data.date,
        location: data.isVirtual ? "Virtual Meeting" : data.location ?? null,
        isVirtual: data.isVirtual,
        meetingLink: meetingLink,
        groupId: data.groupId,
        chairpersonMembershipId,
        noteTakerMembershipId,
        attendees: {
          create: group.memberships.map((m) => ({
            membershipId: m.id,
            status: "PENDING",
          })),
        },
      },
    });

    revalidatePath(`/member/groups/${data.groupId}/meetings`);
    return { success: true, meeting, warning };
  } catch (error: any) {
    console.error("Error creating group meeting:", error);
    return { success: false, error: error.message };
  }
}
