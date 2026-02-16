import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { MeetingMinutes } from "@/lib/actions/minutes"

async function fetchMeetingMinutes(meetingId: string): Promise<MeetingMinutes | null> {
  const response = await fetch(`/api/meetings/${meetingId}/minutes`)
  if (!response.ok) {
    if (response.status === 403) return null
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch minutes")
  }
  return response.json()
}

interface SaveMinutesParams {
  meetingId: string
  minutesText?: string | null
  minutesFileUrl?: string | null
  minutesKeyDecisions?: string[]
  minutesActionItems?: string[]
  minutesActionItemsCompleted?: boolean[]
}

async function saveMinutesRequest({
  meetingId,
  minutesText,
  minutesFileUrl,
  minutesKeyDecisions,
  minutesActionItems,
  minutesActionItemsCompleted,
}: SaveMinutesParams) {
  const response = await fetch(`/api/meetings/${meetingId}/minutes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...(minutesText !== undefined && { minutesText }),
      ...(minutesFileUrl !== undefined && { minutesFileUrl }),
      ...(minutesKeyDecisions !== undefined && { minutesKeyDecisions }),
      ...(minutesActionItems !== undefined && { minutesActionItems }),
      ...(minutesActionItemsCompleted !== undefined && { minutesActionItemsCompleted }),
    }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to save minutes")
  }
  return response.json()
}

export function useMeetingMinutes(meetingId: string | null) {
  return useQuery({
    queryKey: ["meeting-minutes", meetingId],
    queryFn: () => fetchMeetingMinutes(meetingId!),
    enabled: !!meetingId,
  })
}

export function useSaveMeetingMinutes(meetingId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      minutesText?: string | null
      minutesFileUrl?: string | null
      minutesKeyDecisions?: string[]
      minutesActionItems?: string[]
      minutesActionItemsCompleted?: boolean[]
    }) =>
      saveMinutesRequest({
        meetingId: meetingId!,
        ...data,
      }),
    onSuccess: () => {
      if (meetingId) {
        queryClient.invalidateQueries({ queryKey: ["meeting-minutes", meetingId] })
        queryClient.invalidateQueries({ queryKey: ["meetings"] })
      }
    },
  })
}
