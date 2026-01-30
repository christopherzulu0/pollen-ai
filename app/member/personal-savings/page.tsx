"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Clock,
  Plus,
  ChevronRight,
  BarChart3,
  Wallet,
  Target,
  Bell,
  Calendar,
  TrendingUp,
  Filter,
  Search,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Brain,
  Loader2,
  Info,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  isCompleted: boolean
  transactions?: {
    id: string
    amount: number
    type: string
    description: string
    createdAt: Date
  }[]
}

interface PersonalSavings {
  id: string
  balance: number
}

interface AIAnalysis {
  creditScore: number
  scoreCategory: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  riskLevel: 'Low' | 'Medium' | 'High'
  analysis: string
  recommendations: string[]
  predictedCompletionDate: string
  onTrack: boolean
  confidence: number
  goalId: string
  analyzedAt: string
  metrics: {
    progressPercentage: string
    avgMonthlyContribution: string
    requiredMonthlyContribution: string
    daysUntilDeadline: number
    remainingAmount: number
  }
}

export default function PersonalSavingsTab() {
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false)
  const [showAIAnalysisDialog, setShowAIAnalysisDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [amount, setAmount] = useState("")
  const [isDeposit, setIsDeposit] = useState(true)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch personal savings and goals
  const { data, isLoading } = useQuery({
    queryKey: ['personalSavings'],
    queryFn: async () => {
      const response = await fetch("/api/personal-savings")
      if (!response.ok) {
        throw new Error("Failed to fetch personal savings")
      }
      return response.json()
    }
  })

  // Mutation for adding new goal
  const addGoalMutation = useMutation({
    mutationFn: async (newGoal: Omit<SavingsGoal, 'id' | 'isCompleted'>) => {
      const response = await fetch("/api/savings-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      })
      if (!response.ok) {
        throw new Error("Failed to create savings goal")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalSavings'] })
      setShowNewGoalDialog(false)
      toast({
        title: "Success",
        description: "New savings goal created",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create savings goal",
        variant: "destructive",
      })
    }
  })

  // Mutation for adding funds
  const addFundsMutation = useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string, amount: number }) => {
      const response = await fetch(`/api/savings-goals/${goalId}/add-funds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })
      if (!response.ok) {
        throw new Error("Failed to add funds")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalSavings'] })
      setShowAddFundsDialog(false)
      toast({
        title: "Success",
        description: "Funds added successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add funds",
        variant: "destructive",
      })
    }
  })

  const createTransaction = useMutation({
    mutationFn: async ({ goalId, amount, type }: { goalId: string; amount: number; type: string }) => {
      const response = await fetch(`/api/savings-goals/${goalId}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type }),
      });
      if (!response.ok) throw new Error("Failed to create transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings-goals"] });
      toast({
        title: "Success",
        description: "Transaction completed successfully",
      });
      setAmount("");
      setSelectedGoal(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // AI Analysis Mutation - Fetch latest analysis
  const aiAnalysisMutation = useMutation({
    mutationFn: async (goalId: string) => {
      // First try to GET the latest analysis
      let response = await fetch(`/api/savings-goals/${goalId}/ai-analysis`, {
        method: "GET",
      });
      
      let isNewAnalysis = false;
      // If no analysis exists yet, generate a new one
      if (!response.ok) {
        isNewAnalysis = true;
        response = await fetch(`/api/savings-goals/${goalId}/ai-analysis`, {
          method: "POST",
        });
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get AI analysis");
      }
      const data = await response.json();
      return { ...data, isNewAnalysis };
    },
    onSuccess: (data) => {
      setAiAnalysis(data.data);
      setShowAIAnalysisDialog(true);
      
      if (data.isNewAnalysis) {
        toast({
          title: "Analysis Generated",
          description: "New AI analysis has been created for this goal",
        });
      }
      // Don't show toast for existing analysis - just open dialog
    },
    onError: (error) => {
      toast({
        title: "Analysis Unavailable",
        description: error.message || "Analysis will be available shortly after goal creation",
        variant: "destructive",
      });
    },
  });

  const handleAddNewGoal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newGoal = {
      name: formData.get("goalName") as string,
      targetAmount: Number(formData.get("targetAmount")),
      currentAmount: 0,
      deadline: new Date(formData.get("targetDate") as string),
    }
    addGoalMutation.mutate(newGoal)
  }

  const handleAddFunds = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedGoal) return

    const formData = new FormData(e.currentTarget)
    const amount = Number(formData.get("amount"))

    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    addFundsMutation.mutate({ goalId: selectedGoal.id, amount })
  }

  const handleTransaction = (goal: SavingsGoal) => {
    if (!amount || isNaN(Number(amount))) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    createTransaction.mutate({
      goalId: goal.id,
      amount: Number(amount),
      type: isDeposit ? "DEPOSIT" : "WITHDRAWAL",
    });
  };

  const handleAIAnalysis = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    aiAnalysisMutation.mutate(goal.id);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-emerald-600 bg-emerald-50";
    if (risk === "Medium") return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const personalSavings = data?.personalSavings || null
  const savingsGoals = data?.savingsGoals || []

  const totalSavings = personalSavings?.balance || 0
  const totalTarget = savingsGoals.reduce((sum: number, goal: SavingsGoal) => {
    const amount = Number(goal.targetAmount) || 0
    return sum + amount
  }, 0)
  const overallProgress = totalTarget > 0 ? Math.round((totalSavings / totalTarget) * 100) : 0

  if (isLoading) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
          {/* Header Skeleton */}
          <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-center">
            <div>
              <Skeleton className="h-8 sm:h-9 w-64 sm:w-80 mb-2" />
              <Skeleton className="h-4 sm:h-5 w-48 sm:w-64" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-9 sm:h-10 w-28 sm:w-32" />
              <Skeleton className="h-9 sm:h-10 w-20 sm:w-24" />
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mx-auto max-w-sm sm:max-w-none mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-7 sm:h-8 w-20" />
                    </div>
                    <Skeleton className="h-10 sm:h-12 w-10 sm:w-12 rounded-full" />
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="mt-8">
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Goals Grid Skeleton */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <Skeleton className="h-7 w-48" />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Skeleton className="h-10 flex-1 sm:w-48" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2 p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-40 mt-2" />
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <Skeleton className="h-2 w-full mb-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Skeleton className="h-16 rounded-lg" />
                        <Skeleton className="h-16 rounded-lg" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-4 sm:p-6">
                      <Skeleton className="h-9 w-full sm:w-24" />
                      <Skeleton className="h-9 w-full sm:w-28" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="mt-6 sm:mt-8">
            <Card>
              <CardHeader className="pb-2 p-4 sm:p-6">
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 sm:p-6 mx-auto max-w-sm sm:max-w-none">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Personal Savings Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track, manage, and achieve your financial goals</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all text-sm sm:text-base">
                  <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add New Goal</span>
                  <span className="sm:hidden">New Goal</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[425px]">
                <form onSubmit={handleAddNewGoal}>
                  <DialogHeader>
                    <DialogTitle>Create New Savings Goal</DialogTitle>
                    <DialogDescription>Set up a new financial goal to track your progress.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="goalName">Goal Name</Label>
                      <Input
                        id="goalName"
                        name="goalName"
                        placeholder="e.g. Vacation Fund"
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="targetAmount">Target Amount (K)</Label>
                      <Input
                        id="targetAmount"
                        name="targetAmount"
                        type="number"
                        min="1"
                        placeholder="1000"
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        name="targetDate"
                        type="date"
                        required
                        className="text-foreground"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue="personal">
                        <SelectTrigger className="text-foreground">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowNewGoalDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      disabled={addGoalMutation.isPending}
                    >
                      {addGoalMutation.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        'Create Goal'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="text-sm sm:text-base">
              <Filter className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mx-auto max-w-sm sm:max-w-none">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Wallet className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                  Total Savings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl sm:text-3xl font-bold">K{totalSavings.toLocaleString()}</h3>
                  <div className="flex items-center text-sm text-emerald-600">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    <span>+K250 this month</span>
                  </div>
                </div>
                <Progress value={overallProgress} className="mt-4 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {overallProgress}% of K{totalTarget.toLocaleString()} total goal
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Target className="mr-2 h-5 w-5 text-blue-500" />
                  Active Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold">{savingsGoals.length}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-7"
                  >
                    View All
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {savingsGoals.slice(0, 3).map((goal: SavingsGoal, i: number) => (
                    <div key={i} className="h-2 flex-1 rounded-full bg-blue-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${Math.round((goal.currentAmount / goal.targetAmount) * 100)}%` }}
                      ></div>
                    </div>
                  ))}
                  {savingsGoals.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-600 font-medium">
                      +{savingsGoals.length - 3}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                  Next Contribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold">K250</h3>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Automatic
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    May 15, 2023
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-0 h-7"
                  >
                    Adjust
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="mr-2 h-5 w-5 text-amber-500" />
                  Projected Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold">+12%</h3>
                  <div className="flex items-center text-sm text-amber-600">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    <span>Annual</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  {[40, 65, 45, 70, 85, 60, 90].map((value, i) => (
                    <div
                      key={i}
                      className="h-8 w-full rounded-sm bg-amber-500"
                      style={{ height: `K{value}%`, opacity: 0.1 + i * 0.1 }}
                    ></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="mt-8">
          <Tabs defaultValue="goals" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="goals" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Savings Goals</span>
                <span className="sm:hidden">Goals</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Transactions</span>
                <span className="sm:hidden">History</span>
              </TabsTrigger>

              <TabsTrigger value="reminders" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Reminders</span>
                <span className="sm:hidden">Alerts</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="goals" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-semibold">Your Savings Goals</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search goals..." className="w-full sm:w-[200px] pl-8 rounded-lg text-sm" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[110px] sm:w-[130px] text-sm">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Goals</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {savingsGoals.map((goal: SavingsGoal, index: number) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader className="pb-2 p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base sm:text-lg truncate">{goal.name}</CardTitle>
                          <Badge variant={goal.isCompleted ? "default" : "secondary"}>
                            {goal.isCompleted ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <CardDescription>
                          <Clock className="mr-1 inline-block h-3 w-3" />
                          Target date: {format(goal.deadline, 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6">
                        <div className="mb-2">
                          <Progress value={Math.round((goal.currentAmount / goal.targetAmount) * 100)} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            K{goal.currentAmount.toLocaleString()} / K{goal.targetAmount.toLocaleString()}
                          </span>
                          <span className="font-medium">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-muted p-2 text-center">
                            <p className="text-xs text-muted-foreground">Monthly</p>
                            <p className="font-medium">K50</p>
                          </div>
                          <div className="rounded-lg bg-muted p-2 text-center">
                            <p className="text-xs text-muted-foreground">Remaining</p>
                            <p className="font-medium">K{(goal.targetAmount - goal.currentAmount).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2 p-4 sm:p-6">
                        <div className="flex gap-2 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedGoal(goal)
                              setShowDetailsDialog(true)
                            }}
                          >
                            Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedGoal(goal)
                              setShowAddFundsDialog(true)
                            }}
                          >
                            Add Funds
                          </Button>
                        </div>
                        <div className="w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs sm:text-sm border-purple-200 hover:bg-purple-50 hover:text-purple-700 relative"
                            onClick={() => handleAIAnalysis(goal)}
                            disabled={aiAnalysisMutation.isPending}
                          >
                            {aiAnalysisMutation.isPending && selectedGoal?.id === goal.id ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Loading...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-3 w-3" />
                                View AI Analysis
                                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-700 rounded-full">
                                  Auto
                                </span>
                              </>
                            )}
                          </Button>
                          <p className="text-[10px] text-muted-foreground text-center mt-1">
                            Updates automatically
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: savingsGoals.length * 0.1 }}
                >
                  <Card className="h-full border-dashed">
                    <CardContent className="flex h-full flex-col items-center justify-center p-6">
                      <div className="rounded-full bg-muted p-3">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="mt-4 text-center text-muted-foreground">Create a new savings goal</p>
                      <Button
                        className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        onClick={() => setShowNewGoalDialog(true)}
                      >
                        Add New Goal
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[110px] sm:w-[130px] text-sm">
                          <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="deposits">Deposits</SelectItem>
                          <SelectItem value="withdrawals">Withdrawals</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {savingsGoals.map((goal: SavingsGoal) => (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`rounded-full p-2 ${goal.currentAmount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                }`}
                            >
                              {goal.currentAmount > 0 ? (
                                <ArrowUpRight className="h-5 w-5" />
                              ) : (
                                <ArrowDownRight className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {goal.currentAmount > 0 ? "Deposit to" : "Withdrawal from"} {goal.name}
                              </p>
                              <p className="text-sm text-muted-foreground">{format(goal.deadline, 'MMM d, yyyy')}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-medium ${goal.currentAmount > 0 ? "text-emerald-600" : "text-red-600"
                                }`}
                            >
                              {goal.currentAmount > 0 ? "+" : "-"}K{goal.currentAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">Balance: K3,250</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between border-t px-6 py-4">
                  <p className="text-sm text-muted-foreground">Showing 5 of 24 transactions</p>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="reminders" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Reminders</CardTitle>
                  <CardDescription>Stay on track with personalized notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                            <Bell className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Monthly Contribution Reminder</h4>
                            <p className="text-sm text-muted-foreground">
                              Automatic deposit of $250 scheduled for May 15, 2023
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-blue-100 p-2 text-blue-700">
                            <Target className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Goal Milestone Alert</h4>
                            <p className="text-sm text-muted-foreground">
                              Notify me when I reach 75% of my Emergency Fund goal
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-emerald-100 p-2 text-emerald-700">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Target Date Approaching</h4>
                            <p className="text-sm text-muted-foreground">
                              Notify me 30 days before my New Laptop goal target date
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-dashed p-4">
                      <div className="flex flex-col items-center justify-center py-6">
                        <Plus className="h-8 w-8 text-muted-foreground/50" />
                        <p className="mt-2 text-center text-muted-foreground">Create a new reminder</p>
                        <Button className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                          Add Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8">
          <Card>
            <CardHeader className="pb-2 p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
              <CardDescription className="text-sm">Manage your personal savings</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 sm:p-6 mx-auto max-w-sm sm:max-w-none">
              <Button className="h-auto justify-between bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 p-3 sm:p-4">
                <div className="flex items-center">
                  <ArrowUpRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="text-left">
                    <p className="font-medium text-sm sm:text-base">Deposit Funds</p>
                    <p className="text-xs text-white/80">Add money to your goals</p>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <Button variant="outline" className="h-auto justify-between p-4">
                <div className="flex items-center">
                  <ArrowDownRight className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Withdraw Funds</p>
                    <p className="text-xs text-muted-foreground">Access your savings</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="h-auto justify-between p-4">
                <div className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Download Statement</p>
                    <p className="text-xs text-muted-foreground">Get your records</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="h-auto justify-between p-4">
                <div className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Savings Calculator</p>
                    <p className="text-xs text-muted-foreground">Plan your future</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Goal Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedGoal?.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">View and manage your savings goal</DialogDescription>
            </DialogHeader>
            {selectedGoal && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-foreground">Target Amount</Label>
                  <p className="text-lg font-semibold text-foreground">K{selectedGoal.targetAmount.toLocaleString()}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Current Amount</Label>
                  <p className="text-lg font-semibold text-foreground">K{selectedGoal.currentAmount.toLocaleString()}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Progress</Label>
                  <Progress
                    value={Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)}% complete
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label className="text-foreground">Target Date</Label>
                  <p className="text-sm text-foreground">{format(selectedGoal.deadline, 'MMM d, yyyy')}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDetailsDialog(false)
                  setShowAddFundsDialog(true)
                }}
              >
                Add Funds
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Funds Dialog */}
        <Dialog open={showAddFundsDialog} onOpenChange={setShowAddFundsDialog}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Funds to {selectedGoal?.name}</DialogTitle>
              <DialogDescription>Enter the amount you want to add to this goal</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddFunds}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (K)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    required
                    className="text-foreground"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddFundsDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  disabled={addFundsMutation.isPending}
                >
                  {addFundsMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Adding...
                    </>
                  ) : (
                    'Add Funds'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* AI Analysis Dialog */}
        <Dialog open={showAIAnalysisDialog} onOpenChange={setShowAIAnalysisDialog}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI Credit Score Analysis
                </DialogTitle>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  Auto-Generated
                </Badge>
              </div>
              <DialogDescription>
                Intelligent analysis of your savings goal: {selectedGoal?.name}
                {aiAnalysis && (
                  <span className="block mt-1 text-xs">
                    Last updated: {format(new Date(aiAnalysis.analyzedAt), 'MMM d, yyyy \'at\' h:mm a')}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            {aiAnalysis && (
              <div className="space-y-6 py-4">
                {/* Credit Score Card */}
                <Card className={`border-2 ${getScoreColor(aiAnalysis.creditScore)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Credit Score</p>
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-4xl font-bold">{aiAnalysis.creditScore}</h3>
                          <span className="text-lg text-muted-foreground">/ 100</span>
                        </div>
                        <Badge className="mt-2" variant="outline">
                          {aiAnalysis.scoreCategory}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                        <Badge className={`mt-2 ${getRiskColor(aiAnalysis.riskLevel)}`}>
                          {aiAnalysis.riskLevel}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {aiAnalysis.confidence}% confident
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4">
                      <Progress value={aiAnalysis.creditScore} className="h-3" />
                    </div>

                    {/* On Track Status */}
                    <div className="mt-4 flex items-center gap-2">
                      {aiAnalysis.onTrack ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-600">On Track to Meet Goal</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <span className="text-sm font-medium text-amber-600">Requires Attention</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {aiAnalysis.analysis}
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Current Progress</p>
                      <p className="text-lg font-bold text-foreground">{aiAnalysis.metrics.progressPercentage}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Days Remaining</p>
                      <p className="text-lg font-bold text-foreground">{aiAnalysis.metrics.daysUntilDeadline}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Avg. Monthly</p>
                      <p className="text-lg font-bold text-foreground">K{aiAnalysis.metrics.avgMonthlyContribution}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Required Monthly</p>
                      <p className="text-lg font-bold text-foreground">K{aiAnalysis.metrics.requiredMonthlyContribution}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Predicted Completion */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Predicted Completion</p>
                        <p className="text-xl font-bold text-foreground">
                          {format(new Date(aiAnalysis.predictedCompletionDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <Card key={index} className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Info Banner */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-purple-800">
                        <p className="font-medium mb-1">Automatic Analysis</p>
                        <p className="text-purple-700">
                          This analysis was automatically generated when you created or updated your goal. 
                          New analyses are generated automatically whenever you add funds or make transactions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Powered by AI */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <Sparkles className="h-3 w-3" />
                  <span>Powered by OpenAI GPT-4</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAIAnalysisDialog(false)}
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
                onClick={() => {
                  setShowAIAnalysisDialog(false)
                  if (selectedGoal) {
                    setShowAddFundsDialog(true)
                  }
                }}
              >
                Add Funds Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
