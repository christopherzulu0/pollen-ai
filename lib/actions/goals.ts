"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export type MeetingGoal = {
  id: string
  name: string
  target: number
  current: number
  deadline: string | null
  description: string | null
}

export async function getGoalsForMeeting(meetingId: string): Promise<MeetingGoal[] | null> {
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
      include: { meetingFinancialGoals: true },
    })

    if (!meeting) return null

    return (meeting.meetingFinancialGoals ?? []).map((g) => ({
      id: g.id,
      name: g.name,
      target: Number(g.targetAmount),
      current: Number(g.currentAmount),
      deadline: g.deadline ? g.deadline.toISOString() : null,
      description: g.description ?? null,
    }))
  } catch (e) {
    console.error("getGoalsForMeeting error:", e)
    return null
  }
}

export async function createMeetingGoal(
  meetingId: string,
  data: {
    name: string
    targetAmount: number
    currentAmount?: number
    deadline?: string | null
    description?: string | null
  }
): Promise<{ success: boolean; error?: string; goal?: MeetingGoal }> {
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
    })

    if (!meeting) return { success: false, error: "Meeting not found" }

    const targetAmount = Number(data.targetAmount)
    const currentAmount = Number(data.currentAmount ?? 0)
    if (targetAmount <= 0 || Number.isNaN(targetAmount)) {
      return { success: false, error: "Target amount must be a positive number" }
    }
    if (currentAmount < 0 || Number.isNaN(currentAmount)) {
      return { success: false, error: "Current amount must be 0 or greater" }
    }

    const deadline = data.deadline ? new Date(data.deadline) : null
    if (data.deadline && Number.isNaN(deadline!.getTime())) {
      return { success: false, error: "Deadline must be a valid date" }
    }

    const created = await prisma.meetingFinancialGoal.create({
      data: {
        meetingId,
        name: data.name.trim(),
        targetAmount,
        currentAmount,
        deadline: deadline ?? undefined,
        description: data.description?.trim() || undefined,
      },
    })

    return {
      success: true,
      goal: {
        id: created.id,
        name: created.name,
        target: Number(created.targetAmount),
        current: Number(created.currentAmount),
        deadline: created.deadline ? created.deadline.toISOString() : null,
        description: created.description ?? null,
      },
    }
  } catch (e) {
    console.error("createMeetingGoal error:", e)
    return { success: false, error: "Failed to create goal" }
  }
}

export async function contributeToGoal(
  goalId: string,
  amount: number
): Promise<{ success: boolean; error?: string; goal?: MeetingGoal }> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return { success: false, error: "Unauthorized" }

    const user = await prisma.user.findUnique({ where: { clerkUserId } })
    if (!user) return { success: false, error: "User not found" }

    const goal = await prisma.meetingFinancialGoal.findUnique({
      where: { id: goalId },
      include: { meeting: { select: { groupId: true } } },
    })
    if (!goal?.meeting) return { success: false, error: "Goal not found" }

    const membership = await prisma.membership.findFirst({
      where: {
        groupId: goal.meeting.groupId,
        userId: user.id,
        status: "ACTIVE",
      },
      select: { id: true },
    })
    if (!membership) return { success: false, error: "You are not a member of this group" }

    const contributionAmount = Number(amount)
    if (contributionAmount <= 0 || Number.isNaN(contributionAmount)) {
      return { success: false, error: "Amount must be a positive number" }
    }

    await prisma.$transaction([
      prisma.meetingGoalContribution.create({
        data: {
          goalId,
          membershipId: membership.id,
          amount: contributionAmount,
        },
      }),
      prisma.meetingFinancialGoal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: contributionAmount } },
      }),
    ])

    const updated = await prisma.meetingFinancialGoal.findUnique({
      where: { id: goalId },
    })
    if (!updated) return { success: true }

    return {
      success: true,
      goal: {
        id: updated.id,
        name: updated.name,
        target: Number(updated.targetAmount),
        current: Number(updated.currentAmount),
        deadline: updated.deadline ? updated.deadline.toISOString() : null,
        description: updated.description ?? null,
      },
    }
  } catch (e) {
    console.error("contributeToGoal error:", e)
    return { success: false, error: "Failed to contribute" }
  }
}
