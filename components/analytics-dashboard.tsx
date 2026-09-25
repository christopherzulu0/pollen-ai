"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  PiggyBank,
  DollarSign,
  Clock,
  Zap,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartArea,
  ChartLine,
  ChartGrid,
} from "@/components/ui/chart"
import FinancialWidget from "@/components/financial-widget"

interface AnalyticsDashboardProps {
  userId?: string
  initialTab?: string
  className?: string
}

export default function AnalyticsDashboard({
  userId = "user-123",
  initialTab = "overview",
  className = "",
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [timeRange, setTimeRange] = useState("month")
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Simulate loading user data
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setUserData({
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastUpdated: "2024-03-12T14:30:00Z",
        overview: {
          totalAssets: 32450.75,
          totalDebt: 15780.42,
          netWorth: 16670.33,
          monthlyIncome: 4500,
          monthlyExpenses: 3200,
          savingsRate: 28.9,
          creditScore: 742,
          creditScoreChange: 15,
        },
        loans: [
          {
            id: "loan-1",
            name: "Personal Loan",
            lender: "Pollen AI",
            originalAmount: 10000,
            currentBalance: 7250.42,
            interestRate: 8.5,
            monthlyPayment: 312.75,
            nextPaymentDate: "2024-04-01",
            remainingPayments: 24,
            status: "current",
            paymentHistory: [
              { date: "2024-03-01", amount: 312.75, status: "paid" },
              { date: "2024-02-01", amount: 312.75, status: "paid" },
              { date: "2024-01-01", amount: 312.75, status: "paid" },
              { date: "2023-12-01", amount: 312.75, status: "paid" },
              { date: "2023-11-01", amount: 312.75, status: "paid" },
              { date: "2023-10-01", amount: 312.75, status: "paid" },
            ],
          },
          {
            id: "loan-2",
            name: "Auto Loan",
            lender: "Capital Bank",
            originalAmount: 15000,
            currentBalance: 8530,
            interestRate: 6.2,
            monthlyPayment: 425.3,
            nextPaymentDate: "2024-04-15",
            remainingPayments: 21,
            status: "current",
            paymentHistory: [
              { date: "2024-03-15", amount: 425.3, status: "paid" },
              { date: "2024-02-15", amount: 425.3, status: "paid" },
              { date: "2024-01-15", amount: 425.3, status: "paid" },
              { date: "2023-12-15", amount: 425.3, status: "paid" },
              { date: "2023-11-15", amount: 425.3, status: "paid" },
              { date: "2023-10-15", amount: 425.3, status: "paid" },
            ],
          },
        ],
        savings: [
          {
            id: "savings-1",
            name: "Emergency Fund",
            institution: "Pollen AI Savings",
            currentBalance: 8500,
            interestRate: 4.5,
            monthlyContribution: 300,
            goalAmount: 15000,
            goalDate: "2025-06-30",
            transactions: [
              { date: "2024-03-01", amount: 300, type: "deposit" },
              { date: "2024-02-01", amount: 300, type: "deposit" },
              { date: "2024-01-01", amount: 300, type: "deposit" },
              { date: "2023-12-01", amount: 300, type: "deposit" },
              { date: "2023-11-01", amount: 300, type: "deposit" },
              { date: "2023-10-01", amount: 300, type: "deposit" },
            ],
          },
          {
            id: "savings-2",
            name: "Vacation Fund",
            institution: "Pollen AI Savings",
            currentBalance: 2500,
            interestRate: 3.8,
            monthlyContribution: 150,
            goalAmount: 5000,
            goalDate: "2024-12-31",
            transactions: [
              { date: "2024-03-01", amount: 150, type: "deposit" },
              { date: "2024-02-01", amount: 150, type: "deposit" },
              { date: "2024-01-01", amount: 150, type: "deposit" },
              { date: "2023-12-01", amount: 150, type: "deposit" },
              { date: "2023-11-01", amount: 150, type: "deposit" },
              { date: "2023-10-01", amount: 150, type: "deposit" },
            ],
          },
          {
            id: "savings-3",
            name: "Retirement",
            institution: "Pollen AI Investment",
            currentBalance: 21450.75,
            interestRate: 7.2,
            monthlyContribution: 450,
            goalAmount: 1000000,
            goalDate: "2055-01-01",
            transactions: [
              { date: "2024-03-01", amount: 450, type: "deposit" },
              { date: "2024-02-01", amount: 450, type: "deposit" },
              { date: "2024-01-01", amount: 450, type: "deposit" },
              { date: "2023-12-01", amount: 450, type: "deposit" },
              { date: "2023-11-01", amount: 450, type: "deposit" },
              { date: "2023-10-01", amount: 450, type: "deposit" },
            ],
          },
        ],
        creditScore: {
          current: 742,
          history: [
            { date: "2024-03-01", score: 742 },
            { date: "2024-02-01", score: 738 },
            { date: "2024-01-01", score: 735 },
            { date: "2023-12-01", score: 730 },
            { date: "2023-11-01", score: 727 },
            { date: "2023-10-01", score: 725 },
          ],
          factors: [
            {
              name: "Payment History",
              impact: "high",
              status: "excellent",
              score: 95,
              description: "Your payment history is excellent with no late payments.",
            },
            {
              name: "Credit Utilization",
              impact: "high",
              status: "good",
              score: 85,
              description: "Your credit utilization is at 15%, which is good. Aim to keep it below 30%.",
            },
            {
              name: "Credit Age",
              impact: "medium",
              status: "fair",
              score: 70,
              description: "Your average credit age is 4 years. Longer credit history improves your score.",
            },
            {
              name: "Credit Mix",
              impact: "low",
              status: "good",
              score: 80,
              description: "You have a good mix of credit types including revolving and installment accounts.",
            },
            {
              name: "New Credit",
              impact: "low",
              status: "excellent",
              score: 90,
              description: "You have few recent credit inquiries, which is excellent.",
            },
          ],
          recommendations: [
            "Continue making all payments on time",
            "Consider paying down revolving credit balances",
            "Avoid opening multiple new credit accounts in a short period",
            "Keep old credit accounts open to increase average credit age",
          ],
        },
        insights: [
          {
            id: "insight-1",
            type: "alert",
            category: "loan",
            title: "Loan Payment Due Soon",
            description: "Your Personal Loan payment of $312.75 is due in 5 days.",
            date: "2024-03-12",
            action: "Pay Now",
            actionUrl: "#",
          },
          {
            id: "insight-2",
            type: "opportunity",
            category: "savings",
            title: "Savings Rate Increase",
            description:
              "Pollen AI Savings has increased interest rates to 4.5%. You're earning more on your Emergency Fund.",
            date: "2024-03-10",
            action: "View Details",
            actionUrl: "#",
          },
          {
            id: "insight-3",
            type: "achievement",
            category: "credit",
            title: "Credit Score Milestone",
            description: "Congratulations! Your credit score has increased by 15 points in the last 3 months.",
            date: "2024-03-05",
            action: "See Factors",
            actionUrl: "#",
          },
          {
            id: "insight-4",
            type: "tip",
            category: "general",
            title: "Optimize Your Budget",
            description:
              "Based on your spending patterns, you could save an additional $250/month by adjusting your entertainment budget.",
            date: "2024-03-01",
            action: "Get Tips",
            actionUrl: "#",
          },
        ],
      })

      setIsLoading(false)
      setShowNotification(true)

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }, 1500)
  }, [userId])

  const handleRefresh = () => {
    setIsLoading(true)

    // Simulate API refresh
    setTimeout(() => {
      setIsLoading(false)
      setShowNotification(true)

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }, 1000)
  }

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  const toggleExpandSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null)
    } else {
      setExpandedSection(sectionId)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-500 dark:text-green-400"
      case "good":
        return "text-blue-500 dark:text-blue-400"
      case "fair":
        return "text-yellow-500 dark:text-yellow-400"
      case "poor":
        return "text-red-500 dark:text-red-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "opportunity":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "achievement":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "tip":
        return <TrendingUp className="h-5 w-5 text-purple-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getInsightBg = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-amber-500/10 border-amber-500/20"
      case "opportunity":
        return "bg-blue-500/10 border-blue-500/20"
      case "achievement":
        return "bg-green-500/10 border-green-500/20"
      case "tip":
        return "bg-purple-500/10 border-purple-500/20"
      default:
        return "bg-gray-500/10 border-gray-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className={`w-full h-full min-h-[600px] flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366] mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading your financial dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className={`w-full ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load your financial data. Please try again later or contact support.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-300">Dashboard Updated</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              Your financial data has been refreshed as of {new Date().toLocaleTimeString()}.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>
              {userData.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-[#003366] dark:text-white">Financial Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {userData.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh dashboard data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download financial report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="text-sm md:text-base">
            Overview
          </TabsTrigger>
          <TabsTrigger value="loans" className="text-sm md:text-base">
            Loans
          </TabsTrigger>
          <TabsTrigger value="savings" className="text-sm md:text-base">
            Savings
          </TabsTrigger>
          <TabsTrigger value="credit" className="text-sm md:text-base">
            Credit Score
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Worth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-[#003366] dark:text-white">
                    {formatCurrency(userData.overview.netWorth)}
                  </span>
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +4.2%
                  </Badge>
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <p>Assets</p>
                    <p className="font-medium text-[#003366] dark:text-white">
                      {formatCurrency(userData.overview.totalAssets)}
                    </p>
                  </div>
                  <div>
                    <p>Debt</p>
                    <p className="font-medium text-[#003366] dark:text-white">
                      {formatCurrency(userData.overview.totalDebt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Monthly Cash Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-[#003366] dark:text-white">
                    {formatCurrency(userData.overview.monthlyIncome - userData.overview.monthlyExpenses)}
                  </span>
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.8%
                  </Badge>
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <p>Income</p>
                    <p className="font-medium text-[#003366] dark:text-white">
                      {formatCurrency(userData.overview.monthlyIncome)}
                    </p>
                  </div>
                  <div>
                    <p>Expenses</p>
                    <p className="font-medium text-[#003366] dark:text-white">
                      {formatCurrency(userData.overview.monthlyExpenses)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Savings Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-[#003366] dark:text-white">
                    {userData.overview.savingsRate}%
                  </span>
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +1.5%
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Target: 30%</span>
                    <span>{userData.overview.savingsRate}%</span>
                  </div>
                  <Progress value={(userData.overview.savingsRate / 30) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Credit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-[#003366] dark:text-white">
                    {userData.overview.creditScore}
                  </span>
                  <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />+{userData.overview.creditScoreChange}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{ width: "100%" }}
                    ></div>
                    <div
                      className="h-3 w-3 bg-white border-2 border-[#003366] dark:border-white rounded-full -mt-2.5 relative"
                      style={{ marginLeft: `${(userData.overview.creditScore / 850) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Insights */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
              <CardTitle>Financial Insights</CardTitle>
              <CardDescription className="text-white/80">
                Personalized insights and recommendations based on your financial activity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {userData.insights.map((insight: any) => (
                  <div key={insight.id} className={`p-4 rounded-lg border ${getInsightBg(insight.type)}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">{getInsightIcon(insight.type)}</div>
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{insight.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(insight.date)}</span>
                          <Button variant="link" className="p-0 h-auto text-sm text-[#003366] dark:text-blue-400">
                            {insight.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
                <CardTitle>Net Worth Trend</CardTitle>
                <CardDescription className="text-white/80">Track your net worth growth over time</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ChartContainer
                    data={[
                      { date: "Oct", assets: 28000, debt: 18000, netWorth: 10000 },
                      { date: "Nov", assets: 29000, debt: 17500, netWorth: 11500 },
                      { date: "Dec", assets: 30000, debt: 17000, netWorth: 13000 },
                      { date: "Jan", assets: 31000, debt: 16500, netWorth: 14500 },
                      { date: "Feb", assets: 32000, debt: 16000, netWorth: 16000 },
                      { date: "Mar", assets: 32450, debt: 15780, netWorth: 16670 },
                    ]}
                  >
                    <Chart>
                      <ChartGrid className="stroke-gray-200 dark:stroke-gray-700" />
                      <ChartArea dataKey="assets" className="fill-blue-500/20" />
                      <ChartLine dataKey="assets" className="stroke-blue-500" />
                      <ChartArea dataKey="debt" className="fill-red-500/20" />
                      <ChartLine dataKey="debt" className="stroke-red-500" />
                      <ChartLine dataKey="netWorth" className="stroke-green-500 stroke-[3px]" />
                      <ChartTooltip>
                        {({ dataPoint }) => (
                          <ChartTooltipContent>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                <span className="text-xs font-medium">
                                  Assets: {formatCurrency(dataPoint.assets || 0)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                <span className="text-xs font-medium">Debt: {formatCurrency(dataPoint.debt || 0)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                <span className="text-xs font-medium">
                                  Net Worth: {formatCurrency(dataPoint.netWorth || 0)}
                                </span>
                              </div>
                            </div>
                          </ChartTooltipContent>
                        )}
                      </ChartTooltip>
                    </Chart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
                <CardTitle>Credit Score History</CardTitle>
                <CardDescription className="text-white/80">Track your credit score improvements</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ChartContainer
                    data={userData.creditScore.history.map((item: any) => ({
                      date: new Date(item.date).toLocaleDateString("en-US", { month: "short" }),
                      score: item.score,
                    }))}
                  >
                    <Chart>
                      <ChartGrid className="stroke-gray-200 dark:stroke-gray-700" />
                      <ChartLine dataKey="score" className="stroke-[#00CC66] stroke-[3px]" />
                      <ChartTooltip>
                        {({ dataPoint }) => (
                          <ChartTooltipContent>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-medium">Credit Score: {dataPoint.score}</span>
                            </div>
                          </ChartTooltipContent>
                        )}
                      </ChartTooltip>
                    </Chart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Loans Tab */}
        <TabsContent value="loans" className="space-y-8">
          {/* Loan Summary */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Loan Summary</CardTitle>
                  <CardDescription className="text-white/80">
                    Overview of your current loans and payment status
                  </CardDescription>
                </div>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Apply for New Loan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Loan Balance</p>
                  <p className="text-2xl font-bold text-[#003366] dark:text-white">
                    {formatCurrency(userData.loans.reduce((sum: number, loan: any) => sum + loan.currentBalance, 0))}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">-3.2% from last month</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Payments</p>
                  <p className="text-2xl font-bold text-[#003366] dark:text-white">
                    {formatCurrency(userData.loans.reduce((sum: number, loan: any) => sum + loan.monthlyPayment, 0))}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Next payment in{" "}
                      {Math.min(
                        ...userData.loans.map((loan: any) => {
                          const nextDate = new Date(loan.nextPaymentDate)
                          const today = new Date()
                          return Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                        }),
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Debt-to-Income Ratio</p>
                  <p className="text-2xl font-bold text-[#003366] dark:text-white">
                    {(
                      (userData.loans.reduce((sum: number, loan: any) => sum + loan.monthlyPayment, 0) /
                        userData.overview.monthlyIncome) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Good: &lt;36%</span>
                      <span>
                        Current:{" "}
                        {(
                          (userData.loans.reduce((sum: number, loan: any) => sum + loan.monthlyPayment, 0) /
                            userData.overview.monthlyIncome) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        ((userData.loans.reduce((sum: number, loan: any) => sum + loan.monthlyPayment, 0) /
                          userData.overview.monthlyIncome) *
                          100) /
                        0.36
                      }
                      className="h-2"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="space-y-6">
                {userData.loans.map((loan: any) => (
                  <div
                    key={loan.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      onClick={() => toggleExpandSection(loan.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-2 md:mb-0">
                          <div className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                            <CreditCard className="h-5 w-5 text-[#003366] dark:text-[#4488cc]" />
                          </div>
                          <div>
                            <h3 className="font-medium">{loan.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{loan.lender}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 md:mt-0">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                            <p className="font-medium">{formatCurrency(loan.currentBalance)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                            <p className="font-medium">{loan.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                            <p className="font-medium">{formatCurrency(loan.monthlyPayment)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Next Due</p>
                            <p className="font-medium">{formatDate(loan.nextPaymentDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center mt-2 md:mt-0">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0 mr-2"
                          >
                            {loan.status}
                          </Badge>
                          {expandedSection === loan.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>
                            Paid: {formatCurrency(loan.originalAmount - loan.currentBalance)} (
                            {(((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100).toFixed(0)}%)
                          </span>
                          <span>Remaining: {formatCurrency(loan.currentBalance)}</span>
                        </div>
                        <Progress
                          value={((loan.originalAmount - loan.currentBalance) / loan.originalAmount) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>

                    {expandedSection === loan.id && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Payment History</h4>
                            <div className="space-y-2">
                              {loan.paymentHistory.map((payment: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span>{formatDate(payment.date)}</span>
                                  </div>
                                  <div className="font-medium">{formatCurrency(payment.amount)}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Loan Details</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Original Amount</span>
                                <span className="font-medium">{formatCurrency(loan.originalAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Current Balance</span>
                                <span className="font-medium">{formatCurrency(loan.currentBalance)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Interest Rate</span>
                                <span className="font-medium">{loan.interestRate}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Monthly Payment</span>
                                <span className="font-medium">{formatCurrency(loan.monthlyPayment)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Next Payment Date</span>
                                <span className="font-medium">{formatDate(loan.nextPaymentDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Remaining Payments</span>
                                <span className="font-medium">{loan.remainingPayments}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Payoff Date</span>
                                <span className="font-medium">
                                  {formatDate(
                                    new Date(
                                      new Date(loan.nextPaymentDate).setMonth(
                                        new Date(loan.nextPaymentDate).getMonth() + loan.remainingPayments - 1,
                                      ),
                                    ).toISOString(),
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex space-x-2">
                                <Button className="flex-1 bg-[#003366] hover:bg-[#002244]">Make Payment</Button>
                                <Button variant="outline" className="flex-1">
                                  Payoff Calculator
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Loan Calculator Widget */}
          <FinancialWidget type="loan-calculator" showHeader={true} />
        </TabsContent>

        {/* Savings Tab */}
        <TabsContent value="savings" className="space-y-8">
          {/* Savings Summary */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Savings Summary</CardTitle>
                  <CardDescription className="text-white/80">Track your savings progress and growth</CardDescription>
                </div>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
                  <PiggyBank className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
                  <p className="text-2xl font-bold text-[#003366] dark:text-white">
                    {formatCurrency(
                      userData.savings.reduce((sum: number, account: any) => sum + account.currentBalance, 0),
                    )}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">+4.8% from last month</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Contributions</p>
                  <p className="text-2xl font-bold text-[#003366] dark:text-white">
                    {formatCurrency(
                      userData.savings.reduce((sum: number, account: any) => sum + account.monthlyContribution, 0),
                    )}
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-blue-600 dark:text-blue-400">
                      {(
                        (userData.savings.reduce((sum: number, account: any) => sum + account.monthlyContribution, 0) /
                          userData.overview.monthlyIncome) *
                        100
                      ).toFixed(1)}
                      % of income
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average Interest Rate</p>
                  <p className="text-2xl font-bold text-[#003366] dark:text-white">
                    {(
                      userData.savings.reduce(
                        (sum: number, account: any) => sum + account.interestRate * account.currentBalance,
                        0,
                      ) / userData.savings.reduce((sum: number, account: any) => sum + account.currentBalance, 0)
                    ).toFixed(2)}
                    %
                  </p>
                  <div className="mt-2 flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 dark:text-green-400">
                      Earning{" "}
                      {formatCurrency(
                        userData.savings.reduce(
                          (sum: number, account: any) => sum + account.currentBalance * (account.interestRate / 100),
                          0,
                        ),
                      )}{" "}
                      annually
                    </span>
                  </div>
                </div>
              </div>

              {/* Savings Accounts */}
              <div className="space-y-6">
                {userData.savings.map((account: any) => (
                  <div
                    key={account.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      onClick={() => toggleExpandSection(account.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center mb-2 md:mb-0">
                          <div className="w-10 h-10 rounded-full bg-[#00CC66]/10 dark:bg-[#00CC66]/20 flex items-center justify-center mr-3">
                            <PiggyBank className="h-5 w-5 text-[#00CC66]" />
                          </div>
                          <div>
                            <h3 className="font-medium">{account.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{account.institution}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 md:mt-0">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                            <p className="font-medium">{formatCurrency(account.currentBalance)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                            <p className="font-medium">{account.interestRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly</p>
                            <p className="font-medium">{formatCurrency(account.monthlyContribution)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Goal Date</p>
                            <p className="font-medium">{formatDate(account.goalDate)}</p>
                          </div>
                        </div>

                        <div className="flex items-center mt-2 md:mt-0">
                          {expandedSection === account.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>
                            Current: {formatCurrency(account.currentBalance)} (
                            {((account.currentBalance / account.goalAmount) * 100).toFixed(0)}%)
                          </span>
                          <span>Goal: {formatCurrency(account.goalAmount)}</span>
                        </div>
                        <Progress
                          value={(account.currentBalance / account.goalAmount) * 100}
                          className="h-2"
                          indicatorClassName="bg-[#00CC66]"
                        />
                      </div>
                    </div>

                    {expandedSection === account.id && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Recent Transactions</h4>
                            <div className="space-y-2">
                              {account.transactions.map((transaction: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="flex items-center">
                                    {transaction.type === "deposit" ? (
                                      <ArrowDownRight className="h-4 w-4 text-green-500 mr-2" />
                                    ) : (
                                      <ArrowUpRight className="h-4 w-4 text-red-500 mr-2" />
                                    )}
                                    <span>{formatDate(transaction.date)}</span>
                                  </div>
                                  <div
                                    className={`font-medium ${transaction.type === "deposit" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                  >
                                    {transaction.type === "deposit" ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Projected Growth</h4>
                            <div className="h-[200px] mb-4">
                              <ChartContainer
                                data={[
                                  { month: "Now", balance: account.currentBalance },
                                  {
                                    month: "+3mo",
                                    balance:
                                      account.currentBalance * (1 + account.interestRate / 100 / 4) +
                                      account.monthlyContribution * 3,
                                  },
                                  {
                                    month: "+6mo",
                                    balance:
                                      account.currentBalance * (1 + account.interestRate / 100 / 2) +
                                      account.monthlyContribution * 6,
                                  },
                                  {
                                    month: "+9mo",
                                    balance:
                                      account.currentBalance * (1 + (account.interestRate / 100) * 0.75) +
                                      account.monthlyContribution * 9,
                                  },
                                  {
                                    month: "+1yr",
                                    balance:
                                      account.currentBalance * (1 + account.interestRate / 100) +
                                      account.monthlyContribution * 12,
                                  },
                                ]}
                              >
                                <Chart>
                                  <ChartGrid className="stroke-gray-200 dark:stroke-gray-700" />
                                  <ChartLine dataKey="balance" className="stroke-[#00CC66] stroke-[2px]" />
                                  <ChartArea dataKey="balance" className="fill-[#00CC66]/20" />
                                  <ChartTooltip>
                                    {({ dataPoint }) => (
                                      <ChartTooltipContent>
                                        <div className="flex flex-col gap-1">
                                          <span className="text-xs font-medium">
                                            Balance: {formatCurrency(dataPoint.balance || 0)}
                                          </span>
                                        </div>
                                      </ChartTooltipContent>
                                    )}
                                  </ChartTooltip>
                                </Chart>
                              </ChartContainer>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex space-x-2">
                                <Button className="flex-1 bg-[#00CC66] hover:bg-[#00BB55]">Make Deposit</Button>
                                <Button variant="outline" className="flex-1">
                                  Adjust Goal
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goal Tracker Widget */}
          <FinancialWidget type="goal-tracker" showHeader={true} />
        </TabsContent>

        {/* Credit Score Tab */}
        <TabsContent value="credit" className="space-y-8">
          {/* Credit Score Overview */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
              <CardTitle>Credit Score Overview</CardTitle>
              <CardDescription className="text-white/80">
                Monitor your credit score and factors affecting it
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-4">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          className="dark:stroke-gray-700"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={
                            userData.creditScore.current >= 740
                              ? "#10b981"
                              : userData.creditScore.current >= 670
                                ? "#3b82f6"
                                : userData.creditScore.current >= 580
                                  ? "#f59e0b"
                                  : "#ef4444"
                          }
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * userData.creditScore.current) / 850}
                          className="transform -rotate-90 origin-center"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-[#003366] dark:text-white">
                          {userData.creditScore.current}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">out of 850</span>
                      </div>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-2 ${
                        userData.creditScore.current >= 740
                          ? "text-green-500 dark:text-green-400"
                          : userData.creditScore.current >= 670
                            ? "text-blue-500 dark:text-blue-400"
                            : userData.creditScore.current >= 580
                              ? "text-yellow-500 dark:text-yellow-400"
                              : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {userData.creditScore.current >= 740
                        ? "Excellent"
                        : userData.creditScore.current >= 670
                          ? "Good"
                          : userData.creditScore.current >= 580
                            ? "Fair"
                            : "Poor"}
                    </h3>

                    <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                      Your credit score is{" "}
                      {userData.creditScore.current >= 740
                        ? "excellent"
                        : userData.creditScore.current >= 670
                          ? "good"
                          : userData.creditScore.current >= 580
                            ? "fair"
                            : "poor"}
                      .{" "}
                      {userData.creditScore.current >= 740
                        ? "You qualify for the best rates and terms."
                        : userData.creditScore.current >= 670
                          ? "You qualify for most loans with good rates."
                          : userData.creditScore.current >= 580
                            ? "You may face higher interest rates on loans."
                            : "You may have difficulty getting approved for credit."}
                    </p>

                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 mb-4">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+{userData.overview.creditScoreChange} points in the last 3 months</span>
                    </div>

                    <Button className="bg-[#003366] hover:bg-[#002244]">Get Full Credit Report</Button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Credit Score Factors</h3>

                  <div className="space-y-4">
                    {userData.creditScore.factors.map((factor: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getStatusBg(factor.status)} mr-2`}></div>
                            <h4 className="font-medium">{factor.name}</h4>
                          </div>
                          <Badge variant="outline" className={getStatusColor(factor.status)}>
                            {factor.status.charAt(0).toUpperCase() + factor.status.slice(1)}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{factor.description}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Impact: {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)}</span>
                          <span>{factor.score}/100</span>
                        </div>
                        <Progress
                          value={factor.score}
                          className="h-2"
                          indicatorClassName={getStatusBg(factor.status)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Recommendations to Improve</h3>
                    <ul className="space-y-2">
                      {userData.creditScore.recommendations.map((recommendation: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Score History */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
              <CardTitle>Credit Score History</CardTitle>
              <CardDescription className="text-white/80">Track your credit score changes over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ChartContainer
                  data={userData.creditScore.history.map((item: any) => ({
                    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    score: item.score,
                  }))}
                >
                  <Chart>
                    <ChartGrid className="stroke-gray-200 dark:stroke-gray-700" />
                    <ChartLine dataKey="score" className="stroke-[#00CC66] stroke-[3px]" />
                    <ChartArea dataKey="score" className="fill-[#00CC66]/20" />
                    <ChartTooltip>
                      {({ dataPoint }) => (
                        <ChartTooltipContent>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium">Credit Score: {dataPoint.score}</span>
                            <span className="text-xs text-gray-500">{dataPoint.date}</span>
                          </div>
                        </ChartTooltipContent>
                      )}
                    </ChartTooltip>
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Credit Score Simulator */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
              <CardTitle>Credit Score Simulator</CardTitle>
              <CardDescription className="text-white/80">
                See how different actions could affect your credit score
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Simulate Actions</h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pay-down-credit-card">Pay down credit card balance by $1,000</Label>
                        <Switch id="pay-down-credit-card" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated impact: +15 points</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="apply-new-credit">Apply for a new credit card</Label>
                        <Switch id="apply-new-credit" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Estimated impact: -5 points (short term), +10 points (long term)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="miss-payment">Miss a payment</Label>
                        <Switch id="miss-payment" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated impact: -80 to -110 points</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="increase-credit-limit">Increase credit limit by $5,000</Label>
                        <Switch id="increase-credit-limit" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated impact: +10 to +20 points</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pay-loan">Pay off a loan completely</Label>
                        <Switch id="pay-loan" />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated impact: +5 to +15 points</p>
                    </div>

                    <Button className="w-full bg-[#003366] hover:bg-[#002244]">Simulate Changes</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Projected Impact</h3>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Score</p>
                        <p className="text-2xl font-bold text-[#003366] dark:text-white">
                          {userData.creditScore.current}
                        </p>
                      </div>
                      <div className="text-center">
                        <ArrowRight className="h-6 w-6 text-gray-400 mx-auto" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Projected Score</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {userData.creditScore.current + 15}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Poor</span>
                          <span>Fair</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-sm">Current</span>
                          </div>
                          <div
                            className="h-6 w-0.5 bg-blue-500 ml-1.5 mt-1"
                            style={{ marginLeft: `${(userData.creditScore.current / 850) * 100}%` }}
                          ></div>
                        </div>

                        <div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-sm">Projected</span>
                          </div>
                          <div
                            className="h-6 w-0.5 bg-green-500 ml-1.5 mt-1"
                            style={{ marginLeft: `${((userData.creditScore.current + 15) / 850) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium mb-2">Potential Benefits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Lower interest rates on loans and credit cards</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Higher approval odds for premium credit cards</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Better terms on mortgages and auto loans</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

