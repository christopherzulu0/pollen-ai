import { NextResponse } from "next/server"
import { contributeToGoal } from "@/lib/actions/goals"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const { goalId } = await params
    if (!goalId) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const amount = Number(body?.amount)
    if (amount <= 0 || Number.isNaN(amount)) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      )
    }

    const result = await contributeToGoal(goalId, amount)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Unauthorized" ? 401 : 400 }
      )
    }

    return NextResponse.json({ success: true, goal: result.goal })
  } catch (e) {
    console.error("POST /api/goals/[goalId]/contribute error:", e)
    return NextResponse.json(
      { error: "Failed to contribute" },
      { status: 500 }
    )
  }
}
