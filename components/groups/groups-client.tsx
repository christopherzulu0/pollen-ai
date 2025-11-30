"use client"

import { useState } from "react"
import { GroupCard } from "@/components/groups/group-card"
import { GroupFilters } from "@/components/groups/group-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, LayoutGrid, List, SlidersHorizontal, Sparkles, TrendingUp, Users } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { GroupWithDetails } from "@/lib/types/groups"

interface GroupsClientProps {
  initialGroups: GroupWithDetails[]
}

type SortOption =
  | "recommended"
  | "members-high"
  | "members-low"
  | "contribution-high"
  | "contribution-low"
  | "interest-high"
  | "newest"
type ViewMode = "grid" | "list"

export function GroupsClient({ initialGroups }: GroupsClientProps) {
  const [groups] = useState(initialGroups)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("recommended")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    privacy: "all",
    status: "all",
    frequency: "all",
    contributionRange: [0, 200000] as [number, number],
    interestRange: [0, 10] as [number, number],
    showFavoritesOnly: false,
  })

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      search === "" ||
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description?.toLowerCase().includes(search.toLowerCase()) ||
      group.adminName?.toLowerCase().includes(search.toLowerCase())

    const matchesPrivacy = filters.privacy === "all" || group.privacy === filters.privacy
    const matchesStatus = filters.status === "all" || group.status === filters.status
    const matchesFrequency = filters.frequency === "all" || group.contributionFrequency === filters.frequency
    const matchesContribution =
      group.contributionAmount >= filters.contributionRange[0] &&
      group.contributionAmount <= filters.contributionRange[1]
    const matchesInterest =
      group.interestRate >= filters.interestRange[0] && group.interestRate <= filters.interestRange[1]
    const matchesFavorites = !filters.showFavoritesOnly || favorites.has(group.id)

    return (
      matchesSearch &&
      matchesPrivacy &&
      matchesStatus &&
      matchesFrequency &&
      matchesContribution &&
      matchesInterest &&
      matchesFavorites
    )
  })

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    switch (sortBy) {
      case "members-high":
        return b.memberCount - a.memberCount
      case "members-low":
        return a.memberCount - b.memberCount
      case "contribution-high":
        return b.contributionAmount - a.contributionAmount
      case "contribution-low":
        return a.contributionAmount - b.contributionAmount
      case "interest-high":
        return b.interestRate - a.interestRate
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime()
      case "recommended":
      default:
        const scoreA =
          (a.status === "ACTIVE" ? 100 : 0) + (a.memberCount / (a.maxMembers || 50)) * 50 + a.interestRate * 10
        const scoreB =
          (b.status === "ACTIVE" ? 100 : 0) + (b.memberCount / (b.maxMembers || 50)) * 50 + b.interestRate * 10
        return scoreB - scoreA
    }
  })

  const toggleFavorite = (groupId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(groupId)) {
        newFavorites.delete(groupId)
      } else {
        newFavorites.add(groupId)
      }
      return newFavorites
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary shadow-md">
              <Sparkles className="size-3 sm:size-4 text-primary" />
              Discover Your Financial Community
            </div>

            <h1 className="text-balance font-bold tracking-tight text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Join Trusted{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Savings Groups
              </span>
            </h1>

            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-pretty text-base sm:text-lg text-muted-foreground leading-relaxed px-4">
              Build wealth through community collaboration. Find your perfect savings circle and achieve financial goals
              together.
            </p>

            <div className="mx-auto mt-6 sm:mt-10 max-w-xl px-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-4 sm:size-5 -translate-y-1/2 text-primary/70" />
                <Input
                  type="text"
                  placeholder="Search groups..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 sm:h-14 rounded-xl border-border bg-card pl-11 sm:pl-12 pr-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground shadow-md"
                />
              </div>
            </div>

            <div className="mx-auto mt-8 sm:mt-12 lg:mt-16 grid max-w-4xl grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-4">
              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30 p-4 sm:p-6 shadow-md backdrop-blur-sm">
                <div className="mb-2 inline-flex rounded-lg bg-primary/15 p-2 sm:p-2.5 shadow-sm">
                  <Users className="size-4 sm:size-5 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{groups.length}</div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">Active Groups</div>
              </div>

              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30 p-4 sm:p-6 shadow-md backdrop-blur-sm">
                <div className="mb-2 inline-flex rounded-lg bg-secondary/15 p-2 sm:p-2.5 shadow-sm">
                  <Users className="size-4 sm:size-5 text-secondary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {groups.reduce((sum, g) => sum + g.memberCount, 0).toLocaleString()}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">Total Members</div>
              </div>

              <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30 p-4 sm:p-6 shadow-md backdrop-blur-sm">
                <div className="mb-2 inline-flex rounded-lg bg-accent/15 p-2 sm:p-2.5 shadow-sm">
                  <TrendingUp className="size-4 sm:size-5 text-accent" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {(groups.reduce((sum, g) => sum + g.contributionAmount * g.memberCount, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">Total Saved (ZMW)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-lg supports-[backdrop-filter]:bg-card/90 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-medium text-foreground">
                {sortedGroups.length} {sortedGroups.length === 1 ? "group" : "groups"}
              </span>
              {sortedGroups.length < groups.length && (
                <span className="text-muted-foreground hidden sm:inline">(filtered from {groups.length})</span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="h-9 sm:h-10 flex-1 sm:w-[180px] rounded-lg border-border/60 bg-card text-sm text-foreground">
                  <SelectValue placeholder="Sort by" className="text-foreground" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="recommended" className="text-foreground">Recommended</SelectItem>
                  <SelectItem value="members-high" className="text-foreground">Most Members</SelectItem>
                  <SelectItem value="members-low" className="text-foreground">Least Members</SelectItem>
                  <SelectItem value="contribution-high" className="text-foreground">Highest Contribution</SelectItem>
                  <SelectItem value="contribution-low" className="text-foreground">Lowest Contribution</SelectItem>
                  <SelectItem value="interest-high" className="text-foreground">Highest Interest</SelectItem>
                  <SelectItem value="newest" className="text-foreground">Newest</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center gap-0.5 rounded-lg border border-border/60 bg-card p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="size-8 rounded-md"
                >
                  <LayoutGrid className="size-4 text-foreground" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="size-8 rounded-md"
                >
                  <List className="size-4 text-foreground" />
                </Button>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden rounded-lg bg-card border-border h-9 text-foreground hover:bg-accent/10">
                    <SlidersHorizontal className="mr-2 size-4 text-foreground" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-80 overflow-y-auto p-6 bg-background">
                  <GroupFilters filters={filters} onFilterChange={setFilters} favorites={favorites} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-12 sm:px-6 lg:px-8 bg-background">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-full lg:w-72 shrink-0">
            <div className="sticky top-28">
              <GroupFilters filters={filters} onFilterChange={setFilters} favorites={favorites} />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {sortedGroups.length === 0 ? (
              <div className="flex min-h-[400px] sm:min-h-[500px] items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-8">
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-6 flex size-16 sm:size-24 items-center justify-center rounded-2xl sm:rounded-3xl bg-muted">
                    <Search className="size-8 sm:size-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">No groups found</h3>
                  <p className="mt-3 text-base sm:text-lg text-muted-foreground px-4">
                    Try adjusting your search or filters to find more groups
                  </p>
                  <Button
                    size="lg"
                    className="mt-6 sm:mt-8 rounded-xl"
                    onClick={() => {
                      setSearch("")
                      setFilters({
                        privacy: "all",
                        status: "all",
                        frequency: "all",
                        contributionRange: [0, 200000],
                        interestRange: [0, 10],
                        showFavoritesOnly: false,
                      })
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
                    : "flex flex-col gap-4 sm:gap-5"
                }
              >
                {sortedGroups.map((group, index) => (
                  <div key={group.id} className="animate-float-up" style={{ animationDelay: `${index * 0.05}s` }}>
                    <GroupCard
                      group={group}
                      viewMode={viewMode}
                      isFavorite={favorites.has(group.id)}
                      onToggleFavorite={toggleFavorite}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
