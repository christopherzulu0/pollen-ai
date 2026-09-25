"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Send } from "lucide-react"

const mockNotifications = [
  {
    id: "1",
    title: "Payment Due Reminder",
    message: "Monthly contribution payment is due in 3 days",
    type: "PAYMENT_DUE",
    recipients: 125,
    status: "sent",
    date: "2024-03-15",
  },
  {
    id: "2",
    title: "New Member Welcome",
    message: "Welcome to our savings group!",
    type: "NEW_MEMBER",
    recipients: 5,
    status: "scheduled",
    date: "2024-03-16",
  },
]

const typeColors = {
  PAYMENT_DUE: "bg-warning text-warning-foreground",
  NEW_MEMBER: "bg-success text-success-foreground",
  SYSTEM: "bg-info text-info-foreground",
}

export function NotificationsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-muted-foreground">Manage system notifications and announcements</p>
        </div>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Notification
        </Button>
      </div>

      <div className="grid gap-4">
        {mockNotifications.map((notification) => (
          <Card key={notification.id} className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <Badge variant="secondary" className={typeColors[notification.type as keyof typeof typeColors]}>
                      {notification.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{notification.recipients} recipients</span>
                    <span>•</span>
                    <span>{notification.date}</span>
                    <span>•</span>
                    <Badge variant="outline">{notification.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
