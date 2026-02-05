import Knock from "@knocklabs/node"
import { NextRequest, NextResponse } from "next/server"

function getKnockClient(): Knock | null {
  const apiKey = process.env.KNOCK_SECRET_API_KEY || process.env.KNOCK_API_KEY
  if (!apiKey) return null
  return new Knock({ apiKey })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, notificationId } = await request.json()

    if (!userId || !notificationId) {
      return NextResponse.json(
        { error: "Missing userId or notificationId" },
        { status: 400 }
      )
    }

    const knock = getKnockClient()
    if (!knock) return NextResponse.json({ success: true })

    await knock.messages.markAsRead(notificationId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking as read:", error)
    return NextResponse.json({ success: true })
  }
}

