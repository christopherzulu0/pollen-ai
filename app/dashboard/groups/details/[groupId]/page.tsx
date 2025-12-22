"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import {
  ArrowLeft,
  Users,
  Wallet,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  DollarSign,
  Clock,
  Shield,
  UserPlus,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Activity,
} from "lucide-react"

interface GroupDetail {
  id: string
  name: string
  description?: string
  logo?: string
  status: string
  createdAt: string
  contributionAmount: number
  contributionFrequency: string
  depositGoal?: number
  latePenaltyFee: number
  gracePeriod: number
  interestRate: number
  allowEarlyWithdrawal: boolean
  earlyWithdrawalFee: number
  votingThreshold: number
  maxMembers?: number
  meetingFrequency: string
  groupRules?: string
  privacy: string
  governanceType: string
  owner: {
    id: string
    name?: string
    email: string
  }
  memberships?: {
    id: string
    role: string
    status: string
    balance: number
    totalContributed: number
    joinedAt: string
    user: {
      id: string
      name?: string
      email: string
    }
  }[]
  contributions?: {
    id: string
    amount: number
    status: string
    createdAt: string
    user: {
      name?: string
      email: string
    }
  }[]
  loanRequests?: {
    id: string
    amount: number
    purpose: string
    status: string
    createdAt: string
    repaymentTerms?: string
    interestRate: number
    user: {
      name?: string
      email: string
    }
  }[]
  meetings?: {
    id: string
    title: string
    date: string
    location?: string
    description?: string
    attendees?: number
  }[]
}

interface GroupDetailsPageProps {
  params: Promise<{
    groupId: string
  }>
}

export default function GroupDetailsPage({ params }: GroupDetailsPageProps) {
  const { toast } = useToast()
  const { groupId } = use(params)
  const router = useRouter()

  const {
    data: groupDetails,
    isLoading,
    error,
  } = useQuery<GroupDetail>({
    queryKey: ["group-details", groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch group details")
      }

      return response.json()
    },
    retry: 1,
  })

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading group",
        description: error instanceof Error ? error.message : "Failed to load group details",
        variant: "destructive",
      })
    }
  }, [error, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!groupDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 p-8 mb-6 shadow-lg">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-balance">Group not found</h2>
        <p className="text-muted-foreground mb-8 max-w-md text-center text-balance">
          {"This group doesn't exist or you don't have access to it."}
        </p>
        <Button
          onClick={() => router.push("/dashboard/groups")}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Button>
      </div>
    )
  }

  const totalSavings = groupDetails.memberships?.reduce((sum, m) => sum + m.totalContributed, 0) || 0
  const savingsProgress = groupDetails.depositGoal ? (totalSavings / groupDetails.depositGoal) * 100 : 0
  const activeMembers = groupDetails.memberships?.filter((m) => m.status === "ACTIVE").length || 0
  const pendingLoans = groupDetails.loanRequests?.filter((l) => l.status === "PENDING").length || 0
  const totalLoansAmount =
    groupDetails.loanRequests?.filter((l) => l.status === "APPROVED").reduce((sum, l) => sum + l.amount, 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-2 border-primary/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHp6TTMyIDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek00OCAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative p-8 md:p-12">
            <div className="flex items-start justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/groups")}
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm border border-primary-foreground/20 transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Badge
                variant={groupDetails.status === "ACTIVE" ? "default" : "secondary"}
                className="text-sm px-4 py-2 font-semibold bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground backdrop-blur-sm border border-primary-foreground/30"
              >
                {groupDetails.status}
              </Badge>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground text-balance">
                {groupDetails.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-primary-foreground/90">
                <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/20">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Created {new Date(groupDetails.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/20">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{activeMembers} active members</span>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-foreground/20">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">{groupDetails.contributionFrequency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Active Members</CardTitle>
              <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/90 p-3 border-2 border-primary/30">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-primary">
                {activeMembers}
              </div>
              {groupDetails.maxMembers && (
                <p className="text-xs text-muted-foreground mt-2 font-medium">of {groupDetails.maxMembers} maximum</p>
              )}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Savings</CardTitle>
              <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/90 p-3 border-2 border-secondary/30">
                <Wallet className="h-5 w-5 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-secondary">
                ZMW {totalSavings.toLocaleString()}
              </div>
              {groupDetails.depositGoal && (
                <div className="mt-3 space-y-2">
                  <Progress value={savingsProgress} className="h-2.5" />
                  <p className="text-xs text-muted-foreground font-medium">
                    {savingsProgress.toFixed(1)}% of ZMW {groupDetails.depositGoal.toLocaleString()} goal
                  </p>
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Active Loans</CardTitle>
              <div className="rounded-2xl bg-gradient-to-br from-accent to-accent/90 p-3 border-2 border-accent/30">
                <DollarSign className="h-5 w-5 text-accent-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-accent-foreground">
                ZMW {totalLoansAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {pendingLoans} {pendingLoans === 1 ? "request" : "requests"} pending approval
              </p>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-muted/40 hover:border-muted/60 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-muted/10 via-muted/5 to-transparent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-muted/10 rounded-full blur-3xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Interest Rate</CardTitle>
              <div className="rounded-2xl bg-gradient-to-br from-muted to-muted/90 p-3 border-2 border-muted/30">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-foreground">
                {groupDetails.interestRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Annual rate</p>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-muted/5 rounded-full blur-2xl" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1.5 bg-white/60 dark:bg-accent/60 backdrop-blur-xl border-2 border-accent/30 rounded-2xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-primary/30 rounded-xl font-semibold transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-primary/30 rounded-xl font-semibold transition-all"
            >
              Members
              <Badge className="ml-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 border-0" variant="secondary">
                {activeMembers}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="contributions"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-primary/30 rounded-xl font-semibold transition-all"
            >
              Contributions
            </TabsTrigger>
            <TabsTrigger
              value="loans"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-primary/30 rounded-xl font-semibold transition-all"
            >
              Loans
              {pendingLoans > 0 && (
                <Badge className="ml-2 bg-accent hover:bg-accent/90 border-0 animate-pulse">{pendingLoans}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground data-[state=active]:border-2 data-[state=active]:border-primary/30 rounded-xl font-semibold transition-all"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-2 border-accent/30 hover:border-primary/50 transition-all duration-300 bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary p-3 border-2 border-accent/30">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    About This Group
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {groupDetails.description || "No description provided"}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-accent/50 to-accent/20 border border-accent/30">
                      <span className="text-sm font-medium text-muted-foreground">Owner</span>
                      <span className="text-sm font-bold">{groupDetails.owner.name || groupDetails.owner.email}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-accent/50 to-accent/20 border border-accent/30">
                      <span className="text-sm font-medium text-muted-foreground">Privacy</span>
                      <Badge variant="outline" className="font-semibold bg-white dark:bg-accent border-2">
                        {groupDetails.privacy}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-accent/50 to-accent/20 border border-accent/30">
                      <span className="text-sm font-medium text-muted-foreground">Governance</span>
                      <Badge variant="outline" className="font-semibold bg-white dark:bg-accent border-2">
                        {groupDetails.governanceType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/30 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-secondary/10 to-primary/10 dark:from-secondary/20 dark:to-primary/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary p-3 border-2 border-accent/30">
                      <Wallet className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-accent/30">
                    <span className="text-sm font-medium text-muted-foreground">Contribution Amount</span>
                    <span className="text-lg font-bold text-foreground dark:text-foreground">
                      ZMW {groupDetails.contributionAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm">
                    <span className="text-sm font-medium text-muted-foreground">Frequency</span>
                    <span className="text-sm font-bold">{groupDetails.contributionFrequency}</span>
                  </div>
                  {groupDetails.depositGoal && (
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm">
                      <span className="text-sm font-medium text-muted-foreground">Deposit Goal</span>
                      <span className="text-sm font-bold">ZMW {groupDetails.depositGoal.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm">
                    <span className="text-sm font-medium text-muted-foreground">Late Penalty Fee</span>
                    <span className="text-sm font-bold">ZMW {groupDetails.latePenaltyFee}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm">
                    <span className="text-sm font-medium text-muted-foreground">Grace Period</span>
                    <span className="text-sm font-bold">{groupDetails.gracePeriod} days</span>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm">
                    <span className="text-sm font-medium text-muted-foreground">Early Withdrawal Fee</span>
                    <span className="text-sm font-bold">
                      {groupDetails.allowEarlyWithdrawal ? `ZMW ${groupDetails.earlyWithdrawalFee}` : "Not Allowed"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 border-accent/30 hover:border-primary/50 transition-all duration-300 bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="rounded-2xl bg-gradient-to-br from-primary to-muted p-3 border-2 border-accent/30">
                    <Calendar className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Upcoming Meetings
                </CardTitle>
                <CardDescription className="text-base">
                  Meeting frequency: {groupDetails.meetingFrequency}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupDetails.meetings && groupDetails.meetings.length > 0 ? (
                  <div className="space-y-4">
                    {groupDetails.meetings.slice(0, 3).map((meeting) => (
                      <div
                        key={meeting.id}
                        className="flex items-start justify-between rounded-2xl border-2 border-accent/30 p-6 hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/50 hover:to-muted/50 dark:hover:from-primary/30 dark:hover:to-muted/30 transition-all duration-300 bg-white/60 dark:bg-accent/60 backdrop-blur-sm"
                      >
                        <div className="space-y-2 flex-1">
                          <p className="font-bold text-lg">{meeting.title}</p>
                          {meeting.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{meeting.description}</p>
                          )}
                          {meeting.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
                              <MapPin className="h-4 w-4" />
                              {meeting.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-6">
                          <div className="rounded-2xl bg-gradient-to-br from-primary to-muted px-4 py-3 border-2 border-accent/30">
                            <p className="text-sm font-bold text-primary-foreground">
                              {new Date(meeting.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-primary-foreground/90 font-medium">
                              {new Date(meeting.date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-br from-primary to-muted dark:from-primary dark:to-muted p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-accent/50 dark:border-accent/50">
                      <Calendar className="h-10 w-10 text-foreground dark:text-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium text-lg">No upcoming meetings</p>
                    <p className="text-sm text-muted-foreground mt-2">Check back later for scheduled meetings</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {groupDetails.groupRules && (
              <Card className="border-2 border-accent/30 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-accent/10 to-accent/10 dark:from-accent/20 dark:to-accent/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="rounded-2xl bg-gradient-to-br from-accent to-accent p-3 border-2 border-accent/30">
                      <Shield className="h-6 w-6 text-primary-foreground" />
                    </div>
                    Group Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                      {groupDetails.groupRules}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="mt-8">
            <Card className="border-2 border-accent/30 bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">Group Members</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {activeMembers} active members
                      {groupDetails.maxMembers && ` of ${groupDetails.maxMembers} maximum`}
                    </CardDescription>
                  </div>
                  <Button className="transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground border-2 border-primary/30">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {groupDetails.memberships && groupDetails.memberships.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    {groupDetails.memberships.map((membership) => (
                      <div
                        key={membership.id}
                        className="flex items-center justify-between rounded-2xl border-2 border-accent/30 p-6 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-primary/50 via-white to-secondary/50 dark:from-primary/20 dark:via-slate-800 dark:to-secondary/20 backdrop-blur-sm"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-gradient-to-br from-primary to-primary p-3 border-2 border-accent/30">
                              <Users className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <p className="font-bold text-lg">{membership.user.name || membership.user.email}</p>
                          </div>
                          <div className="flex gap-2 ml-14">
                            <Badge variant="outline" className="font-semibold bg-white dark:bg-accent border-2">
                              {membership.role}
                            </Badge>
                            <Badge
                              variant={membership.status === "ACTIVE" ? "default" : "secondary"}
                              className={
                                membership.status === "ACTIVE"
                                  ? "bg-gradient-to-r from-secondary to-secondary text-primary-foreground border-0"
                                  : ""
                              }
                            >
                              {membership.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-2 ml-14 font-medium">
                            <Clock className="h-4 w-4" />
                            Joined {new Date(membership.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2 ml-6">
                          <p className="text-3xl font-bold bg-gradient-to-br from-secondary to-secondary dark:from-secondary dark:to-secondary bg-clip-text text-transparent">
                            ZMW {membership.totalContributed.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Balance:{" "}
                            <span className="font-bold text-foreground">ZMW {membership.balance.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-br from-primary to-secondary dark:from-primary dark:to-secondary p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-accent/50 dark:border-accent/50">
                      <Users className="h-10 w-10 text-foreground dark:text-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium text-lg">No members yet</p>
                    <p className="text-sm text-muted-foreground mt-2">Invite members to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions" className="mt-8">
            <Card className="border-2 border-accent/30 bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl">Contribution History</CardTitle>
                <CardDescription className="text-base">Track all contributions made to this group</CardDescription>
              </CardHeader>
              <CardContent>
                {groupDetails.contributions && groupDetails.contributions.length > 0 ? (
                  <div className="space-y-4">
                    {groupDetails.contributions.map((contribution) => (
                      <div
                        key={contribution.id}
                        className="flex items-center justify-between rounded-2xl border-2 border-accent/30 p-5 hover:border-primary/50 hover:bg-gradient-to-r hover:from-secondary/50 hover:to-primary/50 dark:hover:from-secondary/30 dark:hover:to-primary/30 transition-all duration-300"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary p-3 border-2 border-accent/30">
                              <Wallet className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <p className="font-bold text-lg">
                              {contribution.user?.name || contribution.user?.email || "Unknown"}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 ml-14 font-medium">
                            <Clock className="h-4 w-4" />
                            {new Date(contribution.createdAt).toLocaleDateString()} at{" "}
                            {new Date(contribution.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <p className="text-3xl font-bold bg-gradient-to-br from-secondary to-secondary dark:from-secondary dark:to-secondary bg-clip-text text-transparent">
                            ZMW {contribution.amount.toLocaleString()}
                          </p>
                          <Badge
                            variant={
                              contribution.status === "COMPLETED"
                                ? "default"
                                : contribution.status === "PENDING"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={`flex items-center gap-2 py-2 px-4 font-semibold ${contribution.status === "COMPLETED"
                              ? "bg-gradient-to-r from-secondary to-secondary text-primary-foreground border-0"
                              : ""
                              }`}
                          >
                            {contribution.status === "COMPLETED" && <CheckCircle className="h-4 w-4" />}
                            {contribution.status === "PENDING" && <Clock className="h-4 w-4" />}
                            {contribution.status === "FAILED" && <XCircle className="h-4 w-4" />}
                            {contribution.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-br from-secondary to-primary dark:from-secondary dark:to-primary p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-accent/50 dark:border-accent/50">
                      <Activity className="h-10 w-10 text-foreground dark:text-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium text-lg">No contributions recorded yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Contributions will appear here once members start contributing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loans Tab */}
          <TabsContent value="loans" className="mt-8">
            <Card className="border-2 border-accent/30 bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">Loan Requests</CardTitle>
                    <CardDescription className="mt-2 text-base">View and manage loan requests</CardDescription>
                  </div>
                  {/* <Button className="transition-all bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground border-2 border-accent/30">
                    <FileText className="mr-2 h-5 w-5" />
                    New Loan Request
                  </Button> */}
                </div>
              </CardHeader>
              <CardContent>
                {groupDetails.loanRequests && groupDetails.loanRequests.length > 0 ? (
                  <div className="space-y-5">
                    {groupDetails.loanRequests.map((loan) => (
                      <div
                        key={loan.id}
                        className="rounded-2xl border-2 border-accent/30 p-6 hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-accent/50 via-white to-accent/50 dark:from-accent/20 dark:via-slate-800 dark:to-accent/20 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <div className="rounded-2xl bg-gradient-to-br from-accent to-accent p-3 border-2 border-accent/30">
                                <DollarSign className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <p className="font-bold text-lg">{loan.user?.name || loan.user?.email || "Unknown"}</p>
                            </div>
                            <p className="text-sm text-muted-foreground ml-14 leading-relaxed font-medium">
                              {loan.purpose}
                            </p>
                          </div>
                          <Badge
                            variant={
                              loan.status === "APPROVED"
                                ? "default"
                                : loan.status === "PENDING"
                                  ? "secondary"
                                  : loan.status === "REJECTED"
                                    ? "destructive"
                                    : "outline"
                            }
                            className={`flex items-center gap-2 py-2 px-4 font-semibold ${loan.status === "APPROVED"
                              ? "bg-gradient-to-r from-secondary to-secondary text-primary-foreground border-0"
                              : loan.status === "PENDING"
                                ? "bg-gradient-to-r from-accent to-accent text-primary-foreground border-0"
                                : ""
                              }`}
                          >
                            {loan.status === "APPROVED" && <CheckCircle className="h-4 w-4" />}
                            {loan.status === "PENDING" && <Clock className="h-4 w-4" />}
                            {loan.status === "REJECTED" && <XCircle className="h-4 w-4" />}
                            {loan.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t-2 border-accent/30 pt-5">
                          <div className="py-3 px-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/30">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                              Loan Amount
                            </p>
                            <p className="text-lg font-bold text-foreground dark:text-foreground">
                              ZMW {loan.amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                              Interest Rate
                            </p>
                            <p className="text-lg font-bold">{loan.interestRate}%</p>
                          </div>
                          {loan.repaymentTerms && (
                            <>
                              <div className="py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm col-span-2">
                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                                  Repayment Terms
                                </p>
                                <p className="text-sm font-medium">{loan.repaymentTerms}</p>
                              </div>
                            </>
                          )}
                          <div className="py-3 px-4 rounded-xl bg-white/60 dark:bg-accent/60 backdrop-blur-sm col-span-2">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
                              Requested On
                            </p>
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {new Date(loan.createdAt).toLocaleDateString()} at{" "}
                              {new Date(loan.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="rounded-full bg-gradient-to-br from-accent to-accent dark:from-accent dark:to-accent p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-accent/50 dark:border-accent/50">
                      <DollarSign className="h-10 w-10 text-foreground dark:text-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium text-lg">No loan requests yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Loan requests will appear here when members apply
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-8">
            <Card className="border-2 border-accent/30 bg-white/80 dark:bg-accent/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <div className="rounded-2xl bg-gradient-to-br from-muted to-muted p-3 border-2 border-accent/30">
                    <Settings className="h-6 w-6 text-primary-foreground" />
                  </div>
                  Group Settings
                </CardTitle>
                <CardDescription className="text-base">Manage group configuration and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border-2 border-accent/30 p-6 bg-gradient-to-br from-accent/20 to-transparent">
                  <h3 className="font-bold text-xl mb-4">Governance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 dark:bg-accent/80 backdrop-blur-sm border border-accent/20">
                      <span className="text-sm font-medium text-muted-foreground">Voting Threshold</span>
                      <span className="text-sm font-bold">{groupDetails.votingThreshold}%</span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 dark:bg-accent/80 backdrop-blur-sm border border-accent/20">
                      <span className="text-sm font-medium text-muted-foreground">Governance Type</span>
                      <Badge variant="outline" className="font-semibold bg-white dark:bg-accent border-2">
                        {groupDetails.governanceType}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-accent/30 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
                  <h3 className="font-bold text-xl mb-4">Financial Policies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 dark:bg-accent/80 backdrop-blur-sm border border-accent/20">
                      <span className="text-sm font-medium text-muted-foreground">Late Penalty Fee</span>
                      <span className="text-sm font-bold">ZMW {groupDetails.latePenaltyFee}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 dark:bg-accent/80 backdrop-blur-sm border border-accent/20">
                      <span className="text-sm font-medium text-muted-foreground">Grace Period</span>
                      <span className="text-sm font-bold">{groupDetails.gracePeriod} days</span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 dark:bg-accent/80 backdrop-blur-sm border border-accent/20">
                      <span className="text-sm font-medium text-muted-foreground">Early Withdrawal</span>
                      <Badge
                        variant={groupDetails.allowEarlyWithdrawal ? "default" : "secondary"}
                        className="font-semibold"
                      >
                        {groupDetails.allowEarlyWithdrawal ? "Allowed" : "Not Allowed"}
                      </Badge>
                    </div>
                    {groupDetails.allowEarlyWithdrawal && (
                      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/80 dark:bg-accent/80 backdrop-blur-sm border border-accent/20">
                        <span className="text-sm font-medium text-muted-foreground">Early Withdrawal Fee</span>
                        <span className="text-sm font-bold">ZMW {groupDetails.earlyWithdrawalFee}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="flex gap-4 pt-6">
                  <Button variant="outline" className="flex-1 border-2 hover:bg-accent/50 font-semibold bg-transparent">
                    Edit Settings
                  </Button>
                  <Button variant="destructive" className="flex-1 font-semibold">
                    Delete Group
                  </Button>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
