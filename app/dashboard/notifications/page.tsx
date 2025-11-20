"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { formatDistanceToNow } from "date-fns"
import { Users, Calendar, DollarSign, Bell, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserNotifications, markAllAsRead, markAsRead } from "@/lib/knock"
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions for Knock notifications
interface KnockNotification {
  id: string
  title: string
  body: string
  actor?: {
    id: string
    name: string
  }
  data?: any
  seen_at: string | null
  read_at: string | null
  created_at: string
  updated_at: string
  type?: string
}

interface KnockFeedResponse {
  entries: KnockNotification[]
  page_info: {
    after: string | null
    before: string | null
    page_size: number
  }
  meta: {
    total_count: number
    unseen_count: number
    unread_count: number
  }
}

// Helper function to get the appropriate icon for a notification type
const getNotificationIcon = (type?: string) => {
  switch (type) {
    case "user":
      return <Users className="h-5 w-5" />
    case "payment":
      return <DollarSign className="h-5 w-5" />
    case "event":
      return <Calendar className="h-5 w-5" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

// Helper function to get the appropriate background color for a notification type
const getNotificationColor = (type?: string) => {
  switch (type) {
    case "user":
      return "bg-blue-100 text-blue-700"
    case "payment":
      return "bg-emerald-100 text-emerald-700"
    case "event":
      return "bg-amber-100 text-amber-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default function NotificationsPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [notifications, setNotifications] = useState<KnockNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState<{ total_count: number; unseen_count: number; unread_count: number }>({
    total_count: 0,
    unseen_count: 0,
    unread_count: 0,
  })

  // Fetch notifications when the user is loaded
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isUserLoaded || !user) return

      try {
        setIsLoading(true)
        const response = await getUserNotifications(user.id, {
          page_size: 20,
          status: "all",
        }) as KnockFeedResponse

        setNotifications(response.entries)
        setMeta(response.meta)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // If there's an error, show fallback notifications
        setNotifications([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [user, isUserLoaded])

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user) return

    try {
      await markAllAsRead(user.id)

      // Update local state to reflect all notifications as read
      setNotifications(notifications.map(notification => ({
        ...notification,
        seen_at: notification.seen_at || new Date().toISOString(),
        read_at: new Date().toISOString()
      })))

      setMeta({
        ...meta,
        unseen_count: 0,
        unread_count: 0
      })
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  // Handle marking a single notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      await markAsRead(user.id, notificationId)

      // Update local state to reflect this notification as read
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      ))

      setMeta({
        ...meta,
        unread_count: Math.max(0, meta.unread_count - 1)
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Fallback notifications for when there are no real notifications or during development
  const fallbackNotifications = [
    {
      id: "1",
      title: "New member joined your group",
      body: "Sarah Johnson joined Community Savings Circle",
      type: "user",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      title: "Payment reminder",
      body: "Your monthly contribution of $100 is due in 3 days",
      type: "payment",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: "3",
      title: "Deposit successful",
      body: "Your deposit of $200 to Personal Savings was successful",
      type: "payment",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    },
    {
      id: "4",
      title: "Group meeting scheduled",
      body: "Community Savings Circle has scheduled a meeting for next Friday at 6 PM",
      type: "event",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    },
    {
      id: "5",
      title: "Interest earned",
      body: "You earned $15 in interest on your Personal Savings account",
      type: "payment",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    },
  ]

  // Use fallback notifications if there are no real notifications or during development
  const displayNotifications = notifications.length > 0 ? notifications : fallbackNotifications

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your account activity
            {meta.unread_count > 0 && (
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {meta.unread_count} unread
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={handleMarkAllAsRead} disabled={isLoading || meta.unread_count === 0}>
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 rounded-md border p-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[300px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Bell className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any notifications at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 rounded-md border p-4 ${!notification.read_at ? 'bg-blue-50' : ''}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
