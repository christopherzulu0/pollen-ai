"use client"

import { useState, useEffect } from "react"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import ActivityFeed from "./activity-feed"
import { ActivityFeedSkeleton } from "./activity-feed-skeleton"
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

  const url = `/api/activities${params.toString() ? `?${params.toString()}` : ""}`
  const response = await fetch(url)

  if (!response.ok) {
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch activities")
    }
    throw new Error(`Failed to fetch activities (${response.status})`)
  }

  const contentType = response.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    throw new Error("Invalid response format from server")
  }

  return response.json()
}

interface ActivityFeedDataProps {
  groupId?: string
  type?: string
}

export function ActivityFeedData({ groupId, type }: ActivityFeedDataProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <ActivityFeedSkeleton />
  }

  return <ActivityFeedDataContent groupId={groupId} type={type} />
}

function ActivityFeedDataContent({ groupId, type }: ActivityFeedDataProps) {
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

