"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { QueryErrorResetBoundary } from "@tanstack/react-query"

// Components
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { SavingsOverviewChart, GroupDistributionChart, RecentActivityChart } from "@/components/dashboard/dashboard-charts"
import { ActivityFeed } from "@/components/dashboard/dashboard-activity"
import { DashboardError } from "@/components/dashboard/dashboard-error"

// Skeletons
import {
  StatsGridSkeleton,
  ChartCardSkeleton,
  PieChartSkeleton,
  LineChartSkeleton,
  ActivityFeedSkeleton,
} from "@/components/dashboard/dashboard-skeletons"

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <DashboardError
      message={error.message}
      onRetry={resetErrorBoundary}
    />
  )
}

// Stats section with Suspense
function StatsSection() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={ErrorFallback}
        >
          <Suspense fallback={<StatsGridSkeleton />}>
            <DashboardStats />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

// Savings Overview Chart with Suspense
function SavingsChartSection() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <div className="lg:col-span-4">
              <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
            </div>
          )}
        >
          <Suspense fallback={<ChartCardSkeleton className="lg:col-span-4" />}>
            <SavingsOverviewChart />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

// Group Distribution Chart with Suspense
function GroupChartSection() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <div className="lg:col-span-3">
              <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
            </div>
          )}
        >
          <Suspense fallback={<PieChartSkeleton className="lg:col-span-3" />}>
            <GroupDistributionChart />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

// Recent Activity Chart with Suspense
function ActivityChartSection() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <div className="lg:col-span-4">
              <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
            </div>
          )}
        >
          <Suspense fallback={<LineChartSkeleton className="lg:col-span-4" />}>
            <RecentActivityChart />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

// Activity Feed with Suspense
function ActivityFeedSection() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={({ error, resetErrorBoundary }) => (
            <div className="lg:col-span-3">
              <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
            </div>
          )}
        >
          <Suspense fallback={<ActivityFeedSkeleton className="lg:col-span-3" />}>
            <ActivityFeed />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

export default function DashboardOverview() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <StatsSection />

        {/* Charts Section */}
        <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <SavingsChartSection />
          <GroupChartSection />
        </div>

        {/* Activity Section */}
        <div className="grid gap-3 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <ActivityChartSection />
          <ActivityFeedSection />
        </div>
      </div>
    </div>
  )
}
