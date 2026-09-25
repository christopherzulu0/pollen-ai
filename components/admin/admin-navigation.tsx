"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, Briefcase, Lightbulb, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AdminNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutGrid },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Innovations", href: "/admin/innovations", icon: Lightbulb },
    { name: "Testimonials", href: "/admin/testimonials", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative w-64 h-screen bg-primary text-white p-6 transition-transform duration-300 md:translate-x-0 z-40",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Pollen AI</h1>
          <p className="text-sm text-white/70">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive ? "bg-accent text-primary font-semibold" : "text-white/80 hover:bg-white/10",
                  )}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button variant="outline" className="w-full text-white border-white/30 hover:bg-white/10">
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
