"use client"

import { useState } from "react"
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
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { format } from "date-fns"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  isCompleted: boolean
  transactions: {
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

export function PersonalSavingsTab() {
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)
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
      toast.success("Transaction completed successfully");
      setAmount("");
      setSelectedGoal(null);
    },
    onError: (error) => {
      toast.error(error.message);
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
      toast.error("Please enter a valid amount");
      return;
    }

    createTransaction.mutate({
      goalId: goal.id,
      amount: Number(amount),
      type: isDeposit ? "DEPOSIT" : "WITHDRAWAL",
    });
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
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Savings Dashboard</h1>
          <p className="text-muted-foreground">Track, manage, and achieve your financial goals</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all">
                <Plus className="mr-2 h-4 w-4" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Wallet className="mr-2 h-5 w-5 text-emerald-500" />
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold">K{totalSavings.toLocaleString()}</h3>
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Savings Goals</span>
              <span className="sm:hidden">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Reminders</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Savings Goals</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search goals..." className="w-[200px] pl-8 rounded-lg" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savingsGoals.map((goal: SavingsGoal, index: number) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>{goal.name}</CardTitle>
                        <Badge variant={goal.isCompleted ? "default" : "secondary"}>
                          {goal.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                      <CardDescription>
                        <Clock className="mr-1 inline-block h-3 w-3" />
                        Target date: {format(goal.deadline, 'MMM d, yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedGoal(goal)
                          setShowDetailsDialog(true)
                        }}
                      >
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                        onClick={() => {
                          setSelectedGoal(goal)
                          setShowAddFundsDialog(true)
                        }}
                      >
                        Add Funds
                      </Button>
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

          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="deposits">Deposits</SelectItem>
                        <SelectItem value="withdrawals">Withdrawals</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
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
                            className={`rounded-full p-2 ${
                              goal.currentAmount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
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
                            className={`font-medium ${
                              goal.currentAmount > 0 ? "text-emerald-600" : "text-red-600"
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

          <TabsContent value="reminders" className="mt-6">
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
      <div className="mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your personal savings</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto justify-between bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 p-4">
              <div className="flex items-center">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Deposit Funds</p>
                  <p className="text-xs text-white/80">Add money to your goals</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
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
        <DialogContent className="sm:max-w-[425px]">
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
        <DialogContent className="sm:max-w-[425px]">
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
    </div>
  )
}
