import { Suspense } from "react"
import { GroupsData } from "@/components/groups/groups-data"
import { GroupsPageSkeleton } from "@/components/groups/groups-skeleton"

export const metadata = {
  title: "Savings Groups | Pollen",
  description: "Discover and join trusted savings groups. Build wealth through community collaboration.",
}

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; privacy?: string; status?: string }>
}) {
  const params = await searchParams

  return (
    <div className="relative min-h-screen bg-background">
      {/* Subtle Background Pattern Overlay */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.02),transparent_50%),linear-gradient(to_right,rgba(17,24,39,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.03)_1px,transparent_1px)] bg-[size:100%_100%,20px_20px,20px_20px] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      
      {/* Gradient Overlay for depth */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02] pointer-events-none" />
      
      <Suspense fallback={<GroupsPageSkeleton />}>
        <GroupsData
          initialParams={{
            search: params.search,
            privacy: params.privacy,
            status: params.status,
          }}
        />
      </Suspense>
    </div>
  )
}
