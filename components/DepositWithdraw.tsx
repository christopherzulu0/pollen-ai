import React,{useState, useEffect} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ArrowDownRight, ArrowUpRight, DollarSign, Loader2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { toast } from '@/hooks/use-toast'

interface Group {
  id: string
  name: string
  description: string
  userBalance: number
  totalContributions: number
  contributionAmount: number
}

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number | string | null
  deadline: string | null
}

export default function DepositWithdraw() {
    const [isTransactionInProgress, setIsTransactionInProgress] = useState(false)
    const [walletBalance, setWalletBalance] = useState<number | null>(null)
    const [savingsBalance, setSavingsBalance] = useState<number | null>(null)
    const [groups, setGroups] = useState<Group[]>([])
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBalances = async () => {
            try {
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
                setWalletBalance(data.walletBalance)
                setSavingsBalance(data.savingsBalance)
                setGroups(data.groups)
                setSavingsGoals(data.savingsGoals || [])
            } catch (error) {
                console.error('Error fetching balances:', error)
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to fetch balances and savings goals",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchBalances()
    }, [])

    const formatAmount = (amount: number | string | null | undefined) => {
        if (amount === null || amount === undefined) return '0.00'
        const num = typeof amount === 'string' ? parseFloat(amount) : amount
        return isNaN(num) ? '0.00' : num.toFixed(2)
    }

    const handleDeposit = async (amount: string, account: string, momoNumber: string) => {
        setIsTransactionInProgress(true)
        try {
            // Find if the account is a group or wallet
            const isGroup = account !== "Wallet"
            const accountId = isGroup 
                ? groups.find(group => group.name === account)?.id 
                : 'wallet'

            if (isGroup && !accountId) {
                throw new Error('Group not found')
            }

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: isGroup ? 'CONTRIBUTION' : 'DEPOSIT',
                    accountId,
                    momoNumber,
                    isGroup,
                }),
            })

            if (!response.ok) {
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Deposit failed');
                    } else {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Deposit failed');
                    }
                } catch (parseError) {
                    if (parseError instanceof Error) {
                        throw parseError;
                    }
                    throw new Error('Deposit failed');
                }
            }

            const data = await response.json()

            // Update local state
            if (isGroup) {
                setGroups(prevGroups => 
                    prevGroups.map(group => 
                        group.name === account 
                            ? { 
                                ...group, 
                                userBalance: group.userBalance + parseFloat(amount),
                                totalContributions: group.totalContributions + parseFloat(amount)
                            }
                            : group
                    )
                )
            } else {
                setWalletBalance(prev => (prev || 0) + parseFloat(amount))
            }

          toast({
                title: "Transaction Successful",
                description: `$${amount} has been ${isGroup ? 'contributed to' : 'deposited to'} your ${account} account.`,
            variant: "default",
          })
        } catch (error) {
            console.error('Transaction error:', error)
            toast({
                title: "Transaction Failed",
                description: error instanceof Error ? error.message : "There was an error processing your transaction. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsTransactionInProgress(false)
        }
      }

    const handleWithdraw = async (amount: string, account: string, momoNumber: string) => {
        setIsTransactionInProgress(true)
        try {
            // Determine the type of account
            const isSavingsGoal = savingsGoals.some(goal => goal.name === account)
            const isWallet = account === "Wallet"

            let accountId = 'wallet'
            if (isSavingsGoal) {
                accountId = savingsGoals.find(goal => goal.name === account)?.id || 'wallet'
            }

            if (isSavingsGoal && !accountId) {
                throw new Error('Savings goal not found')
            }

            // Check if there are sufficient funds
            if (isWallet && (walletBalance || 0) < parseFloat(amount)) {
                throw new Error('Insufficient funds in wallet')
            }
            if (isSavingsGoal) {
                const goal = savingsGoals.find(g => g.name === account)
                const goalAmount = goal?.currentAmount ? Number(goal.currentAmount) : 0
                if (goalAmount < parseFloat(amount)) {
                    throw new Error('Insufficient funds in savings goal')
                }
            }

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    type: 'WITHDRAWAL',
                    accountId,
                    momoNumber,
                    isSavingsGoal
                }),
            })

            if (!response.ok) {
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Withdrawal failed');
                    } else {
                        const errorText = await response.text();
                        throw new Error(errorText || 'Withdrawal failed');
                    }
                } catch (parseError) {
                    if (parseError instanceof Error) {
                        throw parseError;
                    }
                    throw new Error('Withdrawal failed');
                }
            }

            const data = await response.json()

            // Update local state
            if (isSavingsGoal) {
                setSavingsGoals(prevGoals => 
                    prevGoals.map(goal => 
                        goal.name === account 
                            ? { 
                                ...goal, 
                                currentAmount: Number(goal.currentAmount || 0) - parseFloat(amount)
                            }
                            : goal
                    )
                )
            } else {
                setWalletBalance(prev => (prev || 0) - parseFloat(amount))
            }

          toast({
            title: "Withdrawal Successful",
            description: `$${amount} has been withdrawn from your ${account} account.`,
            variant: "default",
          })
        } catch (error) {
            console.error('Withdrawal error:', error)
            toast({
                title: "Withdrawal Failed",
                description: error instanceof Error ? error.message : "There was an error processing your withdrawal. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsTransactionInProgress(false)
        }
    }

  return (
     <div className="mx-auto max-w-4xl">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight">Deposit & Withdraw</h1>
                        <p className="text-muted-foreground">Manage your funds with Mobile Money (MOMO)</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-600 pb-6 text-white">
                          <CardTitle>Deposit Funds</CardTitle>
                          <CardDescription className="text-teal-100">
                            Add money to your account using Mobile Money
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                handleDeposit(
                                    formData.get("amount") as string,
                                    formData.get("account") as string,
                                    formData.get("momoNumber") as string,
                                )
                            }}
                            className="space-y-4"
                        >
                            <div>
                              <Label htmlFor="deposit-account">Select Account</Label>
                                <Select name="account" defaultValue="Wallet">
                                <SelectTrigger id="deposit-account" className="mt-1">
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                        <SelectItem value="Wallet">Wallet</SelectItem>
                                        {groups.map((group) => (
                                            <SelectItem key={group.id} value={group.name}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="deposit-amount">Amount</Label>
                              <div className="relative mt-1">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                  id="deposit-amount"
                                        name="amount"
                                  placeholder="0.00"
                                  className="pl-10"
                                  type="number"
                                  step="0.01"
                                  min="1"
                                        required
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="deposit-momo">Mobile Money Number</Label>
                                <Input 
                                    id="deposit-momo" 
                                    name="momoNumber" 
                                    placeholder="Enter your MOMO number" 
                                    className="mt-1"
                                    required 
                                />
                            </div>
                            <Button
                                type="submit"
                              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                                disabled={isTransactionInProgress}
                            >
                                {isTransactionInProgress ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Deposit Now"
                                )}
                            </Button>
                        </form>
                        </CardContent>
                      </Card>

                      <Card className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 pb-6 text-white">
                          <CardTitle>Withdraw Funds</CardTitle>
                          <CardDescription className="text-amber-100">
                            Withdraw money to your Mobile Money account
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                handleWithdraw(
                                    formData.get("amount") as string,
                                    formData.get("account") as string,
                                    formData.get("momoNumber") as string,
                                )
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="withdraw-account">Select Account</Label>
                                <Select name="account" defaultValue="Wallet">
                                    <SelectTrigger id="withdraw-account" className="mt-1">
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                        <SelectItem value="Wallet">Wallet</SelectItem>
                                        {savingsGoals.map((goal) => (
                                            <SelectItem key={goal.id} value={goal.name}>
                                                {goal.name} (K {formatAmount(goal.currentAmount)})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                                <Label htmlFor="withdraw-amount">Amount</Label>
                              <div className="relative mt-1">
                                <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                        id="withdraw-amount"
                                        name="amount"
                                  placeholder="0.00"
                                  className="pl-10"
                                  type="number"
                                  step="0.01"
                                  min="1"
                                        required
                                />
                              </div>
                            </div>
                            <div>
                                <Label htmlFor="withdraw-momo">Mobile Money Number</Label>
                                <Input 
                                    id="withdraw-momo" 
                                    name="momoNumber" 
                                    placeholder="Enter your MOMO number" 
                                    className="mt-1"
                                    required 
                                />
                            </div>
                            <Button
                                type="submit"
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                                disabled={isTransactionInProgress}
                            >
                                {isTransactionInProgress ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Withdraw Now"
                                )}
                            </Button>
                        </form>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your recent deposit and withdrawal activity</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-md bg-muted p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                <ArrowUpRight className="h-5 w-5" />
                              </div>
                              <div>
                                    <p className="font-medium">Deposit to Wallet</p>
                                <p className="text-sm text-muted-foreground">Apr 15, 2023 • MOMO: *****1234</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              >
                                Completed
                              </Badge>
                              <p className="font-medium text-emerald-600 dark:text-emerald-400">+$200.00</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-md bg-muted p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                <ArrowDownRight className="h-5 w-5" />
                              </div>
                              <div>
                                    <p className="font-medium">Withdrawal from Wallet</p>
                                <p className="text-sm text-muted-foreground">Apr 10, 2023 • MOMO: *****1234</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                              >
                                Completed
                              </Badge>
                              <p className="font-medium text-amber-600 dark:text-amber-400">-$100.00</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline">View All Transactions</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
  )
}
