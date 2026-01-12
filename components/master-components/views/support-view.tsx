"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
  Send,
  FileText,
  Tag,
  Download,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockContacts = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+260 977 123 456",
    subject: "Issue with payment processing",
    message:
      "I've been trying to make a payment for the past 3 days but keep getting an error message. The error says 'Transaction failed'. I've tried different payment methods but nothing works.",
    department: "technical",
    status: "new",
    priority: "high",
    preferredContact: "email",
    timeframe: "urgent",
    date: "2024-03-15",
    assignedTo: "John Tech",
    tags: ["payment", "bug", "urgent"],
    responseTime: null,
    lastUpdate: "2024-03-15",
  },
  {
    id: "2",
    name: "Mike Wilson",
    email: "mike@example.com",
    phone: "+260 966 234 567",
    subject: "Account verification help needed",
    message:
      "I submitted my documents for verification 2 weeks ago but haven't received any update. Can you please check the status?",
    department: "customer-support",
    status: "in-progress",
    priority: "medium",
    preferredContact: "phone",
    timeframe: "standard",
    date: "2024-03-14",
    assignedTo: "Mary Support",
    tags: ["verification", "kyc"],
    responseTime: "2 hours",
    lastUpdate: "2024-03-15",
  },
  {
    id: "3",
    name: "Alice Cooper",
    email: "alice@example.com",
    phone: "+260 955 345 678",
    subject: "Group savings question",
    message: "How do I invite more members to my savings group? I can't find the option in the app.",
    department: "customer-support",
    status: "resolved",
    priority: "low",
    preferredContact: "email",
    timeframe: "anytime",
    date: "2024-03-13",
    assignedTo: "Mary Support",
    tags: ["groups", "help"],
    responseTime: "30 minutes",
    lastUpdate: "2024-03-13",
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    phone: "+260 977 456 789",
    subject: "Billing discrepancy",
    message: "I was charged twice for my last contribution. Can you please refund the duplicate charge?",
    department: "billing",
    status: "new",
    priority: "high",
    preferredContact: "either",
    timeframe: "urgent",
    date: "2024-03-16",
    assignedTo: null,
    tags: ["billing", "refund", "urgent"],
    responseTime: null,
    lastUpdate: "2024-03-16",
  },
]

const mockMeetingRequests = [
  {
    id: "1",
    name: "Emily Brown",
    email: "emily@example.com",
    phone: "+260 977 567 890",
    meetingDate: "2024-03-20",
    meetingTime: "10:00 AM",
    purpose: "Discuss loan application process and requirements for solar equipment loan",
    status: "pending",
    notes: "Interested in solar loan for home installation",
    createdAt: "2024-03-14",
  },
  {
    id: "2",
    name: "Robert Green",
    email: "robert@example.com",
    phone: "+260 966 678 901",
    meetingDate: "2024-03-22",
    meetingTime: "2:00 PM",
    purpose: "Group savings setup consultation for my community group",
    status: "confirmed",
    notes: "Has 20 members ready to join",
    createdAt: "2024-03-13",
  },
  {
    id: "3",
    name: "Lisa White",
    email: "lisa@example.com",
    phone: "+260 955 789 012",
    meetingDate: "2024-03-18",
    meetingTime: "11:30 AM",
    purpose: "Technical support for integrating payment gateway",
    status: "cancelled",
    notes: "Client requested to reschedule",
    createdAt: "2024-03-12",
  },
]

const statusColors = {
  new: "bg-info text-info-foreground",
  "in-progress": "bg-warning text-warning-foreground",
  resolved: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  confirmed: "bg-success text-success-foreground",
  cancelled: "bg-destructive/20 text-destructive",
  completed: "bg-success text-success-foreground",
}

const priorityColors = {
  low: "bg-slate-500/20 text-slate-300",
  medium: "bg-warning/20 text-warning-foreground",
  high: "bg-destructive/20 text-destructive",
}

export function SupportView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState<(typeof mockContacts)[0] | null>(null)
  const [selectedMeeting, setSelectedMeeting] = useState<(typeof mockMeetingRequests)[0] | null>(null)
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("all")

  const stats = {
    totalTickets: mockContacts.length,
    openTickets: mockContacts.filter((c) => c.status === "new" || c.status === "in-progress").length,
    urgentTickets: mockContacts.filter((c) => c.priority === "high").length,
    avgResponseTime: "1.2 hours",
    resolvedToday: mockContacts.filter((c) => c.status === "resolved").length,
    totalMeetings: mockMeetingRequests.length,
    pendingMeetings: mockMeetingRequests.filter((m) => m.status === "pending").length,
    confirmedMeetings: mockMeetingRequests.filter((m) => m.status === "confirmed").length,
  }

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || contact.department === departmentFilter
    const matchesPriority = priorityFilter === "all" || contact.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority
  })

  const filteredMeetings = mockMeetingRequests.filter((meeting) => {
    const matchesSearch =
      meeting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = meetingStatusFilter === "all" || meeting.status === meetingStatusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">All support requests</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.openTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.urgentTickets} require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground mt-1">15% faster than last week</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Resolved Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.resolvedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {stats.openTickets} total</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">All meeting requests</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pendingMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.confirmedMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled this week</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">94%</div>
            <p className="text-xs text-muted-foreground mt-1">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle>Contact Messages</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36 bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-background">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="customer-support">Support</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-32 bg-background">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className="bg-background border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedContact(contact)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{contact.name}</h4>
                            <Badge className={priorityColors[contact.priority as keyof typeof priorityColors]}>
                              {contact.priority}
                            </Badge>
                            <Badge className={statusColors[contact.status as keyof typeof statusColors]}>
                              {contact.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="font-medium text-sm">{contact.subject}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-2 text-sm">
                      <div className="space-y-1 text-left lg:text-right">
                        <div className="text-muted-foreground">
                          <div className="flex items-center gap-1 justify-start lg:justify-end">
                            <Clock className="h-3 w-3" />
                            {contact.date}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {contact.department}
                        </Badge>
                        {contact.assignedTo && (
                          <div className="text-xs text-muted-foreground">Assigned: {contact.assignedTo}</div>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Meeting Requests</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meetings..."
                  className="pl-8 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={meetingStatusFilter} onValueChange={setMeetingStatusFilter}>
                <SelectTrigger className="w-full sm:w-36 bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMeetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="bg-background border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedMeeting(meeting)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{meeting.name}</h4>
                        <Badge className={statusColors[meeting.status as keyof typeof statusColors]}>
                          {meeting.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {meeting.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {meeting.phone}
                        </div>
                      </div>
                      <p className="text-sm font-medium">{meeting.purpose}</p>
                      {meeting.notes && <p className="text-sm text-muted-foreground">{meeting.notes}</p>}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{meeting.meetingDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{meeting.meetingTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row lg:flex-col gap-2">
                      {meeting.status === "pending" && (
                        <>
                          <Button size="sm" variant="default" className="flex-1 lg:flex-none">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 lg:flex-none bg-transparent">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 lg:flex-none bg-transparent">
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {meeting.status === "confirmed" && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
                      {meeting.status === "cancelled" && (
                        <Button size="sm" variant="outline" disabled>
                          Cancelled
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredMeetings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No meeting requests found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>View and manage support ticket</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Contact Name</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedContact.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedContact.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedContact.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge className={statusColors[selectedContact.status as keyof typeof statusColors]}>
                      {selectedContact.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Priority</Label>
                    <Badge className={priorityColors[selectedContact.priority as keyof typeof priorityColors]}>
                      {selectedContact.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Department</Label>
                    <Badge variant="secondary">{selectedContact.department}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Preferred Contact</Label>
                    <span className="font-medium capitalize">{selectedContact.preferredContact}</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Timeframe</Label>
                    <span className="font-medium capitalize">{selectedContact.timeframe}</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Submitted On</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedContact.date}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Assigned To</Label>
                    <span className="font-medium">{selectedContact.assignedTo || "Unassigned"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Subject</Label>
                  <p className="font-medium">{selectedContact.subject}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Message</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed">{selectedContact.message}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Select defaultValue={selectedContact.status}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue={selectedContact.assignedTo || "unassigned"}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="john">John Tech</SelectItem>
                      <SelectItem value="mary">Mary Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="ml-auto">Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="response" className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Subject</Label>
                  <Input
                    placeholder="Re: Issue with payment processing"
                    defaultValue={`Re: ${selectedContact.subject}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Response Message</Label>
                  <Textarea placeholder="Type your response here..." rows={12} className="resize-none" />
                </div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resolved">Issue Resolved</SelectItem>
                      <SelectItem value="progress">Working On It</SelectItem>
                      <SelectItem value="info">Need More Info</SelectItem>
                      <SelectItem value="escalate">Escalated to Tech Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <Button className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">Ticket Created</p>
                        <p className="text-sm text-muted-foreground">{selectedContact.date} at 10:30 AM</p>
                      </div>
                      <Badge variant="secondary">System</Badge>
                    </div>
                    <p className="text-sm">New support ticket created by {selectedContact.name}</p>
                  </div>

                  {selectedContact.status === "in-progress" && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">Status Changed</p>
                          <p className="text-sm text-muted-foreground">{selectedContact.lastUpdate} at 2:15 PM</p>
                        </div>
                        <Badge variant="secondary">Mary Support</Badge>
                      </div>
                      <p className="text-sm">Changed status from "New" to "In Progress"</p>
                    </div>
                  )}

                  {selectedContact.assignedTo && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">Ticket Assigned</p>
                          <p className="text-sm text-muted-foreground">{selectedContact.lastUpdate} at 2:16 PM</p>
                        </div>
                        <Badge variant="secondary">Admin</Badge>
                      </div>
                      <p className="text-sm">Assigned to {selectedContact.assignedTo}</p>
                    </div>
                  )}

                  {selectedContact.status === "resolved" && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">Ticket Resolved</p>
                          <p className="text-sm text-muted-foreground">{selectedContact.lastUpdate} at 4:30 PM</p>
                        </div>
                        <Badge variant="secondary">{selectedContact.assignedTo}</Badge>
                      </div>
                      <p className="text-sm">Issue resolved. Response time: {selectedContact.responseTime}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Meeting Request Details</DialogTitle>
            <DialogDescription>View and manage meeting request</DialogDescription>
          </DialogHeader>
          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedMeeting.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedMeeting.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedMeeting.phone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge className={statusColors[selectedMeeting.status as keyof typeof statusColors]}>
                    {selectedMeeting.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Meeting Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedMeeting.meetingDate}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Meeting Time</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedMeeting.meetingTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Purpose</Label>
                <p className="font-medium">{selectedMeeting.purpose}</p>
              </div>

              {selectedMeeting.notes && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Notes</Label>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedMeeting.notes}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-muted-foreground">Request Submitted</Label>
                <span className="text-sm font-medium">{selectedMeeting.createdAt}</span>
              </div>

              {selectedMeeting.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <Label>Admin Actions</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Button variant="default" className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Meeting Link (Optional)</Label>
                    <Input placeholder="https://meet.google.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Admin Notes</Label>
                    <Textarea placeholder="Add internal notes about this meeting..." rows={4} />
                  </div>
                </div>
              )}

              {selectedMeeting.status === "confirmed" && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 text-success mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Meeting Confirmed</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confirmation email sent to {selectedMeeting.email}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Button variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download ICS
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
