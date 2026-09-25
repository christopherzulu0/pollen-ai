"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AreaChart,
  Area,
  Legend,
} from "recharts"
import { DownloadCloud, Calendar, BarChart2, PieChartIcon, LineChartIcon, TrendingUp } from "lucide-react"

interface DataVisualizationProps {
  type: "statistics" | "financials" | "demographics" | "comparison"
  data?: any[]
  title?: string
  description?: string
  className?: string
  showControls?: boolean
  compact?: boolean
  interactive?: boolean
  timeRange?: "week" | "month" | "quarter" | "year" | "all"
  onFilterChange?: (filters: any) => void
}

export default function DataVisualization({
  type,
  data: initialData,
  title,
  description,
  className = "",
  showControls = true,
  compact = false,
  interactive = true,
  timeRange = "month",
  onFilterChange,
}: DataVisualizationProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie" | "area">("bar")
  const [data, setData] = useState<any[]>([])
  const [selectedRange, setSelectedRange] = useState(timeRange)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Default colors for charts
  const COLORS = ["#003366", "#00CC66", "#FF6B6B", "#4ECDC4", "#FFD166", "#6A0572", "#AB83A1"]

  // Example data if none provided
  const defaultData = {
    statistics: [
      { name: "Sub-Saharan Africa", value: 57, color: "#003366" },
      { name: "South Asia", value: 30, color: "#00CC66" },
      { name: "Latin America", value: 26, color: "#4ECDC4" },
      { name: "East Asia", value: 24, color: "#FFD166" },
      { name: "Middle East", value: 37, color: "#FF6B6B" },
      { name: "Global Average", value: 31, color: "#6A0572" },
    ],
    financials: [
      { name: "Jan", income: 4000, expenses: 2400, savings: 1600 },
      { name: "Feb", income: 3500, expenses: 2100, savings: 1400 },
      { name: "Mar", income: 5000, expenses: 3200, savings: 1800 },
      { name: "Apr", income: 4200, expenses: 2800, savings: 1400 },
      { name: "May", income: 4800, expenses: 3100, savings: 1700 },
      { name: "Jun", income: 5200, expenses: 3300, savings: 1900 },
    ],
    demographics: [
      { name: "Under 18", value: 15 },
      { name: "18-24", value: 22 },
      { name: "25-34", value: 38 },
      { name: "35-44", value: 20 },
      { name: "45-54", value: 15 },
      { name: "55+", value: 10 },
    ],
    comparison: [
      { name: "2019", traditional: 20, pollenai: 5 },
      { name: "2020", traditional: 25, pollenai: 30 },
      { name: "2021", traditional: 27, pollenai: 45 },
      { name: "2022", traditional: 30, pollenai: 60 },
      { name: "2023", traditional: 32, pollenai: 75 },
    ],
  }

  useEffect(() => {
    if (initialData) {
      setData(initialData)
    } else {
      // Use default data for the selected type
      setData(defaultData[type] || [])
    }
  }, [initialData, type])

  // Simulate fetching data for different time ranges
  const fetchData = (range: string) => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      let newData
      const baseData = defaultData[type]

      switch (range) {
        case "week":
          newData = baseData.slice(0, 2) // Smaller dataset for week
          break
        case "month":
          newData = baseData // Use full dataset for month
          break
        case "quarter":
          // Multiply values slightly for quarter
          newData = baseData.map((item) => {
            const newItem = { ...item }
            // Handle different data structures
            if ("value" in newItem) {
              newItem.value = Math.round(newItem.value * 1.2)
            } else {
              Object.keys(newItem).forEach((key) => {
                if (typeof newItem[key] === "number" && key !== "name") {
                  newItem[key] = Math.round(newItem[key] * 1.2)
                }
              })
            }
            return newItem
          })
          break
        case "year":
          // Multiply values more for year
          newData = baseData.map((item) => {
            const newItem = { ...item }
            if ("value" in newItem) {
              newItem.value = Math.round(newItem.value * 1.5)
            } else {
              Object.keys(newItem).forEach((key) => {
                if (typeof newItem[key] === "number" && key !== "name") {
                  newItem[key] = Math.round(newItem[key] * 1.5)
                }
              })
            }
            return newItem
          })
          break
        default:
          newData = baseData
      }

      setData(newData)
      setIsLoading(false)
      if (onFilterChange) {
        onFilterChange({ timeRange: range, chartType })
      }
    }, 800)
  }

  const handleRangeChange = (value: string) => {
    setSelectedRange(value)
    fetchData(value)
  }

  const handleChartTypeChange = (value: "bar" | "line" | "pie" | "area") => {
    setChartType(value)
    if (onFilterChange) {
      onFilterChange({ timeRange: selectedRange, chartType: value })
    }
  }

  const downloadData = () => {
    // Create CSV data
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add headers
    if (data.length > 0) {
      const headers = Object.keys(data[0]).join(",")
      csvContent += headers + "\r\n"

      // Add data rows
      data.forEach((item) => {
        const row = Object.values(item).join(",")
        csvContent += row + "\r\n"
      })
    }

    // Create download link and trigger click
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${type}_data_${selectedRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Render the appropriate chart based on the selected type and chart type
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-72">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div>
        </div>
      )
    }

    if (!data || data.length === 0) {
      return <div className="flex items-center justify-center h-72 text-gray-500">No data available</div>
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={compact ? 250 : 350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#666", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {getChartKeys().map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={formatKeyName(key)}
                  fill={COLORS[index % COLORS.length]}
                  animationDuration={1000}
                  animationBegin={200 * index}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={compact ? 250 : 350}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#666", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {getChartKeys().map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={formatKeyName(key)}
                  stroke={COLORS[index % COLORS.length]}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  animationDuration={1000}
                  animationBegin={200 * index}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={compact ? 250 : 350}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={preparePieData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={compact ? 80 : 120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                animationDuration={1000}
                activeIndex={interactive ? activeIndex : undefined}
                activeShape={renderActiveShape}
                onMouseEnter={interactive ? (_, index) => setActiveIndex(index) : undefined}
              >
                {preparePieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={compact ? 250 : 350}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fill: "#666", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {getChartKeys().map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={formatKeyName(key)}
                  stroke={COLORS[index % COLORS.length]}
                  fill={`${COLORS[index % COLORS.length]}40`} // Add transparency to fill
                  stackId={type === "financials" ? "1" : undefined} // Stack areas for financials
                  animationDuration={1000}
                  animationBegin={200 * index}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )

      default:
        return <div className="flex items-center justify-center h-72 text-gray-500">Chart type not supported</div>
    }
  }

  // Helper function to get the chart keys (excluding 'name', 'color', etc.)
  const getChartKeys = () => {
    if (!data || data.length === 0) return []

    const firstItem = data[0]
    return Object.keys(firstItem).filter(
      (key) => key !== "name" && key !== "color" && typeof firstItem[key] === "number",
    )
  }

  // Format key names for display (e.g., 'pollenai' -> 'Pollen AI')
  const formatKeyName = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Prepare data for pie chart
  const preparePieData = () => {
    if (type === "demographics" || type === "statistics") {
      // These types already have the right format for pie charts
      return data
    }

    // For other types, we need to transform the data
    const keys = getChartKeys()
    if (keys.length === 0) return []

    // Use the first key by default, or sum up all values
    const pieData = data.map((item) => ({
      name: item.name,
      value: keys.length === 1 ? item[keys[0]] : keys.reduce((sum, key) => sum + item[key], 0),
      color: item.color || undefined,
    }))

    return pieData
  }

  // Custom active shape for interactive pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333" className="text-sm font-medium">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={10} textAnchor="middle" fill="#999" className="text-xs">
          {`${value} (${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <Card className={`border-none shadow-xl overflow-hidden ${className}`}>
      {title && (
        <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription className="text-white/80 mt-1">{description}</CardDescription>}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-4" : "p-6"}>
        {showControls && (
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Tabs value={chartType} onValueChange={(v) => handleChartTypeChange(v as any)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="bar" className="px-3">
                    <BarChart2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Bar</span>
                  </TabsTrigger>
                  <TabsTrigger value="line" className="px-3">
                    <LineChartIcon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Line</span>
                  </TabsTrigger>
                  <TabsTrigger value="pie" className="px-3">
                    <PieChartIcon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Pie</span>
                  </TabsTrigger>
                  <TabsTrigger value="area" className="px-3">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Area</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={selectedRange} onValueChange={handleRangeChange}>
                <SelectTrigger className="w-[140px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={downloadData} className="ml-auto">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        )}

        {renderChart()}
      </CardContent>
    </Card>
  )
}

// Helper component for pie chart active segment
const Sector = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}: {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
}) => {
  const RADIAN = Math.PI / 180
  const sin = Math.sin(-RADIAN * startAngle)
  const cos = Math.cos(-RADIAN * startAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <path d={`M${cx},${cy}L${sx},${sy}A${outerRadius},${outerRadius},0,1,1,${cx},${cy}`} stroke="none" fill={fill} />
    </g>
  )
}

