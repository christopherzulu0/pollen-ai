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
    const { asset, amount } = body

    if (!asset || !amount) {
      return NextResponse.json(
        { error: "Asset and amount are required" },
        { status: 400 }
      )
    }

    // Get user's wallet from database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        wallet: true,
        memberships: {
          where: {
            status: "ACTIVE",
          },
          include: {
            group: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          take: 1, // Get first active group
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Auto-create wallet if it doesn't exist
    if (!user.wallet) {
      console.log("[AAVE DEPOSIT] Creating wallet for user:", user.id)
      // Generate a new wallet for the user
      const newWallet = ethers.Wallet.createRandom()
      
      user.wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          celoAddress: newWallet.address,
          privateKey: newWallet.privateKey, // ⚠️ In production, encrypt this!
          network: 'alfajores',
          isConnected: true,
          connectedAt: new Date(),
          balance: 0,
        },
      })
      console.log("[AAVE DEPOSIT] Wallet created:", newWallet.address)
    }

    // If wallet exists but doesn't have a private key, generate one
    if (!user.wallet.privateKey) {
      console.log("[AAVE DEPOSIT] Generating private key for existing wallet")
      const newWallet = ethers.Wallet.createRandom()
      
      user.wallet = await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: {
          celoAddress: user.wallet.celoAddress || newWallet.address,
          privateKey: newWallet.privateKey, // ⚠️ In production, encrypt this!
          network: user.wallet.network || 'alfajores',
          isConnected: true,
          connectedAt: new Date(),
        },
      })
      console.log("[AAVE DEPOSIT] Private key generated for wallet:", user.wallet.celoAddress)
    }

    // Ensure wallet has an ethers address (create one if missing)
    if (!user.wallet.celoAddress) {
      console.log("[AAVE DEPOSIT] Generating ethers address for wallet")
      const newWallet = ethers.Wallet.createRandom()
      user.wallet = await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: {
          celoAddress: newWallet.address,
          network: user.wallet.network || 'alfajores',
        },
      })
      console.log("[AAVE DEPOSIT] Generated ethers address:", newWallet.address)
    }

    // No blockchain deposit - just create ledger entry
    // Blockchain transactions will be handled separately when Aave is fully configured
    const txHash: string | null = null
    const blockNumber: number | null = null
    const gasUsed: number | null = null

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        type: "DEPOSIT",
        status: "PENDING", // Pending until blockchain transaction is executed
        userId: user.id,
        walletId: user.wallet.id,
        description: `Deposited ${amount} ${asset} as collateral on Aave`,
      },
    })

    // Generate unique entry ID (L001, L002, etc.)
    let entryId: string
    try {
      const latestEntry = await prisma.ledgerEntry.findFirst({
        orderBy: { createdAt: "desc" },
        select: { entryId: true },
      })
      
      let entryNumber = 1
      if (latestEntry?.entryId) {
        const match = latestEntry.entryId.match(/L(\d+)/)
        if (match) {
          entryNumber = parseInt(match[1]) + 1
        }
      }
      entryId = `L${entryNumber.toString().padStart(3, "0")}`
    } catch (entryIdError) {
      console.error("[AAVE DEPOSIT] Error generating entry ID:", entryIdError)
      // Fallback to timestamp-based ID if sequence fails
      entryId = `L${Date.now().toString().slice(-6)}`
    }

    // Get user's group ID (from first active membership)
    const userGroupId = user.memberships && user.memberships.length > 0 
      ? user.memberships[0].groupId 
      : null

    // Create LedgerEntry (source of truth)
    let ledgerEntry
    try {
      console.log(`[AAVE DEPOSIT] Attempting to create LedgerEntry with entryId: ${entryId}, amount: ${amount}, userId: ${user.id}, groupId: ${userGroupId || "none"}`)
      
      ledgerEntry = await prisma.ledgerEntry.create({
        data: {
          entryId,
          type: "DEPOSIT",
          amount: parseFloat(amount.toString()), // Ensure it's a number
          asset: asset,
          currency: "ZMK", // Use ZMK as requested
          userId: user.id,
          groupId: userGroupId || undefined, // Include groupId if user is in a group
          description: `Deposited ${amount} ${asset} as collateral on Aave`,
          reference: transaction.id,
          txHash: null,
          blockNumber: null,
          gasUsed: null,
          walletAddress: user.wallet.celoAddress || undefined,
          networkId: user.wallet.network || "celo-alfajores",
          status: "PENDING",
          confirmations: 0,
          confirmedAt: null,
          createdBy: userId,
        },
      })
      
      console.log(`[AAVE DEPOSIT] ✅ Successfully created LedgerEntry ${entryId} (ID: ${ledgerEntry.id}) for deposit of ${amount} ${asset}`)
    } catch (ledgerError) {
      console.error("[AAVE DEPOSIT] ❌ Error creating LedgerEntry:", ledgerError)
      console.error("[AAVE DEPOSIT] Error details:", JSON.stringify(ledgerError, null, 2))
      // Re-throw to be caught by outer catch block
      throw new Error(`Failed to create ledger entry: ${ledgerError instanceof Error ? ledgerError.message : "Unknown error"}`)
    }

    // Update wallet balance - deduct the deposit amount since funds are going to Aave
    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: {
        balance: {
          decrement: parseFloat(amount),
        },
      },
    })

    // Update asset-specific balance if needed
    const balanceField = asset === "cUSD" ? "cusdBalance" : asset === "cEUR" ? "ceurBalance" : "celoBalance"
    const currentBalance = user.wallet[balanceField] || "0"
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18)
    const currentBalanceBigInt = BigInt(currentBalance)
    const newBalance = (currentBalanceBigInt - BigInt(amountInWei.toString())).toString()

    await prisma.wallet.update({
      where: { id: user.wallet.id },
      data: {
        [balanceField]: newBalance,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Deposit recorded for ${amount} ${asset}. Ledger entry created.`,
      ledgerEntryId: entryId,
      ledgerEntry: {
        id: ledgerEntry.id,
        entryId: ledgerEntry.entryId,
        type: ledgerEntry.type,
        amount: ledgerEntry.amount.toString(),
        status: ledgerEntry.status,
      },
      walletAddress: user.wallet.celoAddress,
      newBalance: {
        walletBalance: (parseFloat(user.wallet.balance.toString()) - parseFloat(amount)).toFixed(2),
        assetBalance: ethers.utils.formatUnits(newBalance, 18),
      },
    })
  } catch (error) {
    console.error("Aave deposit error:", error)
    return NextResponse.json(
      {
        error: "Failed to deposit collateral",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

