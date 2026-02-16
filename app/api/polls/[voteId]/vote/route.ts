import { NextResponse } from "next/server"
import { submitVote } from "@/lib/actions/polls"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ voteId: string }> }
) {
  try {
    const { voteId } = await params
    if (!voteId) {
      return NextResponse.json(
        { error: "Vote ID is required" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { selectedOption } = body
    if (!selectedOption || typeof selectedOption !== "string") {
      return NextResponse.json(
        { error: "selectedOption (string) is required" },
        { status: 400 }
      )
    }

    const result = await submitVote(voteId, selectedOption)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("POST /api/polls/[voteId]/vote error:", e)
    return NextResponse.json(
      { error: "Failed to submit vote" },
      { status: 500 }
    )
  }
}
