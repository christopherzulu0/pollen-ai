"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Eye,
  Plus,
  Building2,
  Scale,
  Clock,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for financial statements
const financialData = {
  revenue: {
    platformFees: 45200,
    interestIncome: 28500,
    serviceFees: 12300,
    penaltyFees: 3400,
    total: 89400,
  },
  expenses: {
    operatingExpenses: 32500,
    staffSalaries: 18000,
    technology: 8500,
    marketing: 5200,
    compliance: 3800,
    total: 68000,
  },
  assets: {
    cash: 125000,
    accountsReceivable: 45000,
    loanPortfolio: 350000,
    equipment: 25000,
    total: 545000,
  },
  liabilities: {
    accountsPayable: 18000,
    memberDeposits: 285000,
    deferredRevenue: 12000,
    total: 315000,
  },
}

const chartOfAccounts = [
  { code: "1000", name: "Cash & Bank", type: "ASSET", balance: 125000, status: "Active" },
  { code: "1100", name: "Accounts Receivable", type: "ASSET", balance: 45000, status: "Active" },
  { code: "1200", name: "Loan Portfolio", type: "ASSET", balance: 350000, status: "Active" },
  { code: "1500", name: "Equipment", type: "ASSET", balance: 25000, status: "Active" },
  { code: "2000", name: "Accounts Payable", type: "LIABILITY", balance: 18000, status: "Active" },
  { code: "2100", name: "Member Deposits", type: "LIABILITY", balance: 285000, status: "Active" },
  { code: "3000", name: "Equity", type: "EQUITY", balance: 230000, status: "Active" },
  { code: "4000", name: "Platform Fees", type: "REVENUE", balance: 45200, status: "Active" },
  { code: "4100", name: "Interest Income", type: "REVENUE", balance: 28500, status: "Active" },
  { code: "5000", name: "Operating Expenses", type: "EXPENSE", balance: 32500, status: "Active" },
  { code: "5100", name: "Staff Salaries", type: "EXPENSE", balance: 18000, status: "Active" },
]

const journalEntries = [
  {
    id: "JE-2024-001",
    date: "2024-03-15",
    description: "Monthly platform fees collection",
    reference: "Platform-Mar-2024",
    status: "POSTED",
    createdBy: "John Accountant",
    entries: [
      { account: "1000 - Cash & Bank", debit: 5200, credit: 0 },
      { account: "4000 - Platform Fees", debit: 0, credit: 5200 },
    ],
  },
  {
    id: "JE-2024-002",
    date: "2024-03-14",
    description: "Loan disbursement - Village Savings Group",
    reference: "LOAN-VSG-001",
    status: "POSTED",
    createdBy: "Jane Accountant",
    entries: [
      { account: "1200 - Loan Portfolio", debit: 50000, credit: 0 },
      { account: "1000 - Cash & Bank", debit: 0, credit: 50000 },
    ],
  },
  {
    id: "JE-2024-003",
    date: "2024-03-13",
    description: "Monthly staff salaries",
    reference: "PAYROLL-MAR-2024",
    status: "POSTED",
    createdBy: "John Accountant",
    entries: [
      { account: "5100 - Staff Salaries", debit: 18000, credit: 0 },
      { account: "1000 - Cash & Bank", debit: 0, credit: 18000 },
    ],
  },
  {
    id: "JE-2024-004",
    date: "2024-03-12",
    description: "Interest income recognition",
    reference: "INT-MAR-2024",
    status: "DRAFT",
    createdBy: "Jane Accountant",
    entries: [
      { account: "1100 - Accounts Receivable", debit: 2850, credit: 0 },
      { account: "4100 - Interest Income", debit: 0, credit: 2850 },
    ],
  },
]

const bankReconciliation = {
  bankBalance: 128500,
  bookBalance: 125000,
  reconciled: false,
  differences: [
    { type: "Outstanding Checks", amount: -5200, description: "Check #1234 - Vendor Payment" },
    { type: "Deposits in Transit", amount: 3500, description: "Mobile Money deposits pending" },
    { type: "Bank Fees", amount: -1800, description: "Monthly service charges" },
  ],
}

const budgetVsActual = [
  { category: "Platform Fees", budget: 50000, actual: 45200, variance: -4800, variancePercent: -9.6 },
  { category: "Interest Income", budget: 30000, actual: 28500, variance: -1500, variancePercent: -5.0 },
  { category: "Operating Expenses", budget: 35000, actual: 32500, variance: 2500, variancePercent: 7.1 },
  { category: "Staff Salaries", budget: 20000, actual: 18000, variance: 2000, variancePercent: 10.0 },
  { category: "Technology", budget: 10000, actual: 8500, variance: 1500, variancePercent: 15.0 },
]

const cashFlowData = [
  { month: "Jan", operating: 15000, investing: -5000, financing: 8000 },
  { month: "Feb", operating: 18000, investing: -3000, financing: 5000 },
  { month: "Mar", operating: 21400, investing: -2500, financing: 3000 },
  { month: "Apr", operating: 19500, investing: -4000, financing: 6000 },
  { month: "May", operating: 23000, investing: -3500, financing: 4500 },
  { month: "Jun", operating: 25000, investing: -2000, financing: 2000 },
]

const auditTrail = [
  {
    id: "1",
    timestamp: "2024-03-15 10:30:00",
    user: "john.accountant@example.com",
    action: "CREATED",
    entityType: "JOURNAL_ENTRY",
    entityId: "JE-2024-001",
    description: "Created journal entry for platform fees",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2024-03-15 10:32:00",
    user: "jane.supervisor@example.com",
    action: "APPROVED",
    entityType: "JOURNAL_ENTRY",
    entityId: "JE-2024-001",
    description: "Approved and posted journal entry",
    ipAddress: "192.168.1.101",
  },
  {
    id: "3",
    timestamp: "2024-03-14 15:20:00",
    user: "john.accountant@example.com",
    action: "MODIFIED",
    entityType: "CHART_OF_ACCOUNTS",
    entityId: "1000",
    description: "Updated Cash & Bank account balance",
    ipAddress: "192.168.1.100",
  },
  {
    id: "4",
    timestamp: "2024-03-14 14:15:00",
    user: "jane.accountant@example.com",
    action: "RECONCILED",
    entityType: "BANK_RECONCILIATION",
    entityId: "RECON-MAR-2024",
    description: "Completed bank reconciliation for March",
    ipAddress: "192.168.1.102",
  },
]

const taxReports = [
  {
    period: "Q1 2024",
    type: "VAT Return",
    status: "Filed",
    dueDate: "2024-04-20",
    filedDate: "2024-04-15",
    amount: 8950,
  },
  {
    period: "Q4 2023",
    type: "Corporate Tax",
    status: "Filed",
    dueDate: "2024-01-31",
    filedDate: "2024-01-28",
    amount: 12400,
  },
  {
    period: "Q2 2024",
    type: "VAT Return",
    status: "Pending",
    dueDate: "2024-07-20",
    filedDate: null,
    amount: 0,
  },
]

const complianceChecks = [
  {
    check: "Monthly Bank Reconciliation",
    status: "COMPLETED",
    lastChecked: "2024-03-15",
    frequency: "Monthly",
  },
  {
    check: "Loan Portfolio Review",
    status: "COMPLETED",
    lastChecked: "2024-03-10",
    frequency: "Weekly",
  },
  {
    check: "Transaction Audit",
    status: "IN_PROGRESS",
    lastChecked: "2024-03-14",
    frequency: "Daily",
  },
  {
    check: "Regulatory Reporting",
    status: "OVERDUE",
    lastChecked: "2024-02-28",
    frequency: "Monthly",
  },
  {
    check: "Financial Statement Preparation",
    status: "COMPLETED",
    lastChecked: "2024-03-12",
    frequency: "Monthly",
  },
]

export function AccountingView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [showJournalDialog, setShowJournalDialog] = useState(false)
  const [showAccountDialog, setShowAccountDialog] = useState(false)
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<(typeof journalEntries)[0] | null>(null)

  const netIncome = financialData.revenue.total - financialData.expenses.total
  const equity = financialData.assets.total - financialData.liabilities.total
  const profitMargin = ((netIncome / financialData.revenue.total) * 100).toFixed(1)
  const returnOnAssets = ((netIncome / financialData.assets.total) * 100).toFixed(1)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZM", { style: "currency", currency: "ZMW" }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Accounting & Finance</h2>
          <p className="text-sm text-muted-foreground">Comprehensive financial management and reporting</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(financialData.revenue.total)}</p>
                <p className="text-xs text-green-500 mt-1">+12.5% from last period</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Income</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(netIncome)}</p>
                <p className="text-xs text-purple-500 mt-1">{profitMargin}% profit margin</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(financialData.assets.total)}</p>
                <p className="text-xs text-blue-500 mt-1">{returnOnAssets}% ROA</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Equity</p>
                <p className="text-2xl font-bold mt-2">{formatCurrency(equity)}</p>
                <p className="text-xs text-orange-500 mt-1">
                  {((equity / financialData.assets.total) * 100).toFixed(1)}% equity ratio
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Scale className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="statements" className="text-xs sm:text-sm">
            Statements
          </TabsTrigger>
          <TabsTrigger value="journal" className="text-xs sm:text-sm">
            Journal
          </TabsTrigger>
          <TabsTrigger value="accounts" className="text-xs sm:text-sm">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="reconciliation" className="text-xs sm:text-sm">
            Reconciliation
          </TabsTrigger>
          <TabsTrigger value="budget" className="text-xs sm:text-sm">
            Budget
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs sm:text-sm">
            Tax
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs sm:text-sm">
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs sm:text-sm">
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Cash Flow Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Cash Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff" }} />
                    <YAxis stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff" }} width={60} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="operating" fill="#8b5cf6" name="Operating" />
                    <Bar dataKey="investing" fill="#a78bfa" name="Investing" />
                    <Bar dataKey="financing" fill="#c4b5fd" name="Financing" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue vs Expenses */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Revenue</span>
                      <span className="text-sm font-bold text-green-500">
                        {formatCurrency(financialData.revenue.total)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Platform Fees</span>
                        <span>{formatCurrency(financialData.revenue.platformFees)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Interest Income</span>
                        <span>{formatCurrency(financialData.revenue.interestIncome)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Service Fees</span>
                        <span>{formatCurrency(financialData.revenue.serviceFees)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Penalty Fees</span>
                        <span>{formatCurrency(financialData.revenue.penaltyFees)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Expenses</span>
                      <span className="text-sm font-bold text-red-500">
                        {formatCurrency(financialData.expenses.total)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Operating Expenses</span>
                        <span>{formatCurrency(financialData.expenses.operatingExpenses)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Staff Salaries</span>
                        <span>{formatCurrency(financialData.expenses.staffSalaries)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Technology</span>
                        <span>{formatCurrency(financialData.expenses.technology)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Marketing</span>
                        <span>{formatCurrency(financialData.expenses.marketing)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Net Income</span>
                    <span className="text-lg font-bold text-purple-500">{formatCurrency(netIncome)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Compliance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {check.status === "COMPLETED" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {check.status === "IN_PROGRESS" && <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />}
                      {check.status === "OVERDUE" && <AlertCircle className="h-5 w-5 text-red-500" />}
                      <div>
                        <p className="text-sm font-medium">{check.check}</p>
                        <p className="text-xs text-muted-foreground">
                          Last checked: {check.lastChecked} • {check.frequency}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        check.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-500"
                          : check.status === "IN_PROGRESS"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                      }
                    >
                      {check.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Income Statement */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Income Statement</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Revenue</h4>
                    <div className="space-y-2">
                      {Object.entries(financialData.revenue).map(([key, value]) => {
                        if (key === "total") return null
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span>{formatCurrency(value)}</span>
                          </div>
                        )
                      })}
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total Revenue</span>
                        <span className="text-green-500">{formatCurrency(financialData.revenue.total)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Expenses</h4>
                    <div className="space-y-2">
                      {Object.entries(financialData.expenses).map(([key, value]) => {
                        if (key === "total") return null
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span>{formatCurrency(value)}</span>
                          </div>
                        )
                      })}
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total Expenses</span>
                        <span className="text-red-500">{formatCurrency(financialData.expenses.total)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-base font-bold">
                    <span>Net Income</span>
                    <span className="text-purple-500">{formatCurrency(netIncome)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Balance Sheet */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Balance Sheet</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Assets</h4>
                    <div className="space-y-2">
                      {Object.entries(financialData.assets).map(([key, value]) => {
                        if (key === "total") return null
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span>{formatCurrency(value)}</span>
                          </div>
                        )
                      })}
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total Assets</span>
                        <span className="text-blue-500">{formatCurrency(financialData.assets.total)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Liabilities</h4>
                    <div className="space-y-2">
                      {Object.entries(financialData.liabilities).map(([key, value]) => {
                        if (key === "total") return null
                        return (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            <span>{formatCurrency(value)}</span>
                          </div>
                        )
                      })}
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total Liabilities</span>
                        <span className="text-orange-500">{formatCurrency(financialData.liabilities.total)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-base font-bold">
                    <span>Equity</span>
                    <span className="text-purple-500">{formatCurrency(equity)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Flow Statement */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Cash Flow Statement</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff" }} />
                  <YAxis stroke="#ffffff" fontSize={12} tick={{ fill: "#ffffff" }} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="operating" stroke="#8b5cf6" strokeWidth={2} name="Operating" />
                  <Line type="monotone" dataKey="investing" stroke="#a78bfa" strokeWidth={2} name="Investing" />
                  <Line type="monotone" dataKey="financing" stroke="#c4b5fd" strokeWidth={2} name="Financing" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journal" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Journal Entries</CardTitle>
                <Button size="sm" onClick={() => setShowJournalDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Entry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <Card key={entry.id} className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold">{entry.id}</span>
                            <Badge
                              variant="outline"
                              className={
                                entry.status === "POSTED"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }
                            >
                              {entry.status}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{entry.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {entry.date} • By {entry.createdBy} • Ref: {entry.reference}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedJournalEntry(entry)
                            setShowJournalDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1 mt-3 pt-3 border-t border-border">
                        {entry.entries.map((line, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{line.account}</span>
                            <div className="flex gap-4 font-mono">
                              <span className={line.debit > 0 ? "text-green-500" : "text-muted-foreground"}>
                                {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                              </span>
                              <span className={line.credit > 0 ? "text-red-500" : "text-muted-foreground"}>
                                {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Chart of Accounts</CardTitle>
                <Button size="sm" onClick={() => setShowAccountDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Account
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chartOfAccounts.map((account) => (
                      <TableRow key={account.code}>
                        <TableCell className="font-mono text-sm">{account.code}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              account.status === "Active"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-gray-500/10 text-gray-500"
                            }
                          >
                            {account.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Reconciliation Tab */}
        <TabsContent value="reconciliation" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Bank Reconciliation</CardTitle>
                <Button size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Reconciliation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Balance Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Bank Statement Balance</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(bankReconciliation.bankBalance)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Book Balance</p>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(bankReconciliation.bookBalance)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Difference</p>
                      <p className="text-2xl font-bold mt-2 text-orange-500">
                        {formatCurrency(bankReconciliation.bankBalance - bankReconciliation.bookBalance)}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Reconciliation Status */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-semibold text-sm">Reconciliation Required</p>
                    <p className="text-xs text-muted-foreground">
                      {bankReconciliation.differences.length} outstanding items need to be reconciled
                    </p>
                  </div>
                </div>

                {/* Outstanding Items */}
                <div>
                  <h4 className="font-semibold mb-3">Outstanding Items</h4>
                  <div className="space-y-2">
                    {bankReconciliation.differences.map((diff, index) => (
                      <Card key={index} className="bg-muted/50 border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{diff.type}</p>
                              <p className="text-xs text-muted-foreground mt-1">{diff.description}</p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-mono font-semibold ${diff.amount < 0 ? "text-red-500" : "text-green-500"}`}
                              >
                                {formatCurrency(Math.abs(diff.amount))}
                              </p>
                              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                Resolve
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget vs Actual Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Budget vs Actual Analysis</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetVsActual.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="text-sm font-mono">{formatCurrency(item.budget)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Actual</p>
                          <p className="text-sm font-mono">{formatCurrency(item.actual)}</p>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="text-xs text-muted-foreground">Variance</p>
                          <p
                            className={`text-sm font-semibold ${item.variance >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {formatCurrency(item.variance)} ({item.variancePercent}%)
                          </p>
                        </div>
                      </div>
                    </div>
                    <Progress value={Math.abs((item.actual / item.budget) * 100)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Reporting Tab */}
        <TabsContent value="tax" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Tax Reports & Compliance</CardTitle>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Filed Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{report.period}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              report.status === "Filed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.dueDate}</TableCell>
                        <TableCell>{report.filedDate || "-"}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(report.amount)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Audit Trail</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Search audit logs..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditTrail.map((log) => (
                  <Card key={log.id} className="bg-muted/50 border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            {log.action === "CREATED" && <Plus className="h-4 w-4 text-primary" />}
                            {log.action === "MODIFIED" && <FileText className="h-4 w-4 text-primary" />}
                            {log.action === "APPROVED" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            {log.action === "RECONCILED" && <Scale className="h-4 w-4 text-purple-500" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {log.action}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {log.entityType}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono">{log.entityId}</span>
                            </div>
                            <p className="text-sm mt-2">{log.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.user} • {log.timestamp} • IP: {log.ipAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceChecks.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {check.status === "COMPLETED" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        {check.status === "IN_PROGRESS" && (
                          <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />
                        )}
                        {check.status === "OVERDUE" && <AlertCircle className="h-5 w-5 text-red-500" />}
                        <div>
                          <p className="text-sm font-medium">{check.check}</p>
                          <p className="text-xs text-muted-foreground">
                            Last: {check.lastChecked} • Frequency: {check.frequency}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Regulatory Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-semibold text-sm">Q1 2024 Financial Report</p>
                        <p className="text-xs text-muted-foreground">Submitted on March 31, 2024</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-semibold text-sm">Anti-Money Laundering Report</p>
                        <p className="text-xs text-muted-foreground">Due by April 15, 2024</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-semibold text-sm">Loan Portfolio Analysis</p>
                        <p className="text-xs text-muted-foreground">Monthly submission</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download All Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Journal Entry Dialog */}
      <Dialog open={showJournalDialog} onOpenChange={setShowJournalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedJournalEntry ? "Journal Entry Details" : "New Journal Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedJournalEntry ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Entry ID</Label>
                    <p className="font-mono text-sm mt-1">{selectedJournalEntry.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Date</Label>
                    <p className="text-sm mt-1">{selectedJournalEntry.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Status</Label>
                    <Badge
                      variant="outline"
                      className={
                        selectedJournalEntry.status === "POSTED"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }
                    >
                      {selectedJournalEntry.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm">Created By</Label>
                    <p className="text-sm mt-1">{selectedJournalEntry.createdBy}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Description</Label>
                  <p className="text-sm mt-1">{selectedJournalEntry.description}</p>
                </div>
                <div>
                  <Label className="text-sm">Reference</Label>
                  <p className="text-sm mt-1 font-mono">{selectedJournalEntry.reference}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm mb-2 block">Journal Lines</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedJournalEntry.entries.map((line, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm">{line.account}</TableCell>
                          <TableCell className="text-right font-mono text-sm text-green-500">
                            {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-red-500">
                            {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="reference">Reference</Label>
                    <Input id="reference" placeholder="REF-2024-001" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter journal entry description" />
                </div>
                <div>
                  <Label className="mb-2 block">Journal Lines</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {chartOfAccounts.map((account) => (
                              <SelectItem key={account.code} value={account.code}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Input type="number" placeholder="Debit" />
                      </div>
                      <div className="col-span-3">
                        <Input type="number" placeholder="Credit" />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Line
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowJournalDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Post Entry</Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* New Account Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Account</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Account Code</Label>
                <Input id="code" placeholder="1000" />
              </div>
              <div>
                <Label htmlFor="type">Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASSET">Asset</SelectItem>
                    <SelectItem value="LIABILITY">Liability</SelectItem>
                    <SelectItem value="EQUITY">Equity</SelectItem>
                    <SelectItem value="REVENUE">Revenue</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="name">Account Name</Label>
              <Input id="name" placeholder="Cash & Bank" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Account description (optional)" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAccountDialog(false)}>
                Cancel
              </Button>
              <Button>Create Account</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
