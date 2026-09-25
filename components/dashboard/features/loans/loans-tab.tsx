"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Shield,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Wallet,
  Coins,
  LineChart,
  ArrowLeftRight,
  Info,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { WalletSetup } from "./wallet-setup"

interface LoanPosition {
  id: string
  asset: string
  collateral: string
  borrowed: string
  interestRate: string
  healthFactor: string
  liquidationThreshold: string
  ltv: string
}

interface AaveAccountData {
  totalCollateral: string
  totalDebt: string
  availableBorrows: string
  healthFactor: string
  ltv: string
}

export function LoansTab() {
  const [showDepositDialog, setShowDepositDialog] = useState(false)
  const [showBorrowDialog, setShowBorrowDialog] = useState(false)
  const [showRepayDialog, setShowRepayDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState("cUSD")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Check wallet configuration
  const { data: walletStatus, isLoading: isLoadingWallet, refetch: refetchWallet } = useQuery({
    queryKey: ['walletSetup'],
    queryFn: async () => {
      const response = await fetch("/api/wallet/setup")
      if (!response.ok) {
        throw new Error("Failed to check wallet")
      }
      return response.json()
    }
  })

  // Fetch Aave account data
  const { data: accountData, isLoading: isLoadingAccount } = useQuery<AaveAccountData>({
    queryKey: ['aaveAccount'],
    queryFn: async () => {
      const response = await fetch("/api/aave/account")
      if (!response.ok) {
        throw new Error("Failed to fetch account data")
      }
      return response.json()
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  // Fetch loan positions
  const { data: positions, isLoading: isLoadingPositions } = useQuery<LoanPosition[]>({
    queryKey: ['loanPositions'],
    queryFn: async () => {
      const response = await fetch("/api/aave/positions")
      if (!response.ok) {
        throw new Error("Failed to fetch positions")
      }
      return response.json()
    }
  })

  // Deposit mutation
  const depositMutation = useMutation({
    mutationFn: async ({ asset, amount }: { asset: string; amount: string }) => {
      const response = await fetch("/api/aave/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset, amount }),
      })
      if (!response.ok) throw new Error("Failed to deposit")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aaveAccount'] })
      queryClient.invalidateQueries({ queryKey: ['loanPositions'] })
      setShowDepositDialog(false)
      toast({
        title: "Deposit Successful",
        description: "Your collateral has been deposited to Aave",
      })
    },
    onError: (error) => {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Borrow mutation
  const borrowMutation = useMutation({
    mutationFn: async ({ asset, amount, interestRateMode }: { asset: string; amount: string; interestRateMode: 1 | 2 }) => {
      const response = await fetch("/api/aave/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset, amount, interestRateMode }),
      })
      if (!response.ok) throw new Error("Failed to borrow")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aaveAccount'] })
      queryClient.invalidateQueries({ queryKey: ['loanPositions'] })
      setShowBorrowDialog(false)
      toast({
        title: "Borrow Successful",
        description: "Funds have been borrowed from Aave",
      })
    },
    onError: (error) => {
      toast({
        title: "Borrow Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Repay mutation
  const repayMutation = useMutation({
    mutationFn: async ({ asset, amount, rateMode }: { asset: string; amount: string; rateMode: 1 | 2 }) => {
      const response = await fetch("/api/aave/repay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset, amount, rateMode }),
      })
      if (!response.ok) throw new Error("Failed to repay")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aaveAccount'] })
      queryClient.invalidateQueries({ queryKey: ['loanPositions'] })
      setShowRepayDialog(false)
      toast({
        title: "Repayment Successful",
        description: "Your loan has been repaid",
      })
    },
    onError: (error) => {
      toast({
        title: "Repayment Failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()
    depositMutation.mutate({ asset: selectedAsset, amount })
  }

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault()
    borrowMutation.mutate({ asset: selectedAsset, amount, interestRateMode: 2 })
  }

  const handleRepay = (e: React.FormEvent) => {
    e.preventDefault()
    repayMutation.mutate({ asset: selectedAsset, amount, rateMode: 2 })
  }

  const getHealthFactorColor = (hf: string) => {
    const value = parseFloat(hf)
    if (value >= 2) return "text-emerald-600 bg-emerald-50"
    if (value >= 1.5) return "text-green-600 bg-green-50"
    if (value >= 1.1) return "text-amber-600 bg-amber-50"
    return "text-red-600 bg-red-50"
  }

  const getHealthFactorStatus = (hf: string) => {
    const value = parseFloat(hf)
    if (value >= 2) return "Excellent"
    if (value >= 1.5) return "Good"
    if (value >= 1.1) return "Fair"
    return "At Risk"
  }

  if (isLoadingWallet || isLoadingAccount || isLoadingPositions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Aave data...</p>
        </div>
      </div>
    )
  }

  // Show wallet setup if not configured
  if (walletStatus && !walletStatus.configured) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">DeFi Loans</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Borrow and lend crypto assets with Aave on Celo
          </p>
          
          {/* Demo Mode Banner */}
          <div className="mt-4 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-1">Demo Mode Active</h3>
                <p className="text-sm text-yellow-800">
                  Aave V3 is not yet deployed on Celo. All transactions are simulated for demonstration purposes.
                  Transaction data is stored locally but no blockchain transactions occur.
                  {" "}
                  <a 
                    href="/AAVE_CELO_STATUS.md" 
                    target="_blank"
                    className="underline hover:text-yellow-900 font-medium"
                  >
                    Learn more →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
          <WalletSetup onWalletConfigured={() => refetchWallet()} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DeFi Loans</h1>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              Powered by Aave
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Borrow and lend crypto assets with Aave on Celo
          </p>
        </div>

        {/* Account Overview */}
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Shield className="mr-2 h-5 w-5 text-emerald-500" />
                  Total Collateral
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  ${accountData?.totalCollateral || "0.00"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">Your deposited assets</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <DollarSign className="mr-2 h-5 w-5 text-red-500" />
                  Total Debt
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  ${accountData?.totalDebt || "0.00"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">Your borrowed amount</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Wallet className="mr-2 h-5 w-5 text-blue-500" />
                  Available to Borrow
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  ${accountData?.availableBorrows || "0.00"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">Based on collateral</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <Card className={`border-l-4 ${accountData ? getHealthFactorColor(accountData.healthFactor) : 'border-l-gray-500'}`}>
              <CardHeader className="pb-2 p-4 sm:p-6">
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Health Factor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {accountData?.healthFactor || "N/A"}
                </h3>
                <Badge className={`mt-2 ${accountData ? getHealthFactorColor(accountData.healthFactor) : ''}`}>
                  {accountData ? getHealthFactorStatus(accountData.healthFactor) : "No Debt"}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Health Factor Warning */}
        {accountData && parseFloat(accountData.healthFactor) < 1.5 && parseFloat(accountData.healthFactor) > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-900">Health Factor Warning</p>
                <p className="text-sm text-amber-800 mt-1">
                  Your health factor is below 1.5. Consider adding more collateral or repaying some debt to avoid liquidation.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-6 sm:mb-8">
          <Button
            className="h-auto py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            onClick={() => setShowDepositDialog(true)}
          >
            <ArrowDownRight className="mr-2 h-5 w-5" />
            Deposit Collateral
          </Button>
          <Button
            className="h-auto py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            onClick={() => setShowBorrowDialog(true)}
            disabled={!accountData || parseFloat(accountData.availableBorrows) <= 0}
          >
            <Coins className="mr-2 h-5 w-5" />
            Borrow Funds
          </Button>
          <Button
            className="h-auto py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            onClick={() => setShowRepayDialog(true)}
            disabled={!accountData || parseFloat(accountData.totalDebt) <= 0}
          >
            <ArrowUpRight className="mr-2 h-5 w-5" />
            Repay Loan
          </Button>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-6">
            {positions && positions.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                {positions.map((position) => (
                  <Card key={position.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{position.asset}</CardTitle>
                        <Badge>Active</Badge>
                      </div>
                      <CardDescription>Collateralized Position</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Collateral</span>
                          <span className="font-medium">${position.collateral}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Borrowed</span>
                          <span className="font-medium">${position.borrowed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Interest Rate</span>
                          <span className="font-medium">{position.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Health Factor</span>
                          <Badge className={getHealthFactorColor(position.healthFactor)}>
                            {position.healthFactor}
                          </Badge>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>LTV</span>
                            <span>{position.ltv}%</span>
                          </div>
                          <Progress value={parseFloat(position.ltv)} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowRepayDialog(true)}>
                        Repay
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowBorrowDialog(true)}>
                        Borrow More
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Active Positions</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by depositing collateral to borrow funds
                  </p>
                  <Button onClick={() => setShowDepositDialog(true)}>
                    <ArrowDownRight className="mr-2 h-4 w-4" />
                    Deposit Collateral
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="markets" className="mt-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Available Markets</CardTitle>
                  <CardDescription>Current lending and borrowing rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { asset: "cUSD", deposit: "2.5%", borrow: "4.2%", available: "$1.2M" },
                      { asset: "CELO", deposit: "3.1%", borrow: "5.8%", available: "$850K" },
                      { asset: "cEUR", deposit: "2.8%", borrow: "4.5%", available: "$620K" },
                    ].map((market) => (
                      <div key={market.asset} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{market.asset}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Available: {market.available}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Deposit APY</p>
                              <p className="font-medium text-emerald-600">{market.deposit}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Borrow APY</p>
                              <p className="font-medium text-red-600">{market.borrow}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">About Aave Rates</h4>
                      <p className="text-sm text-purple-800">
                        Interest rates are algorithmically determined based on supply and demand. 
                        Rates update in real-time as market conditions change.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent Aave transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  No transaction history yet
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <DepositDialog 
          open={showDepositDialog}
          onOpenChange={setShowDepositDialog}
          onSubmit={handleDeposit}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          amount={amount}
          setAmount={setAmount}
          isLoading={depositMutation.isPending}
        />

        <BorrowDialog
          open={showBorrowDialog}
          onOpenChange={setShowBorrowDialog}
          onSubmit={handleBorrow}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          amount={amount}
          setAmount={setAmount}
          isLoading={borrowMutation.isPending}
          availableToBorrow={accountData?.availableBorrows || "0"}
        />

        <RepayDialog
          open={showRepayDialog}
          onOpenChange={setShowRepayDialog}
          onSubmit={handleRepay}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          amount={amount}
          setAmount={setAmount}
          isLoading={repayMutation.isPending}
          totalDebt={accountData?.totalDebt || "0"}
        />
      </div>
    </div>
  )
}

// Dialog Components
function DepositDialog({ open, onOpenChange, onSubmit, selectedAsset, setSelectedAsset, amount, setAmount, isLoading }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Collateral</DialogTitle>
          <DialogDescription>
            Deposit assets to use as collateral for borrowing
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cUSD">cUSD - Celo Dollar</SelectItem>
                  <SelectItem value="CELO">CELO</SelectItem>
                  <SelectItem value="cEUR">cEUR - Celo Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Depositing..." : "Deposit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function BorrowDialog({ open, onOpenChange, onSubmit, selectedAsset, setSelectedAsset, amount, setAmount, isLoading, availableToBorrow }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrow Funds</DialogTitle>
          <DialogDescription>
            Borrow against your collateral (Available: ${availableToBorrow})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cUSD">cUSD - Celo Dollar</SelectItem>
                  <SelectItem value="CELO">CELO</SelectItem>
                  <SelectItem value="cEUR">cEUR - Celo Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Borrowing..." : "Borrow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function RepayDialog({ open, onOpenChange, onSubmit, selectedAsset, setSelectedAsset, amount, setAmount, isLoading, totalDebt }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Repay Loan</DialogTitle>
          <DialogDescription>
            Repay your borrowed funds (Total Debt: ${totalDebt})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cUSD">cUSD - Celo Dollar</SelectItem>
                  <SelectItem value="CELO">CELO</SelectItem>
                  <SelectItem value="cEUR">cEUR - Celo Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Repaying..." : "Repay"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

