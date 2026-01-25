"use client"

import { useState, type ComponentType } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
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
  Loader2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions
type InsuranceProduct = {
  id: string
  name: string
  type: string
  icon: string
  activePolicies: number
  totalCoverage: string
  premiumCollected: string
  claims: number
  claimsPaid: string
  status: string
  description: string
  // Raw values for editing
  coverageAmount?: number
  premiumAmount?: number
  premiumFrequency?: string
  waitingPeriod?: string
  coverageTerms?: string
  exclusions?: string
}

type InsuranceClaim = {
  id: string
  policyHolder: string
  insuranceType: string
  claimAmount: string
  status: string
  dateSubmitted: string
  description: string
  claimId?: string
  documents?: string[]
  evidenceUrls?: string[]
  claimNumber?: string
  claimType?: string
  incidentDate?: string
  rejectionReason?: string | null
  approvedAmount?: string | null
}

// Icon component mapping
const iconComponents: Record<string, ComponentType<{ className?: string }>> = {
  Sprout,
  Heart,
  Skull,
  Users,
  Smartphone,
  Cloud,
  Shield,
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

export function InsuranceView() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [showNewProductDialog, setShowNewProductDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [approvedAmount, setApprovedAmount] = useState("")
  const [claimsPage, setClaimsPage] = useState(1)
  const [claimsPerPage, setClaimsPerPage] = useState(10)
  const [showPendingAppsDialog, setShowPendingAppsDialog] = useState(false)
  const [showEditRulesDialog, setShowEditRulesDialog] = useState(false)
  const [selectedProductForRules, setSelectedProductForRules] = useState<InsuranceProduct | null>(null)
  const [claimsStatusFilter, setClaimsStatusFilter] = useState("all")
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<InsuranceProduct | null>(null)
  const [showEditProductDialog, setShowEditProductDialog] = useState(false)
  const [showProductDetailsDialog, setShowProductDetailsDialog] = useState(false)
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<InsuranceProduct | null>(null)
  const [showNewPolicyDialog, setShowNewPolicyDialog] = useState(false)
  const [policiesPage, setPoliciesPage] = useState(1)
  const [policiesPerPage, setPoliciesPerPage] = useState(10)
  const [policiesStatusFilter, setPoliciesStatusFilter] = useState("all")
  const [policiesSearchQuery, setPoliciesSearchQuery] = useState("")

  // Form state for new product
  const [newProductForm, setNewProductForm] = useState({
    productType: "",
    name: "",
    description: "",
    premiumAmount: "",
    coverageAmount: "",
    premiumFrequency: "monthly",
    waitingPeriod: "30",
    coverageTerms: "",
    exclusions: "",
  })

  // Form state for new policy
  const [newPolicyForm, setNewPolicyForm] = useState({
    productId: "",
    userId: "",
    groupId: "",
    coverageAmount: "",
    startDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch insurance products
  const {
    data: insuranceProducts = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery<InsuranceProduct[]>({
    queryKey: ["admin-insurance-products"],
    queryFn: async () => {
      const response = await fetch("/api/admin/insurance?type=products")
      if (!response.ok) {
        throw new Error("Failed to fetch insurance products")
      }
      return response.json()
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  // Fetch claims
  const {
    data: recentClaims = [],
    isLoading: claimsLoading,
    error: claimsError,
  } = useQuery<InsuranceClaim[]>({
    queryKey: ["admin-insurance-claims", claimsStatusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append("type", "claims")
      if (claimsStatusFilter !== "all") params.append("status", claimsStatusFilter)
      if (searchQuery) params.append("search", searchQuery)

      const response = await fetch(`/api/admin/insurance?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch claims")
      }
      return response.json()
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  // Fetch policies
  type Policy = {
    id: string
    policyNumber: string
    productName: string
    productType: string
    userName: string
    userEmail: string
    groupName: string | null
    coverageAmount: string
    premiumAmount: string
    premiumFrequency: string
    startDate: string
    endDate: string
    status: string
    paymentStatus: string
    nextPremiumDue: string | null
    createdAt: string
  }

  const {
    data: policies = [],
    isLoading: policiesLoading,
    error: policiesError,
  } = useQuery<Policy[]>({
    queryKey: ["admin-insurance-policies", policiesStatusFilter, policiesSearchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (policiesStatusFilter !== "all") params.append("status", policiesStatusFilter)
      if (policiesSearchQuery) params.append("search", policiesSearchQuery)

      const response = await fetch(`/api/admin/insurance/policies?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch policies")
      }
      return response.json()
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  // Fetch users for policy creation
  const { 
    data: users = [], 
    isLoading: usersLoading,
    error: usersError 
  } = useQuery<Array<{ id: string; name: string | null; email: string }>>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users")
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to fetch users" }))
        throw new Error(error.error || "Failed to fetch users")
      }
      const data = await response.json()
      // API returns { users: [...], stats: {...} }
      const usersArray = Array.isArray(data) ? data : (data.users || [])
      return usersArray.map((u: any) => ({ 
        id: u.id, 
        name: u.name || null, 
        email: u.email || "Unknown" 
      }))
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  })

  // Fetch groups for policy creation
  const { data: groups = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["admin-groups"],
    queryFn: async () => {
      const response = await fetch("/api/admin/groups")
      if (!response.ok) {
        throw new Error("Failed to fetch groups")
      }
      const data = await response.json()
      return data.map((g: any) => ({ id: g.id, name: g.name }))
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  })

  // Mutation for updating an insurance product
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof newProductForm> }) => {
      const response = await fetch(`/api/admin/insurance/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          productType: data.productType,
          description: data.description,
          coverageAmount: data.coverageAmount,
          premiumAmount: data.premiumAmount,
          premiumFrequency: data.premiumFrequency?.toUpperCase(),
          claimProcessingTime: data.waitingPeriod ? `${data.waitingPeriod} days` : undefined,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update product")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-products"] })
      toast({
        title: "Success",
        description: "Insurance product updated successfully",
      })
      setShowEditProductDialog(false)
      setSelectedProductForEdit(null)
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update insurance product",
        variant: "destructive",
      })
    },
  })

  // Mutation for approving/rejecting claims
  const updateClaimMutation = useMutation({
    mutationFn: async ({ claimId, action, approvedAmount, rejectionReason, internalNotes }: {
      claimId: string
      action: "approve" | "reject"
      approvedAmount?: string
      rejectionReason?: string
      internalNotes?: string
    }) => {
      const response = await fetch(`/api/admin/insurance/claims/${claimId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          approvedAmount,
          rejectionReason,
          internalNotes,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${action} claim`)
      }
      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-claims"] })
      toast({
        title: "Success",
        description: `Claim ${variables.action}d successfully`,
      })
      setShowClaimDialog(false)
      setShowRejectDialog(false)
      setAdminNotes("")
      setRejectionReason("")
      setApprovedAmount("")
      setSelectedClaim(null)
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update claim",
        variant: "destructive",
      })
    },
  })

  // Mutation for deactivating an insurance product
  const deactivateProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/insurance/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "inactive",
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to deactivate product")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-products"] })
      toast({
        title: "Success",
        description: "Insurance product deactivated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate insurance product",
        variant: "destructive",
      })
    },
  })

  // Mutation for creating a new insurance product
  const createProductMutation = useMutation({
    mutationFn: async (data: typeof newProductForm) => {
      const response = await fetch("/api/admin/insurance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          productType: data.productType,
          description: data.description,
          coverageAmount: data.coverageAmount,
          premiumAmount: data.premiumAmount,
          premiumFrequency: data.premiumFrequency.toUpperCase(),
          claimProcessingTime: data.waitingPeriod ? `${data.waitingPeriod} days` : undefined,
          coverageTerms: data.coverageTerms || undefined,
          exclusions: data.exclusions || undefined,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create product")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-products"] })
      toast({
        title: "Success",
        description: "Insurance product created successfully",
      })
      setShowNewProductDialog(false)
      setNewProductForm({
        productType: "",
        name: "",
        description: "",
        premiumAmount: "",
        coverageAmount: "",
        premiumFrequency: "monthly",
        waitingPeriod: "30",
        coverageTerms: "",
        exclusions: "",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create insurance product",
        variant: "destructive",
      })
    },
  })

  // Mutation for creating a new policy
  const createPolicyMutation = useMutation({
    mutationFn: async (data: typeof newPolicyForm) => {
      const response = await fetch("/api/admin/insurance/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: data.productId,
          userId: data.userId,
          groupId: data.groupId || undefined,
          coverageAmount: data.coverageAmount,
          startDate: data.startDate,
          notes: data.notes || undefined,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create policy")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-policies"] })
      toast({
        title: "Success",
        description: "Insurance policy created successfully",
      })
      setShowNewPolicyDialog(false)
      setNewPolicyForm({
        productId: "",
        userId: "",
        groupId: "",
        coverageAmount: "",
        startDate: new Date().toISOString().split("T")[0],
        notes: "",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create insurance policy",
        variant: "destructive",
      })
    },
  })

  // Calculate pagination for claims
  const totalClaims = recentClaims.length
  const totalClaimsPages = Math.ceil(totalClaims / claimsPerPage)
  const startClaimsIndex = (claimsPage - 1) * claimsPerPage
  const endClaimsIndex = startClaimsIndex + claimsPerPage
  const paginatedClaims = recentClaims.slice(startClaimsIndex, endClaimsIndex)

  // Calculate pagination for policies
  const totalPolicies = policies.length
  const totalPoliciesPages = Math.ceil(totalPolicies / policiesPerPage)
  const startPoliciesIndex = (policiesPage - 1) * policiesPerPage
  const endPoliciesIndex = startPoliciesIndex + policiesPerPage
  const paginatedPolicies = policies.slice(startPoliciesIndex, endPoliciesIndex)

  const handleCreateProduct = () => {
    if (!newProductForm.name || !newProductForm.productType || !newProductForm.coverageAmount || !newProductForm.premiumAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    createProductMutation.mutate(newProductForm)
  }

  const handleCreatePolicy = () => {
    if (!newPolicyForm.productId || !newPolicyForm.userId || !newPolicyForm.coverageAmount || !newPolicyForm.startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Product, User, Coverage Amount, Start Date)",
        variant: "destructive",
      })
      return
    }
    createPolicyMutation.mutate(newPolicyForm)
  }

  const handleEditProduct = (product: InsuranceProduct) => {
    // Map product data to form format
    const productTypeMap: Record<string, string> = {
      crop: "crop",
      health: "health",
      loan_protection: "loan",
      savings_fraud: "fraud",
      mobile: "mobile",
      weather: "weather",
    }

    const reverseFrequencyMap: Record<string, string> = {
      MONTHLY: "monthly",
      QUARTERLY: "quarterly",
      SEASONAL: "seasonal",
      ANNUAL: "annual",
    }

    // Extract numeric values - use raw values if available, otherwise parse formatted strings
    let coverageAmountValue = ""
    let premiumAmountValue = ""

    if (product.coverageAmount !== undefined && product.coverageAmount !== null) {
      // Use raw value from API
      coverageAmountValue = product.coverageAmount.toString()
    } else {
      // Fallback to parsing formatted string
      const coverageMatch = product.totalCoverage.match(/([\d.]+)/)
      if (coverageMatch) {
        const num = parseFloat(coverageMatch[1])
        // Convert M to actual number (e.g., "1.5M" -> 1500000)
        coverageAmountValue = product.totalCoverage.includes("M") 
          ? (num * 1000000).toString() 
          : (product.totalCoverage.includes("K") ? (num * 1000).toString() : num.toString())
      }
    }

    if (product.premiumAmount !== undefined && product.premiumAmount !== null) {
      // Use raw value from API
      premiumAmountValue = product.premiumAmount.toString()
    } else {
      // Fallback to parsing formatted string
      premiumAmountValue = product.premiumCollected.replace(/[ZMW\s,]/g, "") || ""
    }

    // Map premium frequency - use value from API if available
    let premiumFreq = product.premiumFrequency || "monthly"
    // Convert to lowercase if needed
    if (premiumFreq && premiumFreq !== premiumFreq.toLowerCase()) {
      premiumFreq = reverseFrequencyMap[premiumFreq.toUpperCase()] || premiumFreq.toLowerCase()
    }

    setNewProductForm({
      productType: productTypeMap[product.type] || product.type,
      name: product.name,
      description: product.description || "",
      premiumAmount: premiumAmountValue,
      coverageAmount: coverageAmountValue,
      premiumFrequency: premiumFreq,
      waitingPeriod: product.waitingPeriod || "30",
      coverageTerms: product.coverageTerms || "",
      exclusions: product.exclusions || "",
    })
    setSelectedProductForEdit(product)
    setShowEditProductDialog(true)
  }

  const handleUpdateProduct = () => {
    if (!selectedProductForEdit || !newProductForm.name || !newProductForm.productType || !newProductForm.coverageAmount || !newProductForm.premiumAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    updateProductMutation.mutate({ id: selectedProductForEdit.id, data: newProductForm })
  }

  const handleViewDetails = (product: InsuranceProduct) => {
    setSelectedProductForDetails(product)
    setShowProductDetailsDialog(true)
  }

  const handleViewPolicies = (product: InsuranceProduct) => {
    router.push(`/Super-user/insurance/product/${product.id}?tab=policies`)
  }

  const handleDeactivateProduct = (product: InsuranceProduct) => {
    if (confirm(`Are you sure you want to deactivate "${product.name}"? This will prevent new policies from being created.`)) {
      deactivateProductMutation.mutate(product.id)
    }
  }

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

  // Calculate total stats
  const totalStats = {
    totalPolicies: insuranceProducts.reduce((acc, p) => acc + p.activePolicies, 0),
    totalCoverage: formatCurrencyCompact(
      insuranceProducts.reduce((acc, p) => {
        const coverage = parseFloat(p.totalCoverage.replace(/[ZMW\s,]/g, "")) * (p.totalCoverage.includes("M") ? 1000000 : 1000)
        return acc + coverage
      }, 0)
    ),
    totalPremiums: formatCurrency(
      insuranceProducts.reduce((acc, p) => {
        return acc + parseFloat(p.premiumCollected.replace(/[ZMW\s,]/g, ""))
      }, 0)
    ),
    totalClaims: insuranceProducts.reduce((acc, p) => acc + p.claims, 0),
    claimsPaid: formatCurrency(
      insuranceProducts.reduce((acc, p) => {
        return acc + parseFloat(p.claimsPaid.replace(/[ZMW\s,]/g, ""))
      }, 0)
    ),
    claimRatio: "134.5%", // Would need to calculate from actual data
  }

  if (productsLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <Skeleton className="h-3 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
            <p className="text-sm text-destructive">Failed to load insurance data</p>
            <p className="text-xs text-muted-foreground">
              {productsError instanceof Error ? productsError.message : "An error occurred"}
            </p>
          </div>
        </div>
      </div>
    )
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="products">Insurance Products</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
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
                    <Label>Product Type <span className="text-destructive">*</span></Label>
                    <Select
                      value={newProductForm.productType}
                      onValueChange={(value) =>
                        setNewProductForm({ ...newProductForm, productType: value })
                      }
                    >
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
                    <Label>Product Name <span className="text-destructive">*</span></Label>
                    <Input
                      placeholder="e.g., Premium Crop Shield"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the insurance coverage..."
                      rows={3}
                      value={newProductForm.description}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Premium Amount (ZMW) <span className="text-destructive">*</span></Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newProductForm.premiumAmount}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, premiumAmount: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Coverage Amount (ZMW) <span className="text-destructive">*</span></Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newProductForm.coverageAmount}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, coverageAmount: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Premium Frequency</Label>
                      <Select
                        value={newProductForm.premiumFrequency}
                        onValueChange={(value) =>
                          setNewProductForm({ ...newProductForm, premiumFrequency: value })
                        }
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
                        placeholder="30"
                        value={newProductForm.waitingPeriod}
                        onChange={(e) =>
                          setNewProductForm({ ...newProductForm, waitingPeriod: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Coverage Terms</Label>
                    <Textarea
                      placeholder="Define coverage terms and conditions..."
                      rows={4}
                      value={newProductForm.coverageTerms}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, coverageTerms: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Exclusions</Label>
                    <Textarea
                      placeholder="List any exclusions..."
                      rows={3}
                      value={newProductForm.exclusions}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, exclusions: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewProductDialog(false)
                      setNewProductForm({
                        productType: "",
                        name: "",
                        description: "",
                        premiumAmount: "",
                        coverageAmount: "",
                        premiumFrequency: "monthly",
                        waitingPeriod: "30",
                        coverageTerms: "",
                        exclusions: "",
                      })
                    }}
                    disabled={createProductMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProduct} disabled={createProductMutation.isPending}>
                    {createProductMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Insurance Products Tab */}
        <TabsContent value="products" className="space-y-4">
          {insuranceProducts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No Insurance Products</CardTitle>
                <CardDescription className="text-center mb-6 max-w-md">
                  Get started by creating your first insurance product. You can configure coverage, premiums, and terms for different types of insurance.
                </CardDescription>
                <Button onClick={() => setShowNewProductDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {insuranceProducts.map((product) => {
              const Icon = iconComponents[product.icon] || Shield
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
                          <DropdownMenuItem onClick={() => handleViewDetails(product)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProduct(product)}>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewPolicies(product)}>View Policies</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeactivateProduct(product)}
                            disabled={deactivateProductMutation.isPending}
                          >
                            {deactivateProductMutation.isPending ? "Deactivating..." : "Deactivate"}
                          </DropdownMenuItem>
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
                              router.push(`/Super-user/insurance/product/${product.id}`)
                      }}
                    >
                      Manage Product
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
            </div>
          )}
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Insurance Policies</CardTitle>
                  <CardDescription>Manage all insurance policies in the system</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Dialog open={showNewPolicyDialog} onOpenChange={setShowNewPolicyDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 sm:flex-none">
                        <Plus className="h-4 w-4 mr-2" />
                        New Policy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Insurance Policy</DialogTitle>
                        <DialogDescription>Create a new insurance policy for a user</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Insurance Product <span className="text-destructive">*</span></Label>
                          <Select
                            value={newPolicyForm.productId}
                            onValueChange={(value) =>
                              setNewPolicyForm({ ...newPolicyForm, productId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select insurance product" />
                            </SelectTrigger>
                            <SelectContent>
                              {insuranceProducts
                                .filter((p) => p.status === "active")
                                .map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>User <span className="text-destructive">*</span></Label>
                          <Select
                            value={newPolicyForm.userId}
                            onValueChange={(value) =>
                              setNewPolicyForm({ ...newPolicyForm, userId: value })
                            }
                            disabled={usersLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={usersLoading ? "Loading users..." : "Select user"} />
                            </SelectTrigger>
                            <SelectContent>
                              {usersError ? (
                                <div className="p-2 text-sm text-destructive">
                                  Failed to load users. Please try again.
                                </div>
                              ) : users.length === 0 && !usersLoading ? (
                                <div className="p-2 text-sm text-muted-foreground">
                                  No users found.
                                </div>
                              ) : (
                                users.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.name || user.email}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {usersError && (
                            <p className="text-xs text-destructive mt-1">
                              Error loading users. Please refresh the page.
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Group (Optional)</Label>
                          <Select
                            value={newPolicyForm.groupId || "none"}
                            onValueChange={(value) =>
                              setNewPolicyForm({ ...newPolicyForm, groupId: value === "none" ? "" : value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select group (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {groups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Coverage Amount (ZMW) <span className="text-destructive">*</span></Label>
                          <Input
                            type="number"
                            placeholder="e.g., 50000"
                            value={newPolicyForm.coverageAmount}
                            onChange={(e) =>
                              setNewPolicyForm({ ...newPolicyForm, coverageAmount: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Start Date <span className="text-destructive">*</span></Label>
                          <Input
                            type="date"
                            value={newPolicyForm.startDate}
                            onChange={(e) =>
                              setNewPolicyForm({ ...newPolicyForm, startDate: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Notes (Optional)</Label>
                          <Textarea
                            placeholder="Additional notes about this policy..."
                            rows={3}
                            value={newPolicyForm.notes}
                            onChange={(e) =>
                              setNewPolicyForm({ ...newPolicyForm, notes: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowNewPolicyDialog(false)
                            setNewPolicyForm({
                              productId: "",
                              userId: "",
                              groupId: "",
                              coverageAmount: "",
                              startDate: new Date().toISOString().split("T")[0],
                              notes: "",
                            })
                          }}
                          disabled={createPolicyMutation.isPending}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleCreatePolicy} disabled={createPolicyMutation.isPending}>
                          {createPolicyMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Policy"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search policies by number, user name, or email..."
                      value={policiesSearchQuery}
                      onChange={(e) => {
                        setPoliciesSearchQuery(e.target.value)
                        setPoliciesPage(1)
                      }}
                      className="pl-9 w-full"
                    />
                  </div>
                  <Select value={policiesStatusFilter} onValueChange={setPoliciesStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {policiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : policiesError ? (
                  <div className="text-center py-12 text-destructive">
                    Failed to load policies. Please try again.
                  </div>
                ) : paginatedPolicies.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No policies found. Create your first policy to get started.
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Policy Number</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Group</TableHead>
                            <TableHead>Coverage</TableHead>
                            <TableHead>Premium</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPolicies.map((policy) => (
                            <TableRow key={policy.id}>
                              <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{policy.productName}</span>
                                  <span className="text-xs text-muted-foreground">{policy.productType}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{policy.userName}</span>
                                  <span className="text-xs text-muted-foreground">{policy.userEmail}</span>
                                </div>
                              </TableCell>
                              <TableCell>{policy.groupName || "-"}</TableCell>
                              <TableCell>{policy.coverageAmount}</TableCell>
                              <TableCell>{policy.premiumAmount}</TableCell>
                              <TableCell>{policy.startDate}</TableCell>
                              <TableCell>{policy.endDate}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    policy.status === "active"
                                      ? "default"
                                      : policy.status === "expired"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {policy.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    policy.paymentStatus === "paid"
                                      ? "default"
                                      : policy.paymentStatus === "pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {policy.paymentStatus}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {startPoliciesIndex + 1} to {Math.min(endPoliciesIndex, totalPolicies)} of {totalPolicies} policies
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={policiesPerPage.toString()}
                          onValueChange={(value) => {
                            setPoliciesPerPage(Number(value))
                            setPoliciesPage(1)
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPoliciesPage((p) => Math.max(1, p - 1))}
                            disabled={policiesPage === 1}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {policiesPage} of {totalPoliciesPages || 1}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPoliciesPage((p) => Math.min(totalPoliciesPages, p + 1))}
                            disabled={policiesPage >= totalPoliciesPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
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
                  <Select value={claimsStatusFilter} onValueChange={setClaimsStatusFilter}>
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
              {claimsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : claimsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                  <p className="text-sm text-destructive">Failed to load claims</p>
                </div>
              ) : (
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
                      {paginatedClaims.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No claims found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedClaims.map((claim) => (
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
                              setAdminNotes("")
                              setRejectionReason("")
                              setApprovedAmount("")
                              setShowClaimDialog(true)
                            }}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

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
          {insuranceProducts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No Analytics Available</CardTitle>
                <CardDescription className="text-center mb-6 max-w-md">
                  Analytics will be available once you create insurance products and start collecting data on policies, premiums, and claims.
                </CardDescription>
                <Button onClick={() => setShowNewProductDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insuranceProducts.map((product) => {
              const Icon = iconComponents[product.icon] || Shield
              const claimsPaidNum = parseFloat(product.claimsPaid.replace(/[ZMW\s,]/g, ""))
              const premiumCollectedNum = parseFloat(product.premiumCollected.replace(/[ZMW\s,]/g, ""))
              const claimRatio = premiumCollectedNum > 0 ? (claimsPaidNum / premiumCollectedNum) * 100 : 0

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
          )}
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
                {insuranceProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">No products available to configure rules</p>
                    <Button size="sm" onClick={() => setShowNewProductDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insuranceProducts.slice(0, 4).map((product) => {
                    const Icon = iconComponents[product.icon] || Shield
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
                )}
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
              {insuranceProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">No fraud alerts available</p>
                  <p className="text-xs text-muted-foreground">Alerts will appear here once you have active policies and claims</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-muted">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">No active fraud alerts</p>
                        <p className="text-sm text-muted-foreground">All systems are operating normally</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          {insuranceProducts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <DollarSign className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No Reconciliation Data</CardTitle>
                <CardDescription className="text-center mb-6 max-w-md">
                  Financial reconciliation data will be available once you have active insurance products with premiums and claims.
                </CardDescription>
                <Button onClick={() => setShowNewProductDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Premiums Due</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">ZMW 87,340</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Premiums Collected</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">ZMW 82,140</div>
                    <p className="text-xs text-green-500">94.0% collection rate</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">ZMW 5,200</div>
                    <p className="text-xs text-yellow-500">127 overdue accounts</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Claims Reserves</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">ZMW 1.2M</div>
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
                        <p className="font-semibold">ZMW 91,200</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Claims Paid</p>
                        <p className="font-semibold">ZMW 67,400</p>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-500 mt-2">Discrepancy: ZMW 234 - Requires review</p>
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
                        <span className="font-semibold">ZMW 5M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Premium Ceded</span>
                        <span className="font-semibold">ZMW 45,600/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Retention</span>
                        <span className="font-semibold">ZMW 500K</span>
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
                        <span className="font-semibold">ZMW 3M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Premium Ceded</span>
                        <span className="font-semibold">ZMW 32,400/year</span>
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
            </>
          )}
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          {insuranceProducts.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No Compliance Data</CardTitle>
                <CardDescription className="text-center mb-6 max-w-md">
                  Compliance reports and monitoring will be available once you have active insurance products and operations.
                </CardDescription>
                <Button onClick={() => setShowNewProductDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
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
            </>
          )}
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
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === "development" && (
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                  <p>Documents: {JSON.stringify(selectedClaim.documents)}</p>
                  <p>Evidence URLs: {JSON.stringify(selectedClaim.evidenceUrls)}</p>
                </div>
              )}
              
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
                  {(() => {
                    // Combine both documents and evidenceUrls arrays
                    const allDocuments = [
                      ...(selectedClaim.documents || []),
                      ...(selectedClaim.evidenceUrls || [])
                    ]
                    
                    if (allDocuments.length === 0) {
                      return (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No documents uploaded for this claim
                        </div>
                      )
                    }
                    
                    return (
                      <div className="space-y-2">
                        {allDocuments.map((docUrl, index) => {
                          if (!docUrl || docUrl.trim() === "") return null
                          
                          const fileName = docUrl.split("/").pop() || `document-${index + 1}`
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)
                          const isPdf = /\.pdf$/i.test(fileName)
                          
                          return (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {isImage ? (
                                  <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                ) : isPdf ? (
                                  <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                )}
                                <span className="text-sm truncate" title={fileName}>{fileName}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(docUrl, "_blank")}
                              >
                                View
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              {selectedClaim.status === "pending" && (
                <div className="space-y-2">
                  <Label>Approved Amount (Optional)</Label>
                  <Input
                    type="number"
                    placeholder={selectedClaim.claimAmount?.replace(/[ZMW\s,]/g, "") || ""}
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to approve the full claim amount: {selectedClaim.claimAmount}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea 
                  placeholder="Add notes about this claim..." 
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {selectedClaim.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-transparent" 
                    variant="outline" 
                    onClick={() => setShowRejectDialog(true)}
                    disabled={updateClaimMutation.isPending}
                  >
                    Reject Claim
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      const amount = approvedAmount || selectedClaim.claimAmount?.replace(/[ZMW\s,]/g, "") || ""
                      updateClaimMutation.mutate({
                        claimId: selectedClaim.claimId,
                        action: "approve",
                        approvedAmount: amount,
                        internalNotes: adminNotes || undefined,
                      })
                    }}
                    disabled={updateClaimMutation.isPending}
                  >
                    {updateClaimMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Approve & Process"
                    )}
                  </Button>
                </div>
              )}

              {selectedClaim.status === "approved" && (
                <div className="space-y-2 pt-2">
                  <Label className="text-muted-foreground">Approved Amount</Label>
                  <p className="text-lg font-semibold text-green-500">
                    {selectedClaim.claimAmount}
                  </p>
                </div>
              )}

              {selectedClaim.status === "rejected" && selectedClaim.rejectionReason && (
                <div className="space-y-2 pt-2">
                  <Label className="text-muted-foreground">Rejection Reason</Label>
                  <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                    {selectedClaim.rejectionReason}
                  </p>
                </div>
              )}

              {selectedClaim.status !== "pending" && (
                <div className="flex justify-end">
                  <Button onClick={() => {
                    setShowClaimDialog(false)
                    setAdminNotes("")
                    setSelectedClaim(null)
                  }}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Claim Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Claim</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this claim. This will be visible to the policyholder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason *</Label>
              <Textarea
                placeholder="Enter the reason for rejection..."
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason("")
                }}
                disabled={updateClaimMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => {
                  if (!rejectionReason.trim()) {
                    toast({
                      title: "Validation Error",
                      description: "Please provide a rejection reason",
                      variant: "destructive",
                    })
                    return
                  }
                  updateClaimMutation.mutate({
                    claimId: selectedClaim?.claimId,
                    action: "reject",
                    rejectionReason: rejectionReason,
                    internalNotes: adminNotes || undefined,
                  })
                }}
                disabled={updateClaimMutation.isPending || !rejectionReason.trim()}
              >
                {updateClaimMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Confirm Rejection"
                )}
              </Button>
            </div>
          </div>
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

      {/* Edit Product Dialog */}
      <Dialog open={showEditProductDialog} onOpenChange={setShowEditProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Insurance Product</DialogTitle>
            <DialogDescription>Update the insurance product configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product Type <span className="text-destructive">*</span></Label>
              <Select
                value={newProductForm.productType}
                onValueChange={(value) =>
                  setNewProductForm({ ...newProductForm, productType: value })
                }
              >
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
              <Label>Product Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g., Premium Crop Shield"
                value={newProductForm.name}
                onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the insurance coverage..."
                rows={3}
                value={newProductForm.description}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Premium Amount (ZMW) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newProductForm.premiumAmount}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, premiumAmount: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage Amount (ZMW) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newProductForm.coverageAmount}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, coverageAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Premium Frequency</Label>
                <Select
                  value={newProductForm.premiumFrequency}
                  onValueChange={(value) =>
                    setNewProductForm({ ...newProductForm, premiumFrequency: value })
                  }
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
                  placeholder="30"
                  value={newProductForm.waitingPeriod}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, waitingPeriod: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Coverage Terms</Label>
              <Textarea
                placeholder="Define coverage terms and conditions..."
                rows={4}
                value={newProductForm.coverageTerms}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, coverageTerms: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Exclusions</Label>
              <Textarea
                placeholder="List any exclusions..."
                rows={3}
                value={newProductForm.exclusions}
                onChange={(e) =>
                  setNewProductForm({ ...newProductForm, exclusions: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditProductDialog(false)
                setSelectedProductForEdit(null)
              }}
              disabled={updateProductMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Details Dialog */}
      <Dialog open={showProductDetailsDialog} onOpenChange={setShowProductDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProductForDetails?.name}</DialogTitle>
            <DialogDescription>Detailed information about this insurance product</DialogDescription>
          </DialogHeader>
          {selectedProductForDetails && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Product Type</Label>
                      <p className="text-sm font-medium">{selectedProductForDetails.type}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Badge variant={selectedProductForDetails.status === "active" ? "default" : "secondary"}>
                        {selectedProductForDetails.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Description</Label>
                      <p className="text-sm">{selectedProductForDetails.description || "No description provided"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Active Policies</Label>
                      <p className="text-lg font-semibold">{selectedProductForDetails.activePolicies}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Total Coverage</Label>
                      <p className="text-lg font-semibold">{selectedProductForDetails.totalCoverage}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Premiums Collected</Label>
                      <p className="text-lg font-semibold">{selectedProductForDetails.premiumCollected}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Claims</Label>
                      <p className="text-sm">{selectedProductForDetails.claims} claims / {selectedProductForDetails.claimsPaid} paid</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditProduct(selectedProductForDetails)
                    setShowProductDetailsDialog(false)
                  }}
                >
                  Edit Product
                </Button>
                <Button
                  onClick={() => {
                    handleViewPolicies(selectedProductForDetails)
                    setShowProductDetailsDialog(false)
                  }}
                >
                  View Policies
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
