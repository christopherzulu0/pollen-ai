"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  Wallet,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ExternalLink,
  PiggyBank,
  Users,
  Activity,
  Clock,
  Shield,
} from "lucide-react"

// Mock data for member's group and position
const memberData = {
  id: "member-1",
  name: "Alice Johnson",
  avatar: "/thoughtful-man-in-library.png",
  email: "alice@example.com",
  group: {
    id: "group-1",
    name: "Village Savings Group",
    logo: "/savings-group.jpg",
    totalMembers: 12,
    memberRole: "MEMBER",
    joinedDate: "2024-01-15",
  },
  contribution: {
    totalContributed: 1200,
    sharePercentage: 8.5,
    monthlyContribution: 100,
    contributionStreak: 12,
  },
  aavePosition: {
    groupTotalSupplied: 15000,
    groupTotalBorrowed: 6000,
    groupHealthFactor: 2.45,
    groupAvailableToBorrow: 4500,
    groupNetAPY: 3.2,
    memberSuppliedShare: 1275, // 8.5% of total supplied
    memberBorrowedShare: 510, // 8.5% of total borrowed
    memberEarnings: 42.5,
    supplies: [
      {
        asset: "cUSD",
        groupAmount: 10000,
        memberShare: 850,
        apy: 2.5,
        ltv: 0.8,
        earnings: 28.5,
      },
      {
        asset: "CELO",
        groupAmount: 100,
        memberShare: 425,
        apy: 3.5,
        ltv: 0.7,
        earnings: 14.0,
      },
    ],
    borrows: [
      {
        asset: "cUSD",
        groupAmount: 5000,
        memberShare: 425,
        apy: 4.2,
        interest: 17.85,
      },
      {
        asset: "CELO",
        groupAmount: 20,
        memberShare: 85,
        apy: 5.5,
        interest: 4.675,
      },
    ],
  },
  recentActivity: [
    {
      type: "SUPPLY",
      asset: "cUSD",
      amount: 100,
      date: "2024-03-15T10:30:00",
      status: "COMPLETED",
      txHash: "0xabc123...",
    },
    {
      type: "EARN",
      asset: "cUSD",
      amount: 2.5,
      date: "2024-03-14T00:00:00",
      status: "COMPLETED",
      txHash: "0xdef456...",
    },
    {
      type: "CONTRIBUTION",
      asset: "cUSD",
      amount: 100,
      date: "2024-03-01T08:00:00",
      status: "COMPLETED",
      txHash: "0xghi789...",
    },
  ],
}

// Available assets with current rates
const availableAssets = [
  {
    symbol: "cUSD",
    name: "Celo Dollar",
    icon: "💵",
    supplyAPY: 2.5,
    borrowAPY: 4.2,
    available: 500,
  },
  {
    symbol: "CELO",
    name: "Celo Native",
    icon: "🟢",
    supplyAPY: 3.5,
    borrowAPY: 5.5,
    available: 10,
  },
  {
    symbol: "cEUR",
    name: "Celo Euro",
    icon: "💶",
    supplyAPY: 2.0,
    borrowAPY: 3.8,
    available: 300,
  },
]

export default function MemberAaveClient() {
  const [activeTab, setActiveTab] = useState("overview")
  const [actionDialog, setActionDialog] = useState<{
    type: "supply" | "borrow" | "withdraw" | null
  }>({ type: null })
  const [selectedAsset, setSelectedAsset] = useState("cUSD")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (type: "supply" | "borrow" | "withdraw") => {
    setActionDialog({ type })
  }

  const handleSubmitAction = async () => {
    setIsProcessing(true)
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setActionDialog({ type: null })
    setAmount("")
  }

  const getHealthFactorColor = (factor: number) => {
    if (factor >= 2.0) return "text-success"
    if (factor >= 1.5) return "text-warning"
    return "text-destructive"
  }

  const getHealthFactorBgColor = (factor: number) => {
    if (factor >= 2.0) return "bg-success/10"
    if (factor >= 1.5) return "bg-warning/10"
    return "bg-destructive/10"
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "SUPPLY":
        return <ArrowUpRight className="h-4 w-4 text-success" />
      case "BORROW":
        return <ArrowDownLeft className="h-4 w-4 text-warning" />
      case "EARN":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "CONTRIBUTION":
        return <DollarSign className="h-4 w-4 text-info" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={memberData.avatar || "/placeholder.svg"} alt={memberData.name} />
                <AvatarFallback>{memberData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{memberData.name}</h1>
                <p className="text-sm text-muted-foreground">{memberData.group.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                {memberData.group.memberRole}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Member since Jan 2024
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(memberData.aavePosition.memberSuppliedShare)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {memberData.contribution.sharePercentage}% of group
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-success">
                    +{formatCurrency(memberData.aavePosition.memberEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{memberData.aavePosition.groupNetAPY}% APY</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${getHealthFactorBgColor(memberData.aavePosition.groupHealthFactor)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Health Factor</p>
                  <p
                    className={`text-2xl font-bold ${getHealthFactorColor(memberData.aavePosition.groupHealthFactor)}`}
                  >
                    {memberData.aavePosition.groupHealthFactor.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {memberData.aavePosition.groupHealthFactor >= 2.0
                      ? "Healthy"
                      : memberData.aavePosition.groupHealthFactor >= 1.5
                        ? "Warning"
                        : "Critical"}
                  </p>
                </div>
                <Shield className={`h-8 w-8 ${getHealthFactorColor(memberData.aavePosition.groupHealthFactor)}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Contribution</p>
                  <p className="text-2xl font-bold">{formatCurrency(memberData.contribution.totalContributed)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {memberData.contribution.contributionStreak} months streak
                  </p>
                </div>
                <PiggyBank className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="supply" className="text-xs sm:text-sm py-2">
              Supply & Earn
            </TabsTrigger>
            <TabsTrigger value="borrow" className="text-xs sm:text-sm py-2">
              Borrow
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm py-2">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Group Position Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Group AAVE Position
                  </CardTitle>
                  <CardDescription>Total assets managed by your group</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-success/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supplied</p>
                      <p className="text-xl font-bold text-success">
                        {formatCurrency(memberData.aavePosition.groupTotalSupplied)}
                      </p>
                    </div>
                    <ArrowUpRight className="h-8 w-8 text-success" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-warning/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Borrowed</p>
                      <p className="text-xl font-bold text-warning">
                        {formatCurrency(memberData.aavePosition.groupTotalBorrowed)}
                      </p>
                    </div>
                    <ArrowDownLeft className="h-8 w-8 text-warning" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Available to Borrow</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(memberData.aavePosition.groupAvailableToBorrow)}
                      </p>
                    </div>
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              {/* My Position Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    My Position
                  </CardTitle>
                  <CardDescription>Your share of the group's AAVE position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">My Share</span>
                      <span className="font-medium">{memberData.contribution.sharePercentage}%</span>
                    </div>
                    <Progress value={memberData.contribution.sharePercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">My Supplied</p>
                      <p className="text-lg font-bold text-success">
                        {formatCurrency(memberData.aavePosition.memberSuppliedShare)}
                      </p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">My Borrowed</p>
                      <p className="text-lg font-bold text-warning">
                        {formatCurrency(memberData.aavePosition.memberBorrowedShare)}
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Your position is calculated based on your {memberData.contribution.sharePercentage}% contribution
                      share in the group.
                    </AlertDescription>
                  </Alert>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Net Earnings</span>
                      <span className="text-lg font-bold text-success">
                        +{formatCurrency(memberData.aavePosition.memberEarnings)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Supplied Assets Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Supplied Assets</CardTitle>
                <CardDescription>Your share of assets earning interest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberData.aavePosition.supplies.map((supply) => (
                    <div key={supply.asset} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg">
                            {supply.asset === "cUSD" ? "💵" : supply.asset === "CELO" ? "🟢" : "💶"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{supply.asset}</p>
                          <p className="text-sm text-muted-foreground">
                            My Share: {formatCurrency(supply.memberShare)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          {supply.apy}% APY
                        </Badge>
                        <p className="text-sm text-success">+{formatCurrency(supply.earnings)} earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supply & Earn Tab */}
          <TabsContent value="supply" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supply Assets & Earn Interest</CardTitle>
                <CardDescription>Contribute to your group's AAVE position and earn passive income</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    When you supply assets, they're added to your group's pooled position. You'll earn interest based on
                    your contribution share.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableAssets.map((asset) => (
                    <Card key={asset.symbol} className="bg-gradient-to-br from-primary/5 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                            {asset.icon}
                          </div>
                          <Badge variant="secondary">{asset.supplyAPY}% APY</Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{asset.symbol}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{asset.name}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Available</span>
                            <span className="font-medium">
                              {asset.available} {asset.symbol}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedAsset(asset.symbol)
                            handleAction("supply")
                          }}
                          className="w-full"
                        >
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Supply {asset.symbol}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Borrow Tab */}
          <TabsContent value="borrow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Borrow Against Collateral</CardTitle>
                <CardDescription>Request to borrow funds backed by your group's supplied assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Borrowing requires group approval. Ensure the health factor stays above 1.5 to avoid liquidation.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Group Available to Borrow</span>
                    <span className="font-medium">
                      {formatCurrency(memberData.aavePosition.groupAvailableToBorrow)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">My Estimated Limit</span>
                    <span className="font-medium">
                      {formatCurrency(
                        memberData.aavePosition.groupAvailableToBorrow *
                          (memberData.contribution.sharePercentage / 100),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Health Factor</span>
                    <span className={`font-medium ${getHealthFactorColor(memberData.aavePosition.groupHealthFactor)}`}>
                      {memberData.aavePosition.groupHealthFactor.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableAssets.map((asset) => (
                    <Card key={asset.symbol} className="bg-gradient-to-br from-warning/5 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center text-2xl">
                            {asset.icon}
                          </div>
                          <Badge variant="outline" className="text-warning">
                            {asset.borrowAPY}% APY
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{asset.symbol}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{asset.name}</p>
                        <Button
                          onClick={() => {
                            setSelectedAsset(asset.symbol)
                            handleAction("borrow")
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <ArrowDownLeft className="mr-2 h-4 w-4" />
                          Borrow {asset.symbol}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your AAVE transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {getTransactionIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium">{activity.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.amount} {activity.asset}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDate(activity.date)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={activity.status === "COMPLETED" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {activity.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialog.type !== null} onOpenChange={() => setActionDialog({ type: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "supply" && "Supply Asset"}
              {actionDialog.type === "borrow" && "Request Borrow"}
              {actionDialog.type === "withdraw" && "Withdraw Asset"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "supply" && "Add funds to your group's AAVE position to earn interest"}
              {actionDialog.type === "borrow" && "Submit a borrow request that requires group approval"}
              {actionDialog.type === "withdraw" && "Withdraw your supplied assets"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      {asset.icon} {asset.symbol} - {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Available: {availableAssets.find((a) => a.symbol === selectedAsset)?.available} {selectedAsset}
              </p>
            </div>

            {actionDialog.type === "supply" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Estimated earnings: {formatCurrency(Number.parseFloat(amount || "0") * 0.025)} per year
                </AlertDescription>
              </Alert>
            )}

            {actionDialog.type === "borrow" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This request requires approval from {Math.ceil(memberData.group.totalMembers / 2)} group members
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ type: null })} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAction} disabled={isProcessing || !amount}>
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {actionDialog.type === "supply" && "Supply"}
                  {actionDialog.type === "borrow" && "Request"}
                  {actionDialog.type === "withdraw" && "Withdraw"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
