"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/LanguageContext"
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
    titleKey: "overview" as const,
    items: [
      { path: "/member", labelKey: "dashboard" as const, icon: LayoutDashboard },
      { path: "/member/notifications", labelKey: "notifications" as const, icon: Bell },
    ],
  },
  {
    titleKey: "financial" as const,
    items: [
      { path: "/member/balances", labelKey: "balances" as const, icon: Wallet },
      { path: "/member/personal-savings", labelKey: "savings" as const, icon: PiggyBank },
      { path: "/member/payments", labelKey: "payments" as const, icon: CreditCard },
      { path: "/member/deposit-withdraw", labelKey: "deposit" as const, icon: ArrowDownUp },
    ],
  },
  {
    titleKey: "groups" as const,
    items: [
      { path: "/member/savings-groups", labelKey: "savingsGroups" as const, icon: Users },
      { path: "/member/meetings", labelKey: "meetings" as const, icon: Calendar },
      { path: "/member/create-group", labelKey: "createGroup" as const, icon: UserPlus },
      { path: "/member/group-requests", labelKey: "requests" as const, icon: Mail },
      { path: "/member/join-group", labelKey: "joinGroup" as const, icon: DollarSign },
    ],
  },
  // {
  //   title: "DeFi",
  //   items: [{ path: "/member/aave", label: "AAVE v4", icon: TrendingUp }],
  // },
  {
    titleKey: "insurance" as const,
    items: [{ path: "/member/insurance", labelKey: "insurancePortal" as const, icon: Shield }],
  },
  // {
  //   title: "Account",
  //   items: [{ path: "/member/profile", label: "Profile", icon: User }],
  // },
]

export function MemberSidebar({ collapsed, onCollapsedChange }: MemberSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const nav = t.member.nav

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-10 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && <h2 className="text-lg font-semibold text-sidebar-foreground">{nav.portal}</h2>}
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
          <div key={section.titleKey} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                {nav[section.titleKey]}
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
                  {!collapsed && <span className="truncate">{nav[item.labelKey]}</span>}
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
