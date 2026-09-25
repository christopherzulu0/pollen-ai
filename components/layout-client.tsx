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
  const isSuperUser = pathname.startsWith('/Super-user')
  const isMember = pathname.startsWith('/member')
  const isSupport = pathname.startsWith('/support')
  const isPricing = pathname.startsWith('/pricing')
  const shouldHideNavbarFooter = isDashboard || isAdmin || isSuperUser || isMember
  const useLightBackground =
    shouldHideNavbarFooter || isSupport || isPricing

  return (
    <div className={`flex flex-col min-h-screen ${useLightBackground ? 'bg-background text-foreground' : 'bg-gray-900 text-white'}`}>
      {/* Show Navbar only on non-dashboard/admin/Super-user/member pages */}
      {!shouldHideNavbarFooter && <Navbar />}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Show Footer only on non-dashboard/admin/Super-user/member pages */}
      {!shouldHideNavbarFooter && <Footer />}
    </div>
  )
}

