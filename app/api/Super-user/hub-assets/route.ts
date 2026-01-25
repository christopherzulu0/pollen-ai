import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { getReserveData, TOKENS } from "@/lib/aave-helper"
import { prisma } from "@/lib/prisma"

// Token name mapping
const TOKEN_NAMES: Record<string, string> = {
  cUSD: "Celo Dollar",
  CELO: "Celo Native",
  cEUR: "Celo Euro",
}

// GET endpoint to fetch hub assets data from blockchain or database
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin role in any organization (same check as aave-positions)
    const clerkClientInstance = await clerkClient()
    const userOrganizations = await clerkClientInstance.users.getOrganizationMembershipList({
      userId: userId,
    })

    const hasAdminRole = userOrganizations.data?.some((orgMembership) => {
      const role = orgMembership.role
      return role === "org:admin" || role === "admin" || role?.includes("admin")
    })

    if (!hasAdminRole) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      )
    }

    // Check if AAVE/Moola contracts are configured
    const LENDING_POOL_ADDRESS = process.env.NEXT_PUBLIC_AAVE_LENDING_POOL_ADDRESS || process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS || "0xCDAA20B0BcBAEe267D3529111eEc80b0Ed60442d"
    const isBlockchainAvailable = LENDING_POOL_ADDRESS && LENDING_POOL_ADDRESS !== "0x..."

    const hubAssets = []

    if (isBlockchainAvailable) {
      // Try to fetch from blockchain first
      for (const [symbol, address] of Object.entries(TOKENS)) {
        try {
          const reserveData = await getReserveData(address)
          
          // Skip if reserve data is null (reserve doesn't exist or call failed)
          if (!reserveData) {
            continue
          }

          // Calculate values
          const availableLiquidity = parseFloat(reserveData.availableLiquidity)
          const totalStableDebt = parseFloat(reserveData.totalStableDebt)
          const totalVariableDebt = parseFloat(reserveData.totalVariableDebt)
          const totalDebt = totalStableDebt + totalVariableDebt
          const totalLiquidity = availableLiquidity + totalDebt

          // Calculate utilization rate (total debt / total liquidity)
          const utilizationRate = totalLiquidity > 0 ? (totalDebt / totalLiquidity) * 100 : 0

          // Convert APY from Ray units to percentage
          // Ray units are in 1e27, so multiply by 100 to get percentage
          const supplyAPY = parseFloat(reserveData.liquidityRate) * 100
          const borrowAPY = parseFloat(reserveData.variableBorrowRate) * 100

          hubAssets.push({
            symbol,
            name: TOKEN_NAMES[symbol] || symbol,
            totalLiquidity,
            utilizationRate,
            supplyAPY,
            borrowAPY,
          })
        } catch (error) {
          console.error(`Error fetching reserve data for ${symbol}:`, error)
          // Continue to next token if one fails
          continue
        }
      }
    }

    // If blockchain data is not available or empty, fetch from database
    if (hubAssets.length === 0) {
      try {
        const dbHubAssets = await prisma.hubAsset.findMany({
          where: {
            isActive: true,
          },
          orderBy: {
            totalLiquidity: "desc",
          },
        })

        // Transform database data to match expected format
        for (const asset of dbHubAssets) {
          hubAssets.push({
            symbol: asset.symbol,
            name: asset.name,
            totalLiquidity: Number(asset.totalLiquidity),
            utilizationRate: Number(asset.utilizationRate),
            supplyAPY: Number(asset.supplyAPY),
            borrowAPY: Number(asset.borrowAPY),
          })
        }
      } catch (dbError) {
        console.error("[HUB_ASSETS_DB_ERROR]", dbError)
        // Database fetch failed - return empty array
      }
    }

    // Sort by total liquidity (descending)
    hubAssets.sort((a, b) => b.totalLiquidity - a.totalLiquidity)

    // Return real data only (empty array if no data available)
    return NextResponse.json(hubAssets)
  } catch (error) {
    console.error("[ADMIN_AAVE_HUB_ASSETS_ERROR]", error)
    // Return empty array on error - no fallback data
    return NextResponse.json([])
  }
}

