import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withApi } from "@/lib/with-api"


function auditSecret() {
  if (process.env.AUDIT_INTERNAL_SECRET) return process.env.AUDIT_INTERNAL_SECRET
  if (process.env.NODE_ENV !== "production") return "dev-audit"
  return ""
}

export const POST = withApi(async function POST(req: Request) {
  const secret = auditSecret()
  if (!secret || req.headers.get("x-audit-secret") !== secret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid audit payload" }, { status: 400 })
  }

  const method = typeof body.method === "string" ? body.method : "GET"
  const path = typeof body.path === "string" ? body.path : ""
  const status = typeof body.status === "number" ? body.status : 0
  if (!path.startsWith("/api/") || status !== 429) {
    return NextResponse.json({ error: "Invalid audit payload" }, { status: 400 })
  }

  await prisma.auditLog.create({
    data: {
      actorId: typeof body.actorId === "string" ? body.actorId : null,
      method,
      path,
      status,
      ip: typeof body.ip === "string" ? body.ip : null,
      requestId: typeof body.requestId === "string" ? body.requestId : null,
    },
  })

  return NextResponse.json({ ok: true })
})
