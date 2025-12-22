"use client"

import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import ActivityFeed from "./activity-feed"
import { toast } from "sonner"
import { formatErrorForToast } from "@/lib/error-messages"

interface Activity {
  id: string
  type: string
  user: {
    name: string
    avatar: string | null
  }
  description: string
  time: string
  status: string
  group: string
}

async function fetchActivities(groupId?: string, type?: string): Promise<Activity[]> {
  const params = new URLSearchParams()
  if (groupId) params.set("groupId", groupId)
  if (type && type !== "all") params.set("type", type)

  // Construct absolute URL for SSR compatibility
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/activities${params.toString() ? `?${params.toString()}` : ""}`

  const response = await fetch(url)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to fetch activities")
  }

  return response.json()
}

interface ActivityFeedDataProps {
  groupId?: string
  type?: string
}

export function ActivityFeedData({ groupId, type }: ActivityFeedDataProps) {
  const { data: activities = [] } = useSuspenseQuery({
    queryKey: ["activities", groupId, type],
    queryFn: () => fetchActivities(groupId, type),
    staleTime: 30000, // 30 seconds
  })

  return <ActivityFeed activities={activities} />
}

// Non-suspense version with error handling
export function ActivityFeedWithFetch({ groupId, type }: ActivityFeedDataProps) {
  const {
    data: activities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activities", groupId, type],
    queryFn: () => fetchActivities(groupId, type),
    staleTime: 30000,
  })

  if (error) {
    const errorInfo = formatErrorForToast(error, "fetch")
    toast.error(errorInfo.title, {
      description: errorInfo.description,
    })
  }

  return <ActivityFeed activities={activities} isLoading={isLoading} error={error ? String(error) : undefined} />
}

