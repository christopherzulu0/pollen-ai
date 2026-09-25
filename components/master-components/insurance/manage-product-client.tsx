"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
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
  Loader2,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
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

interface ManageProductClientProps {
  productId: string
}

// Icon component mapping
const iconComponents: Record<string, any> = {
  Sprout,
  Heart,
  Skull,
  Users,
  Smartphone,
  Cloud,
  Shield,
}

export function ManageProductClient({ productId }: ManageProductClientProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    premiumAmount: "",
    coverageAmount: "",
    premiumFrequency: "monthly",
    status: "active",
    waitingPeriod: "0",
    coverageTerms: "",
    exclusions: "",
  })

  // Fetch product data
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-insurance-product", productId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/insurance/product/${productId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found")
        }
        throw new Error("Failed to fetch product")
      }
      return response.json()
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/admin/insurance/product/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update product")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-product", productId] })
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-products"] })
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      setIsEditing(false)
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      })
    },
  })

  // Update form data when product loads
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        premiumAmount: product.premiumAmount?.toString() || "",
        coverageAmount: product.coverageAmount?.toString() || "",
        premiumFrequency: product.frequency || "monthly",
        status: product.status || "active",
        waitingPeriod: product.waitingPeriod?.toString() || "0",
        coverageTerms: product.coverageTerms || "",
        exclusions: product.exclusions || "",
      })
    }
  }, [product])

  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="border border-border shadow-lg">
          <CardContent className="p-2">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm text-muted-foreground">
                {entry.name}: {entry.value}
              </p>
            ))}
          </CardContent>
        </Card>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="flex items-center gap-4">
          <Link href="/Super-user">
            <Button variant="secondary" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/Super-user">
            <Button variant="secondary" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Product Not Found</h1>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "The product you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    )
  }

  const Icon = iconComponents[product.icon] || Shield
  const claimsPaidNum = Number.parseFloat(product.claimsPaid.replace(/[ZMW,\s]/g, "")) || 0
  const premiumCollectedNum = Number.parseFloat(product.premiumCollected.replace(/[ZMW,\s]/g, "")) || 0
  const claimRatio = premiumCollectedNum > 0 ? ((claimsPaidNum / premiumCollectedNum) * 100).toFixed(1) : "0.0"

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/Super-user">
            <Button variant="secondary" size="icon">
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
                    <span className="text-sm font-semibold">ZMW {product.premiumAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Coverage Amount</span>
                    <span className="text-sm font-semibold">ZMW {product.coverageAmount.toLocaleString()}</span>
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
                    <span className="text-sm font-semibold">
                      {new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
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
                {product.recentActivity && product.recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {product.recentActivity.map((activity: any, index: number) => {
                      const IconComponent =
                        activity.icon === "CheckCircle"
                          ? CheckCircle
                          : activity.icon === "DollarSign"
                            ? DollarSign
                            : FileText
                      const colorClass =
                        activity.color === "green"
                          ? "bg-green-500/10 text-green-500"
                          : activity.color === "blue"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-yellow-500/10 text-yellow-500"
                      const timeAgo = new Date(activity.date)
                      const now = new Date()
                      const diffMs = now.getTime() - timeAgo.getTime()
                      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
                      const diffDays = Math.floor(diffHours / 24)
                      const timeAgoText =
                        diffHours < 1
                          ? "Just now"
                          : diffHours < 24
                            ? `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
                            : `${diffDays} day${diffDays > 1 ? "s" : ""} ago`

                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${colorClass}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{timeAgoText}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
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
                    {product.policyHolders && product.policyHolders.length > 0 ? (
                      product.policyHolders.map((holder: any) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No policy holders found
                        </TableCell>
                      </TableRow>
                    )}
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
                <Button
                  onClick={() => {
                    if (isEditing) {
                      updateMutation.mutate(formData)
                    } else {
                      setIsEditing(true)
                    }
                  }}
                  variant={isEditing ? "default" : "outline"}
                  disabled={updateMutation.isPending}
                >
                  {isEditing ? (
                    <>
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
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
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Premium Amount (ZMW)</Label>
                    <Input
                      type="number"
                      value={formData.premiumAmount}
                      onChange={(e) => setFormData({ ...formData, premiumAmount: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coverage Amount (ZMW)</Label>
                    <Input
                      type="number"
                      value={formData.coverageAmount}
                      onChange={(e) => setFormData({ ...formData, coverageAmount: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Payment Frequency</Label>
                    <Select
                      value={formData.premiumFrequency}
                      onValueChange={(value) => setFormData({ ...formData, premiumFrequency: value })}
                      disabled={!isEditing}
                    >
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
                    <Input
                      type="number"
                      value={formData.waitingPeriod}
                      onChange={(e) => setFormData({ ...formData, waitingPeriod: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Coverage Terms</Label>
                  <Textarea
                    placeholder="Define coverage terms and conditions..."
                    value={formData.coverageTerms}
                    onChange={(e) => setFormData({ ...formData, coverageTerms: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exclusions</Label>
                  <Textarea
                    placeholder="List any exclusions..."
                    value={formData.exclusions}
                    onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
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
                  <LineChart data={product.policyGrowthData || []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "hsl(var(--border))" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="month"
                      stroke={theme === "dark" ? "hsl(var(--muted-foreground))" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={theme === "dark" ? "hsl(var(--muted-foreground))" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="policies"
                      stroke={theme === "dark" ? "#8b5cf6" : "#6366f1"}
                      strokeWidth={2}
                      name="Policies"
                    />
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
                  <BarChart data={product.claimsData || []}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "hsl(var(--border))" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="month"
                      stroke={theme === "dark" ? "hsl(var(--muted-foreground))" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke={theme === "dark" ? "hsl(var(--muted-foreground))" : "#6b7280"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="claims"
                      fill={theme === "dark" ? "#8b5cf6" : "#6366f1"}
                      name="Claims Submitted"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="paid"
                      fill={theme === "dark" ? "#10b981" : "#059669"}
                      name="Claims Paid"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  )
}
