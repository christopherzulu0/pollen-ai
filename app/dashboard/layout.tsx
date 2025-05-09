import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Dashboard from "@/components/dashboard"

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
      <Dashboard>
        {children}
      </Dashboard>
    </ThemeProvider>
  )
}
