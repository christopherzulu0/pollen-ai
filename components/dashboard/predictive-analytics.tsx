"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts"
import { useTheme } from "next-themes"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PredictiveAnalyticsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PredictiveAnalytics({ className, ...props }: PredictiveAnalyticsProps) {
  const { theme } = useTheme()

  const savingsData = [
    { month: "Jan", actual: 1000, predicted: 1000 },
    { month: "Feb", actual: 1200, predicted: 1150 },
    { month: "Mar", actual: 1500, predicted: 1300 },
    { month: "Apr", actual: 1300, predicted: 1450 },
    { month: "May", actual: 1700, predicted: 1600 },
    { month: "Jun", actual: 1900, predicted: 1750 },
    { month: "Jul", actual: null, predicted: 2000 },
    { month: "Aug", actual: null, predicted: 2250 },
    { month: "Sep", actual: null, predicted: 2500 },
    { month: "Oct", actual: null, predicted: 2750 },
    { month: "Nov", actual: null, predicted: 3000 },
    { month: "Dec", actual: null, predicted: 3250 },
  ]

  const creditScoreData = [
    { month: "Jan", actual: 650, predicted: 650 },
    { month: "Feb", actual: 660, predicted: 655 },
    { month: "Mar", actual: 675, predicted: 670 },
    { month: "Apr", actual: 690, predicted: 685 },
    { month: "May", actual: 705, predicted: 700 },
    { month: "Jun", actual: 720, predicted: 715 },
    { month: "Jul", actual: null, predicted: 730 },
    { month: "Aug", actual: null, predicted: 745 },
    { month: "Sep", actual: null, predicted: 760 },
    { month: "Oct", actual: null, predicted: 775 },
    { month: "Nov", actual: null, predicted: 790 },
    { month: "Dec", actual: null, predicted: 800 },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-2 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold">Predictive Analytics</CardTitle>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  AI-powered predictions based on your financial behavior. Past performance is not indicative of future
                  results.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <Button variant="outline" size="sm" className="text-xs">
          Customize Predictions
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="savings">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="savings">Savings Forecast</TabsTrigger>
            <TabsTrigger value="credit">Credit Score Projection</TabsTrigger>
          </TabsList>

          <TabsContent value="savings" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke={theme === "dark" ? "#888888" : "#333333"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={theme === "dark" ? "#888888" : "#333333"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `K${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#actualGradient)"
                    strokeWidth={2}
                    name="Actual"
                  />
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#predictedGradient)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-2 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></div>
                <span className="text-xs">Actual</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
                <span className="text-xs">Predicted</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border/50 p-3 bg-background/50">
              <div className="text-sm">
                <div className="font-medium">Savings Insights</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your current saving patterns, you're projected to save K 3,250 by the end of the year. This
                  is a 71% increase from your current savings.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credit" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={creditScoreData}>
                  <XAxis
                    dataKey="month"
                    stroke={theme === "dark" ? "#888888" : "#333333"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={theme === "dark" ? "#888888" : "#333333"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[600, 850]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Actual"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center mt-2 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></div>
                <span className="text-xs">Actual</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
                <span className="text-xs">Predicted</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border/50 p-3 bg-background/50">
              <div className="text-sm">
                <div className="font-medium">Credit Score Insights</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your credit score is projected to reach 800 (Excellent) by December if you maintain your current
                  payment patterns. This could qualify you for better loan rates and higher credit limits.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

