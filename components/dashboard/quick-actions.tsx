"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  Send,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  PiggyBank,
  Calculator,
  BarChart4,
  Repeat,
  Landmark,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QuickActions({ className, ...props }: QuickActionsProps) {
  const actions = [
    { icon: ArrowDownToLine, label: "Deposit", color: "bg-green-500/10 text-green-500" },
    { icon: ArrowUpFromLine, label: "Withdraw", color: "bg-amber-500/10 text-amber-500" },
    { icon: Send, label: "Send", color: "bg-blue-500/10 text-blue-500" },
    { icon: Wallet, label: "Wallet", color: "bg-purple-500/10 text-purple-500" },
    { icon: CreditCard, label: "Apply Loan", color: "bg-pink-500/10 text-pink-500" },
    { icon: PiggyBank, label: "Village Banking", color: "bg-indigo-500/10 text-indigo-500" },
    { icon: Calculator, label: "Loan Calculator", color: "bg-cyan-500/10 text-cyan-500" },
    { icon: Repeat, label: "Swap Crypto", color: "bg-orange-500/10 text-orange-500" },
    { icon: BarChart4, label: "Analytics", color: "bg-emerald-500/10 text-emerald-500" },
    { icon: Landmark, label: "Investments", color: "bg-violet-500/10 text-violet-500" },
    { icon: Users, label: "Referrals", color: "bg-rose-500/10 text-rose-500" },
    { icon: CreditCard, label: "Repay Loan", color: "bg-teal-500/10 text-teal-500" },
  ]

  return (
    <Card className={cn("border-none bg-background/60 backdrop-blur-md", className)} {...props}>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className="h-24 w-full flex flex-col gap-2 justify-center items-center rounded-xl border border-border/50 hover:border-primary/50 transition-all"
              >
                <div className={cn("p-2 rounded-lg", action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

