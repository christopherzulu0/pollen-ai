"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  MoreVertical,
  UserPlus,
  Download,
  Wallet,
  Users,
  DollarSign,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    isAdmin: false,
    createdAt: "2024-01-15",
    status: "active",
    avatar: "/thoughtful-man-in-library.png",
    nationalId: "NID123456",
    address: "123 Main St, New York, NY",
    wallet: {
      balance: 1500.0,
      celoBalance: "2.5",
      cusdBalance: "1500.00",
    },
    stats: {
      groups: 3,
      transactions: 45,
      totalContributed: 5400.0,
      activeLoans: 1,
      savingsGoals: 2,
    },
    recentActivity: [
      { type: "deposit", amount: 100, date: "2024-03-15", description: "Monthly contribution" },
      { type: "withdrawal", amount: 50, date: "2024-03-10", description: "Emergency withdrawal" },
      { type: "loan", amount: 500, date: "2024-03-05", description: "Personal loan approved" },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    isAdmin: true,
    createdAt: "2024-01-10",
    status: "active",
    avatar: "/jane-portrait.png",
    nationalId: "NID789012",
    address: "456 Oak Ave, Los Angeles, CA",
    wallet: {
      balance: 3200.0,
      celoBalance: "5.0",
      cusdBalance: "3200.00",
    },
    stats: {
      groups: 5,
      transactions: 89,
      totalContributed: 12000.0,
      activeLoans: 0,
      savingsGoals: 4,
    },
    recentActivity: [
      { type: "deposit", amount: 200, date: "2024-03-14", description: "Weekly contribution" },
      { type: "deposit", amount: 150, date: "2024-03-07", description: "Bonus deposit" },
    ],
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+1234567892",
    isAdmin: false,
    createdAt: "2024-02-01",
    status: "inactive",
    avatar: "/bob-portrait.png",
    nationalId: "NID345678",
    address: "789 Pine Rd, Chicago, IL",
    wallet: {
      balance: 450.0,
      celoBalance: "0.8",
      cusdBalance: "450.00",
    },
    stats: {
      groups: 1,
      transactions: 12,
      totalContributed: 800.0,
      activeLoans: 2,
      savingsGoals: 1,
    },
    recentActivity: [{ type: "loan", amount: 300, date: "2024-02-28", description: "Business loan" }],
  },
]

export function UsersView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole =
      roleFilter === "all" || (roleFilter === "admin" && user.isAdmin) || (roleFilter === "user" && !user.isAdmin)
    return matchesSearch && matchesStatus && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  const showingFrom = filteredUsers.length > 0 ? startIndex + 1 : 0
  const showingTo = Math.min(endIndex, filteredUsers.length)

  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1)
    if (filterType === "status") setStatusFilter(value)
    if (filterType === "role") setRoleFilter(value)
  }

  const handleViewDetails = (user: (typeof mockUsers)[0]) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,458</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9,234</div>
            <p className="text-xs text-muted-foreground">74% activity rate</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">0.36% of total</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">Combined balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button size="sm" className="bg-primary flex-1 sm:flex-none">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={roleFilter} onValueChange={(value) => handleFilterChange("role", value)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
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
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-6 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Groups</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.nationalId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.isAdmin ? "default" : "secondary"}
                          className={user.isAdmin ? "bg-primary" : ""}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">${user.wallet.balance.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{user.wallet.celoBalance} CELO</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.stats.groups}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(user)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>View Transactions</DropdownMenuItem>
                            <DropdownMenuItem>Manage Wallet</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              {user.status === "active" ? "Suspend User" : "Activate User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {showingFrom} to {showingTo} of {filteredUsers.length} users
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
                        disabled={currentPage === pageNumber}
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

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No users found matching your criteria</div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about this user</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                    <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4 w-full">
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold">{selectedUser.name}</h3>
                      <div className="flex gap-2 mt-2 justify-center sm:justify-start flex-wrap">
                        <Badge variant={selectedUser.isAdmin ? "default" : "secondary"}>
                          {selectedUser.isAdmin ? "Admin" : "User"}
                        </Badge>
                        <Badge
                          variant={selectedUser.status === "active" ? "default" : "secondary"}
                          className={selectedUser.status === "active" ? "bg-green-500" : ""}
                        >
                          {selectedUser.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 pt-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Groups</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl sm:text-2xl font-bold">{selectedUser.stats.groups}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                            Transactions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl sm:text-2xl font-bold">{selectedUser.stats.transactions}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                            Contributed
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl sm:text-2xl font-bold">${selectedUser.stats.totalContributed}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                            Active Loans
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl sm:text-2xl font-bold">{selectedUser.stats.activeLoans}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                            Savings Goals
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xl sm:text-2xl font-bold">{selectedUser.stats.savingsGoals}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Off-chain Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${selectedUser.wallet.balance.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">CELO Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{selectedUser.wallet.celoBalance}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">cUSD Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">${selectedUser.wallet.cusdBalance}</div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-medium">Alfajores (Testnet)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className="bg-green-500">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-mono text-sm">0x742d...35a1</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedUser.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                activity.type === "deposit"
                                  ? "bg-green-500/10"
                                  : activity.type === "withdrawal"
                                    ? "bg-red-500/10"
                                    : "bg-blue-500/10"
                              }`}
                            >
                              <DollarSign
                                className={`h-5 w-5 ${
                                  activity.type === "deposit"
                                    ? "text-green-500"
                                    : activity.type === "withdrawal"
                                      ? "text-red-500"
                                      : "text-blue-500"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                activity.type === "deposit"
                                  ? "text-green-500"
                                  : activity.type === "withdrawal"
                                    ? "text-red-500"
                                    : "text-blue-500"
                              }`}
                            >
                              {activity.type === "withdrawal" ? "-" : "+"}${activity.amount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="groups" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Memberships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">User is a member of {selectedUser.stats.groups} groups</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
