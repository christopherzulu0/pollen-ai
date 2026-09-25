"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, DollarSign, MessageSquare, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
    totalVoted?: number       // Total votes cast so far
    totalMembers: number      // Total active members in group
    majorityNeeded: number    // Number of votes needed for majority
    // Legacy support
    total?: number
    threshold?: number
  }
  comments: number
}

interface LoanRequestCardProps {
  request: LoanRequest
  onClick: () => void
  isSelected: boolean
}

export function LoanRequestCard({ request, onClick, isSelected }: LoanRequestCardProps) {
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

  const statusConfig = {
    PENDING: {
      badge: "default",
      icon: Clock,
      color: "text-warning-foreground",
    },
    APPROVED: {
      badge: "default",
      icon: CheckCircle2,
      color: "text-success",
    },
    REJECTED: {
      badge: "destructive",
      icon: XCircle,
      color: "text-destructive",
    },
    DISBURSED: {
      badge: "default",
      icon: CheckCircle2,
      color: "text-primary",
    },
  }

  const config = statusConfig[request.status]
  const StatusIcon = config.icon

  // Helper function to format currency in K notation
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`
    }
    return amount.toString()
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all hover:border-primary/50",
        isSelected ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={request.requester.avatar || "/placeholder.svg"} alt={request.requester.name} />
            <AvatarFallback>
              {request.requester.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{request.requester.name}</h3>
              <Badge variant={config.badge as any} className="flex items-center gap-1">
                <StatusIcon className="h-3 w-3" />
                {request.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">{request.group}</p>

            <p className="text-sm text-foreground line-clamp-2 mb-3">{request.purpose}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span className="font-medium text-foreground">K{formatCurrency(request.amount)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(request.repaymentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{request.interestRate}% interest</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{request.comments} comments</span>
              </div>
            </div>

            {request.status === "PENDING" && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Voting Progress</span>
                  <span className="font-medium text-foreground">
                    {totalVoted} / {totalMembers} members voted
                  </span>
                </div>
                <Progress value={votingProgress} className="h-1.5" />
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-success">✓ {request.votes.approve}/{majorityNeeded}</span>
                    <span className="text-destructive">✗ {request.votes.reject}/{majorityNeeded}</span>
                  </div>
                  <span
                    className={cn(
                      "font-medium",
                      request.votes.approve >= majorityNeeded ? "text-success" : 
                      request.votes.reject >= majorityNeeded ? "text-destructive" : 
                      "text-muted-foreground",
                    )}
                  >
                    {request.votes.approve >= majorityNeeded ? "✅ Approved" : 
                     request.votes.reject >= majorityNeeded ? "❌ Rejected" : 
                     `${approvalPercentage.toFixed(0)}% approve`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
