export interface CreatePollInput {
  meetingId: string
  title: string
  description?: string
  options: string[]
  endDate: Date
}

export interface VoteInput {
  voteId: string
  selectedOption: string
}

export interface Poll {
  id: string
  title: string
  description: string | null
  options: string[]
  startDate: string
  endDate: string
  votes: Record<string, number>
  myVote: string | null
  status: "active" | "ended"
}
