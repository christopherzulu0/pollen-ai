"use client"

import { useState, Suspense } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useUploadThing } from "@/utils/uploadthing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Sprout,
  Heart,
  Shield,
  Users,
  Smartphone,
  Cloud,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Info,
} from "lucide-react"

const insuranceProducts = [
  {
    id: "crop",
    name: "Crop Insurance",
    icon: Sprout,
    description: "Protect your harvest from weather damage, pests, and crop failure",
    premium: "$50/season",
    coverage: "$5,000",
    features: ["Drought protection", "Pest damage", "Flood coverage", "Seasonal payment"],
    color: "text-green-500",
  },
  {
    id: "health",
    name: "Health Emergency",
    icon: Heart,
    description: "Emergency medical coverage for unexpected health incidents",
    premium: "$15/month",
    coverage: "$10,000",
    features: ["Hospital admission", "Emergency surgery", "Ambulance service", "24/7 support"],
    color: "text-red-500",
  },
  {
    id: "loan",
    name: "Loan Protection",
    icon: Shield,
    description: "Coverage for loan repayment in case of death or disability",
    premium: "$8/month",
    coverage: "$20,000",
    features: ["Death benefit", "Disability coverage", "Automatic repayment", "Family protection"],
    color: "text-blue-500",
  },
  {
    id: "fraud",
    name: "Group Savings Fraud",
    icon: Users,
    description: "Protection against fraud and theft in group savings accounts",
    premium: "$5/month",
    coverage: "$15,000",
    features: ["Fraud detection", "Full reimbursement", "Legal support", "Account monitoring"],
    color: "text-purple-500",
  },
  {
    id: "mobile",
    name: "Mobile Phone",
    icon: Smartphone,
    description: "Coverage for mobile phone damage, theft, and loss",
    premium: "$10/month",
    coverage: "$1,000",
    features: ["Theft protection", "Accidental damage", "Screen replacement", "Water damage"],
    color: "text-orange-500",
  },
  {
    id: "weather",
    name: "Weather Parametric",
    icon: Cloud,
    description: "Automatic payouts based on weather data triggers",
    premium: "$20/season",
    coverage: "$8,000",
    features: ["Automatic triggers", "No claim filing", "Weather data based", "Fast payouts"],
    color: "text-cyan-500",
  },
]

const myPolicies = [
  {
    id: "pol-001",
    productId: "crop",
    policyNumber: "CRP-2024-001",
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    status: "active",
    premium: "$50",
    nextPayment: "2024-06-15",
    coverage: "$5,000",
  },
  {
    id: "pol-002",
    productId: "health",
    policyNumber: "HLT-2024-002",
    startDate: "2024-02-01",
    endDate: "2025-02-01",
    status: "active",
    premium: "$15",
    nextPayment: "2024-05-01",
    coverage: "$10,000",
  },
  {
    id: "pol-003",
    productId: "mobile",
    policyNumber: "MOB-2024-003",
    startDate: "2024-03-10",
    endDate: "2025-03-10",
    status: "expiring",
    premium: "$10",
    nextPayment: "2024-04-25",
    coverage: "$1,000",
  },
]

const myClaims = [
  {
    id: "clm-001",
    policyNumber: "CRP-2024-001",
    type: "Crop Insurance",
    claimAmount: "$2,500",
    status: "approved",
    submittedDate: "2024-03-15",
    resolvedDate: "2024-03-22",
    description: "Drought damage to maize crop",
  },
  {
    id: "clm-002",
    policyNumber: "HLT-2024-002",
    type: "Health Emergency",
    claimAmount: "$850",
    status: "processing",
    submittedDate: "2024-04-02",
    resolvedDate: null,
    description: "Emergency hospital admission",
  },
  {
    id: "clm-003",
    policyNumber: "MOB-2024-003",
    type: "Mobile Phone",
    claimAmount: "$450",
    status: "rejected",
    submittedDate: "2024-03-28",
    resolvedDate: "2024-04-01",
    description: "Screen damage - not covered under policy terms",
  },
]

// Types for insurance products
interface InsuranceProduct {
  id: string
  productType: string
  name: string
  description: string
  premium: string
  coverage: string
  features: string[]
  requirements?: string[]
  claimProcessingTime?: string | null
  maxClaimAmount?: number | null
  deductible?: number
  icon: string
  color: string
}

interface ProductsResponse {
  products: InsuranceProduct[]
}

// Types for insurance policies
interface InsurancePolicy {
  id: string
  policyNumber: string
  productId: string
  productName: string
  productType: string
  coverageAmount: number
  premiumAmount: number
  startDate: string
  endDate: string
  status: string
  nextPremiumDue?: string | null
  premiumFrequency?: string
}

interface PoliciesResponse {
  policies: InsurancePolicy[]
}

// Icon mapping function
function getIconComponent(iconName: string) {
  const iconMap: Record<string, any> = {
    Sprout,
    Heart,
    Shield,
    Users,
    Smartphone,
    Cloud,
  }
  return iconMap[iconName] || Shield
}

// Fetch products from API
async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch("/api/member/insurance/products")
  if (!response.ok) {
    throw new Error("Failed to fetch insurance products")
  }
  return response.json()
}

// Fetch policies from API
async function fetchPolicies(): Promise<PoliciesResponse> {
  const response = await fetch("/api/member/insurance/policies")
  if (!response.ok) {
    throw new Error("Failed to fetch insurance policies")
  }
  return response.json()
}

// Types for insurance claims
interface InsuranceClaim {
  id: string
  claimNumber: string
  policyNumber: string
  type: string
  claimType: string
  claimAmount: number
  approvedAmount: number | null
  status: string
  incidentDate: string
  submittedDate: string
  resolvedDate: string | null
  description: string
  documents: string[]
  evidenceUrls: string[]
  rejectionReason?: string | null
  priority: string
}

interface ClaimsResponse {
  claims: InsuranceClaim[]
}

// Fetch claims from API
async function fetchClaims(): Promise<ClaimsResponse> {
  const response = await fetch("/api/member/insurance/claims")
  if (!response.ok) {
    throw new Error("Failed to fetch insurance claims")
  }
  return response.json()
}

// Helper functions
function formatCurrency(amount: number): string {
  return `ZMW ${amount.toLocaleString()}`
}

function formatPremium(amount: number, frequency?: string): string {
  const freq = frequency === "seasonal" ? "season" : frequency === "monthly" ? "month" : "year"
  return `ZMW ${amount.toLocaleString()}/${freq}`
}

// Skeleton loader for claims
function ClaimsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-48" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Claims Content Component
function ClaimsContent() {
  const { data, isLoading, error } = useQuery<ClaimsResponse>({
    queryKey: ["insuranceClaims"],
    queryFn: fetchClaims,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const claims = data?.claims || []

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "paid":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Approved</Badge>
      case "processing":
      case "submitted":
      case "pending":
      case "under_review":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Processing</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return <ClaimsSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load claims. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {claims.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Claims Found</h3>
            <p className="text-sm text-muted-foreground">You haven't filed any insurance claims yet.</p>
          </CardContent>
        </Card>
      ) : (
        claims.map((claim) => (
          <div key={claim.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{claim.type}</h4>
                  {getStatusBadge(claim.status)}
                </div>
                <p className="text-sm text-muted-foreground">{claim.policyNumber} - {claim.claimNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatCurrency(claim.claimAmount)}</p>
                <p className="text-xs text-muted-foreground">Claim Amount</p>
                {claim.approvedAmount && (
                  <>
                    <p className="text-sm font-semibold text-green-500 mt-1">{formatCurrency(claim.approvedAmount)}</p>
                    <p className="text-xs text-muted-foreground">Approved</p>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm">{claim.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Submitted: {new Date(claim.submittedDate).toLocaleDateString()}</span>
              </div>
              {claim.resolvedDate && (
                <div className="flex items-center gap-1">
                  {claim.status.toLowerCase() === "approved" || claim.status.toLowerCase() === "paid" ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span>Resolved: {new Date(claim.resolvedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {claim.rejectionReason && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-xs font-medium text-red-500 mb-1">Rejection Reason</p>
                <p className="text-xs text-muted-foreground">{claim.rejectionReason}</p>
              </div>
            )}

            {(claim.status.toLowerCase() === "processing" || claim.status.toLowerCase() === "submitted" || claim.status.toLowerCase() === "pending" || claim.status.toLowerCase() === "under_review") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Processing Progress</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export function MemberInsuranceClient() {
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [showPolicyDetails, setShowPolicyDetails] = useState(false)
  
  // Purchase form state
  const [purchaseForm, setPurchaseForm] = useState({
    startDate: "",
    coverageAmount: "",
    notes: "",
  })
  
  // Claim form state
  const [claimForm, setClaimForm] = useState({
    policyId: "",
    claimType: "",
    claimAmount: "",
    incidentDate: "",
    description: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { startUpload, isUploading } = useUploadThing("insuranceDocumentUploader")

  // Fetch user's policies for claim form
  const { data: policiesData } = useQuery({
    queryKey: ["insurancePolicies"],
    queryFn: async () => {
      const response = await fetch("/api/member/insurance/policies")
      if (!response.ok) throw new Error("Failed to fetch policies")
      return response.json()
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  // Fetch user's policies for stats and coverage
  const { data: policiesStatsData } = useQuery<PoliciesResponse>({
    queryKey: ["insurancePolicies"],
    queryFn: fetchPolicies,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  // Fetch claims for stats
  const { data: claimsStatsData } = useQuery<ClaimsResponse>({
    queryKey: ["insuranceClaims"],
    queryFn: fetchClaims,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const policiesForStats = policiesStatsData?.policies || []
  const claimsForStats = claimsStatsData?.claims || []

  // Calculate stats
  const totalCoverage = policiesForStats.reduce((sum, policy) => sum + policy.coverageAmount, 0)
  const activePolicies = policiesForStats.filter((p) => p.status.toLowerCase() === "active").length
  const approvedClaims = claimsForStats.filter((c) => c.status.toLowerCase() === "approved" || c.status.toLowerCase() === "paid").length
  const pendingClaims = claimsForStats.filter((c) => c.status.toLowerCase() === "processing" || c.status.toLowerCase() === "submitted" || c.status.toLowerCase() === "pending").length
  
  // Calculate next payment
  const nextPayment = policiesForStats
    .filter((p) => p.nextPremiumDue && new Date(p.nextPremiumDue) > new Date())
    .sort((a, b) => {
      if (!a.nextPremiumDue || !b.nextPremiumDue) return 0
      return new Date(a.nextPremiumDue).getTime() - new Date(b.nextPremiumDue).getTime()
    })[0]

  // Mutation for purchasing policy
  const purchasePolicyMutation = useMutation({
    mutationFn: async (data: {
      productId: string
      startDate: string
      coverageAmount?: string
      notes?: string
    }) => {
      const response = await fetch("/api/member/insurance/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to purchase policy")
      }
      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: "Policy Purchased",
        description: `Your insurance policy ${data.policy.policyNumber} has been created successfully.`,
      })
      setShowPurchaseDialog(false)
      setPurchaseForm({
        startDate: "",
        coverageAmount: "",
        notes: "",
      })
      // Invalidate policies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["insurancePolicies"] })
      queryClient.invalidateQueries({ queryKey: ["insuranceClaims"] })
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const submitClaimMutation = useMutation({
    mutationFn: async (data: {
      policyId: string
      claimType: string
      claimAmount: number
      incidentDate: string
      description: string
      evidenceUrls: string[]
    }) => {
      const response = await fetch("/api/member/insurance/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit claim")
      }
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Claim Submitted",
        description: "Your insurance claim has been submitted successfully.",
      })
      setShowClaimDialog(false)
      setClaimForm({
        policyId: "",
        claimType: "",
        claimAmount: "",
        incidentDate: "",
        description: "",
      })
      setUploadedFiles([])
      queryClient.invalidateQueries({ queryKey: ["insuranceClaims"] })
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handlePurchase = (product: InsuranceProduct) => {
    setSelectedProduct(product)
    // Set default coverage amount from product
    const coverageMatch = product.coverage.match(/ZMW\s*([\d,]+)/)
    const defaultCoverage = coverageMatch ? coverageMatch[1].replace(/,/g, "") : ""
    setPurchaseForm({
      startDate: new Date().toISOString().split("T")[0],
      coverageAmount: defaultCoverage,
      notes: "",
    })
    setShowPurchaseDialog(true)
  }

  const handleSubmitPurchase = async () => {
    if (!selectedProduct || !purchaseForm.startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    purchasePolicyMutation.mutate({
      productId: selectedProduct.id,
      startDate: purchaseForm.startDate,
      coverageAmount: purchaseForm.coverageAmount || undefined,
      notes: purchaseForm.notes || undefined,
    })
  }

  const handleFileClaim = (policy: any) => {
    setSelectedPolicy(policy)
    
    // Pre-populate claim form with policy details
    const today = new Date().toISOString().split("T")[0]
    
    // Suggest claim type based on product type
    let suggestedClaimType = ""
    if (policy.productName) {
      const productName = policy.productName.toLowerCase()
      if (productName.includes("crop")) {
        suggestedClaimType = "Crop Damage"
      } else if (productName.includes("health")) {
        suggestedClaimType = "Medical Emergency"
      } else if (productName.includes("loan")) {
        suggestedClaimType = "Loan Protection"
      } else if (productName.includes("fraud")) {
        suggestedClaimType = "Fraud"
      } else if (productName.includes("mobile")) {
        suggestedClaimType = "Mobile Device Loss/Damage"
      } else if (productName.includes("weather")) {
        suggestedClaimType = "Weather Damage"
      }
    }
    
    // Pre-populate form with policy details
    setClaimForm({
      policyId: policy.id || "",
      claimType: suggestedClaimType,
      claimAmount: policy.coverageAmount ? parseFloat(policy.coverageAmount.toString()).toString() : "",
      incidentDate: today,
      description: "",
    })
    
    setShowClaimDialog(true)
  }

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy)
    setShowPolicyDetails(true)
  }

  const handleDownloadPolicy = async (policy: InsurancePolicy) => {
    try {
      const response = await fetch(`/api/member/insurance/policy/download?policyId=${policy.id}`)
      if (!response.ok) {
        throw new Error("Failed to download policy")
      }

      // Get the blob from the response
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `Policy_${policy.policyNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Policy Downloaded",
        description: "Your policy document has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download policy document.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (files: File[]) => {
    try {
      const uploaded = await startUpload(files)
      if (uploaded) {
        const urls = uploaded.map((file) => file.url)
        setUploadedFiles((prev) => [...prev, ...urls])
        toast({
          title: "Files Uploaded",
          description: `${files.length} file(s) uploaded successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitClaim = async () => {
    if (!claimForm.policyId || !claimForm.claimType || !claimForm.claimAmount || !claimForm.incidentDate || !claimForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    submitClaimMutation.mutate({
      policyId: claimForm.policyId,
      claimType: claimForm.claimType,
      claimAmount: parseFloat(claimForm.claimAmount),
      incidentDate: claimForm.incidentDate,
      description: claimForm.description,
      evidenceUrls: uploadedFiles,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
      case "expiring":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Expiring Soon</Badge>
      case "expired":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Expired</Badge>
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Approved</Badge>
      case "processing":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Processing</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Rejected</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

// Skeleton loader for products
function ProductsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Products Content Component
function ProductsContent({ onPurchase }: { onPurchase: (product: InsuranceProduct) => void }) {
  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["insuranceProducts"],
    queryFn: fetchProducts,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const products = data?.products || []

  if (isLoading) {
    return <ProductsSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load insurance products. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {products.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
            <p className="text-sm text-muted-foreground">No insurance products are currently available.</p>
          </CardContent>
        </Card>
      ) : (
        products.map((product) => {
          const Icon = getIconComponent(product.icon)
          return (
            <Card key={product.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-card rounded-lg">
                      <Icon className={`h-6 w-6 ${product.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="text-xs">{product.premium}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{product.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-semibold text-primary">{product.coverage}</span>
                  </div>
                  <div className="space-y-1">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => onPurchase(product)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Purchase Policy
                </Button>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}

// Policies Skeleton
function PoliciesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Policies Content Component
function PoliciesContent({ onFileClaim, onViewPolicy, onDownloadPolicy }: { onFileClaim: (policy: InsurancePolicy) => void; onViewPolicy: (policy: InsurancePolicy) => void; onDownloadPolicy: (policy: InsurancePolicy) => void }) {
  const { data, isLoading, error } = useQuery<PoliciesResponse>({
    queryKey: ["insurancePolicies"],
    queryFn: fetchPolicies,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const policies = data?.policies || []

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
      case "expiring":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Expiring Soon</Badge>
      case "expired":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Expired</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return <PoliciesSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load policies. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {policies.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Policies Found</h3>
            <p className="text-sm text-muted-foreground">You don't have any insurance policies yet.</p>
          </CardContent>
        </Card>
      ) : (
        policies.map((policy) => {
          const Icon = getIconComponent(getIconNameForProductType(policy.productType))
          const color = getColorForProductType(policy.productType)
          return (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-card rounded-lg">
                      <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{policy.productName}</CardTitle>
                      <CardDescription className="text-xs">{policy.policyNumber}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Coverage</p>
                    <p className="font-semibold">{formatCurrency(policy.coverageAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Premium</p>
                    <p className="font-semibold">{formatPremium(policy.premiumAmount, policy.premiumFrequency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Next Payment</p>
                    <p className="font-semibold">
                      {policy.nextPremiumDue ? new Date(policy.nextPremiumDue).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Expires</p>
                    <p className="font-semibold">{new Date(policy.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onViewPolicy(policy)}>
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onFileClaim(policy)}>
                    <Plus className="h-4 w-4 mr-2" />
                    File Claim
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDownloadPolicy(policy)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}

function getIconNameForProductType(productType: string): string {
  const iconMap: Record<string, string> = {
    crop: "Sprout",
    health: "Heart",
    loan_protection: "Shield",
    savings_fraud: "Users",
    mobile: "Smartphone",
    weather: "Cloud",
  }
  return iconMap[productType] || "Shield"
}

function getColorForProductType(productType: string): string {
  const colorMap: Record<string, string> = {
    crop: "text-green-500",
    health: "text-red-500",
    loan_protection: "text-blue-500",
    savings_fraud: "text-purple-500",
    mobile: "text-orange-500",
    weather: "text-cyan-500",
  }
  return colorMap[productType] || "text-gray-500"
}

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Insurance Portal</h2>
        <p className="text-muted-foreground">Protect what matters most with comprehensive coverage</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">Out of {policiesForStats.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCoverage)}</div>
            <p className="text-xs text-muted-foreground">Combined protection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Filed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimsForStats.length}</div>
            <p className="text-xs text-muted-foreground">{approvedClaims} approved, {pendingClaims} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextPayment ? formatCurrency(nextPayment.premiumAmount) : "ZMW 0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextPayment && nextPayment.nextPremiumDue
                ? `Due ${new Date(nextPayment.nextPremiumDue).toLocaleDateString()}`
                : "No upcoming payments"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="policies">My Policies</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Summary</TabsTrigger>
        </TabsList>

        {/* Browse Products Tab */}
        <TabsContent value="browse" className="space-y-4">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductsContent onPurchase={handlePurchase} />
          </Suspense>
        </TabsContent>

        {/* My Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <Suspense fallback={<PoliciesSkeleton />}>
            <PoliciesContent onFileClaim={handleFileClaim} onViewPolicy={handleViewPolicy} onDownloadPolicy={handleDownloadPolicy} />
          </Suspense>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Claims</CardTitle>
                  <CardDescription>Track and manage your insurance claims</CardDescription>
                </div>
                <Button onClick={() => setShowClaimDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  File New Claim
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ClaimsSkeleton />}>
                <ClaimsContent />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coverage Summary Tab */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Protection Overview</CardTitle>
              <CardDescription>Your combined insurance coverage across all policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-2">Total Coverage Amount</p>
                <p className="text-4xl font-bold text-primary">{formatCurrency(totalCoverage)}</p>
              </div>

              {policiesForStats.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Coverage Yet</h3>
                  <p className="text-sm text-muted-foreground">Purchase an insurance policy to get started.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {policiesForStats.map((policy) => {
                      const Icon = getIconComponent(getIconNameForProductType(policy.productType))
                      const color = getColorForProductType(policy.productType)
                      const percentage = totalCoverage > 0 ? (policy.coverageAmount / totalCoverage) * 100 : 0

                      return (
                        <div key={policy.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${color}`} />
                              <span>{policy.productName}</span>
                            </div>
                            <span className="font-semibold">{formatCurrency(policy.coverageAmount)}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">Coverage Recommendations</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {policiesForStats.length < 3 && (
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-muted-foreground">
                            Consider adding more insurance products for comprehensive protection
                          </p>
                        </div>
                      )}
                      {policiesForStats.some((p) => {
                        const daysUntilExpiry = Math.ceil((new Date(p.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        return daysUntilExpiry > 0 && daysUntilExpiry <= 30
                      }) && (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <p className="text-muted-foreground">
                            Some policies are expiring soon - renew to maintain coverage
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase {selectedProduct?.name}</DialogTitle>
            <DialogDescription>Complete the form below to purchase your insurance policy</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Policy Start Date *</Label>
              <Input
                type="date"
                value={purchaseForm.startDate}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, startDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label>Coverage Amount (ZMW)</Label>
              <Input
                type="number"
                placeholder="Enter coverage amount"
                value={purchaseForm.coverageAmount}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, coverageAmount: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Default: {selectedProduct?.coverage || "Product default"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes (Optional)</Label>
              <Textarea
                placeholder="Add any additional details or requirements..."
                rows={3}
                value={purchaseForm.notes}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Premium</span>
                <span className="font-semibold">{selectedProduct?.premium}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Coverage</span>
                <span className="font-semibold">{selectedProduct?.coverage}</span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="font-semibold">First Payment</span>
                <span className="text-lg font-bold text-primary">{selectedProduct?.premium}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleSubmitPurchase}
                disabled={purchasePolicyMutation.isPending || !purchaseForm.startDate}
              >
                {purchasePolicyMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirm Purchase
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPurchaseDialog(false)
                  setPurchaseForm({
                    startDate: "",
                    coverageAmount: "",
                    notes: "",
                  })
                }}
                disabled={purchasePolicyMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Claim Dialog */}
      <Dialog 
        open={showClaimDialog} 
        onOpenChange={(open) => {
          setShowClaimDialog(open)
          if (!open) {
            // Reset form when dialog closes
            setClaimForm({
              policyId: "",
              claimType: "",
              claimAmount: "",
              incidentDate: "",
              description: "",
            })
            setUploadedFiles([])
            setSelectedPolicy(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>File Insurance Claim</DialogTitle>
            <DialogDescription>
              {selectedPolicy ? (
                <span>
                  Filing claim for <strong>{selectedPolicy.productName}</strong> - Policy #{selectedPolicy.policyNumber}
                </span>
              ) : (
                "Provide details about your claim and upload supporting documents"
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Policy *</Label>
              <Select
                value={claimForm.policyId}
                onValueChange={(value) => {
                  const selectedPolicyData = policiesData?.policies?.find((p: InsurancePolicy) => p.id === value)
                  if (selectedPolicyData) {
                    setSelectedPolicy(selectedPolicyData)
                    // Update claim form when policy changes
                    const today = new Date().toISOString().split("T")[0]
                    let suggestedClaimType = ""
                    if (selectedPolicyData.productName) {
                      const productName = selectedPolicyData.productName.toLowerCase()
                      if (productName.includes("crop")) {
                        suggestedClaimType = "Crop Damage"
                      } else if (productName.includes("health")) {
                        suggestedClaimType = "Medical Emergency"
                      } else if (productName.includes("loan")) {
                        suggestedClaimType = "Loan Protection"
                      } else if (productName.includes("fraud")) {
                        suggestedClaimType = "Fraud"
                      } else if (productName.includes("mobile")) {
                        suggestedClaimType = "Mobile Device Loss/Damage"
                      } else if (productName.includes("weather")) {
                        suggestedClaimType = "Weather Damage"
                      }
                    }
                    setClaimForm({
                      policyId: value,
                      claimType: suggestedClaimType,
                      claimAmount: selectedPolicyData.coverageAmount 
                        ? parseFloat(selectedPolicyData.coverageAmount.toString()).toString() 
                        : "",
                      incidentDate: today,
                      description: "",
                    })
                  } else {
                    setClaimForm({ ...claimForm, policyId: value })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  {policiesData?.policies?.length === 0 ? (
                    <SelectItem value="no-policies" disabled>
                      No active policies found
                    </SelectItem>
                  ) : (
                    policiesData?.policies?.map((policy: InsurancePolicy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy.productName} - {policy.policyNumber}
                      </SelectItem>
                    )) || []
                  )}
                </SelectContent>
              </Select>
              {selectedPolicy && (
                <p className="text-xs text-muted-foreground mt-1">
                  Coverage: {formatCurrency(parseFloat(selectedPolicy.coverageAmount?.toString() || "0"))}
                </p>
              )}
            </div>

            <div>
              <Label>Claim Type *</Label>
              <Input
                placeholder="e.g., Crop Damage, Medical Emergency, etc."
                value={claimForm.claimType}
                onChange={(e) => setClaimForm({ ...claimForm, claimType: e.target.value })}
              />
            </div>

            <div>
              <Label>Incident Date *</Label>
              <Input
                type="date"
                value={claimForm.incidentDate}
                onChange={(e) => setClaimForm({ ...claimForm, incidentDate: e.target.value })}
              />
            </div>

            <div>
              <Label>Claim Amount *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={claimForm.claimAmount}
                onChange={(e) => setClaimForm({ ...claimForm, claimAmount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description of Incident *</Label>
              <Textarea
                placeholder="Provide a detailed description of what happened..."
                rows={4}
                value={claimForm.description}
                onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Supporting Documents</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length > 0) {
                      handleFileUpload(files)
                    }
                  }}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                </label>
              </div>
              {isUploading && (
                <p className="text-xs text-muted-foreground">Uploading files...</p>
              )}
              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Uploaded files:</p>
                  {uploadedFiles.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <FileText className="h-3 w-3" />
                      <span className="truncate">{url}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={handleSubmitClaim}
                disabled={submitClaimMutation.isPending || isUploading}
              >
                {submitClaimMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submit Claim
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowClaimDialog(false)
                  setClaimForm({
                    policyId: "",
                    claimType: "",
                    claimAmount: "",
                    incidentDate: "",
                    description: "",
                  })
                  setUploadedFiles([])
                }}
                disabled={submitClaimMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Policy Details Dialog */}
      <Dialog open={showPolicyDetails} onOpenChange={setShowPolicyDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Policy Details</DialogTitle>
            <DialogDescription>{selectedPolicy?.policyNumber}</DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              {(() => {
                const Icon = getIconComponent(getIconNameForProductType(selectedPolicy.productType || ""))
                const color = getColorForProductType(selectedPolicy.productType || "")
                return (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Icon className={`h-8 w-8 ${color}`} />
                      <div>
                        <h3 className="font-semibold">{selectedPolicy.productName || "Unknown Product"}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPolicy.policyNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Policy Number</p>
                        <p className="font-semibold">{selectedPolicy.policyNumber}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Status</p>
                        {getStatusBadge(selectedPolicy.status)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Coverage Amount</p>
                        <p className="font-semibold text-primary">{formatCurrency(selectedPolicy.coverageAmount)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Premium</p>
                        <p className="font-semibold">
                          {formatPremium(selectedPolicy.premiumAmount, selectedPolicy.premiumFrequency)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-semibold">{new Date(selectedPolicy.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-semibold">{new Date(selectedPolicy.endDate).toLocaleDateString()}</p>
                      </div>
                      {selectedPolicy.nextPremiumDue && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Next Payment Due</p>
                          <p className="font-semibold">{new Date(selectedPolicy.nextPremiumDue).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => selectedPolicy && handleDownloadPolicy(selectedPolicy)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Policy
                      </Button>
                      <Button variant="outline" onClick={() => setShowPolicyDetails(false)}>
                        Close
                      </Button>
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
