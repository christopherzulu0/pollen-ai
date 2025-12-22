"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Banknote,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  FileText,
  CreditCard,
  Download,
  Receipt,
  Wallet,
  Building2,
  Smartphone,
  X,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Payment {
  id: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "PAID" | "PENDING" | "OVERDUE"
  method?: string
  transactionId?: string
}

interface Loan {
  id: string
  groupName: string
  groupAvatar: string
  amount: number
  purpose: string
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED"
  requestDate: string
  approvalDate?: string
  completionDate?: string
  interestRate: number
  installments: number
  remainingBalance: number
  nextPaymentDate?: string
  nextPaymentAmount?: number
  totalPaid: number
  votes?: {
    approve: number
    reject: number
    total: number
    threshold: number
  }
  payments?: Payment[]
}

function PaymentModal({
  loan,
  onClose,
  onPaymentSuccess,
}: {
  loan: Loan
  onClose: () => void
  onPaymentSuccess: () => void
}) {
  const [paymentAmount, setPaymentAmount] = useState(loan.nextPaymentAmount?.toString() || "")
  const [paymentMethod, setPaymentMethod] = useState("mobile_money")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    onPaymentSuccess()
    onClose()
  }

  const amount = Number.parseFloat(paymentAmount) || 0
  const canPayFull = amount >= (loan.nextPaymentAmount || 0)

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full max-h-[90vh] flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-lg">Make Payment</CardTitle>
              <CardDescription className="text-xs">{loan.groupName}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className="font-bold">K{loan.remainingBalance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                Due{" "}
                {loan.nextPaymentDate
                  ? new Date(loan.nextPaymentDate).toLocaleDateString("en-GB", { month: "short", day: "numeric" })
                  : "N/A"}
              </div>
              <div className="font-semibold">K{loan.nextPaymentAmount?.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-sm">
                Amount (ZMW)
              </Label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setPaymentAmount(loan.nextPaymentAmount?.toString() || "")}
                >
                  Minimum
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => setPaymentAmount(loan.remainingBalance.toString())}
                >
                  Full
                </Button>
              </div>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="pl-8 h-9"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">K</span>
            </div>
            {amount > 0 && amount < (loan.nextPaymentAmount || 0) && (
              <div className="flex items-start gap-2 p-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
                <Info className="h-3.5 w-3.5 text-chart-3 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">Minimum payment: K{loan.nextPaymentAmount?.toFixed(2)}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
              <div className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="mobile_money" id="mobile_money" />
                <Label htmlFor="mobile_money" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Smartphone className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Mobile Money</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div className="p-1.5 rounded bg-accent/10">
                    <Building2 className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Bank Transfer</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="group_wallet" id="group_wallet" />
                <Label htmlFor="group_wallet" className="flex items-center gap-2 flex-1 cursor-pointer">
                  <div className="p-1.5 rounded bg-chart-2/10">
                    <Wallet className="h-3.5 w-3.5 text-chart-2" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Group Wallet</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "mobile_money" && (
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="097XXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-9"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 pt-3 flex-shrink-0 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!canPayFull || isProcessing || (paymentMethod === "mobile_money" && !phoneNumber)}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              `Pay K${amount.toFixed(2)}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function MyLoansPage() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [paymentLoan, setPaymentLoan] = useState<Loan | null>(null)

  // Mock data
  const loans: Loan[] = [
    {
      id: "1",
      groupName: "Tech Innovators Fund",
      groupAvatar: "/interconnected-tech.png",
      amount: 5000,
      purpose: "Equipment upgrade for my home office setup including new workstation and monitors",
      status: "ACTIVE",
      requestDate: "2024-01-15",
      approvalDate: "2024-01-20",
      interestRate: 5,
      installments: 12,
      remainingBalance: 3500,
      nextPaymentDate: "2024-03-01",
      nextPaymentAmount: 437.5,
      totalPaid: 1750,
      payments: [
        {
          id: "1",
          amount: 437.5,
          dueDate: "2024-02-01",
          paidDate: "2024-02-01",
          status: "PAID",
          method: "Mobile Money",
          transactionId: "MTN-2024020112345",
        },
        {
          id: "2",
          amount: 437.5,
          dueDate: "2024-02-15",
          paidDate: "2024-02-14",
          status: "PAID",
          method: "Bank Transfer",
          transactionId: "ZBANK-2024021498765",
        },
        { id: "3", amount: 437.5, dueDate: "2024-03-01", status: "PENDING" },
        { id: "4", amount: 437.5, dueDate: "2024-03-15", status: "PENDING" },
      ],
    },
    {
      id: "2",
      groupName: "Community Savings Circle",
      groupAvatar: "/diverse-community-gathering.png",
      amount: 2000,
      purpose: "Medical expenses for family member treatment",
      status: "PENDING",
      requestDate: "2024-02-10",
      interestRate: 3,
      installments: 6,
      remainingBalance: 2000,
      totalPaid: 0,
      votes: {
        approve: 8,
        reject: 2,
        total: 15,
        threshold: 60,
      },
    },
    {
      id: "3",
      groupName: "Entrepreneurship Club",
      groupAvatar: "/business-meeting-diversity.png",
      amount: 3000,
      purpose: "Business inventory purchase for new product line launch",
      status: "COMPLETED",
      requestDate: "2023-10-01",
      approvalDate: "2023-10-05",
      completionDate: "2024-01-15",
      interestRate: 4,
      installments: 6,
      remainingBalance: 0,
      totalPaid: 3120,
      payments: [
        {
          id: "1",
          amount: 520,
          dueDate: "2023-11-01",
          paidDate: "2023-11-01",
          status: "PAID",
          method: "Mobile Money",
          transactionId: "AIRTEL-2023110112345",
        },
        {
          id: "2",
          amount: 520,
          dueDate: "2023-11-15",
          paidDate: "2023-11-15",
          status: "PAID",
          method: "Bank Transfer",
          transactionId: "ZBANK-2023111512345",
        },
        {
          id: "3",
          amount: 520,
          dueDate: "2023-12-01",
          paidDate: "2023-12-01",
          status: "PAID",
          method: "Mobile Money",
          transactionId: "MTN-2023120112345",
        },
        {
          id: "4",
          amount: 520,
          dueDate: "2023-12-15",
          paidDate: "2023-12-15",
          status: "PAID",
          method: "Wallet",
          transactionId: "WALLET-2023121512345",
        },
        {
          id: "5",
          amount: 520,
          dueDate: "2024-01-01",
          paidDate: "2024-01-01",
          status: "PAID",
          method: "Mobile Money",
          transactionId: "MTN-2024010112345",
        },
        {
          id: "6",
          amount: 520,
          dueDate: "2024-01-15",
          paidDate: "2024-01-15",
          status: "PAID",
          method: "Mobile Money",
          transactionId: "AIRTEL-2024011512345",
        },
      ],
    },
    {
      id: "4",
      groupName: "Family Support Network",
      groupAvatar: "/diverse-family-portrait.png",
      amount: 1500,
      purpose: "Emergency car repair to maintain transportation for work commute",
      status: "REJECTED",
      requestDate: "2024-01-25",
      interestRate: 4,
      installments: 4,
      remainingBalance: 1500,
      totalPaid: 0,
      votes: {
        approve: 3,
        reject: 9,
        total: 12,
        threshold: 60,
      },
    },
  ]

  const activeLoans = loans.filter((l) => l.status === "ACTIVE")
  const pendingLoans = loans.filter((l) => l.status === "PENDING")
  const completedLoans = loans.filter((l) => l.status === "COMPLETED")
  const rejectedLoans = loans.filter((l) => l.status === "REJECTED")

  const totalBorrowed = loans.filter((l) => l.status !== "REJECTED").reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.totalPaid, 0)
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
  const nextPayment = activeLoans.length > 0 ? Math.min(...activeLoans.map((l) => l.nextPaymentAmount || 0)) : 0

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Loans</h1>
          <p className="text-muted-foreground">Track your loan requests, repayments, and payment history</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
                <Banknote className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">K{totalBorrowed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {loans.filter((l) => l.status !== "REJECTED").length} loans
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 via-background to-background border-accent/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Repaid</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">K{totalRepaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalBorrowed > 0 ? ((totalRepaid / totalBorrowed) * 100).toFixed(0) : 0}% of total borrowed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 via-background to-background border-chart-3/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">K{totalOutstanding.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeLoans.length} active loans</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-1/10 via-background to-background border-chart-1/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Next Payment</CardTitle>
                <CreditCard className="h-4 w-4 text-chart-1" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">K{nextPayment.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeLoans[0]?.nextPaymentDate
                  ? `Due ${new Date(activeLoans[0].nextPaymentDate).toLocaleDateString()}`
                  : "No upcoming payments"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loans List */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="active" className="data-[state=active]:bg-background">
              Active ({activeLoans.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-background">
              Pending ({pendingLoans.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-background">
              Completed ({completedLoans.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-background">
              Rejected ({rejectedLoans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {activeLoans.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No active loans</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeLoans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    loan={loan}
                    onClick={() => setSelectedLoan(loan)}
                    onPayClick={(e) => {
                      e.stopPropagation()
                      setPaymentLoan(loan)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {pendingLoans.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No pending loan requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pendingLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} onClick={() => setSelectedLoan(loan)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedLoans.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No completed loans</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {completedLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} onClick={() => setSelectedLoan(loan)} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-6">
            {rejectedLoans.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No rejected requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {rejectedLoans.map((loan) => (
                  <LoanCard key={loan.id} loan={loan} onClick={() => setSelectedLoan(loan)} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Loan Detail Modal */}
        {selectedLoan && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Loan Details</CardTitle>
                    <CardDescription className="mt-1">
                      Requested on {new Date(selectedLoan.requestDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLoan(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <LoanDetailContent loan={selectedLoan} onPayClick={() => setPaymentLoan(selectedLoan)} />
              </CardContent>
            </Card>
          </div>
        )}

        {paymentLoan && (
          <PaymentModal
            loan={paymentLoan}
            onClose={() => setPaymentLoan(null)}
            onPaymentSuccess={() => {
              // Handle success - in real app, refresh loan data
              console.log("[v0] Payment successful")
            }}
          />
        )}
      </div>
    </div>
  )
}

function LoanCard({
  loan,
  onClick,
  onPayClick,
}: { loan: Loan; onClick: () => void; onPayClick?: (e: React.MouseEvent) => void }) {
  const statusConfig = {
    PENDING: {
      color: "text-chart-3",
      bg: "bg-chart-3/10 border-chart-3/20",
      icon: Clock,
    },
    ACTIVE: {
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      icon: TrendingUp,
    },
    COMPLETED: {
      color: "text-accent",
      bg: "bg-accent/10 border-accent/20",
      icon: CheckCircle2,
    },
    REJECTED: {
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      icon: AlertCircle,
    },
  }

  const config = statusConfig[loan.status]
  const StatusIcon = config.icon
  const repaymentProgress = loan.status !== "REJECTED" ? (loan.totalPaid / loan.amount) * 100 : 0

  return (
    <Card className="hover:border-primary/50 transition-all cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={loan.groupAvatar || "/placeholder.svg"} alt={loan.groupName} />
              <AvatarFallback>
                {loan.groupName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{loan.groupName}</h3>
              <p className="text-sm text-muted-foreground">K{loan.amount.toLocaleString()} loan</p>
            </div>
          </div>
          <div className={cn("p-2 rounded-lg", config.bg)}>
            <StatusIcon className={cn("h-4 w-4", config.color)} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-foreground line-clamp-2 leading-relaxed">{loan.purpose}</p>

        {loan.status === "PENDING" && loan.votes && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Voting Progress</span>
              <span className="font-medium text-foreground">
                {loan.votes.approve + loan.votes.reject} / {loan.votes.total}
              </span>
            </div>
            <Progress value={((loan.votes.approve + loan.votes.reject) / loan.votes.total) * 100} className="h-1.5" />
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-accent">✓ {loan.votes.approve}</span>
                <span className="text-destructive">✗ {loan.votes.reject}</span>
              </div>
              <span
                className={cn(
                  "font-medium",
                  (loan.votes.approve / loan.votes.total) * 100 >= loan.votes.threshold
                    ? "text-accent"
                    : "text-muted-foreground",
                )}
              >
                {((loan.votes.approve / loan.votes.total) * 100).toFixed(0)}% approval
              </span>
            </div>
          </div>
        )}

        {loan.status === "ACTIVE" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Repayment Progress</span>
                <span className="font-medium text-foreground">{repaymentProgress.toFixed(0)}%</span>
              </div>
              <Progress value={repaymentProgress} className="h-1.5" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-sm font-semibold text-foreground">K{loan.remainingBalance.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Next Payment</p>
                <p className="text-sm font-semibold text-foreground">K{loan.nextPaymentAmount?.toFixed(2)}</p>
              </div>
            </div>

            {loan.nextPaymentDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Due {new Date(loan.nextPaymentDate).toLocaleDateString()}
              </div>
            )}

            {onPayClick && (
              <Button className="w-full" size="sm" onClick={onPayClick}>
                <CreditCard className="h-4 w-4 mr-2" />
                Make Payment
              </Button>
            )}
          </div>
        )}

        {loan.status === "COMPLETED" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-accent/10 border border-accent/20">
              <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-accent">Fully repaid</p>
                <p className="text-xs text-muted-foreground">
                  Completed on {loan.completionDate ? new Date(loan.completionDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total paid</span>
              <span className="font-medium text-foreground">K{loan.totalPaid.toLocaleString()}</span>
            </div>
          </div>
        )}

        {loan.status === "REJECTED" && loan.votes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-destructive">Request declined</p>
                <p className="text-xs text-muted-foreground">Did not meet voting threshold</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Final vote</span>
              <span className="text-muted-foreground">
                {loan.votes.approve} approve, {loan.votes.reject} reject
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LoanDetailContent({ loan, onPayClick }: { loan: Loan; onPayClick?: () => void }) {
  return (
    <>
      {/* Group Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-border">
          <AvatarImage src={loan.groupAvatar || "/placeholder.svg"} alt={loan.groupName} />
          <AvatarFallback>
            {loan.groupName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">{loan.groupName}</h3>
          <p className="text-sm text-muted-foreground">Loan #{loan.id}</p>
        </div>
      </div>

      {/* Loan Summary */}
      <div className="p-4 rounded-lg bg-muted/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Loan Amount</span>
          <span className="text-lg font-bold text-foreground">K{loan.amount.toLocaleString()}</span>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Interest Rate</span>
            <p className="font-semibold text-foreground">{loan.interestRate}%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Installments</span>
            <p className="font-semibold text-foreground">{loan.installments} payments</p>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Purpose</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{loan.purpose}</p>
      </div>

      {/* Payment History */}
      {loan.payments && loan.payments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Payment History</h4>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <div className="space-y-2">
            {loan.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      payment.status === "PAID"
                        ? "bg-accent/10"
                        : payment.status === "OVERDUE"
                          ? "bg-destructive/10"
                          : "bg-muted",
                    )}
                  >
                    {payment.status === "PAID" ? (
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    ) : payment.status === "OVERDUE" ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">K{payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.status === "PAID" && payment.paidDate
                        ? `Paid on ${new Date(payment.paidDate).toLocaleDateString()}`
                        : `Due ${new Date(payment.dueDate).toLocaleDateString()}`}
                    </p>
                    {payment.method && <p className="text-xs text-muted-foreground">{payment.method}</p>}
                  </div>
                </div>
                {payment.status === "PAID" && (
                  <Button variant="ghost" size="sm">
                    <Receipt className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loan.status === "ACTIVE" && onPayClick && (
        <Button className="w-full" size="lg" onClick={onPayClick}>
          <CreditCard className="h-4 w-4 mr-2" />
          Make Payment
        </Button>
      )}

      {/* Timeline */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3">Loan Timeline</h4>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-3 w-3 text-primary" />
              </div>
              <div className="w-px h-full bg-border mt-2" />
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium text-foreground">Request Submitted</p>
              <p className="text-xs text-muted-foreground">{new Date(loan.requestDate).toLocaleDateString()}</p>
            </div>
          </div>

          {loan.approvalDate && (
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="p-2 rounded-full bg-accent/10">
                  <CheckCircle2 className="h-3 w-3 text-accent" />
                </div>
                {loan.status !== "COMPLETED" && <div className="w-px h-full bg-border mt-2" />}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-foreground">Loan Approved</p>
                <p className="text-xs text-muted-foreground">{new Date(loan.approvalDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {loan.completionDate && (
            <div className="flex gap-3">
              <div className="p-2 rounded-full bg-chart-1/10">
                <CheckCircle2 className="h-3 w-3 text-chart-1" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Loan Completed</p>
                <p className="text-xs text-muted-foreground">{new Date(loan.completionDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
