"use client"

import { useState, Suspense, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    Filter,
    TrendingUp,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    FileText,
    Users,
    UserPlus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { LoanRequestCard } from "./components/loan-request-card"
import { LoanRequestDetail } from "./components/loan-request-detail"
import { JoinRequestCard } from "./components/join-request-card"
import { JoinRequestDetail } from "./components/join-request-detail"
import { useJoinRequests, useJoinRequestStats } from "@/hooks/useJoinRequests"
import { useLoanRequests, useLoanRequestStats } from "@/hooks/useLoanRequests"
import { JoinRequestListSkeleton, JoinRequestDetailSkeleton } from "./components/join-request-skeleton"
import { LoanRequestListSkeleton, LoanRequestDetailSkeleton as LoanRequestDetailSkel } from "./components/loan-request-skeleton"

// Mock data
const mockStats = {
    totalRequests: 48,
    pendingRequests: 12,
    approvedRequests: 28,
    rejectedRequests: 8,
    totalAmount: 124500,
    avgApprovalRate: 73,
    activeVotes: 5,
    avgResponseTime: 2.4,
    totalJoinRequests: 24,
    pendingJoinRequests: 8,
    approvedJoinRequests: 14,
    rejectedJoinRequests: 2,
}

const mockGroups = [
    { id: "1", name: "Tech Innovators VSLA", members: 24 },
    { id: "2", name: "Community Builders", members: 18 },
    { id: "3", name: "Startup Fund Group", members: 32 },
]

const mockLoanRequests = [
    {
        id: "1",
        requester: {
            name: "Sarah Mwansa",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-1",
        },
        group: "Tech Innovators VSLA",
        groupId: "1",
        amount: 5000,
        purpose: "Business expansion - purchasing new equipment for my tailoring business to increase production capacity",
        repaymentDate: "2025-06-15",
        installments: 6,
        interestRate: 5,
        status: "PENDING" as const,
        createdAt: "2025-01-02",
        votes: {
            approve: 14,
            reject: 3,
            total: 24,
            threshold: 50,
        },
        memberVotes: [
            {
                id: "vote-1",
                memberId: "member-1",
                memberName: "John Mulenga",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                comment: "Great business plan, I support this request",
                votedAt: "2025-01-02T10:30:00Z",
            },
            {
                id: "vote-2",
                memberId: "member-2",
                memberName: "Mary Phiri",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-02T11:15:00Z",
            },
            {
                id: "vote-3",
                memberId: "member-3",
                memberName: "Peter Banda",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: false,
                comment: "I think the repayment period is too short",
                votedAt: "2025-01-02T14:20:00Z",
            },
            {
                id: "vote-4",
                memberId: "member-4",
                memberName: "Grace Lungu",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-03T09:00:00Z",
            },
            {
                id: "vote-5",
                memberId: "member-5",
                memberName: "David Tembo",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                comment: "She has been consistent with contributions",
                votedAt: "2025-01-03T10:45:00Z",
            },
            {
                id: "vote-6",
                memberId: "member-6",
                memberName: "Ruth Zulu",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-03T15:30:00Z",
            },
            {
                id: "vote-7",
                memberId: "member-7",
                memberName: "James Chanda",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: false,
                votedAt: "2025-01-04T08:20:00Z",
            },
            {
                id: "vote-8",
                memberId: "member-8",
                memberName: "Alice Mwale",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T11:00:00Z",
            },
            {
                id: "vote-9",
                memberId: "member-9",
                memberName: "Patrick Sakala",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T13:45:00Z",
            },
            {
                id: "vote-10",
                memberId: "member-10",
                memberName: "Esther Mbewe",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T16:00:00Z",
            },
            {
                id: "vote-11",
                memberId: "member-11",
                memberName: "Moses Kabwe",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T09:30:00Z",
            },
            {
                id: "vote-12",
                memberId: "member-12",
                memberName: "Hannah Siame",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T10:15:00Z",
            },
            {
                id: "vote-13",
                memberId: "member-13",
                memberName: "Daniel Phiri",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T14:00:00Z",
            },
            {
                id: "vote-14",
                memberId: "member-14",
                memberName: "Sarah Kunda",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T15:30:00Z",
            },
            {
                id: "vote-15",
                memberId: "member-15",
                memberName: "Joseph Mumba",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: false,
                comment: "Need more details about the business plan",
                votedAt: "2025-01-05T16:45:00Z",
            },
        ],
        currentUserVote: null,
        comments: 8,
    },
    {
        id: "2",
        requester: {
            name: "John Banda",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-2",
        },
        group: "Community Builders",
        groupId: "2",
        amount: 3500,
        purpose: "Medical emergency - urgent surgery required for family member",
        repaymentDate: "2025-05-20",
        installments: 4,
        interestRate: 3,
        status: "PENDING" as const,
        createdAt: "2025-01-03",
        votes: {
            approve: 12,
            reject: 2,
            total: 18,
            threshold: 50,
        },
        memberVotes: [
            {
                id: "vote-16",
                memberId: "member-20",
                memberName: "Linda Moyo",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                comment: "Medical emergencies should be prioritized",
                votedAt: "2025-01-03T11:00:00Z",
            },
            {
                id: "vote-17",
                memberId: "member-21",
                memberName: "Thomas Ngoma",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-03T12:30:00Z",
            },
            {
                id: "vote-18",
                memberId: "member-22",
                memberName: "Grace Nkhoma",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-03T14:00:00Z",
            },
            {
                id: "vote-19",
                memberId: "member-23",
                memberName: "Paul Chisanga",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: false,
                comment: "Would like to see medical documentation",
                votedAt: "2025-01-03T15:45:00Z",
            },
            {
                id: "vote-20",
                memberId: "member-24",
                memberName: "Betty Hara",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T09:00:00Z",
            },
            {
                id: "vote-21",
                memberId: "member-25",
                memberName: "Michael Sichone",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T10:30:00Z",
            },
            {
                id: "vote-22",
                memberId: "member-26",
                memberName: "Angela Mwanza",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T13:00:00Z",
            },
            {
                id: "vote-23",
                memberId: "member-27",
                memberName: "Christopher Banda",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T14:30:00Z",
            },
            {
                id: "vote-24",
                memberId: "member-28",
                memberName: "Jennifer Phiri",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-04T16:00:00Z",
            },
            {
                id: "vote-25",
                memberId: "member-29",
                memberName: "Kenneth Mulenga",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T08:30:00Z",
            },
            {
                id: "vote-26",
                memberId: "member-30",
                memberName: "Patricia Tembo",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T11:00:00Z",
            },
            {
                id: "vote-27",
                memberId: "member-31",
                memberName: "Richard Zulu",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: true,
                votedAt: "2025-01-05T13:30:00Z",
            },
            {
                id: "vote-28",
                memberId: "member-32",
                memberName: "Susan Chanda",
                memberAvatar: "/placeholder.svg?height=24&width=24",
                vote: false,
                votedAt: "2025-01-05T15:00:00Z",
            },
        ],
        currentUserVote: {
            vote: true,
            votedAt: "2025-01-03T16:30:00Z",
        },
        comments: 12,
    },
    {
        id: "3",
        requester: {
            name: "Grace Phiri",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-3",
        },
        group: "Startup Fund Group",
        groupId: "3",
        amount: 7500,
        purpose: "Education - professional certification course in digital marketing",
        repaymentDate: "2025-08-01",
        installments: 8,
        interestRate: 4,
        status: "APPROVED" as const,
        createdAt: "2024-12-28",
        votes: {
            approve: 25,
            reject: 4,
            total: 32,
            threshold: 50,
        },
        memberVotes: [],
        currentUserVote: null,
        comments: 15,
    },
    {
        id: "4",
        requester: {
            name: "Patrick Lungu",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-4",
        },
        group: "Tech Innovators VSLA",
        groupId: "1",
        amount: 2500,
        purpose: "Agricultural investment - seeds and fertilizer for farming season",
        repaymentDate: "2025-07-15",
        installments: 5,
        interestRate: 5,
        status: "REJECTED" as const,
        createdAt: "2024-12-20",
        votes: {
            approve: 8,
            reject: 14,
            total: 24,
            threshold: 50,
        },
        memberVotes: [],
        currentUserVote: null,
        comments: 6,
    },
]

const mockJoinRequests = [
    {
        id: "jr-1",
        user: {
            name: "David Zulu",
            email: "david.zulu@email.com",
            phone: "+260 977 123 456",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-10",
        },
        group: "Tech Innovators VSLA",
        groupId: "1",
        status: "PENDING" as const,
        createdAt: "2025-01-04",
        message:
            "I'm interested in joining your savings group. I have experience in tech and would like to contribute to the community while building my savings.",
    },
    {
        id: "jr-2",
        user: {
            name: "Maria Chipimo",
            email: "maria.chipimo@email.com",
            phone: "+260 966 789 012",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-11",
        },
        group: "Community Builders",
        groupId: "2",
        status: "PENDING" as const,
        createdAt: "2025-01-03",
        message:
            "I would love to be part of this group. I'm committed to regular contributions and active participation in group activities.",
    },
    {
        id: "jr-3",
        user: {
            name: "Joseph Mulenga",
            email: "joseph.mulenga@email.com",
            phone: "+260 955 345 678",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-12",
        },
        group: "Startup Fund Group",
        groupId: "3",
        status: "ACCEPTED" as const,
        createdAt: "2024-12-29",
        message: "Excited to join and collaborate with like-minded entrepreneurs.",
    },
    {
        id: "jr-4",
        user: {
            name: "Charity Banda",
            email: "charity.banda@email.com",
            phone: "+260 977 901 234",
            avatar: "/placeholder.svg?height=40&width=40",
            id: "user-13",
        },
        group: "Tech Innovators VSLA",
        groupId: "1",
        status: "DECLINED" as const,
        createdAt: "2024-12-25",
        message: "Looking forward to being part of this community.",
    },
]

// Join Requests Content Component (with data fetching)
function JoinRequestsContent({
    activeTab,
    searchQuery,
    selectedGroup,
    selectedJoinRequest,
    setSelectedJoinRequest,
    setSelectedRequest,
}: {
    activeTab: string
    searchQuery: string
    selectedGroup: string
    selectedJoinRequest: any
    setSelectedJoinRequest: (req: any) => void
    setSelectedRequest: (req: any) => void
}) {
    // Pagination state (only for approved tab)
    const [page, setPage] = useState(1)
    const pageSize = 10

    // Reset page when tab changes
    useEffect(() => {
        setPage(1)
    }, [activeTab])

    // Map frontend tab values to MembershipStatus enum values
    const getStatusForAPI = (tabStatus: string) => {
        if (tabStatus === "all") return undefined
        const statusMap: Record<string, string> = {
            pending: "PENDING",
            approved: "ACTIVE",
            rejected: "INACTIVE",
        }
        return statusMap[tabStatus.toLowerCase()] || tabStatus.toUpperCase()
    }

    // Fetch join requests from API with pagination for approved tab
    const statusParam = getStatusForAPI(activeTab)
    const isApprovedTab = activeTab === "approved"

    const { data, isLoading } = useJoinRequests({
        status: statusParam,
        groupId: selectedGroup === "all" ? undefined : selectedGroup,
        page: isApprovedTab ? page : undefined,
        pageSize: isApprovedTab ? pageSize : undefined,
    })

    // Extract data from response
    const joinRequests = data?.joinRequests || []
    const totalPages = data?.totalPages || 0
    const total = data?.total || 0

    // Client-side filtering for search
    const filteredJoinRequests = joinRequests.filter((request: any) => {
        if (!searchQuery) return true
        return (
            request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.message.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    if (isLoading) {
        return <JoinRequestListSkeleton />
    }

    if (filteredJoinRequests.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No join requests found</p>
            </div>
        )
    }

    return (
        <>
            {filteredJoinRequests.map((request: any) => (
                <JoinRequestCard
                    key={request.id}
                    request={request}
                    onClick={() => {
                        setSelectedJoinRequest(request)
                        setSelectedRequest(null)
                    }}
                    isSelected={selectedJoinRequest?.id === request.id}
                />
            ))}

            {/* Pagination - Only show for approved tab */}
            {isApprovedTab && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages} ({total} total)
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

// Loan Requests Content Component (with data fetching)
function LoanRequestsContent({
    activeTab,
    searchQuery,
    selectedGroup,
    selectedRequest,
    setSelectedRequest,
    setSelectedJoinRequest,
}: {
    activeTab: string
    searchQuery: string
    selectedGroup: string
    selectedRequest: any
    setSelectedRequest: (req: any) => void
    setSelectedJoinRequest: (req: any) => void
}) {
    // Map frontend tab values to LoanStatus enum values
    const getStatusForAPI = (tabStatus: string) => {
        if (tabStatus === "all") return undefined
        const statusMap: Record<string, string> = {
            pending: "PENDING",
            approved: "APPROVED",
            rejected: "REJECTED",
        }
        return statusMap[tabStatus.toLowerCase()] || tabStatus.toUpperCase()
    }

    // Fetch loan requests from API
    const statusParam = getStatusForAPI(activeTab)
    const { data, isLoading } = useLoanRequests({
        status: statusParam,
        groupId: selectedGroup === "all" ? undefined : selectedGroup,
    })

    // Extract data from response
    const loanRequests = data?.loanRequests || []

    // Client-side filtering for search
    const filteredLoanRequests = loanRequests.filter((request: any) => {
        if (!searchQuery) return true
        return (
            request.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.purpose.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    if (isLoading) {
        return <LoanRequestListSkeleton />
    }

    if (filteredLoanRequests.length === 0) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No loan requests found</p>
            </div>
        )
    }

    return (
        <>
            {filteredLoanRequests.map((request: any) => (
                <LoanRequestCard
                    key={request.id}
                    request={request}
                    onClick={() => {
                        setSelectedRequest(request)
                        setSelectedJoinRequest(null)
                    }}
                    isSelected={selectedRequest?.id === request.id}
                />
            ))}
        </>
    )
}

export default function GroupRequestsPage() {
    const [selectedRequest, setSelectedRequest] = useState<(typeof mockLoanRequests)[0] | null>(null)
    const [selectedJoinRequest, setSelectedJoinRequest] = useState<any>(null)
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGroup, setSelectedGroup] = useState("all")
    const [requestType, setRequestType] = useState<"loans" | "joins">("loans")

    // Fetch stats for both loan and join requests
    const { data: joinRequestStats } = useJoinRequestStats()
    const { data: loanRequestStats } = useLoanRequestStats()

    const filteredRequests = mockLoanRequests.filter((request) => {
        const matchesTab = activeTab === "all" || request.status.toLowerCase() === activeTab
        const matchesSearch =
            request.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.purpose.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesGroup = selectedGroup === "all" || request.groupId === selectedGroup
        return matchesTab && matchesSearch && matchesGroup
    })

    // Use stats from API for both request types
    const displayStats = requestType === "joins" && joinRequestStats
        ? joinRequestStats
        : requestType === "loans" && loanRequestStats
            ? loanRequestStats
            : mockStats

    // Get the correct property names based on request type
    const statsProps = requestType === "loans"
        ? {
            total: displayStats.totalLoanRequests ?? displayStats.totalRequests ?? 0,
            pending: displayStats.pendingLoanRequests ?? displayStats.pendingRequests ?? 0,
            approved: displayStats.approvedLoanRequests ?? displayStats.approvedRequests ?? 0,
            totalAmount: (displayStats as any).totalAmount ?? 0,
            avgApprovalRate: (displayStats as any).avgApprovalRate ?? 0,
        }
        : {
            total: displayStats.totalJoinRequests ?? displayStats.totalRequests ?? 0,
            pending: displayStats.pendingJoinRequests ?? displayStats.pendingRequests ?? 0,
            approved: displayStats.approvedJoinRequests ?? displayStats.approvedRequests ?? 0,
            totalAmount: 0,
            avgApprovalRate: 0,
        }

    // Helper function to format currency in K notation
    const formatCurrency = (amount: number) => {
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`
        }
        return amount.toString()
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground">Group Requests</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage loan requests and member join requests from your groups
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Groups" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Groups</SelectItem>
                                    {mockGroups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                <div className="mb-6">
                    <Tabs value={requestType} onValueChange={(v) => setRequestType(v as "loans" | "joins")} className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="loans" className="gap-2">
                                <DollarSign className="h-4 w-4" />
                                Loan Requests
                            </TabsTrigger>
                            <TabsTrigger value="joins" className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Join Requests
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {requestType === "loans" ? (
                        <>
                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">{statsProps.total}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <TrendingUp className="h-3 w-3 text-accent" />
                                                <span className="text-xs text-accent">+12.5%</span>
                                                <span className="text-xs text-muted-foreground">vs last month</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">{statsProps.pending}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Clock className="h-3 w-3 text-chart-3" />
                                                <span className="text-xs text-muted-foreground">awaiting approval</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-chart-3/10">
                                            <Clock className="h-5 w-5 text-chart-3" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">
                                                K{formatCurrency(statsProps.totalAmount)}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <ArrowUpRight className="h-3 w-3 text-accent" />
                                                <span className="text-xs text-accent">$28.5K</span>
                                                <span className="text-xs text-muted-foreground">this month</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-accent/10">
                                            <DollarSign className="h-5 w-5 text-accent" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">{statsProps.avgApprovalRate || 0}%</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Progress value={statsProps.avgApprovalRate || 0} className="h-1 w-20" />
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">{statsProps.total}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <TrendingUp className="h-3 w-3 text-accent" />
                                                <span className="text-xs text-accent">+8.3%</span>
                                                <span className="text-xs text-muted-foreground">vs last month</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">{statsProps.pending}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Clock className="h-3 w-3 text-chart-3" />
                                                <span className="text-xs text-muted-foreground">awaiting approval</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-chart-3/10">
                                            <Clock className="h-5 w-5 text-chart-3" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">{statsProps.approved}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <CheckCircle2 className="h-3 w-3 text-accent" />
                                                <span className="text-xs text-muted-foreground">new members</span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-accent/10">
                                            <CheckCircle2 className="h-5 w-5 text-accent" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Acceptance Rate</p>
                                            <p className="text-3xl font-semibold mt-2 text-foreground">
                                                {statsProps.total > 0
                                                    ? Math.round((statsProps.approved / statsProps.total) * 100)
                                                    : 0}%
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Progress
                                                    value={
                                                        statsProps.total > 0
                                                            ? (statsProps.approved / statsProps.total) * 100
                                                            : 0
                                                    }
                                                    className="h-1 w-20"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <UserPlus className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Requests List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{requestType === "loans" ? "Loan Requests" : "Join Requests"}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {requestType === "loans"
                                                ? "Review and manage loan applications from group members"
                                                : "Review and approve new member applications"}
                                        </CardDescription>
                                    </div>
                                </div>

                                {/* Search and Tabs */}
                                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={
                                                requestType === "loans" ? "Search by name or purpose..." : "Search by name or email..."
                                            }
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="pending">Pending</TabsTrigger>
                                    <TabsTrigger value="approved">{requestType === "loans" ? "Approved" : "Accepted"}</TabsTrigger>
                                    <TabsTrigger value="rejected">{requestType === "loans" ? "Rejected" : "Declined"}</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {requestType === "loans" ? (
                                        <Suspense fallback={<LoanRequestListSkeleton />}>
                                            <LoanRequestsContent
                                                activeTab={activeTab}
                                                searchQuery={searchQuery}
                                                selectedGroup={selectedGroup}
                                                selectedRequest={selectedRequest}
                                                setSelectedRequest={setSelectedRequest}
                                                setSelectedJoinRequest={setSelectedJoinRequest}
                                            />
                                        </Suspense>
                                    ) : (
                                        <Suspense fallback={<JoinRequestListSkeleton />}>
                                            <JoinRequestsContent
                                                activeTab={activeTab}
                                                searchQuery={searchQuery}
                                                selectedGroup={selectedGroup}
                                                selectedJoinRequest={selectedJoinRequest}
                                                setSelectedJoinRequest={setSelectedJoinRequest}
                                                setSelectedRequest={setSelectedRequest}
                                            />
                                        </Suspense>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-1">
                        {selectedRequest ? (
                            <LoanRequestDetail
                                request={selectedRequest}
                                onMutationSuccess={() => setSelectedRequest(null)}
                            />
                        ) : selectedJoinRequest ? (
                            <Suspense fallback={<JoinRequestDetailSkeleton />}>
                                <JoinRequestDetail
                                    request={selectedJoinRequest}
                                    onMutationSuccess={() => setSelectedJoinRequest(null)}
                                />
                            </Suspense>
                        ) : (
                            <Card className="bg-card border-border">
                                <CardContent className="pt-12 pb-12 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">
                                        Select a request to view details
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
