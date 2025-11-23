import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { ethers } from "ethers"
import { getCurrentNetwork, CELO_NETWORKS } from "@/lib/celo/utils"

export async function GET(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    // If no wallet or no Celo address, return empty transactions array
    if (!wallet?.celoAddress) {
      return NextResponse.json({
        transactions: [],
        total: 0,
        limit,
        offset,
      })
    }

    // Get transactions from database (blockchain transactions stored with 0x prefix)
    const dbTransactions = await prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
        reference: {
          startsWith: "0x", // Blockchain transactions have 0x prefix
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    // Optionally fetch from blockchain explorer API if available
    // For now, we'll use database transactions

    const transactions = dbTransactions.map((tx) => {
      const networkConfig = wallet.network 
        ? CELO_NETWORKS[wallet.network as keyof typeof CELO_NETWORKS]
        : null
      
      return {
        id: tx.id,
        hash: tx.reference || "",
        from: wallet.celoAddress || "",
        to: "", // Would need to extract from transaction receipt if stored
        amount: tx.amount.toString(),
        currency: "CELO" as const, // Would need to determine from transaction data
        status: tx.status === "COMPLETED" ? "confirmed" as const : 
                tx.status === "PENDING" ? "pending" as const : 
                "failed" as const,
        timestamp: tx.createdAt.toISOString(),
        blockNumber: null, // Would need to fetch from blockchain
        gasUsed: null,
        explorerUrl: networkConfig && tx.reference
          ? `${networkConfig.explorer}/tx/${tx.reference}`
          : null,
      }
    })

    return NextResponse.json({
      transactions,
      total: dbTransactions.length,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Helper function to fetch transactions from blockchain
 * This can be enhanced to use Celo blockchain explorer APIs
 */
async function fetchBlockchainTransactions(
  address: string,
  network: string,
  limit: number = 20
): Promise<any[]> {
  // TODO: Implement blockchain explorer API integration
  // You can use:
  // - Blockscout API: https://alfajores-blockscout.celo-testnet.org/api-docs
  // - Celo Explorer API if available
  
  return []
}

