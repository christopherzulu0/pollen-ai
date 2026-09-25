import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function GroupsHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Skeleton className="mx-auto mb-4 h-8 w-48 rounded-full" />
          <Skeleton className="mx-auto h-16 w-full max-w-2xl mb-6" />
          <Skeleton className="mx-auto h-20 w-full max-w-xl mb-10" />
          <Skeleton className="mx-auto h-14 w-full max-w-xl rounded-xl mb-16" />

          <div className="mx-auto grid max-w-4xl grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30 p-4 sm:p-6 shadow-md backdrop-blur-sm">
                <Skeleton className="mb-2 h-10 w-10 rounded-lg" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function GroupsToolbarSkeleton() {
  return (
    <div className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-lg shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 flex-1 sm:w-[180px] rounded-lg" />
            <Skeleton className="hidden sm:block h-10 w-20 rounded-lg" />
            <Skeleton className="lg:hidden h-9 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function GroupFiltersSkeleton() {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-border/50 bg-card/95 backdrop-blur-sm shadow-md p-4 sm:p-6 space-y-5 sm:space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-16 rounded-lg" />
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3 sm:space-y-4">
          <Skeleton className="h-5 w-20" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center space-x-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  )
}

export function GroupCardSkeleton({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted/10 shadow-md">
        <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:flex-row lg:items-center">
          <Skeleton className="size-16 sm:size-20 rounded-full shrink-0 mx-auto lg:mx-0" />

          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-6 w-48 mx-auto lg:mx-0" />
            <Skeleton className="h-4 w-full max-w-md mx-auto lg:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto lg:mx-0" />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded-lg bg-muted/20 px-2 sm:px-3 py-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-5 w-8" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full lg:w-auto">
            <Skeleton className="h-9 w-full sm:w-24 rounded-lg" />
            <Skeleton className="h-9 w-full sm:w-28 rounded-lg" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative h-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/10 shadow-lg">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <Skeleton className="size-12 sm:size-14 rounded-full shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-6 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-12 rounded-md" />
              </div>
            </div>
          </div>
          <Skeleton className="size-8 sm:size-9 rounded-lg shrink-0" />
        </div>

        <Skeleton className="h-12 w-full mb-4 sm:mb-5" />

        <div className="rounded-lg border border-border/50 bg-muted/20 p-2.5 sm:p-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 sm:size-8 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-muted/20 p-2.5 sm:p-3">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      <div className="border-t border-border" />

      <div className="flex items-center gap-2 p-3 sm:p-4 bg-muted/20">
        <Skeleton className="h-9 sm:h-10 flex-1 rounded-lg" />
        <Skeleton className="h-9 sm:h-10 flex-1 rounded-lg" />
      </div>
    </Card>
  )
}

export function GroupsGridSkeleton({ count = 6, viewMode = "grid" }: { count?: number; viewMode?: "grid" | "list" }) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
          : "flex flex-col gap-4 sm:gap-5"
      }
    >
      {[...Array(count)].map((_, i) => (
        <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
          <GroupCardSkeleton viewMode={viewMode} />
        </div>
      ))}
    </div>
  )
}

export function GroupsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <GroupsHeaderSkeleton />
      <GroupsToolbarSkeleton />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-12 sm:px-6 lg:px-8 bg-background">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
          {/* Desktop Filters Skeleton */}
          <aside className="hidden lg:block w-full lg:w-72 shrink-0">
            <div className="sticky top-28">
              <GroupFiltersSkeleton />
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1 min-w-0">
            <GroupsGridSkeleton />
          </main>
        </div>
      </div>
    </div>
  )
}

