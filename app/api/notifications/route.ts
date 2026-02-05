import Knock from "@knocklabs/node"
import { NextRequest, NextResponse } from "next/server"

// Initialize Knock client with secret API key (server-side only)
function getKnockClient(): Knock | null {
  const apiKey = process.env.KNOCK_SECRET_API_KEY || process.env.KNOCK_API_KEY
  if (!apiKey) return null
  return new Knock({ apiKey })
}

// Transform Knock feed items to client-expected format
function transformEntry(item: {
  id: string
  blocks?: Array<{ content?: string; name?: string; type?: string }>
  data?: Record<string, unknown>
  source?: { key?: string }
  inserted_at?: string
  updated_at?: string
  read_at?: string | null
  seen_at?: string | null
}) {
  const firstBlock = item.blocks?.[0]
  const body = firstBlock?.content ?? ""
  const title = (item.data?.title as string) ?? item.source?.key ?? "Notification"
  return {
    id: item.id,
    title,
    body,
    actor: undefined,
    data: item.data,
    seen_at: item.seen_at ?? null,
    read_at: item.read_at ?? null,
    created_at: item.inserted_at ?? item.updated_at ?? new Date().toISOString(),
    updated_at: item.updated_at ?? new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const pageSize = searchParams.get("pageSize") || "20"
    const status = (searchParams.get("status") || "all") as "unread" | "read" | "unseen" | "seen" | "all"
    const tenant = searchParams.get("tenant") || undefined
    const hasTenant = searchParams.get("hasTenant") === "true"

    if (!userId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const knock = getKnockClient()
    if (!knock) {
      // Return empty feed when Knock is not configured - avoids 500
      return NextResponse.json({
        entries: [],
        page_info: { after: null, before: null, page_size: parseInt(pageSize) },
        meta: { total_count: 0, unseen_count: 0, unread_count: 0 },
      })
    }

    const feedOptions: Record<string, unknown> = {
      page_size: parseInt(pageSize),
      status,
    }
    if (tenant) {
      feedOptions.tenant = tenant
      if (hasTenant) feedOptions.has_tenant = true
    }

    const feedChannelId = process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID || "notifications"
    const page = await knock.users.feeds.listItems(userId, feedChannelId, feedOptions)

    const entries = (page.entries ?? []).map(transformEntry)
    const unseenCount = entries.filter((e) => !e.seen_at).length
    const unreadCount = entries.filter((e) => !e.read_at).length

    return NextResponse.json({
      entries,
      page_info: {
        after: page.page_info?.after ?? null,
        before: page.page_info?.before ?? null,
        page_size: parseInt(pageSize),
      },
      meta: {
        total_count: entries.length,
        unseen_count: unseenCount,
        unread_count: unreadCount,
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    // Return empty feed on error so the page loads with fallback UI
    return NextResponse.json(
      {
        entries: [],
        page_info: { after: null, before: null, page_size: 20 },
        meta: { total_count: 0, unseen_count: 0, unread_count: 0 },
      },
      { status: 200 }
    )
  }
}

