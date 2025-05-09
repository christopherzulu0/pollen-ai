"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, AlertCircle, CheckCircle, XCircle, DollarSign, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

// Define the type for loan requests
interface LoanRequest {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  groupId: string;
  groupName?: string;
  amount: number;
  amountRepaid: number;
  remainingAmount: number;
  purpose: string;
  repaymentDate: string;
  repaymentTerms: string;
  nextPaymentDue: string;
  nextPaymentAmount: number;
  status: string;
  loanStartDate: string;
  paymentHistory: {
    date: string;
    amount: number;
    status: string;
  }[];
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  group?: {
    name: string;
  };
}

// Mock data for fallback
const mockOutstandingLoans = [
  {
    id: "loan1",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=40&width=40",
    groupId: "group1",
    groupName: "Savings Group A",
    amount: 1000,
    amountRepaid: 300,
    remainingAmount: 700,
    purpose: "Home renovation project",
    repaymentDate: new Date(2024, 8, 15),
    repaymentTerms: "3 monthly installments with 5% interest",
    nextPaymentDue: new Date(2024, 6, 15),
    nextPaymentAmount: 350,
    status: "ON_TIME",
    loanStartDate: new Date(2024, 5, 15),
    paymentHistory: [{ date: new Date(2024, 5, 15), amount: 300, status: "PAID" }],
  },
  {
    id: "loan2",
    userId: "user2",
    userName: "Jane Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    groupId: "group1",
    groupName: "Savings Group A",
    amount: 500,
    amountRepaid: 0,
    remainingAmount: 500,
    purpose: "Medical expenses",
    repaymentDate: new Date(2024, 6, 30),
    repaymentTerms: "Full payment with 3% interest",
    nextPaymentDue: new Date(2024, 6, 30),
    nextPaymentAmount: 515,
    status: "ON_TIME",
    loanStartDate: new Date(2024, 5, 30),
    paymentHistory: [],
  },
  {
    id: "loan3",
    userId: "user3",
    userName: "Robert Johnson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    groupId: "group3",
    groupName: "Community Cooperative",
    amount: 2000,
    amountRepaid: 600,
    remainingAmount: 1400,
    purpose: "Small business startup",
    repaymentDate: new Date(2024, 9, 1),
    repaymentTerms: "6 monthly installments with 6% interest",
    nextPaymentDue: new Date(2024, 5, 1),
    nextPaymentAmount: 350,
    status: "LATE",
    loanStartDate: new Date(2024, 3, 1),
    paymentHistory: [
      { date: new Date(2024, 4, 1), amount: 350, status: "PAID" },
      { date: new Date(2024, 3, 1), amount: 250, status: "PAID" },
    ],
  },
  {
    id: "loan4",
    userId: "user4",
    userName: "Sarah Williams",
    userAvatar: "/placeholder.svg?height=40&width=40",
    groupId: "group2",
    groupName: "Investment Club B",
    amount: 1500,
    amountRepaid: 500,
    remainingAmount: 1000,
    purpose: "Education expenses",
    repaymentDate: new Date(2024, 7, 15),
    repaymentTerms: "3 monthly installments with 4% interest",
    nextPaymentDue: new Date(2024, 6, 15),
    nextPaymentAmount: 500,
    status: "ON_TIME",
    loanStartDate: new Date(2024, 5, 15),
    paymentHistory: [{ date: new Date(2024, 5, 15), amount: 500, status: "PAID" }],
  },
  {
    id: "loan5",
    userId: "user5",
    userName: "Michael Brown",
    userAvatar: "/placeholder.svg?height=40&width=40",
    groupId: "group1",
    groupName: "Savings Group A",
    amount: 800,
    amountRepaid: 0,
    remainingAmount: 800,
    purpose: "Car repairs",
    repaymentDate: new Date(2024, 6, 1),
    repaymentTerms: "2 monthly installments with 5% interest",
    nextPaymentDue: new Date(2024, 5, 1),
    nextPaymentAmount: 420,
    status: "VERY_LATE",
    loanStartDate: new Date(2024, 4, 1),
    paymentHistory: [],
  },
]

export default function MembersWithLoans() {
  const router = useRouter()
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch loan requests with status APPROVED
  const { 
    data: loans = [], 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery<LoanRequest[]>({
    queryKey: ['loanRequests', 'approved'],
    queryFn: async () => {
      const response = await fetch('/api/loans?status=APPROVED')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch approved loans')
      }

      return response.json()
    },
    refetchOnWindowFocus: false,
  })

  // Mock groups - in a real app, fetch from API
  const groups = [
    { id: "all", name: "All Groups" },
    { id: "group1", name: "Savings Group A" },
    { id: "group2", name: "Investment Club B" },
    { id: "group3", name: "Community Cooperative" },
  ]

  const formatDate = (date: string | Date | undefined | null) => {
    try {
      // Check if date is undefined or null
      if (date === undefined || date === null) {
        return 'No date'
      }

      const dateObj = typeof date === 'string' ? new Date(date) : date
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date'
      }
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  const formatCurrency = (amount: number | undefined | null) => {
    // Handle cases where amount might be undefined, null, or NaN
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "ZMK 0.00"
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMK",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> On Time
          </Badge>
        )
      case "LATE":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Late
          </Badge>
        )
      case "VERY_LATE":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Very Late
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" /> {status || "Unknown"}
          </Badge>
        )
    }
  }

  const getRepaymentProgress = (loan: any) => {
    // Handle cases where amountRepaid or amount might be undefined or not a number
    const amountRepaid = typeof loan.amountRepaid === 'number' ? loan.amountRepaid : 0;
    const amount = typeof loan.amount === 'number' ? loan.amount : 1; // Avoid division by zero
    return Math.round((amountRepaid / amount) * 100)
  }

  const handleRecordPayment = async (loanId: string) => {
    if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, this would be an API call to record the payment
      console.log(`Recording payment of ${paymentAmount} for loan ${loanId}`)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, you would make an API call to record the payment
      // For example:
      // const response = await fetch(`/api/loans/${loanId}/payment`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ amount: Number(paymentAmount) }),
      // })
      //
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({}))
      //   throw new Error(errorData.error || 'Failed to record payment')
      // }

      // Refetch loan data to update the UI
      refetch()

      toast({
        title: "Payment recorded",
        description: `Payment of ${formatCurrency(Number(paymentAmount))} has been recorded.`,
      })

      setPaymentAmount("")
      setSelectedLoan(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">Loading outstanding loans...</p>
        </CardContent>
      </Card>
    )
  }

  // Handle error state
  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive text-center">Failed to load loans. Please try again.</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Filter loans based on selected group
  const filteredLoans = selectedGroup === "all" ? loans : loans.filter((loan) => loan.groupId === selectedGroup)

  if (filteredLoans.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">There are no outstanding loans in this group.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Outstanding Loans</h2>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredLoans.map((loan) => (
        <Card key={loan.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={loan.userAvatar || "/placeholder.svg"} alt={loan.userName || loan.user?.name || "User"} />
                  <AvatarFallback>{(loan.userName || loan.user?.name || "User").substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{loan.userName || loan.user?.name || "User"}</CardTitle>
                  <CardDescription>{loan.groupName || loan.group?.name || "Group"}</CardDescription>
                </div>
              </div>
              {getStatusBadge(loan.status)}
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                {/*<DollarSign className="h-4 w-4 text-muted-foreground" />*/}
                <span className="font-medium">{formatCurrency(loan.amount)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {formatDate(loan.repaymentDate)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{loan.purpose}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Repayment Progress</span>
                <span>
                  {formatCurrency(loan.amountRepaid)} of {formatCurrency(loan.amount)} repaid
                </span>
              </div>
              <Progress value={getRepaymentProgress(loan)} className="h-2" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Next Payment:</span>
                <p className="font-medium">{formatDate(loan.nextPaymentDue)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Amount Due:</span>
                <p className="font-medium">{formatCurrency(loan.nextPaymentAmount)}</p>
              </div>
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="pt-4 flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setSelectedLoan(loan)}>
                  View Details
                </Button>
              </DialogTrigger>
              {selectedLoan && (
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Loan Details</DialogTitle>
                    <DialogDescription>
                      Loan to {selectedLoan.userName || selectedLoan.user?.name || "User"} started on {formatDate(selectedLoan.loanStartDate)}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Total Amount</h4>
                        <p className="text-lg font-semibold">{formatCurrency(selectedLoan.amount)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Remaining</h4>
                        <p className="text-lg font-semibold">{formatCurrency(selectedLoan.remainingAmount)}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Purpose</h4>
                      <p className="text-sm mt-1">{selectedLoan.purpose}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Repayment Terms</h4>
                      <p className="text-sm mt-1">{selectedLoan.repaymentTerms}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Next Payment</h4>
                      <p className="text-sm mt-1">
                        {formatCurrency(selectedLoan.nextPaymentAmount)} due on{" "}
                        {formatDate(selectedLoan.nextPaymentDue)}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Payment History</h4>
                      {selectedLoan.paymentHistory && selectedLoan.paymentHistory.length > 0 ? (
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {selectedLoan.paymentHistory.map((payment: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm border-b pb-2">
                              <span>{formatDate(payment.date)}</span>
                              <span>{formatCurrency(payment.amount)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm mt-1 text-muted-foreground">No payments recorded yet</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Record Payment</h4>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                        />
                        <Button onClick={() => handleRecordPayment(selectedLoan.id)} disabled={isProcessing}>
                          {isProcessing ? "Processing..." : "Record"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedLoan(null)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>

            <Button variant="default">Send Reminder</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
