import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/with-api"


// GET endpoint to fetch all village ledgers for admin
export const GET = withApi(async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all village ledgers with related group data
    const villageLedgers = await prisma.villageLedger.findMany({
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Transform village ledgers to match component's expected format
    const transformedLedgers = villageLedgers.map((ledger) => ({
      groupId: ledger.groupId,
      groupName: ledger.group.name,
      contributions: Number(ledger.totalContributions),
      loansIssued: Number(ledger.totalLoansIssued),
      repayments: Number(ledger.totalRepayments),
      penalties: Number(ledger.totalPenalties),
      balance: Number(ledger.currentBalance),
      activeMemberCount: ledger.activeMemberCount,
      totalMemberCount: ledger.totalMemberCount,
      status: ledger.status,
      lastActivityAt: ledger.lastActivityAt?.toISOString() || null,
    }))

    // Calculate totals
    const totals = {
      totalContributions: transformedLedgers.reduce((sum, g) => sum + g.contributions, 0),
      totalLoansIssued: transformedLedgers.reduce((sum, g) => sum + g.loansIssued, 0),
      totalRepayments: transformedLedgers.reduce((sum, g) => sum + g.repayments, 0),
      totalPenalties: transformedLedgers.reduce((sum, g) => sum + g.penalties, 0),
      totalBalance: transformedLedgers.reduce((sum, g) => sum + g.balance, 0),
    }

    return NextResponse.json({
      ledgers: transformedLedgers,
      totals,
    })
  } catch (error) {
    console.error("[ADMIN_VILLAGE_LEDGERS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch village ledgers" },
      { status: 500 }
    )
  }
})

