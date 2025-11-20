"use client"

import React, { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

interface LayoutClientProps {
  children: ReactNode
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')
  const isAdmin = pathname.startsWith('/admin')
  const isAdminOrDashboard = isDashboard || isAdmin

  return (
    <div className={`flex flex-col min-h-screen ${isAdminOrDashboard ? 'bg-white dark:bg-gray-950 text-gray-900 dark:text-white' : 'bg-gray-900 text-white'}`}>
      {/* Show Navbar only on non-dashboard/admin pages */}
      {!isAdminOrDashboard && <Navbar />}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Show Footer only on non-dashboard/admin pages */}
      {!isAdminOrDashboard && <Footer />}
    </div>
  )
}

