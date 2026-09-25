import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"
import { log } from "@/lib/logger"

const MONEY_PREFIXES = [
  "/api/aave",
  "/api/celo",
  "/api/contributions",
  "/api/loans",
  "/api/kyc",
  "/api/member/insurance/purchase",
  "/api/member/insurance/claims",
  "/api/wallet",
]

let warnedMissing = false
let redis: Redis | null = null
let anonLimiter: Ratelimit | null = null
let userLimiter: Ratelimit | null = null
let moneyLimiter: Ratelimit | null = null

export function isMoneyRoute(pathname: string) {
  return MONEY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

function limiters() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!redis) {
    redis = Redis.fromEnv()
    anonLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "rl:anon",
    })
    userLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(120, "1 m"),
      prefix: "rl:user",
    })
    moneyLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "rl:money",
    })
  }
  return { anonLimiter: anonLimiter!, userLimiter: userLimiter!, moneyLimiter: moneyLimiter! }
}

function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown"
  return req.headers.get("x-real-ip") || "unknown"
}

export async function enforceRateLimit(req: Request, userId: string | null) {
  const url = new URL(req.url)
  const pathname = url.pathname
  if (!pathname.startsWith("/api/") || pathname === "/api/internal/audit") {
    return null
  }

  const money = isMoneyRoute(pathname)
  const production = process.env.NODE_ENV === "production"
  const buckets = limiters()

  if (!buckets) {
    if (!warnedMissing) {
      warnedMissing = true
      log({ event: "rate_limit_skipped", message: "UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set" })
    }
    if (production && money) {
      return NextResponse.json({ error: "Rate limiting is unavailable" }, { status: 503 })
    }
    return null
  }

  const requestId = req.headers.get("x-request-id") || crypto.randomUUID()
  const ip = clientIp(req)
  const limiter = money ? buckets.moneyLimiter : userId ? buckets.userLimiter : buckets.anonLimiter
  const key = money ? userId || ip : userId || ip

  try {
    const result = await limiter.limit(key)
    if (result.success) return null

    const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
    log({
      event: "rate_limit",
      requestId,
      method: req.method,
      path: pathname,
      status: 429,
      actorId: userId,
      ip,
    })

    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "x-request-id": requestId,
        },
      }
    )
  } catch (error) {
    log({
      event: "rate_limit_error",
      requestId,
      method: req.method,
      path: pathname,
      actorId: userId,
      ip,
      message: error instanceof Error ? error.message : "rate limit failed",
    })
    if (production && money) {
      return NextResponse.json({ error: "Rate limiting is unavailable" }, { status: 503 })
    }
    return null
  }
}
