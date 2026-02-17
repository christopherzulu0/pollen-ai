"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  CreditCard,
  Shield,
  Calendar,
  Target,
  Coins,
  Landmark,
  Blocks,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  HandCoins,
  Receipt,
  CircleDollarSign,
} from "lucide-react"

// Mock user data derived from schema models
const userData = {
  name: "Alice Mwamba",
  email: "alice@example.com",
  memberId: "POL-2024-0042",
  memberSince: "2024-01-15",
}

// MemberBalance data
const memberBalance = {
  fiatBalance: 12450.00,
  fiatCurrency: "ZMW",
  celoBalance: 45.23,
  cusdBalance: 1250.00,
  ceurBalance: 0,
  lockedFiat: 2000.00,
  lockedCelo: 10.00,
  availableFiat: 10450.00,
  availableCelo: 35.23,
  totalInterestEarned: 856.40,
  pendingInterest: 42.50,
  primaryWalletAddress: "0x742d35Cc6634C0532925a3b8...f0bEb",
}

// Wallet data
const walletData = {
  celoAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  celoBalance: "45.23",
  cusdBalance: "1250.00",
  ceurBalance: "0.00",
  network: "alfajores",
  isConnected: true,
}

// Membership data
const memberships = [
  { groupId: "g1", groupName: "Village Savings Group", role: "MEMBER", status: "ACTIVE", balance: 4500, totalContributed: 12000, contributionStreak: 8 },
  { groupId: "g2", groupName: "Women Empowerment Fund", role: "ADMIN", status: "ACTIVE", balance: 2800, totalContributed: 8500, contributionStreak: 12 },
  { groupId: "g3", groupName: "Agri-Business Circle", role: "MEMBER", status: "ACTIVE", balance: 1200, totalContributed: 3600, contributionStreak: 3 },
]

// Personal savings & goals
const personalSavings = { balance: 3950.00 }
const savingsGoals = [
  { id: "sg1", name: "Emergency Fund", targetAmount: 10000, currentAmount: 7500, deadline: "2026-06-30", isCompleted: false },
  { id: "sg2", name: "School Fees", targetAmount: 5000, currentAmount: 4200, deadline: "2026-03-01", isCompleted: false },
  { id: "sg3", name: "Business Capital", targetAmount: 20000, currentAmount: 3800, deadline: "2026-12-31", isCompleted: false },
]

// Recent transactions (from Transaction model)
const recentTransactions = [
  { id: "t1", type: "CONTRIBUTION", amount: 500, status: "COMPLETED", description: "Monthly contribution - Village Savings", createdAt: "2026-02-15T10:30:00", groupName: "Village Savings Group" },
  { id: "t2", type: "INTEREST", amount: 42.50, status: "COMPLETED", description: "AAVE yield distribution", createdAt: "2026-02-14T00:00:00", groupName: null },
  { id: "t3", type: "DEPOSIT", amount: 2000, status: "COMPLETED", description: "Mobile money deposit", createdAt: "2026-02-13T14:20:00", groupName: null },
  { id: "t4", type: "LOAN_REPAYMENT", amount: 850, status: "COMPLETED", description: "Loan repayment installment", createdAt: "2026-02-12T09:15:00", groupName: "Women Empowerment Fund" },
  { id: "t5", type: "WITHDRAWAL", amount: 1000, status: "PENDING", description: "Bank withdrawal request", createdAt: "2026-02-11T16:45:00", groupName: null },
]

// Loan data
const activeLoan = {
  id: "lr1",
  amount: 5000,
  status: "REPAYING",
  purpose: "Business expansion",
  interestRate: 5,
  repaymentDate: "2026-08-15",
  totalRepaid: 2550,
  remainingBalance: 2450,
  nextPaymentDate: "2026-03-01",
  nextPaymentAmount: 850,
  groupName: "Women Empowerment Fund",
}

// Insurance data
const activeInsurance = [
  { policyNumber: "POL-INS-001", productType: "crop", coverageAmount: 15000, premiumAmount: 150, status: "active", nextPremiumDue: "2026-03-15" },
]

// Upcoming meetings
const upcomingMeetings = [
  { id: "m1", title: "Monthly General Meeting", date: "2026-02-22T14:00:00", groupName: "Village Savings Group", isVirtual: false, location: "Community Hall" },
  { id: "m2", title: "Loan Review Session", date: "2026-02-25T10:00:00", groupName: "Women Empowerment Fund", isVirtual: true, meetingLink: "https://meet.google.com/xyz" },
]

// Interest distribution
const interestSummary = {
  totalEarned: 856.40,
  thisMonth: 42.50,
  lastMonth: 38.20,
  monthlyGrowth: 11.26,
  sources: [
    { name: "AAVE Supply", rate: 2.5, earned: 520 },
    { name: "Group Lending", rate: 4.2, earned: 280 },
    { name: "Staking", rate: 1.8, earned: 56.40 },
  ],
}

// Notifications count
const unreadNotifications = 3

function formatCurrency(amount: number, currency = "ZMW") {
  if (currency === "CELO" || currency === "cUSD" || currency === "cEUR") {
    return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
  }
  return `K ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-ZM", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-ZM", { hour: "2-digit", minute: "2-digit" })
}

function getTransactionIcon(type: string) {
  switch (type) {
    case "DEPOSIT": return <ArrowDownLeft className="h-4 w-4" />
    case "WITHDRAWAL": return <ArrowUpRight className="h-4 w-4" />
    case "CONTRIBUTION": return <HandCoins className="h-4 w-4" />
    case "INTEREST": return <Sparkles className="h-4 w-4" />
    case "LOAN_DISBURSEMENT": return <CircleDollarSign className="h-4 w-4" />
    case "LOAN_REPAYMENT": return <Receipt className="h-4 w-4" />
    default: return <ArrowRight className="h-4 w-4" />
  }
}

function getTransactionColor(type: string) {
  switch (type) {
    case "DEPOSIT":
    case "INTEREST": return "text-emerald-400"
    case "WITHDRAWAL":
    case "FEE":
    case "LOAN_REPAYMENT": return "text-red-400"
    case "CONTRIBUTION": return "text-blue-400"
    case "LOAN_DISBURSEMENT": return "text-amber-400"
    default: return "text-muted-foreground"
  }
}

function getTransactionBg(type: string) {
  switch (type) {
    case "DEPOSIT":
    case "INTEREST": return "bg-emerald-500/10"
    case "WITHDRAWAL":
    case "FEE":
    case "LOAN_REPAYMENT": return "bg-red-500/10"
    case "CONTRIBUTION": return "bg-blue-500/10"
    case "LOAN_DISBURSEMENT": return "bg-amber-500/10"
    default: return "bg-muted/50"
  }
}

export default function MemberOverviewClient() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState(false)

  const totalFiatValue = memberBalance.fiatBalance + (memberBalance.cusdBalance * 27.5) + (memberBalance.celoBalance * 15.8)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletData.celoAddress)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">AM</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
              Welcome back, {userData.name.split(" ")[0]}
            </h2>
            <p className="text-sm text-muted-foreground">
              Member ID: {userData.memberId}
            </p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="relative bg-transparent">
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Button>
          <Button size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Quick Deposit
          </Button>
        </div> */}
      </div>

      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-br from-primary/15 via-card to-card border-primary/20">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setBalanceVisible(!balanceVisible)}>
                  {balanceVisible ? <Eye className="h-3.5 w-3.5 text-muted-foreground" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                </Button>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                {balanceVisible ? formatCurrency(totalFiatValue) : "K ****.**"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">+12.5%</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Landmark className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Fiat (ZMW)</p>
                <p className="text-sm font-bold">{balanceVisible ? formatCurrency(memberBalance.fiatBalance) : "****"}</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <Blocks className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">CELO</p>
                <p className="text-sm font-bold">{balanceVisible ? `${memberBalance.celoBalance}` : "****"}</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <CircleDollarSign className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">cUSD</p>
                <p className="text-sm font-bold">{balanceVisible ? `${memberBalance.cusdBalance}` : "****"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                +{interestSummary.monthlyGrowth}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Interest Earned</p>
            <p className="text-xl font-bold">{balanceVisible ? formatCurrency(memberBalance.totalInterestEarned) : "****"}</p>
            <p className="text-xs text-muted-foreground mt-1">K {interestSummary.thisMonth} this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                {memberships.length} active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Group Savings</p>
            <p className="text-xl font-bold">{balanceVisible ? formatCurrency(memberships.reduce((s, m) => s + m.balance, 0)) : "****"}</p>
            <p className="text-xs text-muted-foreground mt-1">Across {memberships.length} groups</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <PiggyBank className="h-4 w-4 text-amber-400" />
              </div>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                {savingsGoals.filter(g => !g.isCompleted).length} active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Personal Savings</p>
            <p className="text-xl font-bold">{balanceVisible ? formatCurrency(personalSavings.balance) : "****"}</p>
            <p className="text-xs text-muted-foreground mt-1">{savingsGoals.length} savings goals</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-primary/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-400" />
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Insurance Cover</p>
            <p className="text-xl font-bold">{balanceVisible ? formatCurrency(activeInsurance[0].coverageAmount) : "****"}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeInsurance.length} active {activeInsurance.length === 1 ? "policy" : "policies"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - 2 cols wide */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Wallet Overview */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Celo Wallet</CardTitle>
                  <CardDescription className="text-xs">Connected to {walletData.network} network</CardDescription>
                </div>
                <Badge className={`text-xs ${walletData.isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {walletData.isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg mb-4">
                <code className="text-xs text-muted-foreground flex-1 truncate font-mono">{walletData.celoAddress}</code>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopyAddress}>
                  {copiedAddress ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">CELO</p>
                  <p className="text-base font-bold">{walletData.celoBalance}</p>
                  <p className="text-[10px] text-muted-foreground">~K {(Number.parseFloat(walletData.celoBalance) * 15.8).toFixed(0)}</p>
                </div>
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">cUSD</p>
                  <p className="text-base font-bold">{walletData.cusdBalance}</p>
                  <p className="text-[10px] text-muted-foreground">~K {(Number.parseFloat(walletData.cusdBalance) * 27.5).toFixed(0)}</p>
                </div>
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-0.5">cEUR</p>
                  <p className="text-base font-bold">{walletData.ceurBalance}</p>
                  <p className="text-[10px] text-muted-foreground">~K 0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                  View All <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${getTransactionBg(tx.type)}`}>
                    <span className={getTransactionColor(tx.type)}>{getTransactionIcon(tx.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(tx.createdAt)}</span>
                      {tx.groupName && (
                        <>
                          <span className="text-border">|</span>
                          <span className="truncate">{tx.groupName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${
                      tx.type === "DEPOSIT" || tx.type === "INTEREST" || tx.type === "LOAN_DISBURSEMENT"
                        ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {tx.type === "DEPOSIT" || tx.type === "INTEREST" || tx.type === "LOAN_DISBURSEMENT" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge className={`text-[10px] h-4 ${
                      tx.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {tx.status === "COMPLETED" ? <CheckCircle className="h-2.5 w-2.5 mr-0.5" /> : <Clock className="h-2.5 w-2.5 mr-0.5" />}
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Loan */}
          {activeLoan && (
            <Card className="bg-card border-amber-500/20">
              <CardHeader className="p-4 sm:p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <HandCoins className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Active Loan</CardTitle>
                      <CardDescription className="text-xs">{activeLoan.groupName}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">{activeLoan.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Loan Amount</p>
                    <p className="text-sm font-bold">{formatCurrency(activeLoan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-sm font-bold text-amber-400">{formatCurrency(activeLoan.remainingBalance)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                    <p className="text-sm font-bold">{activeLoan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-bold">{formatDate(activeLoan.repaymentDate)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Repayment Progress</span>
                    <span className="font-medium">{((activeLoan.totalRepaid / activeLoan.amount) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(activeLoan.totalRepaid / activeLoan.amount) * 100} className="h-2" />
                </div>
                <div className="mt-3 p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-xs text-muted-foreground">Next payment: <span className="text-foreground font-medium">{formatDate(activeLoan.nextPaymentDate!)}</span></span>
                  </div>
                  <span className="text-sm font-bold text-amber-400">{formatCurrency(activeLoan.nextPaymentAmount!)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Savings Goals */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Savings Goals</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                  All Goals <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
              {savingsGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100
                return (
                  <div key={goal.id} className="p-3 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />
                        <p className="text-sm font-medium">{goal.name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                      <span>Due {formatDate(goal.deadline!)}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* My Groups */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">My Groups</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                  All Groups <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
              {memberships.map((m) => (
                <div key={m.groupId} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {m.groupName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.groupName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge className="bg-primary/10 text-primary text-[10px] h-4 border-primary/20">{m.role}</Badge>
                      <span>Streak: {m.contributionStreak}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{formatCurrency(m.balance)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Yield Earnings Breakdown */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Yield Sources</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  <Coins className="h-3 w-3 mr-1" />
                  +K {interestSummary.thisMonth}/mo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
              {interestSummary.sources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-md bg-emerald-500/10 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{source.name}</p>
                      <p className="text-[10px] text-muted-foreground">{source.rate}% APY</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">+{formatCurrency(source.earned)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Upcoming Meetings</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                  Calendar <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <Badge className={`text-[10px] h-4 shrink-0 ${meeting.isVirtual ? "bg-blue-500/10 text-blue-400" : "bg-muted text-muted-foreground"}`}>
                      {meeting.isVirtual ? "Virtual" : "In-person"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{meeting.groupName}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3 text-primary" />
                    <span className="text-muted-foreground">
                      {formatDate(meeting.date)} at {formatTime(meeting.date)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insurance Card */}
          {activeInsurance.length > 0 && (
            <Card className="bg-card border-purple-500/20">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Crop Insurance</p>
                    <p className="text-xs text-muted-foreground">{activeInsurance[0].policyNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Coverage</p>
                    <p className="text-sm font-bold">{formatCurrency(activeInsurance[0].coverageAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Premium</p>
                    <p className="text-sm font-bold">{formatCurrency(activeInsurance[0].premiumAmount)}/mo</p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="text-xs text-muted-foreground">Next premium due: <span className="text-foreground font-medium">{formatDate(activeInsurance[0].nextPremiumDue!)}</span></span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: "Deposit", icon: ArrowDownLeft, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Withdraw", icon: ArrowUpRight, color: "text-red-400", bg: "bg-red-500/10" },
              { label: "Contribute", icon: HandCoins, color: "text-blue-400", bg: "bg-blue-500/10" },
              { label: "Send Crypto", icon: Blocks, color: "text-amber-400", bg: "bg-amber-500/10" },
              { label: "Apply for Loan", icon: CircleDollarSign, color: "text-purple-400", bg: "bg-purple-500/10" },
              { label: "Pay Premium", icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/10" },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 bg-transparent hover:bg-muted/50"
              >
                <div className={`h-10 w-10 rounded-lg ${action.bg} flex items-center justify-center`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
