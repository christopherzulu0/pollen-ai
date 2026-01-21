"use client"

import { useState, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
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
  const response = await fetch("/api/admin/ledger-entries")
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
                      <TableCell className="text-xs">{entry.user}</TableCell>
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
                  <p className="text-xs text-muted-foreground">User/Group</p>
                  <p className="text-sm">{selectedEntry.user}</p>
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
  const response = await fetch("/api/admin/village-ledgers")
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
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
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

// Mock data for AAVE positions
const mockPositions = [
  {
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
    ],
  },
  {
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
    supplies: [{ asset: "cUSD", amount: 8000, apy: 2.8, ltv: 0.8, balance: 8000, valueUSD: 8000 }],
    borrows: [{ asset: "cUSD", amount: 4200, apy: 4.5, balance: 4230, valueUSD: 4230 }],
    recentActivity: [
      { type: "SUPPLY", asset: "cUSD", amount: 1000, date: "2024-03-14T11:00:00", txHash: "0xjkl012..." },
      { type: "BORROW", asset: "cUSD", amount: 500, date: "2024-03-12T15:30:00", txHash: "0xmno345..." },
    ],
  },
  {
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
]

// Available assets in the Hub
const hubAssets = [
  { symbol: "cUSD", name: "Celo Dollar", totalLiquidity: 5000000, utilizationRate: 65, supplyAPY: 2.5, borrowAPY: 4.2 },
  { symbol: "CELO", name: "Celo Native", totalLiquidity: 100000, utilizationRate: 58, supplyAPY: 3.2, borrowAPY: 5.5 },
  { symbol: "cEUR", name: "Celo Euro", totalLiquidity: 2000000, utilizationRate: 42, supplyAPY: 2.0, borrowAPY: 3.8 },
]

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

  const stats = {
    totalSupplied: mockPositions.reduce((sum, p) => sum + p.totalSupplied, 0),
    totalBorrowed: mockPositions.reduce((sum, p) => sum + p.totalBorrowed, 0),
    activePositions: mockPositions.length,
    avgHealthFactor: (mockPositions.reduce((sum, p) => sum + p.healthFactor, 0) / mockPositions.length).toFixed(2),
    atRiskPositions: mockPositions.filter((p) => p.healthFactor < 1.5).length,
    totalAvailableToBorrow: mockPositions.reduce((sum, p) => sum + p.availableToBorrow, 0),
  }



  const filteredPositions = mockPositions.filter((position) => {
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
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.avgHealthFactor}</p>
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
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Wallets Execute */}
            <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Wallets Execute</CardTitle>
                    <CardDescription>Blockchain transaction execution layer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Send/Receive</p>
                      <p className="text-xs text-muted-foreground">Execute blockchain transactions</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">No Context</p>
                      <p className="text-xs text-muted-foreground">Stateless execution</p>
                    </div>
                    <Badge className="bg-yellow-500/10 text-yellow-500">Info</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Not Reversible</p>
                      <p className="text-xs text-muted-foreground">Blockchain finality</p>
                    </div>
                    <Badge className="bg-red-500/10 text-red-500">Warning</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ledgers Explain */}
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Ledgers Explain</CardTitle>
                    <CardDescription>Transaction records and audit trails</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Transaction Records</p>
                      <p className="text-xs text-muted-foreground">Complete history of all operations</p>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500">All Records</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Audit Trail</p>
                      <p className="text-xs text-muted-foreground">Immutable record keeping</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">Verified</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-teal-500/10 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Reversible Entries</p>
                      <p className="text-xs text-muted-foreground">Correction and adjustment support</p>
                    </div>
                    <Badge className="bg-teal-500/10 text-teal-500">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Execution Layer */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Execution Layer (Bank / Blockchain)
              </CardTitle>
              <CardDescription>Dual execution channels for fiat and crypto transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-blue-500/10 border-blue-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-semibold">Traditional Banking</p>
                        <p className="text-xs text-muted-foreground">Mobile Money & Bank Transfers</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Balance</span>
                        <span className="font-medium">{formatCurrency(reconciliationData.bankBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-medium text-yellow-500">{formatCurrency(reconciliationData.totalExecuted - reconciliationData.bankBalance - reconciliationData.blockchainBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="bg-green-500/10 text-green-500 text-xs">Connected</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-500/10 border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Blocks className="h-8 w-8 text-purple-500" />
                      <div>
                        <p className="font-semibold">Celo Blockchain</p>
                        <p className="text-xs text-muted-foreground">cUSD, CELO, cEUR</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Balance</span>
                        <span className="font-medium">{formatCurrency(reconciliationData.blockchainBalance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-medium text-yellow-500">{formatCurrency(reconciliationData.difference)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="bg-green-500/10 text-green-500 text-xs">Synced</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
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
          {/* Hub Assets Overview */}
          <Card className="bg-card">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Liquidity Hub Assets</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Available assets and interest rates</p>
                </div>
                <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Rates
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
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
                          {asset.utilizationRate}% Utilized
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Supply APY</span>
                          <span className="text-green-500 font-medium">{asset.supplyAPY}%</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Borrow APY</span>
                          <span className="text-orange-500 font-medium">{asset.borrowAPY}%</span>
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
            </CardContent>
          </Card>

          {/* Positions Table */}
      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Group Positions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
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
                  {paginatedPositions.map((position) => (
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
                            window.location.href = `/admin/aave/positions/${position.groupId}`
                          }}
                          className="text-xs"
                        >
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
