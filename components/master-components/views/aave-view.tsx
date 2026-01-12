"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data for AAVE positions
const mockPositions = [
  {
    id: "1",
    groupId: "group-1",
    groupName: "Village Savings Group",
    spokeAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    healthFactor: 2.45,
    totalSupplied: 15000,
    totalBorrowed: 6000,
    availableToBorrow: 4500,
    netAPY: 3.2,
    liquidationThreshold: 0.75,
    supplies: [
      { asset: "cUSD", amount: 10000, apy: 2.5, ltv: 0.8, balance: 10000, valueUSD: 10000 },
      { asset: "CELO", amount: 100, apy: 3.5, ltv: 0.7, balance: 100, valueUSD: 5000 },
    ],
    borrows: [
      { asset: "cUSD", amount: 5000, apy: 4.2, balance: 5050, valueUSD: 5050 },
      { asset: "CELO", amount: 20, apy: 5.5, balance: 20.5, valueUSD: 950 },
    ],
    recentActivity: [
      { type: "SUPPLY", asset: "cUSD", amount: 2000, date: "2024-03-15T10:30:00", txHash: "0xabc123..." },
      { type: "BORROW", asset: "cUSD", amount: 1000, date: "2024-03-14T14:20:00", txHash: "0xdef456..." },
      { type: "REPAY", asset: "CELO", amount: 5, date: "2024-03-13T09:15:00", txHash: "0xghi789..." },
    ],
  },
  {
    id: "2",
    groupId: "group-2",
    groupName: "Women Empowerment Fund",
    spokeAddress: "0x8e5A88b29A2b844Bc9e7595f0bEb1234567890",
    healthFactor: 1.82,
    totalSupplied: 8000,
    totalBorrowed: 4200,
    availableToBorrow: 1000,
    netAPY: 1.8,
    liquidationThreshold: 0.75,
    supplies: [{ asset: "cUSD", amount: 8000, apy: 2.8, ltv: 0.8, balance: 8000, valueUSD: 8000 }],
    borrows: [{ asset: "cUSD", amount: 4200, apy: 4.5, balance: 4230, valueUSD: 4230 }],
    recentActivity: [
      { type: "SUPPLY", asset: "cUSD", amount: 1000, date: "2024-03-14T11:00:00", txHash: "0xjkl012..." },
      { type: "BORROW", asset: "cUSD", amount: 500, date: "2024-03-12T15:30:00", txHash: "0xmno345..." },
    ],
  },
  {
    id: "3",
    groupId: "group-3",
    groupName: "Business Investment Group",
    spokeAddress: "0x9f6B99c30A3b844Bc9e7595f0bEb2345678901",
    healthFactor: 1.25,
    totalSupplied: 25000,
    totalBorrowed: 18000,
    availableToBorrow: 500,
    netAPY: -0.5,
    liquidationThreshold: 0.75,
    supplies: [
      { asset: "cUSD", amount: 15000, apy: 2.2, ltv: 0.8, balance: 15000, valueUSD: 15000 },
      { asset: "CELO", amount: 200, apy: 3.0, ltv: 0.7, balance: 200, valueUSD: 10000 },
    ],
    borrows: [
      { asset: "cUSD", amount: 12000, apy: 4.8, balance: 12100, valueUSD: 12100 },
      { asset: "CELO", amount: 120, apy: 5.8, balance: 122, valueUSD: 5900 },
    ],
    recentActivity: [
      { type: "BORROW", asset: "cUSD", amount: 3000, date: "2024-03-15T16:45:00", txHash: "0xpqr678..." },
      { type: "SUPPLY", asset: "CELO", amount: 50, date: "2024-03-13T10:20:00", txHash: "0xstu901..." },
    ],
  },
]

// Available assets in the Hub
const hubAssets = [
  { symbol: "cUSD", name: "Celo Dollar", totalLiquidity: 5000000, utilizationRate: 65, supplyAPY: 2.5, borrowAPY: 4.2 },
  { symbol: "CELO", name: "Celo Native", totalLiquidity: 100000, utilizationRate: 58, supplyAPY: 3.2, borrowAPY: 5.5 },
  { symbol: "cEUR", name: "Celo Euro", totalLiquidity: 2000000, utilizationRate: 42, supplyAPY: 2.0, borrowAPY: 3.8 },
]

export function AaveView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [healthFilter, setHealthFilter] = useState("all")
  const [actionDialog, setActionDialog] = useState<{ type: "supply" | "borrow" | "repay" | "withdraw" | null }>({
    type: null,
  })
  const [actionAmount, setActionAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const stats = {
    totalSupplied: mockPositions.reduce((sum, p) => sum + p.totalSupplied, 0),
    totalBorrowed: mockPositions.reduce((sum, p) => sum + p.totalBorrowed, 0),
    activePositions: mockPositions.length,
    avgHealthFactor: (mockPositions.reduce((sum, p) => sum + p.healthFactor, 0) / mockPositions.length).toFixed(2),
    atRiskPositions: mockPositions.filter((p) => p.healthFactor < 1.5).length,
    totalAvailableToBorrow: mockPositions.reduce((sum, p) => sum + p.availableToBorrow, 0),
  }

  const filteredPositions = mockPositions.filter((position) => {
    const matchesSearch =
      position.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.spokeAddress.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesHealth = true
    if (healthFilter === "healthy") matchesHealth = position.healthFactor >= 2.0
    else if (healthFilter === "warning") matchesHealth = position.healthFactor >= 1.5 && position.healthFactor < 2.0
    else if (healthFilter === "critical") matchesHealth = position.healthFactor < 1.5

    return matchesSearch && matchesHealth
  })

  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPositions = filteredPositions.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const getHealthFactorColor = (healthFactor: number) => {
    if (healthFactor >= 2.0) return "text-green-500"
    if (healthFactor >= 1.5) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthFactorBadge = (healthFactor: number) => {
    if (healthFactor >= 2.0)
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Healthy
        </Badge>
      )
    if (healthFactor >= 1.5)
      return (
        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Warning
        </Badge>
      )
    return (
      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Critical
      </Badge>
    )
  }

  const handleAction = (type: "supply" | "borrow" | "repay" | "withdraw") => {
    setActionDialog({ type })
    setActionAmount("")
    setSelectedAsset("")
  }

  const executeAction = () => {
    console.log(`[v0] Executing ${actionDialog.type}: ${actionAmount} ${selectedAsset}`)
    // Here you would call AAVE v4 smart contracts
    setActionDialog({ type: null })
    setActionAmount("")
    setSelectedAsset("")
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Supplied</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalSupplied)}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Assets in AAVE</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Borrowed</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalBorrowed)}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Outstanding debt</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Positions</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.activePositions}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ml-2">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Groups using AAVE</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Health Factor</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.avgHealthFactor}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Overall health</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2">{stats.atRiskPositions}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-lg sm:text-2xl font-bold mt-1 sm:mt-2 truncate">
                  {formatCurrency(stats.totalAvailableToBorrow)}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 ml-2">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 sm:mt-4">Borrow capacity</p>
          </CardContent>
        </Card>
      </div>

      {/* Hub Assets Overview */}
      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-lg md:text-xl">Liquidity Hub Assets</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Available assets and interest rates</p>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Rates
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hubAssets.map((asset) => (
              <Card key={asset.symbol} className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{asset.symbol}</h3>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {asset.utilizationRate}% Utilized
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Supply APY</span>
                      <span className="text-green-500 font-medium">{asset.supplyAPY}%</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Borrow APY</span>
                      <span className="text-orange-500 font-medium">{asset.borrowAPY}%</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Total Liquidity</span>
                      <span className="font-medium">{formatCurrency(asset.totalLiquidity)}</span>
                    </div>
                  </div>
                  <Progress value={asset.utilizationRate} className="mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Positions Table */}
      <Card className="bg-card">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg md:text-xl">Group Positions</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm">
                <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent text-xs sm:text-sm">
                <Filter className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 space-y-3">
            <div className="relative w-full">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground flex-shrink-0" />
              <Input
                placeholder="Search by group or address..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-8 sm:pl-9 text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={healthFilter}
                onValueChange={(value) => {
                  setHealthFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Health Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="healthy">Healthy (≥2.0)</SelectItem>
                  <SelectItem value="warning">Warning (1.5-2.0)</SelectItem>
                  <SelectItem value="critical">Critical (&lt;1.5)</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Group</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Health Factor</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Supplied</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Borrowed</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Available</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Net APY</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Status</TableHead>
                    <TableHead className="whitespace-nowrap text-xs sm:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPositions.map((position) => (
                    <TableRow key={position.id} className="hover:bg-muted/50">
                      <TableCell className="min-w-[200px]">
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{position.groupName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {position.spokeAddress.slice(0, 6)}...{position.spokeAddress.slice(-4)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`font-bold text-sm ${getHealthFactorColor(position.healthFactor)}`}>
                            {position.healthFactor.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(position.totalSupplied)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(position.totalBorrowed)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatCurrency(position.availableToBorrow)}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs sm:text-sm font-medium ${position.netAPY >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {position.netAPY >= 0 ? "+" : ""}
                          {position.netAPY}%
                        </span>
                      </TableCell>
                      <TableCell>{getHealthFactorBadge(position.healthFactor)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.location.href = `/admin/aave/positions/${position.groupId}`
                          }}
                          className="text-xs"
                        >
                          View Details
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {filteredPositions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPositions.length)} of {filteredPositions.length}{" "}
                positions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="h-8 w-8 hidden sm:inline-flex"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                  <span className="text-sm sm:hidden">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
