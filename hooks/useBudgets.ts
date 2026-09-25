import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { GroupBudgetItem } from "@/lib/actions/budgets"

async function fetchBudgets(): Promise<GroupBudgetItem[]> {
  const response = await fetch("/api/budgets")
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch budgets")
  }
  const data = await response.json()
  return data.budgets ?? []
}

async function fetchGroupBudget(groupId: string): Promise<GroupBudgetItem | null> {
  const response = await fetch(`/api/groups/${groupId}/budget`)
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to fetch budget")
  }
  const data = await response.json()
  return data.budget ?? null
}

interface CreateBudgetParams {
  groupId: string
  monthlyAmount: number
  categories: { name: string; allocated: number }[]
}

async function createBudgetRequest({
  groupId,
  monthlyAmount,
  categories,
}: CreateBudgetParams) {
  const response = await fetch(`/api/groups/${groupId}/budget`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ monthlyAmount, categories }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Failed to create budget")
  }
  return response.json()
}

export function useBudgets(enabled = true) {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
    enabled,
  })
}

export function useGroupBudget(groupId: string | null) {
  return useQuery({
    queryKey: ["group-budget", groupId],
    queryFn: () => fetchGroupBudget(groupId!),
    enabled: !!groupId,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBudgetParams) => createBudgetRequest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      queryClient.invalidateQueries({ queryKey: ["group-budget", variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ["meetings"] })
    },
  })
}
