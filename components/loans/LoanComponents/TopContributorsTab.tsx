"use client"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    TrendingUp,
    Users,
    Filter,
    ChevronUp,
    ChevronDown,
    Info,
    FileText,
    Clock,
    Search,
    Loader2,
    AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TopContributorsTab() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [sortBy, setSortBy] = useState<string>("amount")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [selectedGroup, setSelectedGroup] = useState<string>("all")

    // State for API data
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [memberContributionData, setMemberContributionData] = useState<any[]>([])
    const [groups, setGroups] = useState<any[]>([{ id: "all", name: "All Groups" }])
    const [totalContributions, setTotalContributions] = useState<number>(0)
    const [totalActiveContributors, setTotalActiveContributors] = useState<number>(0)

    const timeRange = "month" // This could also come from API or be configurable

    // Fetch groups and contributions data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            try {
                // Fetch groups where user is a member
                const groupsResponse = await fetch('/api/groups')
                if (!groupsResponse.ok) {
                    throw new Error('Failed to fetch groups')
                }
                const groupsData = await groupsResponse.json()

                // Format groups for dropdown
                const formattedGroups = [
                    { id: "all", name: "All Groups" },
                    ...groupsData.map((group: any) => ({
                        id: group.id,
                        name: group.name
                    }))
                ]
                setGroups(formattedGroups)

                // Fetch contributions data
                const contributionsUrl = selectedGroup !== "all" 
                    ? `/api/contributions?groupId=${selectedGroup}`
                    : '/api/contributions'

                const contributionsResponse = await fetch(contributionsUrl)
                if (!contributionsResponse.ok) {
                    throw new Error('Failed to fetch contributions')
                }

                const contributionsData = await contributionsResponse.json()

                // Update state with fetched data
                setMemberContributionData(contributionsData.contributors || [])
                setTotalContributions(contributionsData.statistics.totalContributions || 0)
                setTotalActiveContributors(contributionsData.statistics.totalActiveContributors || 0)

            } catch (err) {
                console.error('Error fetching data:', err)
                setError(err instanceof Error ? err.message : 'An unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedGroup]) // Re-fetch when selected group changes

    // Filter contributors based on search query
    const filteredContributors = memberContributionData.filter((contributor) =>
        contributor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Toggle sort order function
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    // Get sort icon function
    const getSortIcon = () => {
        return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    }

    // Sort contributors based on selected criteria
    const sortedContributors = [...filteredContributors].sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
            case "amount":
                comparison = a.value - b.value
                break
            case "name":
                comparison = a.name.localeCompare(b.name)
                break
            case "reliability":
                comparison = a.reliability - b.reliability
                break
            case "loans":
                comparison = a.totalLoans - b.totalLoans
                break
            case "trend":
                comparison = Number.parseFloat(a.trend.replace("%", "")) - Number.parseFloat(b.trend.replace("%", ""))
                break
            default:
                comparison = a.value - b.value
        }

        return sortOrder === "asc" ? comparison : -comparison
    })

    return (
        <div className="w-full">
            {/* Header and Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 px-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Top Contributors</h2>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contributors..."
                            className="pl-9 h-10 rounded-full w-full sm:w-[240px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                            <SelectTrigger className="w-[150px] h-10 rounded-full text-sm">
                                <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 rounded-full text-sm flex items-center gap-1.5 px-4"
                            onClick={toggleSortOrder}
                        >
                            <Filter className="h-4 w-4" />
                            Sort
                            {getSortIcon()}
                        </Button>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[120px] h-10 rounded-full text-sm">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="amount">Amount</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="reliability">Reliability</SelectItem>
                                <SelectItem value="loans">Total Loans</SelectItem>
                                <SelectItem value="trend">Trend</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4">
                {/* Contributors List */}
                <div className="lg:col-span-8 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading contribution data...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <AlertDescription>
                                {error}. Please try again later.
                            </AlertDescription>
                        </Alert>
                    ) : sortedContributors.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchQuery ? "No contributors found matching your search." : "No contribution data available for this group."}
                        </div>
                    ) : (
                        sortedContributors.map((contributor, index) => (
                            <div
                                key={contributor.id}
                                className={cn(
                                    "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3",
                                    index < 3
                                        ? "bg-gradient-to-r from-primary/5 to-transparent border-primary/20"
                                        : "border-border/50 bg-white dark:bg-black",
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <Avatar className="h-12 w-12 border-2 border-background">
                                            <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                                            <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {index < 3 && (
                                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-sm font-medium">{contributor.name}</h4>
                                            {contributor.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "text-xs px-2 py-0.5 rounded-sm",
                                                        contributor.badge === "Top Contributor"
                                                            ? "bg-primary/10 text-primary"
                                                            : contributor.badge === "Power Lender"
                                                                ? "bg-green-500/10 text-green-600"
                                                                : contributor.badge === "Consistent"
                                                                    ? "bg-blue-500/10 text-blue-600"
                                                                    : contributor.badge === "New Member"
                                                                        ? "bg-orange-500/10 text-orange-600"
                                                                        : "",
                                                    )}
                                                >
                                                    {contributor.badge}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                          {contributor.lastContribution}
                      </span>
                                            <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                                                {contributor.totalLoans} loans
                      </span>
                                            <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {contributor.joinedDate}
                      </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:items-end gap-1 mt-2 sm:mt-0">
                                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                                        <span className="text-lg font-medium">ZMK {contributor.value.toLocaleString()}</span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-xs rounded-sm px-1.5 py-0",
                                                contributor.trendDirection === "up"
                                                    ? "text-green-500 border-green-200"
                                                    : "text-red-500 border-red-200",
                                            )}
                                        >
                                            {contributor.trendDirection === "up" ? (
                                                <ChevronUp className="h-3 w-3" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3" />
                                            )}
                                            {contributor.trend}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1.5 w-full sm:w-[180px]">
                                        <Progress
                                            value={contributor.reliability}
                                            className="h-1.5"
                                            indicatorClassName={cn(
                                                contributor.reliability >= 95
                                                    ? "bg-green-500"
                                                    : contributor.reliability >= 90
                                                        ? "bg-amber-500"
                                                        : "bg-red-500",
                                            )}
                                        />
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center gap-0.5 text-xs whitespace-nowrap">
                                                        <span>{contributor.reliability}%</span>
                                                        <Info className="h-3 w-3 text-muted-foreground" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">Reliability score based on payment history</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Total contributed: ZMK {contributor.totalContributed.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Contribution Statistics */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Contribution Statistics</h3>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Loading statistics...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <AlertDescription className="text-xs">
                                Unable to load statistics
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                            <div className="bg-white dark:bg-black p-5 rounded-lg border border-border/50">
                                <div className="text-sm text-muted-foreground">Total Contributions</div>
                                <div className="text-2xl font-bold mt-2">ZMK {totalContributions.toLocaleString()}</div>
                                <div className="text-sm text-green-500 flex items-start gap-2 mt-2">
                                    <TrendingUp className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <span className="break-words whitespace-normal overflow-hidden">
                                        {selectedGroup === "all" 
                                            ? `Across all your groups` 
                                            : `In ${groups.find(g => g.id === selectedGroup)?.name || 'this group'}`}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-black p-5 rounded-lg border border-border/50">
                                <div className="text-sm text-muted-foreground">Active Contributors</div>
                                <div className="text-2xl font-bold mt-2">{totalActiveContributors}</div>
                                <div className="text-sm text-green-500 flex items-start gap-2 mt-2">
                                    <TrendingUp className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                    <span className="break-words whitespace-normal overflow-hidden">
                                        {totalActiveContributors > 0 
                                            ? `${totalActiveContributors} active member${totalActiveContributors !== 1 ? 's' : ''}` 
                                            : 'No active contributors yet'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
