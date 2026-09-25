"use client"

import { useEffect, useState } from "react"
import { getOfflineStatus, subscribeOffline, type OfflineSnapshot } from "@/lib/offline"

export function OfflineStatus() {
  const [snapshot, setSnapshot] = useState<OfflineSnapshot>(getOfflineStatus())

  useEffect(() => subscribeOffline(() => setSnapshot(getOfflineStatus())), [])

  if (!snapshot.offline && snapshot.pending === 0 && !snapshot.syncing) return null

  const message = snapshot.syncing
    ? "Syncing saved changes..."
    : snapshot.offline && snapshot.pending > 0
      ? `You are offline. Showing the last saved copy. ${snapshot.pending} change${snapshot.pending === 1 ? "" : "s"} will sync when you reconnect.`
      : snapshot.offline
        ? "You are offline. Showing the last saved copy."
        : `${snapshot.pending} saved change${snapshot.pending === 1 ? "" : "s"} waiting to sync.`

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 rounded-full bg-[#003366] px-4 py-2 text-center text-sm text-white shadow-lg">
      {message}
    </div>
  )
}
