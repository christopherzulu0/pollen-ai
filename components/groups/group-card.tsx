"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Lock,
  Globe,
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  Heart,
  Info,
  Mail,
  Phone,
  User,
  Copy,
  Check,
  FileText,
  Scale,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { GroupWithDetails } from "@/lib/types/groups"
import { cn } from "@/lib/utils"

// Privacy color mappings using system theme colors
const getPrivacyColor = (privacy: string) => {
  switch (privacy) {
    case "PUBLIC":
      return "bg-secondary/10 text-secondary border border-secondary/20"
    case "PRIVATE":
      return "bg-primary/10 text-primary border border-primary/20"
    case "INVITE_ONLY":
      return "bg-accent/10 text-accent border border-accent/20"
    default:
      return "bg-muted/50 text-muted-foreground border border-border"
  }
}

const getPrivacyIcon = (privacy: string) => {
  switch (privacy) {
    case "PUBLIC":
      return <Globe className="mr-1 size-3" />
    case "PRIVATE":
      return <Lock className="mr-1 size-3" />
    case "INVITE_ONLY":
      return <Shield className="mr-1 size-3" />
    default:
      return null
  }
}

const getPrivacyLabel = (privacy: string) => {
  return privacy.replace("_", " ")
}

interface GroupCardProps {
  group: GroupWithDetails
  viewMode?: "grid" | "list"
  isFavorite?: boolean
  onToggleFavorite?: (groupId: string) => void
  index?: number
}

export function GroupCard({
  group: initialGroup,
  viewMode = "grid",
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [groupCode, setGroupCode] = useState("")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [localGroup, setLocalGroup] = useState(initialGroup)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Update local group when prop changes
  useState(() => {
    setLocalGroup(initialGroup)
  })

  const group = localGroup
  const isAtCapacity = group.maxMembers ? group.memberCount >= group.maxMembers : false
  const capacityPercentage = group.maxMembers ? (group.memberCount / group.maxMembers) * 100 : 0
  const goalProgress = group.depositGoal ? 45 : 0
  const isUserAlreadyMember = group.isUserMember === true
  const hasPendingRequest = group.userMembershipStatus === "PENDING"

  const handleJoin = async () => {
    // Show dialog for INVITE_ONLY and PRIVATE groups
    if (group.privacy === "INVITE_ONLY" || group.privacy === "PRIVATE") {
      setShowCodeDialog(true)
      return
    }

    // For PUBLIC groups, join directly
    setIsJoining(true)
    try {
      const response = await fetch("/api/Frontend/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId: group.id }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please sign in and try again.")
      }

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Success!",
          description: result.message || "You have joined the group",
        })
        
        // Optimistically update the local state immediately
        setLocalGroup(prev => ({
          ...prev,
          isUserMember: true,
          userMembershipId: result.membership?.id || null,
          userMembershipRole: result.membership?.role || null,
        }))
        
        // Invalidate and refetch groups data in the background
        queryClient.invalidateQueries({ queryKey: ["groups", "browse"] })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to join group",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleCodeSubmit = async () => {
    setIsJoining(true)
    try {
      // For INVITE_ONLY: use join endpoint with invite code
      // For PRIVATE: use request endpoint with group code
      const endpoint = group.privacy === "INVITE_ONLY" 
        ? "/api/Frontend/join" 
        : "/api/Frontend/request"
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          groupId: group.id, 
          inviteCode: groupCode, // Used for INVITE_ONLY
          groupCode: groupCode,  // Used for PRIVATE (if needed)
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please sign in and try again.")
      }

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: "Success!",
          description: result.message || (
            group.privacy === "INVITE_ONLY" 
              ? "You have joined the group!" 
              : "Your request has been sent to the group admin"
          ),
        })
        setShowCodeDialog(false)
        setGroupCode("")
        
        // Optimistically update the local state immediately
        setLocalGroup(prev => ({
          ...prev,
          userMembershipStatus: group.privacy === "INVITE_ONLY" ? "ACTIVE" : "PENDING",
          isUserMember: group.privacy === "INVITE_ONLY",
          userMembershipId: result.membership?.id || null,
          userMembershipRole: result.membership?.role || null,
        }))
        
        // Invalidate and refetch groups data in the background
        queryClient.invalidateQueries({ queryKey: ["groups", "browse"] })
      } else {
        toast({
          title: "Error",
          description: result.error || "Invalid code",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const copyToClipboard = async (text: string, type: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "email") {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2000)
      } else {
        setCopiedPhone(true)
        setTimeout(() => setCopiedPhone(false), 2000)
      }
      toast({
        title: "Copied!",
        description: `${type === "email" ? "Email" : "Phone number"} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy",
        variant: "destructive",
      })
    }
  }

  if (viewMode === "list") {
    return (
      <Card 
        className="group overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted/10 shadow-lg transition-all hover:border-primary/30 hover:shadow-2xl hover:-translate-y-0.5"
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:flex-row lg:items-center">
          <Avatar className="size-16 sm:size-20 shrink-0 border-2 border-border shadow-sm mx-auto lg:mx-0">
            <AvatarImage src={group.logo || undefined} alt={group.name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-base sm:text-lg font-semibold text-primary-foreground">
              {group.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start">
              <h3 className="text-base sm:text-lg font-semibold text-foreground text-center lg:text-left">
                {group.name}
              </h3>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-md text-xs font-medium",
                  group.privacy === "PUBLIC" && "bg-secondary/10 text-secondary border border-secondary/20",
                  group.privacy === "PRIVATE" && "bg-primary/10 text-primary border border-primary/20",
                  group.privacy === "INVITE_ONLY" && "bg-accent/10 text-accent border border-accent/20",
                )}
              >
                {getPrivacyIcon(group.privacy)}
                {getPrivacyLabel(group.privacy)}
              </Badge>
              {group.status === "ACTIVE" && (
                <div className="flex items-center gap-1 text-xs font-medium text-secondary">
                  <div className="size-1.5 rounded-full bg-secondary" />
                  Active
                </div>
              )}
            </div>

            {group.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 text-center lg:text-left px-2 lg:px-0">
                {group.description}
              </p>
            )}

            {group.adminName && (
              <p className="flex items-center justify-center lg:justify-start gap-1.5 text-sm text-muted-foreground">
                <User className="size-3.5" />
                <span className="font-medium text-foreground">{group.adminName}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 sm:flex sm:flex-wrap lg:flex-nowrap">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2 sm:px-3 py-2 shadow-md">
              <Users className="size-3 sm:size-4 text-primary" />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {group.memberCount}
                {group.maxMembers && (
                  <span className="text-muted-foreground text-xs sm:text-sm">/{group.maxMembers}</span>
                )}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Members</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/10 border border-secondary/20 px-2 sm:px-3 py-2 shadow-md">
              <DollarSign className="size-3 sm:size-4 text-secondary" />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                {Number(group.contributionAmount).toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Per period</span>
            </div>

            <div className="flex flex-col items-center gap-1 rounded-lg bg-accent/10 border border-accent/20 px-2 sm:px-3 py-2 shadow-md">
              <TrendingUp className="size-3 sm:size-4 text-accent" />
              <span className="text-sm sm:text-base font-semibold text-foreground">{Number(group.interestRate)}%</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Interest</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite?.(group.id)}
              className={cn("size-9 rounded-lg mx-auto sm:mx-0", isFavorite && "text-red-500 hover:text-red-600")}
            >
              {/* <Heart className={cn("size-4", isFavorite && "fill-current")} /> */}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(true)}
              size="sm"
              className="rounded-lg w-full sm:w-auto"
            >
              View Details
            </Button>

            <Button
              onClick={handleJoin}
              disabled={isJoining || isAtCapacity || isUserAlreadyMember || hasPendingRequest}
              size="sm"
              className="rounded-lg font-medium w-full sm:w-auto"
            >
              {hasPendingRequest
                ? "Pending Request"
                : isUserAlreadyMember 
                  ? "Already a Member" 
                  : isJoining 
                    ? "Joining..." 
                    : group.privacy === "PUBLIC" 
                      ? "Join Now" 
                      : "Request to Join"}
              {!isUserAlreadyMember && !hasPendingRequest && <ArrowRight className="ml-1.5 size-3.5" />}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card
        className={cn(
          "group relative h-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 shadow-lg transition-all duration-300",
          "hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1",
        )}
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <Avatar className="size-12 sm:size-14 shrink-0 border-2 border-border shadow-sm">
                <AvatarImage src={group.logo || undefined} alt={group.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-sm sm:text-base font-semibold text-primary-foreground">
                  {group.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                <h3 className="font-semibold text-foreground leading-tight text-base sm:text-lg line-clamp-2">
                  {group.name}
                </h3>

                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-md text-[10px] sm:text-xs font-medium",
                      group.privacy === "PUBLIC" && "bg-secondary/10 text-secondary border border-secondary/20",
                      group.privacy === "PRIVATE" && "bg-primary/10 text-primary border border-primary/20",
                      group.privacy === "INVITE_ONLY" && "bg-accent/10 text-accent border border-accent/20",
                    )}
                  >
                    {getPrivacyIcon(group.privacy)}
                    {getPrivacyLabel(group.privacy)}
                  </Badge>

                  {group.status === "ACTIVE" && (
                    <div className="flex items-center gap-1 rounded-md border border-secondary/20 bg-secondary/5 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-secondary">
                      <div className="size-1 sm:size-1.5 rounded-full bg-secondary" />
                      Active
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite?.(group.id)}
              className={cn("size-8 sm:size-9 shrink-0 rounded-lg", isFavorite && "text-red-500 hover:text-red-600")}
            >
              
            </Button>
          </div>

          {group.description && (
            <p className="mb-4 sm:mb-5 text-xs sm:text-sm text-muted-foreground line-clamp-3">{group.description}</p>
          )}

          {group.adminName && (
            <div className="mb-4 sm:mb-5 rounded-lg border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-2.5 sm:p-3 shadow-md">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <User className="size-3.5 sm:size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Group Admin</p>
                  <p className="truncate text-xs sm:text-sm font-semibold text-foreground">{group.adminName}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/15 p-2.5 sm:p-3 shadow-md">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                <Users className="size-3 sm:size-3.5 text-primary" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Members</span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                {group.memberCount}
                {group.maxMembers && (
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground">/{group.maxMembers}</span>
                )}
              </p>
            </div>

            <div className="rounded-lg border border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/15 p-2.5 sm:p-3 shadow-md">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                <TrendingUp className="size-3 sm:size-3.5 text-secondary" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Interest</span>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-foreground">{Number(group.interestRate)}%</p>
            </div>

            <div className="rounded-lg border border-accent/20 bg-gradient-to-br from-accent/10 to-accent/15 p-2.5 sm:p-3 shadow-md">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                <DollarSign className="size-3 sm:size-3.5 text-accent" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Contribution</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-foreground">
                {Number(group.contributionAmount).toLocaleString()}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground capitalize mt-0.5">
                {group.contributionFrequency.toLowerCase().replace("_", " ")}
              </p>
            </div>

            <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 dark:border-orange-800/30 dark:from-orange-900/20 dark:to-orange-800/30 p-2.5 sm:p-3 shadow-md">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-1.5">
                <Calendar className="size-3 sm:size-3.5 text-orange-600 dark:text-orange-400" />
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Frequency</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground capitalize">
                {group.contributionFrequency.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>

          {group.maxMembers && (
            <div className="mb-5 space-y-2 rounded-lg border border-border/50 bg-gradient-to-br from-muted/50 to-muted/30 p-3 shadow-md">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Capacity</span>
                <span className="font-semibold text-foreground">{capacityPercentage.toFixed(0)}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    capacityPercentage >= 90
                      ? "bg-destructive"
                      : capacityPercentage >= 70
                        ? "bg-warning"
                        : "bg-secondary",
                  )}
                  style={{ width: `${capacityPercentage}%` }}
                />
              </div>
              {isAtCapacity && <p className="text-xs font-medium text-destructive">Group is at full capacity</p>}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center gap-2 p-3 sm:p-4 bg-muted/20">
          <Button
            variant="outline"
            onClick={() => setShowDetailsDialog(true)}
            size="sm"
            className="flex-1 rounded-lg font-medium text-xs sm:text-sm h-9 sm:h-10"
          >
            <Info className="mr-1 sm:mr-1.5 size-3.5 sm:size-4" />
            Details
          </Button>

          <Button
            onClick={handleJoin}
            disabled={isJoining || isAtCapacity || isUserAlreadyMember || hasPendingRequest}
            size="sm"
            className="flex-1 rounded-lg font-medium text-xs sm:text-sm h-9 sm:h-10"
          >
            {hasPendingRequest
              ? "Pending Request"
              : isUserAlreadyMember
                ? "Already a Member"
                : isJoining
                  ? "Joining..."
                  : group.privacy === "PUBLIC"
                    ? "Join This Group"
                    : "Request to Join"}
            {!isUserAlreadyMember && !hasPendingRequest && <ArrowRight className="ml-1 sm:ml-1.5 size-3.5 sm:size-4" />}
          </Button>
        </div>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card p-4 sm:p-6">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <Avatar className="size-14 sm:size-16 border-2 border-border shadow-sm mx-auto sm:mx-0">
                <AvatarImage src={group.logo || undefined} alt={group.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-base sm:text-lg font-semibold text-primary-foreground">
                  {group.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <DialogTitle className="text-xl sm:text-2xl">{group.name}</DialogTitle>
                <DialogDescription className="mt-2 text-sm sm:text-base">{group.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Admin Contact Section */}
            {(group.adminName || group.adminEmail || group.adminPhone) && (
              <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/15 p-5 shadow-md">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-4 text-lg">
                  <User className="size-5 text-primary" />
                  Group Administrator
                </h4>
                <div className="space-y-3">
                  {group.adminName && (
                    <div className="flex items-center gap-2 text-sm bg-card/50 rounded-md p-2.5">
                      <span className="font-medium text-muted-foreground min-w-[60px]">Name:</span>
                      <span className="text-foreground font-semibold">{group.adminName}</span>
                    </div>
                  )}
                  {group.adminEmail && (
                    <div className="flex items-center gap-2 text-sm bg-card/50 rounded-md p-2.5">
                      <Mail className="size-4 text-primary" />
                      <span className="flex-1 text-foreground font-medium">{group.adminEmail}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(group.adminEmail!, "email")}
                        className="h-8 px-3 bg-primary/10 hover:bg-primary/20"
                      >
                        {copiedEmail ? <Check className="size-4 text-secondary" /> : <Copy className="size-4" />}
                      </Button>
                    </div>
                  )}
                  {group.adminPhone && (
                    <div className="flex items-center gap-2 text-sm bg-card/50 rounded-md p-2.5">
                      <Phone className="size-4 text-primary" />
                      <span className="flex-1 text-foreground font-medium">{group.adminPhone}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(group.adminPhone!, "phone")}
                        className="h-8 px-3 bg-primary/10 hover:bg-primary/20"
                      >
                        {copiedPhone ? <Check className="size-4 text-secondary" /> : <Copy className="size-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Group Rules Section */}
            {group.groupRules && (
              <div className="rounded-lg border border-warning/30 bg-gradient-to-br from-warning/10 to-warning/15 p-5 shadow-md">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-lg">
                  <FileText className="size-5 text-warning" />
                  Group Rules
                </h4>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-card/50 p-3 rounded-md">
                  {group.groupRules}
                </p>
              </div>
            )}

            {/* Bylaws Section */}
            {group.bylaws && (
              <div className="rounded-lg border border-chart-5/30 bg-gradient-to-br from-chart-5/10 to-chart-5/15 p-5 shadow-md">
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3 text-lg">
                  <Scale className="size-5 text-chart-5" />
                  Bylaws
                </h4>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-card/50 p-3 rounded-md">
                  {group.bylaws}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              onClick={handleJoin} 
              disabled={isJoining || isAtCapacity || isUserAlreadyMember || hasPendingRequest} 
              className="w-full rounded-lg font-medium"
            >
              {hasPendingRequest
                ? "Pending Request"
                : isUserAlreadyMember
                  ? "Already a Member"
                  : isJoining
                    ? "Joining..."
                    : group.privacy === "PUBLIC"
                      ? "Join This Group"
                      : "Request to Join"}
              {!isUserAlreadyMember && !hasPendingRequest && <ArrowRight className="ml-2 size-4" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Dialog - for INVITE_ONLY and PRIVATE groups */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {group.privacy === "INVITE_ONLY" ? "Enter Invitation Code" : "Enter Group Code"}
            </DialogTitle>
            <DialogDescription>
              {group.privacy === "INVITE_ONLY"
                ? "This group requires an invitation code to join."
                : "Please enter the group code to request membership. Your request will be sent to the group admin for approval."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-code">
                {group.privacy === "INVITE_ONLY" ? "Invitation Code" : "Group Code"}
              </Label>
              <Input
                id="group-code"
                placeholder="Enter code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCodeDialog(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={handleCodeSubmit} disabled={isJoining || !groupCode} className="rounded-lg">
              {isJoining ? "Submitting..." : group.privacy === "INVITE_ONLY" ? "Join Group" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
