"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpFromLine, CreditCard, LogIn, Wallet, Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ActivityFeed({ className, ...props }: ActivityFeedProps) {
  const [filter, setFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const activities = [
    {
      id: 1,
      type: "login",
      description: "Logged in from Chrome on Windows",
      time: "2 hours ago",
      icon: LogIn,
    },
    {
      id: 2,
      type: "deposit",
      description: "Deposited K 2,500 via Mobile Money",
      time: "Yesterday at 3:45 PM",
      icon: ArrowDownToLine,
    },
    {
      id: 3,
      type: "loan",
      description: "Applied for a personal loan of K 10,000",
      time: "Yesterday at 1:30 PM",
      icon: CreditCard,
    },
    {
      id: 4,
      type: "withdrawal",
      description: "Withdrew K 1,000 to Bank Account",
      time: "Aug 10, 2023 at 10:15 AM",
      icon: ArrowUpFromLine,
    },
    {
      id: 5,
      type: "wallet",
      description: "Added new wallet address",
      time: "Aug 9, 2023 at 2:30 PM",
      icon: Wallet,
    },
  ]

  const getIconColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
      case "deposit":
        return "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300"
      case "withdrawal":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
      case "loan":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const filteredActivities = activities.filter((activity) => {
    // Apply type filter
    if (filter && activity.type !== filter) return false

    // Apply search query
    if (searchQuery && !activity.description.toLowerCase().includes(searchQuery.toLowerCase())) return false

    return true
  })

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Activity Log</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-4 space-y-3">
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={filter === null ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilter(null)}
                  >
                    All
                  </Badge>
                  <Badge
                    variant={filter === "login" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilter("login")}
                  >
                    Logins
                  </Badge>
                  <Badge
                    variant={filter === "deposit" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilter("deposit")}
                  >
                    Deposits
                  </Badge>
                  <Badge
                    variant={filter === "withdrawal" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilter("withdrawal")}
                  >
                    Withdrawals
                  </Badge>
                  <Badge
                    variant={filter === "loan" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilter("loan")}
                  >
                    Loans
                  </Badge>
                  <Badge
                    variant={filter === "wallet" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilter("wallet")}
                  >
                    Wallet
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={cn("p-2 rounded-full", getIconColor(activity.type))}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No activities match your filters</div>
          )}

          <Button variant="outline" size="sm" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

