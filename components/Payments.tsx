"use client"

import { useEffect, useState, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "FAILED":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  // Get transaction type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return <ArrowDownCircle className="h-4 w-4 text-emerald-500" />
      case "WITHDRAWAL":
        return <ArrowUpCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
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
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      {/* Header with gradient background */}
      <div className="relative mb-8 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Payment History</h1>
          <p className="text-violet-100 max-w-xl text-sm">
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
          className="overflow-hidden border-0 bg-gradient-to-br from-white to-violet-50 shadow-md dark:from-gray-900 dark:to-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("all")
            setStatusFilter("all")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium">Total Balance</CardTitle>
              <div className="h-7 w-7 rounded-full bg-violet-100 flex items-center justify-center dark:bg-violet-900">
                <Wallet className="h-3.5 w-3.5 text-violet-600 dark:text-violet-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(summaryMetrics.balance)}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Current available balance</p>
            <div className="mt-3 h-1 w-full bg-violet-100 rounded-full overflow-hidden dark:bg-gray-700">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (summaryMetrics.totalDeposits / (summaryMetrics.totalDeposits + summaryMetrics.totalWithdrawals)) * 100)}%`,
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 shadow-md dark:from-gray-900 dark:to-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("deposits")
            setStatusFilter("all")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium">Total Deposits</CardTitle>
              <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center dark:bg-emerald-900">
                <ArrowDownCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(summaryMetrics.totalDeposits)}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
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
                    className="h-6 w-2 bg-emerald-100 dark:bg-emerald-900 rounded-sm transition-all duration-300"
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
          className="overflow-hidden border-0 bg-gradient-to-br from-white to-red-50 shadow-md dark:from-gray-900 dark:to-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("withdrawals")
            setStatusFilter("all")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium">Total Withdrawals</CardTitle>
              <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900">
                <ArrowUpCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-600 dark:text-red-400">
              {isLoading ? <Skeleton className="h-6 w-20" /> : formatAmount(summaryMetrics.totalWithdrawals)}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[10px] text-red-600 dark:text-red-400 font-medium">
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
                    className="h-6 w-2 bg-red-100 dark:bg-red-900 rounded-sm transition-all duration-300"
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
          className="overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50 shadow-md dark:from-gray-900 dark:to-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            setFilter("all")
            setStatusFilter("pending")
          }}
        >
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-medium">Pending Transactions</CardTitle>
              <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900">
                <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {isLoading ? <Skeleton className="h-6 w-10" /> : summaryMetrics.pendingTransactions}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Transactions awaiting completion</p>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-amber-200 dark:bg-amber-800 transition-all duration-300"
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
            className="pl-9 bg-white dark:bg-gray-950 border-0 shadow-sm h-9 rounded-lg text-sm"
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
            <SelectTrigger className="w-[140px] bg-white dark:bg-gray-950 border-0 shadow-sm h-9 rounded-lg text-sm">
              <SelectValue placeholder="Transaction Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Transactions</SelectItem>
                            <SelectItem value="deposits">Deposits Only</SelectItem>
                            <SelectItem value="withdrawals">Withdrawals Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white dark:bg-gray-950 border-0 shadow-sm h-9 rounded-lg text-sm">
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
                className="h-9 px-3 bg-white dark:bg-gray-950 border-0 shadow-sm rounded-lg text-sm"
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
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white px-6 dark:from-gray-900 dark:to-gray-800">
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
                className="h-8 gap-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-xs"
              >
                <BarChart3 className="h-3 w-3" />
                <span>Analytics</span>
                        </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedTransaction(transaction)
                      setIsDetailsOpen(true)
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            transaction.type === "DEPOSIT"
                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                              : "bg-red-100 dark:bg-red-900/30"
                          }`}
                        >
                          {getTypeIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{getTransactionDescription(transaction)}</div>
                          <div className="text-xs text-muted-foreground">{transaction.momoNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-1.5">
                          <AvatarFallback className="text-[10px] bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300">
                            {transaction.group ? transaction.group.name.substring(0, 2).toUpperCase() : "PW"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[120px]">{transaction.group?.name || "Personal Wallet"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{format(new Date(transaction.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell
                      className={`text-right text-sm font-medium ${
                        transaction.type === "DEPOSIT"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "DEPOSIT" ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {getStatusIcon(transaction.status)}
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0 ${
                            transaction.status === "COMPLETED"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                              : transaction.status === "PENDING"
                                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-400"
                                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400"
                          }
                        `}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
        <SheetContent className="sm:max-w-md border-0 shadow-xl">
          <SheetHeader className="border-b pb-4">
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
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {selectedTransaction.type === "DEPOSIT" ? (
                      <ArrowDownCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ArrowUpCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div
                    className={`text-2xl font-bold ${
                      selectedTransaction.type === "DEPOSIT"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {selectedTransaction.type === "DEPOSIT" ? "+" : "-"}
                    {formatAmount(selectedTransaction.amount)}
                              </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(selectedTransaction.createdAt), "PPpp")}
                              </div>
                            </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">Transaction ID</div>
                    <div className="font-medium text-xs text-gray-500">{selectedTransaction.id}</div>
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
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : selectedTransaction.status === "PENDING"
                              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-400"
                              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400"
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
                    <div className="font-medium text-xs text-gray-500">
                      {getTransactionDescription(selectedTransaction)}
                          </div>
                        </div>

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Mobile Number</div>
                    <div className="font-medium text-xs text-gray-500">{selectedTransaction.momoNumber}</div>
                  </div>

                  {selectedTransaction.reference && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Reference</div>
                      <div className="font-medium text-xs text-gray-500">{selectedTransaction.reference}</div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Account Type</div>
                    <div className="font-medium text-xs text-gray-500">
                      {selectedTransaction.group ? "Group Account" : "Personal Wallet"}
                    </div>
                  </div>

                  {selectedTransaction.group && (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Group Name</div>
                      <div className="font-medium text-xs text-gray-500">{selectedTransaction.group.name}</div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="pt-3 space-y-3">
                  <Button variant="default" className="w-full bg-violet-600 hover:bg-violet-700 text-sm h-9">
                    Download Receipt
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full text-gray-500 text-sm h-9"
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
