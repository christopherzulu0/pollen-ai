"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ExternalLink,
  Activity,
  Info,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Position = {
  id: string
  groupId: string
  groupName: string
  spokeAddress: string
  healthFactor: number
  totalSupplied: number
  totalBorrowed: number
  availableToBorrow: number
  netAPY: number
  liquidationThreshold: number
  loanToValue: number
  supplies: Array<{
    asset: string
    amount: number
    apy: number
    ltv: number
    balance: number
    valueUSD: number
  }>
  borrows: Array<{
    asset: string
    amount: number
    apy: number
    balance: number
    valueUSD: number
  }>
  recentActivity: Array<{
    type: string
    asset: string
    amount: number
    date: string
    txHash: string
  }>
}

export default function PositionDetailsClient({
  position,
  groupId,
}: {
  position: Position | undefined
  groupId: string
}) {
  const router = useRouter()
  const [actionDialog, setActionDialog] = useState<{ type: "supply" | "borrow" | "repay" | "withdraw" | null }>({
    type: null,
  })
  const [actionAmount, setActionAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("")

  if (!position) {
    return (
      <div className="p-6">
        <Button onClick={() => router.push("/Super-user")} variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Position not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 2.0) return "text-green-500"
    if (healthFactor >= 1.5) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 2.0)
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Healthy
        </Badge>
      )
    if (healthFactor >= 1.5)
      return (
        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Warning
        </Badge>
      )
    return (
      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Critical
      </Badge>
    )
  }

  const handleAction = (type: "supply" | "borrow" | "repay" | "withdraw") => {
    setActionDialog({ type })
    setActionAmount("")
    setSelectedAsset("")
  }

  const executeAction = () => {
    console.log(`[v0] Executing ${actionDialog.type}: ${actionAmount} ${selectedAsset}`)
    // Here you would call AAVE v4 smart contracts
    setActionDialog({ type: null })
    setActionAmount("")
    setSelectedAsset("")
  }

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case "SUPPLY":
      case "DEPOSIT":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "WITHDRAW":
        return <ArrowDownLeft className="h-4 w-4 text-orange-500" />
      case "BORROW":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "REPAY":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => router.push("/Super-user")} variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{position.groupName}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Spoke: {position.spokeAddress.slice(0, 6)}...{position.spokeAddress.slice(-4)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleAction("supply")} size="sm" className="bg-green-600 hover:bg-green-700">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Supply
            </Button>
            <Button onClick={() => handleAction("borrow")} size="sm" className="bg-orange-600 hover:bg-orange-700">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Borrow
            </Button>
            <Button onClick={() => handleAction("repay")} size="sm" variant="outline">
              Repay
            </Button>
            <Button onClick={() => handleAction("withdraw")} size="sm" variant="outline">
              Withdraw
            </Button>
          </div>
        </div>

        {/* Health Factor Alert */}
        {position.healthFactor < 1.5 && (
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              <strong>Warning:</strong> This position has a low health factor ({position.healthFactor.toFixed(2)}) and
              is at risk of liquidation. Consider repaying debt or supplying more collateral.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Factor</p>
                  <p className={`text-3xl font-bold mt-2 ${getHealthFactorColor(position.healthFactor)}`}>
                    {position.healthFactor.toFixed(2)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">{getHealthFactorBadge(position.healthFactor)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Supplied</p>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(position.totalSupplied)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Earning {position.supplies.reduce((sum, s) => sum + s.apy, 0) / position.supplies.length}% APY
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Borrowed</p>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(position.totalBorrowed)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Paying {position.borrows.reduce((sum, b) => sum + b.apy, 0) / position.borrows.length}% APY
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available to Borrow</p>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(position.availableToBorrow)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Net APY: {position.netAPY > 0 ? "+" : ""}
                {position.netAPY}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Position Details */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Supplied Assets */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Supplied Assets</span>
                <Badge variant="outline">{position.supplies.length} Assets</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {position.supplies.map((supply) => (
                  <div key={supply.asset} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{supply.asset}</h3>
                        <p className="text-sm text-muted-foreground">Supply APY: {supply.apy}%</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">
                          {supply.amount} {supply.asset}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value (USD)</span>
                        <span className="font-medium">{formatCurrency(supply.valueUSD)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">LTV</span>
                        <span className="font-medium">{(supply.ltv * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <Progress value={(supply.amount / supply.balance) * 100} className="mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Borrowed Assets */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Borrowed Assets</span>
                <Badge variant="outline">{position.borrows.length} Assets</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {position.borrows.map((borrow) => (
                  <div key={borrow.asset} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{borrow.asset}</h3>
                        <p className="text-sm text-muted-foreground">Borrow APY: {borrow.apy}%</p>
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Active</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Borrowed</span>
                        <span className="font-medium">
                          {borrow.amount} {borrow.asset}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Current Balance</span>
                        <span className="font-medium">
                          {borrow.balance} {borrow.asset}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Value (USD)</span>
                        <span className="font-medium">{formatCurrency(borrow.valueUSD)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Interest Accrued</span>
                        <span className="font-medium text-orange-500">
                          {borrow.balance - borrow.amount} {borrow.asset}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Metrics */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Loan to Value (LTV)</span>
                  <span className="text-sm font-bold">{(position.loanToValue * 100).toFixed(1)}%</span>
                </div>
                <Progress value={position.loanToValue * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Current borrowing power utilization</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Liquidation Threshold</span>
                  <span className="text-sm font-bold">{(position.liquidationThreshold * 100).toFixed(0)}%</span>
                </div>
                <Progress value={position.liquidationThreshold * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">Max LTV before liquidation risk</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Health Factor</span>
                  <span className={`text-sm font-bold ${getHealthFactorColor(position.healthFactor)}`}>
                    {position.healthFactor.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={Math.min((position.healthFactor / 3) * 100, 100)}
                  className="h-2"
                  indicatorClassName={
                    position.healthFactor >= 2.0
                      ? "bg-green-500"
                      : position.healthFactor >= 1.5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {position.healthFactor < 1
                    ? "Position can be liquidated"
                    : position.healthFactor < 1.5
                      ? "At high risk of liquidation"
                      : position.healthFactor < 2.0
                        ? "Moderate risk"
                        : "Low risk of liquidation"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {position.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getActionTypeIcon(activity.type)}
                    <div>
                      <p className="font-medium text-sm">
                        {activity.type} {activity.amount} {activity.asset}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={`https://celoscan.io/tx/${activity.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.type !== null} onOpenChange={() => setActionDialog({ type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">{actionDialog.type} Assets</DialogTitle>
            <DialogDescription>
              {actionDialog.type === "supply" && "Supply assets as collateral to earn interest"}
              {actionDialog.type === "borrow" && "Borrow assets against your collateral"}
              {actionDialog.type === "repay" && "Repay borrowed assets to reduce debt"}
              {actionDialog.type === "withdraw" && "Withdraw supplied assets"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cUSD">cUSD</SelectItem>
                  <SelectItem value="CELO">CELO</SelectItem>
                  <SelectItem value="cEUR">cEUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
              />
            </div>
            {actionDialog.type === "borrow" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Available to borrow: {formatCurrency(position.availableToBorrow)}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ type: null })}>
              Cancel
            </Button>
            <Button onClick={executeAction} disabled={!selectedAsset || !actionAmount}>
              Confirm {actionDialog.type}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
