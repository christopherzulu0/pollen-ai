import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { USER_CONNECTED_ACCOUNTS_DISPLAY_QUERY } from "@/sanity/queries/users";
import { AccountManager } from "@/components/support/settings/account-manager";
import { ProfileEditor } from "@/components/support/settings/profile-editor";
import { getUserPlanLimits } from "@/lib/features";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const [{ data: user }, planLimits] = await Promise.all([
    sanityFetch({
      query: USER_CONNECTED_ACCOUNTS_DISPLAY_QUERY,
      params: { clerkId: userId },
    }),
    getUserPlanLimits(),
  ]);

  const connectedAccounts = user?.connectedAccounts ?? [];
  const params = await searchParams;

  return (
    <main className="container mx-auto max-w-2xl bg-background px-4 py-8 text-foreground">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your connected accounts and preferences.
        </p>
      </div>

      {params.success && (
        <div className="mb-6 rounded-md border border-secondary/50 bg-secondary/10 p-4 text-secondary-foreground">
          {params.success === "account_connected" &&
            "Google account connected successfully!"}
          {params.success === "account_updated" &&
            "Google account tokens refreshed."}
        </div>
      )}

      {params.error && (
        <div className="mb-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          {params.error === "oauth_denied" &&
            "Google account connection was denied."}
          {params.error === "oauth_failed" &&
            "Failed to connect Google account. Please try again."}
          {params.error === "missing_params" && "Invalid OAuth response."}
          {params.error === "state_expired" &&
            "Connection request expired. Please try again."}
          {params.error === "state_mismatch" &&
            "Security validation failed. Please try again."}
          {params.error === "invalid_state" &&
            "Invalid security token. Please try again."}
        </div>
      )}

      <AccountManager
        connectedAccounts={connectedAccounts}
        maxCalendars={planLimits.maxConnectedCalendars}
        plan={planLimits.plan}
      />

      <ProfileEditor
        key={user?._id || "profile-editor"}
        initialData={{
          role: user?.role,
          bio: user?.bio,
          phone: user?.phone,
          image: user?.image,
          expertise: user?.expertise,
          socialLinks: user?.socialLinks,
        }}
      />

      {/* Billing Section */}
      <div className="mt-8 border-t border-border pt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Billing</h2>
        <Link
          href="/pricing"
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Manage Subscription</p>
              <p className="text-sm text-muted-foreground">
                View plans and billing details
              </p>
            </div>
          </div>
          <span className="text-muted-foreground">&rarr;</span>
        </Link>
      </div>
    </main>
  );
}
