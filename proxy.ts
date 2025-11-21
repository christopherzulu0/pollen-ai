import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)",
  "/about",
  "/services",
  "/api/services",
  "/api/blog-posts(.*)",  // Matches /api/blog-posts and /api/blog-posts/[id] and all sub-routes
  "/api/blog(.*)",
  "/api/translate", // Allow public access to translation API
  "/api/voice-commands", // Allow public access to voice commands API
  "/blog(.*)",  // Matches /blog and /blog/[id] and any other blog routes
  "/contact"
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