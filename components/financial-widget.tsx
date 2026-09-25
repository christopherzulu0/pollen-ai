"use client"

import { useEffect } from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InfoIcon as InfoCircle, ArrowRight, ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartBar,
  ChartLine,
  ChartArea,
  ChartGrid,
} from "@/components/ui/chart"

interface FinancialWidgetProps {
  type: "loan-calculator" | "currency-converter" | "goal-tracker" | "budget-planner" | "financial-health"
  initialData?: any
  onUpdate?: (data: any) => void
  className?: string
  showHeader?: boolean
  compact?: boolean
  theme?: "light" | "dark" | "system"
}

export default function FinancialWidget({
  type,
  initialData,
  onUpdate,
  className = "",
  showHeader = true,
  compact = false,
  theme = "system",
}: FinancialWidgetProps) {
  // State management for different widget types
  const [activeTab, setActiveTab] = useState("overview")

  // Map widget types to their titles and descriptions
  const widgetInfo = {
    "loan-calculator": {
      title: "Loan Calculator",
      description: "Calculate your loan payments and compare rates",
      tabs: ["details", "comparison", "amortization"],
    },
    "currency-converter": {
      title: "Currency Converter",
      description: "Convert between different currencies with real-time rates",
      tabs: ["converter", "history", "trends"],
    },
    "goal-tracker": {
      title: "Financial Goal Tracker",
      description: "Set and track your progress towards financial goals",
      tabs: ["goals", "progress", "recommendations"],
    },
    "budget-planner": {
      title: "Budget Planner",
      description: "Plan and manage your monthly budget effectively",
      tabs: ["overview", "categories", "analysis"],
    },
    "financial-health": {
      title: "Financial Health Score",
      description: "Understand and improve your financial wellbeing",
      tabs: ["score", "metrics", "improvements"],
    },
  }

  // Render appropriate content based on widget type
  const renderContent = () => {
    switch (type) {
      case "loan-calculator":
        return <LoanCalculatorContent compact={compact} />
      case "currency-converter":
        return <CurrencyConverterContent compact={compact} />
      case "goal-tracker":
        return <GoalTrackerContent compact={compact} />
      case "budget-planner":
        return <BudgetPlannerContent compact={compact} />
      case "financial-health":
        return <FinancialHealthContent compact={compact} />
      default:
        return <div>Widget type not supported</div>
    }
  }

  return (
    <Card className={`overflow-hidden border-none shadow-xl ${className}`}>
      {showHeader && (
        <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004488] text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{widgetInfo[type].title}</CardTitle>
              <CardDescription className="text-white/80 mt-1">{widgetInfo[type].description}</CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <InfoCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get personalized assistance with this tool</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
      )}
      <CardContent className={compact ? "p-4" : "p-6"}>{renderContent()}</CardContent>
    </Card>
  )
}

// Loan Calculator Content Component
function LoanCalculatorContent({ compact = false }: { compact?: boolean }) {
  const [loanAmount, setLoanAmount] = useState(5000)
  const [loanTerm, setLoanTerm] = useState(24)
  const [traditionalRate, setTraditionalRate] = useState(18)
  const [pollenRate, setPollenRate] = useState(9)
  const [traditionalPayment, setTraditionalPayment] = useState(254.38)
  const [pollenPayment, setPollenPayment] = useState(229.53)
  const [totalSavings, setTotalSavings] = useState(597.12)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Calculate payments when inputs change
  const calculatePayment = (amount: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12
    return (amount * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
  }

  const updateCalculations = () => {
    const tPayment = calculatePayment(loanAmount, traditionalRate, loanTerm)
    const pPayment = calculatePayment(loanAmount, pollenRate, loanTerm)

    setTraditionalPayment(tPayment)
    setPollenPayment(pPayment)
    setTotalSavings((tPayment - pPayment) * loanTerm)
  }

  return (
    <div>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="details">Loan Details</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="amortization">Amortization</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">Loan Amount</Label>
              <span className="text-sm font-medium">${loanAmount.toLocaleString()}</span>
            </div>
            <Slider
              value={[loanAmount]}
              min={1000}
              max={50000}
              step={500}
              onValueChange={(value) => setLoanAmount(value[0])}
              className="my-4"
              onValueCommit={updateCalculations}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$1,000</span>
              <span>$50,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm font-medium">Loan Term (Months)</Label>
              <span className="text-sm font-medium">{loanTerm} months</span>
            </div>
            <Slider
              value={[loanTerm]}
              min={6}
              max={60}
              step={6}
              onValueChange={(value) => setLoanTerm(value[0])}
              className="my-4"
              onValueCommit={updateCalculations}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>6 months</span>
              <span>60 months</span>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-center"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
              {showAdvanced ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {showAdvanced && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="traditional-rate">Traditional Rate (%)</Label>
                  <Input
                    id="traditional-rate"
                    type="number"
                    value={traditionalRate}
                    onChange={(e) => setTraditionalRate(Number(e.target.value))}
                    onBlur={updateCalculations}
                    step="0.1"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <Label htmlFor="pollen-rate">Pollen AI Rate (%)</Label>
                  <Input
                    id="pollen-rate"
                    type="number"
                    value={pollenRate}
                    onChange={(e) => setPollenRate(Number(e.target.value))}
                    onBlur={updateCalculations}
                    step="0.1"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label>Payment Frequency</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Traditional Payment</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">${traditionalPayment.toFixed(2)}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pollen AI Payment</p>
                <p className="text-2xl font-bold text-[#00CC66]">${pollenPayment.toFixed(2)}</p>
                <p className="text-xs text-gray-500">per month</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <p className="font-medium">Total Savings</p>
                <p className="font-bold text-[#00CC66]">${totalSavings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button className="w-full bg-[#003366] hover:bg-[#002244]">
              Apply for This Loan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="h-[300px] mb-6">
            <ChartContainer
              data={[
                { name: "Traditional Bank", value: traditionalPayment },
                { name: "Pollen AI", value: pollenPayment },
              ]}
            >
              <Chart>
                <ChartGrid className="stroke-gray-200" />
                <ChartBar
                  className="fill-gray-400 data-[state=active]:fill-gray-500"
                  dataKey="value"
                  variant="grouped"
                  target="name"
                  valueFormatter={(value) => `$${(value || 0).toFixed(2)}`}
                />
                <ChartTooltip>
                  {({ dataPoint }) => (
                    <ChartTooltipContent>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">
                          {dataPoint.name}: ${(dataPoint.value || 0).toFixed(2)}/month
                        </span>
                      </div>
                    </ChartTooltipContent>
                  )}
                </ChartTooltip>
              </Chart>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Traditional Bank</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Higher monthly payment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Strict credit requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Slower approval process</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#00CC66]/10 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Pollen AI</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2">•</span>
                  <span>Lower monthly payment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2">•</span>
                  <span>AI-powered credit assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#00CC66] mr-2">•</span>
                  <span>Instant approval</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="amortization">
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium">Amortization Schedule</p>
              <Button variant="outline" size="sm">
                Download CSV
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Principal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3, 4, 5].map((i) => {
                    // Simplified amortization calculation
                    const payment = pollenPayment
                    const interest = (loanAmount - (i - 1) * (loanAmount / loanTerm)) * (pollenRate / 100 / 12)
                    const principal = payment - interest
                    const balance = loanAmount - i * (loanAmount / loanTerm)

                    return (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-sm">{i}</td>
                        <td className="px-4 py-3 text-sm">${payment.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">${principal.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">${interest.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">${balance.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-center text-sm text-gray-500">
              Showing 5 of {loanTerm} payments
              <Button variant="link" size="sm" className="ml-2">
                View All
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Currency Converter Content Component
function CurrencyConverterContent({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState(100)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("ZMW")
  const [convertedAmount, setConvertedAmount] = useState(2582)
  const [isConverting, setIsConverting] = useState(false)
  const [showChart, setShowChart] = useState(false)

  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "ZMW", name: "Zambian Kwacha", symbol: "K", flag: "🇿🇲" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
    { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  ]

  // Mock exchange rates relative to USD
  const exchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 150.23,
    ZMW: 25.82,
    KES: 129.45,
    NGN: 1530.67,
    ZAR: 18.76,
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleConvert = () => {
    setIsConverting(true)

    // Simulate API delay
    setTimeout(() => {
      // Convert to USD first (if not already USD)
      const amountInUSD = fromCurrency === "USD" ? amount : amount / exchangeRates[fromCurrency]
      // Then convert from USD to target currency
      const result = toCurrency === "USD" ? amountInUSD : amountInUSD * exchangeRates[toCurrency]
      setConvertedAmount(result)
      setShowChart(true)
      setIsConverting(false)
    }, 800)
  }

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency) || currencies[0]
  const toCurrencyData = currencies.find((c) => c.code === toCurrency) || currencies[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">{fromCurrencyData.symbol}</span>
              </div>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-8 pr-12"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400">{fromCurrency}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-currency">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={`from-${currency.code}`} value={currency.code}>
                      <div className="flex items-center">
                        <span className="mr-2">{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="to-currency">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={`to-${currency.code}`} value={currency.code}>
                      <div className="flex items-center">
                        <span className="mr-2">{currency.flag}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button variant="outline" size="icon" onClick={handleSwap} className="h-10 w-10 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18" />
                <path d="M3 8l9-5 9 5" />
                <path d="M3 16l9 5 9-5" />
              </svg>
            </Button>
          </div>

          <Button className="w-full bg-[#003366] hover:bg-[#002244]" onClick={handleConvert} disabled={isConverting}>
            {isConverting ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Converting...
              </>
            ) : (
              <>Convert</>
            )}
          </Button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</p>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <p className="text-lg font-medium">
                1 {fromCurrency} = {(exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(4)} {toCurrency}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: {new Date().toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 mr-2 text-lg">
                  {fromCurrencyData.flag}
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                  <p className="font-medium">
                    {amount.toFixed(2)} {fromCurrency}
                  </p>
                </div>
              </div>
              <ArrowRight className="text-gray-400" />
              <div className="flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00CC66]/10 mr-2 text-lg">
                  {toCurrencyData.flag}
                </span>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                  <p className="font-medium text-[#00CC66]">
                    {convertedAmount.toFixed(2)} {toCurrency}
                  </p>
                </div>
              </div>
            </div>

            {showChart && (
              <div className="h-[150px] my-4">
                <ChartContainer
                  data={[
                    { date: "Monday", rate: (exchangeRates[toCurrency] / exchangeRates[fromCurrency]) * 0.98 },
                    { date: "Tuesday", rate: (exchangeRates[toCurrency] / exchangeRates[fromCurrency]) * 0.99 },
                    { date: "Wednesday", rate: (exchangeRates[toCurrency] / exchangeRates[fromCurrency]) * 0.997 },
                    { date: "Thursday", rate: (exchangeRates[toCurrency] / exchangeRates[fromCurrency]) * 1.0 },
                    { date: "Friday", rate: (exchangeRates[toCurrency] / exchangeRates[fromCurrency]) * 1.003 },
                  ]}
                >
                  <Chart>
                    <ChartGrid className="stroke-gray-200 dark:stroke-gray-700" />
                    <ChartLine dataKey="rate" className="stroke-[#00CC66]" />
                    <ChartArea dataKey="rate" className="fill-[#00CC66]/20" />
                  </Chart>
                </ChartContainer>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center text-xs text-[#00CC66]">
                <Check className="h-3 w-3 mr-1" />
                <span>No hidden fees, transparent exchange rates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#003366]/5 dark:bg-[#003366]/20 rounded-lg p-4 mt-4">
        <h4 className="font-medium mb-2">Popular Conversions</h4>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="ghost"
            className="justify-start text-left"
            onClick={() => {
              setFromCurrency("USD")
              setToCurrency("EUR")
            }}
          >
            <span className="mr-2">🇺🇸 → 🇪🇺</span>
            <span>USD to EUR</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left"
            onClick={() => {
              setFromCurrency("GBP")
              setToCurrency("USD")
            }}
          >
            <span className="mr-2">🇬🇧 → 🇺🇸</span>
            <span>GBP to USD</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left"
            onClick={() => {
              setFromCurrency("USD")
              setToCurrency("ZMW")
            }}
          >
            <span className="mr-2">🇺🇸 → 🇿🇲</span>
            <span>USD to ZMW</span>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left"
            onClick={() => {
              setFromCurrency("EUR")
              setToCurrency("NGN")
            }}
          >
            <span className="mr-2">🇪🇺 → 🇳🇬</span>
            <span>EUR to NGN</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Goal Tracker Content Component
function GoalTrackerContent({ compact = false }: { compact?: boolean }) {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      targetAmount: 5000,
      currentAmount: 2750,
      deadline: "2024-12-31",
      color: "bg-blue-500",
      category: "Savings",
      icon: "💰",
    },
    {
      id: 2,
      name: "New Laptop",
      targetAmount: 1200,
      currentAmount: 800,
      deadline: "2024-06-30",
      color: "bg-purple-500",
      category: "Purchase",
      icon: "💻",
    },
    {
      id: 3,
      name: "Vacation",
      targetAmount: 3000,
      currentAmount: 1200,
      deadline: "2024-08-15",
      color: "bg-amber-500",
      category: "Travel",
      icon: "✈️",
    },
  ])

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: "",
    color: "bg-blue-500",
    category: "Savings",
    icon: "💰",
  })

  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null)

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setGoals([...goals, { ...newGoal, id: Date.now() }])
      setNewGoal({
        name: "",
        targetAmount: 0,
        currentAmount: 0,
        deadline: "",
        color: "bg-blue-500",
        category: "Savings",
        icon: "💰",
      })
      setIsAddingGoal(false)
    }
  }

  const handleUpdateAmount = (id: number, amount: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, currentAmount: goal.currentAmount + amount } : goal)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#003366] dark:text-white">Your Financial Goals</h3>
        <Button className="bg-[#00CC66] hover:bg-[#00BB55]" onClick={() => setIsAddingGoal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Goal
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All Goals
          </TabsTrigger>
          <TabsTrigger value="inprogress" className="flex-1">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="achieved" className="flex-1">
            Achieved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-4" onClick={() => setActiveGoalId(activeGoalId === goal.id ? null : goal.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full ${goal.color} flex items-center justify-center text-white text-lg`}
                      >
                        {goal.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
                      </div>
                    </div>
                    <Badge
                      variant={calculateProgress(goal.currentAmount, goal.targetAmount) >= 100 ? "success" : "outline"}
                      className={
                        calculateProgress(goal.currentAmount, goal.targetAmount) >= 100 ? "bg-green-500 text-white" : ""
                      }
                    >
                      {calculateProgress(goal.currentAmount, goal.targetAmount)}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(goal.currentAmount, goal.targetAmount)}
                      className="h-2"
                      indicatorClassName={goal.color}
                    />
                  </div>

                  {activeGoalId === goal.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateAmount(goal.id, 50)
                            }}
                          >
                            + $50
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateAmount(goal.id, 100)
                            }}
                          >
                            + $100
                          </Button>
                        </div>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedGoal(goal)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              setGoals(goals.filter((g) => g.id !== goal.id))
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inprogress" className="mt-4">
          <div className="space-y-4">
            {goals
              .filter((goal) => calculateProgress(goal.currentAmount, goal.targetAmount) < 100)
              .map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  {/* Same as in the "all" tab, but for in-progress goals only */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full ${goal.color} flex items-center justify-center text-white text-lg`}
                      >
                        {goal.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{calculateProgress(goal.currentAmount, goal.targetAmount)}%</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Due: {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress
                      value={calculateProgress(goal.currentAmount, goal.targetAmount)}
                      className="h-2"
                      indicatorClassName={goal.color}
                    />
                  </div>
                </motion.div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="achieved" className="mt-4">
          <div className="space-y-4">
            {goals
              .filter((goal) => calculateProgress(goal.currentAmount, goal.targetAmount) >= 100)
              .map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  {/* Same as in the "all" tab, but for achieved goals only */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full ${goal.color} flex items-center justify-center text-white text-lg`}
                      >
                        {goal.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{goal.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{goal.category}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Achieved!</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Completed: {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-green-500" />
                  </div>
                </motion.div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Budget Planner Content Component
function BudgetPlannerContent({ compact = false }: { compact?: boolean }) {
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [categories, setCategories] = useState([
    { id: 1, name: "Housing", budgeted: 1500, spent: 1450, color: "#003366" },
    { id: 2, name: "Food", budgeted: 600, spent: 580, color: "#00CC66" },
    { id: 3, name: "Transportation", budgeted: 400, spent: 385, color: "#FF6B6B" },
    { id: 4, name: "Utilities", budgeted: 300, spent: 310, color: "#4ECDC4" },
    { id: 5, name: "Entertainment", budgeted: 200, spent: 250, color: "#FFD166" },
    { id: 6, name: "Savings", budgeted: 1000, spent: 1000, color: "#6A0572" },
  ])

  const [newCategory, setNewCategory] = useState({
    name: "",
    budgeted: 0,
    spent: 0,
    color: "#003366",
  })

  const [selectedTabView, setSelectedTabView] = useState("overview")
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const totalBudgeted = categories.reduce((sum, category) => sum + category.budgeted, 0)
  const totalSpent = categories.reduce((sum, category) => sum + category.spent, 0)
  const remaining = monthlyIncome - totalBudgeted
  const spentPercentage = Math.round((totalSpent / totalBudgeted) * 100)

  const pieChartData = categories.map((category) => ({
    name: category.name,
    value: category.budgeted,
    color: category.color,
  }))

  const spendingData = categories.map((category) => ({
    name: category.name,
    value: category.spent,
    color: category.color,
  }))

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.budgeted > 0) {
      setCategories([...categories, { ...newCategory, id: Date.now() }])
      setNewCategory({
        name: "",
        budgeted: 0,
        spent: 0,
        color: "#003366",
      })
      setIsAddingCategory(false)
    }
  }

  const getStatusColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100
    if (percentage > 100) return "text-red-500"
    if (percentage > 90) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedTabView} onValueChange={setSelectedTabView} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Monthly Income</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-32 text-right"
                    />
                    <span>USD</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Budgeted</span>
                      <span className="font-medium">${totalBudgeted.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(totalBudgeted / monthlyIncome) * 100}
                      className="h-2"
                      indicatorClassName="bg-[#003366]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                      <span className="font-medium">${totalSpent.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(totalSpent / monthlyIncome) * 100}
                      className="h-2"
                      indicatorClassName="bg-[#00CC66]"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Remaining to Budget</span>
                      <span
                        className={`font-semibold ${
                          remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        ${remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="font-medium">Budget Used</span>
                      <span
                        className={`font-semibold ${
                          spentPercentage <= 100
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {spentPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
                <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>

                <div className="h-[300px] mb-6">
                  <ChartContainer data={pieChartData}>
                    <Chart>
                      {pieChartData.map((entry, index) => (
                        <ChartBar
                          key={`cell-${index}`}
                          className="fill-current"
                          style={{ fill: entry.color }}
                          dataKey="value"
                        />
                      ))}
                    </Chart>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <span>{category.name}</span>
                      <span className="ml-auto font-medium">${category.budgeted}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <div className="space-y-4">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Budgeted</span>
                      <span className="font-medium">${category.budgeted.toLocaleString()}</span>
                    </div>
                    <Progress value={100} className="h-2" indicatorClassName="bg-gray-300 dark:bg-gray-600" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Spent</span>
                      <span className="font-medium">${category.spent.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(category.spent / category.budgeted) * 100}
                      className="h-2"
                      indicatorClassName={category.spent <= category.budgeted ? "bg-[#00CC66]" : "bg-red-500"}
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-sm">Remaining</span>
                    <span
                      className={`font-medium ${
                        category.budgeted - category.spent >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      ${(category.budgeted - category.spent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            <Button className="w-full bg-[#003366] hover:bg-[#002244]" onClick={() => setIsAddingCategory(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Budget Category
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Spending Analysis</h3>

              <div className="h-[250px] mb-4">
                <ChartContainer data={spendingData}>
                  <Chart>
                    {spendingData.map((entry, index) => (
                      <ChartBar
                        key={`cell-${index}`}
                        className="fill-current"
                        style={{ fill: entry.color }}
                        dataKey="value"
                      />
                    ))}
                  </Chart>
                </ChartContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Budget vs. Actual</h3>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className={getStatusColor(category.spent, category.budgeted)}>
                          ${category.spent.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          / ${category.budgeted.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          style={{ width: `${Math.min((category.spent / category.budgeted) * 100, 100)}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            category.spent <= category.budgeted ? "bg-[#00CC66]" : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-2">Budget Insights</h4>
                <ul className="space-y-2 text-sm">
                  {categories.some((cat) => cat.spent > cat.budgeted) && (
                    <li className="flex items-start">
                      <span className="text-red-500 dark:text-red-400 mr-2">•</span>
                      <span>
                        {categories.filter((cat) => cat.spent > cat.budgeted).length} categories are over budget.
                      </span>
                    </li>
                  )}
                  {categories.some((cat) => cat.spent < cat.budgeted * 0.5) && (
                    <li className="flex items-start">
                      <span className="text-yellow-500 dark:text-yellow-400 mr-2">•</span>
                      <span>
                        {categories.filter((cat) => cat.spent < cat.budgeted * 0.5).length} categories are significantly
                        under budget.
                      </span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <span className="text-blue-500 dark:text-blue-400 mr-2">•</span>
                    <span>
                      Your largest spending category is {categories.sort((a, b) => b.spent - a.spent)[0].name} at $
                      {categories.sort((a, b) => b.spent - a.spent)[0].spent.toLocaleString()}.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Financial Health Content Component
function FinancialHealthContent({ compact = false }: { compact?: boolean }) {
  const [overallScore, setOverallScore] = useState(70)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [metrics, setMetrics] = useState([
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

  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)

  // Animate the score on initial load
  useEffect(() => {
    const duration = 2000 // 2 seconds
    const interval = 20 // Update every 20ms
    const steps = duration / interval
    const increment = overallScore / steps

    let currentScore = 0
    const timer = setInterval(() => {
      currentScore += increment
      if (currentScore >= overallScore) {
        setAnimatedScore(overallScore)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(currentScore))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [overallScore])

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
        return <Check className="h-5 w-5 text-green-500 dark:text-green-400" />
      case "good":
        return <Check className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      case "fair":
        return <AlertCircle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
      case "poor":
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        )
    }
  }

  return (
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

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => setExpandedMetric(expandedMetric === metric.name ? null : metric.name)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {getStatusIcon(metric.status)}
                    <span className="ml-2 font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-semibold mr-4 ${getScoreColor(metric.score)}`}>{metric.score}</span>
                    <Progress
                      value={metric.score}
                      className="w-24 h-2"
                      indicatorClassName={getScoreBackground(metric.score)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`ml-2 h-4 w-4 transition-transform ${
                        expandedMetric === metric.name ? "transform rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </button>

              {expandedMetric === metric.name && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">{metric.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Improvement Tips:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {metric.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="w-full">
            Download Full Financial Health Report
          </Button>
        </div>
      </div>
    </div>
  )
}

