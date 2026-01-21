"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  Building2,
  User,
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Transaction type definition
type Transaction = {
  id: string
  reference: string
  user: { name: string; email: string; id: string }
  type: string
  amount: number
  status: string
  date: string
  description: string
  momoNumber: string | null
  feeAmount: number
  group: { name: string; id: string } | null
  wallet: { celoAddress: string | null } | null
}

// Fetch transactions from API
const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch("/api/admin/transactions")
  if (!response.ok) {
    throw new Error("Failed to fetch transactions")
  }
  return response.json()
}

const statusColors = {
  COMPLETED: "bg-success text-success-foreground",
  PENDING: "bg-warning text-warning-foreground",
  FAILED: "bg-destructive text-destructive-foreground",
  CANCELLED: "bg-muted text-muted-foreground",
}

const typeColors = {
  DEPOSIT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  WITHDRAWAL: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  CONTRIBUTION: "bg-green-500/10 text-green-500 border-green-500/20",
  INTEREST: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  FEE: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  PENALTY: "bg-red-500/10 text-red-500 border-red-500/20",
  LOAN_DISBURSEMENT: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  LOAN_REPAYMENT: "bg-teal-500/10 text-teal-500 border-teal-500/20",
}

const typeIcons = {
  DEPOSIT: ArrowDownLeft,
  WITHDRAWAL: ArrowUpRight,
  CONTRIBUTION: TrendingUp,
  INTEREST: DollarSign,
  FEE: CreditCard,
  PENALTY: AlertCircle,
  LOAN_DISBURSEMENT: ArrowUpRight,
  LOAN_REPAYMENT: ArrowDownLeft,
}

export function TransactionsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [sortBy, setSortBy] = useState("date")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch transactions using React Query
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery<Transaction[]>({
    queryKey: ["admin-transactions", typeFilter, statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (typeFilter !== "all") params.append("type", typeFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/transactions?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }
      return response.json()
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  })

  const stats = {
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    completedCount: transactions.filter((t) => t.status === "COMPLETED").length,
    pendingCount: transactions.filter((t) => t.status === "PENDING").length,
    totalFees: transactions.reduce((sum, t) => sum + (t.feeAmount || 0), 0),
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = sortConfig.key === "amount" ? a.amount : new Date(a.date).getTime()
    const bValue = sortConfig.key === "amount" ? b.amount : new Date(b.date).getTime()

    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex)

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
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

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
            <p className="text-sm text-destructive">Failed to load transactions</p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Volume</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalVolume)}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">All time transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.completedCount}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.pendingCount}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0 ml-2">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Fees</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">{formatCurrency(stats.totalFees)}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <CardTitle className="text-base sm:text-lg md:text-xl">Transaction History</CardTitle>
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
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 sm:pl-9 text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Select value={typeFilter} onValueChange={handleFilterChange(setTypeFilter)}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="DEPOSIT">Deposit</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                  <SelectItem value="CONTRIBUTION">Contribution</SelectItem>
                  <SelectItem value="LOAN_DISBURSEMENT">Loan Disbursement</SelectItem>
                  <SelectItem value="LOAN_REPAYMENT">Loan Repayment</SelectItem>
                  <SelectItem value="INTEREST">Interest</SelectItem>
                  <SelectItem value="FEE">Fee</SelectItem>
                  <SelectItem value="PENALTY">Penalty</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10 col-span-2 sm:col-span-1">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date & Time</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Reference</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">User</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Type</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-foreground whitespace-nowrap text-xs sm:text-sm"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-1">
                        Amount
                        {sortConfig?.key === "amount" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Group</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Status</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-foreground whitespace-nowrap text-xs sm:text-sm"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortConfig?.key === "date" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => {
                    const TypeIcon = typeIcons[transaction.type as keyof typeof typeIcons]
                    return (
                      <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-xs sm:text-sm whitespace-nowrap">
                          {transaction.reference}
                        </TableCell>
                        <TableCell className="min-w-[180px]">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs sm:text-sm truncate">{transaction.user.name}</p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {transaction.user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <Badge
                            variant="outline"
                            className={`${typeColors[transaction.type as keyof typeof typeColors]} text-[10px] sm:text-xs whitespace-nowrap`}
                          >
                            <TypeIcon className="mr-1 h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                            <span className="truncate">{transaction.type.replace(/_/g, " ")}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold whitespace-nowrap">
                          <div>
                            <span className="text-xs sm:text-sm">{formatCurrency(transaction.amount)}</span>
                            {transaction.feeAmount > 0 && (
                              <p className="text-[10px] sm:text-xs text-muted-foreground">
                                Fee: {formatCurrency(transaction.feeAmount)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          {transaction.group ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-xs sm:text-sm truncate">{transaction.group.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs sm:text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${statusColors[transaction.status as keyof typeof statusColors]} text-[10px] sm:text-xs whitespace-nowrap`}
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            onClick={() => setSelectedTransaction(transaction)}
                          >
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {sortedTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm sm:text-base text-muted-foreground">No transactions found</p>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="hidden sm:inline">Showing</span>
              <span className="font-medium text-foreground">
                {startIndex + 1}-{Math.min(endIndex, sortedTransactions.length)}
              </span>
              <span>of</span>
              <span className="font-medium text-foreground">{sortedTransactions.length}</span>
              <span className="hidden sm:inline">transactions</span>
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[100px] sm:w-[120px] h-8 sm:h-9 text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 hidden sm:flex"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="hidden sm:flex items-center gap-1">
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
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                <div className="flex sm:hidden items-center px-2 text-xs font-medium">
                  Page {currentPage} of {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 hidden sm:flex"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 sm:p-6 pb-3">
            <DialogTitle className="text-base sm:text-lg">Transaction Details</DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <ScrollArea className="max-h-[calc(90vh-80px)] px-4 sm:px-6 pb-4 sm:pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview" className="text-[10px] sm:text-xs md:text-sm">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="text-[10px] sm:text-xs md:text-sm">
                    Payment
                  </TabsTrigger>
                  <TabsTrigger value="blockchain" className="text-[10px] sm:text-xs md:text-sm">
                    Blockchain
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Transaction ID</p>
                      <p className="font-mono text-xs sm:text-sm break-all">{selectedTransaction.reference}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge
                        className={`${statusColors[selectedTransaction.status as keyof typeof statusColors]} text-xs`}
                      >
                        {selectedTransaction.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-base sm:text-lg font-bold">{formatCurrency(selectedTransaction.amount)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="text-base sm:text-lg font-bold">
                        {formatCurrency(selectedTransaction.feeAmount || 0)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <Badge
                        variant="outline"
                        className={`${typeColors[selectedTransaction.type as keyof typeof typeColors]} text-xs`}
                      >
                        {selectedTransaction.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-xs sm:text-sm">{selectedTransaction.description}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                        <p className="text-xs sm:text-sm">{formatDate(selectedTransaction.date)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-sm font-semibold">User Information</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-xs sm:text-sm">{selectedTransaction.user.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-xs sm:text-sm break-all">{selectedTransaction.user.email}</p>
                      </div>
                    </div>
                  </div>

                  {selectedTransaction.group && (
                    <>
                      <Separator />
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-xs sm:text-sm font-semibold">Group Information</h4>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Group Name</p>
                          <p className="text-xs sm:text-sm">{selectedTransaction.group.name}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-xs sm:text-sm font-semibold">Transaction Timeline</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-success flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                          <div className="h-8 sm:h-10 w-px bg-border" />
                        </div>
                        <div className="flex-1 pb-3 sm:pb-4">
                          <p className="text-xs sm:text-sm font-medium">Transaction Initiated</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {formatDate(selectedTransaction.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 sm:gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-success flex items-center justify-center">
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium">
                            Transaction {selectedTransaction.status.toLowerCase()}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {formatDate(selectedTransaction.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-sm font-semibold">Payment Method</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Mobile Money Number</p>
                        <p className="text-xs sm:text-sm font-mono">
                          {selectedTransaction.momoNumber || "Not available"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Transaction Reference</p>
                        <p className="text-xs sm:text-sm font-mono break-all">{selectedTransaction.reference}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-sm font-semibold">Amount Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <span className="text-xs sm:text-sm text-muted-foreground">Transaction Amount</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {formatCurrency(selectedTransaction.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <span className="text-xs sm:text-sm text-muted-foreground">Processing Fee</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {formatCurrency(selectedTransaction.feeAmount || 0)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <span className="text-xs sm:text-sm font-semibold">Total Amount</span>
                        <span className="text-sm sm:text-base font-bold">
                          {formatCurrency(selectedTransaction.amount + (selectedTransaction.feeAmount || 0))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-xs sm:text-sm font-semibold">Receipt</h4>
                    <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10 bg-transparent">
                      <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Download Receipt
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="blockchain" className="space-y-4">
                  {selectedTransaction.wallet ? (
                    <>
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-xs sm:text-sm font-semibold">Blockchain Information</h4>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Wallet Address</p>
                            <p className="text-xs sm:text-sm font-mono break-all bg-muted p-2 rounded">
                              {selectedTransaction.wallet.celoAddress}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Transaction Hash</p>
                            <p className="text-xs sm:text-sm font-mono break-all bg-muted p-2 rounded">
                              0x
                              {Math.random().toString(36).substring(2, 15) +
                                Math.random().toString(36).substring(2, 15)}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Network</p>
                              <Badge variant="outline" className="text-xs">
                                Celo Alfajores
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Confirmations</p>
                              <p className="text-xs sm:text-sm font-semibold">12/12</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Gas Fee</p>
                            <p className="text-xs sm:text-sm">0.00021 CELO (~$0.02)</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10 bg-transparent">
                          <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          View on Explorer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        No blockchain data available for this transaction
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
