"use server"

import { mockGroups } from "@/lib/mock-data/groups"
import type { GroupWithDetails } from "@/lib/types/groups"

export async function getGroups(filters?: {
  search?: string
  privacy?: string
  status?: string
}): Promise<GroupWithDetails[]> {
  try {
    let filteredGroups = [...mockGroups]

    // Apply status filter
    if (filters?.status && filters.status !== "all") {
      filteredGroups = filteredGroups.filter((g) => g.status === filters.status)
    }

    // Apply privacy filter
    if (filters?.privacy && filters.privacy !== "all") {
      filteredGroups = filteredGroups.filter((g) => g.privacy === filters.privacy)
    }

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredGroups = filteredGroups.filter(
        (g) => g.name.toLowerCase().includes(searchLower) || g.description?.toLowerCase().includes(searchLower),
      )
    }

    return filteredGroups
  } catch (error) {
    console.error("Error fetching groups:", error)
    return []
  }
}

export async function joinGroup(groupId: string, inviteCode?: string) {
  try {
    const group = mockGroups.find((g) => g.id === groupId)

    if (!group) {
      return { success: false, error: "Group not found" }
    }

    // Simulate different behaviors based on privacy
    if (group.privacy === "INVITE_ONLY" && !inviteCode) {
      return { success: false, error: "Invitation code required" }
    }

    if (group.privacy === "INVITE_ONLY" && inviteCode !== "DEMO123") {
      return { success: false, error: "Invalid invitation code" }
    }

    // Simulate successful join/request
    const actionMessage =
      group.privacy === "PUBLIC"
        ? "Successfully joined the group!"
        : group.privacy === "PRIVATE"
          ? "Join request submitted! Waiting for admin approval."
          : "Successfully joined with invitation code!"

    return { success: true, message: actionMessage }
  } catch (error) {
    console.error("Error joining group:", error)
    return { success: false, error: "Failed to join group" }
  }
}

export async function requestToJoin(groupId: string) {
  return joinGroup(groupId)
}
