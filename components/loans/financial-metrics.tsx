"use client"

import {useEffect, useState} from "react"
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  PiggyBank,
  Download,
  TrendingUp,
  Calendar,
  Info,
  ChevronDown,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChartIcon,
  Clock,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


export default function FinancialMetrics() {
  const [timeframe, setTimeframe] = useState("month")
  const [chartView, setChartView] = useState("contributions")
  const [isClient, setIsClient] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Financial data state
  const [financialData, setFinancialData] = useState({
    totalContributed: 0,
    totalLentOut: 0,
    availableBalance: 0,
    interestEarned: 0,
    contributionGrowth: 0,
    loanGrowth: 0,
    projectedInterest: 0,
    riskScore: 0,
    nextPaymentAmount: 0,
    nextPaymentDate: "",
    daysUntilNextPayment: 0,
    defaultRisk: "Low",
    fundUtilization: 0,
    averageInterestRate: 0,
    totalMembers: 0,
    activeLoans: 0,
  })

  // Fetch groups where the user is a member
  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      const data = await response.json()
      setGroups(data)

      // Set the first group as selected by default if there are groups
      if (data.length > 0 && !selectedGroupId) {
        setSelectedGroupId(data[0].id)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Fetch financial data based on the selected group
  const fetchFinancialData = async () => {
    if (!selectedGroupId) return

    setLoading(true)
    setError(null)

    try {
      // Fetch user's membership for the selected group
      const membershipResponse = await fetch(`/api/groups/members?groupId=${selectedGroupId}`)
      if (!membershipResponse.ok) {
        throw new Error('Failed to fetch membership')
      }
      const membershipData = await membershipResponse.json()

      // Find the current user's membership
      // Since we don't have a percentage field, we'll assume equal distribution among members
      const totalMembers = membershipData.length
      const equalPercentage = totalMembers > 0 ? 100 / totalMembers : 100
      const userMembership = { percentage: equalPercentage }

      // Fetch contributions for the selected group
      const contributionsResponse = await fetch(`/api/contributions?groupId=${selectedGroupId}`)
      if (!contributionsResponse.ok) {
        throw new Error('Failed to fetch contributions')
      }
      const contributionsData = await contributionsResponse.json()

      // Fetch loans for the selected group
      const loansResponse = await fetch(`/api/loans?groupId=${selectedGroupId}`)
      if (!loansResponse.ok) {
        throw new Error('Failed to fetch loans')
      }
      const loansData = await loansResponse.json()

      // Calculate financial metrics
      const totalContributions = contributionsData.statistics.totalContributions || 0

      // Filter approved loans
      const approvedLoans = loansData.filter((loan: any) => loan.status === "APPROVED")
      const totalLentOut = approvedLoans.reduce((sum: number, loan: any) => sum + Number(loan.amount), 0)

      // Calculate projected interest from approved loans (total repayment amount)
      const projectedInterest = approvedLoans.reduce((sum: number, loan: any) => {
        const principal = Number(loan.amount)
        const interestRate = Number(loan.interestRate) / 100
        // Calculate total repayment amount (principal + interest)
        const totalRepayment = principal * (1 + interestRate)
        return sum + (totalRepayment * (userMembership.percentage / 100 || 1))
      }, 0)

      // Calculate available balance (total contributions + projected interest)
      const availableBalance = totalContributions + projectedInterest

      // Calculate fund utilization
      const fundUtilization = totalContributions > 0 
        ? (totalLentOut / totalContributions) * 100 
        : 0

      // Calculate average interest rate
      const averageInterestRate = approvedLoans.length > 0
        ? approvedLoans.reduce((sum: number, loan: any) => sum + Number(loan.interestRate), 0) / approvedLoans.length
        : 0

      // Update financial data state
      setFinancialData({
        totalContributed: totalContributions,
        totalLentOut: totalLentOut,
        availableBalance: availableBalance,
        interestEarned: 0, // This would need additional calculation
        contributionGrowth: 0, // This would need historical data
        loanGrowth: 0, // This would need historical data
        projectedInterest: projectedInterest,
        riskScore: 0, // This would need additional calculation
        nextPaymentAmount: 0, // This would need additional data
        nextPaymentDate: "", // This would need additional data
        daysUntilNextPayment: 0, // This would need additional data
        defaultRisk: "Low", // This would need additional calculation
        fundUtilization: fundUtilization,
        averageInterestRate: averageInterestRate,
        totalMembers: contributionsData.statistics.totalActiveContributors || 0,
        activeLoans: approvedLoans.length,
      })

      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsClient(true)
    fetchGroups()
  }, [])

  useEffect(() => {
    if (selectedGroupId) {
      fetchFinancialData()
    }
  }, [selectedGroupId])

  // Mock chart data
  const contributionData = [
    { name: "Jan", value: 1200, average: 1000, previousYear: 800 },
    { name: "Feb", value: 1400, average: 1050, previousYear: 850 },
    { name: "Mar", value: 1300, average: 1100, previousYear: 900 },
    { name: "Apr", value: 1500, average: 1150, previousYear: 950 },
    { name: "May", value: 1700, average: 1200, previousYear: 1000 },
    { name: "Jun", value: 1600, average: 1250, previousYear: 1050 },
    { name: "Jul", value: 1800, average: 1300, previousYear: 1100 },
    { name: "Aug", value: 2000, average: 1350, previousYear: 1150 },
    { name: "Sep", value: 2200, average: 1400, previousYear: 1200 },
    { name: "Oct", value: 2400, average: 1450, previousYear: 1250 },
    { name: "Nov", value: 2600, average: 1500, previousYear: 1300 },
    { name: "Dec", value: 2800, average: 1550, previousYear: 1350 },
  ]

  const loanData = [
    { name: "Jan", value: 800, repaid: 200, previousYear: 600 },
    { name: "Feb", value: 1200, repaid: 300, previousYear: 700 },
    { name: "Mar", value: 900, repaid: 400, previousYear: 650 },
    { name: "Apr", value: 1100, repaid: 500, previousYear: 800 },
    { name: "May", value: 1300, repaid: 600, previousYear: 900 },
    { name: "Jun", value: 1000, repaid: 700, previousYear: 750 },
    { name: "Jul", value: 1400, repaid: 800, previousYear: 950 },
    { name: "Aug", value: 1600, repaid: 900, previousYear: 1100 },
    { name: "Sep", value: 1500, repaid: 1000, previousYear: 1050 },
    { name: "Oct", value: 1700, repaid: 1100, previousYear: 1200 },
    { name: "Nov", value: 1900, repaid: 1200, previousYear: 1300 },
    { name: "Dec", value: 2100, repaid: 1300, previousYear: 1400 },
  ]

  const forecastData = [
    { name: "Jan", actual: 6500, forecast: 6500, optimistic: 6500, pessimistic: 6500 },
    { name: "Feb", actual: 7000, forecast: 7000, optimistic: 7000, pessimistic: 7000 },
    { name: "Mar", actual: 7200, forecast: 7200, optimistic: 7200, pessimistic: 7200 },
    { name: "Apr", actual: 7500, forecast: 7500, optimistic: 7500, pessimistic: 7500 },
    { name: "May", actual: 8000, forecast: 8000, optimistic: 8000, pessimistic: 8000 },
    { name: "Jun", actual: 8200, forecast: 8200, optimistic: 8200, pessimistic: 8200 },
    { name: "Jul", actual: null, forecast: 8500, optimistic: 8700, pessimistic: 8300 },
    { name: "Aug", actual: null, forecast: 8800, optimistic: 9100, pessimistic: 8500 },
    { name: "Sep", actual: null, forecast: 9200, optimistic: 9600, pessimistic: 8800 },
    { name: "Oct", actual: null, forecast: 9600, optimistic: 10100, pessimistic: 9100 },
    { name: "Nov", actual: null, forecast: 10000, optimistic: 10600, pessimistic: 9400 },
    { name: "Dec", actual: null, forecast: 10500, optimistic: 11200, pessimistic: 9800 },
  ]



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMK",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "week":
        return "This Week"
      case "month":
        return "This Month"
      case "quarter":
        return "This Quarter"
      case "year":
        return "This Year"
      case "all":
        return "All Time"
      default:
        return "This Month"
    }
  }

  const aiInsights = [
    "Contributions have increased by 12.5% compared to last month",
    "Fund utilization is at 56.7%, which is optimal for maintaining liquidity",
    "Consider increasing short-term loans to improve interest earnings",
    "Default risk is currently low based on member repayment history",
  ]

  if(!isClient){
    return null
  }

  return (
   <>
     <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl bg-white dark:bg-slate-900">
       <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 border-b border-slate-200 dark:border-slate-800">
         <div className="space-y-1">
           <div className="flex items-center gap-2">
             <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Financial Overview</CardTitle>
             {showAIInsights && (
                 <Badge
                     variant="outline"
                     className="ml-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900"
                 >
                   <Sparkles className="h-3 w-3 mr-1" />
                   AI Enhanced
                 </Badge>
             )}
           </div>
           <CardDescription className="text-slate-500 dark:text-slate-400">
             Track contributions, loans, and group finances for {getTimeframeLabel().toLowerCase()}
           </CardDescription>
         </div>
         <div className="flex items-center gap-2 flex-col sm:flex-row w-full sm:w-auto">
           <Select value={selectedGroupId || ""} onValueChange={setSelectedGroupId}>
             <SelectTrigger className="w-full sm:w-[180px] rounded-md border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
               <SelectValue placeholder="Select group" />
             </SelectTrigger>
             <SelectContent>
               {groups.map((group) => (
                 <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
               ))}
             </SelectContent>
           </Select>
           <Select value={timeframe} onValueChange={setTimeframe}>
             <SelectTrigger className="w-full sm:w-[130px] rounded-md border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
               <SelectValue placeholder="Select timeframe" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="week">This Week</SelectItem>
               <SelectItem value="month">This Month</SelectItem>
               <SelectItem value="quarter">This Quarter</SelectItem>
               <SelectItem value="year">This Year</SelectItem>
               <SelectItem value="all">All Time</SelectItem>
             </SelectContent>
           </Select>
           <Popover>
             <PopoverTrigger asChild>
               <Button
                   variant="outline"
                   size="sm"
                   className="rounded-md border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
               >
                 Export <ChevronDown className="ml-1 h-3 w-3" />
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-48 p-0" align="end">
               <div className="flex flex-col">
                 <Button variant="ghost" size="sm" className="justify-start rounded-none">
                   <Download className="mr-2 h-4 w-4" /> Export as CSV
                 </Button>
                 <Button variant="ghost" size="sm" className="justify-start rounded-none">
                   <Download className="mr-2 h-4 w-4" /> Export as PDF
                 </Button>
                 <Button variant="ghost" size="sm" className="justify-start rounded-none">
                   <Download className="mr-2 h-4 w-4" /> Export as Excel
                 </Button>
               </div>
             </PopoverContent>
           </Popover>
         </div>
       </CardHeader>
       <CardContent className="px-0 pb-0">
         <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 md:grid-cols-4">
           <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
             <div className="flex items-center gap-2">
               <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Contributed</span>
             </div>
             <div className="mt-1 flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialData.totalContributed)}
              </span>
               <span className="ml-2 text-xs flex items-center gap-0.5 text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                 {financialData.contributionGrowth}%
              </span>
             </div>
             <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
               From {financialData.totalMembers} members
             </div>
           </div>
           <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
             <div className="flex items-center gap-2">
               <ArrowDownCircle className="h-4 w-4 text-amber-500" />
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Lent Out</span>
             </div>
             <div className="mt-1 flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialData.totalLentOut)}
              </span>
               <span className="ml-2 text-xs flex items-center gap-0.5 text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                 {financialData.loanGrowth}%
              </span>
             </div>
             <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
               {financialData.activeLoans} active loans
             </div>
           </div>
           <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
             <div className="flex items-center gap-2">
               <Wallet className="h-4 w-4 text-blue-500" />
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Available Balance</span>
             </div>
             <div className="mt-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialData.availableBalance)}
              </span>
             </div>
             <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
               Fund utilization: {formatPercentage(financialData.fundUtilization)}
             </div>
           </div>
           <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <div className="cursor-help">
                     <div className="flex items-center gap-2">
                       <PiggyBank className="h-4 w-4 text-purple-500" />
                       <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Projected Interest</span>
                       <Info className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                     </div>
                     <div className="mt-1">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(financialData.projectedInterest)}
                      </span>
                     </div>
                     <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                       Avg. rate: {financialData.averageInterestRate}%
                     </div>
                   </div>
                 </TooltipTrigger>
                 <TooltipContent>
                   <p>Projected interest earnings by end of year based on current loan portfolio</p>
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
           </div>
         </div>


       </CardContent>
       <CardFooter className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 mt-4">
         <div className="text-xs text-slate-500 dark:text-slate-400">Last updated: Today at 10:35 AM</div>
         <Button
             variant="link"
             size="sm"
             className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
         >
           View detailed reports <ArrowRight className="ml-1 h-3 w-3" />
         </Button>
       </CardFooter>
     </Card>
   </>
  )
}
