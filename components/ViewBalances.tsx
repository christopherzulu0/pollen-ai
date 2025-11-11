'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { ArrowUpRight, Badge, Calendar, ChevronRight, DollarSign, Download, Users, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Input } from './ui/input'

interface Group {
  id: string
  name: string
  description: string
  createdAt: string | Date
  status: string
  totalContributions: number
  userBalance: number
  nextContributionDate: string | Date
  contributionAmount: number
}

interface BalanceData {
  walletBalance: number | null
  savingsBalance: number | null
  groups: Group[]
}

export default function ViewBalances() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [contributionAmount, setContributionAmount] = useState('')
  const queryClient = useQueryClient()

  const { data: balanceData, isLoading } = useQuery<BalanceData>({
    queryKey: ['balances'],
    queryFn: async () => {
      const response = await fetch('/api/balances')
      if (!response.ok) {
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch balances');
          } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to fetch balances');
          }
        } catch (parseError) {
          if (parseError instanceof Error) {
            throw parseError;
          }
          throw new Error('Failed to fetch balances');
        }
      }
      const data = await response.json()
      console.log('Balance data:', data)
      return data
    }
  })

  useEffect(() => {
    if (balanceData?.groups && balanceData.groups.length > 0 && !selectedGroup) {
      setSelectedGroup(balanceData.groups[0])
    }
  }, [balanceData, selectedGroup])

  // Calculate total contributions across all groups
  const totalContributions = useMemo(() => {
    if (!balanceData?.groups) return 0
    return balanceData.groups.reduce((total, group) => {
      return total + (group.totalContributions || 0)
    }, 0)
  }, [balanceData])

  // Calculate your total contributions across all groups
  const yourTotalContributions = useMemo(() => {
    if (!balanceData?.groups) return 0
    return balanceData.groups.reduce((total, group) => {
      return total + (group.userBalance || 0)
    }, 0)
  }, [balanceData])

  const makeContribution = useMutation({
    mutationFn: async ({ groupId, amount }: { groupId: string; amount: number }) => {
      const response = await fetch(`/api/groups/${groupId}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })
      if (!response.ok) throw new Error('Failed to make contribution')
      return response.json()
    },
    onSuccess: () => {
      toast.success('Contribution made successfully')
      setContributionAmount('')
      queryClient.invalidateQueries({ queryKey: ['balances'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleContribution = () => {
    if (!selectedGroup || !contributionAmount) return
    const amount = parseFloat(contributionAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    makeContribution.mutate({ groupId: selectedGroup.id, amount })
  }

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'Not set'
    try {
      return format(new Date(date), 'MMMM d, yyyy')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  const calculateDaysRemaining = (date: string | Date | null | undefined) => {
    if (!date) return 0
    try {
      const nextDate = new Date(date)
      const now = new Date()
      const diffTime = nextDate.getTime() - now.getTime()
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    } catch (error) {
      console.error('Error calculating days remaining:', error)
      return 0
    }
  }

  const formatAmount = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return '0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return isNaN(num) ? '0.00' : num.toFixed(2)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account Balances</h1>
            <p className="text-muted-foreground">View and manage your financial accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                <SelectItem value="personal">Personal Only</SelectItem>
                <SelectItem value="groups">Groups Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Main Balance Cards */}
          <Card className="overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg transition-all hover:shadow-xl">
            <CardContent className="p-6">
              <div className="mb-1 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-teal-100" />
                <h3 className="text-sm font-medium text-teal-100">Wallet Balance</h3>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                K {Number(balanceData?.walletBalance ?? 0).toFixed(2)}
              </p>
              <div className="mt-3 flex items-center text-xs">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span className="font-medium">+K150.00</span>
                <span className="ml-1 text-teal-100">this month</span>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  Quick Transfer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-all hover:shadow-xl">
            <CardContent className="p-6">
              <div className="mb-1 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blue-100" />
                <h3 className="text-sm font-medium text-blue-100">Savings Balance</h3>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                K {formatAmount(balanceData?.savingsBalance)}
              </p>
              <div className="mt-3 flex items-center text-xs">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span className="font-medium">+K 350.00</span>
                <span className="ml-1 text-blue-100">this month</span>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg transition-all hover:shadow-xl">
            <CardContent className="p-6">
              <div className="mb-1 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-100" />
                <h3 className="text-sm font-medium text-purple-100">Circle Balances</h3>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                K {Number(totalContributions).toFixed(2)}
              </p>
              <div className="mt-3 flex items-center text-xs">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span className="font-medium">Your total contributions: K  {Number(totalContributions).toFixed(2)}</span>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                  View Groups
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Select a Circle</CardTitle>
                <CardDescription>View detailed group information</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-4">
                  {balanceData?.groups.map((group) => (
                    <Button
                      key={group.id}
                      variant="outline"
                      className={`w-full justify-between ${
                        selectedGroup?.id === group.id
                          ? 'border-2 border-teal-500 bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-900'
                          : 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950'
                      }`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-800">
                          <Users className="h-4 w-4 text-teal-700 dark:text-teal-300" />
                        </div>
                        <span>{group.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedGroup?.name || 'Select a group'}</CardTitle>
                    <CardDescription>
                      {selectedGroup ? `Created on ${formatDate(selectedGroup.createdAt)}` : ''}
                    </CardDescription>
                  </div>
                  {selectedGroup && (
                    <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                      {selectedGroup.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              {selectedGroup && (
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-teal-100 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950">
                      <h3 className="mb-1 text-sm font-medium text-teal-800 dark:text-teal-300">
                        Your Balance
                      </h3>
                      <p className="text-2xl font-bold text-teal-900 dark:text-teal-200">
                        K {selectedGroup ? Number(selectedGroup.userBalance).toFixed(2) : "0.00"}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-teal-700 dark:text-teal-400">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        <span>Your contributions to {selectedGroup?.name || "the group"}</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                      <h3 className="mb-1 text-sm font-medium text-blue-800 dark:text-blue-300">
                        Group Total
                      </h3>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                        K {Number(selectedGroup?.totalContributions ?? 0).toFixed(2)}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-blue-700 dark:text-blue-400">
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                        <span>+K 2,400.00 this month</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Balance Details</h3>
                    <div className="overflow-hidden rounded-lg border">
                      <table className="w-full">
                        <tbody className="divide-y">
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium">Initial Contribution</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              {Number(selectedGroup?.contributionAmount ?? 0).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium">Monthly Contributions</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              K 600.00
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium">Interest Earned</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              K 120.00
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm font-medium">Late Fees Paid</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-red-600 dark:text-red-400">
                              -K 20.00
                            </td>
                          </tr>
                          <tr className="bg-muted">
                            <td className="px-4 py-3 text-sm font-bold">Total Balance</td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              K {Number(selectedGroup?.userBalance ?? 0).toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-3 font-medium">Upcoming Payments</h3>
                      <div className="flex items-center justify-between rounded-md bg-amber-50 p-3 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Monthly Contribution</p>
                            <p className="text-xs">
                              Due on {formatDate(selectedGroup.nextContributionDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">K {formatAmount(selectedGroup?.contributionAmount)}</p>
                          {selectedGroup.nextContributionDate && (
                            <p className="text-xs">
                              {calculateDaysRemaining(selectedGroup.nextContributionDate)} days remaining
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium">Make a Contribution</h3>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={contributionAmount}
                          onChange={(e) => setContributionAmount(e.target.value)}
                          className="max-w-[200px]"
                        />
                        <Button 
                          onClick={handleContribution}
                          disabled={makeContribution.isPending || !contributionAmount}
                          className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                        >
                          {makeContribution.isPending ? 'Processing...' : 'Contribute'}
                        </Button>
                      </div>
                      {selectedGroup?.contributionAmount && (
                        <p className="text-sm text-muted-foreground">
                          Suggested amount: K {formatAmount(selectedGroup?.contributionAmount)}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline">Download Statement</Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
