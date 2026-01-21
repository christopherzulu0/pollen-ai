import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch all ledger entries for admin
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Build where clause
    const where: any = {}

    if (type && type !== "all") {
      where.type = type
    }

    if (status && status !== "all") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { entryId: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { asset: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    // Fetch all ledger entries with related data
    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where,
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
    })

    // If groupId exists, we can fetch group names separately if needed
    // For now, we'll use the groupId to display group info
    const groupIds = [...new Set(ledgerEntries.filter(e => e.groupId).map(e => e.groupId))]
    const groups = groupIds.length > 0 
      ? await prisma.group.findMany({
          where: { id: { in: groupIds as string[] } },
          select: { id: true, name: true },
        })
      : []
    
    const groupMap = new Map(groups.map(g => [g.id, g.name]))

    // Transform ledger entries to match component's expected format
    const transformedEntries = ledgerEntries.map((entry) => ({
      id: entry.entryId,
      type: entry.type,
      amount: Number(entry.amount),
      asset: entry.asset,
      user: entry.user
        ? entry.user.name || entry.user.email || "Unknown User"
        : entry.groupId && groupMap.has(entry.groupId)
        ? groupMap.get(entry.groupId) || "Unknown Group"
        : "System",
      date: entry.createdAt.toISOString(),
      status: entry.status,
      txHash: entry.txHash || null,
      blockNumber: entry.blockNumber || null,
      description: entry.description || null,
      currency: entry.currency,
      reference: entry.reference || null,
    }))

    // Calculate statistics
    const stats = {
      totalDeposits: transformedEntries
        .filter((e) => e.type === "DEPOSIT")
        .reduce((sum, e) => sum + e.amount, 0),
      totalWithdrawals: transformedEntries
        .filter((e) => e.type === "WITHDRAW")
        .reduce((sum, e) => sum + e.amount, 0),
      totalInterest: transformedEntries
        .filter((e) => e.type === "INTEREST")
        .reduce((sum, e) => sum + e.amount, 0),
      totalFees: transformedEntries
        .filter((e) => e.type === "FEE")
        .reduce((sum, e) => sum + e.amount, 0),
      totalTransfers: transformedEntries
        .filter((e) => e.type === "TRANSFER")
        .reduce((sum, e) => sum + e.amount, 0),
      pendingCount: transformedEntries.filter((e) => e.status === "PENDING").length,
      confirmedCount: transformedEntries.filter((e) => e.status === "CONFIRMED").length,
    }

    return NextResponse.json({
      entries: transformedEntries,
      stats,
    })
  } catch (error) {
    console.error("[ADMIN_LEDGER_ENTRIES_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch ledger entries" },
      { status: 500 }
    )
  }
}

