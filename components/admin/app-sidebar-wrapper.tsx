"use client"

import dynamic from 'next/dynamic'

// Dynamically import AppSidebar to avoid hydration mismatches with Radix UI IDs
const AppSidebar = dynamic(() => import("@/components/admin/app-sidebar").then(mod => ({ default: mod.AppSidebar })), {
  ssr: false,
  loading: () => (
    <aside className="w-64 border-r border-border/40 bg-sidebar" data-sidebar="sidebar">
      <div className="flex h-full w-full flex-col" />
    </aside>
  ) // Placeholder to prevent layout shift
})

export default AppSidebar

