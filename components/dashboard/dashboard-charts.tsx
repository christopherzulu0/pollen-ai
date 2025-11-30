"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { useChartDataSuspense } from "@/hooks/use-dashboard-data"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function SavingsOverviewChart() {
  const { data: chartData } = useChartDataSuspense()

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Savings Overview</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Your deposit history over the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.depositData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value: number) => [`K${value.toLocaleString()}`, 'Amount']}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function GroupDistributionChart() {
  const { data: chartData } = useChartDataSuspense()

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Group Distribution</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Members across groups</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.membershipData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={55}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivityChart() {
  const { data: chartData } = useChartDataSuspense()

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Deposits and withdrawals over the past weeks
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.activityData} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="deposits" 
                stroke="#10b981" 
                activeDot={{ r: 6 }} 
                strokeWidth={2}
                name="Deposits"
              />
              <Line 
                type="monotone" 
                dataKey="withdrawals" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Withdrawals"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

