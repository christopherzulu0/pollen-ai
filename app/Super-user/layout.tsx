import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pollen AI - Admin",
  description:
    "Pollen AI combines artificial intelligence and blockchain technology to create innovative financial solutions for underserved communities.",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
       <>
        {children}
        <Analytics />
       </>
  )
}
