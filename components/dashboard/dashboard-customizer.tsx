"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Grip, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion } from "framer-motion"

interface DashboardCustomizerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardCustomizer({ className, ...props }: DashboardCustomizerProps) {
  const [activeWidgets, setActiveWidgets] = useState([
    { id: "welcome", name: "Welcome Section", active: true },
    { id: "quick-actions", name: "Quick Actions", active: true },
    { id: "wallet", name: "Wallet Overview", active: true },
    { id: "loans", name: "Loan Summary", active: true },
    { id: "credit", name: "Credit Score", active: true },
    { id: "transactions", name: "Transaction Chart", active: true },
    { id: "market", name: "Market Trends", active: true },
    { id: "predictive", name: "Predictive Analytics", active: true },
    { id: "services", name: "Service Overview", active: true },
    { id: "activity", name: "Activity Feed", active: true },
    { id: "notifications", name: "Notifications", active: true },
    { id: "community", name: "Community Feed", active: true },
  ])

  const availableWidgets = [
    { id: "nft", name: "NFT Gallery", active: false },
    { id: "goals", name: "Financial Goals", active: false },
    { id: "budget", name: "Budget Tracker", active: false },
    { id: "news", name: "Crypto News", active: false },
  ]

  const toggleWidget = (id: string) => {
    setActiveWidgets(activeWidgets.map((widget) => (widget.id === id ? { ...widget, active: !widget.active } : widget)))
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Card className="border border-border/50 bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Customize Your Dashboard</CardTitle>
          <CardDescription>Drag and drop widgets to rearrange them, or toggle visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Active Widgets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {activeWidgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border border-border/50",
                      widget.active ? "bg-primary/10" : "bg-background/50 opacity-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Grip className="h-4 w-4 text-muted-foreground cursor-move" />
                      <span className="text-sm">{widget.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("h-7 w-7 p-0", widget.active ? "text-primary" : "text-muted-foreground")}
                      onClick={() => toggleWidget(widget.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Available Widgets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {availableWidgets.map((widget) => (
                  <motion.div
                    key={widget.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{widget.name}</span>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      Add
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Layout</Button>
      </div>
    </div>
  )
}

