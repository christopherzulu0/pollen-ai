import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { MeetingGoal } from "@/lib/actions/goals"

async function fetchMeetingGoals(meetingId: string): Promise<MeetingGoal[]> {
  const response = await fetch(`/api/meetings/${meetingId}/goals`)
  if (!response.ok) {
    if (response.status === 403) return []
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch goals")
  }
  const data = await response.json()
  return data.goals ?? []
}

interface CreateGoalParams {
  meetingId: string
  name: string
  targetAmount: number
  currentAmount?: number
  deadline?: string | null
  description?: string | null
}

async function createGoalRequest({
  meetingId,
  name,
  targetAmount,
  currentAmount,
  deadline,
  description,
}: CreateGoalParams) {
  const response = await fetch(`/api/meetings/${meetingId}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      targetAmount,
      currentAmount: currentAmount ?? 0,
      deadline: deadline ?? null,
      description: description ?? null,
    }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to create goal")
  }
  return response.json()
}

export function useMeetingGoals(meetingId: string | null) {
  return useQuery({
    queryKey: ["meeting-goals", meetingId],
    queryFn: () => fetchMeetingGoals(meetingId!),
    enabled: !!meetingId,
  })
}

export function useCreateGoal(meetingId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      meetingId: string
      name: string
      targetAmount: number
      currentAmount?: number
      deadline?: string | null
      description?: string | null
    }) => createGoalRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meeting-goals", variables.meetingId] })
      queryClient.invalidateQueries({ queryKey: ["meetings"] })
    },
  })
}

async function contributeRequest(goalId: string, amount: number) {
  const response = await fetch(`/api/goals/${goalId}/contribute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to contribute")
  }
  return response.json()
}

export function useContributeToGoal(meetingId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ goalId, amount }: { goalId: string; amount: number }) =>
      contributeRequest(goalId, amount),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["meeting-goals"] })
      queryClient.invalidateQueries({ queryKey: ["meetings"] })
    },
  })
}
