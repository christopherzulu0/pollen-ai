import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JoinRequestCardSkeleton() {
    return (
        <Card className="cursor-pointer transition-all border-border bg-card">
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    {/* Avatar skeleton */}
                    <Skeleton className="h-12 w-12 rounded-full" />

                    <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                                {/* Name skeleton */}
                                <Skeleton className="h-5 w-32" />
                                {/* Contact info skeleton */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                            </div>
                            {/* Badge skeleton */}
                            <Skeleton className="h-6 w-20 shrink-0" />
                        </div>

                        {/* Message skeleton */}
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Footer skeleton */}
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function JoinRequestDetailSkeleton() {
    return (
        <Card className="bg-card border-border sticky top-6">
            <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                </div>

                {/* Divider */}
                <Skeleton className="h-px w-full" />

                {/* User profile */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Divider */}
                <Skeleton className="h-px w-full" />

                {/* Contact info */}
                <div className="space-y-4">
                    <Skeleton className="h-5 w-48" />
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-4 w-4" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-24" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <Skeleton className="h-px w-full" />

                {/* Message */}
                <div className="space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>

                {/* Divider */}
                <Skeleton className="h-px w-full" />

                {/* Group info */}
                <div className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-48" />
                </div>

                {/* Divider */}
                <Skeleton className="h-px w-full" />

                {/* Action buttons */}
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                </div>
            </CardContent>
        </Card>
    );
}

export function JoinRequestListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <JoinRequestCardSkeleton key={i} />
            ))}
        </div>
    );
}
