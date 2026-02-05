import { auth } from "@clerk/nextjs/server"
import { signUserToken, buildUserTokenGrant, Grants } from "@knocklabs/node"
import { NextResponse } from "next/server"

/**
 * GET /api/knock/user-token
 * Returns a signed JWT for the authenticated Clerk user.
 * Required when Knock enhanced security mode is enabled.
 * Optional tenant grants for Slack/Teams channel access.
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const signingKey = process.env.KNOCK_SIGNING_KEY
    if (!signingKey) {
      // When enhanced security is disabled, Knock accepts requests without a token
      return NextResponse.json({ token: null })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get("tenant")

    const grants = tenantId
      ? [buildUserTokenGrant({ type: "tenant", id: tenantId }, [Grants.SlackChannelsRead, Grants.MsTeamsChannelsRead])]
      : undefined

    const token = await signUserToken(userId, {
      signingKey,
      expiresInSeconds: 3600, // 1 hour
      shouldGenerateJti: true,
      grants,
    })

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error generating Knock user token:", error)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
