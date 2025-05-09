"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CheckCircle, XCircle, AlertCircle, ArrowUpCircle, DollarSign, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"


export default function GroupMembers() {
  const router = useRouter()
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [contributionAmount, setContributionAmount] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

    // State for groups fetched from API
  const [groups, setGroups] = useState([
    { id: "all", name: "All Groups" }
  ])
  const [isLoadingGroups, setIsLoadingGroups] = useState(false)
  const [groupsError, setGroupsError] = useState("")

  // State for members fetched from API
  const [members, setMembers] = useState<any[]>([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [membersError, setMembersError] = useState("")

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

        // Add the "All Groups" option and map the API response to the format we need
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
        // Fallback to mock data if API fails
        setGroups([
          { id: "all", name: "All Groups" },
          { id: "group1", name: "Savings Group A" },
          { id: "group2", name: "Investment Club B" },
          { id: "group3", name: "Community Cooperative" },
        ])
      } finally {
        setIsLoadingGroups(false)
      }
    }

    fetchGroups()
  }, [])

  // Fetch members when a group is selected
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoadingMembers(true)
      setMembersError("")

      try {
        const response = await fetch(`/api/groups/members?groupId=${selectedGroup}`)

        if (!response.ok) {
          throw new Error('Failed to fetch group members')
        }

        const data = await response.json()

        // Map the API response to the format we need for the UI
        const formattedMembers = data.map((membership: any) => ({
          id: membership.user.id,
          name: membership.user.name,
          avatar: membership.user.avatar || "/placeholder.svg?height=40&width=40",
          email: membership.user.email,
          phone: membership.user.phone || "",
          joinedDate: new Date(membership.joinedAt),
          totalContributed: parseFloat(membership.totalContributed),
          contributionStatus: membership.lastContribution ? 
            (new Date(membership.lastContribution) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? "ON_TIME" : "LATE") : 
            "VERY_LATE",
          lastContribution: membership.lastContribution ? new Date(membership.lastContribution) : undefined,
          nextContributionDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Placeholder
          contributionAmount: 0, // This would come from the group settings
          activeLoans: 0, // This would need to be calculated
          totalBorrowed: 0, // This would need to be calculated
          totalRepaid: 0, // This would need to be calculated
          contributionHistory: [], // This would need to be fetched separately
          groupId: membership.groupId || membership.group?.id, // Include the group ID
          uniqueKey: `${membership.user.id}-${membership.groupId || membership.group?.id}` // Create a unique key combining user ID and group ID
        }))

        setMembers(formattedMembers)
      } catch (error) {
        console.error('Error fetching group members:', error)
        setMembersError("Failed to load group members. Please try again.")
        setMembers([]) // Set empty array instead of using mock data
      } finally {
        setIsLoadingMembers(false)
      }
    }

    fetchMembers()
  }, [selectedGroup])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMK",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> On Time
          </Badge>
        )
      case "LATE":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Late
          </Badge>
        )
      case "VERY_LATE":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" /> Very Late
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Calendar className="mr-1 h-3 w-3" /> Unknown
          </Badge>
        )
    }
  }

  const handleRecordContribution = async (memberUniqueKey: string) => {
    if (!contributionAmount || isNaN(Number(contributionAmount)) || Number(contributionAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // TODO: Replace this with an actual API call to record the contribution
      // Example: await fetch('/api/groups/contributions', { method: 'POST', body: JSON.stringify({ memberId, amount: contributionAmount }) })
      console.log(`Recording contribution of ${contributionAmount} for member ${memberId}`)

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state to reflect the contribution
      const amount = Number(contributionAmount)
      setMembers((prevMembers) =>
        prevMembers.map((member) => {
          if (member.uniqueKey === memberUniqueKey) {
            const newTotalContributed = member.totalContributed + amount

            return {
              ...member,
              totalContributed: newTotalContributed,
              lastContribution: new Date(),
              contributionStatus: "ON_TIME",
              contributionHistory: [{ date: new Date(), amount, status: "PAID" }, ...member.contributionHistory],
            }
          }
          return member
        }),
      )

      toast({
        title: "Contribution recorded",
        description: `Contribution of ${formatCurrency(Number(contributionAmount))} has been recorded.`,
      })

      setContributionAmount("")
      setSelectedMember(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record contribution. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // We're now fetching members from the API based on the selected group
  // So we don't need to filter them here anymore

  // Show loading state
  if (isLoadingMembers) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground text-center">Loading group members...</p>
        </CardContent>
      </Card>
    )
  }

  // Show error state
  if (membersError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive text-center">{membersError}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              // Retry fetching members
              setSelectedGroup(selectedGroup)
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show empty state
  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">There are no members in this group.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Group Members</h2>
        <div className="flex items-center gap-3">
          {isLoadingGroups ? (
            <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading groups...</span>
            </div>
          ) : groupsError ? (
            <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{groupsError}</span>
            </div>
          ) : (
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[200px]">
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
          {selectedGroup !== "all" && !isLoadingGroups && !groupsError && (
            <Button 
              onClick={() => router.push(`/dashboard/groups/saving-groups?tab=new-request&groupId=${selectedGroup}`)}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Request Loan
            </Button>
          )}
        </div>
      </div>

      {members.map((member) => (
        <Card key={member.uniqueKey} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </div>
              </div>
              {getStatusBadge(member.contributionStatus)}
            </div>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Total Contributed: {formatCurrency(member.totalContributed)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Next Due: {formatDate(member.nextContributionDue)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Active Loans:</span>
                <p className="font-medium">{member.activeLoans}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Contribution:</span>
                <p className="font-medium">{formatCurrency(member.contributionAmount)}</p>
              </div>
            </div>

            {member.activeLoans > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Loan Repayment</span>
                  <span>
                    {formatCurrency(member.totalRepaid)} of {formatCurrency(member.totalBorrowed)} repaid
                  </span>
                </div>
                <Progress value={Math.round((member.totalRepaid / member.totalBorrowed) * 100)} className="h-2" />
              </div>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="pt-4 flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setSelectedMember(member)}>
                  View Details
                </Button>
              </DialogTrigger>
              {selectedMember && (
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Member Details</DialogTitle>
                    <DialogDescription>
                      {selectedMember.name} joined on {formatDate(selectedMember.joinedDate)}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Total Contributed</h4>
                        <p className="text-lg font-semibold">{formatCurrency(selectedMember.totalContributed)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Contact</h4>
                        <p className="text-sm">{selectedMember.email}</p>
                        <p className="text-sm">{selectedMember.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Contribution Status</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(selectedMember.contributionStatus)}
                        <span className="text-sm">
                          Last contribution: {formatDate(selectedMember.lastContribution)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Loan Status</h4>
                      <p className="text-sm mt-1">
                        {selectedMember.activeLoans > 0
                          ? `Has ${selectedMember.activeLoans} active loan(s) with ${formatCurrency(selectedMember.totalBorrowed - selectedMember.totalRepaid)} outstanding`
                          : "No active loans"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Contribution History</h4>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {selectedMember.contributionHistory.map((contribution: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm border-b pb-2">
                            <span>{formatDate(contribution.date)}</span>
                            <span>{formatCurrency(contribution.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Record Contribution</h4>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={contributionAmount}
                          onChange={(e) => setContributionAmount(e.target.value)}
                        />
                        <Button onClick={() => handleRecordContribution(selectedMember.uniqueKey)} disabled={isProcessing}>
                          {isProcessing ? "Processing..." : "Record"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSelectedMember(null)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>

            <Button variant="default">Send Reminder</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
