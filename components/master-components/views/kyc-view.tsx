"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Video,
  Fingerprint,
  Eye,
  Download,
  FileText,
  User,
  TrendingUp,
  Activity,
  UserCheck,
  AlertOctagon,
  Play,
  Pause,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const mockKycUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+260 977 123 456",
    avatar: "/thoughtful-man-in-library.png",
    kycLevel: 2,
    status: "approved",
    verificationDate: "2024-03-15",
    riskScore: 15,
    riskLevel: "low",
    biometricStatus: "verified",
    videoKycStatus: "completed",
    nationalId: "123456/78/9",
    address: "Plot 123, Independence Ave, Lusaka",
    sanctionsCheck: "clear",
    pepCheck: "clear",
    transactionLimit: { daily: 50000, monthly: 500000 },
    documents: [
      { type: "NRC Front", status: "verified", date: "2024-03-10" },
      { type: "NRC Back", status: "verified", date: "2024-03-10" },
      { type: "Proof of Address", status: "verified", date: "2024-03-11" },
    ],
    activityFlags: [],
    lastReview: "2024-03-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+260 966 234 567",
    avatar: "/jane-portrait.png",
    kycLevel: 3,
    status: "approved",
    verificationDate: "2024-03-10",
    riskScore: 8,
    riskLevel: "low",
    biometricStatus: "verified",
    videoKycStatus: "completed",
    nationalId: "234567/89/0",
    address: "House 45, Kabulonga, Lusaka",
    sanctionsCheck: "clear",
    pepCheck: "clear",
    transactionLimit: { daily: 100000, monthly: 1000000 },
    documents: [
      { type: "NRC Front", status: "verified", date: "2024-03-05" },
      { type: "NRC Back", status: "verified", date: "2024-03-05" },
      { type: "Proof of Address", status: "verified", date: "2024-03-06" },
      { type: "Bank Statement", status: "verified", date: "2024-03-07" },
      { type: "Employment Letter", status: "verified", date: "2024-03-08" },
    ],
    activityFlags: [],
    lastReview: "2024-03-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "+260 955 345 678",
    avatar: "/bob-portrait.png",
    kycLevel: 1,
    status: "pending",
    verificationDate: null,
    riskScore: 45,
    riskLevel: "medium",
    biometricStatus: "pending",
    videoKycStatus: "required",
    nationalId: "345678/90/1",
    address: "Flat 12B, Cairo Road, Lusaka",
    sanctionsCheck: "pending",
    pepCheck: "pending",
    transactionLimit: { daily: 10000, monthly: 100000 },
    documents: [
      { type: "NRC Front", status: "pending", date: "2024-03-16" },
      { type: "NRC Back", status: "pending", date: "2024-03-16" },
    ],
    activityFlags: [],
    lastReview: null,
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    phone: "+260 977 456 789",
    avatar: "/thoughtful-man-in-library.png",
    kycLevel: 2,
    status: "flagged",
    verificationDate: "2024-02-20",
    riskScore: 78,
    riskLevel: "high",
    biometricStatus: "verified",
    videoKycStatus: "completed",
    nationalId: "456789/01/2",
    address: "Plot 67, Chongwe Road, Lusaka",
    sanctionsCheck: "flagged",
    pepCheck: "match",
    transactionLimit: { daily: 5000, monthly: 50000 },
    documents: [
      { type: "NRC Front", status: "verified", date: "2024-02-15" },
      { type: "NRC Back", status: "verified", date: "2024-02-15" },
      { type: "Proof of Address", status: "verified", date: "2024-02-16" },
    ],
    activityFlags: [
      { type: "Multiple large transactions", date: "2024-03-14", severity: "high" },
      { type: "Unusual transaction pattern", date: "2024-03-12", severity: "medium" },
    ],
    lastReview: "2024-03-14",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+260 966 567 890",
    avatar: "/bob-portrait.png",
    kycLevel: 1,
    status: "rejected",
    verificationDate: null,
    riskScore: 92,
    riskLevel: "high",
    biometricStatus: "failed",
    videoKycStatus: "failed",
    nationalId: "567890/12/3",
    address: "Unknown",
    sanctionsCheck: "match",
    pepCheck: "match",
    transactionLimit: { daily: 0, monthly: 0 },
    documents: [
      { type: "NRC Front", status: "rejected", date: "2024-03-05" },
      { type: "NRC Back", status: "rejected", date: "2024-03-05" },
    ],
    activityFlags: [
      { type: "Sanctions list match", date: "2024-03-05", severity: "critical" },
      { type: "Document forgery detected", date: "2024-03-05", severity: "critical" },
    ],
    lastReview: "2024-03-05",
    rejectionReason: "Sanctions list match and document verification failure",
  },
]

const kycLevelDetails = {
  1: {
    name: "Level 1 - Basic",
    limits: { daily: 10000, monthly: 100000 },
    requirements: ["National ID", "Phone Verification"],
    color: "bg-blue-500",
  },
  2: {
    name: "Level 2 - Standard",
    limits: { daily: 50000, monthly: 500000 },
    requirements: ["Level 1", "Proof of Address", "Biometric Verification"],
    color: "bg-purple-500",
  },
  3: {
    name: "Level 3 - Enhanced",
    limits: { daily: 100000, monthly: 1000000 },
    requirements: ["Level 2", "Video KYC", "Enhanced Due Diligence", "Bank Statement"],
    color: "bg-emerald-500",
  },
}

export function KycView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<(typeof mockKycUsers)[0] | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const [videoKycDialog, setVideoKycDialog] = useState(false)
  const [biometricDialog, setBiometricDialog] = useState(false)
  const [documentsDialog, setDocumentsDialog] = useState(false)
  const [upgradeDialog, setUpgradeDialog] = useState(false)
  const [flagDialog, setFlagDialog] = useState(false)
  const [approveDialog, setApproveDialog] = useState(false)
  const [rejectDialog, setRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [flagReason, setFlagReason] = useState("")
  const [targetKycLevel, setTargetKycLevel] = useState<number>(2)

  const filteredUsers = mockKycUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nationalId.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesLevel = levelFilter === "all" || user.kycLevel.toString() === levelFilter
    const matchesRisk = riskFilter === "all" || user.riskLevel === riskFilter
    return matchesSearch && matchesStatus && matchesLevel && matchesRisk
  })

  const stats = {
    totalUsers: mockKycUsers.length,
    verified: mockKycUsers.filter((u) => u.status === "approved").length,
    pending: mockKycUsers.filter((u) => u.status === "pending").length,
    flagged: mockKycUsers.filter((u) => u.status === "flagged").length,
    rejected: mockKycUsers.filter((u) => u.status === "rejected").length,
    videoKycRequired: mockKycUsers.filter((u) => u.videoKycStatus === "required").length,
    highRisk: mockKycUsers.filter((u) => u.riskLevel === "high").length,
    biometricPending: mockKycUsers.filter((u) => u.biometricStatus === "pending").length,
  }

  const handleViewDetails = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleVideoKyc = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setVideoKycDialog(true)
  }

  const handleBiometric = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setBiometricDialog(true)
  }

  const handleDocuments = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setDocumentsDialog(true)
  }

  const handleUpgrade = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setTargetKycLevel(Math.min(user.kycLevel + 1, 3))
    setUpgradeDialog(true)
  }

  const handleFlag = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setFlagDialog(true)
  }

  const handleApprove = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setApproveDialog(true)
  }

  const handleReject = (user: (typeof mockKycUsers)[0]) => {
    setSelectedUser(user)
    setRejectDialog(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "flagged":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return ""
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-500/10 text-emerald-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "high":
        return "bg-red-500/10 text-red-500"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.verified} verified users</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{stats.biometricPending} biometric pending</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Accounts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.flagged}</div>
            <p className="text-xs text-muted-foreground">{stats.highRisk} high risk</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video KYC Queue</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videoKycRequired}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
      </div>

      {/* KYC Level Overview */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {Object.entries(kycLevelDetails).map(([level, details]) => {
          const count = mockKycUsers.filter((u) => u.kycLevel === Number.parseInt(level)).length
          return (
            <Card key={level} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{details.name}</CardTitle>
                  <Badge className={details.color}>{count} users</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <p>Daily Limit: ZMW {details.limits.daily.toLocaleString()}</p>
                  <p>Monthly Limit: ZMW {details.limits.monthly.toLocaleString()}</p>
                </div>
                <Separator />
                <div className="text-xs space-y-1">
                  <p className="font-medium">Requirements:</p>
                  {details.requirements.map((req, i) => (
                    <p key={i} className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> {req}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Table Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>KYC Management</CardTitle>
              <CardDescription>Manage user verifications, compliance checks, and risk assessments</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or National ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Filter by KYC level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>User</TableHead>
                  <TableHead>KYC Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Biometric</TableHead>
                  <TableHead>Video KYC</TableHead>
                  <TableHead>Sanctions</TableHead>
                  <TableHead>PEP Check</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={kycLevelDetails[user.kycLevel as keyof typeof kycLevelDetails].color}>
                        Level {user.kycLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20">
                          <Progress value={user.riskScore} className="h-2" />
                        </div>
                        <Badge className={getRiskColor(user.riskLevel)} variant="outline">
                          {user.riskScore}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.biometricStatus === "verified" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : user.biometricStatus === "pending" ? (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.videoKycStatus === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : user.videoKycStatus === "required" ? (
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.sanctionsCheck === "clear" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                      ) : user.sanctionsCheck === "pending" ? (
                        <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.pepCheck === "clear" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                      ) : user.pepCheck === "pending" ? (
                        <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                      )}
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVideoKyc(user)}>
                            <Video className="mr-2 h-4 w-4" />
                            Review Video KYC
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleBiometric(user)}>
                            <Fingerprint className="mr-2 h-4 w-4" />
                            Verify Biometric
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDocuments(user)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Documents
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpgrade(user)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Upgrade KYC Level
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-orange-500" onClick={() => handleFlag(user)}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Flag Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No users found matching your criteria</div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>KYC Verification Details</DialogTitle>
            <DialogDescription>Complete verification and compliance information</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="biometric">Biometric</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                      <Badge variant="outline" className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status}
                      </Badge>
                      <Badge className={kycLevelDetails[selectedUser.kycLevel as keyof typeof kycLevelDetails].color}>
                        KYC Level {selectedUser.kycLevel}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span> {selectedUser.email}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span> {selectedUser.phone}
                      </div>
                      <div>
                        <span className="text-muted-foreground">National ID:</span> {selectedUser.nationalId}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Review:</span> {selectedUser.lastReview || "Never"}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Risk Assessment */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                        <Badge className={getRiskColor(selectedUser.riskLevel)}>{selectedUser.riskScore}/100</Badge>
                      </div>
                      <Progress value={selectedUser.riskScore} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level</span>
                        <span className="font-medium capitalize">{selectedUser.riskLevel}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Transaction Limits */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Transaction Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Limit</span>
                        <span className="font-medium">ZMW {selectedUser.transactionLimit.daily.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Limit</span>
                        <span className="font-medium">
                          ZMW {selectedUser.transactionLimit.monthly.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Verification Status */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="h-5 w-5" />
                          <span className="text-sm">Biometric Verification</span>
                        </div>
                        {selectedUser.biometricStatus === "verified" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <Video className="h-5 w-5" />
                          <span className="text-sm">Video KYC</span>
                        </div>
                        {selectedUser.videoKycStatus === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : selectedUser.videoKycStatus === "required" ? (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5" />
                          <span className="text-sm">Sanctions Check</span>
                        </div>
                        {selectedUser.sanctionsCheck === "clear" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          <AlertOctagon className="h-5 w-5" />
                          <span className="text-sm">PEP Check</span>
                        </div>
                        {selectedUser.pepCheck === "clear" ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Flags */}
                {selectedUser.activityFlags.length > 0 && (
                  <Card className="bg-card border-border border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Activity Flags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedUser.activityFlags.map((flag, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10">
                            <div>
                              <p className="font-medium text-sm">{flag.type}</p>
                              <p className="text-xs text-muted-foreground">{flag.date}</p>
                            </div>
                            <Badge
                              className={
                                flag.severity === "critical"
                                  ? "bg-red-500"
                                  : flag.severity === "high"
                                    ? "bg-orange-500"
                                    : "bg-yellow-500"
                              }
                            >
                              {flag.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {selectedUser.status === "pending" && (
                    <>
                      <Button
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleApprove(selectedUser)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Verification
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleReject(selectedUser)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Verification
                      </Button>
                    </>
                  )}
                  {selectedUser.status === "flagged" && (
                    <>
                      <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                        <Play className="mr-2 h-4 w-4" />
                        Resume Account
                      </Button>
                      <Button variant="destructive" className="flex-1">
                        <Pause className="mr-2 h-4 w-4" />
                        Suspend Account
                      </Button>
                    </>
                  )}
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate SAR Report
                  </Button>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Uploaded Documents</CardTitle>
                    <CardDescription>All documents submitted for KYC verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedUser.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{doc.type}</div>
                              <div className="text-xs text-muted-foreground">Uploaded on {doc.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                doc.status === "verified"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : doc.status === "pending"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-red-500/10 text-red-500"
                              }
                            >
                              {doc.status}
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Document Verification Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Verification Notes</Label>
                      <Textarea
                        placeholder="Add notes about document verification..."
                        className="bg-background min-h-[100px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">Verify All Documents</Button>
                      <Button variant="destructive" className="flex-1">
                        Reject Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Biometric Tab */}
              <TabsContent value="biometric" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Biometric Verification</CardTitle>
                    <CardDescription>Fingerprint and Face ID verification status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Fingerprint</h4>
                          {selectedUser.biometricStatus === "verified" ? (
                            <Badge className="bg-emerald-500">Verified</Badge>
                          ) : (
                            <Badge className="bg-yellow-500">Pending</Badge>
                          )}
                        </div>
                        <div className="flex justify-center p-6 bg-muted rounded-lg">
                          <Fingerprint className="h-24 w-24 text-muted-foreground" />
                        </div>
                        <div className="text-xs space-y-1">
                          <p>
                            <span className="text-muted-foreground">Captured:</span>{" "}
                            {selectedUser.verificationDate || "Not yet"}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Match Score:</span> 98.5%
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Face ID</h4>
                          {selectedUser.biometricStatus === "verified" ? (
                            <Badge className="bg-emerald-500">Verified</Badge>
                          ) : (
                            <Badge className="bg-yellow-500">Pending</Badge>
                          )}
                        </div>
                        <div className="flex justify-center p-6 bg-muted rounded-lg">
                          <User className="h-24 w-24 text-muted-foreground" />
                        </div>
                        <div className="text-xs space-y-1">
                          <p>
                            <span className="text-muted-foreground">Captured:</span>{" "}
                            {selectedUser.verificationDate || "Not yet"}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Liveness Check:</span> Passed
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Biometric Verification Notes</Label>
                      <Textarea
                        placeholder="Add notes about biometric verification..."
                        className="bg-background min-h-[100px]"
                      />
                    </div>

                    {selectedUser.biometricStatus !== "verified" && (
                      <Button
                        className="w-full bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => setBiometricDialog(true)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Biometric Verification
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Video KYC Section */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Video KYC</CardTitle>
                    <CardDescription>Live video verification for high-value transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedUser.videoKycStatus === "completed" ? (
                      <>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <Video className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Completed:</span>{" "}
                            {selectedUser.verificationDate || "N/A"}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span> 12:34
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reviewer:</span> Agent KYC-001
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span> Approved
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setVideoKycDialog(true)}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Review Video Recording
                        </Button>
                      </>
                    ) : selectedUser.videoKycStatus === "required" ? (
                      <>
                        <div className="p-6 rounded-lg border-2 border-dashed border-orange-500/50 bg-orange-500/5">
                          <div className="flex flex-col items-center gap-3 text-center">
                            <AlertTriangle className="h-12 w-12 text-orange-500" />
                            <h4 className="font-medium">Video KYC Required</h4>
                            <p className="text-sm text-muted-foreground">
                              This user requires video KYC verification before approval
                            </p>
                            <Button className="mt-2 bg-primary">Schedule Video Call</Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-6 rounded-lg border border-border bg-card text-center">
                        <p className="text-muted-foreground">Video KYC not required for this KYC level</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Sanctions Screening */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Sanctions Screening</CardTitle>
                      <CardDescription>Check against international sanctions lists</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">OFAC List</span>
                        {selectedUser.sanctionsCheck === "clear" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">UN Security Council</span>
                        {selectedUser.sanctionsCheck === "clear" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">EU Sanctions</span>
                        {selectedUser.sanctionsCheck === "clear" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                        )}
                      </div>
                      <Separator />
                      <Button variant="outline" className="w-full bg-transparent">
                        <Activity className="mr-2 h-4 w-4" />
                        Run Sanctions Check
                      </Button>
                    </CardContent>
                  </Card>

                  {/* PEP Screening */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">PEP Screening</CardTitle>
                      <CardDescription>Politically Exposed Person check</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Direct PEP</span>
                        {selectedUser.pepCheck === "clear" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">RCA (Relative/Close Associate)</span>
                        {selectedUser.pepCheck === "clear" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Adverse Media</span>
                        {selectedUser.pepCheck === "clear" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500">Clear</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500">Match</Badge>
                        )}
                      </div>
                      <Separator />
                      <Button variant="outline" className="w-full bg-transparent">
                        <Activity className="mr-2 h-4 w-4" />
                        Run PEP Check
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Due Diligence */}
                {selectedUser.kycLevel === 3 && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Enhanced Due Diligence (EDD)</CardTitle>
                      <CardDescription>Additional checks for Level 3 verification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="text-sm">Source of Funds</span>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="text-sm">Source of Wealth</span>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="text-sm">Business Profile</span>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <span className="text-sm">Beneficial Ownership</span>
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* SAR Reporting */}
                <Card className="bg-card border-border border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertOctagon className="h-5 w-5 text-orange-500" />
                      Suspicious Activity Reporting (SAR)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Suspicious Activity Details</Label>
                      <Textarea
                        placeholder="Describe any suspicious activity patterns..."
                        className="bg-background min-h-[120px]"
                      />
                    </div>
                    <Button variant="destructive" className="w-full">
                      <AlertOctagon className="mr-2 h-4 w-4" />
                      Generate SAR Report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Real-Time Transaction Monitoring</CardTitle>
                    <CardDescription>Automated monitoring for suspicious patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-emerald-500" />
                          <div>
                            <p className="text-sm font-medium">Monitoring Active</p>
                            <p className="text-xs text-muted-foreground">24/7 real-time tracking</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5" />
                          <div>
                            <p className="text-sm font-medium">Transaction Patterns</p>
                            <p className="text-xs text-muted-foreground">ML-based pattern detection</p>
                          </div>
                        </div>
                        <Badge>Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5" />
                          <div>
                            <p className="text-sm font-medium">Velocity Checks</p>
                            <p className="text-xs text-muted-foreground">Transaction frequency monitoring</p>
                          </div>
                        </div>
                        <Badge>Normal</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedUser.activityFlags.length > 0 && (
                  <Card className="bg-card border-border border-orange-500/20">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Flagged Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedUser.activityFlags.map((flag, i) => (
                          <div key={i} className="p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">{flag.type}</p>
                              <Badge
                                className={
                                  flag.severity === "critical"
                                    ? "bg-red-500"
                                    : flag.severity === "high"
                                      ? "bg-orange-500"
                                      : "bg-yellow-500"
                                }
                              >
                                {flag.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{flag.date}</p>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                Review
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Recent KYC History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">KYC Level {selectedUser.kycLevel} Approved</p>
                          <p className="text-xs text-muted-foreground">{selectedUser.verificationDate || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Video className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Video KYC Completed</p>
                          <p className="text-xs text-muted-foreground">2 days before approval</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Fingerprint className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Biometric Verification</p>
                          <p className="text-xs text-muted-foreground">3 days before approval</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={videoKycDialog} onOpenChange={setVideoKycDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Video KYC Review</DialogTitle>
            <DialogDescription>Review and verify video KYC submission for {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center space-y-2">
                      <Video className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Video recording available</p>
                      <Button>
                        <Play className="mr-2 h-4 w-4" />
                        Play Video
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Recording Date</Label>
                      <div className="text-sm">{selectedUser.verificationDate || "Not recorded"}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <div className="text-sm">2:45 minutes</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Video Quality</Label>
                      <Badge className="bg-emerald-500">HD Quality</Badge>
                    </div>
                    <div className="space-y-2">
                      <Label>Audio Quality</Label>
                      <Badge className="bg-emerald-500">Clear</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Verification Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm">Face matches ID photo</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm">ID document clearly visible</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm">Liveness check passed</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <span className="text-sm">Voice verification successful</span>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Review Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea placeholder="Add your review notes here..." className="bg-background min-h-[100px]" />
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Video KYC
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Video KYC
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={biometricDialog} onOpenChange={setBiometricDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Biometric Verification</DialogTitle>
            <DialogDescription>Review biometric authentication data for {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Fingerprint className="h-5 w-5" />
                      Fingerprint Scan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-center p-8 bg-muted rounded-lg">
                      <Fingerprint className="h-32 w-32 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Match Score:</span>
                        <span className="font-medium">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality:</span>
                        <Badge className="bg-emerald-500">Excellent</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Captured:</span>
                        <span className="font-medium">{selectedUser.verificationDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Face Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-center p-8 bg-muted rounded-lg">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Match Score:</span>
                        <span className="font-medium">96.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Liveness:</span>
                        <Badge className="bg-emerald-500">Verified</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Captured:</span>
                        <span className="font-medium">{selectedUser.verificationDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Verification Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea placeholder="Add verification notes..." className="bg-background min-h-[80px]" />
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify Biometrics
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Request Re-scan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={documentsDialog} onOpenChange={setDocumentsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Verification</DialogTitle>
            <DialogDescription>Review and verify documents for {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="grid gap-4">
                {selectedUser.documents.map((doc, i) => (
                  <Card key={i} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{doc.type}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            doc.status === "verified"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : doc.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Uploaded: {doc.date}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Full
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Bulk Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Add verification notes for all documents..."
                    className="bg-background min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify All Documents
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Request Resubmission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeDialog} onOpenChange={setUpgradeDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upgrade KYC Level</DialogTitle>
            <DialogDescription>Upgrade verification level for {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Current Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge className={kycLevelDetails[selectedUser.kycLevel as keyof typeof kycLevelDetails].color}>
                      Level {selectedUser.kycLevel}
                    </Badge>
                    <div className="text-sm">
                      <p className="font-medium">
                        {kycLevelDetails[selectedUser.kycLevel as keyof typeof kycLevelDetails].name}
                      </p>
                      <p className="text-muted-foreground">
                        Daily Limit: ZMW{" "}
                        {kycLevelDetails[
                          selectedUser.kycLevel as keyof typeof kycLevelDetails
                        ].limits.daily.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Select Target Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select
                    value={targetKycLevel.toString()}
                    onValueChange={(v) => setTargetKycLevel(Number.parseInt(v))}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedUser.kycLevel < 2 && <SelectItem value="2">Level 2 - Standard</SelectItem>}
                      {selectedUser.kycLevel < 3 && <SelectItem value="3">Level 3 - Enhanced</SelectItem>}
                    </SelectContent>
                  </Select>

                  {targetKycLevel && (
                    <div className="p-4 rounded-lg border border-border space-y-2">
                      <h4 className="font-medium">
                        {kycLevelDetails[targetKycLevel as keyof typeof kycLevelDetails].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Daily Limit: ZMW{" "}
                        {kycLevelDetails[targetKycLevel as keyof typeof kycLevelDetails].limits.daily.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Monthly Limit: ZMW{" "}
                        {kycLevelDetails[
                          targetKycLevel as keyof typeof kycLevelDetails
                        ].limits.monthly.toLocaleString()}
                      </p>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Requirements:</p>
                        {kycLevelDetails[targetKycLevel as keyof typeof kycLevelDetails].requirements.map((req, i) => (
                          <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> {req}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <Textarea placeholder="Add reason for upgrade..." className="bg-background min-h-[80px]" />

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Upgrade to Level {targetKycLevel}
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setUpgradeDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={flagDialog} onOpenChange={setFlagDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Flag Account
            </DialogTitle>
            <DialogDescription>Mark this account for review due to suspicious activity</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Card className="bg-card border-border border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-base">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User:</span>
                    <span className="font-medium">{selectedUser.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Current Status:</span>
                    <Badge variant="outline" className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Score:</span>
                    <Badge className={getRiskColor(selectedUser.riskLevel)}>{selectedUser.riskScore}/100</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Flag Reason</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={flagReason} onValueChange={setFlagReason}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select reason for flagging" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suspicious_transactions">Suspicious Transactions</SelectItem>
                      <SelectItem value="document_concerns">Document Concerns</SelectItem>
                      <SelectItem value="sanctions_match">Sanctions List Match</SelectItem>
                      <SelectItem value="pep_concerns">PEP Concerns</SelectItem>
                      <SelectItem value="fraud_indicators">Fraud Indicators</SelectItem>
                      <SelectItem value="unusual_pattern">Unusual Activity Pattern</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <Label>Additional Details</Label>
                    <Textarea
                      placeholder="Provide detailed information about why this account is being flagged..."
                      className="bg-background min-h-[120px]"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm text-orange-500">
                      <strong>Warning:</strong> Flagging this account will restrict transactions and notify compliance
                      team for review.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive" className="flex-1 bg-orange-500 hover:bg-orange-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Flag Account
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setFlagDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={approveDialog} onOpenChange={setApproveDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-500">
              <CheckCircle className="h-5 w-5" />
              Approve KYC Verification
            </DialogTitle>
            <DialogDescription>Confirm approval of KYC verification for {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Card className="bg-card border-border border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-base">Verification Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Documents:</span>
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Biometric:</span>
                    {selectedUser.biometricStatus === "verified" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sanctions Check:</span>
                    {selectedUser.sanctionsCheck === "clear" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">PEP Check:</span>
                    {selectedUser.pepCheck === "clear" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6 space-y-3">
                  <Textarea placeholder="Add approval notes (optional)..." className="bg-background min-h-[80px]" />
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm Approval
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setApproveDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="h-5 w-5" />
              Reject KYC Verification
            </DialogTitle>
            <DialogDescription>Provide reason for rejection of {selectedUser?.name}'s verification</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Card className="bg-card border-border border-red-500/20">
                <CardHeader>
                  <CardTitle className="text-base">Rejection Reason</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={rejectionReason} onValueChange={setRejectionReason}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select rejection reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invalid_documents">Invalid or Expired Documents</SelectItem>
                      <SelectItem value="poor_quality">Poor Quality Documents</SelectItem>
                      <SelectItem value="mismatch">Information Mismatch</SelectItem>
                      <SelectItem value="forgery">Suspected Document Forgery</SelectItem>
                      <SelectItem value="sanctions">Sanctions List Match</SelectItem>
                      <SelectItem value="pep">PEP Match - High Risk</SelectItem>
                      <SelectItem value="biometric_fail">Biometric Verification Failed</SelectItem>
                      <SelectItem value="video_fail">Video KYC Failed</SelectItem>
                      <SelectItem value="incomplete">Incomplete Information</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <Label>Detailed Explanation (Required)</Label>
                    <Textarea
                      placeholder="Provide a detailed explanation for rejection that will be sent to the user..."
                      className="bg-background min-h-[120px]"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-500">
                      <strong>Important:</strong> The user will be notified of this rejection and provided with the
                      reason. They may resubmit their verification.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive" className="flex-1">
                      <XCircle className="mr-2 h-4 w-4" />
                      Confirm Rejection
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setRejectDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
