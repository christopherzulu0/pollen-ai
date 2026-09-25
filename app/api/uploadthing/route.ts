import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "@/lib/uploadthing"
import { withApi } from "@/lib/with-api"

const handlers = createRouteHandler({
  router: ourFileRouter,
})

export const GET = withApi(handlers.GET as (req: Request, ctx?: unknown) => Promise<Response>)
export const POST = withApi(handlers.POST as (req: Request, ctx?: unknown) => Promise<Response>)

