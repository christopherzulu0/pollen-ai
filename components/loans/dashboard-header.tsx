"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Bell,
  ChevronDown,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  PlusCircle,
  Search,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import {ThemeProvider} from "@/components/theme-provider";

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mock data - in a real app, fetch from API
  const currentUser = {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "Group Admin",
  }

  const notifications = [
    {
      id: 1,
      title: "New loan request",
      message: "John Doe requested a loan of $1,000",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment received",
      message: "Robert Johnson made a payment of $350",
      time: "2 hours ago",
      unread: true,
    },
    { id: 3, title: "Vote reminder", message: "3 loan requests need your vote", time: "Yesterday", unread: false },
  ]

  const groups = [
    { id: "group1", name: "Savings Group A", active: true },
    { id: "group2", name: "Investment Club B", active: false },
    { id: "group3", name: "Community Cooperative", active: false },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-200",
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-14 md:h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden text-slate-700 dark:text-slate-200">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="pr-0 w-[280px] sm:w-[350px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
            >
              <SheetHeader className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle>Menu</SheetTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>
              <div className="grid gap-2 py-4">
                {groups.map((group) => (
                  <Link
                    key={group.id}
                    href="#"
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      group.active
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="h-4 w-4" />
                    {group.name}
                    {group.active && (
                      <Badge
                        variant="outline"
                        className="ml-auto border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      >
                        Active
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="grid gap-2">
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create New Group
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </Link>
                  <div
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <div className="flex items-center gap-2">
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg md:text-xl hidden md:inline-block text-slate-900 dark:text-white">
              CoopFund
            </span>
          </Link>

          <div className="hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 group text-slate-700 dark:text-slate-300">
                  <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    Savings Group A
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Your Groups</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {groups.map((group) => (
                  <DropdownMenuItem key={group.id} className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{group.name}</span>
                    {group.active && (
                      <Badge
                        variant="outline"
                        className="ml-auto border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      >
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Create New Group</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
          <div
            className={cn(
              "relative w-full max-w-sm transition-all duration-200",
              isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto",
            )}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="search"
              placeholder="Search members, loans..."
              className="w-full rounded-full bg-white dark:bg-slate-800 pl-8 md:w-[240px] lg:w-[280px] border-slate-200 dark:border-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
            />
          </div>

          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              <span className="sr-only">Search</span>
            </Button>
            <Link href="#">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
            <Link href="#">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter((n) => n.unread).length > 0 && (
                    <span className="absolute right-1 top-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 dark:bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900 dark:bg-white"></span>
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal">
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-0">
                        <div
                          className={cn(
                            "flex w-full cursor-pointer gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
                            notification.unread && "bg-slate-50 dark:bg-slate-800/50",
                          )}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Bell className="h-4 w-4 text-slate-900 dark:text-white" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{notification.title}</p>
                              {notification.unread && (
                                <span className="flex h-2 w-2 rounded-full bg-slate-900 dark:bg-white"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer justify-center text-center">
                      View all notifications
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Bell className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No notifications yet</p>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-slate-200 dark:border-slate-700">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
                    {currentUser.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-slate-700 dark:text-slate-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            <span className="sr-only">Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative text-slate-700 dark:text-slate-200">
                <Bell className="h-5 w-5" />
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute right-1 top-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 dark:bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900 dark:bg-white"></span>
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-normal">
                  Mark all as read
                </Button>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-0">
                  <div
                    className={cn(
                      "flex w-full cursor-pointer gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800",
                      notification.unread && "bg-slate-50 dark:bg-slate-800/50",
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <Bell className="h-4 w-4 text-slate-900 dark:text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{notification.title}</p>
                        {notification.unread && (
                          <span className="flex h-2 w-2 rounded-full bg-slate-900 dark:bg-white"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="rounded-full text-slate-700 dark:text-slate-200">
            <Avatar className="h-8 w-8 border-2 border-slate-200 dark:border-slate-700">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
              <AvatarFallback className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
                {currentUser.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>

      {/* Mobile search overlay */}
      <div
        className={cn(
          "absolute top-14 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 md:hidden transition-all duration-200 z-50",
          isSearchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none",
        )}
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
          <Input
            type="search"
            placeholder="Search members, loans..."
            className="w-full pl-8 border-slate-200 dark:border-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
            autoFocus={isSearchOpen}
          />
        </div>
      </div>
    </header>
  )
}
