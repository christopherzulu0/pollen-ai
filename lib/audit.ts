import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { log } from "@/lib/logger"

const IDEMPOTENT_POSTS = new Set([
  "/api/join-requests",
  "/api/Frontend/request",
  "/api/notifications/mark-read",
  "/api/notifications/mark-all-read",
])

export function clientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || null
  return req.headers.get("x-real-ip")
}

export function isIdempotentRoute(method: string, pathname: string) {
  if (method === "PUT" && /^\/api\/meetings\/[^/]+\/minutes$/.test(pathname)) return true
  return method === "POST" && IDEMPOTENT_POSTS.has(pathname)
}

export async function actorId() {
  try {
    const { userId } = await auth()
    return userId
  } catch {
    return null
  }
}

export async function beginIdempotency(req: Request, actor: string | null) {
  const url = new URL(req.url)
  if (!isIdempotentRoute(req.method, url.pathname)) return null
  const key = req.headers.get("idempotency-key")?.trim()
  if (!key) return null

  const owner = actor || "anonymous"
  const existing = await prisma.idempotencyKey.findUnique({
    where: { key_actorId: { key, actorId: owner } },
  })

  if (existing) {
    if (existing.status >= 200 && existing.status < 300) {
      return { replay: true as const, status: existing.status }
    }
    if (existing.status === 0) {
      return { replay: true as const, status: 409 }
    }
    await prisma.idempotencyKey.delete({ where: { id: existing.id } })
  }

  try {
    await prisma.idempotencyKey.create({
      data: { key, actorId: owner, status: 0 },
    })
  } catch {
    const raced = await prisma.idempotencyKey.findUnique({
      where: { key_actorId: { key, actorId: owner } },
    })
    if (raced && raced.status >= 200 && raced.status < 300) {
      return { replay: true as const, status: raced.status }
    }
    if (raced && raced.status === 0) {
      return { replay: true as const, status: 409 }
    }
  }

  return { replay: false as const, key, owner }
}

export async function finishIdempotency(
  pending: { replay: false; key: string; owner: string } | { replay: true; status: number } | null,
  status: number
) {
  if (!pending || pending.replay) return
  if (status >= 200 && status < 300) {
    await prisma.idempotencyKey.update({
      where: { key_actorId: { key: pending.key, actorId: pending.owner } },
      data: { status },
    })
    return
  }
  await prisma.idempotencyKey.deleteMany({
    where: { key: pending.key, actorId: pending.owner, status: 0 },
  })
}

export async function writeAudit(req: Request, status: number, requestId: string, actor: string | null) {
  const method = req.method.toUpperCase()
  const pathname = new URL(req.url).pathname
  if (pathname === "/api/internal/audit") return
  const notable = method !== "GET" || status === 401 || status === 403 || status === 429
  if (!notable) return

  await prisma.auditLog.create({
    data: {
      actorId: actor,
      method,
      path: pathname,
      status,
      ip: clientIp(req),
      requestId,
    },
  })
}

export function logRequest(fields: {
  requestId: string
  method: string
  path: string
  status: number
  durationMs: number
  actorId: string | null
  ip: string | null
}) {
  log({ event: "api_request", ...fields })
}
