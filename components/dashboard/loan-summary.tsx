"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ChevronRight, Clock, CreditCard, PiggyBank } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"

interface LoanSummaryProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoanSummary({ className, ...props }: LoanSummaryProps) {
  const [loans, setLoans] = useState([
    {
      id: 1,
      name: "Personal Loan",
      icon: CreditCard,
      amount: 10000,
      remaining: 5000,
      nextPayment: 1200,
      nextPaymentDate: "15 Aug",
      interestRate: "12%",
      progress: 50,
      status: "active",
    },
    {
      id: 2,
      name: "Village Banking",
      icon: PiggyBank,
      amount: 5000,
      remaining: 2500,
      nextPayment: 600,
      nextPaymentDate: "22 Aug",
      interestRate: "8%",
      progress: 50,
      status: "active",
    },
  ])

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Loan Summary</CardTitle>
          <Badge variant="outline" className="bg-primary/10">
            2 Active Loans
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loans.map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border border-border/50 p-3 bg-background/50"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "p-2 rounded-full",
                  loan.name === "Personal Loan" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500",
                )}
              >
                <loan.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{loan.name}</div>
                <div className="text-xs text-muted-foreground">Interest Rate: {loan.interestRate}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Loan Amount</span>
                <span className="text-sm font-medium">K {loan.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Remaining</span>
                <span className="text-sm font-medium">K {loan.remaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3 text-amber-500" />
                  <span>
                    Next: K {loan.nextPayment} on {loan.nextPaymentDate}
                  </span>
                </div>
                <span className="text-sm font-medium">{loan.progress}% Repaid</span>
              </div>

              <Progress value={loan.progress} className="h-2" />
            </div>

            <div className="mt-3 flex justify-end">
              <Button variant="outline" size="sm" className="text-xs">
                Make Payment
              </Button>
            </div>
          </motion.div>
        ))}

        <div className="rounded-md bg-amber-500/10 p-3 flex items-start gap-2 border border-amber-500/20">
          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
          <div className="text-xs">
            <p className="font-medium">Payment reminder</p>
            <p className="text-muted-foreground">Your next loan payment of K 1,200 is due in 5 days.</p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full gap-1">
          View All Loans
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

