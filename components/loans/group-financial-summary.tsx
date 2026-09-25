"use client"

import { useState, useEffect } from "react"
import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank, Users, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GroupFinancialSummaryProps {
  className?: string
}

export default function GroupFinancialSummary({ className = "" }: GroupFinancialSummaryProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  // Mock data - in a real app, fetch from API based on selectedGroup
  const [financialData, setFinancialData] = useState({
    totalContributed: 15000,
    totalLentOut: 8500,
    availableBalance: 6500,
    interestEarned: 450,
    totalMembers: 12,
    activeLoans: 5,
  })

  // Mock groups - in a real app, fetch from API
  const groups = [
    { id: "all", name: "All My Groups" },
    { id: "group1", name: "Savings Group A" },
    { id: "group2", name: "Investment Club B" },
    { id: "group3", name: "Community Cooperative" },
  ]

  // Simulate fetching data when group changes
  useEffect(() => {
    // In a real app, this would be an API call
    if (selectedGroup === "group1") {
      setFinancialData({
        totalContributed: 8000,
        totalLentOut: 4500,
        availableBalance: 3500,
        interestEarned: 250,
        totalMembers: 8,
        activeLoans: 3,
      })
    } else if (selectedGroup === "group2") {
      setFinancialData({
        totalContributed: 5000,
        totalLentOut: 3000,
        availableBalance: 2000,
        interestEarned: 150,
        totalMembers: 6,
        activeLoans: 2,
      })
    } else if (selectedGroup === "group3") {
      setFinancialData({
        totalContributed: 2000,
        totalLentOut: 1000,
        availableBalance: 1000,
        interestEarned: 50,
        totalMembers: 4,
        activeLoans: 1,
      })
    } else {
      // All groups combined
      setFinancialData({
        totalContributed: 15000,
        totalLentOut: 8500,
        availableBalance: 6500,
        interestEarned: 450,
        totalMembers: 12,
        activeLoans: 5,
      })
    }
  }, [selectedGroup])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Financial Summary</h2>
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <ArrowUpCircle className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Contributed</h3>
              <p className="text-2xl font-bold">{formatCurrency(financialData.totalContributed)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <ArrowDownCircle className="h-8 w-8 text-orange-500 mb-2" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Lent Out</h3>
              <p className="text-2xl font-bold">{formatCurrency(financialData.totalLentOut)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Wallet className="h-8 w-8 text-blue-500 mb-2" />
              <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
              <p className="text-2xl font-bold">{formatCurrency(financialData.availableBalance)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <PiggyBank className="h-8 w-8 text-purple-500 mb-2" />
              <h3 className="text-sm font-medium text-muted-foreground">Interest Earned</h3>
              <p className="text-2xl font-bold">{formatCurrency(financialData.interestEarned)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Users className="h-8 w-8 text-indigo-500 mb-2" />
              <h3 className="text-sm font-medium text-muted-foreground">Total Members</h3>
              <p className="text-2xl font-bold">{financialData.totalMembers}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <BarChart3 className="h-8 w-8 text-red-500 mb-2" />
              <h3 className="text-sm font-medium text-muted-foreground">Active Loans</h3>
              <p className="text-2xl font-bold">{financialData.activeLoans}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
