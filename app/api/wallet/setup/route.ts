import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { ethers } from "ethers"

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
    const { action, privateKey } = body // action: 'generate' or 'import'

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        wallet: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    let wallet: ethers.Wallet

    if (action === 'generate') {
      // Generate a new random wallet
      wallet = ethers.Wallet.createRandom()
    } else if (action === 'import' && privateKey) {
      // Import existing wallet from private key
      wallet = new ethers.Wallet(privateKey)
    } else {
      return NextResponse.json(
        { error: "Invalid action or missing private key" },
        { status: 400 }
      )
    }

    // Update or create wallet record
    const walletData = {
      celoAddress: wallet.address,
      privateKey: wallet.privateKey, // ⚠️ In production, encrypt this!
      network: 'alfajores',
      isConnected: true,
      connectedAt: new Date(),
    }

    if (user.wallet) {
      // Update existing wallet
      await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: walletData,
      })
    } else {
      // Create new wallet
      await prisma.wallet.create({
        data: {
          ...walletData,
          userId: user.id,
          balance: 0,
        },
      })
    }

    return NextResponse.json({
      success: true,
      address: wallet.address,
      message: action === 'generate' 
        ? "New wallet generated successfully" 
        : "Wallet imported successfully",
      // For 'generate' action, return mnemonic/private key for user to backup
      ...(action === 'generate' && {
        backup: {
          privateKey: wallet.privateKey,
          mnemonic: wallet.mnemonic?.phrase,
          warning: "⚠️ SAVE THESE SECURELY! You'll need them to recover your wallet."
        }
      })
    })
  } catch (error) {
    console.error("Wallet setup error:", error)
    return NextResponse.json(
      {
        error: "Failed to setup wallet",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's wallet
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        wallet: true,
      },
    })

    if (!user || !user.wallet) {
      return NextResponse.json({
        hasWallet: false,
        configured: false,
        message: "No wallet found. Please set up a wallet to use DeFi features."
      })
    }

    return NextResponse.json({
      hasWallet: true,
      configured: !!user.wallet.privateKey,
      address: user.wallet.celoAddress,
      network: user.wallet.network,
      isConnected: user.wallet.isConnected,
      message: user.wallet.privateKey 
        ? "Wallet is configured and ready for DeFi" 
        : "Wallet found but not configured for DeFi operations"
    })
  } catch (error) {
    console.error("Wallet check error:", error)
    return NextResponse.json(
      { error: "Failed to check wallet status" },
      { status: 500 }
    )
  }
}

