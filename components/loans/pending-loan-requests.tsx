"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  DollarSign,
  Clock,
  Search,
  BarChart4,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Hourglass,
  CircleDollarSign,
  Tag,
  ListFilter,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { formatErrorForToast } from "@/lib/error-messages"

// Default values for loan requests
const defaultLoanRequest = {
  userRating: 0,
  userLoanHistory: 0,
  votesYes: 0,
  votesNo: 0,
  totalVotes: 0,
  votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  userHasVoted: false,
  documents: [],
  riskScore: "MEDIUM",
  creditScore: 0,
  aiInsights: [],
  comments: [],
  timeline: [],
  financialHealth: {
    contributionConsistency: 0,
    savingsRatio: 0,
    debtToIncome: 0,
    monthlyIncome: 0,
  },
  tags: [],
}

export default function PendingLoanRequests() {
  const router = useRouter()
  const [loanRequests, setLoanRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [isLoanDetailsOpen, setIsLoanDetailsOpen] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [votingLoanId, setVotingLoanId] = useState(null)
  const [voteSuccess, setVoteSuccess] = useState(false)
  const [voteError, setVoteError] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [riskFilter, setRiskFilter] = useState("all")
  const [amountRange, setAmountRange] = useState([0, 5000])
  const [selectedLoans, setSelectedLoans] = useState([])
  const [viewMode, setViewMode] = useState("card")
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Mock groups - in a real app, fetch from API
  const groups = [
    { id: "all", name: "All Groups" },
    { id: "group1", name: "Savings Group A" },
    { id: "group2", name: "Investment Club B" },
    { id: "group3", name: "Community Cooperative" },
  ]

  // Handle voting on a loan request
  const handleVote = async (loanId, voteValue) => {
    try {
      setIsVoting(true);
      setVotingLoanId(loanId);
      setVoteError(null);

      const response = await fetch('/api/loans', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanRequestId: loanId,
          vote: voteValue === 'YES', // true for YES, false for NO
          comment: '', // Optional comment
        }),
      });

      if (!response.ok) {
        throw new Error(`Error voting on loan request: ${response.status}`);
      }

      // Get the vote, loan request, and total members data from the response
      const responseData = await response.json();
      const { vote: voteData, loanRequest: updatedLoanRequestData, totalMembers } = responseData;

      // Vote successful
      setVoteSuccess(true);
      toast.success("Vote Recorded", {
        description: "Your vote has been recorded successfully. The loan status will update when majority is reached."
      });

      // Update the local state to reflect the vote and updated loan request
      setLoanRequests(prevRequests => 
        prevRequests.map(loan => {
          if (loan.id === loanId) {
            // Create updated loan with data from the API response
            const updatedLoan = { ...loan };

            // Update vote counts from the API response
            const yesVotes = updatedLoanRequestData.votes?.filter(vote => vote.vote === true).length || 0;
            const noVotes = updatedLoanRequestData.votes?.filter(vote => vote.vote === false).length || 0;

            updatedLoan.votesYes = yesVotes;
            updatedLoan.votesNo = noVotes;
            updatedLoan.userHasVoted = true;
            updatedLoan.userVote = voteValue;
            updatedLoan.status = updatedLoanRequestData.status;
            // Update totalVotes with the totalMembers count from the API response
            if (totalMembers) {
              updatedLoan.totalVotes = totalMembers;
            }

            return updatedLoan;
          }
          return loan;
        })
      );

      // Close the loan details dialog if it's open
      if (isLoanDetailsOpen) {
        setIsLoanDetailsOpen(false);
      }

      // Refresh the loan requests immediately
      fetchLoanRequests();

    } catch (err) {
      console.error('Error voting on loan request:', err);
      const errorInfo = formatErrorForToast(err, 'vote');
      toast.error(errorInfo.title, {
        description: errorInfo.description
      });
      setVoteError(errorInfo.description);
    } finally {
      setIsVoting(false);
      setVotingLoanId(null);

      // Reset success message after a delay
      if (voteSuccess) {
        setTimeout(() => {
          setVoteSuccess(false);
        }, 3000);
      }
    }
  };

  // Fetch loan requests from API
  const fetchLoanRequests = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/loans?tab=pending')

      if (!response.ok) {
        throw new Error(`Error fetching loan requests: ${response.status}`)
      }

      const data = await response.json()

      // Transform API data to match component's expected format
      const transformedData = data.map(loan => {
        // Calculate votes
        const yesVotes = loan.votes?.filter(vote => vote.vote === true).length || 0
        const noVotes = loan.votes?.filter(vote => vote.vote === false).length || 0
        // Use totalMembers from API response if available, otherwise fallback to group members length
        const totalVotes = loan.totalMembers || loan.group?.members?.length || 0

        // Check if current user has voted - use the flag from the API response
        const userHasVoted = loan.userHasVoted || false
        // Get the user's vote value from the API response
        const userVote = loan.userVote === true ? 'YES' : loan.userVote === false ? 'NO' : null

        // Calculate voting deadline (7 days from creation by default)
        const votingDeadline = new Date(new Date(loan.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000)

        return {
          ...defaultLoanRequest,
          id: loan.id,
          userId: loan.userId,
          userName: loan.user?.name || 'Unknown User',
          userAvatar: loan.user?.avatar || '/placeholder.svg',
          groupId: loan.groupId,
          groupName: loan.group?.name || 'Unknown Group',
          amount: loan.amount,
          purpose: loan.purpose,
          repaymentDate: new Date(loan.repaymentDate),
          repaymentTerms: loan.repaymentTerms,
          createdAt: new Date(loan.createdAt),
          status: loan.status,
          votesYes: yesVotes,
          votesNo: noVotes,
          totalVotes: totalVotes,
          votingDeadline: votingDeadline,
          userHasVoted: userHasVoted,
          userVote: userVote,
          // Add other fields with defaults or actual values if available
          riskScore: loan.riskScore || "MEDIUM",
          tags: loan.tags?.split(',') || []
        }
      })

      setLoanRequests(transformedData)
    } catch (err) {
      console.error('Error fetching loan requests:', err)
      const errorInfo = formatErrorForToast(err, 'fetch');
      toast.error(errorInfo.title, {
        description: errorInfo.description
      });
      setError(errorInfo.description)
    } finally {
      setIsLoading(false)
    }
  }

  // Load loan requests on component mount
  useEffect(() => {
    fetchLoanRequests()
  }, [])

  // All unique tags from loan requests
  const allTags = Array.from(new Set(loanRequests.flatMap((loan) => loan.tags || [])))

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMK",
    }).format(amount)
  }

  const getDaysRemaining = (date) => {
    const now = new Date()
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diffInDays
  }

  const getVotePercentage = (loan) => {
    const totalVotesCast = loan.votesYes + loan.votesNo
    if (totalVotesCast === 0) return 0
    return Math.round((loan.votesYes / totalVotesCast) * 100)
  }

  const getVoteStatus = (loan) => {
    const percentage = getVotePercentage(loan)
    if (percentage > 50) return "PASSING"
    if (percentage < 50) return "FAILING"
    return "TIED"
  }

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "LOW":
        return (
          <Badge
            variant="outline"
            className="bg-success/20 text-success border-success/50"
          >
            <ShieldCheck className="mr-1 h-3 w-3" /> Low Risk
          </Badge>
        )
      case "MEDIUM":
        return (
          <Badge
            variant="outline"
            className="bg-warning/20 text-warning-foreground border-warning/50"
          >
            <ShieldAlert className="mr-1 h-3 w-3" /> Medium Risk
          </Badge>
        )
      case "HIGH":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/20 text-destructive border-destructive/50"
          >
            <ShieldAlert className="mr-1 h-3 w-3" /> High Risk
          </Badge>
        )
      default:
        return null
    }
  }

  // Filter loans based on selected filters
  const filteredLoans = loanRequests.filter((loan) => {
    // Filter by group
    if (selectedGroup !== "all" && loan.groupId !== selectedGroup) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = loan.userName.toLowerCase().includes(query)
      const matchesPurpose = loan.purpose.toLowerCase().includes(query)
      const matchesGroup = loan.groupName.toLowerCase().includes(query)
      const matchesAmount = loan.amount.toString().includes(query)

      if (!(matchesName || matchesPurpose || matchesGroup || matchesAmount)) {
        return false
      }
    }

    // Filter by tags
    if (selectedTags.length > 0 && (!loan.tags || !selectedTags.some((tag) => loan.tags.includes(tag)))) {
      return false
    }

    // Filter by risk
    if (riskFilter !== "all" && loan.riskScore !== riskFilter) {
      return false
    }

    // Filter by priority
    if (priorityFilter !== "all" && loan.priority !== priorityFilter) {
      return false
    }

    // Filter by amount range
    if (loan.amount < amountRange[0] || loan.amount > amountRange[1]) {
      return false
    }

    return true
  })

  // Sort filtered loans
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else if (sortBy === "amount-high") {
      return b.amount - a.amount
    } else if (sortBy === "amount-low") {
      return a.amount - b.amount
    } else if (sortBy === "deadline") {
      return new Date(a.votingDeadline).getTime() - new Date(b.votingDeadline).getTime()
    } else if (sortBy === "votes") {
      return b.votesYes + b.votesNo - (a.votesYes + a.votesNo)
    } else if (sortBy === "risk-high") {
      const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      return riskOrder[b.riskScore] - riskOrder[a.riskScore]
    } else if (sortBy === "risk-low") {
      const riskOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 }
      return riskOrder[a.riskScore] - riskOrder[b.riskScore]
    } else if (sortBy === "priority") {
      const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1, undefined: 0 }
      return (
        (priorityOrder[b.priority] || 0) -
        (priorityOrder[a.priority] || 0)
      )
    }
    return 0
  })

  if (isLoading) {
    return (
      <Card className="border border-border shadow-md rounded-xl bg-card">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Hourglass className="h-12 w-12 text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground text-center">
            Loading pending loan requests...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border border-border shadow-md rounded-xl bg-card">
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg text-foreground">Unable to Load Requests</h3>
            <p className="text-muted-foreground max-w-md">
              {error}
            </p>
          </div>
          <Button variant="outline" className="mt-4 rounded-md" onClick={() => fetchLoanRequests()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (sortedLoans.length === 0) {
    return (
      <Card className="border border-border shadow-md rounded-xl bg-card">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            There are no pending loan requests to vote on at this time.
          </p>
          <Button variant="outline" className="mt-4 rounded-md">
            Create a loan request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Vote Success/Error Notification */}
      {(voteSuccess || voteError) && (
        <div className={cn(
          "p-4 rounded-lg mb-4 flex items-center justify-between",
          voteSuccess ? "bg-success/20 text-success border border-success/50" 
                      : "bg-destructive/20 text-destructive border border-destructive/50"
        )}>
          <div className="flex items-center">
            {voteSuccess ? (
              <CheckCircle2 className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>
              {voteSuccess 
                ? "Your vote has been recorded successfully. The loan status will update if enough votes have been cast." 
                : `Error: ${voteError}`}
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => {
              setVoteSuccess(false);
              setVoteError(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">
              Pending Loan Requests
            </h2>
            <Badge variant="secondary" className="rounded-full">
              {filteredLoans.length}
            </Badge>
            {selectedLoans.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-muted">
                {selectedLoans.length} selected
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search loans..."
                className="w-full sm:w-[200px] pl-8 border-border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-between sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "rounded-md border-border w-full sm:w-auto",
                  showFilters && "bg-muted text-foreground"
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <ListFilter className="h-4 w-4 mr-1.5" />
                <span>Filters</span>
                <ChevronDown className="h-4 w-4 ml-1.5 transition-transform duration-200" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-md border-border">
                    <ArrowUpDown className="h-4 w-4 mr-1.5" />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSortBy("deadline")}
                    className={sortBy === "deadline" ? "bg-muted" : ""}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Deadline (Soonest)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("newest")}
                    className={sortBy === "newest" ? "bg-muted" : ""}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    <span>Newest First</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-md border-border">
                    <BarChart4 className="h-4 w-4 mr-1.5" />
                    <span>View</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setViewMode("card")}
                    className={viewMode === "card" ? "bg-muted" : ""}
                  >
                    <div className="grid grid-cols-2 gap-1 mr-2">
                      <div className="h-2 w-2 rounded-sm bg-current"></div>
                      <div className="h-2 w-2 rounded-sm bg-current"></div>
                      <div className="h-2 w-2 rounded-sm bg-current"></div>
                      <div className="h-2 w-2 rounded-sm bg-current"></div>
                    </div>
                    <span>Card View</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-muted" : ""}
                  >
                    <div className="flex flex-col gap-1 mr-2">
                      <div className="h-1 w-4 rounded-sm bg-current"></div>
                      <div className="h-1 w-4 rounded-sm bg-current"></div>
                      <div className="h-1 w-4 rounded-sm bg-current"></div>
                    </div>
                    <span>List View</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Requests */}
      <div className="space-y-6">
        {viewMode === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedLoans.map((loan) => (
              <Card
                key={loan.id}
                className={cn(
                  "overflow-hidden border hover:shadow-md transition-all duration-200 rounded-xl border-border bg-card",
                  selectedLoans.includes(loan.id) && "ring-2 ring-primary"
                )}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-sm overflow-hidden">
                          {loan.userAvatar ? (
                            <img src={loan.userAvatar || "/placeholder.svg"} alt={loan.userName} className="w-full h-full object-cover" />
                          ) : (
                            loan.userName.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        {loan.priority === "HIGH" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground flex items-center gap-1">
                          {loan.userName}
                          <span className="text-xs font-normal text-warning flex items-center ml-1">
                            {loan.userRating}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-3 h-3 ml-0.5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground">{loan.groupName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          getVoteStatus(loan) === "PASSING" 
                            ? "default" 
                            : getVoteStatus(loan) === "FAILING"
                              ? "secondary"
                              : "outline" // For TIED status
                        }
                        className={cn(
                          "rounded-full px-2 py-0 text-xs",
                          getVoteStatus(loan) === "TIED" && "bg-primary/20 text-primary border-primary/50"
                        )}
                      >
                        {getVoteStatus(loan)}
                      </Badge>
                      {getRiskBadge(loan.riskScore)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Amount</span>
                      <span className="font-medium text-sm flex items-center gap-1 text-foreground">
                        {/*<DollarSign className="h-3 w-3 text-success" />*/}
                        {formatCurrency(loan.amount)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Voting Ends</span>
                      <span className="font-medium flex items-center gap-1 text-xs text-foreground">
                        <Clock className="h-3 w-3 text-warning" />
                        {getDaysRemaining(loan.votingDeadline) <= 1 
                          ? "Today" 
                          : `${getDaysRemaining(loan.votingDeadline)} days`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{loan.purpose}</p>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">Voting Progress</span>
                      <span className="text-foreground">
                        {loan.votesYes + loan.votesNo} of {loan.totalVotes}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-success">Yes: {loan.votesYes}</span>
                      <span className="text-destructive">No: {loan.votesNo}</span>
                      <span className="text-muted-foreground">Remaining: {loan.totalVotes - (loan.votesYes + loan.votesNo)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-1">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          getVoteStatus(loan) === "PASSING"
                            ? "bg-success"
                            : getVoteStatus(loan) === "FAILING"
                              ? "bg-warning"
                              : "bg-primary" // For TIED status
                        )}
                        style={{ width: `${getVotePercentage(loan)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-md border-border text-foreground"
                      onClick={() => {
                        setSelectedLoan(loan)
                        setIsLoanDetailsOpen(true)
                      }}
                    >
                      View Details
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        disabled={loan.userHasVoted || isVoting}
                        onClick={() => handleVote(loan.id, 'NO')}
                      >
                        {isVoting && votingLoanId === loan.id ? 'Voting...' : 'No'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md border-success/50 bg-success/10 text-success hover:bg-success/20"
                        disabled={loan.userHasVoted || isVoting}
                        onClick={() => handleVote(loan.id, 'YES')}
                      >
                        {isVoting && votingLoanId === loan.id ? 'Voting...' : 'Yes'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Loan Details Dialog */}
      <Dialog open={isLoanDetailsOpen} onOpenChange={setIsLoanDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedLoan && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Loan Request Details</DialogTitle>
                <DialogDescription>
                  Review the details of this loan request before voting.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Requester</h3>
                    <div className="flex items-center mt-1">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground font-medium text-sm overflow-hidden mr-2">
                        {selectedLoan.userAvatar ? (
                          <img src={selectedLoan.userAvatar} alt={selectedLoan.userName} className="w-full h-full object-cover" />
                        ) : (
                          selectedLoan.userName.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{selectedLoan.userName}</p>
                        <p className="text-xs text-muted-foreground">Member of {selectedLoan.groupName}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Loan Amount</h3>
                    <p className="text-lg font-semibold text-foreground mt-1">{formatCurrency(selectedLoan.amount)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Purpose</h3>
                    <p className="text-foreground mt-1">{selectedLoan.purpose}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Repayment Date</h3>
                    <p className="text-foreground mt-1">
                      {selectedLoan.repaymentDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Repayment Terms</h3>
                    <p className="text-slate-900 dark:text-white mt-1">{selectedLoan.repaymentTerms || "Not specified"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Voting Status</h3>
                    <div className="mt-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-300">
                          {getVotePercentage(selectedLoan)}% Approval
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {selectedLoan.votesYes + selectedLoan.votesNo} of {selectedLoan.totalVotes} votes
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded-md">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Yes Votes</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-medium">{selectedLoan.votesYes}</div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950 p-2 rounded-md">
                          <div className="text-xs text-slate-500 dark:text-slate-400">No Votes</div>
                          <div className="text-red-600 dark:text-red-400 font-medium">{selectedLoan.votesNo}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-md">
                          <div className="text-xs text-slate-500 dark:text-slate-400">Remaining</div>
                          <div className="text-slate-600 dark:text-slate-400 font-medium">{selectedLoan.totalVotes - (selectedLoan.votesYes + selectedLoan.votesNo)}</div>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            getVoteStatus(selectedLoan) === "PASSING"
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                              : getVoteStatus(selectedLoan) === "FAILING"
                                ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                : "bg-gradient-to-r from-blue-500 to-blue-400" // For TIED status
                          )}
                          style={{ width: `${getVotePercentage(selectedLoan)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Voting Deadline</h3>
                    <p className="text-slate-900 dark:text-white mt-1">
                      {selectedLoan.votingDeadline.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} ({getDaysRemaining(selectedLoan.votingDeadline)} days remaining)
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Risk Assessment</h3>
                    <div className="mt-1">
                      {getRiskBadge(selectedLoan.riskScore)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created On</h3>
                    <p className="text-foreground mt-1">
                      {selectedLoan.createdAt.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center">
                <div>
                  {selectedLoan.userHasVoted ? (
                    <Badge variant="outline" className="bg-muted">
                      You have already voted
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Cast your vote on this loan request
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  {!selectedLoan.userHasVoted && (
                    <>
                      <Button 
                        variant="outline"
                        className="border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20"
                        disabled={isVoting}
                        onClick={() => {
                          handleVote(selectedLoan.id, 'NO');
                        }}
                      >
                        {isVoting && votingLoanId === selectedLoan.id ? 'Voting...' : 'Vote No'}
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-success/50 bg-success/10 text-success hover:bg-success/20"
                        disabled={isVoting}
                        onClick={() => {
                          handleVote(selectedLoan.id, 'YES');
                        }}
                      >
                        {isVoting && votingLoanId === selectedLoan.id ? 'Voting...' : 'Vote Yes'}
                      </Button>
                    </>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
