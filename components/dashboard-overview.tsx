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
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Savings</p>
                <h3 className="mt-1 text-2xl font-bold">K4,550</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>12.5%</span>
              </div>
              <span className="ml-2 text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Active Groups</p>
                <h3 className="mt-1 text-2xl font-bold">2</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>1</span>
              </div>
              <span className="ml-2 text-slate-500">new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Upcoming Payments</p>
                <h3 className="mt-1 text-2xl font-bold">3</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center text-red-500">
                <ArrowDownRight className="mr-1 h-4 w-4" />
                <span>1</span>
              </div>
              <span className="ml-2 text-slate-500">due this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Members</p>
                <h3 className="mt-1 text-2xl font-bold">25</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center text-emerald-500">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>4</span>
              </div>
              <span className="ml-2 text-slate-500">new members</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Savings Overview</CardTitle>
            <CardDescription>Your deposit history over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={depositData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Group Distribution</CardTitle>
            <CardDescription>Member distribution across groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Deposits and withdrawals in April</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="deposits" stroke="#10b981" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="withdrawals" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <Tabs defaultValue="events">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Activity Feed</CardTitle>
                <TabsList>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <TabsContent value="events" className="m-0">
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <Calendar className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.date}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <span>{event.time}</span>
                          <span>•</span>
                          <span>{event.group}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full justify-between">
                    View All Events
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="activities" className="m-0">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        {activity.type === "deposit" && <DollarSign className="h-5 w-5 text-emerald-600" />}
                        {activity.type === "withdrawal" && <CreditCard className="h-5 w-5 text-red-600" />}
                        {activity.type === "member_joined" && <Users className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {activity.type === "deposit" && "Deposit Made"}
                            {activity.type === "withdrawal" && "Withdrawal"}
                            {activity.type === "member_joined" && "New Member"}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {activity.date}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.group}</span>
                          {(activity.type === "deposit" || activity.type === "withdrawal") && (
                            <>
                              <span>•</span>
                              <span className={activity.type === "deposit" ? "text-emerald-600" : "text-red-600"}>
                                {activity.type === "deposit" ? "+" : "-"}${activity.amount}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full justify-between">
                    View All Activities
                    <ChevronRight className="h-4 w-4" />
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
