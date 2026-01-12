"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

const mockLoans = [
  {
    id: "1",
    borrower: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/thoughtful-man-in-library.png",
      phone: "+260 977 123 456",
      nationalId: "123456/78/9",
    },
    amount: 5000,
    purpose: "Business expansion - Opening new retail location in Lusaka CBD",
    status: "PENDING",
    loanType: "GROUP",
    groupName: "Savings Champions",
    votes: { approve: 5, reject: 2, pending: 8, total: 15 },
    date: "2024-03-15",
    repaymentDate: "2024-09-15",
    installments: 6,
    interestRate: 5,
    totalRepayment: 5250,
    documents: ["NRC Front", "NRC Back", "Business Plan", "Bank Statement"],
    creditScore: 78,
    riskLevel: "Low",
    employmentStatus: "Self-employed",
    monthlyIncome: 8000,
  },
  {
    id: "2",
    borrower: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/jane-portrait.png",
      phone: "+260 966 234 567",
      nationalId: "234567/89/0",
    },
    amount: 3000,
    purpose: "Education - University tuition fees for final year",
    status: "APPROVED",
    loanType: "GROUP",
    groupName: "Education Fund",
    votes: { approve: 8, reject: 1, pending: 0, total: 9 },
    date: "2024-03-10",
    repaymentDate: "2024-12-10",
    installments: 9,
    interestRate: 3,
    totalRepayment: 3090,
    documents: ["NRC Front", "NRC Back", "Admission Letter", "Pay Slip"],
    creditScore: 85,
    riskLevel: "Very Low",
    employmentStatus: "Employed",
    monthlyIncome: 5500,
    approvedDate: "2024-03-12",
    disbursedDate: "2024-03-14",
  },
  {
    id: "3",
    borrower: {
      name: "Bob Johnson",
      email: "bob@example.com",
      avatar: "/bob-portrait.png",
      phone: "+260 955 345 678",
      nationalId: "345678/90/1",
    },
    amount: 10000,
    purpose: "Solar equipment - 5kW solar panel installation for home",
    status: "REPAYING",
    loanType: "INDIVIDUAL",
    groupName: null,
    votes: { approve: 10, reject: 0, pending: 0, total: 10 },
    date: "2024-02-20",
    repaymentDate: "2025-02-20",
    installments: 12,
    interestRate: 7,
    totalRepayment: 10700,
    documents: ["NRC Front", "NRC Back", "Land Ownership", "Utility Bill", "Vendor Quotation"],
    creditScore: 92,
    riskLevel: "Very Low",
    employmentStatus: "Employed",
    monthlyIncome: 12000,
    approvedDate: "2024-02-22",
    disbursedDate: "2024-02-25",
    paidInstallments: 3,
    nextPaymentDate: "2024-06-25",
    paidAmount: 2675,
  },
  {
    id: "4",
    borrower: {
      name: "Alice Williams",
      email: "alice@example.com",
      avatar: "/thoughtful-man-in-library.png",
      phone: "+260 977 456 789",
      nationalId: "456789/01/2",
    },
    amount: 7500,
    purpose: "Medical emergency - Surgery and hospital bills",
    status: "REJECTED",
    loanType: "GROUP",
    groupName: "Community Support",
    votes: { approve: 3, reject: 9, pending: 0, total: 12 },
    date: "2024-03-08",
    repaymentDate: "2024-09-08",
    installments: 6,
    interestRate: 4,
    totalRepayment: 7800,
    documents: ["NRC Front", "Medical Report"],
    creditScore: 45,
    riskLevel: "High",
    employmentStatus: "Unemployed",
    monthlyIncome: 0,
    rejectedDate: "2024-03-10",
    rejectionReason: "Insufficient voting support and no stable income source",
  },
  {
    id: "5",
    borrower: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "/bob-portrait.png",
      phone: "+260 966 567 890",
      nationalId: "567890/12/3",
    },
    amount: 15000,
    purpose: "Agricultural investment - Farm equipment and seeds",
    status: "DISBURSED",
    loanType: "INDIVIDUAL",
    groupName: null,
    votes: { approve: 1, reject: 0, pending: 0, total: 1 },
    date: "2024-03-05",
    repaymentDate: "2025-03-05",
    installments: 12,
    interestRate: 6,
    totalRepayment: 15900,
    documents: ["NRC Front", "NRC Back", "Farm Documentation", "Business Plan"],
    creditScore: 88,
    riskLevel: "Low",
    employmentStatus: "Self-employed",
    monthlyIncome: 10000,
    approvedDate: "2024-03-06",
    disbursedDate: "2024-03-08",
    paidInstallments: 0,
    nextPaymentDate: "2024-04-08",
    paidAmount: 0,
  },
]

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
  const [selectedLoan, setSelectedLoan] = useState<(typeof mockLoans)[0] | null>(null)
  const [actionNote, setActionNote] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalLoans = mockLoans.length
  const pendingLoans = mockLoans.filter((l) => l.status === "PENDING").length
  const activeLoans = mockLoans.filter((l) => l.status === "REPAYING" || l.status === "DISBURSED").length
  const totalDisbursed = mockLoans.reduce(
    (sum, l) => (l.status !== "PENDING" && l.status !== "REJECTED" ? sum + l.amount : sum),
    0,
  )
  const totalRepaying = mockLoans
    .filter((l) => l.status === "REPAYING")
    .reduce((sum, l) => sum + (l.paidAmount || 0), 0)
  const defaultedLoans = mockLoans.filter((l) => l.status === "DEFAULTED").length
  const defaultRate = ((defaultedLoans / totalLoans) * 100).toFixed(1)
  const approvalRate = (
    (mockLoans.filter((l) => l.status !== "PENDING" && l.status !== "REJECTED").length / totalLoans) *
    100
  ).toFixed(1)
  const avgLoanAmount = (mockLoans.reduce((sum, l) => sum + l.amount, 0) / totalLoans).toFixed(0)

  const filteredLoans = mockLoans
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
            <p className="text-xs text-muted-foreground mt-1">Currently repaying</p>
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
            <div className="text-2xl font-bold">${(totalDisbursed / 1000).toFixed(0)}K</div>
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
            <div className="text-2xl font-bold">${(totalRepaying / 1000).toFixed(1)}K</div>
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
            <div className="text-2xl font-bold">${(Number(avgLoanAmount) / 1000).toFixed(1)}K</div>
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
                      <TableCell className="font-semibold">${loan.amount.toLocaleString()}</TableCell>
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
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Documents
                            </DropdownMenuItem>
                            {loan.loanType === "GROUP" && (
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                View Votes
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Report
                            </DropdownMenuItem>
                            {loan.status === "PENDING" && (
                              <>
                                <Separator className="my-1" />
                                <DropdownMenuItem className="text-emerald-400" onClick={(e) => e.stopPropagation()}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Loan
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400" onClick={(e) => e.stopPropagation()}>
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

      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
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
            <Tabs defaultValue="overview" className="w-full">
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
                      <div className="text-2xl font-bold">${selectedLoan.amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Total Repayment</label>
                      <div className="text-2xl font-bold">${selectedLoan.totalRepayment.toLocaleString()}</div>
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
                          <div className="text-2xl font-bold">${selectedLoan.paidAmount?.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Amount Paid</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            ${(selectedLoan.totalRepayment - (selectedLoan.paidAmount || 0)).toLocaleString()}
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
                          ${(selectedLoan.totalRepayment / selectedLoan.installments).toFixed(2)}
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
                        <div className="font-medium">${selectedLoan.monthlyIncome.toLocaleString()}</div>
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
                      <span className="font-semibold">${selectedLoan.monthlyIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Monthly Loan Payment</span>
                      <span className="font-semibold">
                        ${(selectedLoan.totalRepayment / selectedLoan.installments).toFixed(2)}
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
                              <div className="font-semibold">${monthlyPayment.toFixed(2)}</div>
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

          {selectedLoan?.status === "PENDING" && (
            <Card className="bg-card border-border mt-4">
              <CardHeader>
                <CardTitle className="text-base">Admin Action</CardTitle>
                <CardDescription>Approve or reject this loan request</CardDescription>
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
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Loan
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Loan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
