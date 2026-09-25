import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types
export interface LoanRequest {
    id: string;
    requester: {
        id: string;
        name: string;
        avatar: string;
    };
    group: string;
    groupId: string;
    amount: number;
    purpose: string;
    repaymentDate: string;
    installments: number;
    interestRate: number;
    status: "PENDING" | "APPROVED" | "REJECTED" | "DISBURSED";
    createdAt: string;
    votes: {
        approve: number;
        reject: number;
        total: number;
        threshold: number;
    };
    comments: number;
}

export interface LoanRequestStats {
    totalLoanRequests: number;
    pendingLoanRequests: number;
    approvedLoanRequests: number;
    rejectedLoanRequests: number;
    totalAmount: number;
    avgApprovalRate: number;
}

interface FetchLoanRequestsParams {
    status?: string;
    groupId?: string;
    page?: number;
    pageSize?: number;
}

interface FetchLoanRequestsResponse {
    loanRequests: LoanRequest[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface MutateLoanRequestParams {
    id: string;
    action: "APPROVE" | "REJECT";
}

// Fetch loan requests
async function fetchLoanRequests(params?: FetchLoanRequestsParams): Promise<FetchLoanRequestsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.groupId) searchParams.set("groupId", params.groupId);
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());

    const url = `/api/loan-requests${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch loan requests");
    }

    const data = await response.json();
    return {
        loanRequests: data.loanRequests || [],
        total: data.total || 0,
        page: data.page || 1,
        pageSize: data.pageSize || 10,
        totalPages: data.totalPages || 0,
    };
}

// Mutate loan request (approve/reject)
async function mutateLoanRequest({ id, action }: MutateLoanRequestParams) {
    const response = await fetch(`/api/loan-requests/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process loan request");
    }

    return response.json();
}

/**
 * Hook to fetch loan requests with optional filters and pagination
 */
export function useLoanRequests(params?: FetchLoanRequestsParams) {
    return useQuery({
        queryKey: ["loan-requests", params],
        queryFn: () => fetchLoanRequests(params),
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Hook to calculate statistics from loan requests
 */
export function useLoanRequestStats() {
    const { data: allRequestsData, isLoading: isLoadingAll } = useLoanRequests({});

    const allRequests = allRequestsData?.loanRequests || [];

    const totalLoanRequests = allRequests.length;
    const pendingLoanRequests = allRequests.filter((r) => r.status === "PENDING").length;
    const approvedLoanRequests = allRequests.filter((r) => r.status === "APPROVED").length;
    const rejectedLoanRequests = allRequests.filter((r) => r.status === "REJECTED").length;
    const totalAmount = allRequests.reduce((sum, r) => sum + r.amount, 0);
    const avgApprovalRate = totalLoanRequests > 0
        ? Math.round((approvedLoanRequests / totalLoanRequests) * 100)
        : 0;

    const stats: LoanRequestStats = {
        totalLoanRequests,
        pendingLoanRequests,
        approvedLoanRequests,
        rejectedLoanRequests,
        totalAmount,
        avgApprovalRate,
    };

    return { data: stats, isLoading: isLoadingAll };
}

/**
 * Hook to approve or reject a loan request
 * Includes optimistic updates and automatic query invalidation
 */
export function useMutateLoanRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: mutateLoanRequest,
        onMutate: async ({ id, action }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["loan-requests"] });

            // Snapshot previous values
            const previousQueries = queryClient.getQueriesData({ queryKey: ["loan-requests"] });

            // Optimistically update all loan-request queries
            queryClient.setQueriesData<FetchLoanRequestsResponse>(
                { queryKey: ["loan-requests"] },
                (old) => {
                    if (!old) return old;

                    const newStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

                    return {
                        ...old,
                        loanRequests: old.loanRequests.map((request) =>
                            request.id === id
                                ? { ...request, status: newStatus as any }
                                : request
                        ),
                    };
                }
            );

            return { previousQueries };
        },
        onError: (error, variables, context) => {
            // Rollback on error
            if (context?.previousQueries) {
                context.previousQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
            toast.error(error.message || "Failed to process loan request");
        },
        onSuccess: (data, variables) => {
            toast.success(
                data.message ||
                (variables.action === "APPROVE" ? "Loan approved successfully" : "Loan rejected")
            );
        },
        onSettled: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: ["loan-requests"],
                refetchType: "active",
            });
        },
    });
}
// Cast a vote on a loan request
async function voteLoanRequest({ id, vote, comment }: { id: string; vote: "APPROVE" | "REJECT", comment?: string }) {
    const response = await fetch(`/api/loan-requests/${id}/vote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote, comment }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to cast vote");
    }

    return response.json();
}

/**
 * Hook to cast a vote on a loan request
 */
export function useVoteLoanRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: voteLoanRequest,
        onSuccess: (data) => {
            toast.success(data.message || "Vote recorded successfully");
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: ["loan-requests"],
                refetchType: "active",
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to cast vote");
        },
    });
}
