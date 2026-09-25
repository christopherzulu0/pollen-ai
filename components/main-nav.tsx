"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart2, CreditCard, LayoutDashboard, Menu, PiggyBank, Settings, Users, Wallet, X } from "lucide-react"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const routes = [
    {
      href: "/views",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/views/user",
    },
    {
      href: "/views/user/wallet",
      label: "Wallet",
      icon: Wallet,
      active: pathname === "/views/user/wallet",
    },
    {
      href: "/views/user/loans",
      label: "Loans",
      icon: CreditCard,
      active: pathname === "/views/user/loans",
    },
    {
      href: "/views/user/village-banking",
      label: "Village Banking",
      icon: Users,
      active: pathname === "/views/user/village-banking",
    },
    // {
    //   href: "/views/user/savings",
    //   label: "Savings",
    //   icon: PiggyBank,
    //   active: pathname === "/views/user/savings",
    // },
    // {
    //   href: "/views/user/analytics",
    //   label: "Analytics",
    //   icon: BarChart2,
    //   active: pathname === "/views/user/analytics",
    // },
    // {
    //   href: "/views/user/settings",
    //   label: "Settings",
    //   icon: Settings,
    //   active: pathname === "/settings",
    // },
  ]

  return (
    <div className="flex items-center">
      <Link href="/views" className="mr-6 flex items-center  space-x-2">
        <span className="hidden font-medium sm:inline-block text-muted-foreground">John Doe</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <route.icon className="mr-2 h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white dark:bg-slate-950 shadow-lg md:hidden">
          <nav className="grid gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent",
                  route.active 
                    ? "bg-accent text-accent-foreground" 
                    : "text-foreground hover:text-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <route.icon className="mr-2 h-5 w-5" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

