"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Bell, CheckCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface NotificationsWidgetProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NotificationsWidget({ className, ...props }: NotificationsWidgetProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Loan Payment Due",
      description: "Your loan payment of K 1,200 is due in 5 days.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Feature Available",
      description: "You can now apply for village banking loans directly from your dashboard.",
      time: "Yesterday",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Deposit Successful",
      description: "Your deposit of K 2,500 has been successfully processed.",
      time: "2 days ago",
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "Profile Update Reminder",
      description: "Please complete your profile to unlock higher loan limits.",
      time: "3 days ago",
      read: true,
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card className={cn("border border-border/50 bg-background/80 backdrop-blur-sm", className)} {...props}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Bell className="h-3 w-3" />
              {unreadCount} Unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "p-3 rounded-lg border border-border/50",
                    notification.read ? "bg-background/50" : "bg-primary/5",
                  )}
                >
                  <div className="flex gap-2">
                    {getIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium leading-none">{notification.title}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={markAllAsRead}>
                  Mark All Read
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View All
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No notifications to display</div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

