"use client"
import { useState } from "react"
import { ArrowUpCircle, CheckCircle, XCircle, Clock, User, RefreshCw, Filter, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function ActivityFeed() {
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState("all")

  // Mock data - in a real app, fetch from API
  const activities = [
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
        return <Clock className="h-4 w-4 text-amber-500" />
      case "PAYMENT":
        return <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
      case "CONTRIBUTION":
        return <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
      case "LOAN_APPROVED":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "LOAN_REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "MEMBER_JOINED":
        return <User className="h-4 w-4 text-blue-500" />
      case "SYSTEM":
        return <Bell className="h-4 w-4 text-purple-500" />
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
                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900"
            >
              Completed
            </Badge>
        )
      case "PENDING":
        return (
            <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900"
            >
              Pending
            </Badge>
        )
      case "APPROVED":
        return (
            <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900"
            >
              Approved
            </Badge>
        )
      case "REJECTED":
        return (
            <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900"
            >
              Rejected
            </Badge>
        )
      case "SYSTEM":
        return (
            <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900"
            >
              System
            </Badge>
        )
      default:
        return null
    }
  }

  // Filter activities based on tab and filter
  const filteredActivities = activities.filter((activity) => {
    if (activeTab !== "all" && activity.type !== activeTab) {
      return false
    }
    if (filter !== "all" && activity.group !== filter) {
      return false
    }
    return true
  })

  return (
      <Card className="border border-slate-200 dark:border-slate-800 shadow-md rounded-xl bg-white dark:bg-slate-900 w-full max-w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Latest actions in your groups
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>All Groups</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Savings Group A")}>Savings Group A</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Investment Club B")}>Investment Club B</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Community Cooperative")}>
                  Community Cooperative
                </DropdownMenuItem>
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
                <TabsList className="inline-flex w-full p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                  <TabsTrigger
                      value="all"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                      value="LOAN_REQUEST"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    Loans
                  </TabsTrigger>
                  <TabsTrigger
                      value="CONTRIBUTION"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    Contributions
                  </TabsTrigger>
                  <TabsTrigger
                      value="MEMBER_JOINED"
                      className="flex-1 md:flex-none px-3 py-1.5 rounded-sm text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
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
                              className="flex flex-col sm:flex-row sm:items-start gap-3 rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                          >
                            <Avatar className="h-8 w-8 border-2 border-slate-200 dark:border-slate-700 self-start">
                              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                              <AvatarFallback className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
                                {activity.user.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.user.name}</p>
                                {getActivityIcon(activity.type)}
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{activity.description}</p>
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
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
                        <Bell className="h-10 w-10 text-slate-400 dark:text-slate-500 mb-2" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">No activities match your filters</p>
                      </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <Button
              variant="ghost"
              className="w-full text-xs rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              size="sm"
          >
            View All Activity
          </Button>
        </CardFooter>
      </Card>
  )
}
