"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockGroups = [
  {
    id: "1",
    name: "Savings Circle A",
    description: "Monthly savings group for community members",
    logo: "/savings-group.jpg",
    members: 12,
    maxMembers: 15,
    balance: 12500,
    depositGoal: 50000,
    status: "ACTIVE",
    privacy: "PRIVATE",
    governanceType: "MULTI_ADMIN",
    contributionAmount: 100,
    contributionFrequency: "MONTHLY",
    interestRate: 2.5,
    createdAt: "2024-01-15",
    owner: { name: "John Doe", avatar: "/thoughtful-man-in-library.png" },
    stats: {
      totalTransactions: 144,
      activeLoans: 2,
      upcomingMeetings: 1,
      contributionRate: 95,
      averageBalance: 1041.67,
    },
    recentTransactions: [
      { id: "t1", type: "CONTRIBUTION", amount: 100, user: "Alice Smith", date: "2024-03-15" },
      { id: "t2", type: "WITHDRAWAL", amount: 500, user: "Bob Johnson", date: "2024-03-10" },
      { id: "t3", type: "CONTRIBUTION", amount: 100, user: "Carol White", date: "2024-03-08" },
    ],
    members_list: [
      { id: "m1", name: "Alice Smith", role: "ADMIN", balance: 1200, status: "ACTIVE", joinedAt: "2024-01-15" },
      { id: "m2", name: "Bob Johnson", role: "MEMBER", balance: 800, status: "ACTIVE", joinedAt: "2024-01-20" },
      { id: "m3", name: "Carol White", role: "MEMBER", balance: 1500, status: "ACTIVE", joinedAt: "2024-02-01" },
    ],
    loanRequests: [
      { id: "l1", user: "Bob Johnson", amount: 2000, purpose: "Business expansion", status: "APPROVED", votes: "8/12" },
      { id: "l2", user: "David Brown", amount: 1500, purpose: "Emergency medical", status: "PENDING", votes: "5/12" },
    ],
  },
  {
    id: "2",
    name: "Investment Group",
    description: "Long-term investment and wealth building",
    logo: "/investment-group.jpg",
    members: 8,
    maxMembers: 10,
    balance: 25000,
    depositGoal: 100000,
    status: "ACTIVE",
    privacy: "INVITE_ONLY",
    governanceType: "ONE_VOTE_PER_PERSON",
    contributionAmount: 500,
    contributionFrequency: "MONTHLY",
    interestRate: 5.0,
    createdAt: "2024-02-01",
    owner: { name: "Jane Smith", avatar: "/jane-portrait.png" },
    stats: {
      totalTransactions: 96,
      activeLoans: 1,
      upcomingMeetings: 2,
      contributionRate: 100,
      averageBalance: 3125,
    },
    recentTransactions: [
      { id: "t4", type: "CONTRIBUTION", amount: 500, user: "Emily Davis", date: "2024-03-14" },
      { id: "t5", type: "INTEREST", amount: 125, user: "System", date: "2024-03-01" },
      { id: "t6", type: "CONTRIBUTION", amount: 500, user: "Frank Miller", date: "2024-03-12" },
    ],
    members_list: [
      { id: "m4", name: "Emily Davis", role: "ADMIN", balance: 4000, status: "ACTIVE", joinedAt: "2024-02-01" },
      { id: "m5", name: "Frank Miller", role: "MEMBER", balance: 3500, status: "ACTIVE", joinedAt: "2024-02-05" },
      { id: "m6", name: "Grace Lee", role: "MEMBER", balance: 2800, status: "ACTIVE", joinedAt: "2024-02-10" },
    ],
    loanRequests: [
      { id: "l3", user: "Grace Lee", amount: 5000, purpose: "Home renovation", status: "DISBURSED", votes: "8/8" },
    ],
  },
  {
    id: "3",
    name: "Community Fund",
    description: "Supporting local community projects and initiatives",
    logo: "/community-fund.jpg",
    members: 25,
    maxMembers: 30,
    balance: 50000,
    depositGoal: 150000,
    status: "ACTIVE",
    privacy: "PUBLIC",
    governanceType: "ONE_VOTE_DEPOSIT",
    contributionAmount: 50,
    contributionFrequency: "WEEKLY",
    interestRate: 1.5,
    createdAt: "2023-12-10",
    owner: { name: "Michael Chen", avatar: "/bob-portrait.png" },
    stats: {
      totalTransactions: 520,
      activeLoans: 5,
      upcomingMeetings: 1,
      contributionRate: 88,
      averageBalance: 2000,
    },
    recentTransactions: [
      { id: "t7", type: "CONTRIBUTION", amount: 50, user: "Helen Park", date: "2024-03-16" },
      { id: "t8", type: "LOAN_DISBURSEMENT", amount: 3000, user: "Ian Wright", date: "2024-03-15" },
      { id: "t9", type: "CONTRIBUTION", amount: 50, user: "Julia Martinez", date: "2024-03-16" },
    ],
    members_list: [
      { id: "m7", name: "Helen Park", role: "ADMIN", balance: 2600, status: "ACTIVE", joinedAt: "2023-12-10" },
      { id: "m8", name: "Ian Wright", role: "MEMBER", balance: 1800, status: "ACTIVE", joinedAt: "2023-12-15" },
      { id: "m9", name: "Julia Martinez", role: "MEMBER", balance: 2200, status: "ACTIVE", joinedAt: "2024-01-05" },
    ],
    loanRequests: [
      { id: "l4", user: "Ian Wright", amount: 3000, purpose: "Education fees", status: "DISBURSED", votes: "20/25" },
      { id: "l5", user: "Kevin Brown", amount: 2500, purpose: "Small business", status: "APPROVED", votes: "18/25" },
    ],
  },
]

export function GroupsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [privacyFilter, setPrivacyFilter] = useState("all")
  const [governanceFilter, setGovernanceFilter] = useState("all")
  const [selectedGroup, setSelectedGroup] = useState<(typeof mockGroups)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || group.status === statusFilter
    const matchesPrivacy = privacyFilter === "all" || group.privacy === privacyFilter
    const matchesGovernance = governanceFilter === "all" || group.governanceType === governanceFilter
    return matchesSearch && matchesStatus && matchesPrivacy && matchesGovernance
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

  const totalGroups = mockGroups.length
  const activeGroups = mockGroups.filter((g) => g.status === "ACTIVE").length
  const totalMembers = mockGroups.reduce((sum, g) => sum + g.members, 0)
  const totalBalance = mockGroups.reduce((sum, g) => sum + g.balance, 0)

  const handleViewDetails = (group: (typeof mockGroups)[0]) => {
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
                <p className="text-2xl font-bold">${(totalBalance / 1000).toFixed(1)}K</p>
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
            <Button size="sm" className="w-full sm:w-auto">
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
                        <div className="font-medium">${group.balance.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Goal: ${group.depositGoal.toLocaleString()}</div>
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
                          ${selectedGroup.balance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Deposit Goal</span>
                        <span className="text-base sm:text-lg font-medium">
                          ${selectedGroup.depositGoal.toLocaleString()}
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
                            ${selectedGroup.stats.averageBalance.toFixed(2)}
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
                              <p className="text-sm font-medium">${transaction.amount.toLocaleString()}</p>
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
                                <p className="text-sm font-medium">${member.balance.toLocaleString()}</p>
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
                              <p className="text-sm font-bold">${transaction.amount.toLocaleString()}</p>
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
                                <p className="text-lg font-bold">${loan.amount.toLocaleString()}</p>
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
                          <p className="text-sm font-medium">${selectedGroup.contributionAmount}</p>
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
