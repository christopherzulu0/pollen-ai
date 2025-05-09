"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Download,
    Calendar,
    TrendingUp,
    PieChart,
    Users,
    ChevronUp,
    ChevronDown,
    FileText,
    BarChart3,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Share2,
    Printer,
    Sparkles,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    GraduationCap,
    Stethoscope,
    Home,
    ShieldAlert,
    Zap,
    ChevronRight,
    Activity,
    LineChart,
    BarChart,
    Layers,
    ListFilter,
    RefreshCw,
    CircleDollarSign,
    Hourglass,
    CheckCircle,
    XCircle,
    Percent,
    Target,
    TrendingDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChartContainer } from "@/components/ui/chart"
import { DonutChart, LineChart as ChartLine, BarChart as ChartBar } from "@/components/ui/charts"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"


// Icon mapping function to convert iconName string to JSX element
const getIconByName = (iconName: string) => {
    switch (iconName) {
        case "Briefcase":
            return <Briefcase className="h-3.5 w-3.5" />;
        case "GraduationCap":
            return <GraduationCap className="h-3.5 w-3.5" />;
        case "Stethoscope":
            return <Stethoscope className="h-3.5 w-3.5" />;
        case "Home":
            return <Home className="h-3.5 w-3.5" />;
        case "ShieldAlert":
            return <ShieldAlert className="h-3.5 w-3.5" />;
        default:
            return <Briefcase className="h-3.5 w-3.5" />;
    }
}

export default function LoanPurposeTab() {
    const router = useRouter()
    const [purposeViewMode, setPurposeViewMode] = useState<"grid" | "list" | "chart">("grid")
    const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)
    const [amountRange, setAmountRange] = useState<[number, number]>([0, 5000])

    // State for groups
    const [groups, setGroups] = useState([
        { id: "all", name: "All Groups" }
    ])
    const [selectedGroup, setSelectedGroup] = useState<string>("all")
    const [isLoadingGroups, setIsLoadingGroups] = useState(false)
    const [groupsError, setGroupsError] = useState("")

    // State for loan purposes
    const [loanPurposes, setLoanPurposes] = useState<any[]>([])
    const [purposeTrendData, setPurposeTrendData] = useState<any[]>([])
    const [isLoadingPurposes, setIsLoadingPurposes] = useState(false)
    const [purposesError, setPurposesError] = useState("")

    // Fetch groups from API
    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoadingGroups(true)
            setGroupsError("")

            try {
                const response = await fetch('/api/groups')

                if (!response.ok) {
                    throw new Error('Failed to fetch groups')
                }

                const data = await response.json()

                // Add the "All Groups" option and map the API response
                setGroups([
                    { id: "all", name: "All Groups" },
                    ...data.map((group: any) => ({
                        id: group.id,
                        name: group.name
                    }))
                ])
            } catch (error) {
                console.error('Error fetching groups:', error)
                setGroupsError("Failed to load groups. Please try again.")
                // Fallback to default "All Groups" option
            } finally {
                setIsLoadingGroups(false)
            }
        }

        fetchGroups()
    }, [])

    // Fetch loan purposes from API
    useEffect(() => {
        const fetchLoanPurposes = async () => {
            setIsLoadingPurposes(true)
            setPurposesError("")

            try {
                const url = selectedGroup === "all" 
                    ? '/api/loan-purposes' 
                    : `/api/loan-purposes?groupId=${selectedGroup}`

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error('Failed to fetch loan purposes')
                }

                const data = await response.json()

                // Process the data to add icon JSX elements
                const processedPurposes = data.purposes.map((purpose: any) => ({
                    ...purpose,
                    icon: getIconByName(purpose.iconName)
                }))

                setLoanPurposes(processedPurposes)
                setPurposeTrendData(data.trendData)
            } catch (error) {
                console.error('Error fetching loan purposes:', error)
                setPurposesError("Failed to load loan purposes. Please try again.")
                // Don't set fallback data here, we'll handle the error state in the UI
            } finally {
                setIsLoadingPurposes(false)
            }
        }

        fetchLoanPurposes()
    }, [selectedGroup]) // Re-fetch when selected group changes

    // Filter by purpose
    const filteredPurposes = loanPurposes.filter(purpose => {
        // Filter by purpose if selected
        return selectedPurpose ? purpose.id === selectedPurpose : true;
    });

    // Further filter by amount range
    const amountFilteredPurposes = filteredPurposes.filter(
        purpose => purpose.avgAmount >= amountRange[0] && purpose.avgAmount <= amountRange[1]
    )


    return (
        <>
            <div className="px-4 pb-4">
                {/* Purpose Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                    <h3 className="text-base font-medium flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Loan Purpose Analysis
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("h-8 rounded-full text-xs", purposeViewMode === "grid" ? "bg-muted" : "")}
                                onClick={() => setPurposeViewMode("grid")}
                            >
                                <Layers className="h-3.5 w-3.5 mr-1.5" />
                                Grid
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("h-8 rounded-full text-xs", purposeViewMode === "list" ? "bg-muted" : "")}
                                onClick={() => setPurposeViewMode("list")}
                            >
                                <ListFilter className="h-3.5 w-3.5 mr-1.5" />
                                List
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn("h-8 rounded-full text-xs", purposeViewMode === "chart" ? "bg-muted" : "")}
                                onClick={() => setPurposeViewMode("chart")}
                            >
                                <PieChart className="h-3.5 w-3.5 mr-1.5" />
                                Chart
                            </Button>
                        </div>

                        {/* Group Selection Dropdown */}
                        {isLoadingGroups ? (
                            <div className="flex items-center gap-2 h-8 px-3 border rounded-full text-xs">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Loading groups...</span>
                            </div>
                        ) : groupsError ? (
                            <div className="flex items-center gap-2 h-8 px-3 border rounded-full text-xs text-destructive">
                                <AlertCircle className="h-3.5 w-3.5" />
                                <span>Error loading groups</span>
                            </div>
                        ) : (
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                <SelectTrigger className="w-full sm:w-[180px] h-8 rounded-full text-xs">
                                    <SelectValue placeholder="Select group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* Purpose Selection Dropdown */}
                        <Select value={selectedPurpose || ""} onValueChange={setSelectedPurpose}>
                            <SelectTrigger className="w-full sm:w-[180px] h-8 rounded-full text-xs">
                                <SelectValue placeholder="Filter by purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Purposes</SelectItem>
                                {loanPurposes.map(purpose => (
                                    <SelectItem key={purpose.id} value={purpose.id}>{purpose.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Amount Range Filter */}
                <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-medium">Filter by Average Amount</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Adjust the range to filter loan purposes by their average amount
                            </p>
                        </div>
                        <div className="w-full sm:w-[300px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs">K{amountRange[0].toLocaleString()}</span>
                                <span className="text-xs">K{amountRange[1].toLocaleString()}</span>
                            </div>
                            <Slider
                                value={amountRange}
                                min={0}
                                max={5000}
                                step={100}
                                onValueChange={setAmountRange}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoadingPurposes && (
                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-8 text-center mb-6">
                        <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                        <h4 className="text-base font-medium mb-1">Loading loan purposes</h4>
                        <p className="text-sm text-muted-foreground">
                            Please wait while we fetch the loan purposes data...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {!isLoadingPurposes && purposesError && (
                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-8 text-center mb-6">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                        <h4 className="text-base font-medium mb-1">Error loading loan purposes</h4>
                        <p className="text-sm text-muted-foreground">
                            {purposesError}
                        </p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => {
                                // Retry fetching loan purposes
                                const fetchLoanPurposes = async () => {
                                    setIsLoadingPurposes(true);
                                    setPurposesError("");

                                    try {
                                        const url = selectedGroup === "all" 
                                            ? '/api/loan-purposes' 
                                            : `/api/loan-purposes?groupId=${selectedGroup}`;

                                        const response = await fetch(url);

                                        if (!response.ok) {
                                            throw new Error('Failed to fetch loan purposes');
                                        }

                                        const data = await response.json();

                                        const processedPurposes = data.purposes.map((purpose: any) => ({
                                            ...purpose,
                                            icon: getIconByName(purpose.iconName)
                                        }));

                                        setLoanPurposes(processedPurposes);
                                        setPurposeTrendData(data.trendData);
                                    } catch (error) {
                                        console.error('Error fetching loan purposes:', error);
                                        setPurposesError("Failed to load loan purposes. Please try again.");
                                    } finally {
                                        setIsLoadingPurposes(false);
                                    }
                                };

                                fetchLoanPurposes();
                            }}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                {/* Purpose View Modes */}
                {/* Display message when no purposes match the filters */}
                {!isLoadingPurposes && !purposesError && amountFilteredPurposes.length === 0 && (
                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-8 text-center mb-6">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <h4 className="text-base font-medium mb-1">No loan purposes found</h4>
                        <p className="text-sm text-muted-foreground">
                            {selectedGroup !== "all" 
                                ? "There are no loan purposes in the selected group that match your filters." 
                                : "There are no loan purposes that match your filters."}
                        </p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => {
                                setSelectedGroup("all");
                                setSelectedPurpose(null);
                                setAmountRange([0, 5000]);
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}

                {!isLoadingPurposes && !purposesError && purposeViewMode === "grid" && amountFilteredPurposes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {amountFilteredPurposes.map((purpose, index) => (
                            <div
                                key={purpose.id}
                                className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-10 w-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: `${purpose.color}20`, color: purpose.color }}
                                        >
                                            {purpose.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">{purpose.name}</h4>
                                            <p className="text-xs text-muted-foreground">{purpose.description}</p>
                                            {/* Group indicator - only show when viewing all groups */}
                                            {selectedGroup === "all" && (
                                                <div className="mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {groups.find(g => g.id === purpose.groupId)?.name || "Unknown Group"}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Badge
                                        variant={purpose.trendDirection === "up" ? "outline" : "secondary"}
                                        className={cn(
                                            "text-xs rounded-sm px-1.5 py-0",
                                            purpose.trendDirection === "up"
                                                ? "text-green-500 border-green-200"
                                                : purpose.trendDirection === "down"
                                                    ? "text-red-500 border-red-200"
                                                    : "",
                                        )}
                                    >
                                        {purpose.trendDirection === "up" ? (
                                            <TrendingUp className="h-3 w-3 mr-0.5" />
                                        ) : purpose.trendDirection === "down" ? (
                                            <TrendingDown className="h-3 w-3 mr-0.5" />
                                        ) : null}
                                        {purpose.trend}
                                    </Badge>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="bg-muted/30 p-2 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Loans</div>
                                        <div className="text-lg font-bold mt-0.5">{purpose.value}</div>
                                    </div>
                                    <div className="bg-muted/30 p-2 rounded-lg">
                                        <div className="text-xs text-muted-foreground">Success Rate</div>
                                        <div className="text-lg font-bold mt-0.5">{purpose.successRate}%</div>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Average Amount:</span>
                                        <span className="font-medium">${purpose.avgAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Total Amount:</span>
                                        <span className="font-medium">${purpose.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Interest Rate:</span>
                                        <span className="font-medium">{purpose.interestRate}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Risk Level:</span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-xs rounded-sm px-1.5 py-0",
                                                purpose.riskLevel === "Low" || purpose.riskLevel === "Very Low"
                                                    ? "text-green-500 border-green-200"
                                                    : purpose.riskLevel === "Medium"
                                                        ? "text-amber-500 border-amber-200"
                                                        : "text-red-500 border-red-200"
                                            )}
                                        >
                                            {purpose.riskLevel}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-border/50">
                                    <div className="text-xs text-muted-foreground mb-1.5">Top Contributors:</div>
                                    <div className="flex items-center gap-2">
                                        {purpose.topContributors.map((contributor, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {contributor}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-3 text-xs justify-start p-0 h-auto hover:bg-transparent hover:underline w-full"
                                >
                                    View detailed analysis
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoadingPurposes && !purposesError && purposeViewMode === "list" && amountFilteredPurposes.length > 0 && (
                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 shadow-sm mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-xs font-medium text-left p-3">Purpose</th>
                                        <th className="text-xs font-medium text-left p-3">Loans</th>
                                        <th className="text-xs font-medium text-left p-3">Avg. Amount</th>
                                        <th className="text-xs font-medium text-left p-3">Success Rate</th>
                                        <th className="text-xs font-medium text-left p-3">Trend</th>
                                        <th className="text-xs font-medium text-left p-3">Risk Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amountFilteredPurposes.map((purpose) => (
                                        <tr 
                                            key={purpose.id} 
                                            className="border-b border-border/50 hover:bg-muted/20 cursor-pointer"
                                            onClick={() => console.log(`View detailed analysis for ${purpose.name}`)}
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-6 w-6 rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: `${purpose.color}20`, color: purpose.color }}
                                                    >
                                                        {purpose.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">{purpose.name}</div>
                                                        <div className="text-xs text-muted-foreground">{purpose.description}</div>
                                                        {/* Group indicator - only show when viewing all groups */}
                                                        {selectedGroup === "all" && (
                                                            <div className="mt-1">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {groups.find(g => g.id === purpose.groupId)?.name || "Unknown Group"}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">{purpose.value}</td>
                                            <td className="p-3 text-sm">${purpose.avgAmount.toLocaleString()}</td>
                                            <td className="p-3 text-sm">{purpose.successRate}%</td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={purpose.trendDirection === "up" ? "outline" : "secondary"}
                                                    className={cn(
                                                        "text-xs rounded-sm px-1.5 py-0",
                                                        purpose.trendDirection === "up"
                                                            ? "text-green-500 border-green-200"
                                                            : purpose.trendDirection === "down"
                                                                ? "text-red-500 border-red-200"
                                                                : "",
                                                    )}
                                                >
                                                    {purpose.trendDirection === "up" ? (
                                                        <TrendingUp className="h-3 w-3 mr-0.5" />
                                                    ) : purpose.trendDirection === "down" ? (
                                                        <TrendingDown className="h-3 w-3 mr-0.5" />
                                                    ) : null}
                                                    {purpose.trend}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs rounded-sm px-1.5 py-0",
                                                        purpose.riskLevel === "Low" || purpose.riskLevel === "Very Low"
                                                            ? "text-green-500 border-green-200"
                                                            : purpose.riskLevel === "Medium"
                                                                ? "text-amber-500 border-amber-200"
                                                                : "text-red-500 border-red-200"
                                                    )}
                                                >
                                                    {purpose.riskLevel}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {!isLoadingPurposes && !purposesError && purposeViewMode === "chart" && amountFilteredPurposes.length > 0 && (
                    <div className="space-y-6 mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Donut Chart */}
                            <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                                <h4 className="text-sm font-medium mb-4">Loan Purpose Distribution</h4>
                                <div className="h-[300px]">
                                    <DonutChart
                                        data={amountFilteredPurposes.map(purpose => ({
                                            name: purpose.name,
                                            value: purpose.value
                                        }))}
                                        category="value"
                                        index="name"
                                        valueFormatter={(value) => `${value} loans`}
                                        colors={amountFilteredPurposes.map(purpose => purpose.color)}
                                        className="h-full"
                                    />
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                                <h4 className="text-sm font-medium mb-4">Average Loan Amount by Purpose</h4>
                                <div className="h-[300px]">
                                    <ChartBar
                                        data={amountFilteredPurposes.map(purpose => ({
                                            name: purpose.name,
                                            "Average Amount": purpose.avgAmount
                                        }))}
                                        index="name"
                                        categories={["Average Amount"]}
                                        colors={["blue"]}
                                        valueFormatter={(value) => `$${value.toLocaleString()}`}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                            <h4 className="text-sm font-medium mb-4">Loan Purpose Trends Over Time</h4>
                            <div className="h-[300px]">
                                <ChartLine
                                    data={purposeTrendData}
                                    index="month"
                                    categories={amountFilteredPurposes.map(purpose => purpose.name)}
                                    colors={amountFilteredPurposes.map(purpose => purpose.color)}
                                    valueFormatter={(value) => `${value} loans`}
                                    className="h-full"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
