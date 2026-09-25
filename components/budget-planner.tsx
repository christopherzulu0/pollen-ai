"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit2, Trash2, DollarSign, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts"

interface BudgetCategory {
  id: number
  name: string
  budgeted: number
  spent: number
  color: string
}

const COLORS = [
  "#003366",
  "#00CC66",
  "#FF6B6B",
  "#4ECDC4",
  "#FFD166",
  "#6A0572",
  "#AB83A1",
  "#F15BB5",
  "#9B5DE5",
  "#00BBF9",
]

export default function BudgetPlanner() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 1, name: "Housing", budgeted: 1500, spent: 1450, color: COLORS[0] },
    { id: 2, name: "Food", budgeted: 600, spent: 580, color: COLORS[1] },
    { id: 3, name: "Transportation", budgeted: 400, spent: 385, color: COLORS[2] },
    { id: 4, name: "Utilities", budgeted: 300, spent: 310, color: COLORS[3] },
    { id: 5, name: "Entertainment", budgeted: 200, spent: 250, color: COLORS[4] },
    { id: 6, name: "Savings", budgeted: 1000, spent: 1000, color: COLORS[5] },
    { id: 7, name: "Healthcare", budgeted: 300, spent: 200, color: COLORS[6] },
    { id: 8, name: "Shopping", budgeted: 400, spent: 450, color: COLORS[7] },
  ])

  const [newCategory, setNewCategory] = useState<Omit<BudgetCategory, "id">>({
    name: "",
    budgeted: 0,
    spent: 0,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  })

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null)
  const [isEditingIncome, setIsEditingIncome] = useState(false)
  const [tempIncome, setTempIncome] = useState(monthlyIncome)

  const totalBudgeted = categories.reduce((sum, category) => sum + category.budgeted, 0)
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0)
  const remaining = monthlyIncome - totalBudgeted
  const spentPercentage = Math.round((totalSpent / totalBudgeted) * 100)

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budgeted > 0) {
      setCategories([...categories, { ...newCategory, id: Date.now() }])
      setNewCategory({
        name: "",
        budgeted: 0,
        spent: 0,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
      setIsAddingCategory(false)
    }
  }

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const handleSaveIncome = () => {
    setMonthlyIncome(tempIncome)
    setIsEditingIncome(false)
  }

  const pieChartData = categories.map((category) => ({
    name: category.name,
    value: category.budgeted,
    color: category.color,
  }))

  const spendingData = categories.map((category) => ({
    name: category.name,
    value: category.spent,
    color: category.color,
  }))

  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Budget Planner</span>
          <span className="text-sm font-normal">Monthly Budget</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Monthly Income</h3>
                    {isEditingIncome ? (
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSaveIncome}
                          className="h-8 w-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setIsEditingIncome(false)
                            setTempIncome(monthlyIncome)
                          }}
                          className="h-8 w-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => setIsEditingIncome(true)} className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isEditingIncome ? (
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                      <Input
                        type="number"
                        value={tempIncome}
                        onChange={(e) => setTempIncome(Number(e.target.value))}
                        className="text-2xl font-bold"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-1" />
                      <span className="text-2xl font-bold">{monthlyIncome.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Budgeted</span>
                        <span className="font-medium">${totalBudgeted.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(totalBudgeted / monthlyIncome) * 100}
                        className="h-2"
                        indicatorClassName="bg-[#003366]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                        <span className="font-medium">${totalSpent.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(totalSpent / monthlyIncome) * 100}
                        className="h-2"
                        indicatorClassName="bg-[#00CC66]"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Remaining to Budget</span>
                        <span
                          className={`font-semibold ${
                            remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          ${remaining.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Budget Used</span>
                        <span
                          className={`font-semibold ${
                            spentPercentage <= 100
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {spentPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
                  <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip formatter={(value: number) => [`$${value}`, "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-[#003366] hover:bg-[#002244]">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Budget Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Budget Category</DialogTitle>
                          <DialogDescription>Create a new budget category to track your spending.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                              id="name"
                              value={newCategory.name}
                              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                              placeholder="e.g., Groceries"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="budgeted">Budgeted Amount ($)</Label>
                            <Input
                              id="budgeted"
                              type="number"
                              value={newCategory.budgeted || ""}
                              onChange={(e) => setNewCategory({ ...newCategory, budgeted: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="spent">Spent Amount ($)</Label>
                            <Input
                              id="spent"
                              type="number"
                              value={newCategory.spent || ""}
                              onChange={(e) => setNewCategory({ ...newCategory, spent: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex flex-wrap gap-2">
                              {COLORS.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className={`w-8 h-8 rounded-full ${newCategory.color === color ? "ring-2 ring-offset-2 ring-[#003366]" : ""}`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setNewCategory({ ...newCategory, color })}
                                  aria-label={`Select color ${color}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCategory} className="bg-[#00CC66] hover:bg-[#00BB55]">
                            Add Category
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="space-y-6">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Budgeted</span>
                        <span className="font-medium">${category.budgeted.toLocaleString()}</span>
                      </div>
                      <Progress value={100} className="h-2" indicatorClassName="bg-gray-300 dark:bg-gray-600" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Spent</span>
                        <span className="font-medium">${category.spent.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={(category.spent / category.budgeted) * 100}
                        className="h-2"
                        indicatorClassName={category.spent <= category.budgeted ? "bg-[#00CC66]" : "bg-red-500"}
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-sm">Remaining</span>
                      <span
                        className={`font-medium ${
                          category.budgeted - category.spent >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        ${(category.budgeted - category.spent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button className="w-full bg-[#003366] hover:bg-[#002244]" onClick={() => setIsAddingCategory(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget Category
              </Button>
            </div>

            {/* Edit Category Dialog */}
            <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Budget Category</DialogTitle>
                  <DialogDescription>Make changes to your budget category.</DialogDescription>
                </DialogHeader>
                {editingCategory && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Category Name</Label>
                      <Input
                        id="edit-name"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-budgeted">Budgeted Amount ($)</Label>
                      <Input
                        id="edit-budgeted"
                        type="number"
                        value={editingCategory.budgeted}
                        onChange={(e) => setEditingCategory({ ...editingCategory, budgeted: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-spent">Spent Amount ($)</Label>
                      <Input
                        id="edit-spent"
                        type="number"
                        value={editingCategory.spent}
                        onChange={(e) => setEditingCategory({ ...editingCategory, spent: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full ${editingCategory.color === color ? "ring-2 ring-offset-2 ring-[#003366]" : ""}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setEditingCategory({ ...editingCategory, color })}
                            aria-label={`Select color ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCategory} className="bg-[#00CC66] hover:bg-[#00BB55]">
                    Update Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Spending Analysis</h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {spendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip formatter={(value: number) => [`$${value}`, "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4">Budget vs. Actual</h3>

                <div className="space-y-6">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">${category.spent.toLocaleString()}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {" "}
                            / ${category.budgeted.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                          <div
                            style={{ width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              category.spent <= category.budgeted ? "bg-[#00CC66]" : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Budget Insights</h4>
                  <ul className="space-y-2 text-sm">
                    {categories.some((cat) => cat.spent > cat.budgeted) && (
                      <li className="flex items-start">
                        <span className="text-red-500 dark:text-red-400 mr-2">•</span>
                        <span>
                          {categories.filter((cat) => cat.spent > cat.budgeted).length} categories are over budget.
                        </span>
                      </li>
                    )}
                    {categories.some((cat) => cat.spent < cat.budgeted * 0.5) && (
                      <li className="flex items-start">
                        <span className="text-yellow-500 dark:text-yellow-400 mr-2">•</span>
                        <span>
                          {categories.filter((cat) => cat.spent < cat.budgeted * 0.5).length} categories are
                          significantly under budget.
                        </span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <span className="text-blue-500 dark:text-blue-400 mr-2">•</span>
                      <span>
                        Your largest spending category is {categories.sort((a, b) => b.spent - a.spent)[0].name} at $
                        {categories.sort((a, b) => b.spent - a.spent)[0].spent.toLocaleString()}.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

