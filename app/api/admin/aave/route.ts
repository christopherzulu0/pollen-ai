import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getUserAccountData, getUserReserveData, getReserveData, TOKENS, getProvider } from "@/lib/aave-helper"
import { ethers } from "ethers"

// GET endpoint to fetch all AAVE positions for admin dashboard
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const healthFilter = searchParams.get("healthFilter") || "all"

    // Fetch all AAVE positions with related data
    const positions = await prisma.aavePosition.findMany({
      include: {
        group: {
          include: {
            owner: true,
          },
        },
        assets: {
          orderBy: {
            createdAt: "desc",
          },
        },
        transactions: {
          orderBy: {
            timestamp: "desc",
          },
          take: 10, // Recent 10 transactions
        },
      },
      orderBy: {
        healthFactor: "asc", // Show critical positions first
      },
    })

    // Transform data to match frontend format
    const transformedPositions = positions.map((position) => {
      // Separate supplies and borrows
      const supplies = position.assets
        .filter((asset) => asset.assetType === "SUPPLY")
        .map((asset) => ({
          asset: asset.assetSymbol,
          amount: Number(asset.amount),
          apy: Number(asset.apy),
          ltv: Number(asset.ltv || 0),
          balance: Number(asset.balance),
          valueUSD: Number(asset.valueUSD),
        }))

      const borrows = position.assets
        .filter((asset) => asset.assetType === "BORROW")
        .map((asset) => ({
          asset: asset.assetSymbol,
          amount: Number(asset.amount),
          apy: Number(asset.apy),
          balance: Number(asset.balance),
          valueUSD: Number(asset.valueUSD),
        }))

      // Calculate available to borrow (simplified: total supplied * avg LTV - total borrowed)
      const avgLTV = supplies.length > 0
        ? supplies.reduce((sum, s) => sum + s.ltv, 0) / supplies.length
        : 0.8
      const maxBorrowable = Number(position.totalSupplied) * avgLTV
      const availableToBorrow = Math.max(0, maxBorrowable - Number(position.totalBorrowed))

      // Recent activity
      const recentActivity = position.transactions.map((tx) => ({
        type: tx.type,
        asset: tx.assetSymbol,
        amount: Number(tx.amount),
        date: tx.timestamp.toISOString(),
        txHash: tx.txHash || "",
      }))

      return {
        id: position.id,
        groupId: position.groupId,
        groupName: position.group.name,
        spokeAddress: position.spokeAddress || `0x${position.id.slice(0, 40)}`,
        healthFactor: Number(position.healthFactor),
        totalSupplied: Number(position.totalSupplied),
        totalBorrowed: Number(position.totalBorrowed),
        availableToBorrow,
        netAPY: Number(position.netAPY),
        liquidationThreshold: Number(position.liquidationThreshold),
        supplies,
        borrows,
        recentActivity,
      }
    })

    // Apply filters
    let filtered = transformedPositions

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.groupName.toLowerCase().includes(search.toLowerCase()) ||
          p.spokeAddress.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (healthFilter !== "all") {
      if (healthFilter === "healthy") {
        filtered = filtered.filter((p) => p.healthFactor >= 2.0)
      } else if (healthFilter === "warning") {
        filtered = filtered.filter((p) => p.healthFactor >= 1.5 && p.healthFactor < 2.0)
      } else if (healthFilter === "critical") {
        filtered = filtered.filter((p) => p.healthFactor < 1.5)
      }
    }

    // Calculate stats
    const stats = {
      totalSupplied: filtered.reduce((sum, p) => sum + p.totalSupplied, 0),
      totalBorrowed: filtered.reduce((sum, p) => sum + p.totalBorrowed, 0),
      activePositions: filtered.length,
      avgHealthFactor:
        filtered.length > 0
          ? filtered.reduce((sum, p) => sum + p.healthFactor, 0) / filtered.length
          : 0,
      atRiskPositions: filtered.filter((p) => p.healthFactor < 1.5).length,
      totalAvailableToBorrow: filtered.reduce((sum, p) => sum + p.availableToBorrow, 0),
    }

    return NextResponse.json({
      positions: filtered,
      stats,
    })
  } catch (error) {
    console.error("[ADMIN_AAVE_GET_ERROR]", error)
    return NextResponse.json({ error: "Failed to fetch AAVE positions" }, { status: 500 })
  }
}

// POST endpoint to sync AAVE positions from blockchain
export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { groupId, spokeAddress } = body

    if (!groupId) {
      return NextResponse.json({ error: "groupId is required" }, { status: 400 })
    }

    // Get group and check if it has a wallet/spoke address
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: {
          include: {
            wallet: true,
          },
        },
      },
    })

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    // Determine the address to query (spokeAddress or owner's wallet)
    const addressToQuery = spokeAddress || group.owner.wallet?.celoAddress

    if (!addressToQuery) {
      return NextResponse.json(
        { error: "No wallet address found. Group needs a spoke address or owner needs a wallet." },
        { status: 400 }
      )
    }

    // Check if AAVE/Moola contracts are configured
    const LENDING_POOL_ADDRESS = process.env.NEXT_PUBLIC_AAVE_LENDING_POOL_ADDRESS || process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS
    const isBlockchainAvailable = LENDING_POOL_ADDRESS && LENDING_POOL_ADDRESS !== "0x..."

    if (!isBlockchainAvailable) {
      return NextResponse.json(
        {
          error: "Blockchain integration not configured",
          message: "AAVE/Moola Market contracts not configured. Please set NEXT_PUBLIC_LENDING_POOL_ADDRESS in .env",
          note: "Currently using database-only mode. Configure Moola Market addresses to enable blockchain sync.",
        },
        { status: 503 }
      )
    }

    try {
      // Fetch account data from blockchain
      const accountData = await getUserAccountData(addressToQuery)

      // Fetch reserve data for each supported token
      const supportedTokens = Object.keys(TOKENS) as Array<keyof typeof TOKENS>
      const assets: Array<{
        assetType: "SUPPLY" | "BORROW"
        assetSymbol: string
        amount: number
        balance: number
        apy: number
        ltv?: number
        valueUSD: number
      }> = []

      for (const tokenSymbol of supportedTokens) {
        const tokenAddress = TOKENS[tokenSymbol]
        try {
          const userReserveData = await getUserReserveData(tokenAddress, addressToQuery)
          const reserveData = await getReserveData(tokenAddress)

          // Skip if data is not available
          if (!userReserveData || !reserveData) {
            continue
          }

          // Calculate APY (convert from Ray units to percentage)
          const supplyAPY = parseFloat(reserveData.liquidityRate) * 100
          const borrowAPY = parseFloat(reserveData.variableBorrowRate) * 100

          // Supply position
          if (parseFloat(userReserveData.currentATokenBalance) > 0) {
            const balance = parseFloat(userReserveData.currentATokenBalance)
            assets.push({
              assetType: "SUPPLY",
              assetSymbol: tokenSymbol,
              amount: balance,
              balance: balance,
              apy: supplyAPY,
              ltv: 0.8, // Default LTV, could be fetched from reserve config
              valueUSD: balance, // Simplified - should use price oracle
            })
          }

          // Borrow position
          const totalDebt = parseFloat(userReserveData.currentStableDebt) + parseFloat(userReserveData.currentVariableDebt)
          if (totalDebt > 0) {
            assets.push({
              assetType: "BORROW",
              assetSymbol: tokenSymbol,
              amount: totalDebt,
              balance: totalDebt,
              apy: borrowAPY,
              valueUSD: totalDebt, // Simplified - should use price oracle
            })
          }
        } catch (error) {
          console.error(`Error fetching data for ${tokenSymbol}:`, error)
          // Continue with other tokens
        }
      }

      // Calculate totals
      const totalSupplied = assets
        .filter((a) => a.assetType === "SUPPLY")
        .reduce((sum, a) => sum + a.balance, 0)
      const totalBorrowed = assets
        .filter((a) => a.assetType === "BORROW")
        .reduce((sum, a) => sum + a.balance, 0)

      // Calculate net APY (supply APY - borrow APY weighted by amounts)
      const supplyValue = assets.filter((a) => a.assetType === "SUPPLY").reduce((sum, a) => sum + a.valueUSD, 0)
      const borrowValue = assets.filter((a) => a.assetType === "BORROW").reduce((sum, a) => sum + a.valueUSD, 0)
      const weightedSupplyAPY = assets
        .filter((a) => a.assetType === "SUPPLY")
        .reduce((sum, a) => sum + a.apy * a.valueUSD, 0) / (supplyValue || 1)
      const weightedBorrowAPY = assets
        .filter((a) => a.assetType === "BORROW")
        .reduce((sum, a) => sum + a.apy * a.valueUSD, 0) / (borrowValue || 1)
      const netAPY = weightedSupplyAPY - weightedBorrowAPY

      // Determine liquidation risk
      const healthFactor = parseFloat(accountData.healthFactor)
      let liquidationRisk = "low"
      if (healthFactor < 1.1) liquidationRisk = "high"
      else if (healthFactor < 1.5) liquidationRisk = "medium"

      // Find or create position in database
      let position = await prisma.aavePosition.findFirst({
        where: { groupId },
      })

      if (position) {
        // Update existing position
        position = await prisma.aavePosition.update({
          where: { id: position.id },
          data: {
            spokeAddress: spokeAddress || addressToQuery,
            totalSupplied: totalSupplied,
            totalBorrowed: totalBorrowed,
            availableToBorrow: parseFloat(accountData.availableBorrowsETH),
            netAPY: netAPY,
            healthFactor: healthFactor,
            liquidationThreshold: parseFloat(accountData.currentLiquidationThreshold) / 100,
            liquidationRisk,
            lastUpdated: new Date(),
          },
        })
      } else {
        // Create new position
        position = await prisma.aavePosition.create({
          data: {
            groupId,
            spokeAddress: spokeAddress || addressToQuery,
            totalSupplied: totalSupplied,
            totalBorrowed: totalBorrowed,
            availableToBorrow: parseFloat(accountData.availableBorrowsETH),
            netAPY: netAPY,
            healthFactor: healthFactor,
            liquidationThreshold: parseFloat(accountData.currentLiquidationThreshold) / 100,
            liquidationRisk,
          },
        })
      }

      // Update assets
      await prisma.aaveAsset.deleteMany({
        where: { positionId: position.id },
      })

      for (const asset of assets) {
        await prisma.aaveAsset.create({
          data: {
            positionId: position.id,
            assetType: asset.assetType,
            assetSymbol: asset.assetSymbol,
            amount: asset.amount,
            balance: asset.balance,
            apy: asset.apy,
            ltv: asset.ltv,
            valueUSD: asset.valueUSD,
          },
        })
      }

      return NextResponse.json({
        success: true,
        message: "Position synced from blockchain",
        position: {
          id: position.id,
          healthFactor: healthFactor,
          totalSupplied,
          totalBorrowed,
        },
      })
    } catch (blockchainError) {
      console.error("[AAVE_SYNC_BLOCKCHAIN_ERROR]", blockchainError)
      return NextResponse.json(
        {
          error: "Failed to sync from blockchain",
          message: blockchainError instanceof Error ? blockchainError.message : "Unknown error",
          note: "Make sure the contracts are deployed and the address has positions on AAVE/Moola Market",
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[ADMIN_AAVE_SYNC_ERROR]", error)
    return NextResponse.json({ error: "Failed to sync AAVE position" }, { status: 500 })
  }
}

