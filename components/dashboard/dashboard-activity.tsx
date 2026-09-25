"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, CreditCard, Users, ChevronRight, Info } from "lucide-react"
import { useActivitiesSuspense, type RecentActivity } from "@/hooks/use-dashboard-data"

function getActivityIcon(type: RecentActivity['type']) {
  switch (type) {
    case 'deposit':
      return <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-emerald-600" />
    case 'withdrawal':
      return <CreditCard className="h-4 sm:h-5 w-4 sm:w-5 text-red-600" />
    case 'member_joined':
      return <Users className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
    case 'info':
      return <Info className="h-4 sm:h-5 w-4 sm:w-5 text-slate-600" />
    default:
      return <Info className="h-4 sm:h-5 w-4 sm:w-5 text-slate-600" />
  }
}

function getActivityTitle(type: RecentActivity['type']) {
  switch (type) {
    case 'deposit':
      return "Deposit Made"
    case 'withdrawal':
      return "Withdrawal"
    case 'member_joined':
      return "New Member"
    case 'info':
      return "Welcome!"
    default:
      return "Activity"
  }
}

export function ActivityFeed() {
  const { data: activities } = useActivitiesSuspense()

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-2 sm:pt-4">
        <div className="space-y-2 sm:space-y-4">
          {activities.recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-2 sm:gap-4 rounded-lg border p-2 sm:p-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-8 sm:h-10 w-8 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-medium text-sm truncate">
                    {getActivityTitle(activity.type)}
                  </h4>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {activity.date}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500 flex-wrap">
                  <span className="truncate">{activity.user}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="truncate">{activity.group}</span>
                  {activity.amount !== undefined && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <span
                        className={`flex-shrink-0 ${
                          activity.type === "deposit" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {activity.type === "deposit" ? "+" : "-"}K{activity.amount.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full justify-between text-xs sm:text-sm">
            View All Activities
            <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

