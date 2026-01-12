"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarDays,
  ArrowRight,
  Download,
  DollarSign,
  Vote,
  FileText,
  Shield,
  GitBranch,
  Target,
  Wallet,
  BarChart3,
  Trophy,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const mockMeetings = [
  {
    id: "1",
    title: "Monthly Financial Review",
    description: "Review group finances, approve loan requests, and discuss investment opportunities",
    date: "2024-03-20",
    time: "10:00 AM",
    duration: "2 hours",
    location: "Conference Room A",
    isVirtual: false,
    meetingLink: null,
    zoomMeetingId: "123-456-789",
    zoomPassword: "finance2024",
    status: "upcoming",
    group: { id: "g1", name: "Savings Circle A", members: 15 },
    myRsvp: "confirmed",
    attendees: 12,
    totalMembers: 15,
    myRole: "treasurer",
    subGroup: "Finance Committee",
    agenda: [
      "Opening remarks and attendance",
      "Financial report presentation",
      "Loan request reviews (3 pending)",
      "Investment opportunity discussion",
      "AOB and closing",
    ],
    organizer: { name: "John Doe", avatar: "/thoughtful-man-in-library.png", role: "chairperson" },
    polls: [
      {
        id: "p1",
        question: "Should we invest in government bonds?",
        options: ["Yes", "No", "Need more info"],
        votes: { Yes: 8, No: 2, "Need more info": 2 },
        myVote: "Yes",
        status: "active",
      },
    ],
    financialGoals: [
      { id: "fg1", name: "Emergency Fund", target: 50000, current: 32000, deadline: "2024-06-30" },
      { id: "fg2", name: "Investment Portfolio", target: 100000, current: 65000, deadline: "2024-12-31" },
    ],
    budget: {
      monthly: 5000,
      spent: 3200,
      categories: [
        { name: "Loans", allocated: 2000, spent: 1500 },
        { name: "Operations", allocated: 1500, spent: 900 },
        { name: "Emergency", allocated: 1000, spent: 500 },
        { name: "Investments", allocated: 500, spent: 300 },
      ],
    },
  },
  {
    id: "2",
    title: "Investment Strategy Discussion",
    description: "Quarterly review of investment portfolio and strategy planning for Q2",
    date: "2024-03-22",
    time: "2:00 PM",
    duration: "1.5 hours",
    location: "Zoom Meeting",
    isVirtual: true,
    meetingLink: "https://zoom.us/j/123456789",
    zoomMeetingId: "987-654-321",
    zoomPassword: "investQ2",
    status: "upcoming",
    group: { id: "g2", name: "Investment Group", members: 8 },
    myRsvp: "pending",
    attendees: 6,
    totalMembers: 8,
    myRole: "member",
    agenda: [
      "Q1 performance review",
      "Portfolio rebalancing discussion",
      "New investment opportunities",
      "Risk assessment update",
    ],
    organizer: { name: "David Lee", avatar: null, role: "member" },
  },
  {
    id: "3",
    title: "Emergency Fund Planning",
    description: "Discuss and establish emergency fund policies for the group",
    date: "2024-03-15",
    time: "3:00 PM",
    duration: "1 hour",
    location: "Community Center",
    isVirtual: false,
    meetingLink: null,
    status: "completed",
    group: { id: "g3", name: "Community Savers", members: 20 },
    myRsvp: "attended",
    attendees: 18,
    totalMembers: 20,
    myRole: "secretary",
    agenda: ["Introduction to emergency funds", "Policy proposals", "Voting on proposals", "Implementation timeline"],
    organizer: { name: "Grace Taylor", avatar: null, role: "chairperson" },
    minutes: "Meeting was productive. Approved emergency fund policy with 85% vote. Implementation starts April 1st.",
  },
  {
    id: "4",
    title: "New Member Orientation",
    description: "Welcome and onboard new members to the savings group",
    date: "2024-03-10",
    time: "11:00 AM",
    duration: "45 minutes",
    location: "Google Meet",
    isVirtual: true,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "completed",
    group: { id: "g1", name: "Savings Circle A", members: 15 },
    myRsvp: "attended",
    attendees: 14,
    totalMembers: 15,
    myRole: "member",
    agenda: ["Group introduction", "Rules and bylaws review", "Payment schedules", "Q&A session"],
    organizer: { name: "John Doe", avatar: "/thoughtful-man-in-library.png", role: "chairperson" },
    minutes: "Successful orientation. Two new members onboarded. Both completed registration forms.",
  },
  {
    id: "5",
    title: "Year-End Celebration",
    description: "Celebrate achievements and plan for next year",
    date: "2024-03-08",
    time: "5:00 PM",
    duration: "3 hours",
    location: "Restaurant & Event Hall",
    isVirtual: false,
    meetingLink: null,
    status: "cancelled",
    group: { id: "g2", name: "Investment Group", members: 8 },
    myRsvp: "declined",
    attendees: 0,
    totalMembers: 8,
    myRole: "member",
    agenda: ["Year in review", "Awards and recognition", "Next year goals", "Social networking"],
    organizer: { name: "David Lee", avatar: null, role: "member" },
  },
]

const mockAttendanceRewards = [
  { userId: "u1", name: "You", attendanceRate: 95, points: 475, rank: 1, badge: "Perfect Attendance", rewards: 50 },
  { userId: "u2", name: "John Doe", attendanceRate: 92, points: 460, rank: 2, badge: "Dedicated Member", rewards: 40 },
  { userId: "u3", name: "Jane Smith", attendanceRate: 88, points: 440, rank: 3, badge: "Active Member", rewards: 30 },
]

const rolePermissions = {
  chairperson: ["schedule", "edit", "delete", "approve", "moderate"],
  treasurer: ["view_finances", "create_budget", "approve_expenses"],
  secretary: ["take_minutes", "send_notifications", "manage_documents"],
  member: ["view", "rsvp", "vote"],
}

export function MemberMeetingsClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState("all")
  const [selectedMeeting, setSelectedMeeting] = useState<(typeof mockMeetings)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showPollDialog, setShowPollDialog] = useState(false)
  const [showGoalsDialog, setShowGoalsDialog] = useState(false)
  const [showBudgetDialog, setShowBudgetDialog] = useState(false)
  const [showMinutesDialog, setShowMinutesDialog] = useState(false)
  const [showRewardsDialog, setShowRewardsDialog] = useState(false)
  const [showSubGroupsDialog, setShowSubGroupsDialog] = useState(false)
  const [selectedPoll, setSelectedPoll] = useState<any>(null)

  const [showCreatePollDialog, setShowCreatePollDialog] = useState(false)
  const [showCreateGoalDialog, setShowCreateGoalDialog] = useState(false)
  const [showCreateBudgetDialog, setShowCreateBudgetDialog] = useState(false)
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [budgetCategories, setBudgetCategories] = useState([{ name: "", allocated: 0 }])

  const filteredMeetings = mockMeetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.group.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = groupFilter === "all" || meeting.group.id === groupFilter
    const matchesTab =
      (activeTab === "upcoming" && meeting.status === "upcoming") ||
      (activeTab === "past" && (meeting.status === "completed" || meeting.status === "cancelled"))
    return matchesSearch && matchesGroup && matchesTab
  })

  const upcomingCount = mockMeetings.filter((m) => m.status === "upcoming").length
  const pastCount = mockMeetings.filter((m) => m.status === "completed" || m.status === "cancelled").length
  const confirmedCount = mockMeetings.filter((m) => m.myRsvp === "confirmed" && m.status === "upcoming").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getRsvpColor = (rsvp: string) => {
    switch (rsvp) {
      case "confirmed":
      case "attended":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "declined":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const getRsvpIcon = (rsvp: string) => {
    switch (rsvp) {
      case "confirmed":
      case "attended":
        return <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
      case "pending":
        return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "declined":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">My Meetings</h2>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Manage your group meeting schedule and attendance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-blue-500">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Meetings scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-green-500">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Your RSVPs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Past</CardTitle>
            <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-purple-500">{pastCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Meetings held</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search meetings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background text-sm"
                />
              </div>
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background text-sm">
                  <SelectValue placeholder="All Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="g1">Savings Circle A</SelectItem>
                  <SelectItem value="g2">Investment Group</SelectItem>
                  <SelectItem value="g3">Community Savers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                  Upcoming ({upcomingCount})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-xs sm:text-sm">
                  Past ({pastCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Group Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowPollDialog(true)}
            >
              <Vote className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              <span className="text-xs sm:text-sm">Polls & Voting</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowGoalsDialog(true)}
            >
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              <span className="text-xs sm:text-sm">Financial Goals</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowBudgetDialog(true)}
            >
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              <span className="text-xs sm:text-sm">Budget</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowMinutesDialog(true)}
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              <span className="text-xs sm:text-sm">Minutes</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowRewardsDialog(true)}
            >
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
              <span className="text-xs sm:text-sm">Rewards</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowSubGroupsDialog(true)}
            >
              <GitBranch className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-500" />
              <span className="text-xs sm:text-sm">Sub-Groups</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <span className="text-xs sm:text-sm">My Role</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
              <span className="text-xs sm:text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredMeetings.map((meeting) => {
          const attendanceRate = meeting.totalMembers > 0 ? (meeting.attendees / meeting.totalMembers) * 100 : 0

          return (
            <Card
              key={meeting.id}
              className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden cursor-pointer"
              onClick={() => setSelectedMeeting(meeting)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Date Badge - Left Side */}
                  <div className="flex-shrink-0 flex sm:flex-col items-center gap-2 sm:gap-1 sm:w-16">
                    <div className="text-center bg-primary/10 rounded-lg p-2 sm:p-3 w-16 sm:w-full">
                      <div className="text-xs sm:text-sm font-semibold text-primary uppercase">
                        {new Date(meeting.date).toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold">{new Date(meeting.date).getDate()}</div>
                    </div>
                  </div>

                  {/* Meeting Details */}
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold truncate">{meeting.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">{meeting.group.name}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {meeting.myRole && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple-500/10 text-purple-500 border-purple-500/20"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              {meeting.myRole}
                            </Badge>
                          )}
                          {meeting.subGroup && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                            >
                              <GitBranch className="h-3 w-3 mr-1" />
                              {meeting.subGroup}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Badge variant="outline" className={`text-xs ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </Badge>
                        <Badge className={`text-xs ${getRsvpColor(meeting.myRsvp)}`}>
                          {getRsvpIcon(meeting.myRsvp)}
                          <span className="ml-1 capitalize">{meeting.myRsvp}</span>
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>

                    {/* Meeting Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">
                          {meeting.time} • {meeting.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.isVirtual ? (
                          <>
                            <Video className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <span className="truncate">{meeting.location}</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{meeting.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Attendance Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {meeting.attendees} / {meeting.totalMembers} attending
                          </span>
                        </div>
                        <span className="text-muted-foreground">{attendanceRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={attendanceRate} className="h-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {meeting.status === "upcoming" && meeting.myRsvp === "pending" && (
                        <>
                          <Button size="sm" className="text-xs sm:text-sm flex-1 sm:flex-initial">
                            <CheckCircle2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Confirm RSVP
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm flex-1 sm:flex-initial bg-transparent"
                          >
                            <XCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Decline
                          </Button>
                        </>
                      )}
                      {meeting.isVirtual && meeting.status === "upcoming" && meeting.meetingLink && (
                        <Button size="sm" className="text-xs sm:text-sm flex-1 sm:flex-initial" variant="default">
                          <Video className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Join Meeting
                        </Button>
                      )}
                      {meeting.zoomMeetingId && meeting.status === "upcoming" && (
                        <Button size="sm" className="text-xs sm:text-sm bg-blue-500 hover:bg-blue-600">
                          <Video className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Join Zoom
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs sm:text-sm flex-1 sm:flex-initial ml-auto"
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredMeetings.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-base font-medium">No meetings found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={selectedMeeting !== null} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl">{selectedMeeting?.title}</DialogTitle>
                <DialogDescription className="text-sm mt-2">{selectedMeeting?.group.name}</DialogDescription>
              </div>
              <Badge variant="outline" className={`${selectedMeeting && getStatusColor(selectedMeeting.status)}`}>
                {selectedMeeting?.status}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                Details
              </TabsTrigger>
              <TabsTrigger value="agenda" className="text-xs sm:text-sm">
                Agenda
              </TabsTrigger>
              <TabsTrigger value="polls" className="text-xs sm:text-sm">
                Polls
              </TabsTrigger>
              <TabsTrigger value="goals" className="text-xs sm:text-sm">
                Goals
              </TabsTrigger>
              <TabsTrigger value="budget" className="text-xs sm:text-sm">
                Budget
              </TabsTrigger>
              <TabsTrigger value="minutes" className="text-xs sm:text-sm">
                Minutes
              </TabsTrigger>
              <TabsTrigger value="zoom" className="text-xs sm:text-sm">
                Video
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMeeting?.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedMeeting?.time} ({selectedMeeting?.duration})
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {selectedMeeting?.isVirtual ? (
                        <Video className="h-4 w-4 text-purple-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{selectedMeeting?.location}</span>
                    </div>
                    {selectedMeeting?.isVirtual && selectedMeeting?.meetingLink && (
                      <Button variant="link" className="h-auto p-0 text-sm" asChild>
                        <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer">
                          Join Virtual Meeting
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedMeeting?.description}</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Your RSVP</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${selectedMeeting && getRsvpColor(selectedMeeting.myRsvp)}`}>
                    {selectedMeeting && getRsvpIcon(selectedMeeting.myRsvp)}
                    <span className="ml-1 capitalize">{selectedMeeting?.myRsvp}</span>
                  </Badge>
                  {selectedMeeting?.status === "upcoming" && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm Attendance
                      </Button>
                      <Button variant="outline" size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedMeeting?.minutes && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">Meeting Minutes</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedMeeting.minutes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Agenda Tab */}
            <TabsContent value="agenda" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Meeting Agenda</h3>
                {selectedMeeting?.myRole === "chairperson" && (
                  <Button size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Agenda
                  </Button>
                )}
              </div>
              {selectedMeeting?.agenda.map((item, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1">{item}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="polls" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Polls & Voting</h3>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                  {selectedMeeting?.polls?.length || 0} Active
                </Badge>
              </div>

              <div className="space-y-4">
                {selectedMeeting?.polls?.map((poll) => (
                  <Card key={poll.id} className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-base">{poll.question}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RadioGroup value={poll.myVote} className="space-y-3">
                        {poll.options.map((option: string) => {
                          const votes = poll.votes[option] || 0
                          const totalVotes = Object.values(poll.votes).reduce((a: any, b: any) => a + b, 0)
                          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

                          return (
                            <div key={option} className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`poll-${poll.id}-${option}`} />
                                <Label htmlFor={`poll-${poll.id}-${option}`} className="flex-1 cursor-pointer">
                                  {option}
                                </Label>
                                <span className="text-sm text-muted-foreground">
                                  {votes} votes ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )
                        })}
                      </RadioGroup>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          Submit Vote
                        </Button>
                        <Button size="sm" variant="outline">
                          View Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="goals" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shared Financial Goals</h3>
                <Button size="sm">
                  <Target className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              <div className="space-y-4">
                {selectedMeeting?.financialGoals?.map((goal) => {
                  const progress = (goal.current / goal.target) * 100

                  return (
                    <Card key={goal.id} className="bg-muted/30">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{goal.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Deadline: {new Date(goal.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              progress >= 100 ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                            }
                          >
                            {progress.toFixed(0)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current</span>
                          <span className="font-semibold">${goal.current.toLocaleString()}</span>
                        </div>
                        <Progress value={progress} className="h-3" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Target</span>
                          <span className="font-semibold">${goal.target.toLocaleString()}</span>
                        </div>
                        <Button size="sm" className="w-full">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Contribute
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="budget" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Group Budget</h3>
                {selectedMeeting?.myRole === "treasurer" && (
                  <Button size="sm">
                    <Wallet className="mr-2 h-4 w-4" />
                    Edit Budget
                  </Button>
                )}
              </div>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Budget</p>
                      <p className="text-2xl font-bold">${selectedMeeting?.budget?.monthly.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Spent</p>
                      <p className="text-2xl font-bold text-green-500">
                        ${selectedMeeting?.budget?.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={(selectedMeeting?.budget?.spent / selectedMeeting?.budget?.monthly) * 100}
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    ${(selectedMeeting?.budget?.monthly - selectedMeeting?.budget?.spent).toLocaleString()} remaining
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Budget Categories</h4>
                {selectedMeeting?.budget?.categories.map((category) => {
                  const percentage = (category.spent / category.allocated) * 100

                  return (
                    <Card key={category.name} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ${category.spent} / ${category.allocated}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="minutes" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Meeting Minutes</h3>
                {selectedMeeting?.myRole === "secretary" && (
                  <Button size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Minutes
                  </Button>
                )}
              </div>

              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Attendance</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeeting?.attendees} of {selectedMeeting?.totalMembers} members present
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Decisions</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Approved investment in government bonds (8-2 vote)</li>
                        <li>Increased emergency fund target to $50,000</li>
                        <li>Approved 3 loan requests totaling $15,000</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Action Items</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <Checkbox className="mt-1" />
                          <span>Treasurer to process approved loan disbursements by March 25</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <Checkbox checked className="mt-1" />
                          <span>Secretary to send bond investment documents to all members</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Minutes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="zoom" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Video Meeting Details</h3>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  <Video className="mr-1 h-3 w-3" />
                  Zoom
                </Badge>
              </div>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <Video className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Zoom Meeting Ready</p>
                      <p className="text-sm text-muted-foreground">Meeting starts at {selectedMeeting?.time}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Meeting ID</span>
                      <span className="font-mono font-semibold">{selectedMeeting?.zoomMeetingId}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                      <span className="text-sm text-muted-foreground">Password</span>
                      <span className="font-mono font-semibold">{selectedMeeting?.zoomPassword}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-blue-500 hover:bg-blue-600">
                      <Video className="mr-2 h-4 w-4" />
                      Join Zoom Meeting
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">Quick Tips:</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Join 5 minutes early to test your audio and video</li>
                      <li>• Use headphones to reduce background noise</li>
                      <li>• Mute your microphone when not speaking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Polls & Voting Dialog */}
      <Dialog open={showPollDialog} onOpenChange={setShowPollDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-purple-500" />
              Polls & Voting
            </DialogTitle>
            <DialogDescription>Participate in group decisions and investment voting</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button
              onClick={() => {
                setShowPollDialog(false)
                setShowCreatePollDialog(true)
              }}
              size="sm"
            >
              <Vote className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>

          <div className="space-y-4">
            {mockMeetings
              .filter((m) => m.polls && m.polls.length > 0)
              .map((meeting) =>
                meeting.polls?.map((poll) => {
                  const totalVotes = Object.values(poll.votes).reduce((a: any, b: any) => a + b, 0)
                  return (
                    <Card key={poll.id} className="bg-card/50">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base">{poll.question}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{meeting.group.name}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${poll.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}
                          >
                            {poll.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <RadioGroup value={poll.myVote} disabled={poll.status !== "active"}>
                          {poll.options.map((option: string) => {
                            const votes = poll.votes[option] || 0
                            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
                            return (
                              <div key={option} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${poll.id}-${option}`} />
                                    <Label htmlFor={`${poll.id}-${option}`} className="text-sm">
                                      {option}
                                    </Label>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {votes} votes ({percentage.toFixed(0)}%)
                                  </span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            )
                          })}
                        </RadioGroup>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground">Total votes: {totalVotes}</span>
                          {poll.myVote && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                              You voted: {poll.myVote}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                }),
              )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatePollDialog} onOpenChange={setShowCreatePollDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
            <DialogDescription>Create a poll for your group members to vote on</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poll-question">Poll Question *</Label>
              <Input id="poll-question" placeholder="e.g., Should we invest in government bonds?" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poll-group">Select Group *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g1">Savings Circle A</SelectItem>
                  <SelectItem value="g2">Investment Group</SelectItem>
                  <SelectItem value="g3">Community Savers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Poll Options *</Label>
                <Button variant="outline" size="sm" onClick={() => setPollOptions([...pollOptions, ""])}>
                  Add Option
                </Button>
              </div>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...pollOptions]
                      newOptions[index] = e.target.value
                      setPollOptions(newOptions)
                    }}
                  />
                  {pollOptions.length > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setPollOptions(pollOptions.filter((_, i) => i !== index))
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="poll-deadline">Voting Deadline</Label>
              <Input id="poll-deadline" type="datetime-local" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="allow-multiple" />
              <Label htmlFor="allow-multiple" className="text-sm font-normal">
                Allow members to change their vote
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => {
                  // Handle create poll
                  setShowCreatePollDialog(false)
                }}
              >
                Create Poll
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowCreatePollDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Financial Goals Dialog */}
      <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Shared Financial Goals
            </DialogTitle>
            <DialogDescription>Track and contribute to group savings goals</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button
              onClick={() => {
                setShowGoalsDialog(false)
                setShowCreateGoalDialog(true)
              }}
              size="sm"
            >
              <Target className="h-4 w-4 mr-2" />
              Create Goal
            </Button>
          </div>

          <div className="space-y-4">
            {mockMeetings
              .filter((m) => m.financialGoals && m.financialGoals.length > 0)
              .map((meeting) =>
                meeting.financialGoals?.map((goal) => {
                  const progress = (goal.current / goal.target) * 100
                  const remaining = goal.target - goal.current
                  return (
                    <Card key={goal.id} className="bg-card/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{goal.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{meeting.group.name}</p>
                          </div>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                            {progress.toFixed(0)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-semibold">
                              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Remaining</p>
                            <p className="text-sm font-semibold">${remaining.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Deadline</p>
                            <p className="text-sm font-semibold">{new Date(goal.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          <DollarSign className="h-4 w-4 mr-2" />
                          Contribute
                        </Button>
                      </CardContent>
                    </Card>
                  )
                }),
              )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateGoalDialog} onOpenChange={setShowCreateGoalDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Financial Goal</DialogTitle>
            <DialogDescription>Set a new financial target for your group</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name *</Label>
              <Input id="goal-name" placeholder="e.g., Emergency Fund" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-group">Select Group *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g1">Savings Circle A</SelectItem>
                  <SelectItem value="g2">Investment Group</SelectItem>
                  <SelectItem value="g3">Community Savers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="goal-target" type="number" placeholder="50000" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-current">Current Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="goal-current" type="number" placeholder="0" className="pl-9" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-deadline">Target Deadline *</Label>
              <Input id="goal-deadline" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description (Optional)</Label>
              <Textarea id="goal-description" placeholder="Describe the purpose of this financial goal..." rows={3} />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => {
                  // Handle create goal
                  setShowCreateGoalDialog(false)
                }}
              >
                Create Goal
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowCreateGoalDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Budget Dialog */}
      <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-500" />
              Group Budget
            </DialogTitle>
            <DialogDescription>View and manage group budget allocation</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end mb-4">
            <Button
              onClick={() => {
                setShowBudgetDialog(false)
                setShowCreateBudgetDialog(true)
              }}
              size="sm"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </div>

          <div className="space-y-4">
            {mockMeetings
              .filter((m) => m.budget)
              .map((meeting) => {
                const budget = meeting.budget!
                const spentPercentage = (budget.spent / budget.monthly) * 100
                return (
                  <Card key={meeting.id} className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-base">{meeting.group.name} - Monthly Budget</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Spending</span>
                          <span className="font-semibold">
                            ${budget.spent.toLocaleString()} / ${budget.monthly.toLocaleString()}
                          </span>
                        </div>
                        <Progress
                          value={spentPercentage}
                          className={`h-3 ${spentPercentage > 90 ? "bg-red-500/20" : ""}`}
                        />
                      </div>

                      <div className="space-y-3 pt-2 border-t">
                        <p className="text-sm font-medium">Category Breakdown</p>
                        {budget.categories.map((category, idx) => {
                          const categoryProgress = (category.spent / category.allocated) * 100
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{category.name}</span>
                                <span className="font-medium">
                                  ${category.spent} / ${category.allocated}
                                </span>
                              </div>
                              <Progress
                                value={categoryProgress}
                                className={`h-2 ${categoryProgress > 90 ? "bg-orange-500/20" : ""}`}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateBudgetDialog} onOpenChange={setShowCreateBudgetDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Budget</DialogTitle>
            <DialogDescription>Set up a new budget plan for your group</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget-group">Select Group *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g1">Savings Circle A</SelectItem>
                  <SelectItem value="g2">Investment Group</SelectItem>
                  <SelectItem value="g3">Community Savers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-period">Budget Period *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-total">Total Budget *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="budget-total" type="number" placeholder="5000" className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Budget Categories *</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBudgetCategories([...budgetCategories, { name: "", allocated: 0 }])}
                >
                  Add Category
                </Button>
              </div>
              {budgetCategories.map((category, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Category name"
                    value={category.name}
                    onChange={(e) => {
                      const newCategories = [...budgetCategories]
                      newCategories[index].name = e.target.value
                      setBudgetCategories(newCategories)
                    }}
                    className="flex-1"
                  />
                  <div className="relative w-32">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={category.allocated || ""}
                      onChange={(e) => {
                        const newCategories = [...budgetCategories]
                        newCategories[index].allocated = Number(e.target.value)
                        setBudgetCategories(newCategories)
                      }}
                      className="pl-9"
                    />
                  </div>
                  {budgetCategories.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setBudgetCategories(budgetCategories.filter((_, i) => i !== index))
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget-start">Start Date *</Label>
              <Input id="budget-start" type="date" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => {
                  // Handle create budget
                  setShowCreateBudgetDialog(false)
                }}
              >
                Create Budget
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowCreateBudgetDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRewardsDialog} onOpenChange={setShowRewardsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Attendance Rewards & Recognition
            </DialogTitle>
            <DialogDescription>Track your attendance and earn rewards for active participation</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockAttendanceRewards.map((member, idx) => (
                  <div
                    key={member.userId}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      member.userId === "u1" ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          idx === 0
                            ? "bg-yellow-500/20 text-yellow-500"
                            : idx === 1
                              ? "bg-gray-400/20 text-gray-400"
                              : "bg-orange-600/20 text-orange-600"
                        }`}
                      >
                        {member.rank}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.badge}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">{member.points} pts</div>
                      <div className="text-xs text-muted-foreground">{member.attendanceRate}% attendance</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Your Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">475</div>
                  <Progress value={75} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">525 pts to next level</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">95%</div>
                  <Progress value={95} className="mt-2 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">19 of 20 meetings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Current Rank</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">#1</div>
                  <Badge className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    Perfect Attendance
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Rewards Shop */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Redeem Rewards (475 points available)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">$10 Contribution Credit</div>
                      <div className="text-xs text-muted-foreground">100 points</div>
                    </div>
                    <Button size="sm">Redeem</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Skip Next Meeting Fee</div>
                      <div className="text-xs text-muted-foreground">200 points</div>
                    </div>
                    <Button size="sm">Redeem</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">$25 Contribution Credit</div>
                      <div className="text-xs text-muted-foreground">250 points</div>
                    </div>
                    <Button size="sm">Redeem</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                    <div>
                      <div className="font-medium">Loan Interest Reduction</div>
                      <div className="text-xs text-muted-foreground">500 points</div>
                    </div>
                    <Button size="sm" disabled>
                      Locked
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Achievement Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <Trophy className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                    <div className="text-sm font-medium">Perfect Attendance</div>
                    <div className="text-xs text-muted-foreground">95%+ rate</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <div className="text-sm font-medium">Early Bird</div>
                    <div className="text-xs text-muted-foreground">Always on time</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <div className="text-sm font-medium">Team Player</div>
                    <div className="text-xs text-muted-foreground">Active participant</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 border border-border rounded-lg opacity-50">
                    <Vote className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <div className="text-sm font-medium">Voting Champion</div>
                    <div className="text-xs text-muted-foreground">Vote in 50 polls</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubGroupsDialog} onOpenChange={setShowSubGroupsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-cyan-500" />
              Sub-Groups & Committees
            </DialogTitle>
            <DialogDescription>Specialized committees for focused group activities</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Active Sub-Groups */}
            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Your Sub-Groups</CardTitle>
                  <Button size="sm" variant="outline">
                    Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <DollarSign className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <div className="font-semibold">Finance Committee</div>
                          <div className="text-xs text-muted-foreground">Budget & Loan Management</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Treasurer</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>5 members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Meets weekly</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Target className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <div className="font-semibold">Investment Committee</div>
                          <div className="text-xs text-muted-foreground">Strategic Planning & Investments</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Member</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>8 members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Meets bi-weekly</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 bg-transparent" variant="outline">
                        Leave Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Available Sub-Groups to Join */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Committees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Card className="bg-muted/30 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <FileText className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="font-semibold">Documentation Committee</div>
                          <div className="text-xs text-muted-foreground">Meeting Minutes & Records</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>3 members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Meets monthly</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Request to Join
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-semibold">Membership Committee</div>
                          <div className="text-xs text-muted-foreground">Recruitment & Onboarding</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>6 members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Meets weekly</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Request to Join
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Sub-Group Benefits */}
            <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-base">Committee Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Specialized roles and responsibilities</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Additional voting power in your area</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Earn extra attendance points</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Direct impact on group decisions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Minutes Dialog */}
      <Dialog open={showMinutesDialog} onOpenChange={setShowMinutesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              Meeting Minutes & Records
            </DialogTitle>
            <DialogDescription>View past meeting minutes and important decisions</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Past Meetings with Minutes */}
            {mockMeetings
              .filter((m) => m.status === "completed" && m.minutes)
              .map((meeting) => (
                <Card key={meeting.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{meeting.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{meeting.group.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(meeting.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>
                              {meeting.attendees}/{meeting.totalMembers} attended
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Minutes Summary */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Summary</h4>
                        <p className="text-sm text-muted-foreground">{meeting.minutes}</p>
                      </div>

                      {/* Key Decisions */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Key Decisions</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Approved emergency fund policy with 85% majority vote</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Loan requests for Sarah M. and James K. were approved</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Items */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Action Items</h4>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2 text-sm">
                            <div className="flex items-start gap-2 flex-1">
                              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Treasurer to prepare Q1 financial report</span>
                            </div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Done
                            </Badge>
                          </div>
                          <div className="flex items-start justify-between gap-2 text-sm">
                            <div className="flex items-start gap-2 flex-1">
                              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>Secretary to update group bylaws document</span>
                            </div>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              In Progress
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Attendees */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Attendees</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            John Doe (Chairperson)
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Sarah M.
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            James K.
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{meeting.attendees - 3} more
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {mockMeetings.filter((m) => m.status === "completed" && m.minutes).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No meeting minutes available yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
