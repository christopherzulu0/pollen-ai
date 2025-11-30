"use client"

import { GroupsError } from "@/components/groups/groups-error"

export default function GroupsErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <GroupsError error={error} reset={reset} />
}

