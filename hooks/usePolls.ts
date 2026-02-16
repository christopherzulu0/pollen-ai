import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Poll } from "@/lib/types/polls"

async function fetchMeetingPolls(meetingId: string): Promise<Poll[]> {
  const response = await fetch(`/api/meetings/${meetingId}/polls`)
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch polls")
  }
  const data = await response.json()
  return data.polls ?? []
}

interface CreatePollParams {
  meetingId: string
  title: string
  description?: string
  options: string[]
  endDate: string
}

async function createPollRequest({
  meetingId,
  title,
  description,
  options,
  endDate,
}: CreatePollParams) {
  const response = await fetch(`/api/meetings/${meetingId}/polls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, options, endDate }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to create poll")
  }
  return response.json()
}

interface SubmitVoteParams {
  voteId: string
  selectedOption: string
}

async function submitVoteRequest({ voteId, selectedOption }: SubmitVoteParams) {
  const response = await fetch(`/api/polls/${voteId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ selectedOption }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to submit vote")
  }
  return response.json()
}

export function useMeetingPolls(meetingId: string | null) {
  return useQuery({
    queryKey: ["meeting-polls", meetingId],
    queryFn: () => fetchMeetingPolls(meetingId!),
    enabled: !!meetingId,
  })
}

export function useCreatePoll(meetingId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPollRequest,
    onSuccess: () => {
      if (meetingId) {
        queryClient.invalidateQueries({ queryKey: ["meeting-polls", meetingId] })
      }
    },
  })
}

export function useSubmitVote(meetingId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitVoteRequest,
    onSuccess: () => {
      if (meetingId) {
        queryClient.invalidateQueries({ queryKey: ["meeting-polls", meetingId] })
      }
    },
  })
}
