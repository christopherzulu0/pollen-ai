import type React from "react"
import { MemberDashboardLayout } from "@/components/member-components/member-dashboard-layout"
import "./globals.css"
export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <MemberDashboardLayout>{children}</MemberDashboardLayout>
}
