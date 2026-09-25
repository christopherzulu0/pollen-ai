import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { after } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)",
  "/about",
  "/services",
  "/api/balances",
  "/api/celo/transactions",
  "/api/services",
  "/api/blog-posts(.*)",  // Matches /api/blog-posts and /api/blog-posts/[id] and all sub-routes
  "/api/blog(.*)",
  "/api/translate", // Allow public access to translation API
  "/api/voice-commands", // Allow public access to voice commands API
  "/blog(.*)",  // Matches /blog and /blog/[id] and any other blog routes
  "/contact",
  "/api/celo/balance(.*)",
  "/api/aave(.*)",
  "/Groups",
  "/api/groups/(.*)",
  "/api/groups/browse",
  "/api/Frontend(.*)",
  "/api/groups/requests(.*)",
  "/dashboard/groups/details/(.*)",
  "/api/admin/aave(.*)",
  "/api/admin/aave/hub-assets(.*)"
]);

// Define routes that should be ignored
const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/internal/audit",
]);

function auditSecret() {
  if (process.env.AUDIT_INTERNAL_SECRET) return process.env.AUDIT_INTERNAL_SECRET;
  if (process.env.NODE_ENV !== "production") return "dev-audit";
  return "";
}

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const { userId } = await auth();
    const limited = await enforceRateLimit(req, userId);
    if (limited) {
      if (limited.status === 429) {
        const secret = auditSecret();
        const requestId = limited.headers.get("x-request-id");
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip");
        if (secret) {
          after(() => {
            void fetch(new URL("/api/internal/audit", req.url), {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-audit-secret": secret,
              },
              body: JSON.stringify({
                actorId: userId,
                method: req.method,
                path: req.nextUrl.pathname,
                status: 429,
                ip,
                requestId,
              }),
            }).catch(() => undefined);
          });
        }
      }
      return limited;
    }
  }

  // Only protect routes that are not public and not ignored
  if (!isPublicRoute(req) && !isIgnoredRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};