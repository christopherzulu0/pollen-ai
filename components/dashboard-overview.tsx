"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Calendar, CreditCard, ChevronRight } from "lucide-react"

// Sample data for charts
const depositData = [
  { name: "Jan", amount: 400 },
  { name: "Feb", amount: 600 },
  { name: "Mar", amount: 800 },
  { name: "Apr", amount: 1000 },
  { name: "May", amount: 1200 },
  { name: "Jun", amount: 1500 },
]

const membershipData = [
  { name: "Group A", value: 12 },
  { name: "Group B", value: 8 },
  { name: "Group C", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

const activityData = [
  { date: "1 Apr", deposits: 5, withdrawals: 2 },
  { date: "8 Apr", deposits: 7, withdrawals: 3 },
  { date: "15 Apr", deposits: 4, withdrawals: 1 },
  { date: "22 Apr", deposits: 8, withdrawals: 4 },
  { date: "29 Apr", deposits: 6, withdrawals: 2 },
]

// Upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: "Weekly Meeting",
    date: "Apr 25, 2023",
    time: "10:00 AM",
    group: "Savings Group 1",
  },
  {
    id: 2,
    title: "Deposit Deadline",
    date: "Apr 30, 2023",
    time: "11:59 PM",
    group: "Savings Group 2",
  },
  {
    id: 3,
    title: "Quarterly Review",
    date: "May 5, 2023",
    time: "2:00 PM",
    group: "Savings Group 1",
  },
]

// Recent activities
const recentActivities = [
  {
    id: 1,
    type: "deposit",
    amount: 200,
    date: "Apr 20, 2023",
    group: "Savings Group 1",
    user: "John Doe",
  },
  {
    id: 2,
    type: "withdrawal",
    amount: 150,
    date: "Apr 18, 2023",
    group: "Savings Group 2",
    user: "Jane Smith",
  },
  {
    id: 3,
    type: "member_joined",
    date: "Apr 15, 2023",
    group: "Savings Group 1",
    user: "Alex Johnson",
  },
  {
    id: 4,
    type: "deposit",
    amount: 300,
    date: "Apr 12, 2023",
    group: "Savings Group 1",
    user: "Sarah Williams",
  },
]

export default function DashboardOverview() {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Stats Cards - Mobile First */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Savings */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Total Savings</p>
                <h3 className="mt-1 text-lg sm:text-2xl font-bold truncate">K4,550</h3>
              </div>
              <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <DollarSign className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
                <span>12.5%</span>
              </div>
              <span className="text-slate-500 text-xs">from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Groups */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Active Groups</p>
                <h3 className="mt-1 text-lg sm:text-2xl font-bold">2</h3>
              </div>
              <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Users className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
                <span>1</span>
              </div>
              <span className="text-slate-500 text-xs">new this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Up. Payments</p>
                <h3 className="mt-1 text-lg sm:text-2xl font-bold">3</h3>
              </div>
              <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Calendar className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
              <div className="flex items-center text-red-500">
                <ArrowDownRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
                <span>1</span>
              </div>
              <span className="text-slate-500 text-xs">due this week</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Members */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Total Members</p>
                <h3 className="mt-1 text-lg sm:text-2xl font-bold">25</h3>
              </div>
              <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <Users className="h-5 sm:h-6 w-5 sm:w-6" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
                <span>4</span>
              </div>
              <span className="text-slate-500 text-xs">new members</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Stacked on mobile */}
      <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Savings Overview Chart */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Savings Overview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your deposit history over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depositData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Group Distribution Chart */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Group Distribution</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Members across groups</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {membershipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Section - Stacked on mobile */}
      <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity Chart */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Deposits and withdrawals in April</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="deposits" stroke="#10b981" activeDot={{ r: 6 }} strokeWidth={2} />
                  <Line type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-3">
          <Tabs defaultValue="events" className="w-full">
            <CardHeader className="pb-2 sm:pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-base sm:text-lg">Activity Feed</CardTitle>
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="events" className="text-xs sm:text-sm">Events</TabsTrigger>
                  <TabsTrigger value="activities" className="text-xs sm:text-sm">Activities</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-2 sm:pt-4">
              <TabsContent value="events" className="m-0">
                <div className="space-y-2 sm:space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-2 sm:gap-4 rounded-lg border p-2 sm:p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex h-8 sm:h-10 w-8 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {event.date}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
                          <span>{event.time}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="truncate">{event.group}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full justify-between text-xs sm:text-sm">
                    View All Events
                    <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="activities" className="m-0">
                <div className="space-y-2 sm:space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-2 sm:gap-4 rounded-lg border p-2 sm:p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex h-8 sm:h-10 w-8 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                        {activity.type === "deposit" && <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />}
                        {activity.type === "withdrawal" && <CreditCard className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />}
                        {activity.type === "member_joined" && <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-medium text-sm truncate">
                            {activity.type === "deposit" && "Deposit Made"}
                            {activity.type === "withdrawal" && "Withdrawal"}
                            {activity.type === "member_joined" && "New Member"}
                          </h4>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {activity.date}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
                          <span className="truncate">{activity.user}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="truncate">{activity.group}</span>
                          {(activity.type === "deposit" || activity.type === "withdrawal") && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className={`flex-shrink-0 ${activity.type === "deposit" ? "text-emerald-600" : "text-red-600"}`}>
                                {activity.type === "deposit" ? "+" : "-"}${activity.amount}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full justify-between text-xs sm:text-sm">
                    View All Activities
                    <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
