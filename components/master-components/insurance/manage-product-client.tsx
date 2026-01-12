"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Shield,
  Sprout,
  Heart,
  Skull,
  Users,
  Smartphone,
  Cloud,
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Mock product data
const mockProducts: Record<string, any> = {
  "1": {
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
    premiumAmount: 195,
    coverageAmount: 10000,
    frequency: "seasonal",
    waitingPeriod: 14,
  },
  "2": {
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
    premiumAmount: 126,
    coverageAmount: 7500,
    frequency: "monthly",
    waitingPeriod: 30,
  },
  "3": {
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
    premiumAmount: 263,
    coverageAmount: 15000,
    frequency: "monthly",
    waitingPeriod: 0,
  },
  "4": {
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
    premiumAmount: 261,
    coverageAmount: 16500,
    frequency: "monthly",
    waitingPeriod: 7,
  },
  "5": {
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
    premiumAmount: 61,
    coverageAmount: 1500,
    frequency: "monthly",
    waitingPeriod: 14,
  },
  "6": {
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
    premiumAmount: 381,
    coverageAmount: 18000,
    frequency: "seasonal",
    waitingPeriod: 0,
  },
}

// Mock policy holders
const mockPolicyHolders = [
  {
    id: "P-001",
    name: "John Farmer",
    dateJoined: "2023-06-15",
    premium: "$195",
    coverage: "$10,000",
    status: "active",
  },
  {
    id: "P-002",
    name: "Mary Fields",
    dateJoined: "2023-07-22",
    premium: "$195",
    coverage: "$10,000",
    status: "active",
  },
  { id: "P-003", name: "Bob Green", dateJoined: "2023-08-10", premium: "$195", coverage: "$10,000", status: "active" },
  {
    id: "P-004",
    name: "Alice Harvest",
    dateJoined: "2023-09-05",
    premium: "$195",
    coverage: "$10,000",
    status: "pending",
  },
  { id: "P-005", name: "David Crop", dateJoined: "2023-10-12", premium: "$195", coverage: "$10,000", status: "active" },
]

// Mock analytics data
const policyGrowthData = [
  { month: "Jul", policies: 120 },
  { month: "Aug", policies: 145 },
  { month: "Sep", policies: 178 },
  { month: "Oct", policies: 195 },
  { month: "Nov", policies: 212 },
  { month: "Dec", policies: 234 },
]

const claimsData = [
  { month: "Jul", claims: 2, paid: 1 },
  { month: "Aug", claims: 3, paid: 2 },
  { month: "Sep", claims: 1, paid: 1 },
  { month: "Oct", claims: 4, paid: 3 },
  { month: "Nov", claims: 0, paid: 0 },
  { month: "Dec", claims: 2, paid: 2 },
]

interface ManageProductClientProps {
  productId: string
}

export function ManageProductClient({ productId }: ManageProductClientProps) {
  const product = mockProducts[productId]
  const [isEditing, setIsEditing] = useState(false)

  if (!product) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Product Not Found</h1>
        </div>
      </div>
    )
  }

  const Icon = product.icon
  const claimRatio = (
    (Number.parseFloat(product.claimsPaid.replace(/[$,]/g, "")) /
      Number.parseFloat(product.premiumCollected.replace(/[$,]/g, ""))) *
    100
  ).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
        <Badge variant={product.status === "active" ? "default" : "secondary"} className="text-sm">
          {product.status}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{product.activePolicies}</div>
            <p className="text-xs text-green-500">+12 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{product.totalCoverage}</div>
            <p className="text-xs text-muted-foreground">Total insured amount</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premiums Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{product.premiumCollected}</div>
            <p className="text-xs text-green-500">+8.3% from last period</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Ratio</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{claimRatio}%</div>
            <p className="text-xs text-muted-foreground">
              {product.claims} claims / {product.claimsPaid} paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policy Holders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Key details about this insurance product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Product Type</span>
                    <Badge variant="outline">{product.type}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Premium Amount</span>
                    <span className="text-sm font-semibold">${product.premiumAmount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Coverage Amount</span>
                    <span className="text-sm font-semibold">${product.coverageAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Payment Frequency</span>
                    <Badge variant="secondary">{product.frequency}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Waiting Period</span>
                    <span className="text-sm font-semibold">{product.waitingPeriod} days</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Active Since</span>
                    <span className="text-sm font-semibold">Jan 2023</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">New policy issued</p>
                      <p className="text-xs text-muted-foreground">John Farmer enrolled in Crop Insurance</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Premium collected</p>
                      <p className="text-xs text-muted-foreground">$195 from Mary Fields</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-yellow-500/10">
                      <FileText className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Claim submitted</p>
                      <p className="text-xs text-muted-foreground">Bob Green filed for drought damage</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Claim approved</p>
                      <p className="text-xs text-muted-foreground">$12,000 payout to Alice Harvest</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policy Holders Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Policy Holders</CardTitle>
              <CardDescription>Members enrolled in this insurance product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Coverage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPolicyHolders.map((holder) => (
                      <TableRow key={holder.id}>
                        <TableCell className="font-mono text-xs">{holder.id}</TableCell>
                        <TableCell className="font-medium">{holder.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{holder.dateJoined}</TableCell>
                        <TableCell className="text-sm">{holder.premium}</TableCell>
                        <TableCell className="text-sm font-semibold">{holder.coverage}</TableCell>
                        <TableCell>
                          <Badge variant={holder.status === "active" ? "default" : "secondary"} className="text-xs">
                            {holder.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product Settings</CardTitle>
                  <CardDescription>Configure insurance product parameters</CardDescription>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "default" : "outline"}>
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    "Edit Settings"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input defaultValue={product.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select defaultValue={product.status} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea defaultValue={product.description} disabled={!isEditing} rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Premium Amount ($)</Label>
                    <Input type="number" defaultValue={product.premiumAmount} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label>Coverage Amount ($)</Label>
                    <Input type="number" defaultValue={product.coverageAmount} disabled={!isEditing} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Payment Frequency</Label>
                    <Select defaultValue={product.frequency} disabled={!isEditing}>
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
                    <Input type="number" defaultValue={product.waitingPeriod} disabled={!isEditing} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Coverage Terms</Label>
                  <Textarea placeholder="Define coverage terms and conditions..." disabled={!isEditing} rows={4} />
                </div>

                <div className="space-y-2">
                  <Label>Exclusions</Label>
                  <Textarea placeholder="List any exclusions..." disabled={!isEditing} rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Policy Growth Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Policy Growth</CardTitle>
                <CardDescription>Number of active policies over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={policyGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="policies" stroke="#8b5cf6" strokeWidth={2} name="Policies" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Claims Activity Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Claims Activity</CardTitle>
                <CardDescription>Claims submitted vs paid out</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={claimsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Legend />
                    <Bar dataKey="claims" fill="#8b5cf6" name="Claims Submitted" />
                    <Bar dataKey="paid" fill="#10b981" name="Claims Paid" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Claim Reasons */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top Claim Reasons</CardTitle>
              <CardDescription>Most common reasons for claims</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Drought Damage</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pest Infestation</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Flooding</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Hail Damage</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
