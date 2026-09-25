"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export type MeetingMinutes = {
  minutesText: string | null
  minutesFileUrl: string | null
  minutesKeyDecisions: string[]
  minutesActionItems: string[]
  minutesActionItemsCompleted: boolean[]
  canEditMinutes: boolean
}

export async function getMeetingMinutes(meetingId: string): Promise<MeetingMinutes | null> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return null

    const user = await prisma.user.findUnique({ where: { clerkUserId } })
    if (!user) return null

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        group: {
          memberships: {
            some: { userId: user.id, status: "ACTIVE" },
          },
        },
      },
      include: {
        group: {
          select: {
            ownerId: true,
            memberships: {
              where: { userId: user.id, status: "ACTIVE" },
              select: { role: true },
              take: 1,
            },
          },
        },
        noteTaker: { select: { userId: true } },
        chairperson: { select: { userId: true } },
      },
    })

    if (!meeting) return null

    const groupRole =
      meeting.group.ownerId === user.id
        ? "OWNER"
        : (meeting.group.memberships as { role: string }[])?.[0]?.role ?? "MEMBER"
    const isNoteTaker = meeting.noteTaker?.userId === user.id
    const isChairperson = meeting.chairperson?.userId === user.id
    const canEditMinutes =
      isNoteTaker ||
      isChairperson ||
      groupRole === "OWNER" ||
      groupRole === "ADMIN"

    const meetingAny = meeting as { minutesKeyDecisions?: string[]; minutesActionItems?: string[]; minutesActionItemsCompleted?: boolean[] }
    return {
      minutesText: meeting.minutesText ?? null,
      minutesFileUrl: meeting.minutesFileUrl ?? null,
      minutesKeyDecisions: meetingAny.minutesKeyDecisions ?? [],
      minutesActionItems: meetingAny.minutesActionItems ?? [],
      minutesActionItemsCompleted: meetingAny.minutesActionItemsCompleted ?? [],
      canEditMinutes,
    }
  } catch (e) {
    console.error("getMeetingMinutes error:", e)
    return null
  }
}

export async function saveMeetingMinutes(
  meetingId: string,
  data: {
    minutesText?: string | null
    minutesFileUrl?: string | null
    minutesKeyDecisions?: string[]
    minutesActionItems?: string[]
    minutesActionItemsCompleted?: boolean[]
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return { success: false, error: "Unauthorized" }

    const user = await prisma.user.findUnique({ where: { clerkUserId } })
    if (!user) return { success: false, error: "User not found" }

    const meeting = await prisma.meeting.findFirst({
      where: {
        id: meetingId,
        group: {
          memberships: {
            some: { userId: user.id, status: "ACTIVE" },
          },
        },
      },
      include: {
        group: {
          select: {
            ownerId: true,
            memberships: {
              where: { userId: user.id, status: "ACTIVE" },
              select: { role: true },
              take: 1,
            },
          },
        },
        noteTaker: { select: { userId: true } },
        chairperson: { select: { userId: true } },
      },
    })

    if (!meeting) return { success: false, error: "Meeting not found" }

    const groupRole =
      meeting.group.ownerId === user.id
        ? "OWNER"
        : (meeting.group.memberships as { role: string }[])?.[0]?.role ?? "MEMBER"
    const isNoteTaker = meeting.noteTaker?.userId === user.id
    const isChairperson = meeting.chairperson?.userId === user.id
    const canEditMinutes =
      isNoteTaker ||
      isChairperson ||
      groupRole === "OWNER" ||
      groupRole === "ADMIN"

    if (!canEditMinutes) return { success: false, error: "You cannot edit minutes for this meeting" }

    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        ...(data.minutesText !== undefined && { minutesText: data.minutesText }),
        ...(data.minutesFileUrl !== undefined && { minutesFileUrl: data.minutesFileUrl }),
        ...(data.minutesKeyDecisions !== undefined && { minutesKeyDecisions: data.minutesKeyDecisions }),
        ...(data.minutesActionItems !== undefined && { minutesActionItems: data.minutesActionItems }),
        ...(data.minutesActionItemsCompleted !== undefined && { minutesActionItemsCompleted: data.minutesActionItemsCompleted }),
      },
    })

    return { success: true }
  } catch (e) {
    console.error("saveMeetingMinutes error:", e)
    return { success: false, error: "Failed to save minutes" }
  }
}
