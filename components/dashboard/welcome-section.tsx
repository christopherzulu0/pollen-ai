"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface WelcomeSectionProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WelcomeSection({ className, ...props }: WelcomeSectionProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Card className={cn("overflow-hidden border-none", className)} {...props}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <CardContent className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User avatar" />
                <AvatarFallback className="text-xl">JD</AvatarFallback>
              </Avatar>
            </motion.div>

            <div>
              <motion.h2
                className="text-2xl font-bold"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Welcome back, John!
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Here's what's happening with your account today.
              </motion.p>

              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Profile completion: 85%</p>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="mt-1 h-2 w-48 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <Bell className="h-4 w-4" />
              <span className="relative">
                3 Alerts
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </span>
            </Button>
            <Button variant="default" size="sm" className="gap-1 bg-primary/90 backdrop-blur-sm hover:bg-primary">
              Complete Profile
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            className="rounded-lg bg-background/80 backdrop-blur-sm p-3 border border-border/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-sm font-medium text-muted-foreground">Total Balance</div>
            <div className="text-2xl font-bold mt-1">K 12,345.67</div>
            <div className="text-xs text-green-500 mt-1">+5.2% from last week</div>
          </motion.div>

          <motion.div
            className="rounded-lg bg-background/80 backdrop-blur-sm p-3 border border-border/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-sm font-medium text-muted-foreground">Active Loans</div>
            <div className="text-2xl font-bold mt-1">2</div>
            <div className="text-xs text-amber-500 mt-1">Next payment in 5 days</div>
          </motion.div>

          <motion.div
            className="rounded-lg bg-background/80 backdrop-blur-sm p-3 border border-border/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="text-sm font-medium text-muted-foreground">Credit Score</div>
            <div className="text-2xl font-bold mt-1">720</div>
            <div className="text-xs text-green-500 mt-1">Very Good</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

