"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  ArrowUpDown,
  Download,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CreditCard,
  Percent,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

// Loan type definition
type Loan = {
  id: string
  borrower: {
    name: string
    email: string
    avatar: string | null
    phone: string
    nationalId: string
  }
  amount: number
  purpose: string
  status: string
  loanType: "GROUP" | "INDIVIDUAL"
  groupName: string | null
  votes: {
    approve: number
    reject: number
    pending: number
    total: number
  }
  date: string
  repaymentDate: string | null
  installments: number
  interestRate: number
  totalRepayment: number
  documents: string[]
  creditScore: number
  riskLevel: string
  employmentStatus: string
  monthlyIncome: number
  paidInstallments?: number
  paidAmount?: number
  nextPaymentDate?: string
  approvedDate?: string
  disbursedDate?: string
  rejectedDate?: string
  rejectionReason?: string
}

// Currency formatter for ZMW
const formatCurrency = (amount: number) => {
  return `ZMW ${amount.toLocaleString()}`
}

const formatCurrencyCompact = (amount: number) => {
  if (amount >= 1000000) {
    return `ZMW ${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `ZMW ${(amount / 1000).toFixed(1)}K`
  }
  return `ZMW ${amount.toLocaleString()}`
}

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  APPROVED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
  DISBURSED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  REPAYING: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  REPAID: "bg-green-500/10 text-green-500 border-green-500/20",
  DEFAULTED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

const riskColors = {
  "Very Low": "text-emerald-400",
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  "Very High": "text-red-400",
}

export function LoansView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loanTypeFilter, setLoanTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "risk">("date")
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [pendingAction, setPendingAction] = useState<"APPROVE" | "REJECT" | null>(null)

  const queryClient = useQueryClient()

  // Fetch loans using React Query
  const {
    data: loans = [],
    isLoading,
    error,
  } = useQuery<Loan[]>({
    queryKey: ["admin-loans", statusFilter, loanTypeFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (loanTypeFilter !== "all") params.append("loanType", loanTypeFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/loans?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch loans")
      }
      return response.json()
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  })

  // Mutation for approving/rejecting loans
  const approveRejectMutation = useMutation({
    mutationFn: async ({ loanId, action }: { loanId: string; action: "APPROVE" | "REJECT" }) => {
      setPendingAction(action)
      const response = await fetch(`/api/admin/loans/${loanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, note: actionNote }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update loan")
      }
      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] })
      setSelectedLoan(null)
      setActionNote("")
      setPendingAction(null)
      toast.success(
        variables.action === "APPROVE" ? "Loan approved successfully" : "Loan rejected successfully"
      )
    },
    onError: (error) => {
      setPendingAction(null)
      toast.error(error instanceof Error ? error.message : "Failed to update loan")
    },
  })

  const handleApprove = (loanId: string) => {
    approveRejectMutation.mutate({ loanId, action: "APPROVE" })
  }

  const handleReject = (loanId: string) => {
    approveRejectMutation.mutate({ loanId, action: "REJECT" })
  }

  const totalLoans = loans.length
  const pendingLoans = loans.filter((l) => l.status === "PENDING").length
  const activeLoans = loans.filter((l) => l.status === "APPROVED").length
  const totalDisbursed = loans.reduce(
    (sum, l) => (l.status !== "PENDING" && l.status !== "REJECTED" ? sum + l.amount : sum),
    0,
  )
  const totalRepaying = loans
    .filter((l) => l.status === "REPAYING")
    .reduce((sum, l) => sum + (l.paidAmount || 0), 0)
  const defaultedLoans = loans.filter((l) => l.status === "DEFAULTED").length
  const defaultRate = totalLoans > 0 ? ((defaultedLoans / totalLoans) * 100).toFixed(1) : "0.0"
  const approvalRate =
    totalLoans > 0
      ? ((loans.filter((l) => l.status !== "PENDING" && l.status !== "REJECTED").length / totalLoans) * 100).toFixed(1)
      : "0.0"
  const avgLoanAmount = totalLoans > 0 ? (loans.reduce((sum, l) => sum + l.amount, 0) / totalLoans).toFixed(0) : "0"

  const filteredLoans = loans
    .filter((loan) => {
      const matchesSearch =
        loan.borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || loan.status === statusFilter
      const matchesType = loanTypeFilter === "all" || loan.loanType === loanTypeFilter
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount
      if (sortBy === "risk") {
        const riskOrder = { "Very High": 5, High: 4, Medium: 3, Low: 2, "Very Low": 1 }
        return riskOrder[b.riskLevel as keyof typeof riskOrder] - riskOrder[a.riskLevel as keyof typeof riskOrder]
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLoans = filteredLoans.slice(startIndex, endIndex)

  const handleFilterChange = (setter: (value: any) => void) => (value: any) => {
    setter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (showEllipsisStart) {
        pages.push(1)
        pages.push(-1) // ellipsis
      } else {
        pages.push(1, 2, 3)
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage)
      }

      if (showEllipsisEnd) {
        pages.push(-2) // ellipsis
        pages.push(totalPages)
      } else {
        for (let i = Math.max(1, totalPages - 2); i <= totalPages; i++) {
          if (!pages.includes(i)) {
            pages.push(i)
          }
        }
      }
    }

    return pages
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Card Skeleton */}
        <Card className="bg-card border-border">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            {/* Filters Skeleton */}
            <div className="mb-4 flex flex-wrap gap-3">
              <Skeleton className="h-10 flex-1 min-w-[200px]" />
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[160px]" />
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border border-border">
              <div className="border-b border-border">
                <div className="grid grid-cols-9 gap-4 p-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-9 gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
            <p className="text-sm text-destructive">Failed to load loans</p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting decision</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">Approved loans</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Disbursed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyCompact(totalDisbursed)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total amount</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Default Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Risk indicator</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Approval Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvalRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Success rate</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyCompact(totalRepaying)}</div>
            <p className="text-xs text-muted-foreground mt-1">Repayments</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Avg Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyCompact(Number(avgLoanAmount))}</div>
            <p className="text-xs text-muted-foreground mt-1">Per loan</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Loan Management</CardTitle>
          <CardDescription>Review and manage all loan requests across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by borrower or purpose..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 bg-background border-border"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleFilterChange(setStatusFilter)}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="DISBURSED">Disbursed</SelectItem>
                <SelectItem value="REPAYING">Repaying</SelectItem>
                <SelectItem value="REPAID">Repaid</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="DEFAULTED">Defaulted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={loanTypeFilter} onValueChange={handleFilterChange(setLoanTypeFilter)}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Loan Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="GROUP">Group Loans</SelectItem>
                <SelectItem value="INDIVIDUAL">Individual Loans</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[160px] bg-background border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
                <SelectItem value="risk">Sort by Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Borrower</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      Date <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No loans found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLoans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      className="cursor-pointer hover:bg-accent/5 border-border"
                      onClick={() => setSelectedLoan(loan)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={loan.borrower.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {loan.borrower.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{loan.borrower.name}</div>
                            <div className="text-xs text-muted-foreground">{loan.borrower.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(loan.amount)}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{loan.purpose}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {loan.loanType === "GROUP" ? <Building2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {loan.loanType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`font-semibold ${riskColors[loan.riskLevel as keyof typeof riskColors]}`}>
                            {loan.riskLevel}
                          </div>
                          <div className="text-xs text-muted-foreground">({loan.creditScore})</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {loan.loanType === "GROUP" ? (
                          <div className="flex gap-2 text-sm">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" /> {loan.votes.approve}
                            </span>
                            <span className="text-red-400 flex items-center gap-1">
                              <ThumbsDown className="h-3 w-3" /> {loan.votes.reject}
                            </span>
                            {loan.votes.pending > 0 && (
                              <span className="text-muted-foreground">({loan.votes.pending} pending)</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[loan.status as keyof typeof statusColors]}>{loan.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{loan.date}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedLoan(loan)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveTab("documents")
                                setSelectedLoan(loan)
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Documents
                            </DropdownMenuItem>
                            {loan.loanType === "GROUP" && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveTab("voting")
                                  setSelectedLoan(loan)
                                }}
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                View Votes
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
                            </DropdownMenuItem>
                            {loan.status === "PENDING" && loan.loanType === "INDIVIDUAL" && (
                              <>
                                <Separator className="my-1" />
                                <DropdownMenuItem
                                  className="text-emerald-400"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleApprove(loan.id)
                                  }}
                                  disabled={approveRejectMutation.isPending}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Loan
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-400"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleReject(loan.id)
                                  }}
                                  disabled={approveRejectMutation.isPending}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject Loan
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLoans.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Showing</span>
                <span className="font-medium text-foreground">
                  {startIndex + 1}-{Math.min(endIndex, filteredLoans.length)}
                </span>
                <span>of</span>
                <span className="font-medium text-foreground">{filteredLoans.length}</span>
                <span className="hidden sm:inline">loans</span>
              </div>

              <div className="flex items-center gap-2">
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[100px] h-9 bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 / page</SelectItem>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="20">20 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                    <SelectItem value="100">100 / page</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="hidden md:flex items-center gap-1">
                    {getPageNumbers().map((page, index) =>
                      page === -1 || page === -2 ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>

                  <div className="md:hidden px-3 py-2 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedLoan}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLoan(null)
            setActiveTab("overview")
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Loan Request Details</span>
              <Badge className={statusColors[selectedLoan?.status as keyof typeof statusColors]}>
                {selectedLoan?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Request ID: {selectedLoan?.id} • Submitted on {selectedLoan?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedLoan && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="borrower">Borrower</TabsTrigger>
                <TabsTrigger value="repayment">Repayment</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="voting">Voting</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Loan Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">Loan Amount</label>
                      <div className="text-2xl font-bold">{formatCurrency(selectedLoan.amount)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Total Repayment</label>
                      <div className="text-2xl font-bold">{formatCurrency(selectedLoan.totalRepayment)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Interest Rate</label>
                      <div className="text-lg font-semibold">{selectedLoan.interestRate}% per annum</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Installments</label>
                      <div className="text-lg font-semibold">{selectedLoan.installments} monthly payments</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Loan Type</label>
                      <Badge variant="outline" className="mt-1 gap-1">
                        {selectedLoan.loanType === "GROUP" ? (
                          <Building2 className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {selectedLoan.loanType}
                      </Badge>
                    </div>
                    {selectedLoan.groupName && (
                      <div>
                        <label className="text-sm text-muted-foreground">Group Name</label>
                        <div className="text-lg font-semibold">{selectedLoan.groupName}</div>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Purpose</label>
                      <p className="text-foreground mt-1">{selectedLoan.purpose}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Credit Score</span>
                      <span className="text-2xl font-bold">{selectedLoan.creditScore}/100</span>
                    </div>
                    <Progress value={selectedLoan.creditScore} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <span
                        className={`text-lg font-semibold ${riskColors[selectedLoan.riskLevel as keyof typeof riskColors]}`}
                      >
                        {selectedLoan.riskLevel}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {selectedLoan.status === "REPAYING" && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Repayment Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">
                            {selectedLoan.paidInstallments}/{selectedLoan.installments}
                          </div>
                          <div className="text-xs text-muted-foreground">Installments Paid</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{formatCurrency(selectedLoan.paidAmount || 0)}</div>
                          <div className="text-xs text-muted-foreground">Amount Paid</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {formatCurrency(selectedLoan.totalRepayment - (selectedLoan.paidAmount || 0))}
                          </div>
                          <div className="text-xs text-muted-foreground">Remaining</div>
                        </div>
                      </div>
                      <Progress
                        value={(selectedLoan.paidAmount! / selectedLoan.totalRepayment) * 100}
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next Payment: {selectedLoan.nextPaymentDate}</span>
                        <span className="font-semibold">
                          {formatCurrency(Math.round(selectedLoan.totalRepayment / selectedLoan.installments))}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedLoan.status === "REJECTED" && (
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-base text-red-400">Rejection Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Rejected on: {selectedLoan.rejectedDate}</p>
                      <p className="text-foreground mt-2">{selectedLoan.rejectionReason}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Borrower Tab */}
              <TabsContent value="borrower" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Borrower Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedLoan.borrower.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedLoan.borrower.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{selectedLoan.borrower.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedLoan.borrower.email}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Phone Number</label>
                        <div className="font-medium">{selectedLoan.borrower.phone}</div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">National ID</label>
                        <div className="font-medium">{selectedLoan.borrower.nationalId}</div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Employment Status</label>
                        <div className="font-medium">{selectedLoan.employmentStatus}</div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Monthly Income</label>
                        <div className="font-medium">{formatCurrency(selectedLoan.monthlyIncome)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Financial Capacity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Income</span>
                      <span className="font-semibold">{formatCurrency(selectedLoan.monthlyIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Loan Payment</span>
                      <span className="font-semibold">
                        {formatCurrency(Math.round(selectedLoan.totalRepayment / selectedLoan.installments))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Payment to Income Ratio</span>
                      <span className="font-semibold">
                        {(
                          (selectedLoan.totalRepayment / selectedLoan.installments / selectedLoan.monthlyIncome) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (selectedLoan.totalRepayment / selectedLoan.installments / selectedLoan.monthlyIncome) * 100
                      }
                      className="h-2"
                    />
                    {(selectedLoan.totalRepayment / selectedLoan.installments / selectedLoan.monthlyIncome) * 100 <
                    30 ? (
                      <p className="text-xs text-emerald-400">Excellent - Payment is well within income capacity</p>
                    ) : (selectedLoan.totalRepayment / selectedLoan.installments / selectedLoan.monthlyIncome) * 100 <
                      50 ? (
                      <p className="text-xs text-yellow-400">Moderate - Payment is manageable</p>
                    ) : (
                      <p className="text-xs text-red-400">High - Payment may strain borrower</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Repayment Tab */}
              <TabsContent value="repayment" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Repayment Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from({ length: selectedLoan.installments }).map((_, i) => {
                        const monthlyPayment = selectedLoan.totalRepayment / selectedLoan.installments
                        const isPaid = selectedLoan.paidInstallments ? i < selectedLoan.paidInstallments : false
                        const isNext = selectedLoan.paidInstallments === i

                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-lg border ${isPaid ? "bg-emerald-500/10 border-emerald-500/20" : isNext ? "bg-blue-500/10 border-blue-500/20" : "bg-card border-border"}`}
                          >
                            <div className="flex items-center gap-3">
                              {isPaid ? (
                                <CheckCircle className="h-5 w-5 text-emerald-400" />
                              ) : isNext ? (
                                <Clock className="h-5 w-5 text-blue-400" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-border" />
                              )}
                              <div>
                                <div className="font-medium">Installment {i + 1}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(
                                    new Date(selectedLoan.disbursedDate || selectedLoan.date).setMonth(
                                      new Date(selectedLoan.disbursedDate || selectedLoan.date).getMonth() + i + 1,
                                    ),
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(Math.round(monthlyPayment))}</div>
                              {isPaid && <div className="text-xs text-emerald-400">Paid</div>}
                              {isNext && <div className="text-xs text-blue-400">Due Next</div>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Uploaded Documents</CardTitle>
                    <CardDescription>All documents submitted with this loan request</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {selectedLoan.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{doc}</div>
                              <div className="text-xs text-muted-foreground">PDF • 2.4 MB</div>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Voting Tab */}
              <TabsContent value="voting" className="space-y-4">
                {selectedLoan.loanType === "GROUP" ? (
                  <>
                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-base">Voting Results</CardTitle>
                        <CardDescription>Group member voting on this loan request</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold text-emerald-400">{selectedLoan.votes.approve}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                              <ThumbsUp className="h-4 w-4" /> Approve
                            </div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-red-400">{selectedLoan.votes.reject}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                              <ThumbsDown className="h-4 w-4" /> Reject
                            </div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-muted-foreground">{selectedLoan.votes.pending}</div>
                            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                              <Clock className="h-4 w-4" /> Pending
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Approval Rate</span>
                            <span className="font-semibold">
                              {(
                                (selectedLoan.votes.approve /
                                  (selectedLoan.votes.approve + selectedLoan.votes.reject)) *
                                100
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (selectedLoan.votes.approve / (selectedLoan.votes.approve + selectedLoan.votes.reject)) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-base">Individual Votes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Array.from({ length: selectedLoan.votes.total }).map((_, i) => {
                            const isApprove = i < selectedLoan.votes.approve
                            const isReject =
                              i >= selectedLoan.votes.approve &&
                              i < selectedLoan.votes.approve + selectedLoan.votes.reject
                            const isPending = i >= selectedLoan.votes.approve + selectedLoan.votes.reject

                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded border border-border"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">M{i + 1}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">Member {i + 1}</span>
                                </div>
                                {isPending ? (
                                  <Badge variant="outline" className="text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" /> Pending
                                  </Badge>
                                ) : isApprove ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                    <ThumbsUp className="h-3 w-3 mr-1" /> Approve
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                                    <ThumbsDown className="h-3 w-3 mr-1" /> Reject
                                  </Badge>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="bg-card border-border">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Voting is not applicable for individual loans</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}

          {selectedLoan?.status === "PENDING" && selectedLoan?.loanType === "INDIVIDUAL" && (
            <Card className="bg-card border-border mt-4">
              <CardHeader>
                <CardTitle className="text-base">Admin Action</CardTitle>
                <CardDescription>Approve or reject this individual loan request</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Add Note (Optional)</label>
                  <Textarea
                    placeholder="Add a note about your decision..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(selectedLoan.id)}
                    disabled={pendingAction !== null}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {pendingAction === "APPROVE" ? "Processing..." : "Approve Loan"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(selectedLoan.id)}
                    disabled={pendingAction !== null}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {pendingAction === "REJECT" ? "Processing..." : "Reject Loan"}
                  </Button>
                </div>
                {approveRejectMutation.isError && (
                  <p className="text-sm text-destructive">
                    {approveRejectMutation.error instanceof Error
                      ? approveRejectMutation.error.message
                      : "An error occurred"}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
