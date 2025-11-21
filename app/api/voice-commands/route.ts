import { NextResponse } from "next/server"

// Vercel serverless function configuration
export const maxDuration = 30 // Maximum 30 seconds for voice command processing
export const runtime = 'nodejs'

const ROUTE_ALIASES: Record<string, string> = {
  // Primary pages
  home: "/",
  landing: "/",
  "home page": "/",
  "landing page": "/",
  
  // Dashboard
  dashboard: "/dashboard",
  "member dashboard": "/dashboard",
  "my dashboard": "/dashboard",
  
  // Admin
  admin: "/admin",
  "admin panel": "/admin",
  "admin page": "/admin",
  
  // Blog
  blog: "/blog",
  articles: "/blog",
  "blog posts": "/blog",
  
  // Services
  services: "/services",
  "our services": "/services",
  
  // Contact
  contact: "/contact",
  "contact us": "/contact",
  "contact page": "/contact",
  
  // About
  about: "/about",
  "about us": "/about",
  "about page": "/about",
  
  // Dashboard sub-pages
  savings: "/dashboard/personal-savings",
  "personal savings": "/dashboard/personal-savings",
  "my savings": "/dashboard/personal-savings",
  
  balances: "/dashboard/view-balances",
  "view balances": "/dashboard/view-balances",
  "my balances": "/dashboard/view-balances",
  "check balance": "/dashboard/view-balances",
  
  payments: "/dashboard/payments",
  "make payment": "/dashboard/payments",
  "my payments": "/dashboard/payments",
  
  notifications: "/dashboard/notifications",
  "my notifications": "/dashboard/notifications",
  alerts: "/dashboard/notifications",
}

const DIRECT_PATTERNS: {
  keywords: string[]
  action: string
  target?: string
  message?: string
}[] = [
  // Navigation
  { keywords: ["go back", "previous page", "back"], action: "back", message: "Going back" },
  { keywords: ["go forward", "forward", "next page"], action: "forward", message: "Going forward" },
  
  // Scrolling
  { keywords: ["scroll down", "scroll lower", "down"], action: "scroll", target: "down", message: "Scrolling down" },
  { keywords: ["scroll up", "scroll higher", "up"], action: "scroll", target: "up", message: "Scrolling up" },
  { keywords: ["top of page", "scroll to top", "go to top"], action: "scroll", target: "top", message: "Going to top" },
  { keywords: ["bottom of page", "scroll to bottom", "go to bottom"], action: "scroll", target: "bottom", message: "Going to bottom" },
  
  // Theme
  { keywords: ["dark mode", "switch to dark", "enable dark mode"], action: "theme", target: "dark", message: "Switching to dark mode" },
  { keywords: ["light mode", "switch to light", "enable light mode"], action: "theme", target: "light", message: "Switching to light mode" },
  { keywords: ["toggle theme", "switch theme", "change theme"], action: "theme", target: "toggle", message: "Toggling theme" },
]

function matchDirectCommand(text: string) {
  const normalized = text.toLowerCase().trim()

  // Check action patterns first (more specific)
  for (const pattern of DIRECT_PATTERNS) {
    if (pattern.keywords.some((keyword) => normalized.includes(keyword))) {
      return {
        action: pattern.action,
        target: pattern.target,
        message: pattern.message,
        confidence: 0.95,
        source: "rule",
      }
    }
  }

  // Check navigation routes (support "go to X", "open X", "navigate to X")
  for (const alias in ROUTE_ALIASES) {
    // Match exact phrase or with common prefixes
    const patterns = [
      alias,
      `go to ${alias}`,
      `open ${alias}`,
      `navigate to ${alias}`,
      `show ${alias}`,
      `take me to ${alias}`,
    ]
    
    if (patterns.some(pattern => normalized === pattern || normalized.includes(pattern))) {
      return {
        action: "navigate",
        target: ROUTE_ALIASES[alias],
        message: `Navigating to ${alias}`,
        confidence: 0.9,
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

    // Try direct pattern matching first (faster, no API call needed)
    const directMatch = matchDirectCommand(text)
    if (directMatch) {
      console.log(`✅ Direct match found for: "${text}"`, directMatch)
      return NextResponse.json(directMatch)
    }

    console.log(`🤖 No direct match for "${text}", using AI interpretation...`)

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        action: "unknown",
        message: "Voice assistant unavailable (missing AI configuration).",
        source: "fallback",
      })
    }

    // Optimized prompt for faster AI response
    const prompt = `Interpret voice command for Pollen app. Routes: / (home), /dashboard, /admin, /blog, /services, /contact, /about. Actions: navigate, scroll (up/down/top/bottom), theme (light/dark/toggle), back, forward. Return JSON: {"action":"...", "target":"...", "message":"...", "confidence":0-1}. Be concise.`

    // Create abort controller for timeout (25s to leave 5s buffer before Vercel's 30s limit)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          max_tokens: 150, // Limit response size for faster processing
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: prompt },
            {
              role: "user",
              content: `Command: "${text}". Current page: ${pathname}`,
            },
          ],
        }),
      })

      clearTimeout(timeoutId)

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
      
      // Validate response structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Invalid OpenAI response structure:", data)
        return NextResponse.json({
          action: "unknown",
          message: "Command interpretation failed. Please try again.",
          source: "ai-error",
        })
      }

      const parsed = JSON.parse(data.choices[0].message.content)

      return NextResponse.json({
        action: parsed.action ?? "unknown",
        target: parsed.target ?? null,
        message: parsed.message ?? null,
        confidence: parsed.confidence ?? 0.5,
        source: "ai",
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // Handle timeout errors specifically
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('timeout')) {
        console.error("Voice command timeout:", fetchError)
        return NextResponse.json({
          action: "unknown",
          message: "Command processing took too long. Please try a simpler command.",
          source: "timeout",
        })
      }
      
      // Handle other fetch errors
      console.error("Voice command fetch error:", fetchError)
      return NextResponse.json({
        action: "unknown",
        message: "Unable to reach voice assistant. Please try again.",
        source: "network-error",
      })
    }
  } catch (error: any) {
    console.error("Voice command error:", error)
    return NextResponse.json(
      {
        action: "unknown",
        message: "Failed to process voice command.",
        source: "server-error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}

