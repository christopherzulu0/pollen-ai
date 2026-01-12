"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UsersRound, ArrowLeftRight, Wallet, TrendingUp, FileText, Calendar, Bell } from "lucide-react"
import {
  LineChart,
  Line,
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
  Legend,
} from "recharts"

const statsData = [
  {
    title: "Total Users",
    value: "12,458",
    change: "+12.5%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Groups",
    value: "342",
    change: "+8.2%",
    icon: UsersRound,
    trend: "up",
  },
  {
    title: "Transactions",
    value: "$2.4M",
    change: "+23.1%",
    icon: ArrowLeftRight,
    trend: "up",
  },
  {
    title: "Active Loans",
    value: "89",
    change: "-4.3%",
    icon: Wallet,
    trend: "down",
  },
  {
    title: "Blog Posts",
    value: "234",
    change: "+15.8%",
    icon: FileText,
    trend: "up",
  },
  {
    title: "Meetings",
    value: "156",
    change: "+6.4%",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-18.2%",
    icon: Bell,
    trend: "down",
  },
  {
    title: "Revenue",
    value: "$45.2K",
    change: "+28.5%",
    icon: TrendingUp,
    trend: "up",
  },
]

const transactionData = [
  { month: "Jan", amount: 4000, deposits: 2800, withdrawals: 1200 },
  { month: "Feb", amount: 3000, deposits: 2200, withdrawals: 800 },
  { month: "Mar", amount: 5000, deposits: 3500, withdrawals: 1500 },
  { month: "Apr", amount: 4500, deposits: 3200, withdrawals: 1300 },
  { month: "May", amount: 6000, deposits: 4200, withdrawals: 1800 },
  { month: "Jun", amount: 5500, deposits: 3900, withdrawals: 1600 },
]

const groupData = [
  { name: "Active", value: 342, color: "#8b5cf6" },
  { name: "Pending", value: 45, color: "#a78bfa" },
  { name: "Inactive", value: 23, color: "#c4b5fd" },
]

const loanStatusData = [
  { status: "Approved", count: 34 },
  { status: "Pending", count: 23 },
  { status: "Rejected", count: 8 },
  { status: "Repaying", count: 24 },
  { status: "Completed", count: 45 },
]

const userGrowthData = [
  { month: "Jan", users: 8500 },
  { month: "Feb", users: 9200 },
  { month: "Mar", users: 9800 },
  { month: "Apr", users: 10500 },
  { month: "May", users: 11300 },
  { month: "Jun", users: 12458 },
]

const recentActivity = [
  { type: "User Signup", user: "John Doe", time: "2 minutes ago" },
  { type: "Loan Approved", user: "Jane Smith", time: "15 minutes ago" },
  { type: "Transaction", user: "Bob Johnson", time: "1 hour ago" },
  { type: "Group Created", user: "Alice Williams", time: "2 hours ago" },
  { type: "Blog Published", user: "Admin", time: "3 hours ago" },
]

export function DashboardOverview() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-foreground">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: "#ffffff" }}
                  tickLine={{ stroke: "#ffffff" }}
                />
                <YAxis
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: "#ffffff" }}
                  tickLine={{ stroke: "#ffffff" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend
                  wrapperStyle={{ color: "#ffffff", fontSize: "12px" }}
                  iconType="line"
                  formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>}
                />
                <Line type="monotone" dataKey="deposits" stroke="#8b5cf6" strokeWidth={2} name="Deposits" />
                <Line type="monotone" dataKey="withdrawals" stroke="#a78bfa" strokeWidth={2} name="Withdrawals" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-foreground">User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: "#ffffff" }}
                  tickLine={{ stroke: "#ffffff" }}
                />
                <YAxis
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: "#ffffff" }}
                  tickLine={{ stroke: "#ffffff" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-foreground">Group Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={groupData}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: "#ffffff" }}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {groupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Legend
                  wrapperStyle={{ color: "#ffffff", fontSize: "12px" }}
                  formatter={(value) => <span style={{ color: "#ffffff" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm sm:text-base text-foreground">Loan Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] lg:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loanStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="status"
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: "#ffffff" }}
                  tickLine={{ stroke: "#ffffff" }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: "#ffffff" }}
                  tickLine={{ stroke: "#ffffff" }}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="count" fill="#8b5cf6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 border-b border-border pb-3 sm:pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm sm:text-base text-foreground">{activity.type}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
