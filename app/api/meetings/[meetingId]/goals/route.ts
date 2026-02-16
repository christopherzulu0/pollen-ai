import { NextResponse } from "next/server"
import { getGoalsForMeeting, createMeetingGoal } from "@/lib/actions/goals"

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

    const goals = await getGoalsForMeeting(meetingId)
    if (goals === null) {
      return NextResponse.json(
        { error: "Unauthorized or meeting not found" },
        { status: 403 }
      )
    }

    return NextResponse.json({ goals })
  } catch (e) {
    console.error("GET /api/meetings/[meetingId]/goals error:", e)
    return NextResponse.json(
      { error: "Failed to fetch goals" },
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
    const { name, targetAmount, currentAmount, deadline, description } = body

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      )
    }
    const target = Number(targetAmount)
    if (target <= 0 || Number.isNaN(target)) {
      return NextResponse.json(
        { error: "targetAmount must be a positive number" },
        { status: 400 }
      )
    }

    const result = await createMeetingGoal(meetingId, {
      name: name.trim(),
      targetAmount: target,
      currentAmount: currentAmount != null ? Number(currentAmount) : 0,
      deadline: deadline ?? null,
      description: description ?? null,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      )
    }

    return NextResponse.json({ goal: result.goal })
  } catch (e) {
    console.error("POST /api/meetings/[meetingId]/goals error:", e)
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    )
  }
}
