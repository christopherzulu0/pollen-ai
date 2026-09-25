import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoanRequestCardSkeleton() {
    return (
        <Card className="border-border bg-card">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar skeleton */}
                    <Skeleton className="h-10 w-10 rounded-full" />

                    <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-20" />
                        </div>

                        {/* Group name */}
                        <Skeleton className="h-4 w-24" />

                        {/* Purpose */}
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />

                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Voting progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-1.5 w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function LoanRequestDetailSkeleton() {
    return (
        <Card className="bg-card border-border sticky top-6">
            <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>

                {/* User profile */}
                <div className="flex flex-col items-center text-center">
                    <Skeleton className="h-20 w-20 rounded-full mb-3" />
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                </div>

                <div className="h-px bg-border" />

                {/* Loan details sections */}
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                ))}

                <div className="h-px bg-border" />

                {/* Action buttons */}
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                </div>
            </CardContent>
        </Card>
    )
}

export function LoanRequestListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <LoanRequestCardSkeleton key={i} />
            ))}
        </div>
    )
}
