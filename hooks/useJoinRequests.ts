import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
export interface JoinRequest {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        avatar: string;
    };
    group: string;
    groupId: string;
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE";
    createdAt: string;
    message: string;
}

export interface JoinRequestStats {
    totalJoinRequests: number;
    pendingJoinRequests: number;
    approvedJoinRequests: number;
    rejectedJoinRequests: number;
}

interface FetchJoinRequestsParams {
    status?: string;
    groupId?: string;
    page?: number;
    pageSize?: number;
}

interface FetchJoinRequestsResponse {
    joinRequests: JoinRequest[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface MutateJoinRequestParams {
    id: string;
    action: "ACCEPT" | "DECLINE";
}

// Fetch join requests
async function fetchJoinRequests(params?: FetchJoinRequestsParams): Promise<FetchJoinRequestsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.groupId) searchParams.set("groupId", params.groupId);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());

    const url = `/api/join-requests${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch join requests");
    }

    const data = await response.json();
    return {
        joinRequests: data.joinRequests || [],
        total: data.total || 0,
        page: data.page || 1,
        pageSize: data.pageSize || 10,
        totalPages: data.totalPages || 0,
    };
}

// Mutate join request (approve/decline)
async function mutateJoinRequest({ id, action }: MutateJoinRequestParams) {
    const response = await fetch(`/api/join-requests/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process join request");
    }

    return response.json();
}

/**
 * Hook to fetch join requests with optional filters and pagination
 * Supports suspense mode for loading states
 */
export function useJoinRequests(params?: FetchJoinRequestsParams) {
    return useQuery({
        queryKey: ["join-requests", params],
        queryFn: () => fetchJoinRequests(params),
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Hook to calculate statistics from join requests
 */
export function useJoinRequestStats() {
    const { data: allRequestsData, isLoading: isLoadingAll } = useJoinRequests({});
    const { data: pendingRequestsData, isLoading: isLoadingPending } = useJoinRequests({ status: "PENDING" });

    const allRequestsArray = allRequestsData?.joinRequests || [];
    const pendingRequestsArray = pendingRequestsData?.joinRequests || [];

    const stats: JoinRequestStats = {
        totalJoinRequests: allRequestsArray.length,
        pendingJoinRequests: pendingRequestsArray.length,
        approvedJoinRequests: allRequestsArray.filter((r: JoinRequest) => r.status === "ACTIVE").length,
        rejectedJoinRequests: allRequestsArray.filter(
            (r: JoinRequest) => r.status === "INACTIVE" || r.status === "SUSPENDED"
        ).length,
    };

    return { data: stats, isLoading: isLoadingAll || isLoadingPending };
}

/**
 * Hook to approve or decline a join request
 * Includes optimistic updates and automatic query invalidation
 */
export function useMutateJoinRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: mutateJoinRequest,
        onMutate: async ({ id, action }) => {
            // Cancel outgoing refetches to avoid race conditions
            await queryClient.cancelQueries({ queryKey: ["join-requests"] });

            // Snapshot previous values for all join-request queries
            const previousQueries = queryClient.getQueriesData({ queryKey: ["join-requests"] });

            // Optimistically update all join-request queries
            queryClient.setQueriesData<JoinRequest[]>(
                { queryKey: ["join-requests"] },
                (old) => {
                    if (!old) return old;

                    if (action === "DECLINE") {
                        // Remove the request from the list
                        return old.filter((request) => request.id !== id);
                    } else {
                        // Update status to ACTIVE
                        return old.map((request) =>
                            request.id === id ? { ...request, status: "ACTIVE" as const } : request
                        );
                    }
                }
            );

            return { previousQueries };
        },
        onError: (error, variables, context) => {
            // Rollback all queries on error
            if (context?.previousQueries) {
                context.previousQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            toast.error(error.message || "Failed to process join request");
        },
        onSuccess: (data, variables) => {
            toast.success(
                data.message ||
                (variables.action === "ACCEPT" ? "Request approved successfully" : "Request declined")
            );
        },
        onSettled: () => {
            // Invalidate and refetch all join-request queries
            // This ensures the UI is updated with the latest data from the server
            queryClient.invalidateQueries({
                queryKey: ["join-requests"],
                refetchType: "active" // Only refetch queries that are currently being used
            });
        },
    });
}
