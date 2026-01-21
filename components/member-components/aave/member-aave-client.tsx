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
  TrendingDown,
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
  Database,
  ArrowRight,
  Building2,
  Blocks,
  FileText,
  Coins,
  Copy,
  XCircle,
  RotateCcw,
  Landmark,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for member's ledger
const memberLedgerEntries = [
  { id: "ML001", type: "DEPOSIT", amount: 100, asset: "cUSD", date: "2024-03-15T10:30:00", status: "CONFIRMED", txHash: "0xabc123...", description: "Monthly contribution" },
  { id: "ML002", type: "INTEREST", amount: 2.50, asset: "cUSD", date: "2024-03-14T00:00:00", status: "CONFIRMED", txHash: "0xdef456...", description: "Daily interest earned" },
  { id: "ML003", type: "DEPOSIT", amount: 100, asset: "cUSD", date: "2024-03-01T08:00:00", status: "CONFIRMED", txHash: "0xghi789...", description: "Monthly contribution" },
  { id: "ML004", type: "WITHDRAW", amount: 50, asset: "cUSD", date: "2024-02-28T14:20:00", status: "CONFIRMED", txHash: "0xjkl012...", description: "Partial withdrawal" },
  { id: "ML005", type: "INTEREST", amount: 2.35, asset: "cUSD", date: "2024-02-27T00:00:00", status: "CONFIRMED", txHash: "0xmno345...", description: "Daily interest earned" },
  { id: "ML006", type: "FEE", amount: 0.25, asset: "cUSD", date: "2024-02-26T23:59:00", status: "CONFIRMED", txHash: "0xpqr678...", description: "Platform fee" },
]

// Member's interest flow data
const memberInterestFlow = {
  principal: 1200,
  yieldSources: [
    { name: "AAVE Supply APY", rate: 2.5, amount: 30 },
    { name: "Group Lending", rate: 4.2, amount: 50.40 },
  ],
  grossInterest: 80.40,
  platformFee: 8.04,
  netInterest: 72.36,
}

// Member's group ledger data
const memberGroupLedger = {
  groupName: "Village Savings Group",
  myContributions: 1200,
  myLoansReceived: 0,
  myRepayments: 0,
  myPenalties: 0,
  mySharePercentage: 8.5,
  groupTotalContributions: 15000,
  groupTotalLoans: 6000,
}

// Mock data for member's position
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
    memberSuppliedShare: 1275,
    memberBorrowedShare: 510,
    memberEarnings: 42.5,
    supplies: [
      { asset: "cUSD", groupAmount: 10000, memberShare: 850, apy: 2.5, ltv: 0.8, earnings: 28.5 },
      { asset: "CELO", groupAmount: 100, memberShare: 425, apy: 3.5, ltv: 0.7, earnings: 14.0 },
    ],
    borrows: [
      { asset: "cUSD", groupAmount: 5000, memberShare: 425, apy: 4.2, interest: 17.85 },
      { asset: "CELO", groupAmount: 20, memberShare: 85, apy: 5.5, interest: 4.675 },
    ],
  },
}

// Available assets with current rates
const availableAssets = [
  { symbol: "cUSD", name: "Celo Dollar", icon: "💵", supplyAPY: 2.5, borrowAPY: 4.2, available: 500 },
  { symbol: "CELO", name: "Celo Native", icon: "🟢", supplyAPY: 3.5, borrowAPY: 5.5, available: 10 },
  { symbol: "cEUR", name: "Celo Euro", icon: "💶", supplyAPY: 2.0, borrowAPY: 3.8, available: 300 },
]

export default function MemberAaveClient() {
  const [activeTab, setActiveTab] = useState("my-ledger")
  const [actionDialog, setActionDialog] = useState<{ type: "supply" | "borrow" | "withdraw" | null }>({ type: null })
  const [selectedAsset, setSelectedAsset] = useState("cUSD")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<typeof memberLedgerEntries[0] | null>(null)

  const handleAction = async (type: "supply" | "borrow" | "withdraw") => {
    setActionDialog({ type })
  }

  const handleSubmitAction = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setActionDialog({ type: null })
    setAmount("")
  }

  const getHealthFactorColor = (factor: number) => {
    if (factor >= 2.0) return "text-green-500"
    if (factor >= 1.5) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthFactorBgColor = (factor: number) => {
    if (factor >= 2.0) return "bg-green-500/10"
    if (factor >= 1.5) return "bg-yellow-500/10"
    return "bg-red-500/10"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
                <h1 className="text-xl font-semibold">{memberData.name}</h1>
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
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Total Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(memberData.aavePosition.memberSuppliedShare)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{memberData.contribution.sharePercentage}% of group</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-500">+{formatCurrency(memberData.aavePosition.memberEarnings)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{memberData.aavePosition.groupNetAPY}% APY</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${getHealthFactorBgColor(memberData.aavePosition.groupHealthFactor)} border-green-500/20`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Health Factor</p>
                  <p className={`text-2xl font-bold ${getHealthFactorColor(memberData.aavePosition.groupHealthFactor)}`}>
                    {memberData.aavePosition.groupHealthFactor.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {memberData.aavePosition.groupHealthFactor >= 2.0 ? "Healthy" : memberData.aavePosition.groupHealthFactor >= 1.5 ? "Warning" : "Critical"}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-full ${getHealthFactorBgColor(memberData.aavePosition.groupHealthFactor)} flex items-center justify-center`}>
                  <Shield className={`h-6 w-6 ${getHealthFactorColor(memberData.aavePosition.groupHealthFactor)}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Contribution</p>
                  <p className="text-2xl font-bold">{formatCurrency(memberData.contribution.totalContributed)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{memberData.contribution.contributionStreak} months streak</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-cyan-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pollen Ledger-Driven Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="my-ledger" className="text-xs py-2 gap-1">
              <Database className="h-3 w-3" />
              <span className="hidden sm:inline">My Ledger</span>
              <span className="sm:hidden">Ledger</span>
            </TabsTrigger>
            <TabsTrigger value="group-ledger" className="text-xs py-2 gap-1">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Group Ledger</span>
              <span className="sm:hidden">Group</span>
            </TabsTrigger>
            <TabsTrigger value="interest-flow" className="text-xs py-2 gap-1">
              <Coins className="h-3 w-3" />
              <span className="hidden sm:inline">Interest Flow</span>
              <span className="sm:hidden">Interest</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs py-2 gap-1">
              <ArrowUpRight className="h-3 w-3" />
              <span className="hidden sm:inline">Actions</span>
              <span className="sm:hidden">Act</span>
            </TabsTrigger>
          </TabsList>

          {/* My Ledger Tab - Personal Transaction History */}
          <TabsContent value="my-ledger" className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Database className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Personal Ledger</CardTitle>
                    <CardDescription>Your complete transaction history and balance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Personal Ledger Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  <Card className="bg-green-500/10 border-green-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-muted-foreground">Deposits</span>
                      </div>
                      <p className="text-xl font-bold text-green-500">+{formatCurrency(1200)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownLeft className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-muted-foreground">Withdrawals</span>
                      </div>
                      <p className="text-xl font-bold text-red-500">-{formatCurrency(50)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-cyan-500/10 border-cyan-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-cyan-500" />
                        <span className="text-xs text-muted-foreground">Interest Earned</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-500">+{formatCurrency(42.50)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                        <span className="text-xs text-muted-foreground">Fees Paid</span>
                      </div>
                      <p className="text-xl font-bold text-orange-500">-{formatCurrency(0.25)}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Ledger Entries Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-xs">Date</TableHead>
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs">Description</TableHead>
                          <TableHead className="text-xs text-right">Amount</TableHead>
                          <TableHead className="text-xs">Status</TableHead>
                          <TableHead className="text-xs">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {memberLedgerEntries.map((entry) => (
                          <TableRow key={entry.id} className="hover:bg-muted/30">
                            <TableCell className="text-xs">{formatDate(entry.date)}</TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${
                                entry.type === "DEPOSIT" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                entry.type === "WITHDRAW" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                entry.type === "INTEREST" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                                "bg-orange-500/10 text-orange-500 border-orange-500/20"
                              }`}>
                                {entry.type === "DEPOSIT" && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                {entry.type === "WITHDRAW" && <ArrowDownLeft className="h-3 w-3 mr-1" />}
                                {entry.type === "INTEREST" && <TrendingUp className="h-3 w-3 mr-1" />}
                                {entry.type === "FEE" && <TrendingDown className="h-3 w-3 mr-1" />}
                                {entry.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{entry.description}</TableCell>
                            <TableCell className={`text-right font-medium text-xs ${
                              entry.type === "DEPOSIT" || entry.type === "INTEREST" ? "text-green-500" : "text-red-500"
                            }`}>
                              {entry.type === "DEPOSIT" || entry.type === "INTEREST" ? "+" : "-"}
                              {formatCurrency(entry.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-500/10 text-green-500 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {entry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedEntry(entry)}>
                                <FileText className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Group Ledger Tab - Village Banking */}
          <TabsContent value="group-ledger" className="space-y-4">
            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Village Banking Ledger</CardTitle>
                    <CardDescription>Your position in {memberGroupLedger.groupName}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* My Position in Group */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        My Group Position
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">My Contributions</span>
                        <span className="font-medium text-green-500">+{formatCurrency(memberGroupLedger.myContributions)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Loans Received</span>
                        <span className="font-medium text-orange-500">-{formatCurrency(memberGroupLedger.myLoansReceived)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">My Repayments</span>
                        <span className="font-medium text-cyan-500">+{formatCurrency(memberGroupLedger.myRepayments)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Penalties</span>
                        <span className="font-medium text-red-500">+{formatCurrency(memberGroupLedger.myPenalties)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="text-sm font-medium">My Share</span>
                        <Badge className="bg-indigo-500/10 text-indigo-500">{memberGroupLedger.mySharePercentage}%</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Group Totals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Contributions</span>
                        <span className="font-medium">{formatCurrency(memberGroupLedger.groupTotalContributions)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Loans Issued</span>
                        <span className="font-medium">{formatCurrency(memberGroupLedger.groupTotalLoans)}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">My Share of Group</span>
                          <span>{memberGroupLedger.mySharePercentage}%</span>
                        </div>
                        <Progress value={memberGroupLedger.mySharePercentage} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Execution Layer Info */}
                <Card className="bg-muted/50">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Execution Layer (Bank / Blockchain)</CardTitle>
                    <CardDescription className="text-xs">Where your funds are held</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">Mobile Money</p>
                          <p className="text-xs text-muted-foreground">Traditional banking</p>
                        </div>
                        <Badge className="ml-auto bg-green-500/10 text-green-500 text-xs">Connected</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-lg">
                        <Blocks className="h-6 w-6 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium">Celo Blockchain</p>
                          <p className="text-xs text-muted-foreground">cUSD, CELO assets</p>
                        </div>
                        <Badge className="ml-auto bg-green-500/10 text-green-500 text-xs">Synced</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interest Flow Tab */}
          <TabsContent value="interest-flow" className="space-y-4">
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-cyan-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">My Savings Interest Flow</CardTitle>
                    <CardDescription>Track how your interest is generated</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Flow Visualization */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  <Card className="bg-blue-500/10 border-blue-500/20">
                    <CardContent className="p-4 text-center">
                      <PiggyBank className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">My Principal</p>
                      <p className="text-xl font-bold">{formatCurrency(memberInterestFlow.principal)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-500/10 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Gross Interest</p>
                      <p className="text-xl font-bold text-green-500">+{formatCurrency(memberInterestFlow.grossInterest)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-500/10 border-orange-500/20">
                    <CardContent className="p-4 text-center">
                      <TrendingDown className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Platform Fee (10%)</p>
                      <p className="text-xl font-bold text-red-500">-{formatCurrency(memberInterestFlow.platformFee)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-500/10 border-green-500/20">
                    <CardContent className="p-4 text-center">
                      <Wallet className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">Net to You</p>
                      <p className="text-xl font-bold text-green-500">{formatCurrency(memberInterestFlow.netInterest)}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Yield Sources */}
                <Card className="bg-muted/50">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Your Yield Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    {memberInterestFlow.yieldSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-cyan-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{source.name}</p>
                            <p className="text-xs text-muted-foreground">{source.rate}% APY</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-green-500">+{formatCurrency(source.amount)}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Your interest is calculated based on your {memberGroupLedger.mySharePercentage}% share of the group's pooled assets earning yield through AAVE and group lending.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab - Supply, Withdraw */}
          <TabsContent value="actions" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-green-500" />
                    Deposit / Supply
                  </CardTitle>
                  <CardDescription>Add funds to your group's AAVE position</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {availableAssets.map((asset) => (
                      <Card key={asset.symbol} className="bg-green-500/5 border-green-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{asset.icon}</span>
                            <Badge className="bg-green-500/10 text-green-500">{asset.supplyAPY}% APY</Badge>
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{asset.symbol}</h3>
                          <p className="text-xs text-muted-foreground mb-3">{asset.name}</p>
                          <Button
                            onClick={() => {
                              setSelectedAsset(asset.symbol)
                              handleAction("supply")
                            }}
                            className="w-full"
                            size="sm"
                          >
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Deposit
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowDownLeft className="h-5 w-5 text-orange-500" />
                    Withdraw
                  </CardTitle>
                  <CardDescription>Withdraw funds from your position</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-4">
                    {memberData.aavePosition.supplies.map((supply) => (
                      <div key={supply.asset} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                            <span className="text-lg">{supply.asset === "cUSD" ? "💵" : "🟢"}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{supply.asset}</p>
                            <p className="text-xs text-muted-foreground">Balance: {formatCurrency(supply.memberShare)}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAsset(supply.asset)
                            handleAction("withdraw")
                          }}
                          className="bg-transparent"
                        >
                          <ArrowDownLeft className="mr-2 h-4 w-4" />
                          Withdraw
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Withdrawals are subject to group approval and available liquidity. Large withdrawals may affect the group's health factor.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ledger Entry Details Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete record of your transaction</DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Entry ID</p>
                  <p className="font-mono text-sm">{selectedEntry.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge className={`text-xs ${
                    selectedEntry.type === "DEPOSIT" ? "bg-green-500/10 text-green-500" :
                    selectedEntry.type === "WITHDRAW" ? "bg-red-500/10 text-red-500" :
                    selectedEntry.type === "INTEREST" ? "bg-cyan-500/10 text-cyan-500" :
                    "bg-orange-500/10 text-orange-500"
                  }`}>{selectedEntry.type}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className={`font-medium ${selectedEntry.type === "DEPOSIT" || selectedEntry.type === "INTEREST" ? "text-green-500" : "text-red-500"}`}>
                    {selectedEntry.type === "DEPOSIT" || selectedEntry.type === "INTEREST" ? "+" : "-"}
                    {formatCurrency(selectedEntry.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Asset</p>
                  <p className="text-sm">{selectedEntry.asset}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedEntry.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm">{formatDate(selectedEntry.date)}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">Blockchain Details</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-xs">Transaction Hash</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs">{selectedEntry.txHash}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(selectedEntry.txHash)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-xs">Status</span>
                    <Badge className="bg-green-500/10 text-green-500 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {selectedEntry.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEntry(null)} className="bg-transparent">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={!!actionDialog.type} onOpenChange={() => setActionDialog({ type: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.type === "supply" && <ArrowUpRight className="h-5 w-5 text-green-500" />}
              {actionDialog.type === "withdraw" && <ArrowDownLeft className="h-5 w-5 text-orange-500" />}
              {actionDialog.type === "supply" ? "Deposit" : "Withdraw"} {selectedAsset}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "supply"
                ? "Add funds to your group's AAVE position"
                : "Withdraw funds from your position"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({selectedAsset})</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {actionDialog.type === "supply" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Your deposit will be added to the group pool. You'll earn {availableAssets.find(a => a.symbol === selectedAsset)?.supplyAPY || 0}% APY on your contribution.
                </AlertDescription>
              </Alert>
            )}
            {actionDialog.type === "withdraw" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Withdrawals require group approval and may take 24-48 hours to process.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ type: null })} className="bg-transparent">
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
                  {actionDialog.type === "supply" ? "Deposit" : "Withdraw"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
