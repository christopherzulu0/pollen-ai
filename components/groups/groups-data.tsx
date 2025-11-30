"use client"

import { useSuspenseQuery, QueryErrorResetBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"
import { GroupsClient } from "./groups-client"
import { GroupsError } from "./groups-error"
import type { GroupWithDetails } from "@/lib/types/groups"

async function fetchGroups(params?: {
  search?: string
  privacy?: string
  status?: string
}): Promise<GroupWithDetails[]> {
  const queryParams = new URLSearchParams()
  
  if (params?.search) queryParams.set("search", params.search)
  if (params?.privacy) queryParams.set("privacy", params.privacy)
  if (params?.status) queryParams.set("status", params.status)

  // Use absolute URL for both client and server
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const url = `${baseUrl}/api/groups/browse${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  
  const response = await fetch(url, {
    cache: "no-store",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to fetch groups (${response.status})`)
  }

  return response.json()
}

interface GroupsDataProps {
  initialParams?: {
    search?: string
    privacy?: string
    status?: string
  }
}

function GroupsDataInner({ initialParams }: GroupsDataProps) {
  const { data: groups } = useSuspenseQuery({
    queryKey: ["groups", "browse", initialParams],
    queryFn: () => fetchGroups(initialParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 2, // Retry failed requests twice
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })

  return <GroupsClient initialGroups={groups} />
}

export function GroupsData({ initialParams }: GroupsDataProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <GroupsError error={error} reset={resetErrorBoundary} />
          )}
        >
          <GroupsDataInner initialParams={initialParams} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

