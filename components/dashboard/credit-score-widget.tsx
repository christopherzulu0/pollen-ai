"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CreditScoreWidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CreditScoreWidget({ className, ...props }: CreditScoreWidgetProps) {
  // Credit score value between 0 and 850
  const creditScore = 720
  const maxScore = 850
  const percentage = (creditScore / maxScore) * 100

  // Determine color based on score
  const getScoreColor = () => {
    if (creditScore >= 700) return "text-green-500"
    if (creditScore >= 600) return "text-amber-500"
    return "text-red-500"
  }

  // Determine score label
  const getScoreLabel = () => {
    if (creditScore >= 750) return "Excellent"
    if (creditScore >= 700) return "Very Good"
    if (creditScore >= 650) return "Good"
    if (creditScore >= 600) return "Fair"
    return "Poor"
  }

  const scoreFactors = [
    { name: "On-time Payments", value: "98%", tooltip: "Percentage of payments made on time" },
    { name: "Loan Utilization", value: "25%", tooltip: "Percentage of available credit being used" },
    { name: "Credit History", value: "2 years", tooltip: "Length of your credit history" },
  ]

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Credit Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <motion.div
            className="relative w-36 h-36"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              {/* Progress circle with stroke-dasharray and stroke-dashoffset */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * percentage) / 100}
                strokeLinecap="round"
                className={getScoreColor()}
                transform="rotate(-90 50 50)"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.text
                x="50"
                y="45"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {creditScore}
              </motion.text>
              <motion.text
                x="50"
                y="60"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {getScoreLabel()}
              </motion.text>
            </svg>
          </motion.div>
        </div>

        <TooltipProvider>
          <div className="space-y-2">
            {scoreFactors.map((factor, index) => (
              <motion.div
                key={factor.name}
                className="flex justify-between text-sm items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex items-center gap-1">
                  <span>{factor.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{factor.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-medium">{factor.value}</span>
              </motion.div>
            ))}
          </div>
        </TooltipProvider>

        <div className="rounded-lg border border-border/50 p-3 bg-background/50">
          <div className="text-sm">
            <div className="font-medium">Credit Score Insights</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your score has improved by 15 points in the last 3 months. Continue making on-time payments to further
              improve your score.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full gap-1">
          View Credit Details
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

