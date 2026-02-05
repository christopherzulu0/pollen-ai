import Knock from "@knocklabs/node"
import { NextRequest, NextResponse } from "next/server"

function getKnockClient(): Knock | null {
  const apiKey = process.env.KNOCK_SECRET_API_KEY || process.env.KNOCK_API_KEY
  if (!apiKey) return null
  return new Knock({ apiKey })
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const knock = getKnockClient()
    if (!knock) return NextResponse.json({ success: true })

    const page = await knock.users.feeds.listItems(userId, "notifications", {
      page_size: 100,
      status: "unseen",
    })
    const ids = (page.entries ?? []).map((e) => e.id).filter(Boolean)
    if (ids.length > 0) {
      await knock.messages.batch.markAsSeen({ message_ids: ids })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all as read:", error)
    return NextResponse.json({ success: true })
  }
}

