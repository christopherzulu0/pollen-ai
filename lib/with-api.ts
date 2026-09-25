import { NextResponse } from "next/server"
import { log } from "@/lib/logger"
import {
  actorId,
  beginIdempotency,
  clientIp,
  finishIdempotency,
  logRequest,
  writeAudit,
} from "@/lib/audit"

type RouteHandler = (req: Request, ctx?: unknown) => Promise<Response> | Response

function withRequestId(res: Response, requestId: string) {
  const headers = new Headers(res.headers)
  headers.set("x-request-id", requestId)
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  })
}

export function withApi(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    const started = Date.now()
    const requestId = req.headers.get("x-request-id") || crypto.randomUUID()
    const actor = await actorId()
    const path = new URL(req.url).pathname
    let status = 500

    const emit = () => {
      logRequest({
        requestId,
        method: req.method,
        path,
        status,
        durationMs: Date.now() - started,
        actorId: actor,
        ip: clientIp(req),
      })
    }

    try {
      const pending = await beginIdempotency(req, actor)
      if (pending?.replay) {
        status = pending.status
        const body =
          pending.status === 409
            ? { error: "Request already in progress" }
            : { ok: true, replayed: true }
        emit()
        return NextResponse.json(body, {
          status,
          headers: { "x-request-id": requestId },
        })
      }

      const res = await handler(req, ctx)
      status = res.status

      try {
        await finishIdempotency(pending, status)
        await writeAudit(req, status, requestId, actor)
      } catch (error) {
        log({
          event: "audit_failed",
          requestId,
          method: req.method,
          path,
          status,
          actorId: actor,
          message: error instanceof Error ? error.message : "audit failed",
        })
      }

      emit()
      return withRequestId(res, requestId)
    } catch (error) {
      status = 500
      log({
        event: "api_error",
        requestId,
        method: req.method,
        path,
        status,
        actorId: actor,
        message: error instanceof Error ? error.message : "request failed",
      })
      try {
        await writeAudit(req, status, requestId, actor)
      } catch {
        // The response still returns.
      }
      emit()
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500, headers: { "x-request-id": requestId } }
      )
    }
  }
}
