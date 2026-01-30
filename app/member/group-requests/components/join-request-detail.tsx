import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Check, X, Mail, Phone, Calendar, MessageSquare, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutateJoinRequest } from "@/hooks/useJoinRequests"

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

interface JoinRequestDetailProps {
  request: JoinRequest
  onMutationSuccess?: () => void
}

export function JoinRequestDetail({ request, onMutationSuccess }: JoinRequestDetailProps) {
  const { mutate: mutateJoinRequest, isPending } = useMutateJoinRequest()

  const statusColors = {
    PENDING: "bg-warning/20 text-warning-foreground border-warning/50",
    ACTIVE: "bg-success/20 text-success border-success/50",
    INACTIVE: "bg-destructive/20 text-destructive border-destructive/50",
    SUSPENDED: "bg-destructive/20 text-destructive border-destructive/50",
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
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const handleAccept = () => {
    mutateJoinRequest(
      { id: request.id, action: "ACCEPT" },
      {
        onSuccess: () => {
          onMutationSuccess?.()
        },
      }
    )
  }

  const handleDecline = () => {
    mutateJoinRequest(
      { id: request.id, action: "DECLINE" },
      {
        onSuccess: () => {
          onMutationSuccess?.()
        },
      }
    )
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
    <Card className="bg-card border-border sticky top-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-foreground">Join Request Details</CardTitle>
            <CardDescription className="mt-1">Review applicant information</CardDescription>
          </div>
          <Badge variant="outline" className={cn("shrink-0", statusColors[request.status])}>
            {getStatusLabel(request.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Profile */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-4 border-border mb-3">
            <AvatarImage src={request.user.avatar || "/placeholder.svg"} alt={request.user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
              {getInitials(request.user.name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg text-foreground">{request.user.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">Applicant</p>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Contact Information
          </h4>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                <p className="text-sm text-foreground break-all">{request.user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                <p className="text-sm text-foreground">{request.user.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">Application Date</p>
                <p className="text-sm text-foreground">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Message */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Application Message
          </h4>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-sm text-foreground leading-relaxed">{request.message}</p>
          </div>
        </div>

        <Separator />

        {/* Group Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Group</h4>
          <p className="text-sm text-muted-foreground">{request.group}</p>
        </div>

        {/* Action Buttons */}
        {request.status === "PENDING" && (
          <>
            <Separator />
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                variant="default"
                onClick={handleAccept}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Accept
                  </>
                )}
              </Button>
              <Button
                className="flex-1 gap-2 bg-transparent"
                variant="outline"
                onClick={handleDecline}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Decline
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {request.status === "ACTIVE" && (
          <div className="bg-success/20 border border-success/50 rounded-lg p-4">
            <p className="text-sm text-success text-center font-medium">This member has been accepted to the group</p>
          </div>
        )}

        {request.status === "INACTIVE" && (
          <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4">
            <p className="text-sm text-destructive text-center font-medium">This application has been declined</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
