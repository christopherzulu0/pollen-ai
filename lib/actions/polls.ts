"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import type { Poll } from "@/lib/types/polls"

export async function createPoll(data: {
  meetingId: string
  title: string
  description?: string
  options: string[]
  endDate: Date
}): Promise<{ success: boolean; error?: string; poll?: { id: string } }> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    })
    if (!user) {
      return { success: false, error: "User not found" }
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: data.meetingId },
      include: {
        group: {
          include: {
            memberships: {
              where: { status: "ACTIVE" },
              include: { user: true },
            },
          },
        },
      },
    })
    if (!meeting) {
      return { success: false, error: "Meeting not found" }
    }

    const membership = meeting.group.memberships.find(
      (m) => m.user.id === user.id
    )
    if (!membership || membership.status !== "ACTIVE") {
      return { success: false, error: "Only active group members can create polls" }
    }

    const isGroupOwner = meeting.group.ownerId === user.id
    const isAdminOrOwner =
      isGroupOwner ||
      membership.role === "OWNER" ||
      membership.role === "ADMIN"
    if (!isAdminOrOwner) {
      return {
        success: false,
        error: "Only the group owner or an admin can create polls",
      }
    }

    const options = (data.options || []).map((s) => s.trim()).filter(Boolean)
    if (options.length < 2) {
      return { success: false, error: "At least 2 options are required" }
    }

    const endDate = new Date(data.endDate)
    if (endDate <= new Date()) {
      return { success: false, error: "End date must be in the future" }
    }

    const vote = await prisma.vote.create({
      data: {
        meetingId: data.meetingId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        options,
        startDate: new Date(),
        endDate,
        membershipId: membership.id,
      },
    })

    return { success: true, poll: { id: vote.id } }
  } catch (e) {
    console.error("createPoll error:", e)
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create poll",
    }
  }
}

export async function getPollsForMeeting(
  meetingId: string
): Promise<Poll[] | null> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return null

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    })
    if (!user) return null

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        group: {
          include: {
            memberships: {
              where: { status: "ACTIVE" },
              include: { user: true },
            },
          },
        },
      },
    })
    if (!meeting) return null

    const isMember =
      meeting.group.memberships.some((m) => m.userId === user.id)
    if (!isMember) return null

    const votes = await prisma.vote.findMany({
      where: { meetingId },
      include: {
        voteResults: { include: { membership: true } },
        membership: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const now = new Date()

    return votes.map((v) => {
      const optionsList = (v.options as string[]) || []
      const votesByOption: Record<string, number> = {}
      optionsList.forEach((opt) => {
        votesByOption[opt] = 0
      })
      v.voteResults.forEach((r) => {
        votesByOption[r.selectedOption] =
          (votesByOption[r.selectedOption] ?? 0) + 1
      })

      const myResult = (v.voteResults as { membership: { userId: string }; selectedOption: string }[]).find(
        (r) => r.membership.userId === user.id
      )
      const status =
        new Date(v.endDate) > now ? ("active" as const) : ("ended" as const)

      return {
        id: v.id,
        title: v.title,
        description: v.description ?? null,
        options: optionsList,
        startDate: v.startDate.toISOString(),
        endDate: v.endDate.toISOString(),
        votes: votesByOption,
        myVote: myResult?.selectedOption ?? null,
        status,
      }
    })
  } catch (e) {
    console.error("getPollsForMeeting error:", e)
    return null
  }
}

export async function submitVote(
  voteId: string,
  selectedOption: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return { success: false, error: "Unauthorized" }
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    })
    if (!user) {
      return { success: false, error: "User not found" }
    }

    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        meeting: {
          include: {
            group: {
              include: {
                memberships: {
                  where: { status: "ACTIVE" },
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    })
    if (!vote) {
      return { success: false, error: "Poll not found" }
    }

    const optionsList = (vote.options as string[]) || []
    if (!optionsList.includes(selectedOption)) {
      return { success: false, error: "Invalid option" }
    }

    if (!vote.meetingId || !vote.meeting) {
      return { success: false, error: "Poll is not associated with a meeting" }
    }
    const isMember = vote.meeting.group.memberships.some(
      (m) => m.userId === user.id
    )
    if (!isMember) {
      return { success: false, error: "Only group members can vote" }
    }

    const endDate = new Date(vote.endDate)
    if (endDate <= new Date()) {
      return { success: false, error: "Voting has ended" }
    }

    const membership = vote.meeting.group.memberships.find(
      (m) => m.userId === user.id
    )
    if (!membership) {
      return { success: false, error: "Membership not found" }
    }

    await prisma.voteResult.upsert({
      where: {
        voteId_membershipId: { voteId, membershipId: membership.id },
      },
      create: {
        voteId,
        membershipId: membership.id,
        selectedOption,
      },
      update: { selectedOption },
    })

    return { success: true }
  } catch (e) {
    console.error("submitVote error:", e)
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to submit vote",
    }
  }
}
