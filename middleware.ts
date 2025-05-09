import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)",
]);

// Define routes that should be ignored
const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that are not public and not ignored
  if (!isPublicRoute(req) && !isIgnoredRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};