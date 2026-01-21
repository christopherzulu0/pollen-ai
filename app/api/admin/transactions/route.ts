import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch all transactions for admin
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
        { reference: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ]
    }

    // Fetch all transactions with related data
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        wallet: {
          select: {
            id: true,
            celoAddress: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform transactions to match component's expected format
    const transformedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      reference: transaction.reference || `TRX-${transaction.id.slice(0, 8).toUpperCase()}`,
      user: {
        id: transaction.user.id,
        name: transaction.user.name || "Unknown User",
        email: transaction.user.email || "",
      },
      type: transaction.type,
      amount: Number(transaction.amount),
      status: transaction.status,
      date: transaction.createdAt.toISOString(),
      description: transaction.description || "",
      momoNumber: transaction.momoNumber || null,
      feeAmount: transaction.feeAmount ? Number(transaction.feeAmount) : 0,
      group: transaction.group
        ? {
            id: transaction.group.id,
            name: transaction.group.name,
          }
        : null,
      wallet: transaction.wallet
        ? {
            celoAddress: transaction.wallet.celoAddress || null,
          }
        : null,
    }))

    return NextResponse.json(transformedTransactions)
  } catch (error) {
    console.error("[ADMIN_TRANSACTIONS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

