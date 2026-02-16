"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  Plus,
  Trash2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { createGroupMeeting, getGroups, getGroupMemberships } from "@/lib/actions/groups"
import { getMeetings, updateMeetingRSVP } from "@/lib/actions/meetings"
import { toast } from "sonner"
import { GroupWithDetails } from "@/lib/types/groups"
import { useMeetingPolls, useCreatePoll, useSubmitVote } from "@/hooks/usePolls"
import { useMeetingMinutes, useSaveMeetingMinutes } from "@/hooks/useMinutes"
import { useMeetingGoals, useCreateGoal, useContributeToGoal } from "@/hooks/useGoals"
import { useUploadThing } from "@/lib/uploadthing-react"



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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [searchQuery, setSearchQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState("all")
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showPollDialog, setShowPollDialog] = useState(false)
  const [showGoalsDialog, setShowGoalsDialog] = useState(false)
  const [showBudgetDialog, setShowBudgetDialog] = useState(false)
  const [showMinutesDialog, setShowMinutesDialog] = useState(false)
  const [showRewardsDialog, setShowRewardsDialog] = useState(false)
  const [showSubGroupsDialog, setShowSubGroupsDialog] = useState(false)
  const [selectedPoll, setSelectedPoll] = useState<any>(null)

  const [showCreatePollDialog, setShowCreatePollDialog] = useState(false)
  const [createPollMeetingId, setCreatePollMeetingId] = useState<string | null>(null)
  const [pollTitle, setPollTitle] = useState("")
  const [pollDescription, setPollDescription] = useState("")
  const [pollEndDate, setPollEndDate] = useState("")
  const [showCreateGoalDialog, setShowCreateGoalDialog] = useState(false)
  const [createGoalMeetingId, setCreateGoalMeetingId] = useState<string | null>(null)
  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalCurrent, setGoalCurrent] = useState("0")
  const [goalDeadline, setGoalDeadline] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [showContributeDialog, setShowContributeDialog] = useState(false)
  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null)
  const [contributeGoalName, setContributeGoalName] = useState("")
  const [contributeAmount, setContributeAmount] = useState("")
  const [showCreateBudgetDialog, setShowCreateBudgetDialog] = useState(false)
  const [showCreateMeetingDialog, setShowCreateMeetingDialog] = useState(false)
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false)
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [pollSelectedOptions, setPollSelectedOptions] = useState<Record<string, string>>({})
  const [budgetCategories, setBudgetCategories] = useState([{ name: "", allocated: 0 }])
  const [minutesTextEdit, setMinutesTextEdit] = useState("")
  const [minutesKeyDecisionsEdit, setMinutesKeyDecisionsEdit] = useState<string[]>([])
  const [minutesActionItemsEdit, setMinutesActionItemsEdit] = useState<{ text: string; completed: boolean }[]>([])

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    isVirtual: true,
    location: "",
    groupId: "", // Will be set when groups load
  })

  const [agendaItems, setAgendaItems] = useState<string[]>([""])
  const [chairpersonMembershipId, setChairpersonMembershipId] = useState<string>("")
  const [noteTakerMembershipId, setNoteTakerMembershipId] = useState<string>("")
  const [groupMembers, setGroupMembers] = useState<{ id: string; user: { name: string | null; email: string } }[]>([])
  const [isLoadingGroupMembers, setIsLoadingGroupMembers] = useState(false)
  const [chairpersonPopoverOpen, setChairpersonPopoverOpen] = useState(false)
  const [noteTakerPopoverOpen, setNoteTakerPopoverOpen] = useState(false)

  const [groups, setGroups] = useState<GroupWithDetails[]>([])
  const [isLoadingGroups, setIsLoadingGroups] = useState(true)
  const [meetings, setMeetings] = useState<any[]>([])
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true)
  const [minutesDialogMeetings, setMinutesDialogMeetings] = useState<any[]>([])
  const [isLoadingMinutesDialog, setIsLoadingMinutesDialog] = useState(false)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getGroups()
        setGroups(fetchedGroups)
      } catch (error) {
        console.error("Failed to fetch groups:", error)
        toast.error("Failed to load groups")
      } finally {
        setIsLoadingGroups(false)
      }
    }

    if (isMounted) {
      fetchGroups()
    }
  }, [isMounted])

  // Groups where the user is OWNER or ADMIN (can create meetings)
  const myManagedGroups = (groups || []).filter(
    (g) => g.userMembershipRole === "OWNER" || g.userMembershipRole === "ADMIN"
  )
  const canCreateMeeting = myManagedGroups.length > 0

  // Debug: Show how many groups were loaded
  useEffect(() => {
    if (!isLoadingGroups && groups.length > 0) {
      // toast.info(`Loaded ${groups.length} groups`)
    }
  }, [isLoadingGroups, groups.length])

  // Auto-select first group when groups load
  useEffect(() => {
    if (myManagedGroups.length > 0 && !newMeeting.groupId) {
      setNewMeeting(prev => ({ ...prev, groupId: myManagedGroups[0].id }))
    }
  }, [myManagedGroups, newMeeting.groupId])

  // Fetch group members for chairperson/note-taker when group is selected (e.g. in create meeting dialog)
  useEffect(() => {
    if (!newMeeting.groupId) {
      setGroupMembers([])
      return
    }
    let cancelled = false
    setIsLoadingGroupMembers(true)
    getGroupMemberships(newMeeting.groupId).then((members) => {
      if (!cancelled) {
        setGroupMembers(members)
      }
    }).finally(() => {
      if (!cancelled) setIsLoadingGroupMembers(false)
    })
    return () => { cancelled = true }
  }, [newMeeting.groupId])

  const meetingIdForPolls = selectedMeeting?.id ?? null
  const meetingIdForCreate = createPollMeetingId ?? meetingIdForPolls
  const { data: meetingPolls = [], isLoading: isLoadingPolls } = useMeetingPolls(meetingIdForPolls)
  const createPollMutation = useCreatePoll(meetingIdForCreate)
  const submitVoteMutation = useSubmitVote(meetingIdForPolls)

  const meetingIdForMinutes = selectedMeeting?.id ?? null
  const { data: meetingMinutes, isLoading: isLoadingMinutes } = useMeetingMinutes(meetingIdForMinutes)
  const saveMinutesMutation = useSaveMeetingMinutes(meetingIdForMinutes)

  const meetingIdForGoals = selectedMeeting?.id ?? null
  const { data: meetingGoals = [], isLoading: isLoadingGoals } = useMeetingGoals(meetingIdForGoals)
  const createGoalMutation = useCreateGoal(createGoalMeetingId ?? meetingIdForGoals)
  const contributeToGoalMutation = useContributeToGoal(meetingIdForGoals)
  const minutesFileInputRef = useRef<HTMLInputElement>(null)
  const { startUpload: startMinutesUpload, isUploading: isUploadingMinutes } = useUploadThing(
    "meetingMinutesUploader",
    {
      onClientUploadComplete: (res) => {
        if (res?.[0]?.url && meetingIdForMinutes) {
          saveMinutesMutation.mutate(
            { minutesFileUrl: res[0].url },
            {
              onSuccess: () => toast.success("Minutes document uploaded"),
              onError: (e) => toast.error(e?.message ?? "Failed to save document link"),
            }
          )
        }
      },
      onUploadError: (e) => {
        toast.error(e?.message ?? "Upload failed")
      },
    }
  )

  useEffect(() => {
    setMinutesTextEdit(meetingMinutes?.minutesText ?? "")
    setMinutesKeyDecisionsEdit(meetingMinutes?.minutesKeyDecisions ?? [])
    const items = meetingMinutes?.minutesActionItems ?? []
    const completed = meetingMinutes?.minutesActionItemsCompleted ?? []
    setMinutesActionItemsEdit(
      items.map((text, i) => ({ text, completed: completed[i] ?? false }))
    )
  }, [meetingMinutes?.minutesText, meetingMinutes?.minutesKeyDecisions, meetingMinutes?.minutesActionItems, meetingMinutes?.minutesActionItemsCompleted, meetingIdForMinutes])

  const fetchMeetings = useCallback(async () => {
    try {
      setIsLoadingMeetings(true)
      const fetchedMeetings = await getMeetings({
        groupId: groupFilter
      })
      setMeetings(fetchedMeetings)
    } catch (error) {
      console.error("Failed to fetch meetings:", error)
      toast.error("Failed to load meetings")
    } finally {
      setIsLoadingMeetings(false)
    }
  }, [groupFilter])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  // Refetch meetings when Goals dialog opens so it shows latest data
  useEffect(() => {
    if (showGoalsDialog) {
      fetchMeetings()
    }
  }, [showGoalsDialog, fetchMeetings])

  // When Minutes dialog opens, fetch meetings from ALL groups the user is a member of
  useEffect(() => {
    if (!showMinutesDialog) return
    let cancelled = false
    setIsLoadingMinutesDialog(true)
    getMeetings({ groupId: "all" })
      .then((fetched) => {
        if (!cancelled) setMinutesDialogMeetings(fetched ?? [])
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch meetings for minutes dialog:", err)
          toast.error("Failed to load meeting minutes")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMinutesDialog(false)
      })
    return () => {
      cancelled = true
    }
  }, [showMinutesDialog])

  const handleCreateMeeting = async () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setIsCreatingMeeting(true)
      const meetingDateTime = new Date(`${newMeeting.date}T${newMeeting.time}`)

      const agendaArray = agendaItems
        .map((s) => s.trim())
        .filter(Boolean)

      const result = await createGroupMeeting({
        groupId: newMeeting.groupId,
        title: newMeeting.title,
        description: newMeeting.description?.trim() || undefined,
        agenda: agendaArray.length > 0 ? agendaArray : undefined,
        date: meetingDateTime,
        isVirtual: newMeeting.isVirtual,
        location: newMeeting.location,
        chairpersonMembershipId: chairpersonMembershipId || undefined,
        noteTakerMembershipId: noteTakerMembershipId || undefined,
      })

      if (result.success) {
        if (result.warning) {
          toast.warning(result.warning, { duration: 6000 })
        } else {
          toast.success("Meeting created successfully!")
        }
        setShowCreateMeetingDialog(false)
        setNewMeeting({
          title: "",
          description: "",
          date: "",
          time: "",
          isVirtual: true,
          location: "",
          groupId: myManagedGroups.length > 0 ? myManagedGroups[0].id : "",
        })
        setAgendaItems([""])
        setChairpersonMembershipId("")
        setNoteTakerMembershipId("")
        // Refresh meetings
        const fetchedMeetings = await getMeetings({ groupId: groupFilter })
        setMeetings(fetchedMeetings)
      } else {
        toast.error(result.error || "Failed to create meeting")
      }
    } catch (error) {
      console.error("Error creating meeting:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsCreatingMeeting(false)
    }
  }

  const filteredMeetings = (meetings || []).filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.group.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = groupFilter === "all" || meeting.group.id === groupFilter
    const matchesTab =
      (activeTab === "upcoming" && meeting.status === "upcoming") ||
      (activeTab === "past" && (meeting.status === "completed" || meeting.status === "cancelled"))
    return matchesSearch && matchesGroup && matchesTab
  })

  const upcomingCount = (meetings || []).filter((m) => m.status === "upcoming").length
  const pastCount = (meetings || []).filter((m) => m.status === "completed" || m.status === "cancelled").length
  const confirmedCount = (meetings || []).filter((m) => m.myRsvp === "confirmed" && m.status === "upcoming").length

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

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">My Meetings</h2>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Manage your group meeting schedule and attendance
          </p>
        </div>
        {canCreateMeeting && (
          <Button onClick={() => setShowCreateMeetingDialog(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Meeting
          </Button>
        )}
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
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
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
            {/* <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowBudgetDialog(true)}
            >
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              <span className="text-xs sm:text-sm">Budget</span>
            </Button> */}
            {/* <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowMinutesDialog(true)}
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
              <span className="text-xs sm:text-sm">Minutes</span>
            </Button> */}
            {/* <Button
              variant="outline"
              className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent"
              onClick={() => setShowRewardsDialog(true)}
            >
              <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
              <span className="text-xs sm:text-sm">Rewards</span>
            </Button> */}
            {/* 
             */}
            {/* <Button variant="outline" className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
              <span className="text-xs sm:text-sm">My Role</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-auto py-3 sm:py-4 gap-2 bg-transparent">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
              <span className="text-xs sm:text-sm">Analytics</span>
            </Button> */}
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
                          <Button
                            size="sm"
                            className="text-xs sm:text-sm flex-1 sm:flex-initial"
                            onClick={async (e) => {
                              e.stopPropagation()
                              const result = await updateMeetingRSVP(meeting.id, "PRESENT")
                              if (result.success) {
                                toast.success("RSVP confirmed!")
                                const fetchedMeetings = await getMeetings({ groupId: groupFilter })
                                setMeetings(fetchedMeetings)
                              } else {
                                toast.error(result.error || "Failed to update RSVP")
                              }
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Confirm RSVP
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm flex-1 sm:flex-initial bg-transparent"
                            onClick={async (e) => {
                              e.stopPropagation()
                              const result = await updateMeetingRSVP(meeting.id, "ABSENT")
                              if (result.success) {
                                toast.success("RSVP declined")
                                const fetchedMeetings = await getMeetings({ groupId: groupFilter })
                                setMeetings(fetchedMeetings)
                              } else {
                                toast.error(result.error || "Failed to update RSVP")
                              }
                            }}
                          >
                            <XCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Decline
                          </Button>
                        </>
                      )}
                      {meeting.isVirtual && meeting.status === "upcoming" && meeting.meetingLink && (
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            className="w-full text-xs sm:text-sm"
                            variant="default"
                          >
                            <Video className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Join Meeting
                          </Button>
                        </a>
                      )}
                      {/* {meeting.zoomMeetingId && meeting.status === "upcoming" && (
                        <Button size="sm" className="text-xs sm:text-sm bg-blue-500 hover:bg-blue-600">
                          <Video className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Join Zoom
                        </Button>
                      )} */}
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
              {/* <TabsTrigger value="budget" className="text-xs sm:text-sm">
                Budget
              </TabsTrigger> */}
              <TabsTrigger value="minutes" className="text-xs sm:text-sm">
                Minutes
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
                  {/* {selectedMeeting?.status === "upcoming" && (
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
                  )} */}
                </CardContent>
              </Card>

              {(meetingMinutes?.minutesText ||
                meetingMinutes?.minutesFileUrl ||
                (meetingMinutes?.minutesKeyDecisions?.length ?? 0) > 0 ||
                (meetingMinutes?.minutesActionItems?.length ?? 0) > 0) && (
                <Card className="bg-muted/30">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground">Meeting Minutes</CardTitle>
                    {meetingMinutes.minutesFileUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={meetingMinutes.minutesFileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {meetingMinutes.minutesText && (
                      <p className="text-sm whitespace-pre-wrap">{meetingMinutes.minutesText}</p>
                    )}
                    {(meetingMinutes?.minutesKeyDecisions?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Key Decisions</h4>
                        <ul className="list-disc list-inside text-sm space-y-0.5">
                          {meetingMinutes.minutesKeyDecisions.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(meetingMinutes?.minutesActionItems?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Action Items</h4>
                        <ul className="text-sm space-y-1">
                          {meetingMinutes.minutesActionItems.map((item: string, i: number) => {
                            const completed = meetingMinutes?.minutesActionItemsCompleted?.[i] ?? false
                            return (
                              <li key={i} className="flex items-center gap-2">
                                <Checkbox checked={completed} disabled className="shrink-0" />
                                <span className={completed ? "line-through text-muted-foreground" : ""}>{item}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}
                    {meetingMinutes.minutesFileUrl &&
                      !meetingMinutes.minutesText &&
                      (meetingMinutes?.minutesKeyDecisions?.length ?? 0) === 0 &&
                      (meetingMinutes?.minutesActionItems?.length ?? 0) === 0 && (
                        <a
                          href={meetingMinutes.minutesFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View minutes document
                        </a>
                      )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Agenda Tab */}
            <TabsContent value="agenda" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Meeting Agenda</h3>
                {/* {selectedMeeting?.myRole === "chairperson" && (
                  <Button size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Agenda
                  </Button>
                )} */}
              </div>
              {selectedMeeting?.agenda?.map((item, index) => (
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
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                    {meetingPolls.filter((p) => p.status === "active").length} Active
                  </Badge>
                  {meetingIdForPolls && selectedMeeting?.canCreatePoll && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setCreatePollMeetingId(meetingIdForPolls)
                        setShowCreatePollDialog(true)
                      }}
                    >
                      <Vote className="mr-2 h-4 w-4" />
                      Create Poll
                    </Button>
                  )}
                </div>
              </div>

              {isLoadingPolls ? (
                <p className="text-sm text-muted-foreground">Loading polls...</p>
              ) : (
                <div className="space-y-4">
                  {meetingPolls.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No polls for this meeting yet.</p>
                  ) : (
                    meetingPolls.map((poll) => {
                      const selectedOption = pollSelectedOptions[poll.id] ?? poll.myVote ?? ""
                      const totalVotes = Object.values(poll.votes).reduce((a, b) => a + b, 0)
                      return (
                        <Card key={poll.id} className="bg-muted/30">
                          <CardHeader>
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base">{poll.title}</CardTitle>
                                {poll.description && (
                                  <p className="text-sm text-muted-foreground">{poll.description}</p>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                  {poll.status === "active"
                                    ? `Closes at ${new Date(poll.endDate).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}`
                                    : `Closed at ${new Date(poll.endDate).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}`}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={poll.status === "active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}
                              >
                                {poll.status === "active" ? "Open" : "Closed"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <RadioGroup
                              value={selectedOption}
                              onValueChange={(value) =>
                                setPollSelectedOptions((prev) => ({ ...prev, [poll.id]: value }))
                              }
                              className="space-y-3"
                            >
                              {poll.options?.map((option: string) => {
                                const votes = poll.votes[option] ?? 0
                                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

                                return (
                                  <div key={option} className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value={option}
                                        id={`poll-${poll.id}-${option}`}
                                        disabled={poll.status === "ended"}
                                      />
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

                            {poll.status === "active" && (
                              <Button
                                size="sm"
                                className="flex-1"
                                disabled={!selectedOption || submitVoteMutation.isPending}
                                onClick={async () => {
                                  if (!selectedOption) return
                                  try {
                                    await submitVoteMutation.mutateAsync({
                                      voteId: poll.id,
                                      selectedOption,
                                    })
                                    toast.success("Vote submitted")
                                  } catch (e) {
                                    toast.error(e instanceof Error ? e.message : "Failed to submit vote")
                                  }
                                }}
                              >
                                {submitVoteMutation.isPending ? "Submitting..." : "Submit Vote"}
                              </Button>
                            )}
                            {poll.myVote && (
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                                You voted: {poll.myVote}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="goals" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shared Financial Goals</h3>
                <Button
                  size="sm"
                  onClick={() => {
                    setCreateGoalMeetingId(selectedMeeting?.id ?? null)
                    setGoalName("")
                    setGoalTarget("")
                    setGoalCurrent("0")
                    setGoalDeadline("")
                    setGoalDescription("")
                    setShowGoalsDialog(false)
                    setShowCreateGoalDialog(true)
                  }}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </div>

              {isLoadingGoals ? (
                <p className="text-sm text-muted-foreground">Loading goals…</p>
              ) : (
                <div className="space-y-4">
                  {meetingGoals.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No financial goals for this meeting yet.</p>
                  ) : (
                    meetingGoals.map((goal) => {
                      const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
                      return (
                        <Card key={goal.id} className="bg-muted/30">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{goal.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {goal.deadline
                                    ? `Deadline: ${new Date(goal.deadline).toLocaleDateString()}`
                                    : "No deadline"}
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
                            <Progress value={Math.min(progress, 100)} className="h-3" />
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Target</span>
                              <span className="font-semibold">${goal.target.toLocaleString()}</span>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              variant="outline"
                              onClick={() => {
                                setContributeGoalId(goal.id)
                                setContributeGoalName(goal.name)
                                setContributeAmount("")
                                setShowContributeDialog(true)
                              }}
                            >
                              <DollarSign className="mr-2 h-4 w-4" />
                              Contribute
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              )}
            </TabsContent>

            {/* <TabsContent value="budget" className="space-y-4 mt-4">
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
                {selectedMeeting?.budget?.categories?.map((category) => {
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
            </TabsContent> */}

            <TabsContent value="minutes" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Meeting Minutes</h3>
                {meetingMinutes?.canEditMinutes && (
                  <span className="text-xs text-muted-foreground">You can add or edit minutes</span>
                )}
              </div>

              {isLoadingMinutes ? (
                <Card className="bg-muted/30">
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground">Loading minutes…</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="p-6 space-y-4">
                    {meetingMinutes?.canEditMinutes && (
                      <div className="space-y-3">
                        <Label>Upload minutes document (PDF or Word)</Label>
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            ref={minutesFileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files
                              if (files?.length) startMinutesUpload(Array.from(files))
                              e.target.value = ""
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isUploadingMinutes}
                            onClick={() => minutesFileInputRef.current?.click()}
                          >
                            {isUploadingMinutes ? "Uploading…" : "Choose file"}
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {meetingMinutes?.minutesFileUrl ? "Document attached" : "Optional"}
                          </span>
                        </div>
                        <div>
                          <Label htmlFor="minutes-text">Summary or notes (optional)</Label>
                          <Textarea
                            id="minutes-text"
                            placeholder="Add a short summary or key points…"
                            value={minutesTextEdit}
                            onChange={(e) => setMinutesTextEdit(e.target.value)}
                            className="min-h-[120px] mt-1"
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">Key Decisions</Label>
                          <div className="space-y-2">
                            {minutesKeyDecisionsEdit.map((item, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <Input
                                  placeholder="e.g. Approved investment in government bonds (8-2 vote)"
                                  value={item}
                                  onChange={(e) => {
                                    const next = [...minutesKeyDecisionsEdit]
                                    next[idx] = e.target.value
                                    setMinutesKeyDecisionsEdit(next)
                                  }}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0 text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    setMinutesKeyDecisionsEdit((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setMinutesKeyDecisionsEdit((prev) => [...prev, ""])}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add key decision
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block">Action Items</Label>
                          <div className="space-y-2">
                            {minutesActionItemsEdit.map((item, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <Checkbox
                                  checked={item.completed}
                                  onCheckedChange={(checked) => {
                                    setMinutesActionItemsEdit((prev) =>
                                      prev.map((x, i) =>
                                        i === idx ? { ...x, completed: !!checked } : x
                                      )
                                    )
                                  }}
                                  className="shrink-0"
                                />
                                <Input
                                  placeholder="e.g. Treasurer to process loan disbursements by March 25"
                                  value={item.text}
                                  onChange={(e) => {
                                    setMinutesActionItemsEdit((prev) =>
                                      prev.map((x, i) =>
                                        i === idx ? { ...x, text: e.target.value } : x
                                      )
                                    )
                                  }}
                                  className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="shrink-0 text-muted-foreground hover:text-destructive"
                                  onClick={() =>
                                    setMinutesActionItemsEdit((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setMinutesActionItemsEdit((prev) => [...prev, { text: "", completed: false }])
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add action item
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          disabled={saveMinutesMutation.isPending}
                          onClick={async () => {
                            try {
                              await saveMinutesMutation.mutateAsync({
                                minutesText: minutesTextEdit || null,
                                minutesFileUrl: meetingMinutes?.minutesFileUrl ?? undefined,
                                minutesKeyDecisions: minutesKeyDecisionsEdit.filter((s) => s.trim()),
                                minutesActionItems: minutesActionItemsEdit.map((x) => x.text.trim()).filter(Boolean),
                                minutesActionItemsCompleted: minutesActionItemsEdit
                                  .filter((x) => x.text.trim())
                                  .map((x) => x.completed),
                              })
                              toast.success("Minutes saved")
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : "Failed to save minutes")
                            }
                          }}
                        >
                          {saveMinutesMutation.isPending ? "Saving…" : "Save minutes"}
                        </Button>
                      </div>
                    )}

                    {(meetingMinutes?.minutesText ||
                      meetingMinutes?.minutesFileUrl ||
                      (meetingMinutes?.minutesKeyDecisions?.length ?? 0) > 0 ||
                      (meetingMinutes?.minutesActionItems?.length ?? 0) > 0) ? (
                      <div className="space-y-3 pt-2 border-t">
                        <h4 className="font-semibold">Saved minutes</h4>
                        {meetingMinutes.minutesText && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {meetingMinutes.minutesText}
                          </p>
                        )}
                        {(meetingMinutes?.minutesKeyDecisions?.length ?? 0) > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold mb-1">Key Decisions</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {meetingMinutes.minutesKeyDecisions.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(meetingMinutes?.minutesActionItems?.length ?? 0) > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold mb-1">Action Items</h5>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {meetingMinutes.minutesActionItems.map((item: string, i: number) => {
                                const completed = meetingMinutes?.minutesActionItemsCompleted?.[i] ?? false
                                return (
                                  <li key={i} className="flex items-center gap-2">
                                    <Checkbox checked={completed} disabled className="shrink-0" />
                                    <span className={completed ? "line-through" : ""}>{item}</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                        {meetingMinutes.minutesFileUrl && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={meetingMinutes.minutesFileUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download document
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={meetingMinutes.minutesFileUrl} target="_blank" rel="noopener noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                View full minutes
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : !meetingMinutes?.canEditMinutes ? (
                      <p className="text-sm text-muted-foreground">No minutes for this meeting yet.</p>
                    ) : null}
                  </CardContent>
                </Card>
              )}

              {selectedMeeting && (
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-semibold mb-1">Attendance</h4>
                  <p>
                    {selectedMeeting.attendees} of {selectedMeeting.totalMembers} members present
                  </p>
                </div>
              )}
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

          {(meetings || []).some((m: any) => m.canCreatePoll) && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => {
                  setShowPollDialog(false)
                  setCreatePollMeetingId(null)
                  setShowCreatePollDialog(true)
                }}
                size="sm"
              >
                <Vote className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {(meetings || []).filter((m) => m.status === "upcoming").length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Vote className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No upcoming meetings</p>
                <p className="text-sm mt-1">Polls are shown per meeting. Create or open a meeting, then go to the Polls tab to view and vote on polls.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Open a meeting and go to the Polls tab to view and vote on polls.</p>
                <div className="grid gap-2">
                  {(meetings || [])
                    .filter((m) => m.status === "upcoming")
                    .slice(0, 5)
                    .map((meeting) => (
                      <Button
                        key={meeting.id}
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          setShowPollDialog(false)
                          setSelectedMeeting(meeting as any)
                        }}
                      >
                        {meeting.title} – {meeting.group.name}
                      </Button>
                    ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showCreatePollDialog}
        onOpenChange={(open) => {
          setShowCreatePollDialog(open)
          if (!open) {
            setPollTitle("")
            setPollDescription("")
            setPollEndDate("")
            setPollOptions(["", ""])
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Poll</DialogTitle>
            <DialogDescription>Create a poll for your group members to vote on</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!meetingIdForCreate ? (
              <div className="space-y-2">
                <Label>Select Meeting *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                    >
                      {createPollMeetingId
                        ? (() => {
                            const m = (meetings || []).find((x) => x.id === createPollMeetingId)
                            return m ? `${m.title} – ${m.group.name}` : "Choose a meeting"
                          })()
                        : "Choose a meeting to add the poll to"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-[200] w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search meetings..." />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandGroup>
                          {(meetings || [])
                            .filter((m) => m.status === "upcoming")
                            .map((m) => (
                              <CommandItem
                                key={m.id}
                                value={`${m.title} ${m.group.name} ${m.date}`}
                                onSelect={() => setCreatePollMeetingId(m.id)}
                              >
                                <span className="truncate">
                                  {m.title} – {m.group.name} ({m.date})
                                </span>
                              </CommandItem>
                            ))}
                          {(meetings || []).filter((m) => m.status === "upcoming").length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              No upcoming meetings. Create a meeting first or open a meeting and use Create Poll in the Polls tab.
                            </div>
                          ) : null}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Or open a meeting and use Create Poll in the Polls tab.</p>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="poll-question">Poll Question *</Label>
              <Input
                id="poll-question"
                placeholder="e.g., Should we invest in government bonds?"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poll-description">Description (optional)</Label>
              <Textarea
                id="poll-description"
                placeholder="Brief context for the poll"
                value={pollDescription}
                onChange={(e) => setPollDescription(e.target.value)}
              />
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
              <Label htmlFor="poll-deadline">Voting Deadline *</Label>
              <Input
                id="poll-deadline"
                type="datetime-local"
                value={pollEndDate}
                onChange={(e) => setPollEndDate(e.target.value)}
              />
            </div>

            {meetingIdForCreate &&
              (selectedMeeting?.id === meetingIdForCreate
                ? !selectedMeeting?.canCreatePoll
                : !(meetings || []).find((m: any) => m.id === meetingIdForCreate)?.canCreatePoll) && (
              <p className="text-sm text-amber-600 dark:text-amber-500">
                Only the group owner or an admin can create polls for this meeting.
              </p>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                disabled={
                  !meetingIdForCreate ||
                  (selectedMeeting?.id === meetingIdForCreate
                    ? !selectedMeeting?.canCreatePoll
                    : !(meetings || []).find((m: any) => m.id === meetingIdForCreate)?.canCreatePoll) ||
                  !pollTitle.trim() ||
                  pollOptions.filter((o) => o.trim()).length < 2 ||
                  !pollEndDate ||
                  createPollMutation.isPending
                }
                onClick={async () => {
                  const meetingId = createPollMeetingId ?? selectedMeeting?.id
                  if (!meetingId) return
                  const options = pollOptions.map((o) => o.trim()).filter(Boolean)
                  if (options.length < 2) {
                    toast.error("At least 2 options are required")
                    return
                  }
                  if (!pollEndDate || new Date(pollEndDate) <= new Date()) {
                    toast.error("End date must be in the future")
                    return
                  }
                  try {
                    await createPollMutation.mutateAsync({
                      meetingId,
                      title: pollTitle.trim(),
                      description: pollDescription.trim() || undefined,
                      options,
                      endDate: pollEndDate,
                    })
                    toast.success("Poll created")
                    setShowCreatePollDialog(false)
                    setPollTitle("")
                    setPollDescription("")
                    setPollEndDate("")
                    setPollOptions(["", ""])
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Failed to create poll")
                  }
                }}
              >
                {createPollMutation.isPending ? "Creating..." : "Create Poll"}
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
            {/* <Button
              size="sm"
              onClick={() => {
                setCreateGoalMeetingId(null)
                setGoalName("")
                setGoalTarget("")
                setGoalCurrent("0")
                setGoalDeadline("")
                setGoalDescription("")
                setShowGoalsDialog(false)
                setShowCreateGoalDialog(true)
              }}
            >
              <Target className="h-4 w-4 mr-2" />
              Create Goal
            </Button> */}
          </div>

          <div className="space-y-4">
            {(meetings || [])
              .filter((m: any) => m.financialGoals && m.financialGoals.length > 0)
              .flatMap((meeting: any) =>
                (meeting.financialGoals ?? []).map((goal: any) => ({ meeting, goal }))
              )
              .map(({ meeting, goal }) => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
                const remaining = Math.max(0, goal.target - goal.current)
                return (
                  <Card key={goal.id} className="bg-card/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{goal.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{meeting.group?.name}</p>
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
                            ${Number(goal.current).toLocaleString()} / ${Number(goal.target).toLocaleString()}
                          </span>
                        </div>
                        <Progress value={Math.min(progress, 100)} className="h-3" />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Remaining</p>
                          <p className="text-sm font-semibold">${remaining.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Deadline</p>
                          <p className="text-sm font-semibold">
                            {goal.deadline
                              ? new Date(goal.deadline).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          setContributeGoalId(goal.id)
                          setContributeGoalName(goal.name)
                          setContributeAmount("")
                          setShowContributeDialog(true)
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Contribute
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            {(meetings || []).filter((m: any) => m.financialGoals?.length).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No financial goals yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateGoalDialog} onOpenChange={setShowCreateGoalDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Financial Goal</DialogTitle>
            <DialogDescription>Set a new financial target for a meeting</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-meeting">Select Meeting *</Label>
              <Select
                value={createGoalMeetingId ?? ""}
                onValueChange={(v) => setCreateGoalMeetingId(v || null)}
              >
                <SelectTrigger id="goal-meeting">
                  <SelectValue placeholder="Choose a meeting" />
                </SelectTrigger>
                <SelectContent>
                  {(meetings || []).map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.title} — {m.group?.name} ({new Date(m.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name *</Label>
              <Input
                id="goal-name"
                placeholder="e.g., Emergency Fund"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="goal-target"
                    type="number"
                    min={1}
                    placeholder="50000"
                    className="pl-9"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-current">Current Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="goal-current"
                    type="number"
                    min={0}
                    placeholder="0"
                    className="pl-9"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-deadline">Target Deadline (optional)</Label>
              <Input
                id="goal-deadline"
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description (optional)</Label>
              <Textarea
                id="goal-description"
                placeholder="Describe the purpose of this financial goal..."
                rows={3}
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                disabled={
                  !createGoalMeetingId ||
                  !goalName.trim() ||
                  !goalTarget ||
                  Number(goalTarget) <= 0 ||
                  createGoalMutation.isPending
                }
                onClick={async () => {
                  const meetingId = createGoalMeetingId
                  if (!meetingId) {
                    toast.error("Select a meeting")
                    return
                  }
                  if (!goalName.trim()) {
                    toast.error("Enter a goal name")
                    return
                  }
                  const target = Number(goalTarget)
                  if (target <= 0 || Number.isNaN(target)) {
                    toast.error("Enter a valid target amount")
                    return
                  }
                  try {
                    await createGoalMutation.mutateAsync({
                      meetingId,
                      name: goalName.trim(),
                      targetAmount: target,
                      currentAmount: Number(goalCurrent) || 0,
                      deadline: goalDeadline || null,
                      description: goalDescription.trim() || null,
                    })
                    toast.success("Goal created")
                    setShowCreateGoalDialog(false)
                    setGoalName("")
                    setGoalTarget("")
                    setGoalCurrent("0")
                    setGoalDeadline("")
                    setGoalDescription("")
                    setCreateGoalMeetingId(null)
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Failed to create goal")
                  }
                }}
              >
                {createGoalMutation.isPending ? "Creating…" : "Create Goal"}
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

      {/* Contribute to Goal Dialog */}
      <Dialog open={showContributeDialog} onOpenChange={setShowContributeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contribute to goal</DialogTitle>
            <DialogDescription>
              {contributeGoalName ? `Add to "${contributeGoalName}"` : "Enter amount to contribute"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contribute-amount">Amount ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contribute-amount"
                  type="number"
                  min={0.01}
                  step={0.01}
                  placeholder="0.00"
                  className="pl-9"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={
                  !contributeGoalId ||
                  !contributeAmount ||
                  Number(contributeAmount) <= 0 ||
                  contributeToGoalMutation.isPending
                }
                onClick={async () => {
                  if (!contributeGoalId) return
                  const amount = Number(contributeAmount)
                  if (amount <= 0 || Number.isNaN(amount)) {
                    toast.error("Enter a valid amount")
                    return
                  }
                  try {
                    await contributeToGoalMutation.mutateAsync({
                      goalId: contributeGoalId,
                      amount,
                    })
                    toast.success("Contribution added")
                    setShowContributeDialog(false)
                    setContributeGoalId(null)
                    setContributeGoalName("")
                    setContributeAmount("")
                    fetchMeetings()
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Failed to contribute")
                  }
                }}
              >
                {contributeToGoalMutation.isPending ? "Adding…" : "Contribute"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowContributeDialog(false)
                  setContributeGoalId(null)
                  setContributeGoalName("")
                  setContributeAmount("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Budget Dialog */}
      {/* <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
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
            {(meetings || [])
              .filter((m: any) => m.budget)
              .map((meeting: any) => {
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
            {(meetings || []).filter((m: any) => m.budget).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No budget data yet</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog> */}

      {/* <Dialog open={showCreateBudgetDialog} onOpenChange={setShowCreateBudgetDialog}>
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
      </Dialog> */}

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
                    className={`flex items-center justify-between p-3 rounded-lg ${member.userId === "u1" ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${idx === 0
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
            <DialogDescription>View past meeting minutes and important decisions from all your groups</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isLoadingMinutesDialog ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="text-sm">Loading meeting minutes…</p>
              </div>
            ) : (
              <>
            {/* Past Meetings with Minutes (from all groups user is a member of) */}
            {(minutesDialogMeetings || [])
              .filter(
                (m: any) =>
                  m.status === "completed" &&
                  (m.minutesText ||
                    m.minutesFileUrl ||
                    (m.minutesKeyDecisions?.length ?? 0) > 0 ||
                    (m.minutesActionItems?.length ?? 0) > 0)
              )
              .map((meeting: any) => (
                <Card key={meeting.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{meeting.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{meeting.group.name}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span suppressHydrationWarning>{new Date(meeting.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>
                              {meeting.attendees}/{meeting.totalMembers} attended
                            </span>
                          </div>
                        </div>
                      </div>
                      {meeting.minutesFileUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={meeting.minutesFileUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {meeting.minutesText && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Summary</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {meeting.minutesText}
                          </p>
                        </div>
                      )}
                      {(meeting.minutesKeyDecisions?.length ?? 0) > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Key Decisions</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {meeting.minutesKeyDecisions.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(meeting.minutesActionItems?.length ?? 0) > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Action Items</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {meeting.minutesActionItems.map((item: string, i: number) => {
                              const completed = meeting.minutesActionItemsCompleted?.[i] ?? false
                              return (
                                <li key={i} className="flex items-center gap-2">
                                  <Checkbox checked={completed} disabled className="shrink-0" />
                                  <span className={completed ? "line-through" : ""}>{item}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                      {meeting.minutesFileUrl && !meeting.minutesText &&
                        (meeting.minutesKeyDecisions?.length ?? 0) === 0 &&
                        (meeting.minutesActionItems?.length ?? 0) === 0 && (
                          <div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={meeting.minutesFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                View minutes document
                              </a>
                            </Button>
                          </div>
                        )}
                      {meeting.minutesFileUrl &&
                        (meeting.minutesText ||
                          (meeting.minutesKeyDecisions?.length ?? 0) > 0 ||
                          (meeting.minutesActionItems?.length ?? 0) > 0) && (
                          <div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={meeting.minutesFileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                View full minutes document
                              </a>
                            </Button>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}

            {(minutesDialogMeetings || []).filter(
              (m: any) =>
                m.status === "completed" &&
                (m.minutesText ||
                  m.minutesFileUrl ||
                  (m.minutesKeyDecisions?.length ?? 0) > 0 ||
                  (m.minutesActionItems?.length ?? 0) > 0)
            ).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No meeting minutes available yet</p>
              </div>
            )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Meeting Dialog */}
      <Dialog open={showCreateMeetingDialog} onOpenChange={setShowCreateMeetingDialog}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Meeting</DialogTitle>
            <DialogDescription>
              Schedule a meeting for your group members. (Found {myManagedGroups.length} groups)
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pt-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="groupId">Select Group</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="groupId"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {newMeeting.groupId
                        ? myManagedGroups.find((g) => g.id === newMeeting.groupId)?.name ?? "Select a group"
                        : "Select a group"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-[100] w-[var(--radix-select-trigger-width,20rem)] p-0">
                    <Command>
                      <CommandInput placeholder="Search groups..." />
                      <CommandList className="max-h-60 overflow-y-auto">
                        <CommandGroup>
                          {myManagedGroups.length > 0 ? (
                            myManagedGroups.map((group) => (
                              <CommandItem
                                key={group.id}
                                value={group.name}
                                onSelect={() => {
                                  setNewMeeting({ ...newMeeting, groupId: group.id })
                                }}
                              >
                                {group.name}
                              </CommandItem>
                            ))
                          ) : (
                            <CommandItem disabled value="no-groups">
                              No groups available
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Monthly Review"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What is this meeting about?"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="isVirtual"
                  checked={newMeeting.isVirtual}
                  onCheckedChange={(checked) =>
                    setNewMeeting({ ...newMeeting, isVirtual: !!checked })
                  }
                />
                <Label htmlFor="isVirtual" className="flex items-center gap-2 cursor-pointer">
                  <Video className="h-4 w-4 text-blue-500" />
                  Virtual Meeting (Google Meet)
                </Label>
              </div>
              {!newMeeting.isVirtual && (
                <div className="grid gap-2">
                  <Label htmlFor="location">Physical Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Office Boardroom"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="agenda" className="mt-4 space-y-4">
              <div className="grid gap-2">
                <Label>Meeting Agenda (Optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Add structured agenda items in the order they will be discussed.
                </p>
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {agendaItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-6 text-xs text-muted-foreground text-right">
                        {index + 1}.
                      </span>
                      <Input
                        placeholder="e.g., Review last month&apos;s savings and contributions"
                        value={item}
                        onChange={(e) => {
                          const next = [...agendaItems]
                          next[index] = e.target.value
                          setAgendaItems(next)
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        onClick={() => {
                          if (agendaItems.length === 1) {
                            setAgendaItems([""])
                            return
                          }
                          setAgendaItems(agendaItems.filter((_, i) => i !== index))
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 w-full justify-center"
                  onClick={() => setAgendaItems((prev) => [...prev, ""])}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add agenda item
                </Button>
              </div>
              <div className="grid gap-2 pt-2 border-t">
                <Label>Roles (Optional)</Label>
                <p className="text-xs text-muted-foreground">
                  Select a group member to chair the meeting and one to take notes. Only members of the selected group are shown.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="chairperson">Chairperson</Label>
                    <Popover open={chairpersonPopoverOpen} onOpenChange={setChairpersonPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="chairperson"
                          role="combobox"
                          className="w-full justify-between font-normal"
                          disabled={!newMeeting.groupId}
                        >
                          {isLoadingGroupMembers
                            ? "Loading members..."
                            : chairpersonMembershipId
                              ? groupMembers.find((m) => m.id === chairpersonMembershipId)?.user.name ||
                                groupMembers.find((m) => m.id === chairpersonMembershipId)?.user.email ||
                                "Select member"
                              : "Select member"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search member..." />
                          <CommandList>
                            <CommandGroup>
                              <CommandItem
                                value="none"
                                onSelect={() => {
                                  setChairpersonMembershipId("")
                                  setChairpersonPopoverOpen(false)
                                }}
                              >
                                None
                              </CommandItem>
                              {groupMembers.length === 0 && !isLoadingGroupMembers ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  No members in this group
                                </div>
                              ) : (
                                groupMembers.map((m) => (
                                  <CommandItem
                                    key={m.id}
                                    value={[m.user.name, m.user.email].filter(Boolean).join(" ")}
                                    onSelect={() => {
                                      setChairpersonMembershipId(m.id)
                                      setChairpersonPopoverOpen(false)
                                    }}
                                  >
                                    {m.user.name || m.user.email}
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="noteTaker">Minutes taker</Label>
                    <Popover open={noteTakerPopoverOpen} onOpenChange={setNoteTakerPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="noteTaker"
                          role="combobox"
                          className="w-full justify-between font-normal"
                          disabled={!newMeeting.groupId}
                        >
                          {isLoadingGroupMembers
                            ? "Loading members..."
                            : noteTakerMembershipId
                              ? groupMembers.find((m) => m.id === noteTakerMembershipId)?.user.name ||
                                groupMembers.find((m) => m.id === noteTakerMembershipId)?.user.email ||
                                "Select member"
                              : "Select member"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search member..." />
                          <CommandList>
                            <CommandGroup>
                              <CommandItem
                                value="none"
                                onSelect={() => {
                                  setNoteTakerMembershipId("")
                                  setNoteTakerPopoverOpen(false)
                                }}
                              >
                                None
                              </CommandItem>
                              {groupMembers.length === 0 && !isLoadingGroupMembers ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  No members in this group
                                </div>
                              ) : (
                                groupMembers.map((m) => (
                                  <CommandItem
                                    key={m.id}
                                    value={[m.user.name, m.user.email].filter(Boolean).join(" ")}
                                    onSelect={() => {
                                      setNoteTakerMembershipId(m.id)
                                      setNoteTakerPopoverOpen(false)
                                    }}
                                  >
                                    {m.user.name || m.user.email}
                                  </CommandItem>
                                ))
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateMeetingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMeeting} disabled={isCreatingMeeting}>
              {isCreatingMeeting ? "Creating..." : "Create Meeting"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
