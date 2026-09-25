"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, ArrowUpFromLine, Copy, ExternalLink, Wallet, RefreshCw, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface WalletOverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function WalletOverview({ className, ...props }: WalletOverviewProps) {
  const [activeTab, setActiveTab] = useState("kwacha")
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The address has been copied to your clipboard.",
      duration: 3000,
    })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const cryptoWallets = [
    { name: "USDT", balance: 2500, usdValue: 2500, change: "+2.3%" },
    { name: "CELO", balance: 75.5, usdValue: 150.25, change: "-1.2%" },
    { name: "BTC", balance: 0.025, usdValue: 1250, change: "+5.7%" },
    { name: "ETH", balance: 0.75, usdValue: 1875, change: "+3.1%" },
  ]

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Wallet Overview</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="kwacha" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="kwacha">Kwacha (ZMW)</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="kwacha" className="space-y-4 mt-0">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available Balance</span>
                    <span className="text-xs text-green-500">+3.5% this month</span>
                  </div>
                  <span className="text-3xl font-bold">K 12,345.67</span>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" className="gap-1 bg-green-500 hover:bg-green-600">
                      <ArrowDownToLine className="h-4 w-4" />
                      Deposit
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <ArrowUpFromLine className="h-4 w-4" />
                      Withdraw
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 p-3 bg-background/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">1234567890</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy("1234567890")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Bank</span>
                    <span className="text-sm">Zambia National Bank</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-xs text-muted-foreground">Last updated: 2 mins ago</span>
                    <Button variant="link" size="sm" className="h-6 p-0 text-xs">
                      View Transactions
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="crypto" className="space-y-4 mt-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Your Crypto Assets</span>
                  <span className="text-sm font-medium">$5,775.25 USD</span>
                </div>

                <div className="space-y-3">
                  {cryptoWallets.map((crypto) => (
                    <div key={crypto.name} className="rounded-lg border border-border/50 p-3 bg-background/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Wallet className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-xs text-muted-foreground">${crypto.usdValue} USD</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {crypto.balance} {crypto.name}
                          </div>
                          <div
                            className={cn("text-xs", crypto.change.startsWith("+") ? "text-green-500" : "text-red-500")}
                          >
                            {crypto.change}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between gap-2">
                  <Button className="flex-1 gap-1 bg-green-500 hover:bg-green-600">
                    <ArrowDownToLine className="h-4 w-4" />
                    Deposit
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1">
                    <ArrowUpFromLine className="h-4 w-4" />
                    Withdraw
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1">
                    <QrCode className="h-4 w-4" />
                    Receive
                  </Button>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

