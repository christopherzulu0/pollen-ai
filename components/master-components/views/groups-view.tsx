"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreVertical,
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Archive,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

// Group type definition
type Group = {
  id: string
  name: string
  description: string
  logo: string | null
  members: number
  maxMembers: number
  balance: number
  depositGoal: number
  status: string
  privacy: string
  governanceType: string
  contributionAmount: number
  contributionFrequency: string
  interestRate: number
  createdAt: string
  owner: {
    name: string
    avatar: string | null
  }
  stats: {
    totalTransactions: number
    activeLoans: number
    upcomingMeetings: number
    contributionRate: number
    averageBalance: number
  }
  recentTransactions: Array<{
    id: string
    type: string
    amount: number
    user: string
    date: string
  }>
  members_list: Array<{
    id: string
    name: string
    role: string
    balance: number
    status: string
    joinedAt: string
  }>
  loanRequests: Array<{
    id: string
    user: string
    amount: number
    purpose: string
    status: string
    votes: string
  }>
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

// Mock data removed - now fetching from API

export function GroupsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [privacyFilter, setPrivacyFilter] = useState("all")
  const [governanceFilter, setGovernanceFilter] = useState("all")
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Fetch groups using React Query
  const {
    data: groups = [],
    isLoading,
    error,
  } = useQuery<Group[]>({
    queryKey: ["admin-groups", statusFilter, privacyFilter, governanceFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (privacyFilter !== "all") params.append("privacy", privacyFilter)
      if (governanceFilter !== "all") params.append("governance", governanceFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/groups?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch groups")
      }
      return response.json()
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  })

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePrivacyFilterChange = (value: string) => {
    setPrivacyFilter(value)
    setCurrentPage(1)
  }

  const handleGovernanceFilterChange = (value: string) => {
    setGovernanceFilter(value)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const goToPage = (page: number) => setCurrentPage(page)

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push(-1) // ellipsis
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push(-1)
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push(-1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push(-1)
        pages.push(totalPages)
      }
    }
    return pages
  }

  const totalGroups = groups.length
  const activeGroups = groups.filter((g) => g.status === "ACTIVE").length
  const totalMembers = groups.reduce((sum, g) => sum + g.members, 0)
  const totalBalance = groups.reduce((sum, g) => sum + g.balance, 0)

  const handleViewDetails = (group: Group) => {
    setSelectedGroup(group)
    setDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success text-success-foreground"
      case "INACTIVE":
        return "bg-muted text-muted-foreground"
      case "COMPLETED":
        return "bg-info text-info-foreground"
      case "ARCHIVED":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "CONTRIBUTION":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "WITHDRAWAL":
        return <DollarSign className="h-4 w-4 text-warning" />
      case "LOAN_DISBURSEMENT":
        return <AlertCircle className="h-4 w-4 text-info" />
      case "INTEREST":
        return <TrendingUp className="h-4 w-4 text-primary" />
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getLoanStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-success text-success-foreground"
      case "PENDING":
        return "bg-warning text-warning-foreground"
      case "DISBURSED":
        return "bg-info text-info-foreground"
      case "REJECTED":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Card Skeleton */}
        <Card className="bg-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters Skeleton */}
            <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-4">
              <Skeleton className="h-10 flex-1 min-w-[200px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border border-border overflow-x-auto">
              <div className="border-b border-border">
                <div className="grid grid-cols-8 gap-4 p-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-8 gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-16" />
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
            <p className="text-sm text-destructive">Failed to load groups</p>
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Groups</p>
                <p className="text-2xl font-bold">{totalGroups}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Groups</p>
                <p className="text-2xl font-bold">{activeGroups}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">{formatCurrencyCompact(totalBalance)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Group Management</CardTitle>
            <Button size="sm" className="w-full sm:w-auto" disabled>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={privacyFilter} onValueChange={handlePrivacyFilterChange}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Privacy</SelectItem>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={governanceFilter} onValueChange={handleGovernanceFilterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Governance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Governance</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MULTI_ADMIN">Multi-Admin</SelectItem>
                <SelectItem value="ONE_VOTE_PER_PERSON">One Vote Per Person</SelectItem>
                <SelectItem value="ONE_VOTE_DEPOSIT">One Vote Per Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Group</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Balance / Goal</TableHead>
                  <TableHead>Privacy</TableHead>
                  <TableHead>Governance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contribution Rate</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedGroups.map((group) => (
                  <TableRow key={group.id} className="cursor-pointer" onClick={() => handleViewDetails(group)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={group.logo || "/placeholder.svg"} alt={group.name} />
                          <AvatarFallback>{group.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-muted-foreground">{group.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {group.members}/{group.maxMembers}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatCurrency(group.balance)}</div>
                        <div className="text-sm text-muted-foreground">Goal: {formatCurrency(group.depositGoal)}</div>
                        <Progress value={(group.balance / group.depositGoal) * 100} className="mt-1 h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{group.privacy.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{group.governanceType.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(group.status)}>{group.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={group.stats.contributionRate} className="h-2 w-16" />
                        <span className="text-sm text-muted-foreground">{group.stats.contributionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(group)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                          <DropdownMenuItem>Send Notification</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Archive className="mr-2 h-4 w-4" />
                            Archive Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGroups.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Showing</span>
                <span className="font-medium text-foreground">
                  {startIndex + 1}-{Math.min(endIndex, filteredGroups.length)}
                </span>
                <span>of</span>
                <span className="font-medium text-foreground">{filteredGroups.length}</span>
                <span className="hidden sm:inline">groups</span>
              </div>

              <div className="flex items-center gap-2">
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[100px] h-9">
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
                    className="h-9 w-9 hidden sm:flex bg-transparent"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="hidden md:flex items-center gap-1">
                    {getPageNumbers().map((pageNum, index) =>
                      pageNum === -1 ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ),
                    )}
                  </div>

                  <span className="md:hidden px-3 text-sm">
                    {currentPage} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 hidden sm:flex bg-transparent"
                    onClick={goToLastPage}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedGroup && (
            <>
              <DialogHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedGroup.logo || "/placeholder.svg"} alt={selectedGroup.name} />
                    <AvatarFallback>{selectedGroup.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <DialogTitle className="text-xl sm:text-2xl">{selectedGroup.name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                  </div>
                  <Badge className={getStatusColor(selectedGroup.status)}>{selectedGroup.status}</Badge>
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-5 h-auto">
                  <TabsTrigger value="overview" className="text-xs sm:text-sm">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="members" className="text-xs sm:text-sm">
                    Members
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="text-xs sm:text-sm">
                    Transactions
                  </TabsTrigger>
                  <TabsTrigger value="loans" className="text-xs sm:text-sm">
                    Loans
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs sm:text-sm">
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Transactions</p>
                            <p className="text-xl font-bold">{selectedGroup.stats.totalTransactions}</p>
                          </div>
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Active Loans</p>
                            <p className="text-xl font-bold">{selectedGroup.stats.activeLoans}</p>
                          </div>
                          <AlertCircle className="h-6 w-6 text-warning" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Upcoming Meetings</p>
                            <p className="text-xl font-bold">{selectedGroup.stats.upcomingMeetings}</p>
                          </div>
                          <Calendar className="h-6 w-6 text-info" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Financial Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Current Balance</span>
                        <span className="text-base sm:text-lg font-bold">
                          {formatCurrency(selectedGroup.balance)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Deposit Goal</span>
                        <span className="text-base sm:text-lg font-medium">
                          {formatCurrency(selectedGroup.depositGoal)}
                        </span>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progress</span>
                          <span className="text-sm font-medium">
                            {((selectedGroup.balance / selectedGroup.depositGoal) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={(selectedGroup.balance / selectedGroup.depositGoal) * 100} className="h-2" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Balance/Member</p>
                          <p className="text-base sm:text-lg font-medium">
                            {formatCurrency(Math.round(selectedGroup.stats.averageBalance))}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="text-base sm:text-lg font-medium">{selectedGroup.interestRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedGroup.recentTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 bg-background rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {getTransactionIcon(transaction.type)}
                              <div>
                                <p className="text-sm font-medium">{transaction.user}</p>
                                <p className="text-xs text-muted-foreground">{transaction.type.replace(/_/g, " ")}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="space-y-4">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Group Members ({selectedGroup.members})</CardTitle>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Member
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedGroup.members_list.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 bg-background rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">Joined {member.joinedAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">{formatCurrency(member.balance)}</p>
                                <p className="text-xs text-muted-foreground">Balance</p>
                              </div>
                              <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>{member.role}</Badge>
                              <Badge className={getStatusColor(member.status)}>{member.status}</Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                                  <DropdownMenuItem>View Contributions</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedGroup.recentTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-4 bg-background rounded-lg border border-border"
                          >
                            <div className="flex items-center gap-4">
                              {getTransactionIcon(transaction.type)}
                              <div>
                                <p className="text-sm font-medium">{transaction.type.replace(/_/g, " ")}</p>
                                <p className="text-xs text-muted-foreground">By {transaction.user}</p>
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-bold">{formatCurrency(transaction.amount)}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="loans" className="space-y-4">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">
                        Loan Requests ({selectedGroup.loanRequests.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedGroup.loanRequests.map((loan) => (
                          <div key={loan.id} className="p-4 bg-background rounded-lg border border-border">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                              <div>
                                <p className="text-sm font-medium">{loan.user}</p>
                                <p className="text-xs text-muted-foreground">{loan.purpose}</p>
                              </div>
                              <Badge className={getLoanStatusColor(loan.status)}>{loan.status}</Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <p className="text-lg font-bold">{formatCurrency(loan.amount)}</p>
                                <p className="text-xs text-muted-foreground">Loan Amount</p>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-sm font-medium">{loan.votes}</p>
                                <p className="text-xs text-muted-foreground">Votes</p>
                              </div>
                              <div className="flex gap-2">
                                {loan.status === "PENDING" && (
                                  <>
                                    <Button size="sm" variant="default" className="flex-1 sm:flex-none">
                                      Approve
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex-1 sm:flex-none">
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {loan.status === "APPROVED" && (
                                  <Button size="sm" variant="default" className="flex-1 sm:flex-none">
                                    Disburse
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Group Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Privacy</p>
                          <Badge variant="secondary">{selectedGroup.privacy.replace(/_/g, " ")}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Governance Type</p>
                          <Badge variant="outline">{selectedGroup.governanceType.replace(/_/g, " ")}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Contribution Amount</p>
                          <p className="text-sm font-medium">{formatCurrency(selectedGroup.contributionAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Contribution Frequency</p>
                          <p className="text-sm font-medium">{selectedGroup.contributionFrequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                          <p className="text-sm font-medium">{selectedGroup.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Created Date</p>
                          <p className="text-sm font-medium">{selectedGroup.createdAt}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Group Owner</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={selectedGroup.owner.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{selectedGroup.owner.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">{selectedGroup.owner.name}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Max Members</p>
                          <p className="text-sm font-medium">{selectedGroup.maxMembers}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button variant="default">Edit Settings</Button>
                        <Button variant="outline">Export Data</Button>
                        <Button variant="destructive">Archive Group</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
