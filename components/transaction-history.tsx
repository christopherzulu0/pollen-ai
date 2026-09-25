"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Filter,
  Search,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  Smartphone,
  Utensils,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Transaction {
  id: number
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  icon: React.ReactNode
}

const categoryIcons = {
  Shopping: <ShoppingBag className="h-4 w-4" />,
  Food: <Utensils className="h-4 w-4" />,
  Coffee: <Coffee className="h-4 w-4" />,
  Housing: <Home className="h-4 w-4" />,
  Transportation: <Car className="h-4 w-4" />,
  Utilities: <Smartphone className="h-4 w-4" />,
  Salary: <Briefcase className="h-4 w-4" />,
  Transfer: <CreditCard className="h-4 w-4" />,
  Other: <DollarSign className="h-4 w-4" />,
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "expense",
      category: "Shopping",
      description: "Grocery Store",
      amount: 85.42,
      date: "2024-03-12",
      status: "completed",
      icon: categoryIcons["Shopping"],
    },
    {
      id: 2,
      type: "income",
      category: "Salary",
      description: "Monthly Salary",
      amount: 3200.0,
      date: "2024-03-10",
      status: "completed",
      icon: categoryIcons["Salary"],
    },
    {
      id: 3,
      type: "expense",
      category: "Housing",
      description: "Rent Payment",
      amount: 1200.0,
      date: "2024-03-05",
      status: "completed",
      icon: categoryIcons["Housing"],
    },
    {
      id: 4,
      type: "expense",
      category: "Food",
      description: "Restaurant",
      amount: 42.75,
      date: "2024-03-08",
      status: "completed",
      icon: categoryIcons["Food"],
    },
    {
      id: 5,
      type: "expense",
      category: "Transportation",
      description: "Uber Ride",
      amount: 18.5,
      date: "2024-03-11",
      status: "completed",
      icon: categoryIcons["Transportation"],
    },
    {
      id: 6,
      type: "expense",
      category: "Coffee",
      description: "Starbucks",
      amount: 5.25,
      date: "2024-03-12",
      status: "pending",
      icon: categoryIcons["Coffee"],
    },
    {
      id: 7,
      type: "income",
      category: "Transfer",
      description: "From Savings",
      amount: 500.0,
      date: "2024-03-09",
      status: "completed",
      icon: categoryIcons["Transfer"],
    },
    {
      id: 8,
      type: "expense",
      category: "Utilities",
      description: "Electricity Bill",
      amount: 95.2,
      date: "2024-03-07",
      status: "completed",
      icon: categoryIcons["Utilities"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedTransaction(expandedTransaction === id ? null : id)
  }

  const filteredTransactions = transactions
    .filter((transaction) => {
      // Search filter
      const matchesSearch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())

      // Category filter
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter

      // Type filter
      const matchesType = typeFilter === "all" || transaction.type === typeFilter

      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const categories = [...new Set(transactions.map((t) => t.category))]

  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="text-xl">Transaction History</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1">
              Balance: ${balance.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
              Income: ${totalIncome.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30 px-3 py-1">
              Expenses: ${totalExpenses.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>

          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="h-10 w-10"
                >
                  {sortOrder === "desc" ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="truncate">Category</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center">
                          <span className="mr-2">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <span className="truncate">Type</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsContent value="list" className="mt-0 space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => toggleExpand(transaction.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "income"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowDownRight className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center mr-3">
                              {transaction.icon}
                              <span className="ml-1">{transaction.category}</span>
                            </span>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </p>
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/30"
                                : transaction.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/30"
                            }
                          `}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform ${
                            expandedTransaction === transaction.id ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedTransaction === transaction.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Transaction ID</p>
                                <p className="font-medium">#{transaction.id.toString().padStart(8, "0")}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Date & Time</p>
                                <p className="font-medium">{new Date(transaction.date).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
                                <p className="font-medium">Virtual Card</p>
                              </div>
                            </div>

                            <div className="mt-4 flex justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                Download Receipt
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-red-200 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700/50"
                              >
                                Report Issue
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 pl-12">
                  <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-6 pl-12 relative">
                  {/* Group transactions by date */}
                  {Object.entries(
                    filteredTransactions.reduce(
                      (groups, transaction) => {
                        const date = transaction.date
                        if (!groups[date]) {
                          groups[date] = []
                        }
                        groups[date].push(transaction)
                        return groups
                      },
                      {} as Record<string, Transaction[]>,
                    ),
                  ).map(([date, dateTransactions]) => (
                    <div key={date} className="mb-8">
                      <div className="absolute left-4 transform -translate-x-1/2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-[#003366] dark:bg-[#004488] border-4 border-white dark:border-gray-900"></div>
                      </div>

                      <h3 className="text-lg font-semibold mb-4">
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>

                      <div className="space-y-3">
                        {dateTransactions.map((transaction) => (
                          <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    transaction.type === "income"
                                      ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                      : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                                </div>
                              </div>
                              <p
                                className={`font-semibold ${
                                  transaction.type === "income"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

