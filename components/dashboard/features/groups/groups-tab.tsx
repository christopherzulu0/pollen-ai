"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  FileText,
  LogIn,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  Calendar,
  Wallet,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ErrorBoundary } from "react-error-boundary"
import { useRouter } from "next/navigation"

interface Group {
  id: string
  name: string
  status: string
  createdAt: string
  contributionAmount: number
  description?: string
  nextMeetingDate?: string
  memberships?: { id: string; user: { name: string; avatar?: string } }[]
  totalSavings?: number
}

// Schema for creating a new group
const createGroupSchema = z.object({
  name: z.string().min(3, { message: "Group name must be at least 3 characters" }),
  description: z.string().optional(),
  contributionAmount: z.coerce.number().min(1, { message: "Contribution amount must be at least 1" }),
  meetingFrequency: z.enum(["weekly", "biweekly", "monthly"]),
  nextMeetingDate: z.string().min(1, { message: "Next meeting date is required" }),
})

// Schema for joining an existing group
const joinGroupSchema = z.object({
  groupId: z.string().min(1, { message: "Group ID is required" }),
  inviteCode: z.string().min(6, { message: "Invite code must be at least 6 characters" }),
})

function ErrorFallback({ error, resetErrorBoundary }) {
  const { toast } = useToast()

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
        <Button
          onClick={() => {
            resetErrorBoundary()
            toast({
              title: "Retrying",
              description: "Attempting to reload the groups data",
            })
          }}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  )
}

export function GroupsTab() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Create group form
  const createGroupForm = useForm<z.infer<typeof createGroupSchema>>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      contributionAmount: 0,
      meetingFrequency: "monthly",
      nextMeetingDate: "",
    },
  })

  // Join group form
  const joinGroupForm = useForm<z.infer<typeof joinGroupSchema>>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      groupId: "",
      inviteCode: "",
    },
  })

  // Fetch groups query
  const {
    data: groups = [] as Group[],
    isLoading: isLoadingGroups,
    error: groupsError,
    refetch: refetchGroups,
    isError,
  } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/groups")

        if (response.status === 401) {
          throw new Error("Authentication required. Please sign in again.")
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch groups")
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error in queryFn:", error)
        throw error
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  })

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createGroupSchema>) => {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create group")
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: "Group created",
        description: "Your new savings group has been created successfully.",
      })
      setIsCreateDialogOpen(false)
      createGroupForm.reset()
    },
    onError: (error) => {
      toast({
        title: "Failed to create group",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    },
  })

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: async (data: z.infer<typeof joinGroupSchema>) => {
      const response = await fetch(`/api/groups/${data.groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode: data.inviteCode }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to join group")
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: "Group joined",
        description: "You have successfully joined the savings group.",
      })
      setIsJoinDialogOpen(false)
      joinGroupForm.reset()
    },
    onError: (error) => {
      toast({
        title: "Failed to join group",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    },
  })

  // Handle create group submission
  const onCreateGroup = (data: z.infer<typeof createGroupSchema>) => {
    createGroupMutation.mutate(data)
  }

  // Handle join group submission
  const onJoinGroup = (data: z.infer<typeof joinGroupSchema>) => {
    joinGroupMutation.mutate(data)
  }

  // Filter and sort groups
  const filteredGroups = useMemo(() => {
    let result = [...groups]

    // Apply search filter
    if (searchQuery) {
      result = result.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((group) => group.status.toLowerCase() === filterStatus.toLowerCase())
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "members":
        result.sort((a, b) => (b.memberships?.length || 0) - (a.memberships?.length || 0))
        break
      case "amount":
        result.sort((a, b) => (b.contributionAmount || 0) - (a.contributionAmount || 0))
        break
      default:
        break
    }

    return result
  }, [groups, searchQuery, sortBy, filterStatus])

  // Show error toast if query fails
  if (isError && groupsError) {
    console.error("Error fetching groups:", groupsError)
    toast({
      title: "Error loading groups",
      description: groupsError instanceof Error ? groupsError.message : "Failed to load groups. Please try again.",
      variant: "destructive",
    })
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP")
    } catch (error) {
      return "Invalid date"
    }
  }

  const handleViewDetails = (group: Group) => {
    router.push(`/dashboard/groups/${group.id}`)
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        refetchGroups()
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Savings Groups</h1>
            <p className="text-muted-foreground">Manage your cooperative savings groups</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <LogIn className="mr-2 h-4 w-4" />
                  Join Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join an existing savings group</DialogTitle>
                  <DialogDescription>
                    Enter the group ID and invite code to join an existing savings group.
                  </DialogDescription>
                </DialogHeader>
                <Form {...joinGroupForm}>
                  <form onSubmit={joinGroupForm.handleSubmit(onJoinGroup)} className="space-y-4">
                    <FormField
                      control={joinGroupForm.control}
                      name="groupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter group ID" {...field} />
                          </FormControl>
                          <FormDescription>The unique identifier for the group you want to join.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={joinGroupForm.control}
                      name="inviteCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invite Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter invite code" {...field} />
                          </FormControl>
                          <FormDescription>The invite code provided by the group administrator.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={joinGroupMutation.isPending} className="w-full">
                        {joinGroupMutation.isPending ? "Joining..." : "Join Group"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create a new savings group</DialogTitle>
                  <DialogDescription>
                    Set up a new cooperative savings group for you and your members.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createGroupForm}>
                  <form onSubmit={createGroupForm.handleSubmit(onCreateGroup)} className="space-y-4">
                    <FormField
                      control={createGroupForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Group Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter group name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createGroupForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your group" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createGroupForm.control}
                        name="contributionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contribution Amount (ZMW)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createGroupForm.control}
                        name="meetingFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={createGroupForm.control}
                      name="nextMeetingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Meeting Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={createGroupMutation.isPending} className="w-full">
                        {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[130px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="members">Members</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingGroups ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[250px] rounded-xl" />
            ))}
          </div>
        ) : groupsError ? (
          <Card>
            <CardContent className="flex h-40 flex-col items-center justify-center p-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-10 w-10 text-red-500/50" />
                <p className="mt-2 text-red-500">Error loading groups</p>
                <Button variant="outline" className="mt-4" onClick={() => refetchGroups()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : filteredGroups.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="h-3 bg-gradient-to-r from-teal-400 to-emerald-600"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{group.name}</CardTitle>
                    <Badge
                      variant={
                        group.status.toLowerCase() === "active"
                          ? "default"
                          : group.status.toLowerCase() === "pending"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        group.status.toLowerCase() === "active"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : group.status.toLowerCase() === "pending"
                            ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      }
                    >
                      {group.status}
                    </Badge>
                  </div>
                  <CardDescription>Created on {formatDate(group.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Members</span>
                      </div>
                      <span className="font-medium">{group.memberships?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Contribution</span>
                      </div>
                      <span className="font-medium">ZMW {group.contributionAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Next Meeting</span>
                      </div>
                      <span className="font-medium">
                        {group.nextMeetingDate ? formatDate(group.nextMeetingDate) : "Not scheduled"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(group)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex h-40 items-center justify-center p-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">
                  {searchQuery ? "No groups match your search" : "No groups found"}
                </p>
                <Button variant="outline" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  Create a Group
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Group Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedGroup && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedGroup.name}</DialogTitle>
                  <Badge
                    variant={
                      selectedGroup.status.toLowerCase() === "active"
                        ? "default"
                        : selectedGroup.status.toLowerCase() === "pending"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      selectedGroup.status.toLowerCase() === "active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : selectedGroup.status.toLowerCase() === "pending"
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {selectedGroup.status}
                  </Badge>
                </div>
                <DialogDescription>{selectedGroup.description || "No description provided"}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ZMW {(selectedGroup.totalSavings || 0).toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Contribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ZMW {selectedGroup.contributionAmount.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Group Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Created</span>
                          <span>{formatDate(selectedGroup.createdAt)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Members</span>
                          <span>{selectedGroup.memberships?.length || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Next Meeting</span>
                          <span>
                            {selectedGroup.nextMeetingDate
                              ? formatDate(selectedGroup.nextMeetingDate)
                              : "Not scheduled"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Group ID</span>
                          <span className="font-mono text-xs">{selectedGroup.id}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="space-y-4 pt-4">
                  {selectedGroup.memberships && selectedGroup.memberships.length > 0 ? (
                    <div className="space-y-2">
                      {selectedGroup.memberships.map((member, index) => (
                        <div
                          key={member.id || index}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.user?.avatar || "/placeholder-user.jpg"} />
                              <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.user?.name || "Unknown User"}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Member
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Users className="h-10 w-10 text-muted-foreground/50" />
                      <p className="mt-2 text-muted-foreground">No members in this group yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="meetings" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedGroup.nextMeetingDate ? (
                        <div className="space-y-2">
                          <div className="text-xl font-bold">{formatDate(selectedGroup.nextMeetingDate)}</div>
                          <p className="text-sm text-muted-foreground">
                            Don't forget to prepare your contribution of ZMW{" "}
                            {selectedGroup.contributionAmount.toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                          <Calendar className="h-8 w-8 text-muted-foreground/50" />
                          <p className="mt-2 text-muted-foreground">No meetings scheduled</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Leave Group</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. You will need to be invited again to rejoin this group.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600">Leave Group</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button>Make Contribution</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  )
}
