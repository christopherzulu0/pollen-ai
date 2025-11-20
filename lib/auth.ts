import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Helper function to get the authenticated user ID from Clerk
 * with better error handling
 */
export async function getAuthenticatedUserId() {
  try {
    const session = await auth();
    return session?.userId || null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

/**
 * Helper function to handle authentication for API routes
 * Returns the user ID if authenticated, or a response object if not
 */
export async function authenticateRequest() {
  try {
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return { 
        authenticated: false, 
        response: NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      };
    }
    
    return { authenticated: true, userId };
  } catch (error) {
    console.error("Authentication error:", error);
    return { 
      authenticated: false, 
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      )
    };
  }
}

/**
 * Get the full user profile from Clerk
 */
export async function getCurrentUserProfile() {
  try {
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
} 