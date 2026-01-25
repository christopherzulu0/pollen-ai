import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { withdrawCollateral, getSigner, TOKENS } from "@/lib/aave-helper"

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { asset, amount } = body

    if (!asset || !amount) {
      return NextResponse.json(
        { error: "Asset and amount are required" },
        { status: 400 }
      )
    }

    // Get user's wallet from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        wallet: true,
      },
    })

    if (!user || !user.wallet) {
      return NextResponse.json(
        { error: "Wallet not found. Please create or connect a wallet first." },
        { status: 404 }
      )
    }

    if (!user.wallet.privateKey) {
      return NextResponse.json(
        { 
          error: "Wallet not configured for DeFi operations. Private key required for signing transactions.",
          note: "For security, consider implementing client-side transaction signing in production."
        },
        { status: 400 }
      )
    }

    // Get asset address
    const assetAddress = TOKENS[asset as keyof typeof TOKENS]
    if (!assetAddress) {
      return NextResponse.json(
        { error: "Unsupported asset" },
        { status: 400 }
      )
    }

    // TODO: Replace with actual Aave integration when deployed on Celo
    console.log("⚠️ Using mock Aave transaction - Aave V3 is not yet deployed on Celo")
    console.log(`Mock withdraw: ${amount} ${asset} for user ${user.id}`)

    // Create transaction record with mock data
    await prisma.transaction.create({
      data: {
        amount: amount,
        type: "WITHDRAW",
        status: "COMPLETED",
        userId: user.id,
        description: `[MOCK] Withdrew ${amount} ${asset} from Aave`,
      },
    })

    // Mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`

    return NextResponse.json({
      success: true,
      transactionHash: mockTxHash,
      message: `[DEMO MODE] Successfully withdrew ${amount} ${asset}`,
      note: "This is a mock transaction. Aave V3 is not yet deployed on Celo.",
    })
  } catch (error) {
    console.error("Aave withdraw error:", error)
    return NextResponse.json(
      {
        error: "Failed to withdraw collateral",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

