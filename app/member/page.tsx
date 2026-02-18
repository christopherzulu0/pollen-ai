"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  TrendingUp,
  Users,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Shield,
  Calendar,
  Target,
  Coins,
  Landmark,
  Blocks,
  ChevronRight,
  ChevronLeft,
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
  Search,
} from "lucide-react"
import { useMemberOverview } from "@/hooks/useMemberOverview"
import { useCeloWallet } from "@/lib/celo/context"
import { WalletConnectButton } from "@/components/celo/wallet-connect-button"
import { toast } from "sonner"

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
    default:   return "bg-muted/50"
  }
}

const TRANSACTIONS_PAGE_SIZE = 3
const GROUPS_PAGE_SIZE = 3
const MEETINGS_PAGE_SIZE = 3
const GOALS_PAGE_SIZE = 3

function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const start = (currentPage - 1) * pageSize
  const slice = items.slice(start, start + pageSize)
  return {
    items: slice,
    currentPage,
    totalPages,
    total,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  }
}

function matchesSearch(text: string | null | undefined, q: string): boolean {
  if (!q.trim()) return true
  return (text ?? "").toLowerCase().includes(q.trim().toLowerCase())
}

export default function MemberOverviewClient() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [transactionsPage, setTransactionsPage] = useState(1)
  const [goalsPage, setGoalsPage] = useState(1)
  const [groupsPage, setGroupsPage] = useState(1)
  const [meetingsPage, setMeetingsPage] = useState(1)
  const [transactionsSearch, setTransactionsSearch] = useState("")
  const [goalsSearch, setGoalsSearch] = useState("")
  const [groupsSearch, setGroupsSearch] = useState("")
  const [meetingsSearch, setMeetingsSearch] = useState("")

  const { data: overview, isLoading, isError, error } = useMemberOverview()
  const { address, isConnected, network, formattedBalance } = useCeloWallet()

  useEffect(() => {
    if (isError && error) {
      toast.error(error instanceof Error ? error.message : "Failed to load dashboard")
    }
  }, [isError, error])

  const handleCopyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  if (isLoading || !overview) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-[40vh]">
        <div className="text-center text-muted-foreground">Loading dashboard…</div>
      </div>
    )
  }

  const { user: userData, memberBalance, memberships, personalSavings, savingsGoals, recentTransactions, activeLoan, activeInsurance, upcomingMeetings, interestSummary, unreadNotifications } = overview

  const celoNum = isConnected && formattedBalance?.celo ? Number.parseFloat(formattedBalance.celo) : memberBalance.celoBalance
  const cusdNum = isConnected && formattedBalance?.cusd ? Number.parseFloat(formattedBalance.cusd) : memberBalance.cusdBalance
  const totalFiatValue = memberBalance.fiatBalance + (cusdNum * 27.5) + (celoNum * 15.8)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {userData.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "M"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
              Welcome back, {userData.name.split(" ")[0]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {userData.memberId ? `Member ID: ${userData.memberId}` : userData.email}
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
                <p className="text-sm font-bold">{balanceVisible ? `${celoNum}` : "****"}</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <CircleDollarSign className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">cUSD</p>
                <p className="text-sm font-bold">{balanceVisible ? `${cusdNum}` : "****"}</p>
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
              {interestSummary.monthlyGrowth != null && (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                  +{interestSummary.monthlyGrowth}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Interest Earned</p>
            <p className="text-xl font-bold">{balanceVisible ? formatCurrency(memberBalance.totalInterestEarned) : "****"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {interestSummary.thisMonth != null ? `K ${interestSummary.thisMonth} this month` : "Total interest"}
            </p>
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
            <p className="text-xl font-bold">
              {balanceVisible && activeInsurance.length > 0 ? formatCurrency(activeInsurance[0].coverageAmount) : balanceVisible ? "K 0" : "****"}
            </p>
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
                  <CardDescription className="text-xs">
                    {isConnected && network ? `Connected to ${network} network` : "Connect your wallet for live balances"}
                  </CardDescription>
                </div>
                <Badge className={`text-xs ${isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              {!isConnected ? (
                <div className="py-4 flex justify-center">
                  <WalletConnectButton />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg mb-4">
                    <code className="text-xs text-muted-foreground flex-1 truncate font-mono">{address ?? ""}</code>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopyAddress}>
                      {copiedAddress ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">CELO</p>
                      <p className="text-base font-bold">{formattedBalance?.celo ?? "0"}</p>
                      <p className="text-[10px] text-muted-foreground">~K {(Number.parseFloat(formattedBalance?.celo ?? "0") * 15.8).toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">cUSD</p>
                      <p className="text-base font-bold">{formattedBalance?.cusd ?? "0"}</p>
                      <p className="text-[10px] text-muted-foreground">~K {(Number.parseFloat(formattedBalance?.cusd ?? "0") * 27.5).toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">cEUR</p>
                      <p className="text-base font-bold">{formattedBalance?.ceur ?? "0"}</p>
                      <p className="text-[10px] text-muted-foreground">~K 0</p>
                    </div>
                  </div>
                </>
              )}
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
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by description, group, type..."
                  value={transactionsSearch}
                  onChange={(e) => {
                    setTransactionsSearch(e.target.value)
                    setTransactionsPage(1)
                  }}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              {(() => {
                const filtered = recentTransactions.filter(
                  (tx) =>
                    matchesSearch(tx.description, transactionsSearch) ||
                    matchesSearch(tx.groupName, transactionsSearch) ||
                    matchesSearch(tx.type, transactionsSearch) ||
                    matchesSearch(tx.status, transactionsSearch) ||
                    (tx.amount != null && String(tx.amount).includes(transactionsSearch.trim()))
                )
                const { items, currentPage, totalPages, hasPrev, hasNext } = paginate(filtered, transactionsPage, TRANSACTIONS_PAGE_SIZE)
                return (
                  <>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        {recentTransactions.length === 0 ? "No transactions yet." : "No transactions match your search."}
                      </p>
                    ) : (
                      items.map((tx) => (
                        <div key={tx.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${getTransactionBg(tx.type)}`}>
                            <span className={getTransactionColor(tx.type)}>{getTransactionIcon(tx.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{tx.description ?? "Transaction"}</p>
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
                      ))
                    )}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasPrev} onClick={() => setTransactionsPage((p) => p - 1)}>
                          <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
                        </Button>
                        <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasNext} onClick={() => setTransactionsPage((p) => p + 1)}>
                          Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Button>
                      </div>
                    )}
                  </>
                )
              })()}
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
                    <span className="font-medium">{activeLoan.amount > 0 ? ((activeLoan.totalRepaid / activeLoan.amount) * 100).toFixed(0) : 0}%</span>
                  </div>
                  <Progress value={activeLoan.amount > 0 ? (activeLoan.totalRepaid / activeLoan.amount) * 100 : 0} className="h-2" />
                </div>
                {activeLoan.nextPaymentDate != null && activeLoan.nextPaymentAmount != null && (
                  <div className="mt-3 p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      <span className="text-xs text-muted-foreground">Next payment: <span className="text-foreground font-medium">{formatDate(activeLoan.nextPaymentDate)}</span></span>
                    </div>
                    <span className="text-sm font-bold text-amber-400">{formatCurrency(activeLoan.nextPaymentAmount)}</span>
                  </div>
                )}
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
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search goals by name..."
                  value={goalsSearch}
                  onChange={(e) => {
                    setGoalsSearch(e.target.value)
                    setGoalsPage(1)
                  }}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              {(() => {
                const filtered = savingsGoals.filter(
                  (goal) =>
                    matchesSearch(goal.name, goalsSearch) ||
                    matchesSearch(goal.deadline, goalsSearch) ||
                    (goal.targetAmount != null && String(goal.targetAmount).includes(goalsSearch.trim())) ||
                    (goal.currentAmount != null && String(goal.currentAmount).includes(goalsSearch.trim()))
                )
                const { items, currentPage, totalPages, hasPrev, hasNext } = paginate(filtered, goalsPage, GOALS_PAGE_SIZE)
                return (
                  <>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        {savingsGoals.length === 0 ? "No savings goals yet." : "No goals match your search."}
                      </p>
                    ) : (
                      items.map((goal) => {
                        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
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
                              {goal.deadline ? <span>Due {formatDate(goal.deadline)}</span> : null}
                            </div>
                          </div>
                        )
                      })
                    )}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasPrev} onClick={() => setGoalsPage((p) => p - 1)}>
                          <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
                        </Button>
                        <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasNext} onClick={() => setGoalsPage((p) => p + 1)}>
                          Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Button>
                      </div>
                    )}
                  </>
                )
              })()}
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
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search groups by name or role..."
                  value={groupsSearch}
                  onChange={(e) => {
                    setGroupsSearch(e.target.value)
                    setGroupsPage(1)
                  }}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              {(() => {
                const filtered = memberships.filter(
                  (m) => matchesSearch(m.groupName, groupsSearch) || matchesSearch(m.role, groupsSearch)
                )
                const { items, currentPage, totalPages, hasPrev, hasNext } = paginate(filtered, groupsPage, GROUPS_PAGE_SIZE)
                return (
                  <>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        {memberships.length === 0 ? "No groups yet." : "No groups match your search."}
                      </p>
                    ) : (
                      items.map((m) => (
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
                      ))
                    )}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasPrev} onClick={() => setGroupsPage((p) => p - 1)}>
                          <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
                        </Button>
                        <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasNext} onClick={() => setGroupsPage((p) => p + 1)}>
                          Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Button>
                      </div>
                    )}
                  </>
                )
              })()}
            </CardContent>
          </Card>

          {/* Yield Earnings Breakdown */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Yield Sources</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  <Coins className="h-3 w-3 mr-1" />
                  {interestSummary.thisMonth != null ? `+K ${interestSummary.thisMonth}/mo` : "Interest"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-2">
              {(interestSummary.sources ?? []).length > 0 ? (interestSummary.sources ?? []).map((source, idx) => (
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
              )) : (
                <p className="text-sm text-muted-foreground">No yield sources yet.</p>
              )}
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
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by title, group, location..."
                  value={meetingsSearch}
                  onChange={(e) => {
                    setMeetingsSearch(e.target.value)
                    setMeetingsPage(1)
                  }}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              {(() => {
                const filtered = upcomingMeetings.filter(
                  (meeting) =>
                    matchesSearch(meeting.title, meetingsSearch) ||
                    matchesSearch(meeting.groupName, meetingsSearch) ||
                    matchesSearch(meeting.location, meetingsSearch)
                )
                const { items, currentPage, totalPages, hasPrev, hasNext } = paginate(filtered, meetingsPage, MEETINGS_PAGE_SIZE)
                return (
                  <>
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        {upcomingMeetings.length === 0 ? "No upcoming meetings." : "No meetings match your search."}
                      </p>
                    ) : (
                      items.map((meeting) => (
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
                      ))
                    )}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasPrev} onClick={() => setMeetingsPage((p) => p - 1)}>
                          <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Prev
                        </Button>
                        <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" disabled={!hasNext} onClick={() => setMeetingsPage((p) => p + 1)}>
                          Next <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Button>
                      </div>
                    )}
                  </>
                )
              })()}
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
                    <p className="text-sm font-semibold">{activeInsurance[0].productType ? `${activeInsurance[0].productType.charAt(0).toUpperCase() + activeInsurance[0].productType.slice(1)} Insurance` : "Insurance"}</p>
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
                {activeInsurance[0].nextPremiumDue && (
                  <div className="mt-3 p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-muted-foreground">Next premium due: <span className="text-foreground font-medium">{formatDate(activeInsurance[0].nextPremiumDue)}</span></span>
                  </div>
                )}
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
