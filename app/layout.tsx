import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SettingsProvider } from "@/contexts/settings-context"
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/lib/providers"
import LayoutClient from "@/components/layout-client"
import Widget from "@/components/voice/Widget"
import UserSync from "@/components/UserSync"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pollen AI - Empowering Financial Inclusion",
  description:
    "Pollen AI combines artificial intelligence and blockchain technology to create innovative financial solutions for underserved communities.",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <SettingsProvider>
            <Providers>
              <LayoutClient>
                {children}
              </LayoutClient>
              <UserSync/>
              <Widget />
            </Providers>
          </SettingsProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}