"use client"

import { useEffect, useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Download,
  Search,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  BarChart3,
  CreditCard,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useToast } from "@/components/ui/use-toast"
import { format, subDays, isAfter, isBefore } from "date-fns"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { DateRangePicker } from "./date-range-picker"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { DateRange } from "react-day-picker"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCeloWallet } from "@/lib/celo/context"
import { Coins, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  amount: number
  type: "DEPOSIT" | "WITHDRAWAL"
  status: "PENDING" | "COMPLETED" | "FAILED"
  createdAt: string
  momoNumber: string
  reference?: string
  group?: {
    name: string
    id?: string
  }
  wallet?: {
    id: string
    name?: string
  }
  // Celo blockchain transaction fields
  hash?: string
  currency?: "CELO" | "cUSD" | "cEUR" | "ZMW"
  from?: string
  to?: string
  blockNumber?: number | null
  gasUsed?: string | null
  explorerUrl?: string | null
  isBlockchain?: boolean
}

export default function Payments() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction | "group.name"
    direction: "ascending" | "descending"
  } | null>(null)

  const { toast } = useToast()
  const itemsPerPage = 8
  const { isConnected, address } = useCeloWallet()

  // Fetch regular transactions
  useEffect(() => {
    fetchTransactions()
  }, [filter, statusFilter])

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/transactions")
      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Celo blockchain transactions
  const { data: celoTransactionsData, isLoading: isLoadingCelo } = useQuery({
    queryKey: ['celo-transactions', address],
    queryFn: async () => {
      const response = await fetch("/api/celo/transactions")
      if (!response.ok) {
        throw new Error("Failed to fetch Celo transactions")
      }
      const data = await response.json()
      return data
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Merge regular and Celo transactions
  useEffect(() => {
    if (celoTransactionsData?.transactions) {
      const celoTxs = celoTransactionsData.transactions.map((tx: any) => ({
        id: tx.id || tx.hash,
        hash: tx.hash,
        amount: parseFloat(tx.amount),
        type: "DEPOSIT" as const, // Celo transactions are typically deposits
        status: tx.status === "confirmed" ? "COMPLETED" as const : 
                tx.status === "pending" ? "PENDING" as const : 
                "FAILED" as const,
        createdAt: tx.timestamp,
        momoNumber: tx.from || "",
        reference: tx.hash,
        currency: tx.currency || "CELO",
        from: tx.from,
        to: tx.to,
        blockNumber: tx.blockNumber,
        gasUsed: tx.gasUsed,
        explorerUrl: tx.explorerUrl,
        isBlockchain: true,
      }))
      
      // Merge with existing transactions, avoiding duplicates
      setTransactions((prev) => {
        const existingIds = new Set(prev.map(t => t.id))
        const newCeloTxs = celoTxs.filter((tx: Transaction) => !existingIds.has(tx.id))
        return [...prev, ...newCeloTxs].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      })
    }
  }, [celoTransactionsData])

  // Apply filters, search, and date range
  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // Type filter
    if (filter !== "all") {
      if (filter === "deposits") {
        result = result.filter((transaction) => transaction.type === "DEPOSIT")
      } else if (filter === "withdrawals") {
        result = result.filter((transaction) => transaction.type === "WITHDRAWAL")
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        result = result.filter((transaction) => transaction.status === "PENDING")
      } else if (statusFilter === "completed") {
        result = result.filter((transaction) => transaction.status === "COMPLETED")
      } else if (statusFilter === "failed") {
        result = result.filter((transaction) => transaction.status === "FAILED")
      }
    }

    // Date range filter
    if (dateRange?.from) {
      result = result.filter((transaction) => isAfter(new Date(transaction.createdAt), dateRange.from!))
    }

    if (dateRange?.to) {
      result = result.filter((transaction) => isBefore(new Date(transaction.createdAt), dateRange.to!))
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(query) ||
          transaction.momoNumber.toLowerCase().includes(query) ||
          transaction.reference?.toLowerCase().includes(query) ||
          transaction.group?.name.toLowerCase().includes(query) ||
          false,
      )
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any
        let bValue: any

        if (sortConfig.key === "group.name") {
          aValue = a.group?.name || ""
          bValue = b.group?.name || ""
        } else {
          aValue = a[sortConfig.key]
          bValue = b[sortConfig.key]
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [transactions, filter, statusFilter, dateRange, searchQuery, sortConfig])

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalDeposits = transactions
      .filter((t) => t.type === "DEPOSIT" && t.status === "COMPLETED")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalWithdrawals = transactions
      .filter((t) => t.type === "WITHDRAWAL" && t.status === "COMPLETED")
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const pendingTransactions = transactions.filter((t) => t.status === "PENDING").length

    const balance = totalDeposits - totalWithdrawals

    return {
      totalDeposits,
      totalWithdrawals,
      pendingTransactions,
      balance,
    }
  }, [transactions])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMW",
    }).format(amount)
  }

  const getTransactionDescription = (transaction: Transaction) => {
    if (transaction.group) {
      return `Group Contribution - ${transaction.group.name}`
    }
    return transaction.type === "DEPOSIT" ? "Personal Deposit" : "Personal Withdrawal"
  }

  const downloadReceipt = (tx: Transaction) => {
    const dateStr = format(new Date(tx.createdAt), "yyyy-MM-dd_HH-mm")
    const description = getTransactionDescription(tx)
    const amountStr = formatAmount(tx.amount)
    const typeLabel = tx.type === "DEPOSIT" ? "Deposit" : "Withdrawal"
    const sign = tx.type === "DEPOSIT" ? "+" : "-"

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Receipt - ${typeLabel} - ${dateStr}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 400px; margin: 24px auto; padding: 24px; color: #111; position: relative; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); font-size: 4rem; font-weight: 700; color: rgba(0,0,0,0.06); pointer-events: none; user-select: none; white-space: nowrap; z-index: 0; }
    .receipt-content { position: relative; z-index: 1; }
    h1 { font-size: 18px; margin: 0 0 8px 0; }
    .meta { font-size: 12px; color: #666; margin-bottom: 24px; }
    .amount { font-size: 28px; font-weight: 700; margin: 16px 0; }
    .amount.deposit { color: #059669; }
    .amount.withdrawal { color: #dc2626; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    tr { border-bottom: 1px solid #e5e7eb; }
    td { padding: 10px 0; }
    td:first-child { color: #6b7280; }
    td:last-child { text-align: right; font-weight: 500; }
    .footer { margin-top: 32px; font-size: 11px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="watermark" aria-hidden="true">Pollen</div>
  <div class="receipt-content">
    <h1>Transaction Receipt</h1>
    <div class="meta">${format(new Date(tx.createdAt), "PPP 'at' p")}</div>
    <div class="amount ${tx.type === "DEPOSIT" ? "deposit" : "withdrawal"}">${sign} ${amountStr}</div>
    <table>
      <tr><td>Transaction ID</td><td>${tx.id}</td></tr>
      <tr><td>Type</td><td>${typeLabel}</td></tr>
      <tr><td>Status</td><td>${tx.status}</td></tr>
      <tr><td>Description</td><td>${description}</td></tr>
      <tr><td>Mobile Number</td><td>${tx.momoNumber || "—"}</td></tr>
      ${tx.reference ? `<tr><td>Reference</td><td>${tx.reference}</td></tr>` : ""}
      <tr><td>Account</td><td>${tx.group ? `Group - ${tx.group.name}` : "Personal Wallet"}</td></tr>
    </table>
    <div class="footer">Generated from Pollen · This is not a tax document.</div>
  </div>
</body>
</html>`

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `receipt-${typeLabel}-${dateStr}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Receipt downloaded",
      description: "Open the file to view or print your receipt.",
    })
  }

  // Handle sort
  const requestSort = (key: keyof Transaction | "group.name") => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Description", "Group", "Amount", "Status", "Mobile Number"]

    const csvData = filteredTransactions.map((transaction) => [
      format(new Date(transaction.createdAt), "yyyy-MM-dd"),
      getTransactionDescription(transaction),
      transaction.group?.name || "Personal",
      transaction.amount.toString(),
      transaction.status,
      transaction.momoNumber,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: "Your transactions have been exported to CSV",
    })
  }

  // Get status icon (use standard Tailwind colors so icons are visible)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
      case "PENDING":
        return <Clock className="h-4 w-4 shrink-0 text-amber-600" />
      case "FAILED":
        return <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
      default:
        return <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
    }
  }

  // Get transaction type icon
  const getTypeIcon = (transaction: Transaction) => {
    if (transaction.isBlockchain) {
      return <Coins className="h-4 w-4 shrink-0 text-amber-600" />
    }
    switch (transaction.type) {
      case "DEPOSIT":
        return <ArrowDownCircle className="h-4 w-4 shrink-0 text-emerald-600" />
      case "WITHDRAWAL":
        return <ArrowUpCircle className="h-4 w-4 shrink-0 text-red-600" />
      default:
        return <ArrowDownCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
    }
  }

  // Get transaction description with blockchain indicator
  const getTransactionDescriptionWithBlockchain = (transaction: Transaction) => {
    const baseDescription = getTransactionDescription(transaction)
    if (transaction.isBlockchain) {
      const currency = transaction.currency || "CELO"
      return `${baseDescription} (${currency})`
    }
    return baseDescription
  }

  // Render loading skeletons
  const renderSkeletons = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={`skeleton-${index}`} className="animate-pulse">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <Skeleton className="h-4 w-32" />
          </td>
          <td className="px-4 py-4">
            <Skeleton className="h-4 w-20" />
          </td>
          <td className="px-4 py-4 text-right">
            <Skeleton className="h-4 w-16 ml-auto" />
          </td>
          <td className="px-4 py-4 text-right">
            <Skeleton className="h-6 w-20 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  )

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 bg-background text-foreground">
      {/* Header with gradient background */}
      <div className="relative mb-8 rounded-xl bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Payment History</h1>
          <p className="text-primary-foreground/90 max-w-xl text-sm">
            Track and manage all your financial transactions in one place. View deposits, withdrawals, and payment
            status.
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-10 -right-10 h-20 w-20 rounded-full bg-white/10 blur-xl"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card
          className="overflow-hidden bg-card border border-border border-l-4 border-l-primary shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("all")
            setStatusFilter("all")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium text-foreground">Total Balance</CardTitle>
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">
              {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(summaryMetrics.balance)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Current available balance</p>
            <div className="mt-3 h-1 w-full bg-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300 min-w-[4px]"
                style={{
                  width: `${Math.min(100, Math.max(0, (summaryMetrics.totalDeposits / ((summaryMetrics.totalDeposits + summaryMetrics.totalWithdrawals) || 1)) * 100))}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="overflow-hidden bg-card border border-border border-l-4 border-l-secondary shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("deposits")
            setStatusFilter("all")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium text-foreground">Total Deposits</CardTitle>
              <div className="h-7 w-7 rounded-full bg-success/20 flex items-center justify-center">
                <ArrowDownCircle className="h-3.5 w-3.5 text-success" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-success">
              {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(summaryMetrics.totalDeposits)}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[10px] text-muted-foreground font-medium">
                {transactions.filter((t) => t.type === "DEPOSIT" && t.status === "COMPLETED").length} transactions
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const depositAmounts = transactions
                  .filter((t) => t.type === "DEPOSIT" && t.status === "COMPLETED")
                  .map((t) => t.amount)
                const maxAmount = Math.max(...depositAmounts, 1)
                const height = depositAmounts[i] ? (depositAmounts[i] / maxAmount) * 24 : 12
                return (
                  <div
                    key={i}
                    className="h-6 w-2 bg-success/60 rounded-sm transition-all duration-300"
                    style={{
                      height: `${height}px`,
                      opacity: i === 6 ? 1 : 0.7 - (6 - i) * 0.1,
                    }}
                  ></div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card
          className="overflow-hidden bg-card border border-border border-l-4 border-l-destructive shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("withdrawals")
            setStatusFilter("all")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium text-foreground">Total Withdrawals</CardTitle>
              <div className="h-7 w-7 rounded-full bg-destructive/10 flex items-center justify-center">
                <ArrowUpCircle className="h-3.5 w-3.5 text-destructive" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-destructive">
              {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(summaryMetrics.totalWithdrawals)}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[10px] text-muted-foreground font-medium">
                {transactions.filter((t) => t.type === "WITHDRAWAL" && t.status === "COMPLETED").length} transactions
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const withdrawalAmounts = transactions
                  .filter((t) => t.type === "WITHDRAWAL" && t.status === "COMPLETED")
                  .map((t) => t.amount)
                const maxAmount = Math.max(...withdrawalAmounts, 1)
                const height = withdrawalAmounts[i] ? (withdrawalAmounts[i] / maxAmount) * 24 : 12
                return (
                  <div
                    key={i}
                    className="h-6 w-2 bg-destructive/20 rounded-sm transition-all duration-300"
                    style={{
                      height: `${height}px`,
                      opacity: i === 6 ? 1 : 0.7 - (6 - i) * 0.1,
                    }}
                  ></div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card
          className="overflow-hidden bg-card border border-border border-l-4 border-l-warning shadow-md cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("all")
            setStatusFilter("pending")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium text-foreground">Pending Transactions</CardTitle>
              <div className="h-7 w-7 rounded-full bg-warning/20 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-warning" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-warning">
              {isLoading ? <Skeleton className="h-6 w-10" /> : summaryMetrics.pendingTransactions}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Transactions awaiting completion</p>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-warning/70 transition-all duration-300"
                  style={{
                    opacity: i < summaryMetrics.pendingTransactions % 5 ? 1 : 0.3,
                  }}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Search by ID, mobile number, reference..."
            className="pl-9 bg-background border-border shadow-sm h-9 rounded-lg text-sm text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
                      </div>

        <div className="flex flex-wrap gap-3">
          <DateRangePicker className="w-full sm:w-auto" dateRange={dateRange} onDateRangeChange={setDateRange} />

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px] bg-background border-border shadow-sm h-9 rounded-lg text-sm text-foreground">
              <SelectValue placeholder="Transaction Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Transactions</SelectItem>
                            <SelectItem value="deposits">Deposits Only</SelectItem>
                            <SelectItem value="withdrawals">Withdrawals Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-background border-border shadow-sm h-9 rounded-lg text-sm text-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 bg-background border-border shadow-sm rounded-lg text-sm"
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={exportToCSV} className="text-sm">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setFilter("all")
                  setStatusFilter("all")
                  setSearchQuery("")
                  setDateRange({
                    from: subDays(new Date(), 30),
                    to: new Date(),
                  })
                }}
                className="text-sm"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reset all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden bg-card border border-border shadow-lg">
        <CardHeader className="bg-muted/50 border-b border-border px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base">Transaction History</CardTitle>
              <CardDescription className="text-xs">
                {filteredTransactions.length} transactions found
                {dateRange?.from && dateRange?.to && (
                  <>
                    {" "}
                    from {format(dateRange.from, "MMM d, yyyy")} to {format(dateRange.to, "MMM d, yyyy")}
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-lg text-xs"
                onClick={() => fetchTransactions()}
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              >
                <BarChart3 className="h-3 w-3" />
                <span>Analytics</span>
                        </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-xs font-medium text-muted-foreground">Transaction</TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer"
                  onClick={() => requestSort("group.name")}
                >
                  <div className="flex items-center">
                    Group
                    {sortConfig?.key === "group.name" && (
                      <ArrowUpDown
                        className={`ml-1 h-3 w-3 ${sortConfig.direction === "ascending" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig?.key === "createdAt" && (
                      <ArrowUpDown
                        className={`ml-1 h-3 w-3 ${sortConfig.direction === "ascending" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground text-right cursor-pointer"
                  onClick={() => requestSort("amount")}
                >
                  <div className="flex items-center justify-end">
                    Amount
                    {sortConfig?.key === "amount" && (
                      <ArrowUpDown
                        className={`ml-1 h-3 w-3 ${sortConfig.direction === "ascending" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="text-xs font-medium text-muted-foreground text-right cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center justify-end">
                    Status
                    {sortConfig?.key === "status" && (
                      <ArrowUpDown
                        className={`ml-1 h-3 w-3 ${sortConfig.direction === "ascending" ? "rotate-0" : "rotate-180"}`}
                      />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="animate-pulse">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2 w-14" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-3 w-14 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <CreditCard className="h-10 w-10 mb-2 text-muted-foreground/50" />
                      <p className="text-sm font-medium">No transactions found</p>
                      <p className="text-xs">Try adjusting your filters or search criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTransaction(transaction)
                      setIsDetailsOpen(true)
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                            transaction.isBlockchain
                              ? "bg-amber-100 dark:bg-amber-950/50"
                              : transaction.type === "DEPOSIT"
                                ? "bg-emerald-100 dark:bg-emerald-950/50"
                                : "bg-red-100 dark:bg-red-950/50"
                          }`}
                        >
                          {getTypeIcon(transaction)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{getTransactionDescriptionWithBlockchain(transaction)}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.isBlockchain 
                              ? `${transaction.from?.substring(0, 6)}...${transaction.from?.substring(38)}` 
                              : transaction.momoNumber}
                          </div>
                          {transaction.isBlockchain && transaction.explorerUrl && (
                            <a 
                              href={transaction.explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View on Explorer <ExternalLink className="h-2 w-2" />
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-1.5">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {transaction.group ? transaction.group.name.substring(0, 2).toUpperCase() : "PW"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[120px]">{transaction.group?.name || "Personal Wallet"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{format(new Date(transaction.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell
                      className={`text-right text-sm font-medium ${
                        transaction.isBlockchain
                          ? "text-amber-600"
                          : transaction.type === "DEPOSIT"
                            ? "text-emerald-600"
                            : "text-destructive"
                      }`}
                    >
                      {transaction.type === "DEPOSIT" ? "+" : "-"}
                      {transaction.isBlockchain && transaction.currency && transaction.currency !== "ZMW" 
                        ? `${transaction.amount.toFixed(4)} ${transaction.currency}`
                        : formatAmount(transaction.amount)
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getStatusIcon(transaction.status)}
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0 ${
                            transaction.isBlockchain
                              ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                              : transaction.status === "COMPLETED"
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : transaction.status === "PENDING"
                                  ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                                  : "border-destructive/30 bg-destructive/10 text-destructive"
                          }
                        `}
                        >
                          {transaction.isBlockchain ? "BLOCKCHAIN" : transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="bg-muted/50 border-t border-border">
              <TableRow>
                <TableCell colSpan={3} className="text-xs text-muted-foreground">
                  Showing {paginatedTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}{" "}
                  transactions
                </TableCell>
                <TableCell colSpan={2}>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <div className="text-xs font-medium">
                      Page {currentPage} of {totalPages || 1}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
                    </Card>

      {/* Transaction Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-md bg-card border border-border shadow-xl">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-base">Transaction Details</SheetTitle>
            <SheetDescription className="text-xs">Complete information about this transaction</SheetDescription>
          </SheetHeader>
          {selectedTransaction && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="py-4 space-y-4">
                <div className="flex justify-center mb-4">
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center ${
                      selectedTransaction.type === "DEPOSIT"
                        ? "bg-success/20"
                        : "bg-destructive/20"
                    }`}
                  >
                    {selectedTransaction.type === "DEPOSIT" ? (
                      <ArrowDownCircle className="h-7 w-7 text-success" />
                    ) : (
                      <ArrowUpCircle className="h-7 w-7 text-destructive" />
                    )}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div
                    className={`text-2xl font-bold ${
                      selectedTransaction.type === "DEPOSIT"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {selectedTransaction.type === "DEPOSIT" ? "+" : "-"}
                    {formatAmount(selectedTransaction.amount)}
                              </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(selectedTransaction.createdAt), "PPpp")}
                              </div>
                            </div>

                <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Transaction ID</div>
                    <div className="font-medium text-xs text-foreground">{selectedTransaction.id}</div>
                            </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Type</div>
                    <Badge
                      variant={selectedTransaction.type === "DEPOSIT" ? "outline" : "secondary"}
                      className="text-xs px-1.5 py-0"
                    >
                      {selectedTransaction.type}
                    </Badge>
                          </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedTransaction.status)}
                      <Badge
                        variant="outline"
                        className={`text-xs px-1.5 py-0 ${
                          selectedTransaction.status === "COMPLETED"
                            ? "border-success/30 bg-success/10 text-success"
                            : selectedTransaction.status === "PENDING"
                              ? "border-warning/30 bg-warning/10 text-warning"
                              : "border-destructive/30 bg-destructive/10 text-destructive"
                        }
                      `}
                      >
                        {selectedTransaction.status}
                      </Badge>
                              </div>
                              </div>
                            </div>

                <Separator />

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Description</div>
                    <div className="font-medium text-xs text-foreground">
                      {getTransactionDescription(selectedTransaction)}
                          </div>
                        </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Mobile Number</div>
                    <div className="font-medium text-xs text-foreground">{selectedTransaction.momoNumber}</div>
                  </div>

                  {selectedTransaction.reference && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Reference</div>
                      <div className="font-medium text-xs text-foreground">{selectedTransaction.reference}</div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Account Type</div>
                    <div className="font-medium text-xs text-foreground">
                      {selectedTransaction.group ? "Group Account" : "Personal Wallet"}
                    </div>
                  </div>

                  {selectedTransaction.group && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Group Name</div>
                      <div className="font-medium text-xs text-foreground">{selectedTransaction.group.name}</div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="pt-3 space-y-3">
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm h-9 gap-2"
                    onClick={() => selectedTransaction && downloadReceipt(selectedTransaction)}
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground text-sm h-9"
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
