"use client"

import { useState } from "react"
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

export function MemberInsuranceClient() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false)
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
  const [showPolicyDetails, setShowPolicyDetails] = useState(false)

  const handlePurchase = (product: any) => {
    setSelectedProduct(product)
    setShowPurchaseDialog(true)
  }

  const handleFileClaim = (policy: any) => {
    setSelectedPolicy(policy)
    setShowClaimDialog(true)
  }

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy)
    setShowPolicyDetails(true)
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

  const totalCoverage = myPolicies.reduce((sum, policy) => {
    return sum + Number.parseFloat(policy.coverage.replace(/[$,]/g, ""))
  }, 0)

  const activePolicies = myPolicies.filter((p) => p.status === "active").length

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
            <p className="text-xs text-muted-foreground">Out of {myPolicies.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCoverage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined protection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Filed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myClaims.length}</div>
            <p className="text-xs text-muted-foreground">1 approved, 1 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$25</div>
            <p className="text-xs text-muted-foreground">Due in 8 days</p>
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {insuranceProducts.map((product) => {
              const Icon = product.icon
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

                    <Button className="w-full" onClick={() => handlePurchase(product)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Purchase Policy
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* My Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <div className="space-y-4">
            {myPolicies.map((policy) => {
              const product = insuranceProducts.find((p) => p.id === policy.productId)
              const Icon = product?.icon || Shield
              return (
                <Card key={policy.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-card rounded-lg">
                          <Icon className={`h-5 w-5 ${product?.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base">{product?.name}</CardTitle>
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
                        <p className="font-semibold">{policy.coverage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Premium</p>
                        <p className="font-semibold">{policy.premium}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Next Payment</p>
                        <p className="font-semibold">{new Date(policy.nextPayment).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Expires</p>
                        <p className="font-semibold">{new Date(policy.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPolicy(policy)}>
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFileClaim(policy)}>
                        <Plus className="h-4 w-4 mr-2" />
                        File Claim
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
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
              <div className="space-y-4">
                {myClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{claim.type}</h4>
                          {getStatusBadge(claim.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{claim.policyNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{claim.claimAmount}</p>
                        <p className="text-xs text-muted-foreground">Claim Amount</p>
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
                          {claim.status === "approved" ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span>Resolved: {new Date(claim.resolvedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {claim.status === "processing" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Processing Progress</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                <p className="text-4xl font-bold text-primary">${totalCoverage.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                {myPolicies.map((policy) => {
                  const product = insuranceProducts.find((p) => p.id === policy.productId)
                  const Icon = product?.icon || Shield
                  const coverageAmount = Number.parseFloat(policy.coverage.replace(/[$,]/g, ""))
                  const percentage = (coverageAmount / totalCoverage) * 100

                  return (
                    <div key={policy.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${product?.color}`} />
                          <span>{product?.name}</span>
                        </div>
                        <span className="font-semibold">{policy.coverage}</span>
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
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-muted-foreground">
                      Consider adding Weather Parametric Insurance for additional crop protection
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <p className="text-muted-foreground">
                      Your mobile phone policy expires soon - renew to maintain coverage
                    </p>
                  </div>
                </div>
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+1234567890" />
              </div>
            </div>

            <div>
              <Label>Email Address</Label>
              <Input type="email" placeholder="john@example.com" />
            </div>

            <div>
              <Label>Coverage Amount</Label>
              <Select defaultValue={selectedProduct?.coverage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$5,000">$5,000</SelectItem>
                  <SelectItem value="$10,000">$10,000</SelectItem>
                  <SelectItem value="$15,000">$15,000</SelectItem>
                  <SelectItem value="$20,000">$20,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Policy Start Date</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>Additional Information</Label>
              <Textarea placeholder="Add any additional details or requirements..." rows={3} />
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
              <Button className="flex-1" onClick={() => setShowPurchaseDialog(false)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Purchase
              </Button>
              <Button variant="outline" onClick={() => setShowPurchaseDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Claim Dialog */}
      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>File Insurance Claim</DialogTitle>
            <DialogDescription>Provide details about your claim and upload supporting documents</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Policy</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  {myPolicies.map((policy) => {
                    const product = insuranceProducts.find((p) => p.id === policy.productId)
                    return (
                      <SelectItem key={policy.id} value={policy.policyNumber}>
                        {product?.name} - {policy.policyNumber}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Incident Date</Label>
              <Input type="date" />
            </div>

            <div>
              <Label>Claim Amount</Label>
              <Input type="number" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <Label>Description of Incident</Label>
              <Textarea placeholder="Provide a detailed description of what happened..." rows={4} />
            </div>

            <div className="space-y-2">
              <Label>Upload Supporting Documents</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setShowClaimDialog(false)}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submit Claim
              </Button>
              <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
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
                const product = insuranceProducts.find((p) => p.id === selectedPolicy.productId)
                const Icon = product?.icon || Shield
                return (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <Icon className={`h-8 w-8 ${product?.color}`} />
                      <div>
                        <h3 className="font-semibold">{product?.name}</h3>
                        <p className="text-sm text-muted-foreground">{product?.description}</p>
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
                        <p className="font-semibold text-primary">{selectedPolicy.coverage}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Premium</p>
                        <p className="font-semibold">{selectedPolicy.premium}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-semibold">{new Date(selectedPolicy.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-semibold">{new Date(selectedPolicy.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Coverage Features</h4>
                      <div className="space-y-1">
                        {product?.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
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
