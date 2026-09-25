"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, Clock, Calendar, MessageSquare, AlertCircle, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutateLoanRequest } from "@/hooks/useLoanRequests"

interface LoanRequest {
    id: string
    requester: {
        name: string
        avatar: string
        id: string
    }
    group: string
    amount: number
    purpose: string
    repaymentDate: string
    installments: number
    interestRate: number
    status: "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED"
    createdAt: string
    votes: {
        approve: number
        reject: number
        totalVoted?: number  // Total votes cast so far
        totalMembers: number  // Total active members in group
        majorityNeeded: number  // Number of votes needed for majority
        // Legacy support
        total?: number
        threshold?: number
    }
    comments: number
}

interface LoanRequestDetailProps {
    request: LoanRequest
    onMutationSuccess?: () => void
}

export function LoanRequestDetail({ request, onMutationSuccess }: LoanRequestDetailProps) {
    const { mutate: mutateLoanRequest, isPending, variables } = useMutateLoanRequest()

    const handleApprove = () => {
        mutateLoanRequest(
            { id: request.id, action: "APPROVE" },
            {
                onSuccess: () => {
                    onMutationSuccess?.()
                },
            }
        )
    }

    const handleReject = () => {
        mutateLoanRequest(
            { id: request.id, action: "REJECT" },
            {
                onSuccess: () => {
                    onMutationSuccess?.()
                },
            }
        )
    }

    // Support both new and legacy field names
    const totalMembers = request.votes.totalMembers ?? request.votes.total ?? 1
    const majorityNeeded = request.votes.majorityNeeded ?? request.votes.threshold ?? Math.floor(totalMembers / 2) + 1
    const totalVoted = request.votes.totalVoted ?? (request.votes.approve + request.votes.reject)
    
    const approvalPercentage = totalMembers > 0
        ? (request.votes.approve / totalMembers) * 100
        : 0
    const votingProgress = totalMembers > 0
        ? (totalVoted / totalMembers) * 100
        : 0
    const monthlyPayment = (request.amount * (1 + request.interestRate / 100)) / request.installments

    // Helper function to format currency in K notation
    const formatCurrency = (amount: number) => {
        if (amount >= 1000) {
            return `${(amount / 1000).toFixed(1)}K`
        }
        return amount.toString()
    }

    const statusConfig = {
        PENDING: {
            badge: "default",
            icon: Clock,
            color: "text-chart-3",
            bg: "bg-chart-3/10",
        },
        APPROVED: {
            badge: "default",
            icon: CheckCircle2,
            color: "text-accent",
            bg: "bg-accent/10",
        },
        REJECTED: {
            badge: "destructive",
            icon: XCircle,
            color: "text-destructive",
            bg: "bg-destructive/10",
        },
        DISBURSED: {
            badge: "default",
            icon: CheckCircle2,
            color: "text-primary",
            bg: "bg-primary/10",
        },
    }

    const config = statusConfig[request.status]
    const StatusIcon = config.icon

    return (
        <div className="space-y-4">
            <Card className="bg-card border-border">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">Request Details</CardTitle>
                            <CardDescription className="mt-1">
                                Submitted {new Date(request.createdAt).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <Badge variant={config.badge as any} className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {request.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Requester Info */}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border border-border">
                            <AvatarImage src={request.requester.avatar || "/placeholder.svg"} alt={request.requester.name} />
                            <AvatarFallback>
                                {request.requester.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-foreground">{request.requester.name}</h3>
                            <p className="text-sm text-muted-foreground">{request.group}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Loan Details */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Loan Purpose</h4>
                            <p className="text-sm text-foreground leading-relaxed">{request.purpose}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs text-muted-foreground mb-1">Amount</h4>
                                <p className="text-xl font-semibold text-foreground">K{formatCurrency(request.amount)}</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-muted-foreground mb-1">Interest Rate</h4>
                                <p className="text-xl font-semibold text-foreground">{request.interestRate}%</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs text-muted-foreground mb-1">Installments</h4>
                                <p className="text-base font-medium text-foreground">{request.installments} months</p>
                            </div>
                            <div>
                                <h4 className="text-xs text-muted-foreground mb-1">Monthly Payment</h4>
                                <p className="text-base font-medium text-foreground">K{monthlyPayment.toFixed(2)}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs text-muted-foreground mb-1">Repayment Date</h4>
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(request.repaymentDate).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                    </div>

                    {request.status === "PENDING" && (
                        <>
                            <Separator />

                            {/* Voting Progress */}
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-foreground">Voting Progress</h4>
                                        <span className="text-sm text-muted-foreground">
                                            {totalVoted} / {totalMembers} members voted
                                        </span>
                                    </div>
                                    <Progress value={votingProgress} className="h-2 mb-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Requires {majorityNeeded} votes (majority of {totalMembers} members) to approve or reject
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className={cn("p-3 rounded-lg", "bg-accent/10 border border-accent/20")}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-dark">Approve</span>
                                            <CheckCircle2 className="h-4 w-4 text-dark" />
                                        </div>
                                        <p className="text-2xl font-semibold text-dark">
                                            {request.votes.approve} / {majorityNeeded}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {totalMembers > 0
                                                ? ((request.votes.approve / totalMembers) * 100).toFixed(0)
                                                : 0}% of members
                                        </p>
                                    </div>
                                    <div className={cn("p-3 rounded-lg", "bg-destructive/10 border border-destructive/20")}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-destructive">Reject</span>
                                            <XCircle className="h-4 w-4 text-destructive" />
                                        </div>
                                        <p className="text-2xl font-semibold text-destructive">
                                            {request.votes.reject} / {majorityNeeded}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {totalMembers > 0
                                                ? ((request.votes.reject / totalMembers) * 100).toFixed(0)
                                                : 0}% of members
                                        </p>
                                    </div>
                                </div>

                                {request.votes.approve >= majorityNeeded ? (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-accent">✅ Majority approval reached!</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {request.votes.approve} out of {totalMembers} members voted to approve
                                            </p>
                                        </div>
                                    </div>
                                ) : request.votes.reject >= majorityNeeded ? (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-destructive">❌ Majority rejection reached</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {request.votes.reject} out of {totalMembers} members voted to reject
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted border border-border">
                                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">⏳ Voting in progress</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Need {majorityNeeded - Math.max(request.votes.approve, request.votes.reject)} more vote(s) to reach majority
                                                ({totalVoted}/{totalMembers} members have voted)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Member Voting Actions */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-foreground">Cast Your Vote</h4>
                                <p className="text-xs text-muted-foreground">
                                    As a group member, your vote counts towards the majority decision
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={handleApprove}
                                        disabled={isPending}
                                    >
                                        {isPending && variables?.action === "APPROVE" ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <ThumbsUp className="h-4 w-4 mr-2" />
                                                Vote Approve
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={handleReject}
                                        disabled={isPending}
                                    >
                                        {isPending && variables?.action === "REJECT" ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <ThumbsDown className="h-4 w-4 mr-2" />
                                                Vote Reject
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Comments ({request.comments})
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-sm">Repayment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Principal</span>
                        <span className="font-medium text-foreground">K{formatCurrency(request.amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Interest ({request.interestRate}%)</span>
                        <span className="font-medium text-foreground">
                            K{formatCurrency((request.amount * request.interestRate) / 100)}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">Total Repayment</span>
                        <span className="text-lg font-semibold text-foreground">
                            K{(request.amount * (1 + request.interestRate / 100)).toFixed(2)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
