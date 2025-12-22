"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface JoinRequest {
    id: string
    user: {
        name: string
        email: string
        phone: string
        avatar: string
        id: string
    }
    group: string
    groupId: string
    status: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
    createdAt: string
    message: string
}

interface JoinRequestCardProps {
    request: JoinRequest
    onClick: () => void
    isSelected: boolean
}

export function JoinRequestCard({ request, onClick, isSelected }: JoinRequestCardProps) {
    const statusColors = {
        PENDING: "bg-chart-3/10 text-chart-3 border-chart-3/20",
        ACTIVE: "bg-accent/10 text-accent border-accent/20",
        INACTIVE: "bg-destructive/10 text-destructive border-destructive/20",
        SUSPENDED: "bg-destructive/10 text-destructive border-destructive/20",
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return "Today"
        if (diffDays === 1) return "Yesterday"
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "Accepted"
            case "INACTIVE":
                return "Declined"
            case "SUSPENDED":
                return "Suspended"
            default:
                return "Pending"
        }
    }

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-lg border-border bg-card",
                isSelected && "ring-2 ring-primary shadow-lg",
            )}
            onClick={onClick}
        >
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(request.user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground text-base mb-1">{request.user.name}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span className="truncate">{request.user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5" />
                                        <span>{request.user.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className={cn("shrink-0", statusColors[request.status])}>
                                {getStatusLabel(request.status)}
                            </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{request.message}</p>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatDate(request.createdAt)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{request.group}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
