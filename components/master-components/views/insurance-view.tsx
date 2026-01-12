"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Shield,
  Sprout,
  Heart,
  Skull,
  Users,
  Smartphone,
  Cloud,
  Plus,
  Search,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  FileText,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

// Mock data for insurance products
const insuranceProducts = [
  {
    id: "1",
    name: "Crop Insurance",
    type: "crop",
    icon: Sprout,
    activePolicies: 234,
    totalCoverage: "$2.4M",
    premiumCollected: "$45,600",
    claims: 12,
    claimsPaid: "$89,400",
    status: "active",
    description: "Seasonal crop protection with weather-based parametric coverage",
  },
  {
    id: "2",
    name: "Health Emergency Coverage",
    type: "health",
    icon: Heart,
    activePolicies: 1245,
    totalCoverage: "$8.9M",
    premiumCollected: "$156,800",
    claims: 45,
    claimsPaid: "$234,500",
    status: "active",
    description: "Emergency medical coverage for members and families",
  },
  {
    id: "3",
    name: "Loan Protection",
    type: "loan",
    icon: Skull,
    activePolicies: 89,
    totalCoverage: "$1.2M",
    premiumCollected: "$23,400",
    claims: 3,
    claimsPaid: "$45,000",
    status: "active",
    description: "Death and disability coverage for active loans",
  },
  {
    id: "4",
    name: "Group Savings Insurance",
    type: "fraud",
    icon: Users,
    activePolicies: 342,
    totalCoverage: "$5.6M",
    premiumCollected: "$89,200",
    claims: 2,
    claimsPaid: "$12,000",
    status: "active",
    description: "Fraud protection for group savings accounts",
  },
  {
    id: "5",
    name: "Mobile Phone Insurance",
    type: "mobile",
    icon: Smartphone,
    activePolicies: 567,
    totalCoverage: "$850K",
    premiumCollected: "$34,500",
    claims: 28,
    claimsPaid: "$56,700",
    status: "active",
    description: "Theft, damage, and loss protection for mobile devices",
  },
  {
    id: "6",
    name: "Weather Parametric",
    type: "weather",
    icon: Cloud,
    activePolicies: 178,
    totalCoverage: "$3.2M",
    premiumCollected: "$67,800",
    claims: 8,
    claimsPaid: "$124,000",
    status: "active",
    description: "Automated payouts based on weather data triggers",
  },
]

// Mock claims data
const recentClaims = [
  {
    id: "CLM-001",
    policyHolder: "John Farmer",
    insuranceType: "Crop Insurance",
    claimAmount: "$12,000",
    status: "approved",
    dateSubmitted: "2024-01-15",
    description: "Drought damage to maize crop",
  },
  {
    id: "CLM-002",
    policyHolder: "Mary Johnson",
    insuranceType: "Health Emergency",
    claimAmount: "$5,400",
    status: "pending",
    dateSubmitted: "2024-01-14",
    description: "Emergency hospital admission",
  },
  {
    id: "CLM-003",
    policyHolder: "Bob Smith",
    insuranceType: "Mobile Phone",
    claimAmount: "$800",
    status: "processing",
    dateSubmitted: "2024-01-13",
    description: "Phone theft claim",
  },
  {
    id: "CLM-004",
    policyHolder: "Alice Williams",
    insuranceType: "Weather Parametric",
    claimAmount: "$15,000",
    status: "approved",
    dateSubmitted: "2024-01-12",
    description: "Automatic payout - rainfall trigger met",
  },
  {
    id: "CLM-005",
    policyHolder: "David Brown Estate",
    insuranceType: "Loan Protection",
    claimAmount: "$25,000",
    status: "approved",
    dateSubmitted: "2024-01-10",
    description: "Death benefit claim",
  },
]

export function InsuranceView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showNewProductDialog, setShowNewProductDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [claimsPage, setClaimsPage] = useState(1)
  const [claimsPerPage, setClaimsPerPage] = useState(10)
  const [showPendingAppsDialog, setShowPendingAppsDialog] = useState(false)
  const [showEditRulesDialog, setShowEditRulesDialog] = useState(false)
  const [selectedProductForRules, setSelectedProductForRules] = useState<any>(null)

  const totalClaims = recentClaims.length
  const totalClaimsPages = Math.ceil(totalClaims / claimsPerPage)
  const startClaimsIndex = (claimsPage - 1) * claimsPerPage
  const endClaimsIndex = startClaimsIndex + claimsPerPage
  const paginatedClaims = recentClaims.slice(startClaimsIndex, endClaimsIndex)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const totalStats = {
    totalPolicies: insuranceProducts.reduce((acc, p) => acc + p.activePolicies, 0),
    totalCoverage: "$22.1M",
    totalPremiums: "$417,300",
    totalClaims: insuranceProducts.reduce((acc, p) => acc + p.claims, 0),
    claimsPaid: "$561,600",
    claimRatio: "134.5%",
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStats.totalPolicies}</div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStats.totalCoverage}</div>
            <p className="text-xs text-green-500">+12.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premiums Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStats.totalPremiums}</div>
            <p className="text-xs text-green-500">+8.7% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStats.totalClaims}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStats.claimsPaid}</div>
            <p className="text-xs text-muted-foreground">Lifetime payouts</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Ratio</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalStats.claimRatio}</div>
            <p className="text-xs text-yellow-500">Monitor closely</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="products">Insurance Products</TabsTrigger>
            <TabsTrigger value="claims">Claims Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="underwriting">Risk & Underwriting</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 w-full sm:w-auto">
            <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
              <DialogTrigger asChild>
                <Button className="flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-2" />
                  New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Insurance Product</DialogTitle>
                  <DialogDescription>Configure a new insurance product for your platform</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop">Crop Insurance</SelectItem>
                        <SelectItem value="health">Health Emergency</SelectItem>
                        <SelectItem value="loan">Loan Protection</SelectItem>
                        <SelectItem value="fraud">Group Savings (Fraud Protection)</SelectItem>
                        <SelectItem value="mobile">Mobile Phone</SelectItem>
                        <SelectItem value="weather">Weather Parametric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input placeholder="e.g., Premium Crop Shield" />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe the insurance coverage..." rows={3} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Premium Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Coverage Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Premium Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Waiting Period (days)</Label>
                      <Input type="number" placeholder="30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Coverage Terms</Label>
                    <Textarea placeholder="Define coverage terms and conditions..." rows={4} />
                  </div>

                  <div className="space-y-2">
                    <Label>Exclusions</Label>
                    <Textarea placeholder="List any exclusions..." rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewProductDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewProductDialog(false)}>Create Product</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Insurance Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {insuranceProducts.map((product) => {
              const Icon = product.icon
              return (
                <Card key={product.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {product.activePolicies} active
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem>View Policies</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-xs mt-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Coverage</p>
                        <p className="text-lg font-semibold text-foreground">{product.totalCoverage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Premiums</p>
                        <p className="text-lg font-semibold text-foreground">{product.premiumCollected}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Claims Activity</span>
                        <span className="text-foreground">
                          {product.claims} claims / {product.claimsPaid} paid
                        </span>
                      </div>
                      <Progress value={(product.claims / product.activePolicies) * 100} className="h-2" />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="sm"
                      onClick={() => {
                        router.push(`/admin/insurance/product/${product.id}`)
                      }}
                    >
                      Manage Product
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Claims Management Tab */}
        <TabsContent value="claims" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Recent Claims</CardTitle>
                  <CardDescription>Manage and process insurance claims</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search claims..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-[250px]"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Policy Holder</TableHead>
                      <TableHead>Insurance Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-mono text-sm">{claim.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">{claim.policyHolder.charAt(0)}</span>
                            </div>
                            <span>{claim.policyHolder}</span>
                          </div>
                        </TableCell>
                        <TableCell>{claim.insuranceType}</TableCell>
                        <TableCell className="font-semibold">{claim.claimAmount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(claim.dateSubmitted).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedClaim(claim)
                              setShowClaimDialog(true)
                            }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rows per page:</span>
                  <Select
                    value={claimsPerPage.toString()}
                    onValueChange={(value) => {
                      setClaimsPerPage(Number(value))
                      setClaimsPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {startClaimsIndex + 1}-{Math.min(endClaimsIndex, totalClaims)} of {totalClaims}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => setClaimsPage(1)} disabled={claimsPage === 1}>
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setClaimsPage(claimsPage - 1)}
                      disabled={claimsPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setClaimsPage(claimsPage + 1)}
                      disabled={claimsPage === totalClaimsPages}
                    >
                      Next
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setClaimsPage(totalClaimsPages)}
                      disabled={claimsPage === totalClaimsPages}
                    >
                      Last
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insuranceProducts.map((product) => {
              const Icon = product.icon
              const claimRatio =
                (Number.parseFloat(product.claimsPaid.replace(/[$,]/g, "")) /
                  Number.parseFloat(product.premiumCollected.replace(/[$,]/g, ""))) *
                100

              return (
                <Card key={product.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <CardDescription className="text-xs">Performance Metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Policies</p>
                        <p className="text-xl font-bold text-foreground">{product.activePolicies}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Claims</p>
                        <p className="text-xl font-bold text-foreground">{product.claims}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ratio</p>
                        <p className={`text-xl font-bold ${claimRatio > 100 ? "text-red-500" : "text-green-500"}`}>
                          {claimRatio.toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Premium Collection</span>
                        <span className="text-foreground">{product.premiumCollected}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Claims Paid</span>
                        <span className="text-foreground">{product.claimsPaid}</span>
                      </div>
                      <Progress value={claimRatio} className="h-2" />
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Net Position</span>
                        <span className={`font-semibold ${claimRatio < 100 ? "text-green-500" : "text-red-500"}`}>
                          {claimRatio < 100 ? "Profitable" : "Loss"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Risk & Underwriting Tab */}
        <TabsContent value="underwriting" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Assessment Dashboard */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Automated risk scoring and underwriting decisions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">High Risk Applications</p>
                        <p className="text-xs text-muted-foreground">Require manual review</p>
                      </div>
                    </div>
                    <Badge variant="destructive">23</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Medium Risk</p>
                        <p className="text-xs text-muted-foreground">Review recommended</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-500">87</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Low Risk</p>
                        <p className="text-xs text-muted-foreground">Auto-approved</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500">342</Badge>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Label>Risk Score Threshold</Label>
                  <div className="flex items-center gap-4">
                    <Input type="number" defaultValue="75" className="w-24" />
                    <span className="text-sm text-muted-foreground">Auto-approve below this score</span>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setShowPendingAppsDialog(true)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Review Pending Applications
                </Button>
              </CardContent>
            </Card>

            {/* Underwriting Rules */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Underwriting Rules</CardTitle>
                <CardDescription>Automated approval criteria by product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {insuranceProducts.slice(0, 4).map((product) => {
                    const Icon = product.icon
                    return (
                      <div key={product.id} className="p-3 rounded-lg border border-border bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{product.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProductForRules(product)
                              setShowEditRulesDialog(true)
                            }}
                          >
                            Edit Rules
                          </Button>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>• Max coverage: $25,000</p>
                          <p>• Min credit score: 650</p>
                          <p>• Age range: 18-65 years</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Operations */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Bulk Policy Operations</CardTitle>
              <CardDescription>Perform actions on multiple policies at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-6 flex-col bg-transparent">
                  <Shield className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-medium">Bulk Renewal</span>
                  <span className="text-xs text-muted-foreground mt-1">Renew multiple policies</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex-col bg-transparent">
                  <TrendingUp className="h-6 w-6 mb-2 text-blue-500" />
                  <span className="font-medium">Premium Adjustment</span>
                  <span className="text-xs text-muted-foreground mt-1">Update premium rates</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex-col bg-transparent">
                  <AlertCircle className="h-6 w-6 mb-2 text-yellow-500" />
                  <span className="font-medium">Coverage Review</span>
                  <span className="text-xs text-muted-foreground mt-1">Reassess coverage limits</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fraud Detection Tab */}
        <TabsContent value="fraud" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagged Claims</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">12</div>
                <p className="text-xs text-red-500">Requires investigation</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Patterns</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">7</div>
                <p className="text-xs text-yellow-500">Under monitoring</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Prevention</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$234K</div>
                <p className="text-xs text-green-500">Saved this year</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Fraud Detection Alerts</CardTitle>
              <CardDescription>AI-powered suspicious activity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "FD-001",
                    type: "Multiple Claims",
                    user: "John Doe",
                    risk: "high",
                    reason: "3 claims in 2 weeks",
                  },
                  {
                    id: "FD-002",
                    type: "Duplicate Policy",
                    user: "Jane Smith",
                    risk: "medium",
                    reason: "Similar details across accounts",
                  },
                  {
                    id: "FD-003",
                    type: "Rapid Enrollment",
                    user: "Bob Wilson",
                    risk: "high",
                    reason: "Enrolled in 5 products same day",
                  },
                  {
                    id: "FD-004",
                    type: "Document Mismatch",
                    user: "Alice Brown",
                    risk: "high",
                    reason: "ID verification failed",
                  },
                ].map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${alert.risk === "high" ? "bg-red-500/10" : "bg-yellow-500/10"}`}
                      >
                        <AlertCircle
                          className={`h-5 w-5 ${alert.risk === "high" ? "text-red-500" : "text-yellow-500"}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.user} • {alert.reason}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Alert ID: {alert.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.risk === "high" ? "destructive" : "secondary"}>
                        {alert.risk.toUpperCase()}
                      </Badge>
                      <Button size="sm">Investigate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Fraud Detection Rules</CardTitle>
              <CardDescription>Configure automated fraud detection parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">Multiple claims in short period</p>
                    <p className="text-xs text-muted-foreground">Flag if {">"} 2 claims within 30 days</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">Duplicate identity detection</p>
                    <p className="text-xs text-muted-foreground">Cross-reference IDs and biometrics</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium">Unusual claim amounts</p>
                    <p className="text-xs text-muted-foreground">Flag claims {">"} 2x average</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reconciliation Tab */}
        <TabsContent value="reconciliation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premiums Due</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$87,340</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premiums Collected</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$82,140</div>
                <p className="text-xs text-green-500">94.0% collection rate</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$5,200</div>
                <p className="text-xs text-yellow-500">127 overdue accounts</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Claims Reserves</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">$1.2M</div>
                <p className="text-xs text-muted-foreground">Reserve fund</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Financial Reconciliation</CardTitle>
                <CardDescription>Match premiums, claims, and bank statements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">January 2024</span>
                      <Badge className="bg-green-500/20 text-green-500">Reconciled</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Premiums</p>
                        <p className="font-semibold">$89,450</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Claims Paid</p>
                        <p className="font-semibold">$56,780</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">December 2023</span>
                      <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Premiums</p>
                        <p className="font-semibold">$91,200</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Claims Paid</p>
                        <p className="font-semibold">$67,400</p>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-500 mt-2">Discrepancy: $234 - Requires review</p>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Run Monthly Reconciliation
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Reinsurance Management</CardTitle>
                <CardDescription>Track reinsurance coverage and treaties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Catastrophic Coverage</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coverage Limit</span>
                        <span className="font-semibold">$5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Premium Ceded</span>
                        <span className="font-semibold">$45,600/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Retention</span>
                        <span className="font-semibold">$500K</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Excess of Loss Treaty</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coverage Limit</span>
                        <span className="font-semibold">$3M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Premium Ceded</span>
                        <span className="font-semibold">$32,400/year</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Manage Reinsurance Treaties
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">98%</div>
                <p className="text-xs text-green-500">Excellent standing</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <FileText className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">3</div>
                <p className="text-xs text-yellow-500">Due this month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audits</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">2</div>
                <p className="text-xs text-muted-foreground">Scheduled this quarter</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Regulatory Reports</CardTitle>
              <CardDescription>Required compliance filings and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Quarterly Financial Report", due: "Jan 31, 2024", status: "pending", priority: "high" },
                  { name: "Claims Activity Report", due: "Feb 15, 2024", status: "draft", priority: "medium" },
                  { name: "Annual Solvency Report", due: "Mar 31, 2024", status: "not_started", priority: "high" },
                  { name: "Premium Tax Filing", due: "Jan 20, 2024", status: "submitted", priority: "high" },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-sm text-muted-foreground">Due: {report.due}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          report.status === "submitted"
                            ? "default"
                            : report.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {report.status.replace("_", " ")}
                      </Badge>
                      <Button size="sm" variant={report.status === "submitted" ? "outline" : "default"}>
                        {report.status === "submitted" ? "View" : "Complete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Compliance Checks</CardTitle>
                <CardDescription>Automated compliance monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { check: "Solvency Ratio", status: "pass", value: "145%" },
                  { check: "Reserve Requirements", status: "pass", value: "$1.2M" },
                  { check: "Claims Processing Time", status: "warning", value: "12.3 days" },
                  { check: "Customer Complaints", status: "pass", value: "0.3%" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      {item.status === "pass" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">{item.check}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Suspicious Activity Reports</CardTitle>
                <CardDescription>Automated SAR generation and filing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SARs Filed (YTD)</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Under Review</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Awaiting Filing</span>
                    <span className="font-semibold">1</span>
                  </div>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View All SARs
                </Button>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-sm text-blue-400">
                    <AlertCircle className="h-4 w-4 inline mr-2" />1 SAR requires immediate attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Claim Detail Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Review - {selectedClaim?.id}</DialogTitle>
            <DialogDescription>Review and process this insurance claim</DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Policy Holder</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedClaim.policyHolder}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Insurance Type</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedClaim.insuranceType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Claim Amount</Label>
                  <p className="text-lg font-semibold text-foreground">{selectedClaim.claimAmount}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={`${getStatusColor(selectedClaim.status)} mt-2`}>
                    {selectedClaim.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Claim Description</Label>
                <p className="mt-2 text-foreground">{selectedClaim.description}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Date Submitted</Label>
                <p className="mt-2 text-foreground">
                  {new Date(selectedClaim.dateSubmitted).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <Card className="bg-muted/50 border-border">
                <CardHeader>
                  <CardTitle className="text-sm">Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">claim-evidence-001.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-background">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">medical-report.pdf</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea placeholder="Add notes about this claim..." rows={4} />
              </div>

              {selectedClaim.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-transparent" variant="outline" onClick={() => setShowClaimDialog(false)}>
                    Reject Claim
                  </Button>
                  <Button className="flex-1" onClick={() => setShowClaimDialog(false)}>
                    Approve & Process
                  </Button>
                </div>
              )}

              {selectedClaim.status !== "pending" && (
                <div className="flex justify-end">
                  <Button onClick={() => setShowClaimDialog(false)}>Close</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPendingAppsDialog} onOpenChange={setShowPendingAppsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pending Policy Applications</DialogTitle>
            <DialogDescription>Review and approve policy applications requiring manual review</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[
              {
                id: "APP-001",
                applicant: "John Farmer",
                product: "Crop Insurance",
                coverage: "$25,000",
                riskScore: 78,
                riskLevel: "high",
                reason: "High claim history in region",
              },
              {
                id: "APP-002",
                applicant: "Mary Johnson",
                product: "Health Emergency",
                coverage: "$15,000",
                riskScore: 65,
                riskLevel: "medium",
                reason: "Pre-existing conditions flagged",
              },
              {
                id: "APP-003",
                applicant: "Bob Wilson",
                product: "Loan Protection",
                coverage: "$50,000",
                riskScore: 82,
                riskLevel: "high",
                reason: "High loan amount, income verification needed",
              },
            ].map((app) => (
              <Card key={app.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{app.applicant}</h3>
                      <p className="text-sm text-muted-foreground">{app.product}</p>
                      <p className="text-xs text-muted-foreground mt-1">Application ID: {app.id}</p>
                    </div>
                    <Badge variant={app.riskLevel === "high" ? "destructive" : "secondary"}>
                      {app.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Coverage Amount</Label>
                      <p className="text-base font-semibold text-foreground">{app.coverage}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Risk Score</Label>
                      <p className="text-base font-semibold text-foreground">{app.riskScore}/100</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-xs text-muted-foreground">Review Reason</Label>
                    <p className="text-sm text-foreground mt-1">{app.reason}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Reject
                    </Button>
                    <Button size="sm" className="flex-1">
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowPendingAppsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditRulesDialog} onOpenChange={setShowEditRulesDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Underwriting Rules - {selectedProductForRules?.name}</DialogTitle>
            <DialogDescription>Configure automated approval criteria for this insurance product</DialogDescription>
          </DialogHeader>
          {selectedProductForRules && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Maximum Coverage Amount</Label>
                  <Input type="number" defaultValue="25000" placeholder="Enter amount" />
                  <p className="text-xs text-muted-foreground">Maximum coverage that can be auto-approved</p>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Credit Score</Label>
                  <Input type="number" defaultValue="650" placeholder="Enter score" />
                  <p className="text-xs text-muted-foreground">Applicants below this score require manual review</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Age</Label>
                    <Input type="number" defaultValue="18" placeholder="Years" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Age</Label>
                    <Input type="number" defaultValue="65" placeholder="Years" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Risk Score Threshold</Label>
                  <Input type="number" defaultValue="75" placeholder="0-100" />
                  <p className="text-xs text-muted-foreground">Auto-reject applications above this risk score</p>
                </div>

                <div className="space-y-2">
                  <Label>Waiting Period (days)</Label>
                  <Input type="number" defaultValue="30" placeholder="Days" />
                  <p className="text-xs text-muted-foreground">Period before coverage becomes active after approval</p>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Claims History</Label>
                  <Input type="number" defaultValue="3" placeholder="Number of claims" />
                  <p className="text-xs text-muted-foreground">Maximum previous claims allowed in last 12 months</p>
                </div>

                <div className="space-y-2">
                  <Label>Exclusions</Label>
                  <Textarea
                    defaultValue="Pre-existing conditions, intentional damage, war or terrorism"
                    rows={3}
                    placeholder="List exclusions..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">National ID / Passport</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Proof of Address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Income Verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Medical Certificate</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setShowEditRulesDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowEditRulesDialog(false)}>Save Rules</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
