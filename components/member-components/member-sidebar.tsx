"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  TrendingUp,
  UsersRound,
  ArrowLeftRight,
  PiggyBank,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  Wallet,
  DollarSign,
  CreditCard,
  ArrowDownUp,
  UserPlus,
  Mail,
  Users,
  Calendar,
  Shield,
} from "lucide-react"

interface MemberSidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

const navSections = [
  {
    title: "Overview",
    items: [
      { path: "/member", label: "Dashboard", icon: LayoutDashboard },
      { path: "/member/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    title: "Financial",
    items: [
      { path: "/member/balances", label: "View Balances", icon: Wallet },
      { path: "/member/personal-savings", label: "Personal Savings", icon: PiggyBank },
      { path: "/member/payments", label: "Payments", icon: CreditCard },
      { path: "/member/deposit-withdraw", label: "Deposit or Withdraw", icon: ArrowDownUp },
      { path: "/member/transactions", label: "Transactions", icon: ArrowLeftRight },
    ],
  },
  {
    title: "Groups",
    items: [
      { path: "/member/savings-groups", label: "Savings Groups", icon: Users },
      { path: "/member/groups", label: "My Groups", icon: UsersRound },
      { path: "/member/meetings", label: "Meetings", icon: Calendar },
      { path: "/member/create-group", label: "Create Group", icon: UserPlus },
      { path: "/member/group-requests", label: "Group Requests", icon: Mail },
      { path: "/member/join-group", label: "Join Group", icon: DollarSign },
    ],
  },
  {
    title: "DeFi",
    items: [{ path: "/member/aave", label: "AAVE v4", icon: TrendingUp }],
  },
  {
    title: "Insurance",
    items: [{ path: "/member/insurance", label: "Insurance Portal", icon: Shield }],
  },
  {
    title: "Account",
    items: [{ path: "/member/profile", label: "Profile", icon: User }],
  },
]

export function MemberSidebar({ collapsed, onCollapsedChange }: MemberSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0  z-10 flex h-[calc(100vh-5rem)] flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">Member Portal</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-2">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {section.title}
              </h3>
            )}
            {collapsed && <div className="h-px bg-sidebar-border my-2" />}
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => router.push(item.path)}
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    collapsed && "justify-center",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* <div className="border-t border-sidebar-border p-4">
        <div className={cn("text-xs text-sidebar-foreground/60", collapsed && "text-center")}>
          {collapsed ? "v1" : "Version 1.0.0"}
        </div>
      </div> */}
    </aside>
  )
}
