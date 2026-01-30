import type React from "react"
import { MemberDashboardLayout } from "@/components/member-components/member-dashboard-layout"
import { CeloWalletProvider } from "@/lib/celo/context"
import "./globals.css"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <CeloWalletProvider>
      <MemberDashboardLayout>{children}</MemberDashboardLayout>
    </CeloWalletProvider>
  )
}
