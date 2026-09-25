"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeftRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.23,
  ZMW: 25.82,
  KES: 129.45,
  NGN: 1530.67,
  ZAR: 18.76,
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("ZMW")
  const [isConverting, setIsConverting] = useState(false)

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const convertCurrency = (amount: number, from: string, to: string) => {
    // Convert to USD first (if not already USD)
    const amountInUSD = from === "USD" ? amount : amount / exchangeRates[from as keyof typeof exchangeRates]
    // Then convert from USD to target currency
    return to === "USD" ? amountInUSD : amountInUSD * exchangeRates[to as keyof typeof exchangeRates]
  }

  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency)
  const rate = convertCurrency(1, fromCurrency, toCurrency)

  const handleConvert = () => {
    setIsConverting(true)
    setTimeout(() => {
      setIsConverting(false)
    }, 1500)
  }

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency) || currencies[0]
  const toCurrencyData = currencies.find((c) => c.code === toCurrency) || currencies[0]

  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{fromCurrencyData.symbol}</span>
                </div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pl-8 pr-12"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{fromCurrency}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From</label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{currency.flag}</span>
                          <span>
                            {currency.code} - {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center">
                          <span className="mr-2">{currency.flag}</span>
                          <span>
                            {currency.code} - {currency.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={handleSwap} className="rounded-full h-10 w-10">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <Button className="w-full bg-[#003366] hover:bg-[#002244]" onClick={handleConvert} disabled={isConverting}>
              {isConverting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Converting...
                </div>
              ) : (
                <div className="flex items-center">
                  Convert
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <p className="text-lg font-medium">
                  1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                    <span className="text-xl">{fromCurrencyData.flag}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                    <p className="font-medium">{fromCurrencyData.name}</p>
                  </div>
                </div>
                <p className="text-xl font-bold">
                  {fromCurrencyData.symbol}
                  {amount.toFixed(2)}
                </p>
              </div>

              <motion.div
                animate={{
                  y: isConverting ? [0, -20, 20, 0] : 0,
                  opacity: isConverting ? [1, 0, 0, 1] : 1,
                }}
                transition={{ duration: 1.5 }}
                className="flex justify-center my-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#00CC66]/10 flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-[#00CC66]" />
                </div>
              </motion.div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#00CC66]/10 flex items-center justify-center mr-3">
                    <span className="text-xl">{toCurrencyData.flag}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                    <p className="font-medium">{toCurrencyData.name}</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-[#00CC66]">
                  {toCurrencyData.symbol}
                  {convertedAmount.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Our Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex items-center justify-between font-medium mb-2">
                <span>Total Amount</span>
                <span>
                  {toCurrencyData.symbol}
                  {convertedAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center text-xs text-[#00CC66]">
                <Globe className="h-3 w-3 mr-1" />
                <span>No hidden fees, transparent exchange rates</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

