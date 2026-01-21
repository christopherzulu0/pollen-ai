import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getReserveData, TOKENS } from "@/lib/aave-helper"

// Token name mapping
const TOKEN_NAMES: Record<string, string> = {
  cUSD: "Celo Dollar",
  CELO: "Celo Native",
  cEUR: "Celo Euro",
}

// GET endpoint to fetch hub assets data from blockchain
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if AAVE/Moola contracts are configured
    const LENDING_POOL_ADDRESS = process.env.NEXT_PUBLIC_AAVE_LENDING_POOL_ADDRESS || process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS
    const isBlockchainAvailable = LENDING_POOL_ADDRESS && LENDING_POOL_ADDRESS !== "0x..."

    if (!isBlockchainAvailable) {
      // Return empty array if blockchain not configured
      // Frontend will show appropriate message
      return NextResponse.json([])
    }

    const hubAssets = []

    // Fetch data for each supported token
    for (const [symbol, address] of Object.entries(TOKENS)) {
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
    }

    // Sort by total liquidity (descending)
    hubAssets.sort((a, b) => b.totalLiquidity - a.totalLiquidity)

    return NextResponse.json(hubAssets)
  } catch (error) {
    console.error("[ADMIN_AAVE_HUB_ASSETS_ERROR]", error)
    // Return empty array on error - frontend will handle gracefully
    return NextResponse.json([])
  }
}

