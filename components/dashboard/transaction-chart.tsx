"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart, Legend } from "recharts"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"

interface TransactionChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TransactionChart({ className, ...props }: TransactionChartProps) {
  const { theme } = useTheme()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [chartType, setChartType] = useState<"line" | "bar">("line")

  const monthlyData = [
    { name: "Jan", deposits: 4000, withdrawals: 2400, loans: 2400 },
    { name: "Feb", deposits: 3000, withdrawals: 1398, loans: 2210 },
    { name: "Mar", deposits: 2000, withdrawals: 9800, loans: 2290 },
    { name: "Apr", deposits: 2780, withdrawals: 3908, loans: 2000 },
    { name: "May", deposits: 1890, withdrawals: 4800, loans: 2181 },
    { name: "Jun", deposits: 2390, withdrawals: 3800, loans: 2500 },
    { name: "Jul", deposits: 3490, withdrawals: 4300, loans: 2100 },
  ]

  const weeklyData = [
    { name: "Mon", deposits: 500, withdrawals: 400, loans: 200 },
    { name: "Tue", deposits: 300, withdrawals: 200, loans: 0 },
    { name: "Wed", deposits: 700, withdrawals: 400, loans: 0 },
    { name: "Thu", deposits: 200, withdrawals: 300, loans: 1000 },
    { name: "Fri", deposits: 400, withdrawals: 200, loans: 0 },
    { name: "Sat", deposits: 600, withdrawals: 300, loans: 0 },
    { name: "Sun", deposits: 200, withdrawals: 100, loans: 0 },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-background p-2 shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: K{entry.value}
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
        <CardTitle className="text-xl font-semibold">Transaction History</CardTitle>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <CalendarIcon className="h-3 w-3" />
                {date ? format(date, "MMM yyyy") : "Select date"}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <div className="flex items-center rounded-md border border-border/50 p-0.5">
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setChartType("line")}
            >
              Line
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setChartType("bar")}
            >
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={monthlyData}>
                    <XAxis
                      dataKey="name"
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
                    <Line
                      type="monotone"
                      dataKey="deposits"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Deposits"
                    />
                    <Line
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Withdrawals"
                    />
                    <Line
                      type="monotone"
                      dataKey="loans"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Loans"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={monthlyData}>
                    <XAxis
                      dataKey="name"
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
                    <Legend />
                    <Bar dataKey="deposits" fill="#10b981" name="Deposits" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="withdrawals" fill="#f59e0b" name="Withdrawals" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="loans" fill="#6366f1" name="Loans" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="weekly">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={weeklyData}>
                    <XAxis
                      dataKey="name"
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
                    <Line
                      type="monotone"
                      dataKey="deposits"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Deposits"
                    />
                    <Line
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Withdrawals"
                    />
                    <Line
                      type="monotone"
                      dataKey="loans"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Loans"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={weeklyData}>
                    <XAxis
                      dataKey="name"
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
                    <Legend />
                    <Bar dataKey="deposits" fill="#10b981" name="Deposits" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="withdrawals" fill="#f59e0b" name="Withdrawals" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="loans" fill="#6366f1" name="Loans" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

