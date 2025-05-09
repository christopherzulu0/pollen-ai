import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, Download, Clock, Plus, ChevronRight } from "lucide-react"

export function OverviewTab() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's your financial summary</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Combined savings and group funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 p-6 text-white">
              <p className="text-sm font-medium">Available Balance</p>
              <h3 className="mt-1 text-3xl font-bold">$5,250.00</h3>
              <div className="mt-2 flex items-center text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span className="rounded-full bg-white/20 px-2 py-0.5">+$500 this month</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Personal Savings</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  $3,250.00
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Group Funds</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  $2,000.00
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your finances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-between bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
              <div className="flex items-center">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Add Funds
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Withdraw Funds
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                Download Statement
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest financial transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">Group Contribution</h4>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  +$100.00
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Family Savings Group</span>
                <span className="font-medium">May 1, 2023</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">Personal Savings</h4>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  +$250.00
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Contribution</span>
                <span className="font-medium">Apr 15, 2023</span>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium">Group Withdrawal</h4>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  -$50.00
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Family Savings Group</span>
                <span className="font-medium">Apr 10, 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 