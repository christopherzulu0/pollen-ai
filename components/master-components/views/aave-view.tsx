"use client"

import { useState, Suspense } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Database,
  ArrowRight,
  Building2,
  Blocks,
  FileText,
  Shield,
  Users,
  PiggyBank,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  XCircle,
  ExternalLink,
  Copy,
  RotateCcw,
  Landmark,
  Layers,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Types for ledger entries
type LedgerEntryType = "DEPOSIT" | "WITHDRAW" | "INTEREST" | "FEE" | "TRANSFER" | "ADJUSTMENT" | "LOAN_DISBURSEMENT" | "LOAN_REPAYMENT" | "CONTRIBUTION" | "PENALTY"
type LedgerStatus = "PENDING" | "CONFIRMED" | "FAILED" | "REVERSED"

interface LedgerEntry {
  id: string
  type: LedgerEntryType
  amount: number
  asset: string
  user: string
  group?: string | null
  date: string
  status: LedgerStatus
  txHash: string | null
  blockNumber: number | null
  description?: string | null
  currency?: string
  reference?: string | null
}

interface LedgerStats {
  totalDeposits: number
  totalWithdrawals: number
  totalInterest: number
  totalFees: number
  totalTransfers: number
  pendingCount: number
  confirmedCount: number
}

interface LedgerEntriesResponse {
  entries: LedgerEntry[]
  stats: LedgerStats
}

// Fetch ledger entries from API
async function fetchLedgerEntries(): Promise<LedgerEntriesResponse> {
  const response = await fetch("/api/Super-user/ledger-entries")
  if (!response.ok) {
    throw new Error("Failed to fetch ledger entries")
  }
  return response.json()
}

// Skeleton loader for ledger engine tab
function LedgerEngineSkeleton() {
      return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
              </div>
              </div>
      </CardHeader>
          <CardContent className="p-4 sm:p-6">
        {/* Stats skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
          ))}
              </div>
        {/* Table skeleton */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

// Ledger Engine Content Component
function LedgerEngineContent() {
  const { data, isLoading, error } = useQuery<LedgerEntriesResponse>({
    queryKey: ["ledgerEntries"],
    queryFn: fetchLedgerEntries,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  })

  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null)

  if (isLoading) {
    return <LedgerEngineSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <p>Failed to load ledger entries. Please try again.</p>
              </div>
          </CardContent>
        </Card>
    )
  }

  const ledgerEntries = data?.entries || []
  const ledgerStats = data?.stats || {
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInterest: 0,
    totalFees: 0,
    totalTransfers: 0,
    pendingCount: 0,
    confirmedCount: 0,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
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
          <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Database className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ledger Engine (Source of Truth)</CardTitle>
                  <CardDescription>Central ledger recording all financial transactions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
        {/* Ledger Summary */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">Total Deposits</span>
                    </div>
                    <p className="text-xl font-bold text-green-500">+{formatCurrency(ledgerStats.totalDeposits)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ledgerEntries.filter(e => e.type === "DEPOSIT").length} transactions</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownLeft className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-muted-foreground">Total Withdrawals</span>
                    </div>
                    <p className="text-xl font-bold text-red-500">-{formatCurrency(ledgerStats.totalWithdrawals)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ledgerEntries.filter(e => e.type === "WITHDRAW").length} transactions</p>
                  </CardContent>
                </Card>
                <Card className="bg-cyan-500/10 border-cyan-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-cyan-500" />
                      <span className="text-xs text-muted-foreground">Interest Earned</span>
                    </div>
                    <p className="text-xl font-bold text-cyan-500">+{formatCurrency(ledgerStats.totalInterest)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ledgerEntries.filter(e => e.type === "INTEREST").length} accruals</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-orange-500" />
                      <span className="text-xs text-muted-foreground">Fees Charged</span>
                    </div>
                    <p className="text-xl font-bold text-orange-500">-{formatCurrency(ledgerStats.totalFees)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ledgerEntries.filter(e => e.type === "FEE").length} fees</p>
                  </CardContent>
                </Card>
              </div>

              {/* Ledger Entries Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs">Entry ID</TableHead>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Amount</TableHead>
                        <TableHead className="text-xs">Asset</TableHead>
                        <TableHead className="text-xs">User/Group</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                {ledgerEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No ledger entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  ledgerEntries.map((entry) => (
                        <TableRow key={entry.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs">{entry.id}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                              entry.type === "DEPOSIT" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                              entry.type === "WITHDRAW" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              entry.type === "INTEREST" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                              entry.type === "FEE" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                              "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            }`}>
                              {entry.type === "DEPOSIT" && <ArrowUpRight className="h-3 w-3 mr-1" />}
                              {entry.type === "WITHDRAW" && <ArrowDownLeft className="h-3 w-3 mr-1" />}
                              {entry.type === "INTEREST" && <TrendingUp className="h-3 w-3 mr-1" />}
                              {entry.type === "FEE" && <TrendingDown className="h-3 w-3 mr-1" />}
                              {entry.type === "TRANSFER" && <ArrowRight className="h-3 w-3 mr-1" />}
                              {entry.type}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-medium text-xs ${
                            entry.type === "DEPOSIT" || entry.type === "INTEREST" ? "text-green-500" : "text-red-500"
                          }`}>
                            {entry.type === "DEPOSIT" || entry.type === "INTEREST" ? "+" : "-"}
                            {formatCurrency(entry.amount)}
                          </TableCell>
                          <TableCell className="text-xs">{entry.asset}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{entry.user}</span>
                          {entry.group && (
                            <span className="text-muted-foreground text-[10px]">
                              <Users className="h-2.5 w-2.5 inline mr-1" />
                              {entry.group}
                            </span>
                          )}
                        </div>
                      </TableCell>
                          <TableCell className="text-xs">{formatDate(entry.date)}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs ${
                          entry.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" : 
                          entry.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" :
                          entry.status === "FAILED" ? "bg-red-500/10 text-red-500" :
                          "bg-gray-500/10 text-gray-500"
                            }`}>
                          {entry.status === "CONFIRMED" ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                           entry.status === "PENDING" ? <Clock className="h-3 w-3 mr-1" /> : 
                           <XCircle className="h-3 w-3 mr-1" />}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* Ledger Entry Details Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Ledger Entry Details</DialogTitle>
              <DialogDescription>Complete transaction record and audit trail</DialogDescription>
            </DialogHeader>
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
                <div>
                  <p className="text-xs text-muted-foreground">User</p>
                  <p className="text-sm font-medium">{selectedEntry.user}</p>
                  {selectedEntry.group && (
                    <>
                      <p className="text-xs text-muted-foreground mt-2">Group</p>
                      <p className="text-sm flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {selectedEntry.group}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm">{formatDate(selectedEntry.date)}</p>
                </div>
                {selectedEntry.description && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm">{selectedEntry.description}</p>
                  </div>
                )}
              </div>
              {selectedEntry.txHash && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Blockchain Details</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs">Transaction Hash</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{selectedEntry.txHash.slice(0, 10)}...</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(selectedEntry.txHash || "")}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {selectedEntry.blockNumber && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Block Number</span>
                        <span className="font-mono text-xs">{selectedEntry.blockNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs">Status</span>
                      <Badge className={`text-xs ${selectedEntry.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                        {selectedEntry.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEntry(null)} className="bg-transparent">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}

// Types for wallet executions
type ExecutionType = "BANK_TRANSFER" | "MOBILE_MONEY" | "BLOCKCHAIN"
type ExecutionDirection = "INBOUND" | "OUTBOUND"
type ExecutionStatus = "PENDING" | "SUBMITTED" | "CONFIRMED" | "FAILED"

interface WalletExecution {
  id: string
  executionType: ExecutionType
  direction: ExecutionDirection
  amount: number
  asset: string
  currency: string
  fromAddress?: string | null
  toAddress?: string | null
  fromAccountName?: string | null
  toAccountName?: string | null
  bankName?: string | null
  accountNumber?: string | null
  mobileNumber?: string | null
  mobileProvider?: string | null
  txHash?: string | null
  blockNumber?: number | null
  networkId?: string | null
  gasUsed?: number | null
  status: ExecutionStatus
  errorMessage?: string | null
  retryCount: number
  submittedAt?: string | null
  confirmedAt?: string | null
  createdAt: string
  updatedAt: string
}

interface WalletExecutionStats {
  totalExecutions: number
  pendingCount: number
  submittedCount: number
  confirmedCount: number
  failedCount: number
  bankTransferCount: number
  mobileMoneyCount: number
  blockchainCount: number
  inboundCount: number
  outboundCount: number
}

interface WalletExecutionsResponse {
  executions: WalletExecution[]
  stats: WalletExecutionStats
}

// Fetch wallet executions from API
async function fetchWalletExecutions(params?: {
  status?: string
  executionType?: string
  direction?: string
}): Promise<WalletExecutionsResponse> {
  const queryParams = new URLSearchParams()
  if (params?.status) queryParams.append("status", params.status)
  if (params?.executionType) queryParams.append("executionType", params.executionType)
  if (params?.direction) queryParams.append("direction", params.direction)
  
  const url = `/api/Super-user/wallet-executions${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch wallet executions")
  }
  return response.json()
}

// Skeleton loader for wallet executions
function WalletExecutionSkeleton() {
  return (
    <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
  )
}

// Wallet Execution Content Component
function WalletExecutionContent() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [executionTypeFilter, setExecutionTypeFilter] = useState<string>("all")
  const [directionFilter, setDirectionFilter] = useState<string>("all")
  const [selectedExecution, setSelectedExecution] = useState<WalletExecution | null>(null)

  const { data, isLoading, error, refetch } = useQuery<WalletExecutionsResponse>({
    queryKey: ["walletExecutions", statusFilter, executionTypeFilter, directionFilter],
    queryFn: () => fetchWalletExecutions({
      status: statusFilter !== "all" ? statusFilter : undefined,
      executionType: executionTypeFilter !== "all" ? executionTypeFilter : undefined,
      direction: directionFilter !== "all" ? directionFilter : undefined,
    }),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  if (isLoading) {
    return <WalletExecutionSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <p>Failed to load wallet executions. Please try again.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const executions = data?.executions || []
  const stats = data?.stats || {
    totalExecutions: 0,
    pendingCount: 0,
    submittedCount: 0,
    confirmedCount: 0,
    failedCount: 0,
    bankTransferCount: 0,
    mobileMoneyCount: 0,
    blockchainCount: 0,
    inboundCount: 0,
    outboundCount: 0,
  }

  return (
    <>
            <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
              <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                <CardTitle className="text-lg">Wallet Execution Layer</CardTitle>
                <CardDescription>Blockchain and bank transaction execution tracking</CardDescription>
                  </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
                </div>
              </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Total Executions</span>
                    </div>
                <p className="text-xl font-bold text-blue-500">{stats.totalExecutions}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Pending</span>
                    </div>
                <p className="text-xl font-bold text-yellow-500">{stats.pendingCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting execution</p>
              </CardContent>
            </Card>
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Confirmed</span>
                  </div>
                <p className="text-xl font-bold text-green-500">{stats.confirmedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Successfully executed</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-muted-foreground">Failed</span>
                    </div>
                <p className="text-xl font-bold text-red-500">{stats.failedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Require attention</p>
              </CardContent>
            </Card>
                    </div>

          {/* Execution Type Stats */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Bank Transfers</p>
                    <p className="text-lg font-bold">{stats.bankTransferCount}</p>
                  </div>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Mobile Money</p>
                    <p className="text-lg font-bold">{stats.mobileMoneyCount}</p>
                    </div>
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Blockchain</p>
                    <p className="text-lg font-bold">{stats.blockchainCount}</p>
                  </div>
                  <Blocks className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={executionTypeFilter} onValueChange={setExecutionTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                <SelectItem value="BLOCKCHAIN">Blockchain</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="INBOUND">Inbound</SelectItem>
                <SelectItem value="OUTBOUND">Outbound</SelectItem>
              </SelectContent>
            </Select>
                  </div>

          {/* Executions Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Direction</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Asset</TableHead>
                    <TableHead className="text-xs">From/To</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Created</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No wallet executions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    executions.map((execution) => (
                      <TableRow key={execution.id} className="hover:bg-muted/30">
                        <TableCell>
                          <Badge className={`text-xs ${
                            execution.executionType === "BLOCKCHAIN" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                            execution.executionType === "BANK_TRANSFER" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                            "bg-green-500/10 text-green-500 border-green-500/20"
                          }`}>
                            {execution.executionType === "BLOCKCHAIN" && <Blocks className="h-3 w-3 mr-1" />}
                            {execution.executionType === "BANK_TRANSFER" && <Building2 className="h-3 w-3 mr-1" />}
                            {execution.executionType === "MOBILE_MONEY" && <Wallet className="h-3 w-3 mr-1" />}
                            {execution.executionType.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${
                            execution.direction === "INBOUND" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            "bg-orange-500/10 text-orange-500 border-orange-500/20"
                          }`}>
                            {execution.direction === "INBOUND" ? <ArrowDownLeft className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
                            {execution.direction}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-xs">
                          {formatCurrency(execution.amount)}
                        </TableCell>
                        <TableCell className="text-xs">{execution.asset}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex flex-col gap-0.5">
                            {execution.fromAddress && (
                              <span className="text-muted-foreground text-[10px]">
                                From: {execution.fromAddress.slice(0, 8)}...{execution.fromAddress.slice(-6)}
                              </span>
                            )}
                            {execution.toAddress && (
                              <span className="text-[10px]">
                                To: {execution.toAddress.slice(0, 8)}...{execution.toAddress.slice(-6)}
                              </span>
                            )}
                            {execution.fromAccountName && (
                              <span className="text-muted-foreground text-[10px]">
                                From: {execution.fromAccountName}
                              </span>
                            )}
                            {execution.toAccountName && (
                              <span className="text-[10px]">
                                To: {execution.toAccountName}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${
                            execution.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" :
                            execution.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" :
                            execution.status === "SUBMITTED" ? "bg-blue-500/10 text-blue-500" :
                            "bg-red-500/10 text-red-500"
                          }`}>
                            {execution.status === "CONFIRMED" ? <CheckCircle className="h-3 w-3 mr-1" /> :
                             execution.status === "PENDING" ? <Clock className="h-3 w-3 mr-1" /> :
                             execution.status === "SUBMITTED" ? <Activity className="h-3 w-3 mr-1" /> :
                             <XCircle className="h-3 w-3 mr-1" />}
                            {execution.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{formatDate(execution.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedExecution(execution)}>
                            <FileText className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Details Dialog */}
      {selectedExecution && (
        <Dialog open={!!selectedExecution} onOpenChange={() => setSelectedExecution(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Wallet Execution Details</DialogTitle>
              <DialogDescription>Complete execution record and transaction details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                  <p className="text-xs text-muted-foreground">Execution Type</p>
                  <Badge className={`text-xs mt-1 ${
                    selectedExecution.executionType === "BLOCKCHAIN" ? "bg-purple-500/10 text-purple-500" :
                    selectedExecution.executionType === "BANK_TRANSFER" ? "bg-blue-500/10 text-blue-500" :
                    "bg-green-500/10 text-green-500"
                  }`}>
                    {selectedExecution.executionType.replace("_", " ")}
                  </Badge>
                  </div>
                <div>
                  <p className="text-xs text-muted-foreground">Direction</p>
                  <Badge className={`text-xs mt-1 ${
                    selectedExecution.direction === "INBOUND" ? "bg-green-500/10 text-green-500" :
                    "bg-orange-500/10 text-orange-500"
                  }`}>
                    {selectedExecution.direction}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedExecution.amount)}</p>
                    </div>
                <div>
                  <p className="text-xs text-muted-foreground">Asset</p>
                  <p className="text-sm">{selectedExecution.asset}</p>
                    </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={`text-xs mt-1 ${
                    selectedExecution.status === "CONFIRMED" ? "bg-green-500/10 text-green-500" :
                    selectedExecution.status === "PENDING" ? "bg-yellow-500/10 text-yellow-500" :
                    selectedExecution.status === "SUBMITTED" ? "bg-blue-500/10 text-blue-500" :
                    "bg-red-500/10 text-red-500"
                  }`}>
                    {selectedExecution.status}
                  </Badge>
                  </div>
                <div>
                  <p className="text-xs text-muted-foreground">Retry Count</p>
                  <p className="text-sm">{selectedExecution.retryCount}</p>
                    </div>
                    </div>

              {(selectedExecution.fromAddress || selectedExecution.toAddress || selectedExecution.fromAccountName || selectedExecution.toAccountName) && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Addresses</p>
                  <div className="space-y-2">
                    {selectedExecution.fromAddress && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">From Address</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">{selectedExecution.fromAddress.slice(0, 10)}...{selectedExecution.fromAddress.slice(-8)}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(selectedExecution.fromAddress || "")}>
                            <Copy className="h-3 w-3" />
                          </Button>
                  </div>
                    </div>
                    )}
                    {selectedExecution.toAddress && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">To Address</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">{selectedExecution.toAddress.slice(0, 10)}...{selectedExecution.toAddress.slice(-8)}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(selectedExecution.toAddress || "")}>
                            <Copy className="h-3 w-3" />
                          </Button>
                    </div>
                  </div>
                    )}
                    {selectedExecution.fromAccountName && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">From Account</span>
                        <span className="text-xs">{selectedExecution.fromAccountName}</span>
                </div>
                    )}
                    {selectedExecution.toAccountName && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">To Account</span>
                        <span className="text-xs">{selectedExecution.toAccountName}</span>
          </div>
                    )}
                  </div>
                </div>
              )}

              {(selectedExecution.bankName || selectedExecution.accountNumber || selectedExecution.mobileNumber) && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Bank/Mobile Money Details</p>
                  <div className="space-y-2">
                    {selectedExecution.bankName && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Bank Name</span>
                        <span className="text-xs">{selectedExecution.bankName}</span>
                      </div>
                    )}
                    {selectedExecution.accountNumber && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Account Number</span>
                        <span className="font-mono text-xs">{selectedExecution.accountNumber}</span>
                    </div>
                    )}
                    {selectedExecution.mobileNumber && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Mobile Number</span>
                        <span className="text-xs">{selectedExecution.mobileNumber}</span>
                      </div>
                    )}
                    {selectedExecution.mobileProvider && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Provider</span>
                        <span className="text-xs">{selectedExecution.mobileProvider}</span>
                      </div>
                    )}
                      </div>
                    </div>
              )}

              {selectedExecution.txHash && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Blockchain Details</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs">Transaction Hash</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{selectedExecution.txHash.slice(0, 10)}...</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(selectedExecution.txHash || "")}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {selectedExecution.blockNumber && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Block Number</span>
                        <span className="font-mono text-xs">{selectedExecution.blockNumber}</span>
                      </div>
                    )}
                    {selectedExecution.networkId && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Network</span>
                        <span className="text-xs">{selectedExecution.networkId}</span>
                      </div>
                    )}
                    {selectedExecution.gasUsed && (
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs">Gas Used</span>
                        <span className="text-xs">{selectedExecution.gasUsed.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedExecution.errorMessage && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Error Message</p>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-500">{selectedExecution.errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">Timestamps</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-xs">Created At</span>
                    <span className="text-xs">{formatDate(selectedExecution.createdAt)}</span>
                  </div>
                  {selectedExecution.submittedAt && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs">Submitted At</span>
                      <span className="text-xs">{formatDate(selectedExecution.submittedAt)}</span>
                    </div>
                  )}
                  {selectedExecution.confirmedAt && (
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs">Confirmed At</span>
                      <span className="text-xs">{formatDate(selectedExecution.confirmedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedExecution(null)} className="bg-transparent">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Types for village ledger
interface VillageLedgerGroup {
  groupId: string
  groupName: string
  contributions: number
  loansIssued: number
  repayments: number
  penalties: number
  balance: number
  activeMemberCount?: number
  totalMemberCount?: number
  status?: string
  lastActivityAt?: string | null
}

interface VillageLedgerTotals {
  totalContributions: number
  totalLoansIssued: number
  totalRepayments: number
  totalPenalties: number
  totalBalance: number
}

interface VillageLedgerResponse {
  ledgers: VillageLedgerGroup[]
  totals: VillageLedgerTotals
}

// Fetch village ledgers from API
async function fetchVillageLedgers(): Promise<VillageLedgerResponse> {
  const response = await fetch("/api/Super-user/village-ledgers")
  if (!response.ok) {
    throw new Error("Failed to fetch village ledgers")
  }
  return response.json()
}

// Skeleton loader for village ledger tab
function VillageLedgerSkeleton() {
  return (
    <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  )
}

// Village Ledger Content Component
function VillageLedgerContent() {
  const { data, isLoading, error } = useQuery<VillageLedgerResponse>({
    queryKey: ["villageLedgers"],
    queryFn: fetchVillageLedgers,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  })

  const [selectedVillageGroup, setSelectedVillageGroup] = useState<VillageLedgerGroup | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
  }

  if (isLoading) {
    return <VillageLedgerSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <p>Failed to load village ledgers. Please try again.</p>
              </div>
            </CardContent>
          </Card>
    )
  }

  const villageLedgerData = data?.ledgers || []
  const villageTotals = data?.totals || {
    totalContributions: 0,
    totalLoansIssued: 0,
    totalRepayments: 0,
    totalPenalties: 0,
    totalBalance: 0,
  }

  return (
    <>
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Village Banking Ledger</CardTitle>
                  <CardDescription>Group-level financial tracking for cooperatives</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs">Group</TableHead>
                        <TableHead className="text-xs text-right">Member Contributions</TableHead>
                        <TableHead className="text-xs text-right">Loans Issued</TableHead>
                        <TableHead className="text-xs text-right">Repayments</TableHead>
                        <TableHead className="text-xs text-right">Penalties</TableHead>
                        <TableHead className="text-xs text-right">Net Balance</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  {villageLedgerData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No village ledgers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    villageLedgerData.map((group) => (
                        <TableRow key={group.groupId} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Users className="h-4 w-4 text-indigo-500" />
                              </div>
                              <span className="font-medium text-sm">{group.groupName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-green-500 font-medium">
                            +{formatCurrency(group.contributions)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-orange-500 font-medium">
                            -{formatCurrency(group.loansIssued)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-cyan-500 font-medium">
                            +{formatCurrency(group.repayments)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-red-500 font-medium">
                            +{formatCurrency(group.penalties)}
                          </TableCell>
                          <TableCell className="text-right text-sm font-bold">
                            {formatCurrency(group.balance)}
                          </TableCell>
<TableCell>
  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedVillageGroup(group)}>
  <FileText className="h-3 w-3 mr-1" />
  View Ledger
  </Button>
  </TableCell>
                        </TableRow>
                    ))
                  )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Village Group Ledger Dialog */}
      {selectedVillageGroup && (
        <Dialog open={!!selectedVillageGroup} onOpenChange={() => setSelectedVillageGroup(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                {selectedVillageGroup.groupName} - Group Ledger
              </DialogTitle>
              <DialogDescription>Detailed financial ledger for this village banking group</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Contributions</p>
                    <p className="text-lg font-bold text-green-500">+{formatCurrency(selectedVillageGroup.contributions)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Loans Issued</p>
                    <p className="text-lg font-bold text-orange-500">-{formatCurrency(selectedVillageGroup.loansIssued)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-cyan-500/10 border-cyan-500/20">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Repayments</p>
                    <p className="text-lg font-bold text-cyan-500">+{formatCurrency(selectedVillageGroup.repayments)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/10 border-red-500/20">
                  <CardContent className="p-3 text-center">
                    <p className="text-xs text-muted-foreground">Penalties</p>
                    <p className="text-lg font-bold text-red-500">+{formatCurrency(selectedVillageGroup.penalties)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Net Balance */}
              <Card className="bg-indigo-500/10 border-indigo-500/20">
                <CardContent className="p-4 flex items-center justify-between">
                        <div>
                    <p className="text-sm text-muted-foreground">Net Group Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(selectedVillageGroup.balance)}</p>
                        </div>
                  <Badge className="bg-green-500/10 text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </CardContent>
              </Card>

              {/* Member Info */}
              {selectedVillageGroup.activeMemberCount !== undefined && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Members</span>
                      <span className="font-medium">{selectedVillageGroup.activeMemberCount} / {selectedVillageGroup.totalMemberCount || 0}</span>
                    </div>
            </CardContent>
          </Card>
              )}
                  </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Ledger
              </Button>
              <Button variant="outline" onClick={() => setSelectedVillageGroup(null)} className="bg-transparent">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Daily Reconciliation data
const reconciliationData = {
  date: "2024-03-15",
  ledgerBalance: 48000,
  bankBalance: 28000,
  blockchainBalance: 19950,
  totalExecuted: 47950,
  difference: 50,
  status: "ALERT",
  alerts: [
    { id: "R001", type: "MISMATCH", description: "Pending transfer not yet confirmed on blockchain", amount: 50, resolution: "PENDING" },
  ]
}

// Savings Interest Flow data
const interestFlowData = {
  savingsPrincipal: 48000,
  yieldSources: [
    { name: "AAVE Supply APY", rate: 2.5, amount: 1200 },
    { name: "Lending Interest", rate: 4.2, amount: 2016 },
    { name: "Staking Rewards", rate: 3.0, amount: 1440 },
  ],
  grossInterest: 4656,
  platformFee: 465.60,
  netInterestToUsers: 4190.40,
}

// Types for AAVE positions
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
  memberCount?: number
  owner?: string
}

type PositionsStats = {
  totalSupplied: number
  totalBorrowed: number
  activePositions: number
  avgHealthFactor: number
  atRiskPositions: number
  totalAvailableToBorrow: number
}

interface PositionsResponse {
  positions: Position[]
  stats: PositionsStats
}

// Fetch AAVE positions from API
async function fetchAavePositions(): Promise<PositionsResponse> {
  const response = await fetch("/api/Super-user/aave-positions")
  if (!response.ok) {
    throw new Error("Failed to fetch AAVE positions")
  }
  return response.json()
}

// Skeleton loader for positions tab
function PositionsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-4 sm:p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
        ))}
              </div>
      {/* Table skeleton */}
      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-6">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <TableHead key={i}>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
                        </div>
  )
}

// Types for Hub Assets
type HubAsset = {
  symbol: string
  name: string
  totalLiquidity: number
  utilizationRate: number
  supplyAPY: number
  borrowAPY: number
}

// Fetch hub assets from API
async function fetchHubAssets(): Promise<HubAsset[]> {
  const response = await fetch("/api/Super-user/hub-assets")
  if (!response.ok) {
    throw new Error("Failed to fetch hub assets")
  }
  const data = await response.json()
  // API now handles fallback data, so just return what we get
  return data
}

// Positions Content Component with React Query
function PositionsContent({
  searchQuery,
  setSearchQuery,
  healthFilter,
  setHealthFilter,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setItemsPerPage,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  healthFilter: string
  setHealthFilter: (filter: string) => void
  currentPage: number
  itemsPerPage: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
}) {
  const { data, isLoading, error, refetch } = useQuery<PositionsResponse>({
    queryKey: ["aavePositions"],
    queryFn: fetchAavePositions,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  })

  // Fetch hub assets
  const { data: hubAssetsData, isLoading: isLoadingHubAssets, refetch: refetchHubAssets } = useQuery<HubAsset[]>({
    queryKey: ["hubAssets"],
    queryFn: fetchHubAssets,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refetch every minute
  })

  const hubAssets = hubAssetsData || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
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

  if (isLoading) {
    return <PositionsSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <p>Failed to load AAVE positions. Please try again.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
                          </Button>
                        </div>
                  </CardContent>
                </Card>
    )
  }

  const positions = data?.positions || []
  const stats = data?.stats || {
    totalSupplied: 0,
    totalBorrowed: 0,
    activePositions: 0,
    avgHealthFactor: 0,
    atRiskPositions: 0,
    totalAvailableToBorrow: 0,
  }

  const filteredPositions = positions.filter((position) => {
    const matchesSearch =
      position.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.spokeAddress.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesHealth = true
    if (healthFilter === "healthy") matchesHealth = position.healthFactor >= 2.0
    else if (healthFilter === "warning") matchesHealth = position.healthFactor >= 1.5 && position.healthFactor < 2.0
    else if (healthFilter === "critical") matchesHealth = position.healthFactor < 1.5

    return matchesSearch && matchesHealth
  })

  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPositions = filteredPositions.slice(startIndex, endIndex)

  return (
    <>
          {/* Hub Assets Overview */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Liquidity Hub Assets</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Available assets and interest rates</p>
                </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent" onClick={() => {
              refetch()
              refetchHubAssets()
            }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Rates
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
          {isLoadingHubAssets ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-3 w-32 mb-2" />
                    <Skeleton className="h-3 w-28 mb-2" />
                    <Skeleton className="h-3 w-36 mb-3" />
                    <Skeleton className="h-2 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hubAssets.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Hub Assets Available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time data is not available. Please ensure:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto">
                <li>• Blockchain contracts are configured in environment variables</li>
                <li>• Hub assets are stored in the database</li>
                <li>• Network connection is stable</li>
              </ul>
            </div>
          ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hubAssets.map((asset) => (
                  <Card key={asset.symbol} className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{asset.symbol}</h3>
                          <p className="text-xs text-muted-foreground">{asset.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                        {asset.utilizationRate.toFixed(1)}% Utilized
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Supply APY</span>
                        <span className="text-green-500 font-medium">{asset.supplyAPY.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Borrow APY</span>
                        <span className="text-orange-500 font-medium">{asset.borrowAPY.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Total Liquidity</span>
                          <span className="font-medium">{formatCurrency(asset.totalLiquidity)}</span>
                        </div>
                      </div>
                      <Progress value={asset.utilizationRate} className="mt-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
          )}
            </CardContent>
          </Card>

          {/* Positions Table */}
      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Group Positions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm">
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm">
                <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 space-y-3">
            <div className="relative w-full">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search by group or address..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-8 sm:pl-9 text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={healthFilter}
                onValueChange={(value) => {
                  setHealthFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Health Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="healthy">Healthy (≥2.0)</SelectItem>
                  <SelectItem value="warning">Warning (1.5-2.0)</SelectItem>
                  <SelectItem value="critical">Critical (&lt;1.5)</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Group</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Health Factor</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Supplied</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Borrowed</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Available</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Net APY</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPositions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No positions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPositions.map((position) => (
                    <TableRow key={position.id} className="hover:bg-muted/50">
                      <TableCell className="min-w-[200px]">
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{position.groupName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {position.spokeAddress.slice(0, 6)}...{position.spokeAddress.slice(-4)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`font-bold text-sm ${getHealthFactorColor(position.healthFactor)}`}>
                            {position.healthFactor.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(position.totalSupplied)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(position.totalBorrowed)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(position.availableToBorrow)}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs sm:text-sm font-medium ${position.netAPY >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {position.netAPY >= 0 ? "+" : ""}
                          {position.netAPY}%
                        </span>
                      </TableCell>
                      <TableCell>{getHealthFactorBadge(position.healthFactor)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                              window.location.href = `/Super-user/aave/positions/${position.groupId}`
                          }}
                          className="text-xs"
                        >
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {filteredPositions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPositions.length)} of {filteredPositions.length}{" "}
                positions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="h-8 w-8 hidden sm:inline-flex"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                  <span className="text-sm sm:hidden">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export function AaveView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("ledger-engine")
  const [actionDialog, setActionDialog] = useState<{ type: "supply" | "borrow" | "repay" | "withdraw" | null }>({
    type: null,
  })
  const [actionAmount, setActionAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showReconciliationDialog, setShowReconciliationDialog] = useState(false)

  const queryClient = useQueryClient()
  
  // Get stats from shared query (PositionsContent handles the refetching)
  // Disable refetchInterval here to avoid conflicts - PositionsContent will handle refetching
  // React Query will share this query with PositionsContent since they use the same key
  const { data: positionsData } = useQuery<PositionsResponse>({
    queryKey: ["aavePositions"],
    queryFn: fetchAavePositions,
    staleTime: 30000,
    refetchOnWindowFocus: false, // Disabled to avoid conflicts with PositionsContent
    refetchInterval: false, // Disabled - PositionsContent handles refetching
  })

  const stats = positionsData?.stats || {
    totalSupplied: 0,
    totalBorrowed: 0,
    activePositions: 0,
    avgHealthFactor: 0,
    atRiskPositions: 0,
    totalAvailableToBorrow: 0,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
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

  const executeAction = async () => {
    if (!actionDialog.type || !selectedAsset || !actionAmount) {
      return
    }

    try {
      let endpoint = ""
      let body: any = {
        asset: selectedAsset,
        amount: actionAmount,
      }

      switch (actionDialog.type) {
        case "supply":
          endpoint = "/api/aave/deposit"
          break
        case "borrow":
          endpoint = "/api/aave/borrow"
          body.interestRateMode = 2 // Variable rate
          break
        case "repay":
          endpoint = "/api/aave/repay"
          body.rateMode = 2 // Variable rate
          break
        case "withdraw":
          endpoint = "/api/aave/withdraw"
          break
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Transaction failed")
      }

      // Show success message
      console.log("Transaction successful:", data)
      
      // Close dialog and reset form
    setActionDialog({ type: null })
    setActionAmount("")
    setSelectedAsset("")

      // Optionally refetch positions data
      // You can add a refetch function here if needed
    } catch (error) {
      console.error("Transaction error:", error)
      // Show error message to user
      alert(error instanceof Error ? error.message : "Transaction failed")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Supplied</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalSupplied)}
                </p>
                </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Assets in AAVE</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Borrowed</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalBorrowed)}
                  </p>
                </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Outstanding debt</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Positions</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.activePositions}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Groups using AAVE</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Health Factor</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.avgHealthFactor.toFixed(2)}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Overall health</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.atRiskPositions}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalAvailableToBorrow)}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Borrow capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Pollen Ledger-Driven Financial System */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto gap-1">
          <TabsTrigger value="ledger-engine" className="text-xs py-2 gap-1">
            <Database className="h-3 w-3" />
            <span className="hidden sm:inline">Ledger Engine</span>
            <span className="sm:hidden">Ledger</span>
          </TabsTrigger>
          <TabsTrigger value="wallets" className="text-xs py-2 gap-1">
            <Wallet className="h-3 w-3" />
            <span className="hidden sm:inline">Wallet Execute</span>
            <span className="sm:hidden">Wallets</span>
          </TabsTrigger>
          <TabsTrigger value="village-ledger" className="text-xs py-2 gap-1">
            <Users className="h-3 w-3" />
            <span className="hidden sm:inline">Village Ledger</span>
            <span className="sm:hidden">Village</span>
          </TabsTrigger>
          <TabsTrigger value="interest-flow" className="text-xs py-2 gap-1">
            <Coins className="h-3 w-3" />
            <span className="hidden sm:inline">Interest Flow</span>
            <span className="sm:hidden">Interest</span>
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="text-xs py-2 gap-1">
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reconciliation</span>
            <span className="sm:hidden">Recon</span>
          </TabsTrigger>
          <TabsTrigger value="positions" className="text-xs py-2 gap-1">
            <Layers className="h-3 w-3" />
            <span className="hidden sm:inline">Positions</span>
            <span className="sm:hidden">Pos</span>
          </TabsTrigger>
        </TabsList>

        {/* Ledger Engine Tab - Source of Truth */}
        <TabsContent value="ledger-engine" className="space-y-4">
          <Suspense fallback={<LedgerEngineSkeleton />}>
            <LedgerEngineContent />
          </Suspense>
        </TabsContent>

        {/* Wallet Execute Tab */}
        <TabsContent value="wallets" className="space-y-4">
          <Suspense fallback={<WalletExecutionSkeleton />}>
            <WalletExecutionContent />
          </Suspense>
        </TabsContent>

        {/* Village Banking Ledger Tab */}
        <TabsContent value="village-ledger" className="space-y-4">
          <Suspense fallback={<VillageLedgerSkeleton />}>
            <VillageLedgerContent />
          </Suspense>
        </TabsContent>

        {/* Savings Interest Flow Tab */}
        <TabsContent value="interest-flow" className="space-y-4">
          <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-cyan-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Savings Interest Flow</CardTitle>
                  <CardDescription>Track how interest is generated and distributed</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {/* Flow Visualization */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <PiggyBank className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Savings Principal</p>
                    <p className="text-xl font-bold">{formatCurrency(interestFlowData.savingsPrincipal)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/10 border-purple-500/20">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Gross Interest</p>
                    <p className="text-xl font-bold text-green-500">+{formatCurrency(interestFlowData.grossInterest)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-orange-500/10 border-orange-500/20">
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Platform Fee (10%)</p>
                    <p className="text-xl font-bold text-red-500">-{formatCurrency(interestFlowData.platformFee)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <Wallet className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Net to Users</p>
                    <p className="text-xl font-bold text-green-500">{formatCurrency(interestFlowData.netInterestToUsers)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Yield Sources */}
              <Card className="bg-muted/50">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">Yield Sources</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {interestFlowData.yieldSources.map((source, index) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Reconciliation Tab */}
        <TabsContent value="reconciliation" className="space-y-4">
          <Card className={`bg-gradient-to-r ${reconciliationData.status === "ALERT" ? "from-yellow-500/10 to-orange-500/10 border-yellow-500/20" : "from-green-500/10 to-emerald-500/10 border-green-500/20"}`}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg ${reconciliationData.status === "ALERT" ? "bg-yellow-500/20" : "bg-green-500/20"} flex items-center justify-center`}>
                    <RotateCcw className={`h-6 w-6 ${reconciliationData.status === "ALERT" ? "text-yellow-500" : "text-green-500"}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Daily Reconciliation</CardTitle>
                    <CardDescription>Ledger vs Bank vs Blockchain matching</CardDescription>
                    </div>
                </div>
                <Badge className={`${reconciliationData.status === "ALERT" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>
                  {reconciliationData.status === "ALERT" ? <AlertTriangle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                  {reconciliationData.status}
                    </Badge>
                  </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {/* Balance Comparison */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <Database className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Ledger Balance</p>
                    <p className="text-lg font-bold">{formatCurrency(reconciliationData.ledgerBalance)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4 text-center">
                    <Building2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Bank Balance</p>
                    <p className="text-lg font-bold">{formatCurrency(reconciliationData.bankBalance)}</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/10 border-purple-500/20">
                  <CardContent className="p-4 text-center">
                    <Blocks className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Blockchain Balance</p>
                    <p className="text-lg font-bold">{formatCurrency(reconciliationData.blockchainBalance)}</p>
                  </CardContent>
                </Card>
                </div>

              {/* Match Status */}
              <Card className="bg-muted/50 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Reconciliation Status</p>
                      <p className="text-xs text-muted-foreground">Last checked: {reconciliationData.date}</p>
              </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total Executed</p>
                        <p className="text-sm font-medium">{formatCurrency(reconciliationData.totalExecuted)}</p>
            </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Difference</p>
                        <p className={`text-sm font-medium ${reconciliationData.difference > 0 ? "text-yellow-500" : "text-green-500"}`}>
                          {formatCurrency(reconciliationData.difference)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {reconciliationData.alerts.length > 0 && (
                <Card className="bg-yellow-500/10 border-yellow-500/20">
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Alerts to Investigate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {reconciliationData.alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{alert.description}</p>
                          <p className="text-xs text-muted-foreground">Amount: {formatCurrency(alert.amount)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-500/10 text-yellow-500 text-xs">{alert.resolution}</Badge>
                          <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => setShowReconciliationDialog(true)}>
                            Investigate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab (Original Hub Assets and Positions) */}
        <TabsContent value="positions" className="space-y-4">
          <Suspense fallback={<PositionsSkeleton />}>
            <PositionsContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              healthFilter={healthFilter}
              setHealthFilter={setHealthFilter}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              setItemsPerPage={setItemsPerPage}
            />
          </Suspense>
        </TabsContent>
      </Tabs>


      {/* Reconciliation Investigation Dialog */}
      <Dialog open={showReconciliationDialog} onOpenChange={setShowReconciliationDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Investigate Discrepancy
            </DialogTitle>
            <DialogDescription>Review and resolve reconciliation alerts</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm font-medium mb-2">Alert Details</p>
              <p className="text-xs text-muted-foreground mb-2">Pending transfer not yet confirmed on blockchain</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Amount</span>
<span className="font-medium">{formatCurrency(reconciliationData.alerts[0]?.amount || 0)}</span>
            </div>
          </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Resolution Options</p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Clock className="h-4 w-4 mr-2" />
                  Wait for blockchain confirmation
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry transaction
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 bg-transparent">
                  <XCircle className="h-4 w-4 mr-2" />
                  Mark as failed and reverse ledger entry
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReconciliationDialog(false)} className="bg-transparent">Cancel</Button>
            <Button>Resolve Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
