import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch all meetings for admin with statistics
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const type = searchParams.get("type") // "virtual" or "in-person"

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { group: { name: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (type === "virtual") {
      where.isVirtual = true
    } else if (type === "in-person") {
      where.isVirtual = false
    }

    // Fetch all meetings with related data
    const meetings = await prisma.meeting.findMany({
      where,
      include: {
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        attendees: {
          include: {
            membership: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    const now = new Date()

    // Transform meetings to match component's expected format
    const transformedMeetings = meetings.map((meeting) => {
      const meetingDate = new Date(meeting.date)
      const isUpcoming = meetingDate > now
      const isPast = meetingDate < now
      
      // Determine status based on date
      // Note: In production, you might want to add a status field to the Meeting model
      let meetingStatus: string
      if (isPast) {
        meetingStatus = "completed"
      } else {
        meetingStatus = "upcoming"
      }

      const confirmedAttendees = meeting.attendees.filter(
        (a) => a.status === "CONFIRMED" || a.status === "PRESENT"
      )
      const pendingAttendees = meeting.attendees.filter((a) => a.status === "PENDING")
      const declinedAttendees = meeting.attendees.filter((a) => a.status === "DECLINED" || a.status === "ABSENT")

      // Format date and time
      const dateStr = meetingDate.toISOString().split("T")[0]
      const timeStr = meetingDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })

      // Calculate duration (default to 1 hour if not specified)
      const duration = "1 hour" // Could be calculated or stored in DB

      // Calculate attendance rate
      const totalAttendees = meeting.attendees.length
      const confirmedCount = confirmedAttendees.length
      const attendanceRate = totalAttendees > 0 ? (confirmedCount / totalAttendees) * 100 : 0

      return {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description || "",
        date: dateStr,
        time: timeStr,
        duration,
        location: meeting.location || (meeting.isVirtual ? "Virtual Meeting" : "Location TBD"),
        isVirtual: meeting.isVirtual,
        meetingLink: meeting.meetingLink || null,
        status: meetingStatus,
        group: {
          id: meeting.group.id,
          name: meeting.group.name,
          members: 0, // Would need to count group members
        },
        attendees: meeting.attendees.map((attendee) => ({
          id: attendee.membership.user.id,
          name: attendee.membership.user.name || "Unknown User",
          email: attendee.membership.user.email,
          status:
            attendee.status === "PRESENT"
              ? "attended"
              : attendee.status === "CONFIRMED"
                ? "confirmed"
                : attendee.status === "DECLINED"
                  ? "declined"
                  : attendee.status === "ABSENT"
                    ? "absent"
                    : "pending",
          avatar: attendee.membership.user.avatar || null,
        })),
        agenda: [], // Would need to add agenda field to Meeting model
        createdBy: {
          name: "System",
          email: "system@example.com",
        },
        createdAt: meeting.createdAt.toISOString().split("T")[0],
        minutes: null, // Would need to add minutes field to Meeting model
      }
    })

    // Filter by status after transformation
    let filteredMeetings = transformedMeetings
    const statusFilter = searchParams.get("status")
    if (statusFilter && statusFilter !== "all") {
      filteredMeetings = transformedMeetings.filter((m) => m.status === statusFilter)
    }

    // Calculate statistics
    const stats = {
      totalMeetings: transformedMeetings.length,
      upcomingMeetings: transformedMeetings.filter((m) => m.status === "upcoming").length,
      completedMeetings: transformedMeetings.filter((m) => m.status === "completed").length,
      cancelledMeetings: transformedMeetings.filter((m) => m.status === "cancelled").length,
      virtualMeetings: transformedMeetings.filter((m) => m.isVirtual).length,
      averageAttendance: transformedMeetings.length > 0
        ? Math.round(
            transformedMeetings.reduce((sum, m) => {
              const total = m.attendees.length
              const confirmed = m.attendees.filter(
                (a) => a.status === "confirmed" || a.status === "attended"
              ).length
              return sum + (total > 0 ? (confirmed / total) * 100 : 0)
            }, 0) / transformedMeetings.length
          )
        : 0,
    }

    return NextResponse.json({
      meetings: filteredMeetings,
      stats,
    })
  } catch (error) {
    console.error("[ADMIN_MEETINGS_GET_ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    )
  }
}

