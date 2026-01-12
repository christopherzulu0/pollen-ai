"use client"
import { Suspense } from "react"
import PositionDetailsClient from "@/components/master-components/aave/position-details-client"

// Mock data - In production, fetch based on groupId
const positionData = {
  "group-1": {
    id: "1",
    groupId: "group-1",
    groupName: "Village Savings Group",
    spokeAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    healthFactor: 2.45,
    totalSupplied: 15000,
    totalBorrowed: 6000,
    availableToBorrow: 4500,
    netAPY: 3.2,
    liquidationThreshold: 0.75,
    loanToValue: 0.4,
    supplies: [
      { asset: "cUSD", amount: 10000, apy: 2.5, ltv: 0.8, balance: 10000, valueUSD: 10000 },
      { asset: "CELO", amount: 100, apy: 3.5, ltv: 0.7, balance: 100, valueUSD: 5000 },
    ],
    borrows: [
      { asset: "cUSD", amount: 5000, apy: 4.2, balance: 5050, valueUSD: 5050 },
      { asset: "CELO", amount: 20, apy: 5.5, balance: 20.5, valueUSD: 950 },
    ],
    recentActivity: [
      { type: "SUPPLY", asset: "cUSD", amount: 2000, date: "2024-03-15T10:30:00", txHash: "0xabc123..." },
      { type: "BORROW", asset: "cUSD", amount: 1000, date: "2024-03-14T14:20:00", txHash: "0xdef456..." },
      { type: "REPAY", asset: "CELO", amount: 5, date: "2024-03-13T09:15:00", txHash: "0xghi789..." },
      { type: "WITHDRAW", asset: "cUSD", amount: 500, date: "2024-03-12T16:00:00", txHash: "0xjkl012..." },
      { type: "SUPPLY", asset: "CELO", amount: 50, date: "2024-03-11T11:30:00", txHash: "0xmno345..." },
    ],
  },
  "group-2": {
    id: "2",
    groupId: "group-2",
    groupName: "Women Empowerment Fund",
    spokeAddress: "0x8e5A88b29A2b844Bc9e7595f0bEb1234567890",
    healthFactor: 1.82,
    totalSupplied: 8000,
    totalBorrowed: 4200,
    availableToBorrow: 1000,
    netAPY: 1.8,
    liquidationThreshold: 0.75,
    loanToValue: 0.525,
    supplies: [{ asset: "cUSD", amount: 8000, apy: 2.8, ltv: 0.8, balance: 8000, valueUSD: 8000 }],
    borrows: [{ asset: "cUSD", amount: 4200, apy: 4.5, balance: 4230, valueUSD: 4230 }],
    recentActivity: [
      { type: "SUPPLY", asset: "cUSD", amount: 1000, date: "2024-03-14T11:00:00", txHash: "0xjkl012..." },
      { type: "BORROW", asset: "cUSD", amount: 500, date: "2024-03-12T15:30:00", txHash: "0xmno345..." },
    ],
  },
  "group-3": {
    id: "3",
    groupId: "group-3",
    groupName: "Business Investment Group",
    spokeAddress: "0x9f6B99c30A3b844Bc9e7595f0bEb2345678901",
    healthFactor: 1.25,
    totalSupplied: 25000,
    totalBorrowed: 18000,
    availableToBorrow: 500,
    netAPY: -0.5,
    liquidationThreshold: 0.75,
    loanToValue: 0.72,
    supplies: [
      { asset: "cUSD", amount: 15000, apy: 2.2, ltv: 0.8, balance: 15000, valueUSD: 15000 },
      { asset: "CELO", amount: 200, apy: 3.0, ltv: 0.7, balance: 200, valueUSD: 10000 },
    ],
    borrows: [
      { asset: "cUSD", amount: 12000, apy: 4.8, balance: 12100, valueUSD: 12100 },
      { asset: "CELO", amount: 120, apy: 5.8, balance: 122, valueUSD: 5900 },
    ],
    recentActivity: [
      { type: "BORROW", asset: "cUSD", amount: 3000, date: "2024-03-15T16:45:00", txHash: "0xpqr678..." },
      { type: "SUPPLY", asset: "CELO", amount: 50, date: "2024-03-13T10:20:00", txHash: "0xstu901..." },
    ],
  },
}

export default async function PositionDetailsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const resolvedParams = await params
  const position = positionData[resolvedParams.groupId as keyof typeof positionData]

  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PositionDetailsClient position={position} groupId={resolvedParams.groupId} />
    </Suspense>
  )
}
