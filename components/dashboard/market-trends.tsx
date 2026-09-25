"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ExternalLink, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"

interface MarketTrendsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MarketTrends({ className, ...props }: MarketTrendsProps) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  const cryptoMarket = [
    { name: "Bitcoin", symbol: "BTC", price: "$50,123.45", change: "+2.3%", direction: "up" },
    { name: "Ethereum", symbol: "ETH", price: "$2,456.78", change: "+1.7%", direction: "up" },
    { name: "Celo", symbol: "CELO", price: "$1.98", change: "-1.2%", direction: "down" },
    { name: "Tether", symbol: "USDT", price: "$1.00", change: "+0.1%", direction: "up" },
    { name: "Solana", symbol: "SOL", price: "$87.65", change: "+5.4%", direction: "up" },
  ]

  const fiatMarket = [
    { name: "USD/ZMW", price: "K 20.45", change: "-0.3%", direction: "down" },
    { name: "EUR/ZMW", price: "K 22.12", change: "+0.5%", direction: "up" },
    { name: "GBP/ZMW", price: "K 25.67", change: "+0.2%", direction: "up" },
    { name: "CNY/ZMW", price: "K 2.85", change: "-0.1%", direction: "down" },
  ]

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Market Trends</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crypto">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="fiat">Fiat</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-4 mt-0">
            <div className="space-y-2">
              {cryptoMarket.map((crypto, index) => (
                <motion.div
                  key={crypto.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {crypto.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{crypto.price}</div>
                    <div
                      className={cn(
                        "text-xs flex items-center justify-end gap-0.5",
                        crypto.direction === "up" ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {crypto.direction === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {crypto.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Last updated: 2 mins ago</span>
              <Button variant="link" size="sm" className="h-6 p-0 text-xs">
                View All Markets
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="fiat" className="space-y-4 mt-0">
            <div className="space-y-2">
              {fiatMarket.map((currency, index) => (
                <motion.div
                  key={currency.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {currency.name.split("/")[0]}
                    </div>
                    <div className="font-medium">{currency.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{currency.price}</div>
                    <div
                      className={cn(
                        "text-xs flex items-center justify-end gap-0.5",
                        currency.direction === "up" ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {currency.direction === "up" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {currency.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Last updated: 2 mins ago</span>
              <Button variant="link" size="sm" className="h-6 p-0 text-xs">
                View All Rates
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

