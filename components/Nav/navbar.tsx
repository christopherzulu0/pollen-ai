"use client"

import React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { Menu, X, Home, Info, Briefcase, Users, BookOpen, FileCheck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { SignedOut, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"

// Navigation links configuration
const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/services", label: "Services", icon: Briefcase },
  { href: "/Groups", label: "Groups", icon: Users },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/kyc/submit", label: "KYC Submissions", icon: FileCheck },
  { href: "/contact", label: "Contact", icon: Mail },
]

// Desktop nav link component
const NavLink = ({ href, label, isScrolled }: { href: string; label: string; isScrolled: boolean }) => (
  <Link
    href={href}
    className={`px-3 lg:px-4 py-2 rounded-full text-sm font-medium transition-colors ${isScrolled
      ? "text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white"
      : "text-white/80 hover:text-white"
      }`}
  >
    {label}
  </Link>
)

// Mobile nav item component
const MobileNavItem = ({ href, label, icon: Icon, onClose }: { href: string; label: string; icon: React.ReactNode; onClose: () => void }) => (
  <Link
    href={href}
    className="text-lg font-medium p-3 text-white hover:bg-white/10 rounded-xl flex items-center transition-colors"
    onClick={onClose}
  >
    <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
      {Icon}
    </span>
    {label}
  </Link>
)

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [userRole, setUserRole] = useState<string | undefined>(undefined)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { user, isLoaded } = useUser()

  // Hydration fix
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Extract user role and organizations
  useEffect(() => {
    if (isLoaded && user?.organizationMemberships && user.organizationMemberships.length > 0) {
      const primaryOrg = user.organizationMemberships[0]
      setUserRole(primaryOrg?.role)
    }
  }, [isLoaded, user])

  // Handle scroll with optimized listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Memoized callbacks
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const handleGetStarted = useCallback(() => {
    router.push('/sign-in')
  }, [router])

  const handleDashboardClick = useCallback(() => {
    if (userRole === 'org:admin' || userRole === 'admin') {
      router.push('/Super-user')
    } else if (userRole === 'org:member' || userRole === 'member') {
      router.push('/dashboard')
    }
  }, [userRole, router])

  const handleRequestAccess = useCallback(() => {
    alert('Access request submitted. An administrator will review your request.')
  }, [])

  // Computed values
  const isAuthorized = useMemo(() =>
    ['org:admin', 'admin', 'org:member', 'member'].includes(userRole || ''),
    [userRole]
  )

  const isAdmin = useMemo(() =>
    ['org:admin', 'admin'].includes(userRole || ''),
    [userRole]
  )

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <header
      className={`sticky top-0 z-100 w-full transition-all duration-300 ${isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <PollenLogo size={42} className="group-hover:scale-110 transition-transform duration-300" />
            <span
              className={`text-2xl font-black tracking-tight transition-colors ${isScrolled ? "text-gray-900 dark:text-white" : "text-white"
                }`}
            >
              Pollen<span className="text-[#4C4EFB]">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} isScrolled={isScrolled} />
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isMounted && isLoaded ? (
              <>
                <SignedOut>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-[#00CC66] hover:bg-[#00BB55] text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#00CC66]/30"
                  >
                    Get Started
                  </Button>
                </SignedOut>

                <SignedIn>
                  {isAuthorized ? (
                    <Button
                      onClick={handleDashboardClick}
                      className={`rounded-full transition-all duration-300 font-semibold ${isScrolled
                        ? "bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 text-white"
                        : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                        }`}
                    >
                      {isAdmin ? "📊 Admin" : "📈 Dashboard"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRequestAccess}
                      className={`rounded-full transition-all duration-300 font-semibold ${isScrolled
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                        : "bg-yellow-400/80 hover:bg-yellow-500/90 text-white backdrop-blur-sm"
                        }`}
                    >
                      🔐 Request Access
                    </Button>
                  )}

                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10 rounded-full",
                      },
                    }}
                    showName={false}
                  />
                </SignedIn>
              </>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className={`transition-colors ${isScrolled ? "text-[#003366] dark:text-white" : "text-white"
                }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-20 bg-linear-to-br from-[#003366] to-[#002244] dark:bg-linear-to-br dark:from-gray-900 dark:to-gray-950 z-50 p-4 overflow-y-auto max-h-[calc(100vh-80px)] animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <MobileNavItem key={href} href={href} label={label} icon={icon && <icon.render />} onClose={closeMenu} />
            ))}

            <div className="border-b border-white/10 my-3" />

            <div className="pt-2 space-y-2">
              {isMounted && isLoaded ? (
                <>
                  <SignedOut>
                    <Button
                      onClick={() => {
                        handleGetStarted()
                        closeMenu()
                      }}
                      className="bg-[#00CC66] hover:bg-[#00BB55] text-white w-full rounded-xl py-6 text-base shadow-lg transition-all"
                    >
                      Get Started
                    </Button>
                  </SignedOut>

                  <SignedIn>
                    {isAuthorized ? (
                      <Button
                        onClick={() => {
                          handleDashboardClick()
                          closeMenu()
                        }}
                        className="w-full bg-[#4C4EFB] hover:bg-[#4C4EFB]/90 text-white rounded-xl py-3 font-bold text-base transition-all shadow-lg"
                      >
                        {isAdmin ? "📊 Admin Dashboard" : "📈 Dashboard"}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleRequestAccess()
                          closeMenu()
                        }}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl py-3 font-bold text-base transition-all shadow-lg"
                      >
                        🔐 Request Access
                      </Button>
                    )}

                    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <span className="font-medium text-gray-900 dark:text-white">Account</span>
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "h-10 w-10 rounded-full",
                          },
                        }}
                        showName={false}
                      />
                    </div>
                  </SignedIn>
                </>
              ) : (
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
