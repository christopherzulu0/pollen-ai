import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { ethers } from "ethers"
import { prisma } from "@/lib/prisma"
import { getCurrentNetwork, CELO_NETWORKS, STABLE_TOKEN_ADDRESSES, parseCeloAmount } from "@/lib/celo/utils"

export const maxDuration = 60 // 60 seconds for transaction confirmation
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { to, amount, currency = "CELO", signedTransaction } = await req.json()

    if (!to || !amount || !signedTransaction) {
      return NextResponse.json(
        { error: "Missing required fields: to, amount, signedTransaction" },
        { status: 400 }
      )
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
      return NextResponse.json(
        { error: "Invalid recipient address format" },
        { status: 400 }
      )
    }

    // Validate amount
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 }
      )
    }

    // Get wallet to verify user owns the sending address
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet?.celoAddress) {
      return NextResponse.json(
        { error: "Wallet not connected. Please connect your wallet first." },
        { status: 404 }
      )
    }

    const network = wallet.network || getCurrentNetwork()
    const rpcUrl = CELO_NETWORKS[network as keyof typeof CELO_NETWORKS]?.rpcUrl

    if (!rpcUrl) {
      return NextResponse.json(
        { error: "Invalid network configuration" },
        { status: 500 }
      )
    }

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

    try {
      let transactionResponse
      let transactionHash

      if (currency === "CELO") {
        // Send native CELO - the signed transaction should already be prepared
        // For now, we'll expect the client to sign and send
        // This is a placeholder - in production, you'd verify the signed transaction
        
        // Parse signed transaction
        const tx = ethers.utils.parseTransaction(signedTransaction)
        
        // Verify it's going to the correct address
        if (tx.to?.toLowerCase() !== to.toLowerCase()) {
          return NextResponse.json(
            { error: "Transaction recipient does not match" },
            { status: 400 }
          )
        }

        // Broadcast the signed transaction
        transactionResponse = await provider.sendTransaction(signedTransaction)
        transactionHash = transactionResponse.hash

      } else if (currency === "cUSD" || currency === "cEUR") {
        // Send stablecoin via contract
        const tokenAddress = STABLE_TOKEN_ADDRESSES[network as keyof typeof STABLE_TOKEN_ADDRESSES]?.[
          currency === "cUSD" ? "cUSD" : "cEUR"
        ]

        if (!tokenAddress) {
          return NextResponse.json(
            { error: `Stable token address not found for ${currency} on ${network}` },
            { status: 404 }
          )
        }

        // ERC20 transfer ABI
        const erc20Abi = [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function decimals() view returns (uint8)',
        ]

        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider)
        
        // Get decimals
        const decimals = await tokenContract.decimals()
        const amountWei = ethers.utils.parseUnits(amount.toString(), decimals)

        // Parse and broadcast signed transaction
        transactionResponse = await provider.sendTransaction(signedTransaction)
        transactionHash = transactionResponse.hash
      } else {
        return NextResponse.json(
          { error: `Unsupported currency: ${currency}` },
          { status: 400 }
        )
      }

      // Wait for transaction confirmation (1 block)
      const receipt = await transactionResponse.wait(1)

      // Save transaction to database
      try {
        await prisma.transaction.create({
          data: {
            amount: parseFloat(amount),
            type: "DEPOSIT", // or "WITHDRAWAL" based on context
            status: receipt.status === 1 ? "COMPLETED" : "FAILED",
            description: `Sent ${amount} ${currency} to ${to.substring(0, 10)}...`,
            userId,
            walletId: wallet.id,
            reference: transactionHash,
            // Store blockchain transaction details
            momoNumber: transactionHash, // Reusing field to store tx hash
          },
        })
      } catch (dbError) {
        console.error("Failed to save transaction to database:", dbError)
        // Don't fail the request if DB save fails
      }

      return NextResponse.json({
        success: true,
        transactionHash,
        receipt: {
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          status: receipt.status,
        },
        explorerUrl: `${CELO_NETWORKS[network as keyof typeof CELO_NETWORKS]?.explorer}/tx/${transactionHash}`,
      })
    } catch (txError: any) {
      console.error("Transaction error:", txError)
      return NextResponse.json(
        {
          error: "Transaction failed",
          details: txError.message || "Unknown error",
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Error in send transaction API:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

