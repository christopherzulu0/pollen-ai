"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  PiggyBank,
  Plus,
  RefreshCw,
  ChevronRight,
  ShoppingBag,
  Briefcase,
  Utensils,
  Car,
} from "lucide-react"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar } from "@/components/ui/chart"

interface DashboardWidgetProps {
  type:
    | "account-summary"
    | "recent-transactions"
    | "upcoming-payments"
    | "spending-insights"
    | "savings-goals"
    | "quick-actions"
  className?: string
}

export default function DashboardWidget({ type, className = "" }: DashboardWidgetProps) {
  // Render appropriate widget based on type
  switch (type) {
    case "account-summary":
      return <AccountSummaryWidget className={className} />
    case "recent-transactions":
      return <RecentTransactionsWidget className={className} />
    case "upcoming-payments":
      return <UpcomingPaymentsWidget className={className} />
    case "spending-insights":
      return <SpendingInsightsWidget className={className} />
    case "savings-goals":
      return <SavingsGoalsWidget className={className} />
    case "quick-actions":
      return <QuickActionsWidget className={className} />
    default:
      return <div>Widget type not supported</div>
  }
}

// Account Summary Widget
function AccountSummaryWidget({ className = "" }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Account Summary</CardTitle>
          <CardDescription>Overview of your financial accounts</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Checking Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pollen AI Bank</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$8,250.45</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-end">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                2.4%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <PiggyBank className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Savings Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pollen AI Bank</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$12,750.30</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-end">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                3.8%
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pollen AI Rewards</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-red-600 dark:text-red-400">-$1,250.00</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Limit: $5,000</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Investment Account</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pollen AI Invest</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">$21,450.75</p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-end">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5.2%
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="font-medium">Total Net Worth</p>
              <p className="font-bold text-lg">$41,201.50</p>
            </div>
          </div>

          <Button variant="outline" className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Recent Transactions Widget
function RecentTransactionsWidget({ className = "" }: { className?: string }) {
  const transactions = [
    {
      id: 1,
      name: "Grocery Store",
      category: "Shopping",
      amount: -85.42,
      date: "Today",
      icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Monthly Salary",
      category: "Income",
      amount: 3200.0,
      date: "Yesterday",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "Restaurant",
      category: "Food",
      amount: -42.75,
      date: "Mar 10",
      icon: <Utensils className="h-4 w-4" />,
    },
    {
      id: 4,
      name: "Uber Ride",
      category: "Transportation",
      amount: -18.5,
      date: "Mar 9",
      icon: <Car className="h-4 w-4" />,
    },
    {
      id: 5,
      name: "From Savings",
      category: "Transfer",
      amount: 500.0,
      date: "Mar 8",
      icon: <CreditCard className="h-4 w-4" />,
    },
  ]

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${transaction.amount > 0 ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"} flex items-center justify-center mr-3`}
                >
                  {transaction.icon}
                </div>
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
              </div>
              <p className={`font-medium ${transaction.amount > 0 ? "text-green-600 dark:text-green-400" : ""}`}>
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount.toFixed(2)}
              </p>
            </div>
          ))}

          <Button variant="outline" className="w-full" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Statement
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Upcoming Payments Widget
function UpcomingPaymentsWidget({ className = "" }: { className?: string }) {
  const payments = [
    {
      id: 1,
      name: "Rent Payment",
      amount: 1200.0,
      dueDate: "2024-03-31",
      status: "upcoming",
      autopay: true,
    },
    {
      id: 2,
      name: "Electric Bill",
      amount: 85.42,
      dueDate: "2024-03-25",
      status: "upcoming",
      autopay: true,
    },
    {
      id: 3,
      name: "Internet Service",
      amount: 65.99,
      dueDate: "2024-03-22",
      status: "upcoming",
      autopay: false,
    },
    {
      id: 4,
      name: "Credit Card Payment",
      amount: 350.0,
      dueDate: "2024-03-18",
      status: "due-soon",
      autopay: false,
    },
  ]

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Upcoming Payments</CardTitle>
          <CardDescription>Bills and scheduled payments</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full ${payment.status === "due-soon" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"} flex items-center justify-center mr-3`}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">{payment.name}</p>
                    {payment.autopay && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0"
                      >
                        AutoPay
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <p
                      className={`${payment.status === "due-soon" ? "text-amber-600 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      Due in {getDaysRemaining(payment.dueDate)} days
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${payment.amount.toFixed(2)}</p>
                {!payment.autopay && (
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-[#003366] dark:text-blue-400">
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="font-medium">Total Due This Month</p>
              <p className="font-bold text-lg">$1,701.41</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Spending Insights Widget
function SpendingInsightsWidget({ className = "" }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("month")

  const spendingData = {
    week: [
      { category: "Food", amount: 120 },
      { category: "Shopping", amount: 85 },
      { category: "Transportation", amount: 45 },
      { category: "Entertainment", amount: 35 },
      { category: "Utilities", amount: 25 },
    ],
    month: [
      { category: "Food", amount: 520 },
      { category: "Shopping", amount: 385 },
      { category: "Transportation", amount: 195 },
      { category: "Entertainment", amount: 150 },
      { category: "Utilities", amount: 210 },
    ],
    year: [
      { category: "Food", amount: 6240 },
      { category: "Shopping", amount: 4620 },
      { category: "Transportation", amount: 2340 },
      { category: "Entertainment", amount: 1800 },
      { category: "Utilities", amount: 2520 },
    ],
  }

  const totalSpending = spendingData[activeTab as keyof typeof spendingData].reduce((sum, item) => sum + item.amount, 0)

  const getColor = (index: number) => {
    const colors = ["#003366", "#00CC66", "#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572"]
    return colors[index % colors.length]
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-medium">Spending Insights</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-[200px]">
              <ChartContainer data={spendingData[activeTab as keyof typeof spendingData]}>
                <Chart>
                  <ChartBar dataKey="amount" target="category" className="fill-[#003366]" />
                  <ChartTooltip>
                    {({ dataPoint }) => (
                      <ChartTooltipContent>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium">
                            {dataPoint.category}: ${dataPoint.amount}
                          </span>
                        </div>
                      </ChartTooltipContent>
                    )}
                  </ChartTooltip>
                </Chart>
              </ChartContainer>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Top Spending Categories</h3>
            <div className="space-y-4">
              {spendingData[activeTab as keyof typeof spendingData].map((item, index) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span className="font-medium">${item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.amount / totalSpending) * 100}%`,
                        backgroundColor: getColor(index),
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Total Spending</span>
                <span className="font-bold">${totalSpending}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Savings Goals Widget
function SavingsGoalsWidget({ className = "" }: { className?: string }) {
  const goals = [
    {
      id: 1,
      name: "Emergency Fund",
      currentAmount: 2750,
      targetAmount: 5000,
      deadline: "2024-12-31",
      color: "#003366",
    },
    {
      id: 2,
      name: "New Laptop",
      currentAmount: 800,
      targetAmount: 1200,
      deadline: "2024-06-30",
      color: "#00CC66",
    },
    {
      id: 3,
      name: "Vacation",
      currentAmount: 1200,
      targetAmount: 3000,
      deadline: "2024-08-15",
      color: "#FF6B6B",
    },
  ]

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Savings Goals</CardTitle>
          <CardDescription>Track your progress towards financial goals</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{goal.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">{calculateProgress(goal.currentAmount, goal.targetAmount)}%</Badge>
              </div>

              <div className="space-y-1">
                <Progress
                  value={calculateProgress(goal.currentAmount, goal.targetAmount)}
                  className="h-2"
                  indicatorClassName={`bg-[${goal.color}]`}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>${goal.currentAmount.toLocaleString()}</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Goals
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Quick Actions Widget
function QuickActionsWidget({ className = "" }: { className?: string }) {
  const actions = [
    {
      id: 1,
      name: "Transfer Money",
      description: "Move funds between accounts",
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      name: "Pay Bills",
      description: "Schedule or make payments",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
    {
      id: 3,
      name: "Set Savings Goal",
      description: "Create a new savings target",
      icon: <PiggyBank className="h-5 w-5" />,
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      id: 4,
      name: "View Statements",
      description: "Download account statements",
      icon: <Download className="h-5 w-5" />,
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    },
  ]

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        <CardDescription>Frequently used financial tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-center justify-center text-center"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-3`}>
                {action.icon}
              </div>
              <span className="font-medium">{action.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

