"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { Info, TrendingUp, TrendingDown, AlertTriangle, Globe, Users, Building, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StatisticProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  color: string
}

const Statistic = ({ title, value, description, icon, color }: StatisticProps) => (
  <Card className="border-none shadow-lg overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4 flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-[#003366] dark:text-white">{title}</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function StatisticsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedData, setAnimatedData] = useState<any[]>([])

  const globalData = [
    { name: "Sub-Saharan Africa", value: 57, color: "#003366" },
    { name: "South Asia", value: 30, color: "#00CC66" },
    { name: "Latin America", value: 26, color: "#4ECDC4" },
    { name: "East Asia", value: 24, color: "#FFD166" },
    { name: "Middle East", value: 37, color: "#FF6B6B" },
    { name: "Global Average", value: 31, color: "#6A0572" },
  ]

  const zambiaData = [
    { name: "Rural Areas", value: 85, color: "#003366" },
    { name: "Urban Poor", value: 65, color: "#00CC66" },
    { name: "Women", value: 78, color: "#4ECDC4" },
    { name: "Youth (18-25)", value: 72, color: "#FFD166" },
    { name: "Small Businesses", value: 80, color: "#FF6B6B" },
    { name: "Overall", value: 70, color: "#6A0572" },
  ]

  const costData = [
    { name: "Account Fees", value: 250, color: "#003366" },
    { name: "Transfer Costs", value: 180, color: "#00CC66" },
    { name: "Loan Interest", value: 320, color: "#4ECDC4" },
    { name: "Travel Costs", value: 150, color: "#FFD166" },
    { name: "Documentation", value: 90, color: "#FF6B6B" },
  ]

  const allDataSets = [globalData, zambiaData, costData]

  useEffect(() => {
    // Animate the data when tab changes
    setAnimatedData([])
    const timer = setTimeout(() => {
      setAnimatedData(allDataSets[activeIndex])
    }, 100)

    return () => clearTimeout(timer)
  }, [activeIndex])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-[#00CC66] font-semibold">
            {activeIndex === 2 ? `${payload[0].value}% higher` : `${payload[0].value}%`}
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-[#003366] dark:text-white mb-4">
            The <span className="text-[#00CC66]">Financial Exclusion</span> Challenge
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-[800px] mx-auto md:text-lg">
            Financial exclusion remains a significant barrier to economic development in many regions, particularly
            affecting vulnerable populations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Statistic
            title="Unbanked Globally"
            value="1.4 Billion"
            description="Number of adults worldwide without access to basic financial services like bank accounts or mobile money."
            icon={<Globe className="h-6 w-6 text-white" />}
            color="bg-[#003366]"
          />
          <Statistic
            title="Zambian Exclusion"
            value="70%"
            description="Percentage of Zambians who lack access to formal financial services, particularly in rural areas."
            icon={<Users className="h-6 w-6 text-white" />}
            color="bg-[#00CC66]"
          />
          <Statistic
            title="SME Financing Gap"
            value="$5.2 Trillion"
            description="Annual global financing gap for micro, small and medium enterprises in developing economies."
            icon={<Building className="h-6 w-6 text-white" />}
            color="bg-[#4ECDC4]"
          />
          <Statistic
            title="Higher Costs"
            value="40%"
            description="Average percentage more that unbanked individuals pay for financial services compared to those with bank accounts."
            icon={<DollarSign className="h-6 w-6 text-white" />}
            color="bg-[#FF6B6B]"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 md:p-8">
          <Tabs
            defaultValue="global"
            className="w-full"
            onValueChange={(value) => {
              if (value === "global") setActiveIndex(0)
              if (value === "zambia") setActiveIndex(1)
              if (value === "costs") setActiveIndex(2)
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#003366] dark:text-white mb-4 md:mb-0">
                Financial Exclusion Data
              </h3>
              <TabsList className="grid w-full md:w-auto grid-cols-3">
                <TabsTrigger value="global">Global Comparison</TabsTrigger>
                <TabsTrigger value="zambia">Zambia Demographics</TabsTrigger>
                <TabsTrigger value="costs">Cost Burden</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="global" className="mt-0">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <h4 className="text-lg font-semibold mb-3">Global Financial Exclusion</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Financial exclusion varies significantly across regions, with Sub-Saharan Africa facing the highest
                    rates globally. These percentages represent adults without access to formal financial services.
                  </p>
                  <div className="bg-[#003366]/5 dark:bg-[#003366]/20 p-4 rounded-lg">
                    <div className="flex items-start">
                      <TrendingUp className="h-5 w-5 text-[#00CC66] mr-2 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Key Insight:</span> Sub-Saharan Africa has nearly double the
                        financial exclusion rate of East Asia, highlighting significant regional disparities.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#666", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        tick={{ fill: "#666", fontSize: 12 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Exclusion Rate" animationDuration={1000} animationBegin={200}>
                        {animatedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="zambia" className="mt-0">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <h4 className="text-lg font-semibold mb-3">Zambia's Financial Exclusion</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Within Zambia, financial exclusion disproportionately affects certain demographics. Rural
                    populations and women face the highest barriers to financial access.
                  </p>
                  <div className="bg-[#003366]/5 dark:bg-[#003366]/20 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-[#FF6B6B] mr-2 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Critical Issue:</span> 85% of rural Zambians lack access to basic
                        financial services, creating a significant urban-rural divide.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#666", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        tick={{ fill: "#666", fontSize: 12 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Exclusion Rate" animationDuration={1000} animationBegin={200}>
                        {animatedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="mt-0">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <h4 className="text-lg font-semibold mb-3">Financial Service Cost Burden</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Unbanked individuals face significantly higher costs for basic financial services. This chart shows
                    the percentage increase in costs compared to those with traditional banking access.
                  </p>
                  <div className="bg-[#003366]/5 dark:bg-[#003366]/20 p-4 rounded-lg">
                    <div className="flex items-start">
                      <TrendingDown className="h-5 w-5 text-[#00CC66] mr-2 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Opportunity:</span> Digital financial services can reduce these
                        costs by up to 90%, making financial inclusion both socially impactful and economically viable.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#666", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        tick={{ fill: "#666", fontSize: 12 }}
                        domain={[0, 400]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Cost Increase %" animationDuration={1000} animationBegin={200}>
                        {animatedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-[#003366] hover:bg-[#002244] text-white rounded-full group transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-[#003366]/20">
            Download Full Financial Exclusion Report
            <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ArrowDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  )
}

