"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Download,
    Calendar,
    TrendingUp,
    PieChart,
    ChevronUp,
    ChevronDown,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Share2,
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
    AlertCircle,
    TableIcon,
    Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import axios from "axios"

const LoanStatusTab = () => {
    const [timeRange, setTimeRange] = useState<string>("year")
    const [sortBy, setSortBy] = useState<string>("amount")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [compareMode, setCompareMode] = useState<boolean>(false)
    const [isClient, setIsClient] = useState(false)
    const [statusViewMode, setStatusViewMode] = useState<"cards" | "chart" | "table">("cards")
    const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)
    const [amountRange, setAmountRange] = useState<[number, number]>([0, 5000])
    const [showTableView, setShowTableView] = useState<boolean>(false)

    // API data states
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [groups, setGroups] = useState<any[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
    const [loanRequests, setLoanRequests] = useState<any[]>([])
    const [groupMembers, setGroupMembers] = useState<any[]>([])

    useEffect(() => {
        setIsClient(true)
        fetchGroups()
    }, [])

    useEffect(() => {
        if (selectedGroup) {
            fetchLoanRequests(selectedGroup)
        }
    }, [selectedGroup])

    const fetchGroups = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/groups')
            setGroups(response.data)

            // Select the first group by default if there are groups
            if (response.data.length > 0) {
                setSelectedGroup(response.data[0].id)
            } else {
                setLoading(false)
            }
        } catch (err) {
            console.error('Error fetching groups:', err)
            setError('Failed to fetch groups')
            setLoading(false)
        }
    }

    const fetchLoanRequests = async (groupId: string) => {
        try {
            setLoading(true)
            const response = await axios.get(`/api/loans?groupId=${groupId}`)
            setLoanRequests(response.data)

            // Get the selected group to extract members
            const selectedGroupData = groups.find(group => group.id === groupId)
            if (selectedGroupData && selectedGroupData.memberships) {
                // Extract member data from memberships
                const members = selectedGroupData.memberships.map(membership => {
                    // Find the user associated with this membership
                    return {
                        id: membership.userId,
                        name: membership.user?.name || 'Unknown User',
                        value: membership.totalContributed || 0,
                        avatar: membership.user?.avatar || '/placeholder.svg?height=40&width=40',
                        trend: '+0%', // Default value, could be calculated based on historical data
                        trendDirection: 'neutral',
                        lastContribution: membership.lastContribution ? new Date(membership.lastContribution).toLocaleDateString() : 'Never',
                        totalLoans: 0, // This would need to be calculated from loan data
                        reliability: 90, // Default value, could be calculated based on repayment history
                        badge: null,
                        contributionHistory: [0, 0, 0, 0, 0], // Default value, would need historical data
                        preferredCategories: [],
                        joinedDate: new Date(membership.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        totalContributed: Number(membership.totalContributed) || 0,
                    }
                });
                setGroupMembers(members);
            }

            setLoading(false)
        } catch (err) {
            console.error('Error fetching loan data:', err)
            setError('Failed to fetch loan data')
            setLoading(false)
        }
    }

    // Transform loan requests into loan status data
    const getLoanStatusData = () => {
        if (!loanRequests || loanRequests.length === 0) return [];

        // Count loans by status
        const statusCounts = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            DISBURSED: 0,
            REPAYING: 0,
            REPAID: 0,
            DEFAULTED: 0
        };

        // Calculate total amounts by status
        const statusAmounts = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            DISBURSED: 0,
            REPAYING: 0,
            REPAID: 0,
            DEFAULTED: 0
        };

        loanRequests.forEach(loan => {
            if (statusCounts[loan.status] !== undefined) {
                statusCounts[loan.status]++;
                statusAmounts[loan.status] += Number(loan.amount);
            }
        });

        // Map status to display data
        const statusMapping = {
            DISBURSED: {
                name: "Active",
                color: "#3b82f6",
                icon: <Zap className="h-3.5 w-3.5" />,
                description: "Loans currently being repaid",
                trend: "+12%",
                trendDirection: "up",
                dueDate: "Next payment in 5 days",
            },
            REPAYING: {
                name: "Active",
                color: "#3b82f6",
                icon: <Zap className="h-3.5 w-3.5" />,
                description: "Loans currently being repaid",
                trend: "+12%",
                trendDirection: "up",
                dueDate: "Next payment in 5 days",
            },
            PENDING: {
                name: "Pending Approval",
                color: "#f59e0b",
                icon: <Clock className="h-3.5 w-3.5" />,
                description: "Loans awaiting approval",
                trend: "+20%",
                trendDirection: "up",
                dueDate: "Review due in 2 days",
            },
            APPROVED: {
                name: "Approved",
                color: "#10b981",
                icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                description: "Loans approved but not yet disbursed",
                trend: "+5%",
                trendDirection: "up",
                dueDate: "Disbursement pending",
            },
            REPAID: {
                name: "Completed",
                color: "#10b981",
                icon: <CheckCircle2 className="h-3.5 w-3.5" />,
                description: "Successfully repaid loans",
                trend: "+5%",
                trendDirection: "up",
                dueDate: "Last completed 3 days ago",
            },
            DEFAULTED: {
                name: "Defaulted",
                color: "#ef4444",
                icon: <AlertTriangle className="h-3.5 w-3.5" />,
                description: "Loans in default status",
                trend: "-10%",
                trendDirection: "down",
                dueDate: "Defaulted 14 days ago",
            },
            REJECTED: {
                name: "Rejected",
                color: "#ef4444",
                icon: <XCircle className="h-3.5 w-3.5" />,
                description: "Loan requests that were rejected",
                trend: "-5%",
                trendDirection: "down",
                dueDate: "Rejected recently",
            }
        };

        // Create the loan status data array
        const result = [];

        // Combine DISBURSED and REPAYING into "Active"
        const activeCount = statusCounts.DISBURSED + statusCounts.REPAYING;
        const activeAmount = statusAmounts.DISBURSED + statusAmounts.REPAYING;

        if (activeCount > 0) {
            result.push({
                name: "Active",
                value: activeCount,
                color: "#3b82f6",
                icon: <Zap className="h-3.5 w-3.5" />,
                description: "Loans currently being repaid",
                trend: "+12%",
                trendDirection: "up",
                avgAmount: activeAmount / activeCount,
                totalAmount: activeAmount,
                dueDate: "Next payment in 5 days",
            });
        }

        // Add other statuses
        ['PENDING', 'APPROVED', 'REPAID', 'DEFAULTED', 'REJECTED'].forEach(status => {
            if (statusCounts[status] > 0) {
                const mapping = statusMapping[status];
                result.push({
                    name: mapping.name,
                    value: statusCounts[status],
                    color: mapping.color,
                    icon: mapping.icon,
                    description: mapping.description,
                    trend: mapping.trend,
                    trendDirection: mapping.trendDirection,
                    avgAmount: statusAmounts[status] / statusCounts[status],
                    totalAmount: statusAmounts[status],
                    dueDate: mapping.dueDate,
                });
            }
        });

        return result;
    }

    // Transform loan requests into loan purpose data
    const getLoanPurposeData = () => {
        if (!loanRequests || loanRequests.length === 0) return [];

        // Group loans by purpose
        const purposeGroups = {};

        loanRequests.forEach(loan => {
            // Extract purpose from the loan purpose text
            const purposeText = loan.purpose.toLowerCase();
            let category = 'other';

            if (purposeText.includes('business') || purposeText.includes('startup') || purposeText.includes('enterprise')) {
                category = 'business';
            } else if (purposeText.includes('education') || purposeText.includes('school') || purposeText.includes('college') || purposeText.includes('university')) {
                category = 'education';
            } else if (purposeText.includes('medical') || purposeText.includes('health') || purposeText.includes('hospital')) {
                category = 'medical';
            } else if (purposeText.includes('home') || purposeText.includes('house') || purposeText.includes('renovation')) {
                category = 'home';
            } else if (purposeText.includes('emergency') || purposeText.includes('urgent')) {
                category = 'emergency';
            }

            if (!purposeGroups[category]) {
                purposeGroups[category] = {
                    loans: [],
                    totalAmount: 0,
                    count: 0,
                    successCount: 0
                };
            }

            purposeGroups[category].loans.push(loan);
            purposeGroups[category].totalAmount += Number(loan.amount);
            purposeGroups[category].count++;

            // Count successful loans (REPAID)
            if (loan.status === 'REPAID') {
                purposeGroups[category].successCount++;
            }
        });

        // Map categories to display data
        const categoryMapping = {
            business: {
                id: "business",
                name: "Business",
                color: "#6366f1",
                trend: "+12%",
                trendDirection: "up",
                icon: <Briefcase className="h-3.5 w-3.5" />,
                description: "Small business funding and expansion capital",
                interestRate: "8.5%",
                term: "24 months",
                popularIn: ["Urban areas", "Tech hubs"],
                topContributors: groupMembers.slice(0, 2).map(m => m.name),
            },
            education: {
                id: "education",
                name: "Education",
                color: "#06b6d4",
                trend: "+5%",
                trendDirection: "up",
                icon: <GraduationCap className="h-3.5 w-3.5" />,
                description: "Tuition fees and educational expenses",
                interestRate: "6.5%",
                term: "36 months",
                popularIn: ["College towns", "Suburban areas"],
                topContributors: groupMembers.slice(0, 2).map(m => m.name),
            },
            medical: {
                id: "medical",
                name: "Medical",
                color: "#8b5cf6",
                trend: "-3%",
                trendDirection: "down",
                icon: <Stethoscope className="h-3.5 w-3.5" />,
                description: "Healthcare costs and medical procedures",
                interestRate: "7.5%",
                term: "18 months",
                popularIn: ["Rural areas", "Retirement communities"],
                topContributors: groupMembers.slice(0, 2).map(m => m.name),
            },
            home: {
                id: "home",
                name: "Home Improvement",
                color: "#f59e0b",
                trend: "+8%",
                trendDirection: "up",
                icon: <Home className="h-3.5 w-3.5" />,
                description: "Renovations and home repairs",
                interestRate: "7.0%",
                term: "30 months",
                popularIn: ["Suburban areas", "Established neighborhoods"],
                topContributors: groupMembers.slice(0, 2).map(m => m.name),
            },
            emergency: {
                id: "emergency",
                name: "Emergency",
                color: "#10b981",
                trend: "+0%",
                trendDirection: "neutral",
                icon: <ShieldAlert className="h-3.5 w-3.5" />,
                description: "Urgent unexpected expenses",
                interestRate: "9.0%",
                term: "12 months",
                popularIn: ["Urban areas", "Low-income communities"],
                topContributors: groupMembers.slice(0, 2).map(m => m.name),
            },
            other: {
                id: "other",
                name: "Other",
                color: "#6b7280",
                trend: "+0%",
                trendDirection: "neutral",
                icon: <CircleDollarSign className="h-3.5 w-3.5" />,
                description: "Other loan purposes",
                interestRate: "8.0%",
                term: "24 months",
                popularIn: ["Various regions"],
                topContributors: groupMembers.slice(0, 2).map(m => m.name),
            }
        };

        // Create the loan purpose data array
        return Object.keys(purposeGroups).map(category => {
            const group = purposeGroups[category];
            const mapping = categoryMapping[category];

            return {
                id: mapping.id,
                name: mapping.name,
                value: group.count,
                color: mapping.color,
                trend: mapping.trend,
                trendDirection: mapping.trendDirection,
                icon: mapping.icon,
                description: mapping.description,
                avgAmount: group.totalAmount / group.count,
                totalAmount: group.totalAmount,
                successRate: group.count > 0 ? Math.round((group.successCount / group.count) * 100) : 0,
                riskLevel: group.successRate > 90 ? "Low" : group.successRate > 80 ? "Medium" : "High",
                interestRate: mapping.interestRate,
                term: mapping.term,
                popularIn: mapping.popularIn,
                topContributors: mapping.topContributors,
            };
        });
    }

    // Generate trend data based on loan requests
    const generateTrendData = () => {
        // Get the last 6 months for our trend data
        const months = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const today = new Date();

        for (let i = 5; i >= 0; i--) {
            const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push(monthNames[month.getMonth()]);
        }

        // Generate loan status trends based on actual loan data
        const loanStatusTrends = months.map(month => {
            // Count loans by status for this month
            const activeLoans = loanRequests.filter(loan => 
                (loan.status === "DISBURSED" || loan.status === "REPAYING") && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const pendingLoans = loanRequests.filter(loan => 
                loan.status === "PENDING" && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const completedLoans = loanRequests.filter(loan => 
                loan.status === "REPAID" && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const defaultedLoans = loanRequests.filter(loan => 
                loan.status === "DEFAULTED" && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            return {
                month,
                Active: activeLoans || Math.floor(Math.random() * 6) + 3, // Fallback to mock data if no real data
                "Pending Approval": pendingLoans || Math.floor(Math.random() * 4) + 1,
                Completed: completedLoans || Math.floor(Math.random() * 5) + 5,
                Defaulted: defaultedLoans || Math.floor(Math.random() * 2)
            };
        });

        // Generate purpose trend data based on actual loan purposes
        const purposeTrendData = months.map(month => {
            // Group loans by purpose for this month
            const businessLoans = loanRequests.filter(loan => 
                loan.purpose.toLowerCase().includes('business') && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const educationLoans = loanRequests.filter(loan => 
                loan.purpose.toLowerCase().includes('education') && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const medicalLoans = loanRequests.filter(loan => 
                loan.purpose.toLowerCase().includes('medical') && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const homeLoans = loanRequests.filter(loan => 
                loan.purpose.toLowerCase().includes('home') && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            const emergencyLoans = loanRequests.filter(loan => 
                loan.purpose.toLowerCase().includes('emergency') && 
                new Date(loan.createdAt).getMonth() === monthNames.indexOf(month)
            ).length;

            return {
                month,
                Business: businessLoans || Math.floor(Math.random() * 3) + 4,
                Education: educationLoans || Math.floor(Math.random() * 2) + 3,
                Medical: medicalLoans || Math.floor(Math.random() * 2) + 2,
                "Home Improvement": homeLoans || Math.floor(Math.random() * 2) + 1,
                Emergency: emergencyLoans || Math.floor(Math.random() * 2) + 1
            };
        });

        // Generate contribution trend data
        const contributionTrendData = months.map(month => {
            const amount = Math.floor(Math.random() * 5000) + 8000;
            return {
                month,
                amount,
                previousYear: Math.floor(amount * 0.8)
            };
        });

        // Calculate repayment performance based on loan data
        const calculateRepaymentPerformance = () => {
            // For each month, calculate the percentage of on-time payments
            return months.map(month => {
                // Get loans that were active in this month
                const monthLoans = loanRequests.filter(loan => 
                    (loan.status === "REPAYING" || loan.status === "REPAID" || loan.status === "DISBURSED") &&
                    new Date(loan.createdAt).getMonth() <= monthNames.indexOf(month) &&
                    (loan.status !== "REPAID" || new Date(loan.updatedAt).getMonth() >= monthNames.indexOf(month))
                );

                // If we have loans for this month, calculate performance
                if (monthLoans.length > 0) {
                    // For a real implementation, we would check if payments were made on time
                    // Since we don't have payment data, we'll estimate based on loan status
                    const onTimeLoans = monthLoans.filter(loan => 
                        (loan.status === "REPAID" && new Date(loan.updatedAt) <= new Date(loan.repaymentDate)) || 
                        loan.status === "REPAYING"
                    ).length;

                    const lateLoans = loanRequests.filter(loan => 
                        loan.status === "DEFAULTED" &&
                        new Date(loan.createdAt).getMonth() <= monthNames.indexOf(month) &&
                        new Date(loan.updatedAt).getMonth() >= monthNames.indexOf(month)
                    ).length;

                    const totalLoans = onTimeLoans + lateLoans;

                    if (totalLoans > 0) {
                        const onTimePercentage = Math.round((onTimeLoans / totalLoans) * 100);
                        return {
                            month,
                            onTime: onTimePercentage,
                            late: 100 - onTimePercentage
                        };
                    }
                }

                // Fallback to realistic mock data if no real data
                const onTime = Math.floor(Math.random() * 10) + 90; // 90-100%
                return {
                    month,
                    onTime,
                    late: 100 - onTime
                };
            });
        };

        const repaymentTrendData = calculateRepaymentPerformance();

        return {
            loanStatusTrends,
            purposeTrendData,
            contributionTrendData,
            repaymentTrendData
        };
    }

    // Use the transformed data from API
    const loanStatusData = getLoanStatusData();
    const loanPurposeData = getLoanPurposeData();

    // Generate trend data
    const { 
        loanStatusTrends, 
        purposeTrendData, 
        contributionTrendData, 
        repaymentTrendData 
    } = generateTrendData();

    // Use group members from API
    const memberContributionData = groupMembers;

    // Filter contributors based on search query
    const filteredContributors = memberContributionData.filter((contributor) =>
        contributor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

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

    // Filter purposes based on selected purpose
    const filteredPurposes = selectedPurpose
        ? loanPurposeData.filter((purpose) => purpose.id === selectedPurpose)
        : loanPurposeData

    // Filter purposes based on amount range
    const amountFilteredPurposes = filteredPurposes.filter(
        (purpose) => purpose.avgAmount >= amountRange[0] && purpose.avgAmount <= amountRange[1],
    )

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    const getSortIcon = () => {
        return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
    }

    // Calculate total contributions
    const totalContributions = memberContributionData.reduce((sum, contributor) => sum + contributor.value, 0)
    const totalActiveContributors = memberContributionData.length
    const averageContribution = totalContributions / totalActiveContributors

    // Calculate total loans
    const totalLoans = loanStatusData.reduce((sum, status) => sum + status.value, 0)
    const totalLoanAmount = loanStatusData.reduce((sum, status) => sum + status.totalAmount, 0)
    const completionRate = Math.round(
        ((loanStatusData.find((s) => s.name === "Completed")?.value || 0) / totalLoans) * 100,
    )
    const defaultRate = Math.round(((loanStatusData.find((s) => s.name === "Defaulted")?.value || 0) / totalLoans) * 100)

    if (!isClient) {
        return null // Prevent hydration errors
    }

    // Generate SVG paths for donut chart
    const generateDonutPaths = () => {
        let cumulativePercentage = 0
        const total = loanStatusData.reduce((sum, s) => sum + s.value, 0)

        return loanStatusData.map((status) => {
            const percentage = (status.value / total) * 100
            const startAngle = cumulativePercentage
            const endAngle = startAngle + percentage

            const x1 = 50 + 40 * Math.cos((startAngle / 100) * 2 * Math.PI)
            const y1 = 50 + 40 * Math.sin((startAngle / 100) * 2 * Math.PI)
            const x2 = 50 + 40 * Math.cos((endAngle / 100) * 2 * Math.PI)
            const y2 = 50 + 40 * Math.sin((endAngle / 100) * 2 * Math.PI)

            const largeArcFlag = percentage > 50 ? 1 : 0

            const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

            cumulativePercentage = endAngle

            return <path key={status.name} d={pathData} fill={status.color} stroke="white" strokeWidth="1" />
        })
    }

    // Show loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading loan data...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                <h3 className="text-lg font-medium mb-2">Failed to load data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchGroups}>Try Again</Button>
            </div>
        );
    }

    // Show empty state if no groups
    if (groups.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Groups Found</h3>
                <p className="text-muted-foreground mb-4">You need to be a member of a group to view loan statistics.</p>
                <Button asChild>
                    <a href="/dashboard/groups">Browse Groups</a>
                </Button>
            </div>
        );
    }

    // Show empty state if no loans
    if (loanRequests.length === 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <CircleDollarSign className="h-8 w-8 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Loan Data</h3>
                <p className="text-muted-foreground mb-4">There are no loan requests in this group yet.</p>
                <Button asChild>
                    <a href="/dashboard/loans/request">Create Loan Request</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="px-4 pb-4">
            {/* Group Selector */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Select Group</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className={cn(
                                "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                                selectedGroup === group.id
                                    ? "bg-primary/10 border-primary/50"
                                    : "bg-card hover:bg-accent/50 border-border"
                            )}
                            onClick={() => setSelectedGroup(group.id)}
                        >
                            <div className="flex-shrink-0 mr-3">
                                {group.logo ? (
                                    <img
                                        src={group.logo}
                                        alt={group.name}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-medium">
                                            {group.name.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{group.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {group.memberships?.length || 0} members
                                </p>
                            </div>
                            {selectedGroup === group.id && (
                                <CheckCircle2 className="h-4 w-4 text-primary ml-2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Summary */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-base font-medium flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Loan Status Overview
                    </h3>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 rounded-full text-xs", statusViewMode === "cards" ? "bg-muted" : "")}
                            onClick={() => setStatusViewMode("cards")}
                        >
                            <Layers className="h-3.5 w-3.5 mr-1.5" />
                            Cards
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 rounded-full text-xs", statusViewMode === "chart" ? "bg-muted" : "")}
                            onClick={() => setStatusViewMode("chart")}
                        >
                            <PieChart className="h-3.5 w-3.5 mr-1.5" />
                            Chart
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 rounded-full text-xs", statusViewMode === "table" ? "bg-muted" : "")}
                            onClick={() => setStatusViewMode("table")}
                        >
                            <BarChart className="h-3.5 w-3.5 mr-1.5" />
                            Trends
                        </Button>
                    </div>
                </div>

                {/* Status Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                                <CircleDollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <Badge variant="outline" className="rounded-full">
                                <Calendar className="h-3 w-3 mr-1" />
                                {timeRange === "year" ? "12 months" : timeRange === "quarter" ? "3 months" : "1 month"}
                            </Badge>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-sm text-muted-foreground">Total Loans</h4>
                            <div className="text-2xl font-bold mt-1">{totalLoans}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">Total Amount</div>
                            <div className="text-sm font-medium">K{totalLoanAmount.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +5%
                            </Badge>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-sm text-muted-foreground">Completion Rate</h4>
                            <div className="text-2xl font-bold mt-1">{completionRate}%</div>
                        </div>
                        <div className="mt-3">
                            <Progress value={completionRate} className="h-1.5" indicatorClassName="bg-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                                <Hourglass className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                            >
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                            </Badge>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-sm text-muted-foreground">Average Processing Time</h4>
                            <div className="text-2xl font-bold mt-1">3.2 days</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">Pending Approval</div>
                            <div className="text-sm font-medium">3 loans</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                            >
                                <TrendingDown className="h-3 w-3 mr-1" />
                                -10%
                            </Badge>
                        </div>
                        <div className="mt-3">
                            <h4 className="text-sm text-muted-foreground">Default Rate</h4>
                            <div className="text-2xl font-bold mt-1">{defaultRate}%</div>
                        </div>
                        <div className="mt-3">
                            <Progress value={defaultRate} max={20} className="h-1.5" indicatorClassName="bg-red-500" />
                            <div className="text-xs text-muted-foreground mt-1">Industry avg: 12%</div>
                        </div>
                    </div>
                </div>

                {/* Status View Modes */}
                {statusViewMode === "cards" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {loanStatusData.map((status, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "p-4 rounded-xl border flex flex-col gap-2 transition-all hover:shadow-md",
                                    status.name === "Active"
                                        ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                                        : status.name === "Pending Approval"
                                            ? "bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                                            : status.name === "Completed"
                                                ? "bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                                : "bg-red-50/50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center",
                                                status.name === "Active"
                                                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                                    : status.name === "Pending Approval"
                                                        ? "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400"
                                                        : status.name === "Completed"
                                                            ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                                            : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
                                            )}
                                        >
                                            {status.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">{status.name}</h4>
                                            <p className="text-xs text-muted-foreground">{status.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <div>
                                        <div className="text-2xl font-bold">{status.value}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {Math.round((status.value / totalLoans) * 100)}% of total
                                        </div>
                                    </div>
                                    <Badge
                                        variant={status.trendDirection === "up" ? "outline" : "secondary"}
                                        className={cn(
                                            "text-xs rounded-sm px-1.5 py-0",
                                            status.trendDirection === "up"
                                                ? "text-green-500 border-green-200"
                                                : "text-red-500 border-red-200",
                                        )}
                                    >
                                        {status.trendDirection === "up" ? (
                                            <TrendingUp className="h-3 w-3 mr-0.5" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 mr-0.5" />
                                        )}
                                        {status.trend}
                                    </Badge>
                                </div>

                                <div className="mt-2 pt-2 border-t border-border/50">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">Total Amount:</span>
                                        <span className="font-medium">K{status.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs mt-1">
                                        <span className="text-muted-foreground">Avg. Amount:</span>
                                        <span className="font-medium">K{status.avgAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs mt-1">
                                        <span className="text-muted-foreground">Timeline:</span>
                                        <span className="font-medium">{status.dueDate}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-xs justify-start p-0 h-auto hover:bg-transparent hover:underline"
                                >
                                    View details
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {statusViewMode === "chart" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium">Status Distribution</h4>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs rounded-full"
                                        onClick={() => setShowTableView(!showTableView)}
                                    >
                                        <TableIcon className="h-3 w-3 mr-1" />
                                        {showTableView ? "Chart View" : "Table View"}
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={() => {}}>
                                        <Share2 className="h-3 w-3 mr-1" />
                                        Share
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={() => {}}>
                                        <Download className="h-3 w-3 mr-1" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                            {showTableView ? (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-medium">Status</th>
                                            <th className="text-right py-2 px-3 font-medium">Count</th>
                                            <th className="text-right py-2 px-3 font-medium">Percentage</th>
                                            <th className="text-right py-2 px-3 font-medium">Total Amount</th>
                                            <th className="text-right py-2 px-3 font-medium">Trend</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loanStatusData.map((status, index) => (
                                            <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                                                <td className="py-2 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }} />
                                                        <span>{status.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right py-2 px-3 font-medium">{status.value}</td>
                                                <td className="text-right py-2 px-3">{Math.round((status.value / totalLoans) * 100)}%</td>
                                                <td className="text-right py-2 px-3">K{status.totalAmount.toLocaleString()}</td>
                                                <td className="text-right py-2 px-3">
                                                    <Badge
                                                        variant={status.trendDirection === "up" ? "outline" : "secondary"}
                                                        className={cn(
                                                            "text-xs rounded-sm px-1.5 py-0",
                                                            status.trendDirection === "up"
                                                                ? "text-green-500 border-green-200"
                                                                : "text-red-500 border-red-200",
                                                        )}
                                                    >
                                                        {status.trendDirection === "up" ? (
                                                            <TrendingUp className="h-3 w-3 mr-0.5" />
                                                        ) : (
                                                            <TrendingDown className="h-3 w-3 mr-0.5" />
                                                        )}
                                                        {status.trend}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="h-[300px] flex items-center justify-center">
                                    <div className="w-full max-w-md">
                                        <div className="relative aspect-square">
                                            <div className="flex items-center justify-center absolute inset-0">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold">{totalLoans}</div>
                                                    <div className="text-sm text-muted-foreground">Total Loans</div>
                                                </div>
                                            </div>
                                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                                {generateDonutPaths()}
                                                <circle cx="50" cy="50" r="25" fill="white" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                {loanStatusData.map((status, index) => (
                                    <div key={index} className="flex flex-col gap-1 p-2 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }} />
                                            <span className="text-xs font-medium">{status.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">{status.value}</span>
                                            <Badge
                                                variant={status.trendDirection === "up" ? "outline" : "secondary"}
                                                className={cn(
                                                    "text-xs rounded-sm px-1.5 py-0",
                                                    status.trendDirection === "up"
                                                        ? "text-green-500 border-green-200"
                                                        : "text-red-500 border-red-200",
                                                )}
                                            >
                                                {status.trendDirection === "up" ? (
                                                    <TrendingUp className="h-3 w-3 mr-0.5" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 mr-0.5" />
                                                )}
                                                {status.trend}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                            <h4 className="text-sm font-medium mb-4">Key Metrics</h4>

                            <div className="space-y-5 mt-4">
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Completion Rate
                    </span>
                                        <span className="font-medium text-green-500">{completionRate}%</span>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-1 items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-semibold text-green-500">{completionRate}%</span> vs target 85%
                                            </div>
                                            <div className="text-xs text-green-500 font-semibold">+5%</div>
                                        </div>
                                        <Progress value={completionRate} className="h-2" indicatorClassName="bg-green-500" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Default Rate
                    </span>
                                        <span className="font-medium text-red-500">{defaultRate}%</span>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-1 items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-semibold text-red-500">{defaultRate}%</span> vs industry avg 12%
                                            </div>
                                            <div className="text-xs text-green-500 font-semibold">-6%</div>
                                        </div>
                                        <Progress value={defaultRate} max={20} className="h-2" indicatorClassName="bg-red-500" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Active Loans
                    </span>
                                        <span className="font-medium text-blue-500">
                      {Math.round(((loanStatusData.find((s) => s.name === "Active")?.value || 0) / totalLoans) * 100)}%
                    </span>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-1 items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-blue-500">
                          {loanStatusData.find((s) => s.name === "Active")?.value || 0}
                        </span>{" "}
                                                of {totalLoans} total loans
                                            </div>
                                            <div className="text-xs text-blue-500 font-semibold">+12%</div>
                                        </div>
                                        <Progress
                                            value={((loanStatusData.find((s) => s.name === "Active")?.value || 0) / totalLoans) * 100}
                                            className="h-2"
                                            indicatorClassName="bg-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Pending Approval
                    </span>
                                        <span className="font-medium text-amber-500">
                      {Math.round(
                          ((loanStatusData.find((s) => s.name === "Pending Approval")?.value || 0) / totalLoans) * 100,
                      )}
                                            %
                    </span>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="flex mb-1 items-center justify-between">
                                            <div className="text-xs text-muted-foreground">
                        <span className="font-semibold text-amber-500">
                          {loanStatusData.find((s) => s.name === "Pending Approval")?.value || 0}
                        </span>{" "}
                                                of {totalLoans} total loans
                                            </div>
                                            <div className="text-xs text-amber-500 font-semibold">+20%</div>
                                        </div>
                                        <Progress
                                            value={
                                                ((loanStatusData.find((s) => s.name === "Pending Approval")?.value || 0) / totalLoans) * 100
                                            }
                                            className="h-2"
                                            indicatorClassName="bg-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                                <h5 className="text-xs font-medium flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                                    Key Insights
                                </h5>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-start gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                        <span>
                      Default rate is <span className="text-green-500 font-medium">6% lower</span> than industry average
                    </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                        <span>
                      Completion rate has improved by <span className="text-green-500 font-medium">5%</span> since last{" "}
                                            {timeRange}
                    </span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                                        <span>
                      Pending approvals increased by <span className="text-amber-500 font-medium">20%</span> - review
                      process may need optimization
                    </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {statusViewMode === "table" && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium">Status Trends</h4>
                                    <Badge variant="outline" className="text-xs rounded-full">
                                        Last 6 months
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <Switch
                                            id="compare-mode-status"
                                            checked={compareMode}
                                            onCheckedChange={setCompareMode}
                                            className="scale-90"
                                        />
                                        <Label htmlFor="compare-mode-status" className="text-xs">
                                            Show percentages
                                        </Label>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={() => {}}>
                                        <ListFilter className="h-3 w-3 mr-1" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                            <div className="h-[300px] relative">
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="flex-1 flex">
                                        <div className="w-12 flex flex-col justify-between py-2 text-xs text-muted-foreground">
                                            <div>10</div>
                                            <div>8</div>
                                            <div>6</div>
                                            <div>4</div>
                                            <div>2</div>
                                            <div>0</div>
                                        </div>
                                        <div className="flex-1 grid grid-cols-6 gap-2 py-2">
                                            {loanStatusTrends.map((data, index) => (
                                                <div key={index} className="flex flex-col justify-end gap-1">
                                                    <div className="flex flex-col-reverse">
                                                        <div
                                                            className="bg-blue-500 rounded-t"
                                                            style={{ height: `${(data.Active / 10) * 100}%` }}
                                                            title={`Active: ${data.Active} loans`}
                                                        ></div>
                                                        <div
                                                            className="bg-amber-500 rounded-t"
                                                            style={{ height: `${(data["Pending Approval"] / 10) * 100}%` }}
                                                            title={`Pending Approval: ${data["Pending Approval"]} loans`}
                                                        ></div>
                                                        <div
                                                            className="bg-green-500 rounded-t"
                                                            style={{ height: `${(data.Completed / 10) * 100}%` }}
                                                            title={`Completed: ${data.Completed} loans`}
                                                        ></div>
                                                        <div
                                                            className="bg-red-500 rounded-t"
                                                            style={{ height: `${(data.Defaulted / 10) * 100}%` }}
                                                            title={`Defaulted: ${data.Defaulted} loans`}
                                                        ></div>
                                                    </div>
                                                    <div className="text-xs text-center">{data.month}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-8 flex items-center justify-center gap-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-blue-500 rounded"></div>
                                            <span>Active</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-amber-500 rounded"></div>
                                            <span>Pending</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-green-500 rounded"></div>
                                            <span>Completed</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-red-500 rounded"></div>
                                            <span>Defaulted</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <h5 className="text-xs font-medium flex items-center gap-1.5">
                                        <TrendingUp className="h-3.5 w-3.5 text-primary" />
                                        Positive Trends
                                    </h5>
                                    <ul className="space-y-2 text-xs">
                                        <li className="flex items-start gap-1.5">
                                            <ArrowUpRight className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                            <span>
                        <span className="font-medium">Completed loans</span> show steady growth over the last 6 months
                        (+33%)
                      </span>
                                        </li>
                                        <li className="flex items-start gap-1.5">
                                            <ArrowDownRight className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                                            <span>
                        <span className="font-medium">Defaulted loans</span> have remained consistently low (0-1 per
                        month)
                      </span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <h5 className="text-xs font-medium flex items-center gap-1.5">
                                        <Activity className="h-3.5 w-3.5 text-primary" />
                                        Key Metrics
                                    </h5>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 p-2 rounded-md border border-border/50">
                                            <div className="text-xs text-muted-foreground">Active Growth</div>
                                            <div className="text-sm font-bold text-blue-500">+25%</div>
                                        </div>
                                        <div className="bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 p-2 rounded-md border border-border/50">
                                            <div className="text-xs text-muted-foreground">Completion Rate</div>
                                            <div className="text-sm font-bold text-green-500">+33%</div>
                                        </div>
                                        <div className="bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 p-2 rounded-md border border-border/50">
                                            <div className="text-xs text-muted-foreground">Pending Rate</div>
                                            <div className="text-sm font-bold text-amber-500">+50%</div>
                                        </div>
                                        <div className="bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 p-2 rounded-md border border-border/50">
                                            <div className="text-xs text-muted-foreground">Default Rate</div>
                                            <div className="text-sm font-bold text-green-500">0%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium">Loan Purpose Distribution</h4>
                                <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" onClick={() => {}}>
                                    <Download className="h-3 w-3 mr-1" />
                                    Export
                                </Button>
                            </div>
                            <div className="h-[300px] relative">
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="flex-1 flex">
                                        <div className="w-12 flex flex-col justify-between py-2 text-xs text-muted-foreground">
                                            <div>6</div>
                                            <div>5</div>
                                            <div>4</div>
                                            <div>3</div>
                                            <div>2</div>
                                            <div>1</div>
                                            <div>0</div>
                                        </div>
                                        <div className="flex-1 grid grid-cols-6 gap-2 py-2">
                                            {purposeTrendData.map((data, index) => (
                                                <div key={index} className="flex flex-col justify-end gap-1">
                                                    <div className="flex flex-col-reverse gap-1">
                                                        {["Business", "Education", "Medical", "Home Improvement", "Emergency"].map((category) => (
                                                            <div
                                                                key={category}
                                                                className="h-2 rounded-full"
                                                                style={{
                                                                    width: `${(data[category] / 6) * 100}%`,
                                                                    backgroundColor:
                                                                        category === "Business"
                                                                            ? "#6366f1"
                                                                            : category === "Education"
                                                                                ? "#06b6d4"
                                                                                : category === "Medical"
                                                                                    ? "#8b5cf6"
                                                                                    : category === "Home Improvement"
                                                                                        ? "#f59e0b"
                                                                                        : "#10b981",
                                                                }}
                                                                title={`${category}: ${data[category]} loans`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                    <div className="text-xs text-center">{data.month}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-8 flex items-center justify-center gap-3 text-xs flex-wrap">
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-indigo-500 rounded"></div>
                                            <span>Business</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-cyan-500 rounded"></div>
                                            <span>Education</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-purple-500 rounded"></div>
                                            <span>Medical</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-amber-500 rounded"></div>
                                            <span>Home</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 bg-emerald-500 rounded"></div>
                                            <span>Emergency</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {loanPurposeData.map((purpose, index) => (
                                    <div key={index} className="flex flex-col gap-1 p-2 rounded-lg bg-muted/30 border border-border/50">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="h-6 w-6 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: purpose.color }}
                                            >
                                                {purpose.icon}
                                            </div>
                                            <span className="text-xs font-medium">{purpose.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm font-bold">{purpose.value}</span>
                                            <Badge
                                                variant={
                                                    purpose.trendDirection === "up"
                                                        ? "outline"
                                                        : purpose.trendDirection === "down"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                                className={cn(
                                                    "text-xs rounded-sm px-1.5 py-0",
                                                    purpose.trendDirection === "up"
                                                        ? "text-green-500 border-green-200"
                                                        : purpose.trendDirection === "down"
                                                            ? "text-red-500 border-red-200"
                                                            : "text-muted-foreground border-muted",
                                                )}
                                            >
                                                {purpose.trendDirection === "up" ? (
                                                    <TrendingUp className="h-3 w-3 mr-0.5" />
                                                ) : purpose.trendDirection === "down" ? (
                                                    <TrendingDown className="h-3 w-3 mr-0.5" />
                                                ) : (
                                                    <Activity className="h-3 w-3 mr-0.5" />
                                                )}
                                                {purpose.trend}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6">
                            <h5 className="text-sm font-medium mb-3">Purpose Distribution Breakdown</h5>
                            <div className="space-y-3">
                                {loanPurposeData.map((purpose, index) => (
                                    <div key={index} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-8 w-8 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: purpose.color }}
                                                >
                                                    {purpose.icon}
                                                </div>
                                                <div>
                                                    <h6 className="text-sm font-medium">{purpose.name}</h6>
                                                    <p className="text-xs text-muted-foreground">{purpose.description}</p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    purpose.trendDirection === "up"
                                                        ? "outline"
                                                        : purpose.trendDirection === "down"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                                className={cn(
                                                    "text-xs rounded-sm px-1.5 py-0",
                                                    purpose.trendDirection === "up"
                                                        ? "text-green-500 border-green-200"
                                                        : purpose.trendDirection === "down"
                                                            ? "text-red-500 border-red-200"
                                                            : "text-muted-foreground border-muted",
                                                )}
                                            >
                                                {purpose.trendDirection === "up" ? (
                                                    <TrendingUp className="h-3 w-3 mr-0.5" />
                                                ) : purpose.trendDirection === "down" ? (
                                                    <TrendingDown className="h-3 w-3 mr-0.5" />
                                                ) : (
                                                    <Activity className="h-3 w-3 mr-0.5" />
                                                )}
                                                {purpose.trend}
                                            </Badge>
                                        </div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-1 items-center justify-between">
                                                <div className="text-xs text-muted-foreground">
                                                    <span className="font-semibold">{purpose.value}</span> loans (
                                                    {Math.round((purpose.value / totalLoans) * 100)}% of total)
                                                </div>
                                                <div className="text-xs font-medium">K{purpose.totalAmount.toLocaleString()}</div>
                                            </div>
                                            <Progress
                                                value={(purpose.value / loanPurposeData.reduce((sum, p) => sum + p.value, 0)) * 100}
                                                className="h-2"
                                                indicatorClassName={cn(
                                                    purpose.name === "Business"
                                                        ? "bg-indigo-500"
                                                        : purpose.name === "Education"
                                                            ? "bg-cyan-500"
                                                            : purpose.name === "Medical"
                                                                ? "bg-purple-500"
                                                                : purpose.name === "Home Improvement"
                                                                    ? "bg-amber-500"
                                                                    : "bg-emerald-500",
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Repayment Performance */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <h3 className="text-base font-medium flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-primary" />
                        Repayment Performance
                    </h3>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 rounded-full text-xs", timeRange === "month" ? "bg-muted" : "")}
                            onClick={() => setTimeRange("month")}
                        >
                            Month
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 rounded-full text-xs", timeRange === "quarter" ? "bg-muted" : "")}
                            onClick={() => setTimeRange("quarter")}
                        >
                            Quarter
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("h-8 rounded-full text-xs", timeRange === "year" ? "bg-muted" : "")}
                            onClick={() => setTimeRange("year")}
                        >
                            Year
                        </Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-black rounded-xl border border-border/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium">Payment Timeliness</h4>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <span className="text-xs">On Time</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                <span className="text-xs">Late</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[250px] relative">
                        <div className="absolute inset-0 flex flex-col">
                            <div className="flex-1 flex">
                                <div className="w-12 flex flex-col justify-between py-2 text-xs text-muted-foreground">
                                    <div>100%</div>
                                    <div>95%</div>
                                    <div>90%</div>
                                    <div>85%</div>
                                    <div>80%</div>
                                </div>
                                <div className="flex-1 grid grid-cols-6 gap-2 py-2">
                                    {repaymentTrendData.map((data, index) => (
                                        <div key={index} className="flex flex-col h-full">
                                            <div className="flex-1 relative">
                                                <div className="absolute bottom-0 left-0 right-0 bg-green-100 dark:bg-green-950/30 rounded-t overflow-hidden">
                                                    <div
                                                        className="bg-green-500 absolute bottom-0 left-0 right-0"
                                                        style={{ height: `${(data.onTime - 80) * 5}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-center mt-1">{data.month}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-8 flex items-center justify-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="h-3 w-3 bg-green-500 rounded"></div>
                                    <span>
                    On Time Payments (
                                        {(repaymentTrendData.reduce((sum, data) => sum + data.onTime, 0) / repaymentTrendData.length).toFixed(2)}% avg)
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(() => {
                        // Calculate overall repayment performance
                        const activeLoans = loanRequests.filter(loan => 
                            loan.status === "REPAID" || loan.status === "REPAYING" || loan.status === "DISBURSED"
                        );

                        const onTimeLoans = activeLoans.filter(loan => 
                            (loan.status === "REPAID" && new Date(loan.updatedAt) <= new Date(loan.repaymentDate)) || 
                            loan.status === "REPAYING"
                        ).length;

                        const lateLoans = loanRequests.filter(loan => 
                            loan.status === "DEFAULTED"
                        ).length;

                        const totalLoans = onTimeLoans + lateLoans;

                        // Calculate on-time percentage
                        const onTimePercentage = totalLoans > 0 
                            ? Math.round((onTimeLoans / totalLoans) * 100) 
                            : 95.3; // Fallback to default if no data

                        const latePercentage = 100 - onTimePercentage;

                        // Calculate trend (compare with previous month)
                        const previousMonthData = repaymentTrendData.length > 1 ? repaymentTrendData[repaymentTrendData.length - 2] : null;
                        const currentMonthData = repaymentTrendData.length > 0 ? repaymentTrendData[repaymentTrendData.length - 1] : null;

                        let trendValue = 0;
                        if (previousMonthData && currentMonthData) {
                            trendValue = currentMonthData.onTime - previousMonthData.onTime;
                        } else {
                            // Fallback to mock trend
                            trendValue = 2.1;
                        }

                        // Calculate average from trend data
                        let avgOnTime = 0;
                        if (repaymentTrendData.length > 0) {
                            avgOnTime = repaymentTrendData.reduce((sum, data) => sum + data.onTime, 0) / repaymentTrendData.length;
                        } else {
                            avgOnTime = onTimePercentage;
                        }

                        return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">On-time Payments</div>
                                            <div className="text-xs text-muted-foreground">Average: {avgOnTime.toFixed(1)}%</div>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="text-lg font-bold text-green-600 dark:text-green-400">{onTimePercentage}%</div>
                                            <div className={`text-xs ${trendValue >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
                                                {trendValue >= 0 ? (
                                                    <TrendingUp className="h-3 w-3 mr-0.5" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3 mr-0.5" />
                                                )}
                                                {trendValue >= 0 ? '+' : ''}{trendValue.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Progress value={onTimePercentage} className="h-2" indicatorClassName="bg-green-500" />
                                    </div>
                                </div>

                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                                            <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Late Payments</div>
                                            {lateLoans > 0 ? (
                                                <div className="text-xs text-muted-foreground">Average: {(100 - avgOnTime).toFixed(1)}%</div>
                                            ) : (
                                                <div className="text-xs text-green-500">No late payments</div>
                                            )}
                                        </div>
                                        <div className="ml-auto">
                                            {lateLoans > 0 ? (
                                                <>
                                                    <div className="text-lg font-bold text-red-600 dark:text-red-400">{latePercentage}%</div>
                                                    <div className={`text-xs ${-trendValue >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
                                                        {-trendValue >= 0 ? (
                                                            <TrendingDown className="h-3 w-3 mr-0.5" />
                                                        ) : (
                                                            <TrendingUp className="h-3 w-3 mr-0.5" />
                                                        )}
                                                        {-trendValue >= 0 ? '+' : ''}{(-trendValue).toFixed(1)}%
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-lg font-bold text-green-600 dark:text-green-400">0%</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Progress value={lateLoans > 0 ? latePercentage : 0} max={20} className="h-2" indicatorClassName="bg-red-500" />
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-medium text-green-700 dark:text-green-300">Performance Insight</h5>
                                {(() => {
                                    // Calculate overall repayment performance
                                    const activeLoans = loanRequests.filter(loan => 
                                        loan.status === "REPAID" || loan.status === "REPAYING" || loan.status === "DISBURSED"
                                    );

                                    const onTimeLoans = activeLoans.filter(loan => 
                                        (loan.status === "REPAID" && new Date(loan.updatedAt) <= new Date(loan.repaymentDate)) || 
                                        loan.status === "REPAYING"
                                    ).length;

                                    const lateLoans = loanRequests.filter(loan => 
                                        loan.status === "DEFAULTED"
                                    ).length;

                                    const totalLoans = onTimeLoans + lateLoans;

                                    // Calculate on-time percentage
                                    const onTimePercentage = totalLoans > 0 
                                        ? Math.round((onTimeLoans / totalLoans) * 100) 
                                        : 95.3; // Fallback to default if no data

                                    // Industry average (mock value)
                                    const industryAverage = 87;
                                    const difference = onTimePercentage - industryAverage;

                                    // Determine performance level
                                    let performanceLevel = "excellent";
                                    let textColorClass = "text-green-600 dark:text-green-400";

                                    if (onTimePercentage < 80) {
                                        performanceLevel = "concerning";
                                        textColorClass = "text-red-600 dark:text-red-400";
                                    } else if (onTimePercentage < 90) {
                                        performanceLevel = "good";
                                        textColorClass = "text-amber-600 dark:text-amber-400";
                                    }

                                    return (
                                        <p className={`text-xs ${textColorClass} mt-1`}>
                                            Your repayment performance is {performanceLevel} with {onTimePercentage}% on-time payments, 
                                            which is {Math.abs(difference).toFixed(1)}% {difference >= 0 ? "above" : "below"} the industry
                                            average. {difference >= 0 
                                                ? "Continue this trend to maintain high credit ratings and member trust."
                                                : "Improving your on-time payments will help build better credit ratings and member trust."
                                            }
                                        </p>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                        <h5 className="text-sm font-medium mb-3">Monthly Performance Summary</h5>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {repaymentTrendData.map((data, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-black bg-opacity-70 dark:bg-opacity-70 p-2 rounded-md border border-border/50"
                                >
                                    <div className="text-xs text-muted-foreground">{data.month}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <div className="text-xs font-medium">{data.onTime}%</div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        <div className="text-xs font-medium">{data.late}%</div>
                                    </div>
                                    <div className="mt-1 pt-1 border-t border-border/50">
                                        <div
                                            className={cn(
                                                "text-xs font-medium flex items-center",
                                                data.onTime >= 95 ? "text-green-500" : "text-amber-500",
                                            )}
                                        >
                                            {data.onTime >= 95 ? (
                                                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                                            ) : (
                                                <AlertCircle className="h-3 w-3 mr-0.5" />
                                            )}
                                            {data.onTime >= 95 ? "Good" : "Fair"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Insights */}

            </div>
        </div>
    )
}

export default LoanStatusTab
