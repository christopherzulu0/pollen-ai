import type React from "react"
import { MemberDashboardLayout } from "@/components/member-components/member-dashboard-layout"
import { CeloWalletProvider } from "@/lib/celo/context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CeloWalletProvider>
        <MemberDashboardLayout>{children}</MemberDashboardLayout>
      </CeloWalletProvider>
    </ThemeProvider>
  )
}
