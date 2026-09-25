"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, CreditCard, Home, PlusCircle, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [activeItem, setActiveItem] = useState("dashboard")

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "#" },
    { id: "loans", label: "Loans", icon: CreditCard, href: "#" },
    { id: "new", label: "New", icon: PlusCircle, href: "#" },
    { id: "members", label: "Members", icon: Users, href: "#" },
    { id: "reports", label: "Reports", icon: BarChart3, href: "#" },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-1 hover:bg-muted/50 transition-colors",
              activeItem === item.id && "text-primary",
            )}
            onClick={() => setActiveItem(item.id)}
          >
            <item.icon
              className={cn(
                "w-5 h-5 mb-1",
                item.id === "new" && "text-white bg-primary rounded-full p-0.5",
                activeItem === item.id && item.id !== "new" && "text-primary",
              )}
            />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
