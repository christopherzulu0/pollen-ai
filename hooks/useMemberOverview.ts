import { useQuery } from "@tanstack/react-query"
import type { MemberOverview } from "@/lib/actions/member-overview"

async function fetchMemberOverview(): Promise<MemberOverview> {
  const response = await fetch("/api/member/overview")
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch member overview")
  }
  return response.json()
}

export function useMemberOverview() {
  return useQuery({
    queryKey: ["member-overview"],
    queryFn: fetchMemberOverview,
  })
}
