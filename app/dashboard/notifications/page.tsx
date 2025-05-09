"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Calendar, DollarSign } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your account activity</p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">New member joined your group</h4>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sarah Johnson joined Community Savings Circle
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Payment reminder</h4>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your monthly contribution of $100 is due in 3 days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Deposit successful</h4>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your deposit of $200 to Personal Savings was successful
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Group meeting scheduled</h4>
                    <span className="text-xs text-muted-foreground">2 days ago</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Community Savings Circle has scheduled a meeting for next Friday at 6 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-md border p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Interest earned</h4>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You earned $15 in interest on your Personal Savings account
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}