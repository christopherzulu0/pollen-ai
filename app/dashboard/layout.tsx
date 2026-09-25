import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "@/components/dashboard"
import ProtectedDashboard from "@/components/dashboard-protected"
import { CeloWalletProvider } from "@/lib/celo/context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pollen - Financial Cooperative",
  description: "A platform for financial cooperatives",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <ProtectedDashboard>
        <CeloWalletProvider>
          <Dashboard>
            {children}
          </Dashboard>
        </CeloWalletProvider>
      </ProtectedDashboard>
    </ThemeProvider>
  )
}
