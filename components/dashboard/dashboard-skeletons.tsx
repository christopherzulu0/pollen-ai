"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
        </div>
        <div className="mt-3 sm:mt-4 flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}

// Stats Grid Skeleton
export function StatsGridSkeleton() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto max-w-sm sm:max-w-none">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>
  )
}

// Chart Card Skeleton
export function ChartCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 sm:pb-4">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[250px] sm:h-[300px] flex items-end justify-between gap-2 px-4">
          {/* Bar chart skeleton */}
          <Skeleton className="h-[40%] w-10 rounded-t-md" />
          <Skeleton className="h-[55%] w-10 rounded-t-md" />
          <Skeleton className="h-[70%] w-10 rounded-t-md" />
          <Skeleton className="h-[85%] w-10 rounded-t-md" />
          <Skeleton className="h-[65%] w-10 rounded-t-md" />
          <Skeleton className="h-[90%] w-10 rounded-t-md" />
        </div>
      </CardContent>
    </Card>
  )
}

// Pie Chart Skeleton
export function PieChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 sm:pb-4">
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
          <Skeleton className="h-32 w-32 sm:h-40 sm:w-40 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

// Line Chart Skeleton
export function LineChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 sm:pb-4">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[250px] sm:h-[300px] relative">
          {/* Simulate line chart with wave-like skeleton */}
          <div className="absolute inset-x-4 bottom-8 h-px bg-slate-200" />
          <div className="absolute inset-x-4 bottom-1/3 h-px bg-slate-200" />
          <div className="absolute inset-x-4 bottom-2/3 h-px bg-slate-200" />
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <path
              d="M 20 150 Q 60 120, 100 130 T 180 100 T 260 120 T 340 80 T 380 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-200"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

// Activity Feed Item Skeleton
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-2 sm:gap-4 rounded-lg border p-2 sm:p-3">
      <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

// Activity Feed Skeleton
export function ActivityFeedSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-2 sm:pt-4">
        <div className="space-y-2 sm:space-y-4">
          <ActivityItemSkeleton />
          <ActivityItemSkeleton />
          <ActivityItemSkeleton />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

// Full Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Stats Cards Skeleton */}
        <StatsGridSkeleton />

        {/* Charts Section Skeleton */}
        <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <ChartCardSkeleton className="lg:col-span-4" />
          <PieChartSkeleton className="lg:col-span-3" />
        </div>

        {/* Activity Section Skeleton */}
        <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <LineChartSkeleton className="lg:col-span-4" />
          <ActivityFeedSkeleton className="lg:col-span-3" />
        </div>
      </div>
    </div>
  )
}

