import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Fetch ledger entries from LedgerEntry model (source of truth)
    // Fallback to Transaction model if LedgerEntry is empty
    let ledgerEntriesData: any[] = []
    let useTransactionFallback = false

    try {
      const ledgerEntries = await prisma.ledgerEntry.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      })

      if (ledgerEntries.length > 0) {
        ledgerEntriesData = ledgerEntries
      } else {
        useTransactionFallback = true
      }
    } catch (error) {
      console.warn("[MEMBER_LEDGER] LedgerEntry model not available, using Transaction fallback:", error)
      useTransactionFallback = true
    }

    // Fallback to Transaction model if LedgerEntry is empty
    if (useTransactionFallback) {
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      })
      ledgerEntriesData = transactions
    }

    // Calculate summary statistics
    const deposits = ledgerEntriesData
      .filter((entry) => entry.type === "DEPOSIT")
      .reduce((sum, entry) => sum + parseFloat(entry.amount.toString()), 0)

    const withdrawals = ledgerEntriesData
      .filter((entry) => entry.type === "WITHDRAW" || entry.type === "WITHDRAWAL")
      .reduce((sum, entry) => sum + parseFloat(entry.amount.toString()), 0)

    const interest = ledgerEntriesData
      .filter((entry) => entry.type === "INTEREST" || entry.description?.toLowerCase().includes("interest"))
      .reduce((sum, entry) => sum + parseFloat(entry.amount.toString()), 0)

    const fees = ledgerEntriesData
      .filter((entry) => entry.type === "FEE" || entry.description?.toLowerCase().includes("fee"))
      .reduce((sum, entry) => sum + parseFloat(entry.amount.toString()), 0)

    // Transform entries to match expected format
    const ledgerEntries = ledgerEntriesData.map((entry) => ({
      id: entry.entryId || entry.id,
      type: entry.type === "WITHDRAWAL" ? "WITHDRAW" : entry.type, // Normalize to WITHDRAW for frontend
      amount: parseFloat(entry.amount.toString()),
      asset: entry.asset || "cUSD", // Use asset from LedgerEntry, default to cUSD for Transaction
      date: entry.createdAt.toISOString(),
      status: entry.status === "COMPLETED" ? "CONFIRMED" : entry.status === "CONFIRMED" ? "CONFIRMED" : entry.status,
      txHash: entry.txHash || entry.reference || entry.id,
      description: entry.description || `${entry.type} transaction`,
    }))

    return NextResponse.json({
      entries: ledgerEntries,
      summary: {
        deposits,
        withdrawals,
        interest,
        fees,
      },
    })
  } catch (error) {
    console.error("[MEMBER_LEDGER_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to fetch ledger entries",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

