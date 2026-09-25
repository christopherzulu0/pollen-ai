"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

function toNum(v: unknown): number {
  if (v == null) return 0
  if (typeof v === "number" && !Number.isNaN(v)) return v
  return Number(String(v)) || 0
}

function toStr(v: unknown): string | null {
  if (v == null) return null
  return String(v)
}

export type MemberOverview = {
  user: { name: string; email: string; memberId: string | null; memberSince: string | null }
  memberBalance: {
    fiatBalance: number
    fiatCurrency: string
    celoBalance: number
    cusdBalance: number
    ceurBalance: number
    lockedFiat: number
    lockedCelo: number
    availableFiat: number
    availableCelo: number
    totalInterestEarned: number
    pendingInterest: number
    primaryWalletAddress: string | null
  }
  memberships: {
    groupId: string
    groupName: string
    role: string
    status: string
    balance: number
    totalContributed: number
    contributionStreak: number
  }[]
  personalSavings: { balance: number }
  savingsGoals: {
    id: string
    name: string
    targetAmount: number
    currentAmount: number
    deadline: string | null
    isCompleted: boolean
  }[]
  recentTransactions: {
    id: string
    type: string
    amount: number
    status: string
    description: string | null
    createdAt: string
    groupName: string | null
  }[]
  activeLoan: {
    id: string
    amount: number
    status: string
    purpose: string
    interestRate: number
    repaymentDate: string
    totalRepaid: number
    remainingBalance: number
    nextPaymentDate: string | null
    nextPaymentAmount: number | null
    groupName: string
  } | null
  activeInsurance: {
    policyNumber: string
    productType: string | null
    coverageAmount: number
    premiumAmount: number
    status: string
    nextPremiumDue: string | null
  }[]
  upcomingMeetings: {
    id: string
    title: string
    date: string
    groupName: string
    isVirtual: boolean
    location: string | null
    meetingLink: string | null
  }[]
  interestSummary: {
    totalEarned: number
    thisMonth: number | null
    lastMonth: number | null
    monthlyGrowth: number | null
    sources?: { name: string; rate: number; earned: number }[]
  }
  unreadNotifications: number
}

const defaultMemberBalance: MemberOverview["memberBalance"] = {
  fiatBalance: 0,
  fiatCurrency: "ZMW",
  celoBalance: 0,
  cusdBalance: 0,
  ceurBalance: 0,
  lockedFiat: 0,
  lockedCelo: 0,
  availableFiat: 0,
  availableCelo: 0,
  totalInterestEarned: 0,
  pendingInterest: 0,
  primaryWalletAddress: null,
}

export async function getMemberOverview(): Promise<MemberOverview | null> {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) return null

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        memberBalance: true,
        personalSavings: true,
        savingsGoals: { orderBy: { createdAt: "desc" } },
        memberships: {
          where: { status: "ACTIVE" },
          include: { group: { select: { id: true, name: true } } },
        },
      },
    })

    if (!user) return null

    const userId = user.id
    const groupIds = user.memberships.map((m) => m.groupId)

    const [memberBalanceRow] = user.memberBalance ? [user.memberBalance] : []
    const mb = memberBalanceRow
      ? {
          fiatBalance: toNum(memberBalanceRow.fiatBalance),
          fiatCurrency: toStr(memberBalanceRow.fiatCurrency) ?? "ZMW",
          celoBalance: toNum(memberBalanceRow.celoBalance),
          cusdBalance: toNum(memberBalanceRow.cusdBalance),
          ceurBalance: toNum(memberBalanceRow.ceurBalance),
          lockedFiat: toNum(memberBalanceRow.lockedFiat),
          lockedCelo: toNum(memberBalanceRow.lockedCelo),
          availableFiat: toNum(memberBalanceRow.availableFiat),
          availableCelo: toNum(memberBalanceRow.availableCelo),
          totalInterestEarned: toNum(memberBalanceRow.totalInterestEarned),
          pendingInterest: toNum(memberBalanceRow.pendingInterest),
          primaryWalletAddress: toStr(memberBalanceRow.primaryWalletAddress),
        }
      : { ...defaultMemberBalance }

    const contributionsByGroup = await prisma.contribution.groupBy({
      by: ["groupId"],
      where: {
        userId,
        status: "COMPLETED",
      },
      _sum: { amount: true },
      _count: true,
    })
    const contributionSums = new Map(
      contributionsByGroup.map((c) => [c.groupId, toNum((c._sum as { amount?: unknown })?.amount)])
    )

    const memberships: MemberOverview["memberships"] = user.memberships.map((m) => {
      const g = m.group as { id: string; name: string }
      const balance = contributionSums.get(m.groupId) ?? 0
      return {
        groupId: m.groupId,
        groupName: g?.name ?? "",
        role: (m.role as string) ?? "MEMBER",
        status: (m.status as string) ?? "ACTIVE",
        balance,
        totalContributed: balance,
        contributionStreak: 0,
      }
    })

    const personalSavingsRow = user.personalSavings
    const personalSavings: MemberOverview["personalSavings"] = {
      balance: personalSavingsRow ? toNum(personalSavingsRow.balance) : 0,
    }

    const savingsGoals: MemberOverview["savingsGoals"] = (user.savingsGoals ?? []).map((g) => ({
      id: g.id,
      name: g.name,
      targetAmount: toNum(g.targetAmount),
      currentAmount: toNum(g.currentAmount),
      deadline: g.deadline ? g.deadline.toISOString() : null,
      isCompleted: Boolean(g.isCompleted),
    }))

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { group: { select: { name: true } } },
    })
    const recentTransactions: MemberOverview["recentTransactions"] = transactions.map((t) => ({
      id: t.id,
      type: (t.type as string) ?? "DEPOSIT",
      amount: toNum(t.amount),
      status: (t.status as string) ?? "PENDING",
      description: t.description ?? null,
      createdAt: t.createdAt.toISOString(),
      groupName: t.group ? (t.group as { name: string }).name : null,
    }))

    const activeLoanRow = await prisma.loanRequest.findFirst({
      where: {
        userId,
        status: { in: ["DISBURSED", "REPAYING", "APPROVED"] },
      },
      include: {
        group: { select: { name: true } },
        transactions: { where: { type: "LOAN_REPAYMENT" } },
      },
    })

    let activeLoan: MemberOverview["activeLoan"] = null
    if (activeLoanRow) {
      const totalRepaid = activeLoanRow.transactions.reduce((s, t) => s + toNum(t.amount), 0)
      const amount = toNum(activeLoanRow.amount)
      const remainingBalance = Math.max(0, amount - totalRepaid)
      activeLoan = {
        id: activeLoanRow.id,
        amount,
        status: (activeLoanRow.status as string) ?? "REPAYING",
        purpose: activeLoanRow.purpose ?? "",
        interestRate: toNum(activeLoanRow.interestRate),
        repaymentDate: activeLoanRow.repaymentDate.toISOString(),
        totalRepaid,
        remainingBalance,
        nextPaymentDate: null,
        nextPaymentAmount: null,
        groupName: (activeLoanRow.group as { name: string })?.name ?? "",
      }
    }

    const insurancePolicies = await prisma.insurancePolicy.findMany({
      where: { userId, status: "active" },
      include: { product: { select: { productType: true } } },
    })
    const activeInsurance: MemberOverview["activeInsurance"] = insurancePolicies.map((p) => ({
      policyNumber: p.policyNumber,
      productType: (p.product as { productType?: string })?.productType ?? null,
      coverageAmount: toNum(p.coverageAmount),
      premiumAmount: toNum(p.premiumAmount),
      status: p.status ?? "active",
      nextPremiumDue: p.nextPremiumDue ? p.nextPremiumDue.toISOString() : null,
    }))

    const now = new Date()
    const meetings = await prisma.meeting.findMany({
      where: {
        groupId: { in: groupIds },
        date: { gte: now },
      },
      orderBy: { date: "asc" },
      take: 5,
      include: { group: { select: { name: true } } },
    })
    const upcomingMeetings: MemberOverview["upcomingMeetings"] = meetings.map((m) => ({
      id: m.id,
      title: m.title,
      date: m.date.toISOString(),
      groupName: (m.group as { name: string })?.name ?? "",
      isVirtual: Boolean(m.isVirtual),
      location: m.location ?? null,
      meetingLink: m.meetingLink ?? null,
    }))

    const interestThisMonth =
      mb.totalInterestEarned > 0
        ? await prisma.transaction
            .aggregate({
              where: {
                userId,
                type: "INTEREST",
                status: "COMPLETED",
                createdAt: {
                  gte: new Date(now.getFullYear(), now.getMonth(), 1),
                  lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                },
              },
              _sum: { amount: true },
            })
            .then((r) => toNum((r._sum as { amount?: unknown })?.amount))
        : 0

    const interestSummary: MemberOverview["interestSummary"] = {
      totalEarned: mb.totalInterestEarned,
      thisMonth: interestThisMonth || null,
      lastMonth: null,
      monthlyGrowth: null,
      sources: [],
    }

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    return {
      user: {
        name: user.name ?? "Member",
        email: user.email,
        memberId: user.id ? `POL-2024-${user.id.slice(-4)}` : null,
        memberSince: user.createdAt ? user.createdAt.toISOString().slice(0, 10) : null,
      },
      memberBalance: mb,
      memberships,
      personalSavings,
      savingsGoals,
      recentTransactions,
      activeLoan,
      activeInsurance,
      upcomingMeetings,
      interestSummary,
      unreadNotifications: unreadCount,
    }
  } catch (e) {
    console.error("getMemberOverview error:", e)
    return null
  }
}
