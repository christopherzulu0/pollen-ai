"use client"

import { useEffect, useState, useCallback } from "react"
import { useUser, useOrganization } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import {
  KnockProvider,
  KnockFeedProvider,
  KnockSlackProvider,
  KnockMsTeamsProvider,
  NotificationFeed,
  usePreferences,
  SlackAuthButton,
  SlackAuthContainer,
  MsTeamsAuthButton,
  MsTeamsAuthContainer,
} from "@knocklabs/react"
import "@knocklabs/react/dist/index.css"
import { Bell, Settings, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const KNOCK_FEED_ID = "notifications"
const KNOCK_PUBLIC_KEY = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY
const KNOCK_SLACK_CHANNEL_ID = process.env.NEXT_PUBLIC_KNOCK_SLACK_CHANNEL_ID
const KNOCK_MS_TEAMS_CHANNEL_ID = process.env.NEXT_PUBLIC_KNOCK_MS_TEAMS_CHANNEL_ID

// Preference center for push/email/channel settings
function PreferenceCenter() {
  const { preferences, setPreferences, loading } = usePreferences()

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!preferences?.length) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
        <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          No preference sets configured. Configure workflows in your Knock dashboard.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage how you receive notifications across email, push, and chat channels.
      </p>
      <div className="space-y-3">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h4 className="font-medium text-foreground">{pref.id}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

// Chat integrations (Slack + Teams) - requires channel IDs from Knock dashboard
function ChatIntegrations({ tenantId }: { tenantId?: string }) {
  const hasSlackConfig = KNOCK_SLACK_CHANNEL_ID && tenantId
  const hasTeamsConfig = KNOCK_MS_TEAMS_CHANNEL_ID && tenantId

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 flex items-center gap-2 font-medium text-foreground">
          <MessageCircle className="h-5 w-5" />
          Slack
        </h3>
        {hasSlackConfig ? (
          <KnockSlackProvider knockSlackChannelId={KNOCK_SLACK_CHANNEL_ID} tenantId={tenantId}>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Connect Slack to receive notifications in your channels.
              </p>
              <SlackAuthContainer>
                <SlackAuthButton />
              </SlackAuthContainer>
            </div>
          </KnockSlackProvider>
        ) : (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Configure NEXT_PUBLIC_KNOCK_SLACK_CHANNEL_ID and join an organization to connect Slack.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://docs.knock.app/in-app-ui/react/slack-kit" target="_blank" rel="noopener noreferrer">
                Setup Slack
              </a>
            </Button>
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2 flex items-center gap-2 font-medium text-foreground">
          <Users className="h-5 w-5" />
          Microsoft Teams
        </h3>
        {hasTeamsConfig ? (
          <KnockMsTeamsProvider knockMsTeamsChannelId={KNOCK_MS_TEAMS_CHANNEL_ID} tenantId={tenantId}>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Connect Microsoft Teams to receive notifications.
              </p>
              <MsTeamsAuthContainer>
                <MsTeamsAuthButton />
              </MsTeamsAuthContainer>
            </div>
          </KnockMsTeamsProvider>
        ) : (
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              Configure NEXT_PUBLIC_KNOCK_MS_TEAMS_CHANNEL_ID and join an organization to connect Teams.
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href="https://docs.knock.app/in-app-ui/react/teams-kit" target="_blank" rel="noopener noreferrer">
                Setup Teams
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Inner content that uses KnockFeedProvider context
function NotificationsContent({ tenantId }: { tenantId?: string }) {
  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="feed" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Feed
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Push & Preferences
        </TabsTrigger>
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat (Slack/Teams)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="feed" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] min-w-0 w-full overflow-hidden [&_.knock-feed-container]:!border-0 [&_.knock-feed-container]:!bg-transparent [&_.knock-notification_feed]:!bg-transparent [&_.rnf-notification-feed]:!min-w-0 [&_.rnf-notification-feed__container]:!min-w-0">
              <NotificationFeed
                EmptyComponent={
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-foreground">
                      No notifications
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don&apos;t have any notifications at the moment.
                    </p>
                  </div>
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="preferences" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <p className="text-sm text-muted-foreground">
              Control how you receive push, email, and in-app notifications.
            </p>
          </CardHeader>
          <CardContent>
            <PreferenceCenter />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="chat" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Chat Integrations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Connect Slack or Microsoft Teams to receive notifications in your chat channels.
            </p>
          </CardHeader>
          <CardContent>
            <ChatIntegrations tenantId={tenantId} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default function NotificationsPage() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { organization } = useOrganization()
  const { resolvedTheme } = useTheme()
  const [userToken, setUserToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)

  const tenantId = organization?.id ?? undefined

  const fetchUserToken = useCallback(async () => {
    if (!isUserLoaded || !user) return
    try {
      setTokenLoading(true)
      const params = tenantId ? `?tenant=${encodeURIComponent(tenantId)}` : ""
      const res = await fetch(`/api/knock/user-token${params}`)
      const data = await res.json()
      setUserToken(data.token ?? null)
    } catch (err) {
      console.error("Error fetching Knock user token:", err)
      setUserToken(null)
    } finally {
      setTokenLoading(false)
    }
  }, [user, isUserLoaded, tenantId])

  useEffect(() => {
    fetchUserToken()
  }, [fetchUserToken])

  if (!isUserLoaded || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!KNOCK_PUBLIC_KEY) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Notifications
        </h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-center text-muted-foreground">
              Knock is not configured. Add NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY to your environment.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const defaultFeedOptions = tenantId
    ? { tenant: tenantId, has_tenant: true }
    : undefined

  return (
    <div className="w-full min-w-0 space-y-6 overflow-hidden px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Stay updated with your account activity
          {tenantId && (
            <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              Tenant: {organization?.name ?? tenantId}
            </span>
          )}
        </p>
        {!process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID && (
          <p className="mt-2 rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
            If you see a 400 error: add <code className="rounded bg-muted px-1">NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID</code> with your in-app feed channel UUID from the Knock dashboard (Channels → in-app feed).
          </p>
        )}
      </div>

      {tokenLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <KnockProvider
          apiKey={KNOCK_PUBLIC_KEY}
          user={{ id: user.id, name: user.fullName ?? undefined }}
          userToken={userToken ?? undefined}
          onUserTokenExpiring={fetchUserToken}
        >
          <KnockFeedProvider
            feedId={KNOCK_FEED_ID}
            defaultFeedOptions={defaultFeedOptions}
            colorMode={(resolvedTheme ?? "light") === "dark" ? "dark" : "light"}
          >
            <NotificationsContent tenantId={tenantId} />
          </KnockFeedProvider>
        </KnockProvider>
      )}
    </div>
  )
}
