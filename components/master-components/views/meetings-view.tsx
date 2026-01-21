"use client"

import { useState, Suspense } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"
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
  Download,
  Mail,
  CalendarPlus,
  TrendingUp,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Types for meetings
interface MeetingAttendee {
  id: string
  name: string
  email: string
  status: string
  avatar: string | null
}

interface MeetingGroup {
  id: string
  name: string
  members: number
}

interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: string
  location: string
  isVirtual: boolean
  meetingLink: string | null
  status: string
  group: MeetingGroup
  attendees: MeetingAttendee[]
  agenda: string[]
  createdBy: { name: string; email: string }
  createdAt: string
  minutes?: string | null
}

interface MeetingStats {
  totalMeetings: number
  upcomingMeetings: number
  completedMeetings: number
  cancelledMeetings: number
  virtualMeetings: number
  averageAttendance: number
}

interface MeetingsResponse {
  meetings: Meeting[]
  stats: MeetingStats
}

// Fetch meetings from API
async function fetchMeetings(): Promise<MeetingsResponse> {
  const response = await fetch("/api/admin/meetings")
  if (!response.ok) {
    throw new Error("Failed to fetch meetings")
  }
  return response.json()
}

// Skeleton loader for meetings view
function MeetingsViewSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-card border-border min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
              <Skeleton className="h-6 w-12 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-3 sm:p-4 md:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <Skeleton className="h-10 flex-1" />
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-[140px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4 p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Meetings Content Component
function MeetingsContent() {
  const { data, isLoading, error } = useQuery<MeetingsResponse>({
    queryKey: ["meetings"],
    queryFn: fetchMeetings,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  if (isLoading) {
    return <MeetingsViewSkeleton />
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <p>Failed to load meetings. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const meetings = data?.meetings || []
  const stats = data?.stats || {
    totalMeetings: 0,
    upcomingMeetings: 0,
    completedMeetings: 0,
    cancelledMeetings: 0,
    virtualMeetings: 0,
    averageAttendance: 0,
  }

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter
    const matchesType = typeFilter === "all" || (typeFilter === "virtual" ? meeting.isVirtual : !meeting.isVirtual)
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

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

  const getAttendeeStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "attended":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "declined":
      case "absent":
        return "bg-red-500/10 text-red-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold truncate">Meeting Management</h2>
          <p className="text-sm text-muted-foreground mt-1 truncate">Schedule and manage group meetings</p>
        </div>
        <Button onClick={() => setShowScheduleDialog(true)} className="w-full sm:w-auto flex-shrink-0">
          <CalendarPlus className="mr-2 h-4 w-4" />
          <span className="truncate">Schedule Meeting</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-card border-border min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Total</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold truncate">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground truncate">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Upcoming</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-blue-500 truncate">{stats.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground truncate">Scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Completed</CardTitle>
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-green-500 truncate">{stats.completedMeetings}</div>
            <p className="text-xs text-muted-foreground truncate">Past</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Cancelled</CardTitle>
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-red-500 truncate">{stats.cancelledMeetings}</div>
            <p className="text-xs text-muted-foreground truncate">Not held</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Virtual</CardTitle>
            <Video className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-purple-500 truncate">{stats.virtualMeetings}</div>
            <p className="text-xs text-muted-foreground truncate">Online</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">Avg</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-green-500 truncate">{stats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground truncate">Attend</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-3 sm:p-4 md:pt-6">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none flex-shrink-0" />
              <Input
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background text-sm w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[140px] bg-background text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[140px] bg-background text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        {filteredMeetings.map((meeting) => {
          const confirmedCount = meeting.attendees.filter(
            (a) => a.status === "confirmed" || a.status === "attended",
          ).length
          const attendanceRate = meeting.attendees.length > 0 ? (confirmedCount / meeting.attendees.length) * 100 : 0

          return (
            <Card
              key={meeting.id}
              className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden"
            >
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <CardTitle className="text-base sm:text-lg truncate">{meeting.title}</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{meeting.group.name}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0 items-end">
                    <Badge
                      variant="outline"
                      className={`text-[10px] sm:text-xs ${getStatusColor(meeting.status)} flex items-center gap-1`}
                    >
                      {getStatusIcon(meeting.status)}
                      <span className="capitalize">{meeting.status}</span>
                    </Badge>
                    <Badge
                      variant={meeting.isVirtual ? "default" : "secondary"}
                      className="justify-center text-[10px] sm:text-xs whitespace-nowrap flex items-center"
                    >
                      {meeting.isVirtual ? <Video className="mr-1 h-3 w-3" /> : <MapPin className="mr-1 h-3 w-3" />}
                      {meeting.isVirtual ? "Virtual" : "In-person"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground truncate">{meeting.date}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground truncate">{meeting.time}</span>
                    <Badge variant="outline" className="ml-auto text-[10px] sm:text-xs whitespace-nowrap flex-shrink-0">
                      {meeting.duration}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
                    {meeting.isVirtual ? (
                      <Video className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-foreground truncate flex-1 min-w-0">{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground truncate">
                      {confirmedCount} / {meeting.attendees.length} confirmed
                    </span>
                    <span className="text-muted-foreground ml-auto flex-shrink-0">{attendanceRate.toFixed(0)}%</span>
                  </div>
                </div>

                {meeting.attendees.length > 0 && (
                  <div>
                    <Progress value={attendanceRate} className="h-2" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent text-xs sm:text-sm"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    View Details
                  </Button>
                  {meeting.status === "upcoming" && (
                    <Button size="sm" className="flex-1 text-xs sm:text-sm">
                      <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">Send Reminder</span>
                    </Button>
                  )}
                  {meeting.status === "completed" && (
                    <Button size="sm" className="flex-1 text-xs sm:text-sm">
                      <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="truncate">Minutes</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredMeetings.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 p-4">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <p className="mt-4 text-sm sm:text-base font-medium text-center">No meetings found</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={selectedMeeting !== null} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl truncate">{selectedMeeting?.title}</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm mt-2 truncate">
                  {selectedMeeting?.group.name}
                </DialogDescription>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Badge
                  variant="outline"
                  className={`text-xs ${selectedMeeting && getStatusColor(selectedMeeting.status)}`}
                >
                  {selectedMeeting && getStatusIcon(selectedMeeting.status)}
                  <span className="ml-1 capitalize">{selectedMeeting?.status}</span>
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b px-4 sm:px-6 overflow-x-auto">
              <TabsList className="inline-flex h-auto p-0 bg-transparent gap-4 w-full sm:w-auto min-w-min">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="attendees" className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
                  Attendees ({selectedMeeting?.attendees.length || 0})
                </TabsTrigger>
                <TabsTrigger value="agenda" className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
                  Agenda
                </TabsTrigger>
                <TabsTrigger value="actions" className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
                  Actions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-0">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Date & Time</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      {selectedMeeting?.date} at {selectedMeeting?.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">Duration: {selectedMeeting?.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2 text-sm">
                    {selectedMeeting?.isVirtual ? (
                      <Video className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    ) : (
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="truncate flex-1 min-w-0">{selectedMeeting?.location}</span>
                  </div>
                  {selectedMeeting?.isVirtual && selectedMeeting?.meetingLink && (
                    <Button variant="link" className="h-auto p-0 text-sm truncate w-full justify-start" asChild>
                      <a
                        href={selectedMeeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate"
                      >
                        Join Meeting
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedMeeting?.description}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs sm:text-sm text-muted-foreground">Attendance</Label>
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 text-center">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-green-500">
                          {
                            selectedMeeting?.attendees.filter(
                              (a) => a.status === "confirmed" || a.status === "attended",
                            ).length
                          }
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Confirmed</p>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-yellow-500">
                          {selectedMeeting?.attendees.filter((a) => a.status === "pending").length}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-xl sm:text-2xl font-bold text-red-500">
                          {
                            selectedMeeting?.attendees.filter((a) => a.status === "declined" || a.status === "absent")
                              .length
                          }
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Declined/Absent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedMeeting?.minutes && (
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Meeting Minutes</Label>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-sm">{selectedMeeting.minutes}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="attendees" className="p-4 sm:p-6 mt-0">
              <div className="space-y-3 sm:space-y-4">
                {selectedMeeting?.attendees.map((attendee) => (
                  <Card key={attendee.id} className="bg-muted/30">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                          <AvatarImage src={attendee.avatar || undefined} />
                          <AvatarFallback className="text-xs sm:text-sm">
                            {attendee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{attendee.email}</p>
                        </div>
                        <Badge
                          className={`${getAttendeeStatusColor(attendee.status)} text-xs flex-shrink-0 whitespace-nowrap`}
                        >
                          {attendee.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agenda" className="p-4 sm:p-6 mt-0">
              <div className="space-y-3 sm:space-y-4">
                {selectedMeeting?.agenda.map((item, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex gap-3 sm:gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1 min-w-0">{item}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="p-4 sm:p-6 space-y-4 sm:space-y-6 mt-0">
              <div className="space-y-3 sm:space-y-4">
                <Card className="bg-muted/30">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base">Send Reminder</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                      Send email reminders to all attendees
                    </p>
                    <Button className="w-full sm:w-auto text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reminder
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base">Reschedule</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 space-y-3 sm:space-y-4">
                    <div className="grid gap-3 sm:gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-date" className="text-xs sm:text-sm">
                          New Date
                        </Label>
                        <Input id="new-date" type="date" className="text-sm" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-time" className="text-xs sm:text-sm">
                          New Time
                        </Label>
                        <Input id="new-time" type="time" className="text-sm" />
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Reschedule Meeting
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/30">
                  <CardHeader className="p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base">Cancel Meeting</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 space-y-3 sm:space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cancel-reason" className="text-xs sm:text-sm">
                        Reason for Cancellation
                      </Label>
                      <Textarea
                        id="cancel-reason"
                        placeholder="Provide a reason..."
                        className="text-sm resize-none"
                        rows={3}
                      />
                    </div>
                    <Button variant="destructive" className="w-full sm:w-auto text-sm">
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel Meeting
                    </Button>
                  </CardContent>
                </Card>

                {selectedMeeting?.status === "completed" && (
                  <Card className="bg-muted/30">
                    <CardHeader className="p-3 sm:p-4">
                      <CardTitle className="text-sm sm:text-base">Add Minutes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 space-y-3 sm:space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="minutes" className="text-xs sm:text-sm">
                          Meeting Minutes
                        </Label>
                        <Textarea
                          id="minutes"
                          placeholder="Enter meeting summary, decisions made, action items..."
                          className="text-sm resize-none"
                          rows={4}
                          defaultValue={selectedMeeting?.minutes || ""}
                        />
                      </div>
                      <Button className="w-full sm:w-auto text-sm">
                        <Download className="mr-2 h-4 w-4" />
                        Save Minutes
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <DialogTitle className="text-lg sm:text-xl">Schedule New Meeting</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Create a new meeting for your group</DialogDescription>
          </DialogHeader>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="meeting-title" className="text-xs sm:text-sm">
                  Meeting Title
                </Label>
                <Input id="meeting-title" placeholder="e.g., Monthly Financial Review" className="text-sm" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-desc" className="text-xs sm:text-sm">
                  Description
                </Label>
                <Textarea
                  id="meeting-desc"
                  placeholder="Describe the purpose and topics of the meeting..."
                  className="text-sm resize-none"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="meeting-date" className="text-xs sm:text-sm">
                    Date
                  </Label>
                  <Input id="meeting-date" type="date" className="text-sm" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meeting-time" className="text-xs sm:text-sm">
                    Time
                  </Label>
                  <Input id="meeting-time" type="time" className="text-sm" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-duration" className="text-xs sm:text-sm">
                  Duration
                </Label>
                <Select>
                  <SelectTrigger id="meeting-duration" className="text-sm">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-group" className="text-xs sm:text-sm">
                  Group
                </Label>
                <Select>
                  <SelectTrigger id="meeting-group" className="text-sm">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g1">Savings Circle A</SelectItem>
                    <SelectItem value="g2">Investment Group</SelectItem>
                    <SelectItem value="g3">Community Savers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-xs sm:text-sm">Meeting Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button type="button" variant="outline" className="justify-start text-sm bg-transparent">
                    <MapPin className="mr-2 h-4 w-4" />
                    In-person
                  </Button>
                  <Button type="button" variant="outline" className="justify-start text-sm bg-transparent">
                    <Video className="mr-2 h-4 w-4" />
                    Virtual
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="meeting-location" className="text-xs sm:text-sm">
                  Location
                </Label>
                <Input id="meeting-location" placeholder="Conference Room A or meeting link" className="text-sm" />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="flex-1 text-sm">
                Cancel
              </Button>
              <Button onClick={() => setShowScheduleDialog(false)} className="flex-1 text-sm">
                Create Meeting
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function MeetingsView() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      <Suspense fallback={<MeetingsViewSkeleton />}>
        <MeetingsContent />
      </Suspense>
    </div>
  )
}
