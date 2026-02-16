import { NextResponse } from "next/server"
import { getMeetingMinutes, saveMeetingMinutes } from "@/lib/actions/minutes"

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

    const minutes = await getMeetingMinutes(meetingId)
    if (minutes === null) {
      return NextResponse.json(
        { error: "Unauthorized or meeting not found" },
        { status: 403 }
      )
    }

    return NextResponse.json(minutes)
  } catch (e) {
    console.error("GET /api/meetings/[meetingId]/minutes error:", e)
    return NextResponse.json(
      { error: "Failed to fetch minutes" },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const { minutesText, minutesFileUrl, minutesKeyDecisions, minutesActionItems, minutesActionItemsCompleted } = body

    const result = await saveMeetingMinutes(meetingId, {
      ...(minutesText !== undefined && { minutesText: minutesText ?? null }),
      ...(minutesFileUrl !== undefined && { minutesFileUrl: minutesFileUrl ?? null }),
      ...(minutesKeyDecisions !== undefined && { minutesKeyDecisions: Array.isArray(minutesKeyDecisions) ? minutesKeyDecisions : [] }),
      ...(minutesActionItems !== undefined && { minutesActionItems: Array.isArray(minutesActionItems) ? minutesActionItems : [] }),
      ...(minutesActionItemsCompleted !== undefined && { minutesActionItemsCompleted: Array.isArray(minutesActionItemsCompleted) ? minutesActionItemsCompleted : [] }),
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 403 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("PUT /api/meetings/[meetingId]/minutes error:", e)
    return NextResponse.json(
      { error: "Failed to save minutes" },
      { status: 500 }
    )
  }
}
