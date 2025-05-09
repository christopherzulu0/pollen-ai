"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  QrCode,
  LinkIcon,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Info,
  AlertCircle,
  Filter,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample data for discovered groups
const discoveredGroups = [
  {
    id: 1,
    name: "Community Savings Circle",
    description: "A community-based savings group for local residents",
    members: 15,
    contributionAmount: 100,
    frequency: "Monthly",
    nextMeeting: "May 15, 2023",
    privacy: "public",
    tags: ["community", "savings", "local"],
  },
  {
    id: 2,
    name: "Women Entrepreneurs Fund",
    description: "Supporting women entrepreneurs through cooperative savings",
    members: 8,
    contributionAmount: 200,
    frequency: "Bi-Weekly",
    nextMeeting: "May 10, 2023",
    privacy: "public",
    tags: ["women", "entrepreneurs", "business"],
  },
  {
    id: 3,
    name: "College Fund Cooperative",
    description: "Saving together for children's education",
    members: 12,
    contributionAmount: 150,
    frequency: "Monthly",
    nextMeeting: "May 20, 2023",
    privacy: "public",
    tags: ["education", "college", "savings"],
  },
]

export default function JoinGroup() {
  const [joinMethod, setJoinMethod] = useState<"code" | "qr" | "discover">("code")
  const [groupCode, setGroupCode] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const { toast } = useToast()

  const filteredGroups = discoveredGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleJoinWithCode = async () => {
    if (!groupCode) {
      toast({
        title: "Error",
        description: "Please enter a group code",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)
    try {
      const response = await fetch("/api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join group")
      }

      toast({
        title: "Success!",
        description: "You've successfully joined the group",
      })
      setGroupCode("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join group",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroup(groupId)
    setShowPreview(true)
  }

  const handleJoinSelectedGroup = () => {
    setIsJoining(true)
    // Simulate API call
    setTimeout(() => {
      setIsJoining(false)
      toast({
        title: "Success!",
        description: "Your request to join has been sent",
      })
      setShowPreview(false)
      setSelectedGroup(null)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="code" onValueChange={(value) => setJoinMethod(value as "code" | "qr" | "discover")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>Join with Code</span>
          </TabsTrigger>
          {/*<TabsTrigger value="qr" className="flex items-center gap-2">*/}
          {/*  <QrCode className="h-4 w-4" />*/}
          {/*  <span>Scan QR Code</span>*/}
          {/*</TabsTrigger>*/}
          {/*<TabsTrigger value="discover" className="flex items-center gap-2">*/}
          {/*  <Search className="h-4 w-4" />*/}
          {/*  <span>Discover Groups</span>*/}
          {/*</TabsTrigger>*/}
        </TabsList>

        <TabsContent value="code" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Join with Group Code</CardTitle>
              <CardDescription>Enter the code provided by the group administrator</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Group Code</label>
                <div className="flex gap-2">
                  <Input
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    placeholder="Enter group code (e.g., ABC-123-XYZ)"
                    className="font-mono"
                  />
                  <Button
                    onClick={handleJoinWithCode}
                    disabled={isJoining}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                  >
                    {isJoining ? (
                      <span className="flex items-center gap-1">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Joining...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">Join Group</span>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  The group code is case-sensitive and should be entered exactly as provided
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-teal-600" />
                  What happens when you join?
                </h3>
                <ul className="space-y-2 pl-6 text-xs text-slate-600">
                  <li>Your request will be sent to the group administrator</li>
                  <li>Once approved, you'll have access to the group</li>
                  <li>You'll need to agree to the group rules and payment terms</li>
                  <li>You can leave the group at any time, subject to the group's withdrawal policy</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 p-4">
              <div className="flex w-full items-center justify-between">
                <p className="text-xs text-slate-500">Don't have a code? Try discovering public groups.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setJoinMethod("discover")}
                  className="text-teal-600 hover:text-teal-700"
                >
                  Discover Groups
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Use your device's camera to scan a group QR code</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
              <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <QrCode className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="mb-2 text-sm font-medium">Camera Access Required</p>
                  <p className="text-xs text-slate-500">Click the button below to activate your camera</p>
                  <Button className="mt-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700">
                    Activate Camera
                  </Button>
                </div>
              </div>
              <p className="text-center text-sm text-slate-500">Position the QR code within the frame to scan</p>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 p-4">
              <div className="flex w-full items-center justify-between">
                <p className="text-xs text-slate-500">Don't have a QR code? Try entering a group code.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setJoinMethod("code")}
                  className="text-teal-600 hover:text-teal-700"
                >
                  Use Group Code
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="discover" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Discover Groups</CardTitle>
                  <CardDescription>Find and join public cooperative groups</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Filter Groups</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredGroups.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4">
                  <AlertCircle className="mb-2 h-8 w-8 text-slate-400" />
                  <p className="text-center text-sm font-medium">No groups found</p>
                  <p className="text-center text-xs text-slate-500">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-teal-500 hover:shadow-md ${selectedGroup === group.id ? "border-teal-500 ring-1 ring-teal-500" : ""}`}
                      onClick={() => handleSelectGroup(group.id)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{group.name}</h3>
                        <Badge variant="outline" className="bg-teal-50 text-teal-700">
                          {group.privacy}
                        </Badge>
                      </div>
                      <p className="mb-3 text-sm text-slate-600">{group.description}</p>
                      <div className="mb-3 flex flex-wrap gap-1">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Users className="h-3 w-3" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            ${group.contributionAmount}/{group.frequency.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {group.nextMeeting}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-slate-50 p-4">
              <div className="flex w-full items-center justify-between">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="members">Most Members</SelectItem>
                    <SelectItem value="contribution">Lowest Contribution</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setShowPreview(true)}
                  disabled={selectedGroup === null || showPreview}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                >
                  View Selected Group
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Group Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-lg">
          {selectedGroup !== null && (
            <>
              <DialogHeader>
                <DialogTitle>{discoveredGroups.find((g) => g.id === selectedGroup)?.name}</DialogTitle>
                <DialogDescription>Review group details before requesting to join</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 rounded-md">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback className="rounded-md text-lg">
                      {discoveredGroups
                        .find((g) => g.id === selectedGroup)
                        ?.name.substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600">
                      {discoveredGroups.find((g) => g.id === selectedGroup)?.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {discoveredGroups
                        .find((g) => g.id === selectedGroup)
                        ?.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-medium">Group Details</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="font-medium text-slate-500">Members:</span>
                      <span>{discoveredGroups.find((g) => g.id === selectedGroup)?.members}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="font-medium text-slate-500">Contribution:</span>
                      <span>
                        ${discoveredGroups.find((g) => g.id === selectedGroup)?.contributionAmount} per{" "}
                        {discoveredGroups.find((g) => g.id === selectedGroup)?.frequency.toLowerCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="font-medium text-slate-500">Next Meeting:</span>
                      <span>{discoveredGroups.find((g) => g.id === selectedGroup)?.nextMeeting}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="font-medium text-slate-500">Privacy:</span>
                      <span className="capitalize">
                        {discoveredGroups.find((g) => g.id === selectedGroup)?.privacy}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h3 className="mb-2 flex items-center gap-2 font-medium text-amber-800">
                    <AlertCircle className="h-4 w-4" />
                    Before You Join
                  </h3>
                  <ul className="space-y-1 pl-6 text-sm text-amber-700">
                    <li>You'll need to make regular contributions</li>
                    <li>Your request may require admin approval</li>
                    <li>You'll need to agree to the group's rules</li>
                    <li>Early withdrawal may incur penalties</li>
                  </ul>
                </div>
              </div>
              <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Open in new tab logic would go here
                      toast({
                        title: "Group rules opened",
                        description: "Review the rules in the new tab",
                      })
                    }}
                  >
                    View Rules
                  </Button>
                  <Button
                    onClick={handleJoinSelectedGroup}
                    disabled={isJoining}
                    className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                  >
                    {isJoining ? (
                      <span className="flex items-center gap-1">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Requesting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Request to Join
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
