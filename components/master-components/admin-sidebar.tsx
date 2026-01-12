"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ArrowLeftRight,
  FileText,
  Wallet,
  Package,
  Calendar,
  Bell,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calculator,
  ShieldCheck,
  Shield,
} from "lucide-react"
import type { AdminView } from "./admin-dashboard"

interface AdminSidebarProps {
  currentView: AdminView
  onViewChange: (view: AdminView) => void
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const navItems = [
  { id: "overview" as AdminView, label: "Overview", icon: LayoutDashboard },
  { id: "users" as AdminView, label: "Users", icon: Users },
  { id: "groups" as AdminView, label: "Groups", icon: UsersRound },
  { id: "transactions" as AdminView, label: "Transactions", icon: ArrowLeftRight },
  { id: "blog" as AdminView, label: "Blog", icon: FileText },
  { id: "loans" as AdminView, label: "Loans", icon: Wallet },
  { id: "aave" as AdminView, label: "AAVE v4", icon: TrendingUp },
  { id: "accounting" as AdminView, label: "Accounting", icon: Calculator },
  { id: "kyc" as AdminView, label: "KYC Manager", icon: ShieldCheck },
  { id: "insurance" as AdminView, label: "Insurance", icon: Shield },
  { id: "services" as AdminView, label: "Services", icon: Package },
  { id: "meetings" as AdminView, label: "Meetings", icon: Calendar },
  { id: "notifications" as AdminView, label: "Notifications", icon: Bell },
  { id: "support" as AdminView, label: "Support", icon: MessageSquare },
]

export function AdminSidebar({ currentView, onViewChange, collapsed, onCollapsedChange }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-10 flex h-[calc(100vh-5rem)] flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">Admin Portal</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                collapsed && "justify-center",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className={cn("text-xs text-sidebar-foreground/60", collapsed && "text-center")}>
          {collapsed ? "v1" : "Version 1.0.0"}
        </div>
      </div>
    </aside>
  )
}
