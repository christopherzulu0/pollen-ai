"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { MemberSidebar } from "./member-sidebar"
import { MemberHeader } from "./member-header"

export type MemberView = "dashboard" | "aave" | "groups" | "transactions" | "savings" | "profile"

export function MemberDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <MemberSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64",
        )}
      >
        <MemberHeader onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
