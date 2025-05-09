"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Download,
  Calendar,
  ArrowRight,
  TrendingUp,
  PieChart,
  Users,
  Filter,
  ChevronUp,
  ChevronDown,
  Info,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Share2,
  Printer,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Home,
  ShieldAlert,
  Zap,
  Lightbulb,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChartContainer } from "@/components/ui/chart"
import { DonutChart, LineChart, BarChart } from "@/components/ui/charts"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import LoanStatusTab from "@/components/loans/LoanComponents/LoanStatusTab";
import LoanPurposeTab from "@/components/loans/LoanComponents/LoanPurposeTab";
import TopContributorsTab from "@/components/loans/LoanComponents/TopContributorsTab";


export default function LoanStatistics() {
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("year")
  const [activeTab, setActiveTab] = useState("status")
  const [sortBy, setSortBy] = useState<string>("amount")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showInsights, setShowInsights] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [compareMode, setCompareMode] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false)
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")

    {/** Set isClient to true when component mounts (for SSR compatibility) */}
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mock data - in a real app, fetch from API
  const loanStatusData = [
    { name: "Active", value: 5, color: "#3b82f6", icon: <Zap className="h-3.5 w-3.5" /> },
    { name: "Pending Approval", value: 3, color: "#f59e0b", icon: <Clock className="h-3.5 w-3.5" /> },
    { name: "Completed", value: 8, color: "#10b981", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    { name: "Defaulted", value: 1, color: "#ef4444", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  ]

  const loanStatusTrends = [
    { month: "Jan", Active: 4, "Pending Approval": 2, Completed: 6, Defaulted: 1 },
    { month: "Feb", Active: 5, "Pending Approval": 3, Completed: 6, Defaulted: 1 },
    { month: "Mar", Active: 6, "Pending Approval": 2, Completed: 7, Defaulted: 0 },
    { month: "Apr", Active: 4, "Pending Approval": 4, Completed: 7, Defaulted: 1 },
    { month: "May", Active: 5, "Pending Approval": 3, Completed: 8, Defaulted: 1 },
    { month: "Jun", Active: 5, "Pending Approval": 3, Completed: 8, Defaulted: 1 },
  ]

  const loanPurposeData = [
    {
      name: "Business",
      value: 6,
      color: "#6366f1",
      trend: "+12%",
      icon: <Briefcase className="h-3.5 w-3.5" />,
      description: "Small business funding and expansion capital",
      avgAmount: 2500,
      successRate: 92,
    },
    {
      name: "Education",
      value: 4,
      color: "#06b6d4",
      trend: "+5%",
      icon: <GraduationCap className="h-3.5 w-3.5" />,
      description: "Tuition fees and educational expenses",
      avgAmount: 1800,
      successRate: 95,
    },
    {
      name: "Medical",
      value: 3,
      color: "#8b5cf6",
      trend: "-3%",
      icon: <Stethoscope className="h-3.5 w-3.5" />,
      description: "Healthcare costs and medical procedures",
      avgAmount: 2200,
      successRate: 88,
    },
    {
      name: "Home Improvement",
      value: 2,
      color: "#f59e0b",
      trend: "+8%",
      icon: <Home className="h-3.5 w-3.5" />,
      description: "Renovations and home repairs",
      avgAmount: 3000,
      successRate: 94,
    },
    {
      name: "Emergency",
      value: 2,
      color: "#10b981",
      trend: "+0%",
      icon: <ShieldAlert className="h-3.5 w-3.5" />,
      description: "Urgent unexpected expenses",
      avgAmount: 1200,
      successRate: 85,
    },
  ]

  const purposeTrendData = [
    { month: "Jan", Business: 4, Education: 3, Medical: 3, "Home Improvement": 1, Emergency: 2 },
    { month: "Feb", Business: 5, Education: 3, Medical: 4, "Home Improvement": 1, Emergency: 2 },
    { month: "Mar", Business: 5, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 1 },
    { month: "Apr", Business: 6, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 2 },
    { month: "May", Business: 6, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 2 },
    { month: "Jun", Business: 6, Education: 4, Medical: 3, "Home Improvement": 2, Emergency: 2 },
  ]

  const memberContributionData = [
    {
      id: 1,
      name: "John D.",
      value: 2500,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "+15%",
      trendDirection: "up",
      lastContribution: "2 days ago",
      totalLoans: 3,
      reliability: 98,
      badge: "Top Contributor",
      contributionHistory: [2100, 2200, 2300, 2400, 2500],
      preferredCategories: ["Business", "Education"],
      joinedDate: "Jan 2023",
      totalContributed: 12500,
    },
    {
      id: 2,
      name: "Sarah W.",
      value: 2250,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "+8%",
      trendDirection: "up",
      lastContribution: "1 week ago",
      totalLoans: 2,
      reliability: 95,
      badge: "Consistent",
      contributionHistory: [2000, 2100, 2150, 2200, 2250],
      preferredCategories: ["Medical", "Emergency"],
      joinedDate: "Mar 2023",
      totalContributed: 10750,
    },
    {
      id: 3,
      name: "Robert J.",
      value: 3000,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "+22%",
      trendDirection: "up",
      lastContribution: "3 days ago",
      totalLoans: 4,
      reliability: 100,
      badge: "Power Lender",
      contributionHistory: [2200, 2400, 2600, 2800, 3000],
      preferredCategories: ["Business", "Home Improvement"],
      joinedDate: "Dec 2022",
      totalContributed: 15000,
    },
    {
      id: 4,
      name: "Jane S.",
      value: 2000,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "-5%",
      trendDirection: "down",
      lastContribution: "2 weeks ago",
      totalLoans: 2,
      reliability: 92,
      badge: null,
      contributionHistory: [2200, 2150, 2100, 2050, 2000],
      preferredCategories: ["Education"],
      joinedDate: "Feb 2023",
      totalContributed: 9500,
    },
    {
      id: 5,
      name: "Michael B.",
      value: 1600,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "+3%",
      trendDirection: "up",
      lastContribution: "5 days ago",
      totalLoans: 1,
      reliability: 90,
      badge: "New Member",
      contributionHistory: [1500, 1550, 1570, 1590, 1600],
      preferredCategories: ["Emergency"],
      joinedDate: "Apr 2023",
      totalContributed: 7500,
    },
    {
      id: 6,
      name: "Lisa T.",
      value: 1850,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "+7%",
      trendDirection: "up",
      lastContribution: "1 day ago",
      totalLoans: 2,
      reliability: 97,
      badge: null,
      contributionHistory: [1700, 1750, 1780, 1820, 1850],
      preferredCategories: ["Medical", "Education"],
      joinedDate: "Jan 2023",
      totalContributed: 8750,
    },
    {
      id: 7,
      name: "David K.",
      value: 1200,
      avatar: "/placeholder.svg?height=40&width=40",
      trend: "-2%",
      trendDirection: "down",
      lastContribution: "3 weeks ago",
      totalLoans: 1,
      reliability: 85,
      badge: null,
      contributionHistory: [1250, 1240, 1230, 1210, 1200],
      preferredCategories: ["Business"],
      joinedDate: "May 2023",
      totalContributed: 5800,
    },
  ]

  const contributionTrendData = [
    { month: "Jan", amount: 8500, previousYear: 7200 },
    { month: "Feb", amount: 9200, previousYear: 7800 },
    { month: "Mar", amount: 11000, previousYear: 8500 },
    { month: "Apr", amount: 10500, previousYear: 9200 },
    { month: "May", amount: 12800, previousYear: 10000 },
    { month: "Jun", amount: 14500, previousYear: 11200 },
  ]

  const repaymentTrendData = [
    { month: "Jan", onTime: 95, late: 5 },
    { month: "Feb", onTime: 92, late: 8 },
    { month: "Mar", onTime: 97, late: 3 },
    { month: "Apr", onTime: 94, late: 6 },
    { month: "May", onTime: 98, late: 2 },
    { month: "Jun", onTime: 96, late: 4 },
  ]

  // Mock groups - in a real app, fetch from API
  const groups = [
    { id: "all", name: "All Groups" },
    { id: "group1", name: "Savings Group A" },
    { id: "group2", name: "Investment Club B" },
    { id: "group3", name: "Community Cooperative" },
  ]

  // Filter contributors based on search query
  const filteredContributors = memberContributionData.filter((contributor) =>
    contributor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort contributors based on selected criteria
  const sortedContributors = [...filteredContributors].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "amount":
        comparison = a.value - b.value
        break
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "reliability":
        comparison = a.reliability - b.reliability
        break
      case "loans":
        comparison = a.totalLoans - b.totalLoans
        break
      case "trend":
        comparison = Number.parseFloat(a.trend.replace("%", "")) - Number.parseFloat(b.trend.replace("%", ""))
        break
      default:
        comparison = a.value - b.value
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const getSortIcon = () => {
    return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  // Calculate total contributions
  const totalContributions = memberContributionData.reduce((sum, contributor) => sum + contributor.value, 0)
  const totalActiveContributors = memberContributionData.length
  const averageContribution = totalContributions / totalActiveContributors

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <Card className="border border-muted/40 shadow-md rounded-xl bg-gradient-to-b from-card to-background overflow-hidden">
      <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-2 lg:space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Loan Analytics
          </CardTitle>
          <CardDescription>Advanced insights into loan performance and member contributions</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-col sm:flex-row w-full sm:w-auto">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-full">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[120px] rounded-full">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:border-primary/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:border-primary/20"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Tabs defaultValue="status" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <div className="px-4 overflow-x-auto pb-2">
            <ScrollArea className="w-full pb-3">
              <TabsList className="inline-flex w-full md:w-auto min-w-full md:min-w-0 h-auto p-1">
                <TabsTrigger
                  value="status"
                  className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm flex items-center gap-1"
                >
                  <PieChart className="h-3.5 w-3.5" />
                  Loan Status
                </TabsTrigger>
                <TabsTrigger
                  value="purpose"
                  className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm flex items-center gap-1"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  Loan Purpose
                </TabsTrigger>
                <TabsTrigger
                  value="contributions"
                  className="flex-1 md:flex-none py-2 px-3 h-auto rounded-full text-xs sm:text-sm flex items-center gap-1"
                >
                  <Users className="h-3.5 w-3.5" />
                  Top Contributors
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          {/* Loan Status Tab */}
          <TabsContent value="status" className="mt-0 pt-4">
           <LoanStatusTab/>
          </TabsContent>

          {/* Loan Purpose Tab */}
          <TabsContent value="purpose" className="mt-0 pt-4">
           <LoanPurposeTab/>
          </TabsContent>

          {/* Top Contributors Tab */}
          <TabsContent value="contributions" className="mt-0 pt-4">
         <TopContributorsTab/>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="px-4 py-3 text-xs text-muted-foreground border-t border-border/50 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last updated: Today at 10:45 AM</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            View full analytics report
          </Button>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
            Schedule automated reports
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
