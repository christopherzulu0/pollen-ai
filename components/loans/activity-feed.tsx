"use client"
import { useState } from "react"
import { ArrowUpCircle, CheckCircle, XCircle, Clock, User, RefreshCw, Filter, Bell, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ActivityFeedSkeleton } from "./activity-feed-skeleton"

interface Activity {
  id: string | number
  type: string
  user: {
    name: string
    avatar: string | null
  }
  description: string
  time: string
  status: string
  group: string
}

interface ActivityFeedProps {
  activities: Activity[]
  isLoading?: boolean
  error?: string
}

export default function ActivityFeed({ activities, isLoading, error }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState("all")

  // Show skeleton while loading
  if (isLoading) {
    return <ActivityFeedSkeleton />
  }

  // Show error state
  if (error) {
    return (
      <Card className="border border-border shadow-md rounded-xl bg-card">
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Unable to Load Activities</h3>
            <p className="text-muted-foreground max-w-md">{error}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Get unique groups from activities
  const uniqueGroups = Array.from(new Set(activities.map((a) => a.group)))

  // Mock data kept as fallback - in a real app, fetch from API
  const mockActivities = [
    {
      id: 1,
      type: "LOAN_REQUEST",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "requested a loan of $1,000",
      time: "10 minutes ago",
      status: "PENDING",
      group: "Savings Group A",
    },
    {
      id: 2,
      type: "PAYMENT",
      user: {
        name: "Robert Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "made a payment of $350",
      time: "2 hours ago",
      status: "COMPLETED",
      group: "Investment Club B",
    },
    {
      id: 3,
      type: "CONTRIBUTION",
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "contributed $250 to the group",
      time: "Yesterday",
      status: "COMPLETED",
      group: "Savings Group A",
    },
    {
      id: 4,
      type: "LOAN_APPROVED",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "loan request of $500 was approved",
      time: "Yesterday",
      status: "APPROVED",
      group: "Community Cooperative",
    },
    {
      id: 5,
      type: "MEMBER_JOINED",
      user: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "joined Savings Group A",
      time: "2 days ago",
      status: "COMPLETED",
      group: "Savings Group A",
    },
    {
      id: 6,
      type: "LOAN_REJECTED",
      user: {
        name: "David Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "loan request of $2,000 was rejected",
      time: "3 days ago",
      status: "REJECTED",
      group: "Investment Club B",
    },
    {
      id: 7,
      type: "SYSTEM",
      user: {
        name: "System",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      description: "scheduled maintenance on July 15th",
      time: "4 days ago",
      status: "SYSTEM",
      group: "All Groups",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "LOAN_REQUEST":
        return <Clock className="h-4 w-4 text-warning" />
      case "PAYMENT":
        return <ArrowUpCircle className="h-4 w-4 text-success" />
      case "CONTRIBUTION":
        return <ArrowUpCircle className="h-4 w-4 text-success" />
      case "LOAN_APPROVED":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "LOAN_REJECTED":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "MEMBER_JOINED":
        return <User className="h-4 w-4 text-primary" />
      case "SYSTEM":
        return <Bell className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
            <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/30"
            >
              Completed
            </Badge>
        )
      case "PENDING":
        return (
            <Badge
                variant="outline"
                className="bg-warning/10 text-warning border-warning/30"
            >
              Pending
            </Badge>
        )
      case "APPROVED":
        return (
            <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/30"
            >
              Approved
            </Badge>
        )
      case "REJECTED":
        return (
            <Badge
                variant="outline"
                className="bg-destructive/10 text-destructive border-destructive/30"
            >
              Rejected
            </Badge>
        )
      case "SYSTEM":
        return (
            <Badge
                variant="outline"
                className="bg-muted text-muted-foreground border-border"
            >
              System
            </Badge>
        )
      default:
        return null
    }
  }

  // Use provided activities or fallback to mock
  const displayActivities = activities.length > 0 ? activities : mockActivities

  // Filter activities based on tab and filter
  const filteredActivities = displayActivities.filter((activity) => {
    if (activeTab !== "all" && activity.type !== activeTab) {
      return false
    }
    if (filter !== "all" && activity.group !== filter) {
      return false
    }
    return true
  })

  return (
      <Card className="border border-border shadow-md rounded-xl bg-card w-full max-w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2 border-b border-border">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest actions in your groups
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>All Groups</DropdownMenuItem>
                {uniqueGroups.length > 0 ? (
                  uniqueGroups.map((group) => (
                    <DropdownMenuItem key={group} onClick={() => setFilter(group)}>
                      {group}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setFilter("Savings Group A")}>Savings Group A</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Investment Club B")}>Investment Club B</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter("Community Cooperative")}>
                      Community Cooperative
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-2">
              <ScrollArea className="w-full whitespace-nowrap pb-3">
                <TabsList className="inline-flex w-full p-1 rounded-md bg-muted/50">
                  <TabsTrigger
                      value="all"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                      value="LOAN_REQUEST"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    Loans
                  </TabsTrigger>
                  <TabsTrigger
                      value="CONTRIBUTION"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    Contributions
                  </TabsTrigger>
                  <TabsTrigger
                      value="MEMBER_JOINED"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    Members
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <ScrollArea className="h-[calc(100vh-300px)] max-h-[400px] min-h-[200px] w-full">
                <ScrollBar orientation="vertical" />
                <div className="space-y-4 pr-4 px-2">
                  {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                          <div
                              key={activity.id}
                              className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg p-2 hover:bg-muted/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border"
                          >
                            <Avatar className="h-8 w-8 border-2 border-border self-start">
                              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                              <AvatarFallback className="bg-muted text-foreground">
                                {activity.user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">{activity.user.name}</p>
                                {getActivityIcon(activity.type)}
                              </div>
                              <p className="text-xs text-muted-foreground">{activity.description}</p>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                  <p className="text-xs text-muted-foreground hidden sm:inline">
                                    • {activity.group}
                                  </p>
                                </div>
                                <div className="mt-1 sm:mt-0">{getStatusBadge(activity.status)}</div>
                              </div>
                            </div>
                          </div>
                      ))
                  ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No activities match your filters</p>
                      </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-border pt-4">
          <Button
              variant="ghost"
              className="w-full text-xs rounded-md hover:bg-accent hover:text-accent-foreground"
              size="sm"
          >
            View All Activity
          </Button>
        </CardFooter>
      </Card>
  )
}
