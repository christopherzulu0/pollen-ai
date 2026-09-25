"use client"

import { useState, lazy, Suspense } from "react"
import { cn } from "@/lib/utils"
import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"
import { DashboardOverview } from "./views/dashboard-overview"
import { Loader2 } from "lucide-react"

const UsersView = lazy(() => import("./views/users-view").then((mod) => ({ default: mod.UsersView })))
const GroupsView = lazy(() => import("./views/groups-view").then((mod) => ({ default: mod.GroupsView })))
const TransactionsView = lazy(() =>
  import("./views/transactions-view").then((mod) => ({ default: mod.TransactionsView })),
)
const BlogView = lazy(() => import("./views/blog-view").then((mod) => ({ default: mod.BlogView })))
const LoansView = lazy(() => import("./views/loans-view").then((mod) => ({ default: mod.LoansView })))
const AaveView = lazy(() => import("./views/aave-view").then((mod) => ({ default: mod.AaveView })))
const AccountingView = lazy(() => import("./views/accounting-view").then((mod) => ({ default: mod.AccountingView })))
const ServicesView = lazy(() => import("./views/services-view").then((mod) => ({ default: mod.ServicesView })))
const MeetingsView = lazy(() => import("./views/meetings-view").then((mod) => ({ default: mod.MeetingsView })))
const NotificationsView = lazy(() =>
  import("./views/notifications-view").then((mod) => ({ default: mod.NotificationsView })),
)
const SupportView = lazy(() => import("./views/support-view").then((mod) => ({ default: mod.SupportView })))
const KycView = lazy(() => import("./views/kyc-view").then((mod) => ({ default: mod.KycView })))
const InsuranceView = lazy(() => import("./views/insurance-view").then((mod) => ({ default: mod.InsuranceView })))

export type AdminView =
  | "overview"
  | "users"
  | "groups"
  | "transactions"
  | "blog"
  | "loans"
  | "aave"
  | "accounting"
  | "kyc"
  | "insurance"
  | "services"
  | "meetings"
  | "notifications"
  | "support"

const ViewLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="text-center space-y-3">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
)

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderView = () => {
    switch (currentView) {
      case "overview":
        return <DashboardOverview />
      case "users":
        return (
          <Suspense fallback={<ViewLoader />}>
            <UsersView />
          </Suspense>
        )
      case "groups":
        return (
          <Suspense fallback={<ViewLoader />}>
            <GroupsView />
          </Suspense>
        )
      case "transactions":
        return (
          <Suspense fallback={<ViewLoader />}>
            <TransactionsView />
          </Suspense>
        )
      case "blog":
        return (
          <Suspense fallback={<ViewLoader />}>
            <BlogView />
          </Suspense>
        )
      case "loans":
        return (
          <Suspense fallback={<ViewLoader />}>
            <LoansView />
          </Suspense>
        )
      case "aave":
        return (
          <Suspense fallback={<ViewLoader />}>
            <AaveView />
          </Suspense>
        )
      case "accounting":
        return (
          <Suspense fallback={<ViewLoader />}>
            <AccountingView />
          </Suspense>
        )
      case "kyc":
        return (
          <Suspense fallback={<ViewLoader />}>
            <KycView />
          </Suspense>
        )
      case "insurance":
        return (
          <Suspense fallback={<ViewLoader />}>
            <InsuranceView />
          </Suspense>
        )
      case "services":
        return (
          <Suspense fallback={<ViewLoader />}>
            <ServicesView />
          </Suspense>
        )
      case "meetings":
        return (
          <Suspense fallback={<ViewLoader />}>
            <MeetingsView />
          </Suspense>
        )
      case "notifications":
        return (
          <Suspense fallback={<ViewLoader />}>
            <NotificationsView />
          </Suspense>
        )
      case "support":
        return (
          <Suspense fallback={<ViewLoader />}>
            <SupportView />
          </Suspense>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <AdminHeader currentView={currentView} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 p-6">{renderView()}</main>
      </div>
    </div>
  )
}
