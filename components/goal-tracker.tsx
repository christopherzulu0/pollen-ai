"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Target, TrendingUp, Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Goal {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  color: string
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 5000,
      currentAmount: 2750,
      deadline: "2024-12-31",
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "New Laptop",
      targetAmount: 1200,
      currentAmount: 800,
      deadline: "2024-06-30",
      color: "bg-purple-500",
    },
    {
      id: 3,
      name: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: "2024-08-15",
      color: "bg-amber-500",
    },
  ])

  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    color: "bg-blue-500",
  })

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isUpdatingGoal, setIsUpdatingGoal] = useState(false)

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setGoals([...goals, { ...newGoal, id: Date.now() }])
      setNewGoal({
        name: "",
        targetAmount: 0,
        currentAmount: 0,
        deadline: "",
        color: "bg-blue-500",
      })
      setIsAddingGoal(false)
    }
  }

  const handleUpdateGoal = () => {
    if (selectedGoal) {
      setGoals(goals.map((goal) => (goal.id === selectedGoal.id ? selectedGoal : goal)))
      setSelectedGoal(null)
      setIsUpdatingGoal(false)
    }
  }

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id))
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const colorOptions = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Amber", value: "bg-amber-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Pink", value: "bg-pink-500" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#003366] dark:text-white">Your Financial Goals</h3>
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button className="bg-[#00CC66] hover:bg-[#00BB55]">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>Create a new savings goal to track your progress.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target Amount ($)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.targetAmount || ""}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">Current Amount ($)</Label>
                  <Input
                    id="current"
                    type="number"
                    value={newGoal.currentAmount || ""}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full ${color.value} ${newGoal.color === color.value ? "ring-2 ring-offset-2 ring-[#003366]" : ""}`}
                      onClick={() => setNewGoal({ ...newGoal, color: color.value })}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGoal} className="bg-[#00CC66] hover:bg-[#00BB55]">
                Add Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className={`${goal.color} text-white`}>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{goal.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => {
                        setSelectedGoal(goal)
                        setIsUpdatingGoal(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Current</span>
                    </div>
                    <span className="font-semibold">${goal.currentAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Target</span>
                    </div>
                    <span className="font-semibold">${goal.targetAmount.toLocaleString()}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-medium">
                        {calculateProgress(goal.currentAmount, goal.targetAmount)}%
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(goal.currentAmount, goal.targetAmount)}
                      className="h-2"
                      indicatorClassName={goal.color}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-[#00CC66] mr-2" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Target Date</span>
                    </div>
                    <span className="text-sm">{new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Update Goal Dialog */}
      <Dialog open={isUpdatingGoal} onOpenChange={setIsUpdatingGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Goal</DialogTitle>
            <DialogDescription>Make changes to your savings goal.</DialogDescription>
          </DialogHeader>
          {selectedGoal && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="update-name">Goal Name</Label>
                <Input
                  id="update-name"
                  value={selectedGoal.name}
                  onChange={(e) => setSelectedGoal({ ...selectedGoal, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="update-target">Target Amount ($)</Label>
                  <Input
                    id="update-target"
                    type="number"
                    value={selectedGoal.targetAmount}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, targetAmount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-current">Current Amount ($)</Label>
                  <Input
                    id="update-current"
                    type="number"
                    value={selectedGoal.currentAmount}
                    onChange={(e) => setSelectedGoal({ ...selectedGoal, currentAmount: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-deadline">Target Date</Label>
                <Input
                  id="update-deadline"
                  type="date"
                  value={selectedGoal.deadline}
                  onChange={(e) => setSelectedGoal({ ...selectedGoal, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full ${color.value} ${selectedGoal.color === color.value ? "ring-2 ring-offset-2 ring-[#003366]" : ""}`}
                      onClick={() => setSelectedGoal({ ...selectedGoal, color: color.value })}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdatingGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGoal} className="bg-[#00CC66] hover:bg-[#00BB55]">
              Update Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

