import { NextResponse } from "next/server"

const ROUTE_ALIASES: Record<string, string> = {
  home: "/",
  landing: "/",
  dashboard: "/dashboard",
  admin: "/admin",
  blog: "/blog",
  services: "/services",
  contact: "/contact",
  about: "/about",
  savings: "/dashboard/personal-savings",
  "personal savings": "/dashboard/personal-savings",
  "view balances": "/dashboard/view-balances",
  payments: "/dashboard/payments",
  notifications: "/dashboard/notifications",
}

const DIRECT_PATTERNS: {
  keywords: string[]
  action: string
  target?: string
}[] = [
  { keywords: ["go back", "previous page"], action: "back" },
  { keywords: ["forward", "next page"], action: "forward" },
  { keywords: ["scroll down", "scroll lower"], action: "scroll", target: "down" },
  { keywords: ["scroll up", "scroll higher"], action: "scroll", target: "up" },
  { keywords: ["top of the page"], action: "scroll", target: "top" },
  { keywords: ["bottom of the page"], action: "scroll", target: "bottom" },
  { keywords: ["dark mode"], action: "theme", target: "dark" },
  { keywords: ["light mode"], action: "theme", target: "light" },
  { keywords: ["toggle theme"], action: "theme", target: "toggle" },
]

function matchDirectCommand(text: string) {
  const normalized = text.toLowerCase()

  for (const pattern of DIRECT_PATTERNS) {
    if (pattern.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        action: pattern.action,
        target: pattern.target,
        confidence: 0.9,
        source: "rule",
      }
    }
  }

  for (const alias in ROUTE_ALIASES) {
    if (normalized.includes(alias)) {
      return {
        action: "navigate",
        target: ROUTE_ALIASES[alias],
        confidence: 0.85,
        source: "rule",
      }
    }
  }

  return null
}

export async function POST(req: Request) {
  try {
    const { text, pathname } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "Missing command text" },
        { status: 400 }
      )
    }

    const directMatch = matchDirectCommand(text)
    if (directMatch) {
      return NextResponse.json(directMatch)
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        action: "unknown",
        message: "Voice assistant unavailable (missing AI configuration).",
        source: "fallback",
      })
    }

    const prompt = `You are the AI voice command interpreter for the Pollen web application.
Available routes and their purposes:
- "/" or "home": Landing page
- "/dashboard": Member dashboard overview
- "/admin": Admin control center
- "/blog": Blog listing
- "/blog/[id]": Blog detail pages
- "/services": Services overview
- "/contact": Contact page
- "/about": About page
- "/dashboard/personal-savings": Personal savings tab
- "/dashboard/view-balances": Balances
- "/dashboard/payments": Payments
- "/dashboard/notifications": Notifications

Given the user's spoken command, respond with a JSON object containing:
{
  "action": "navigate" | "back" | "forward" | "scroll" | "theme" | "notify" | "unknown",
  "target": "string or null",
  "message": "optional human friendly feedback",
  "confidence": number between 0 and 1
}

Rules:
- Use "navigate" with a valid route for navigation intents.
- Use "scroll" with target "up" | "down" | "top" | "bottom".
- Use "theme" with target "light" | "dark" | "toggle".
- Use "notify" to acknowledge informational requests that don't require navigation.
- If uncertain, return "unknown".
- Keep the message short and friendly.
`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content: JSON.stringify({
              command: text,
              currentPath: pathname,
            }),
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error("OpenAI voice command error:", error)
      return NextResponse.json(
        {
          action: "unknown",
          message: "Couldn't understand that command. Please try again.",
          source: "ai-error",
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    const parsed = JSON.parse(data.choices[0].message.content)

    return NextResponse.json({
      action: parsed.action ?? "unknown",
      target: parsed.target ?? null,
      message: parsed.message ?? null,
      confidence: parsed.confidence ?? 0.5,
      source: "ai",
    })
  } catch (error) {
    console.error("Voice command error:", error)
    return NextResponse.json(
      {
        action: "unknown",
        message: "Failed to process voice command.",
        source: "server-error",
      },
      { status: 500 }
    )
  }
}

