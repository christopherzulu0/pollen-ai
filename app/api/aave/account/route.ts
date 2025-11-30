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

    // Get user's wallet address from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        wallet: true,
      },
    })

    if (!user || !user.wallet || !user.wallet.celoAddress) {
      return NextResponse.json(
        { error: "Wallet not found. Please connect your wallet first." },
        { status: 404 }
      )
    }

    // TODO: Replace with actual Aave integration when deployed on Celo
    // For now, return mock data for development
    console.log("⚠️ Using mock Aave data - Aave V3 is not yet deployed on Celo")
    
    // Mock account data for development
    const mockAccountData = {
      totalCollateral: "1000.00",
      totalDebt: "0.00",
      availableBorrows: "800.00",
      healthFactor: "999.00",
      ltv: "0.00",
      liquidationThreshold: "80.00",
    }

    return NextResponse.json(mockAccountData)
  } catch (error) {
    console.error("Aave account error:", error)
    return NextResponse.json(
      { error: "Failed to fetch account data" },
      { status: 500 }
    )
  }
}

