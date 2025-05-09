"use client"

import { useState } from "react"
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define the type for loan requests
interface LoanRequest {
  id: string;
  groupId: string;
  groupName?: string;
  amount: number;
  purpose: string;
  repaymentDate: string;
  repaymentTerms: string;
  createdAt: string;
  status: string;
  votes: {
    vote: boolean;
    user: {
      id: string;
      name: string;
    }
  }[];
  totalMembers: number;
  userHasVoted: boolean;
  userVote: boolean | null;
  group?: {
    name: string;
  };
  approvedDate?: string;
  disbursedDate?: string;
  rejectedDate?: string;
}

export default function MyLoanRequests() {
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Fetch loan requests for the current user
  const { 
    data: myRequests = [], 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery<LoanRequest[]>({
    queryKey: ['loanRequests', 'my-requests'],
    queryFn: async () => {
      const response = await fetch('/api/loans?tab=my-requests')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch loan requests')
      }

      return response.json()
    },
    refetchOnWindowFocus: false,
  })

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMK",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" /> Voting in Progress
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="default">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="mr-1 h-3 w-3" /> {status || "Unknown"}
          </Badge>
        )
    }
  }

  const getVotePercentage = (loan: LoanRequest) => {
    const votesYes = loan.votes?.filter(vote => vote.vote).length || 0
    const votesNo = loan.votes?.filter(vote => !vote.vote).length || 0
    const totalVotesCast = votesYes + votesNo

    if (totalVotesCast === 0) return 0
    return Math.round((votesYes / totalVotesCast) * 100)
  }

  const handleWithdrawRequest = async (loanId: string) => {
    setIsWithdrawing(true)

    try {
      // Make API call to withdraw the loan request
      const response = await fetch(`/api/loans/${loanId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to withdraw loan request')
      }

      // Refetch loan requests to update the UI
      refetch()

      toast({
        title: "Request withdrawn",
        description: "Your loan request has been withdrawn successfully.",
      })
    } catch (error) {
      console.error('Error withdrawing loan request:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to withdraw your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading your loan requests...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle error state
  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-destructive text-center">
            {error instanceof Error ? error.message : "Failed to load loan requests. Please try again."}
          </p>
          <Button className="mt-4" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Handle empty state
  if (myRequests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">You haven't made any loan requests yet.</p>
          <Button className="mt-4" variant="outline" onClick={() => (window.location.href = "/loans?tab=new-request")}>
            Create a New Request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">My Loan Requests</h2>

      {myRequests.map((loan) => (
        <Card key={loan.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{formatCurrency(loan.amount)} Loan</CardTitle>
                <CardDescription>{loan.group?.name || loan.groupName || "Unknown Group"}</CardDescription>
              </div>
              {getStatusBadge(loan.status)}
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {formatDate(loan.repaymentDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Requested: {formatDate(loan.createdAt)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{loan.purpose}</p>

            {loan.status === "PENDING" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Voting Progress</span>
                  <span>
                    {loan.votes?.length || 0} of {loan.totalMembers} votes cast
                  </span>
                </div>
                <Progress value={getVotePercentage(loan)} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" /> {loan.votes?.filter(vote => vote.vote).length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="h-3 w-3" /> {loan.votes?.filter(vote => !vote.vote).length || 0}
                  </span>
                </div>
              </div>
            )}

            {loan.status === "APPROVED" && (
              <div className="text-sm text-muted-foreground">
                <p>Approved on {formatDate(loan.approvedDate)}</p>
                <p>Funds disbursed on {formatDate(loan.disbursedDate)}</p>
              </div>
            )}

            {loan.status === "REJECTED" && (
              <div className="text-sm text-muted-foreground">
                <p>Rejected on {formatDate(loan.rejectedDate)}</p>
                <p>Insufficient votes to approve your request.</p>
              </div>
            )}
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
                    <DialogTitle>Loan Request Details</DialogTitle>
                    <DialogDescription>Requested on {formatDate(selectedLoan.createdAt)}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Amount</h4>
                        <p className="text-lg font-semibold">{formatCurrency(selectedLoan.amount)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Status</h4>
                        <div className="mt-1">{getStatusBadge(selectedLoan.status)}</div>
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
                      <h4 className="text-sm font-medium">Group</h4>
                      <p className="text-sm mt-1">{selectedLoan.group?.name || selectedLoan.groupName || "Unknown Group"}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Repayment Date</h4>
                      <p className="text-sm mt-1">{formatDate(selectedLoan.repaymentDate)}</p>
                    </div>

                    {selectedLoan.status === "PENDING" && (
                      <div>
                        <h4 className="text-sm font-medium">Voting Status</h4>
                        <div className="mt-2 space-y-2">
                          <Progress value={getVotePercentage(selectedLoan)} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" /> {selectedLoan.votes?.filter(vote => vote.vote).length || 0} Yes
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsDown className="h-3 w-3" /> {selectedLoan.votes?.filter(vote => !vote.vote).length || 0} No
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {selectedLoan.votes?.length || 0} of {selectedLoan.totalMembers} votes cast
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedLoan(null)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>

            {loan.status === "PENDING" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Withdraw Request</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently withdraw your loan request. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleWithdrawRequest(loan.id)} disabled={isWithdrawing}>
                      {isWithdrawing ? "Withdrawing..." : "Withdraw Request"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {loan.status === "APPROVED" && (
              <Button variant="outline" disabled>
                Loan Active
              </Button>
            )}

            {loan.status === "REJECTED" && (
              <Button variant="outline" onClick={() => (window.location.href = "/loans?tab=new-request")}>
                Create New Request
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
