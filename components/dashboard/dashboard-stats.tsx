"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Calendar } from "lucide-react"
import { useDashboardStatsSuspense } from "@/hooks/use-dashboard-data"

function formatCurrency(amount: number): string {
  return `K${amount.toLocaleString()}`
}

export function DashboardStats() {
  const { data: stats } = useDashboardStatsSuspense()

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto max-w-sm sm:max-w-none">
      {/* Total Savings */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Total Savings</p>
              <h3 className="mt-1 text-lg sm:text-2xl font-bold truncate">
                {formatCurrency(stats.totalSavings)}
              </h3>
            </div>
            <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <DollarSign className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
            <div className={`flex items-center ${stats.savingsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {stats.savingsChange >= 0 ? (
                <ArrowUpRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
              )}
              <span>{Math.abs(stats.savingsChange)}%</span>
            </div>
            <span className="text-slate-500 text-xs">from last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Groups */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Active Groups</p>
              <h3 className="mt-1 text-lg sm:text-2xl font-bold">{stats.activeGroups}</h3>
            </div>
            <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Users className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
            <div className="flex items-center text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
              <span>{stats.newGroupsThisMonth}</span>
            </div>
            <span className="text-slate-500 text-xs">new this month</span>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Payments */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Up. Payments</p>
              <h3 className="mt-1 text-lg sm:text-2xl font-bold">{stats.upcomingPayments}</h3>
            </div>
            <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Calendar className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
            <div className="flex items-center text-red-500">
              <ArrowDownRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
              <span>{stats.paymentsDueThisWeek}</span>
            </div>
            <span className="text-slate-500 text-xs">due this week</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Members */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">Total Members</p>
              <h3 className="mt-1 text-lg sm:text-2xl font-bold">{stats.totalMembers}</h3>
            </div>
            <div className="flex h-10 sm:h-12 w-10 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <Users className="h-5 sm:h-6 w-5 sm:w-6" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm gap-1 sm:gap-2 flex-wrap">
            <div className="flex items-center text-emerald-500">
              <ArrowUpRight className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />
              <span>{stats.newMembersThisMonth}</span>
            </div>
            <span className="text-slate-500 text-xs">new members</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

