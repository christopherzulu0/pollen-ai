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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const pageSize = searchParams.get("pageSize") || "20"
    const status = searchParams.get("status") || "all"

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const knock = getKnockClient()
    const response = await knock.feeds.get(userId, "notifications", {
      page_size: parseInt(pageSize),
      status,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

