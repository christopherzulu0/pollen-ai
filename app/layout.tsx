import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { SettingsProvider } from "@/contexts/settings-context"
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from "@/lib/providers"
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
        <body className={`${inter.className} bg-gray-900 text-white`}>
          <SettingsProvider>
            <Providers>
              <div className="flex flex-col min-h-screen">
                {/* <Navbar /> */}
                <main className="flex-1">{children}</main>
                {/* <Footer /> */}
              </div>
            </Providers>
          </SettingsProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}