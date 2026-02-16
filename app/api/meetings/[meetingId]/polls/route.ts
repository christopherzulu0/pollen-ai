import { NextResponse } from "next/server"
import { getPollsForMeeting, createPoll } from "@/lib/actions/polls"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params
    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      )
    }

    const polls = await getPollsForMeeting(meetingId)
    if (polls === null) {
      return NextResponse.json({ error: "Unauthorized or meeting not found" }, { status: 403 })
    }

    return NextResponse.json({ polls })
  } catch (e) {
    console.error("GET /api/meetings/[meetingId]/polls error:", e)
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  try {
    const { meetingId } = await params
    if (!meetingId) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { title, description, options, endDate: endDateStr } = body
    if (!title || typeof title !== "string" || !Array.isArray(options) || !endDateStr) {
      return NextResponse.json(
        { error: "title, options (array), and endDate are required" },
        { status: 400 }
      )
    }

    const endDate = new Date(endDateStr)
    if (Number.isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid endDate" }, { status: 400 })
    }

    const result = await createPoll({
      meetingId,
      title,
      description,
      options,
      endDate,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      )
    }

    return NextResponse.json({ poll: result.poll })
  } catch (e) {
    console.error("POST /api/meetings/[meetingId]/polls error:", e)
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    )
  }
}
