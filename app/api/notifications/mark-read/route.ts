import Knock from "@knocklabs/node"
import { NextRequest, NextResponse } from "next/server"

// Initialize Knock client with secret API key (server-side only)
function getKnockClient(): Knock {
  const apiKey = process.env.KNOCK_SECRET_API_KEY

  if (!apiKey) {
    throw new Error("KNOCK_SECRET_API_KEY is not defined in environment variables")
  }

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
    const response = await knock.feeds.markAsRead(userId, "notifications", [notificationId])

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error marking as read:", error)
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 }
    )
  }
}

