"use client"

import { SelectItem } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Calendar, Copy, CreditCard, Download, FileText, Share2, Users, Wallet } from "lucide-react"

// Schema for making a contribution
const contributionSchema = z.object({
  amount: z.coerce.number().min(1, { message: "Amount must be at least 1" }),
  paymentMethod: z.enum(["mobile_money", "bank_transfer", "cash"]),
  reference: z.string().optional(),
})

interface GroupDetailsProps {
  groupId: string
}

export default function GroupDetails({ groupId }: GroupDetailsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState("")

  // Contribution form
  const contributionForm = useForm<z.infer<typeof contributionSchema>>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: "mobile_money",
      reference: "",
    },
  })

  // Fetch group details
  const {
    data: group,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`)

        if (response.status === 401) {
          throw new Error("Authentication required. Please sign in again.")
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch group details")
        }

        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error fetching group details:", error)
        throw error
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  })

  // Make contribution mutation
  const contributionMutation = useMutation({
    mutationFn: async (data: z.infer<typeof contributionSchema>) => {
      const response = await fetch(`/api/groups/${groupId}/contributions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to make contribution")
      }

      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] })
      toast({
        title: "Contribution successful",
        description: "Your contribution has been recorded successfully.",
      })
      setIsContributeDialogOpen(false)
      contributionForm.reset()
    },
    onError: (error) => {
      toast({
        title: "Failed to make contribution",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    },
  })

  // Generate invite code mutation
  const generateInviteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/invite`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to generate invite code")
      }

      return await response.json()
    },
    onSuccess: (data) => {
      setInviteCode(data.inviteCode)
      setIsInviteDialogOpen(true)
    },
    onError: (error) => {
      toast({
        title: "Failed to generate invite code",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    },
  })

  // Handle contribution submission
  const onContribute = (data: z.infer<typeof contributionSchema>) => {
    contributionMutation.mutate(data)
  }

  // Copy invite code to clipboard
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode)
    toast({
      title: "Copied to clipboard",
      description: "Invite code has been copied to clipboard.",
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] rounded-xl" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-[150px] rounded-xl" />
            <Skeleton className="h-[150px] rounded-xl" />
            <Skeleton className="h-[150px] rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <FileText className="h-16 w-16 text-red-500/50" />
        <h2 className="text-xl font-bold">Error loading group details</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load group details"}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <FileText className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="text-xl font-bold">Group not found</h2>
        <p className="text-muted-foreground">
          The group you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{group.name}</h1>
            <p className="text-muted-foreground">{group.description || "No description provided"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => generateInviteMutation.mutate()}>
            <Share2 className="mr-2 h-4 w-4" />
            Invite Members
          </Button>
          <Button onClick={() => setIsContributeDialogOpen(true)}>
            <Wallet className="mr-2 h-4 w-4" />
            Make Contribution
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">ZMW {(group.totalSavings || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {group.contributions?.length || 0} contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{group.memberships?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active participants in this group</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {group.nextMeetingDate ? formatDate(group.nextMeetingDate) : "Not scheduled"}
            </div>
            <p className="text-xs text-muted-foreground">
              {group.nextMeetingDate ? "Prepare your contribution" : "No upcoming meetings"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="contributions">Contributions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Information</CardTitle>
              <CardDescription>Details about this savings group and its activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Basic Details</h3>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created On</span>
                      <span>{formatDate(group.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contribution Amount</span>
                      <span>ZMW {group.contributionAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Meeting Frequency</span>
                      <span>{group.meetingFrequency || "Monthly"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Statistics</h3>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Members</span>
                      <span>{group.memberships?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Contributions</span>
                      <span>{group.contributions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Contribution</span>
                      <span>
                        ZMW{" "}
                        {group.contributions?.length
                          ? (group.totalSavings / group.contributions.length).toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Group ID</span>
                      <span className="font-mono text-xs">{group.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Upcoming Events</h3>
                {group.nextMeetingDate ? (
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Next Meeting</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(group.nextMeetingDate)} - Don't forget your contribution of ZMW{" "}
                          {group.contributionAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center rounded-lg border p-6">
                    <p className="text-sm text-muted-foreground">No upcoming events scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push(`/groups/${groupId}/settings`)}>
                Group Settings
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                    Leave Group
                  </Button>
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
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>People participating in this savings group</CardDescription>
            </CardHeader>
            <CardContent>
              {group.memberships && group.memberships.length > 0 ? (
                <div className="space-y-3">
                  {group.memberships.map((member, index) => (
                    <div key={member.id || index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.user?.avatar || "/placeholder-user.jpg"} />
                          <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.user?.name || "Unknown User"}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {member.joinedAt ? formatDate(member.joinedAt) : "recently"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={member.role === "admin" ? "bg-blue-50 text-blue-700" : ""}>
                        {member.role === "admin" ? "Admin" : "Member"}
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
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => generateInviteMutation.mutate()}
                disabled={generateInviteMutation.isPending}
              >
                {generateInviteMutation.isPending ? "Generating..." : "Invite New Members"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
              <CardDescription>Record of all contributions made to this group</CardDescription>
            </CardHeader>
            <CardContent>
              {group.contributions && group.contributions.length > 0 ? (
                <div className="space-y-3">
                  {group.contributions.map((contribution, index) => (
                    <div
                      key={contribution.id || index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <Wallet className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">ZMW {contribution.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {contribution.date ? formatDate(contribution.date) : "Unknown date"} •
                            {contribution.user?.name || "Unknown user"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{contribution.paymentMethod || "Cash"}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Wallet className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No contributions recorded yet</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setIsContributeDialogOpen(true)}>
                Make a Contribution
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Documents</CardTitle>
              <CardDescription>Important files and documents related to this group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">No documents available</p>
                <Button variant="outline" className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Download Group Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contribution Dialog */}
      <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Contribution</DialogTitle>
            <DialogDescription>
              Contribute to your savings group. The minimum contribution amount is ZMW {group.contributionAmount}.
            </DialogDescription>
          </DialogHeader>
          <Form {...contributionForm}>
            <form onSubmit={contributionForm.handleSubmit(onContribute)} className="space-y-4">
              <FormField
                control={contributionForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (ZMW)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={group.contributionAmount}
                        step="any"
                        placeholder={group.contributionAmount.toString()}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The amount you want to contribute (minimum: ZMW {group.contributionAmount})
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contributionForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contributionForm.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction reference or notes" {...field} />
                    </FormControl>
                    <FormDescription>Add a reference number or note for this contribution</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={contributionMutation.isPending} className="w-full">
                  {contributionMutation.isPending ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Complete Contribution
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Share this invite code with people you want to join your savings group.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input value={inviteCode} readOnly className="font-mono" />
            <Button variant="outline" size="icon" onClick={copyInviteCode}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This invite code will expire in 7 days. Members will also need the group ID:{" "}
            <span className="font-mono">{group.id}</span>
          </p>
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setIsInviteDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
