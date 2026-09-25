"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FinancialMetric {
  name: string
  score: number
  status: "excellent" | "good" | "fair" | "poor"
  description: string
  tips: string[]
}

export default function FinancialHealthScore() {
  const [overallScore, setOverallScore] = useState(0)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [metrics, setMetrics] = useState<FinancialMetric[]>([
    {
      name: "Debt-to-Income Ratio",
      score: 75,
      status: "good",
      description: "Your debt payments are 28% of your income, which is within the recommended range.",
      tips: [
        "Aim to keep your debt-to-income ratio below 36%",
        "Consider paying off high-interest debt first",
        "Avoid taking on new debt while paying down existing obligations",
      ],
    },
    {
      name: "Emergency Fund",
      score: 60,
      status: "fair",
      description: "You have about 3 months of expenses saved, which is a good start but could be improved.",
      tips: [
        "Work toward saving 6 months of essential expenses",
        "Set up automatic transfers to your emergency fund",
        "Keep emergency funds in a high-yield savings account",
      ],
    },
    {
      name: "Credit Utilization",
      score: 90,
      status: "excellent",
      description: "You're using only 10% of your available credit, which is excellent for your credit score.",
      tips: [
        "Continue keeping your credit utilization below 30%",
        "Consider requesting credit limit increases",
        "Pay credit card balances in full each month",
      ],
    },
    {
      name: "Savings Rate",
      score: 65,
      status: "fair",
      description: "You're saving about 12% of your income, which is good but below the recommended 20%.",
      tips: [
        "Try to increase your savings rate to 15-20% of income",
        "Look for areas to reduce expenses",
        "Consider increasing retirement contributions",
      ],
    },
    {
      name: "Investment Diversification",
      score: 80,
      status: "good",
      description: "Your investments are well diversified across different asset classes.",
      tips: [
        "Review your asset allocation annually",
        "Consider rebalancing your portfolio periodically",
        "Ensure your investments align with your risk tolerance and time horizon",
      ],
    },
  ])

  useEffect(() => {
    // Calculate overall score as average of all metrics
    const calculatedScore = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length)
    setOverallScore(calculatedScore)

    // Animate the score
    const duration = 2000 // 2 seconds
    const interval = 20 // Update every 20ms
    const steps = duration / interval
    const increment = calculatedScore / steps

    let currentScore = 0
    const timer = setInterval(() => {
      currentScore += increment
      if (currentScore >= calculatedScore) {
        setAnimatedScore(calculatedScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(currentScore))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [metrics])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500 dark:text-green-400"
    if (score >= 70) return "text-blue-500 dark:text-blue-400"
    if (score >= 60) return "text-yellow-500 dark:text-yellow-400"
    return "text-red-500 dark:text-red-400"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-blue-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
      case "good":
        return <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case "fair":
        return <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      case "poor":
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    }
  }

  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Financial Health Score</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Your Financial Health Score is calculated based on key financial metrics and provides an overview of
                  your financial wellbeing.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-48 h-48 mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    className="dark:stroke-gray-700"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={getScoreBackground(overallScore)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{
                      strokeDashoffset: 283 - (283 * animatedScore) / 100,
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="transform -rotate-90 origin-center"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className={`text-4xl font-bold ${getScoreColor(overallScore)}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    {animatedScore}
                  </motion.span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">out of 100</span>
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-2 ${getScoreColor(overallScore)}`}>{getScoreLabel(overallScore)}</h3>

              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                Your financial health is {getScoreLabel(overallScore).toLowerCase()}. Review the detailed metrics to see
                where you can improve.
              </p>

              <Button className="bg-[#003366] hover:bg-[#002244]">Get Personalized Advice</Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Financial Metrics</h3>

            <Accordion type="single" collapsible className="w-full">
              {metrics.map((metric, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center">
                        {getStatusIcon(metric.status)}
                        <span className="ml-2">{metric.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-semibold mr-4 ${getScoreColor(metric.score)}`}>{metric.score}</span>
                        <Progress
                          value={metric.score}
                          className="w-24 h-2"
                          indicatorClassName={getScoreBackground(metric.score)}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">{metric.description}</p>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Improvement Tips:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {metric.tips.map((tip, tipIndex) => (
                            <li key={tipIndex}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center text-sm">
                        {metric.status === "excellent" || metric.status === "good" ? (
                          <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-2" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                        )}
                        <span
                          className={
                            metric.status === "excellent" || metric.status === "good"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {metric.status === "excellent" || metric.status === "good"
                            ? "You're doing well in this area"
                            : "This area needs your attention"}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" className="w-full">
                Download Full Financial Health Report
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

