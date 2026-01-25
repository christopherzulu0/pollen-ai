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
      console.error(`[Ledger Entries API] User ${userId} does not have admin role in any organization`)
      const roles = userOrganizations.data?.map((org) => org.role) || []
      return NextResponse.json(
        {
          error: "Forbidden - Admin access required",
          message: "You need admin privileges in your organization to access ledger entries.",
          userId: userId,
          organizationRoles: roles,
        },
        { status: 403 }
      )
    }

    console.log(`[Ledger Entries API] Admin user ${userId} accessing ledger entries`)

    // Fetch all ledger entries from LedgerEntry model (source of truth)
    const ledgerEntriesData = await prisma.ledgerEntry.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 500, // Limit to last 500 entries
    })

    // Fetch groups for entries that have groupId
    const groupIds = [...new Set(ledgerEntriesData.filter((e) => e.groupId).map((e) => e.groupId!))]
    const groups =
      groupIds.length > 0
        ? await prisma.group.findMany({
            where: { id: { in: groupIds } },
            select: { id: true, name: true },
          })
        : []

    const groupMap = new Map(groups.map((g) => [g.id, g.name]))

    // Transform ledger entries to match component's expected format
    const ledgerEntries = ledgerEntriesData.map((entry) => ({
      id: entry.entryId || entry.id,
      type: entry.type,
      amount: parseFloat(entry.amount.toString()),
      asset: entry.asset,
      user: entry.user
        ? entry.user.name || entry.user.email || "Unknown User"
        : "System",
      group: entry.groupId && groupMap.has(entry.groupId)
        ? groupMap.get(entry.groupId) || null
        : null,
      date: entry.createdAt.toISOString(),
      status: entry.status,
      txHash: entry.txHash || null,
      blockNumber: entry.blockNumber || null,
      description: entry.description || null,
      currency: entry.currency || "ZMK",
      reference: entry.reference || null,
    }))

    // Calculate statistics
    const stats = {
      totalDeposits: ledgerEntries
        .filter((e) => e.type === "DEPOSIT")
        .reduce((sum, e) => sum + e.amount, 0),
      totalWithdrawals: ledgerEntries
        .filter((e) => e.type === "WITHDRAW")
        .reduce((sum, e) => sum + e.amount, 0),
      totalInterest: ledgerEntries
        .filter((e) => e.type === "INTEREST")
        .reduce((sum, e) => sum + e.amount, 0),
      totalFees: ledgerEntries
        .filter((e) => e.type === "FEE" || e.type === "PENALTY")
        .reduce((sum, e) => sum + e.amount, 0),
      totalTransfers: ledgerEntries
        .filter((e) => e.type === "TRANSFER")
        .reduce((sum, e) => sum + e.amount, 0),
      pendingCount: ledgerEntries.filter((e) => e.status === "PENDING").length,
      confirmedCount: ledgerEntries.filter((e) => e.status === "CONFIRMED").length,
    }

    return NextResponse.json({
      entries: ledgerEntries,
      stats,
    })
  } catch (error) {
    console.error("[LEDGER_ENTRIES_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch ledger entries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

