import { NextResponse } from "next/server"
import { getMemberOverview } from "@/lib/actions/member-overview"

export async function GET() {
  try {
    const overview = await getMemberOverview()
    if (overview === null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(overview)
  } catch (e) {
    console.error("GET /api/member/overview error:", e)
    return NextResponse.json(
      { error: "Failed to fetch member overview" },
      { status: 500 }
    )
  }
}
