import React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import "@/app/globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebarWrapper from "@/components/admin/app-sidebar-wrapper"
import { AdminAccessGuard } from "@/components/admin/admin-access-guard"

const _geistSans = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Admin Dashboard | Pollen AI",
  description: "Manage content for blog, services, innovations, and testimonials",
}

function AdminHeaderActions() {
  return (
    <div className="flex items-center gap-4 ml-auto ">
      <div className="hidden md:flex items-center px-3 py-2 bg-background/50 border border-border/40 rounded-lg hover:bg-background/70 transition-colors">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" placeholder="Search..." className="ml-2 bg-transparent outline-none text-sm placeholder-muted-foreground w-40" />
      </div>
      <button className="relative p-2 hover:bg-background/50 rounded-lg transition-colors">
        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 2 010-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
      </button>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary cursor-pointer hover:shadow-lg transition-all"></div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAccessGuard>
      <div className={`${_geistSans.className} bg-background text-foreground min-h-screen`}>
        <SidebarProvider>
          <AppSidebarWrapper />
          <div className="flex-1 flex flex-col w-full">
            <header className="border-b border-border/40 bg-gradient-to-r from-background/95 to-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex h-16 items-center justify-between px-6 gap-4">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                </div>
                <AdminHeaderActions />
              </div>
            </header>
            <main className="flex-1 bg-gradient-to-br from-background via-background to-background/50">{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </AdminAccessGuard>
  )
}
