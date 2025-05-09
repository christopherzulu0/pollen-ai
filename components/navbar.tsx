"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { SignIn } from "@clerk/nextjs"



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleGetStarted = () => {
    router.push('/sign-in')
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#00CC66] flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <span className={`text-2xl font-bold ${isScrolled ? "text-[#003366] dark:text-white" : "text-white"}`}>
                Pollen 
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white"
                  : "text-white/80 hover:text-white"
              } transition-colors`}
            >
              Home
            </Link>

            <button
              onClick={()=>router.push('/about')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white"
                  : "text-white/80 hover:text-white"
              } transition-colors`}
            >
              About
            </button>

            <button
              onClick={() => router.push('/services')}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white"
                  : "text-white/80 hover:text-white"
              } transition-colors`}
            >
              Services
            </button>

            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white"
                  : "text-white/80 hover:text-white"
              } transition-colors`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-[#003366] dark:hover:text-white"
                  : "text-white/80 hover:text-white"
              } transition-colors`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {/* <ThemeToggle /> */}
            <Button 
            onClick={handleGetStarted}
            className="bg-[#00CC66] hover:bg-[#00BB55] text-white rounded-full transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg hover:shadow-[#00CC66]/20">
              Get Started
            </Button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            {/* <ThemeToggle /> */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              className={isScrolled ? "text-[#003366] dark:text-white" : "text-white"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-white dark:bg-gray-900 z-50 p-6 overflow-y-auto">
          <nav className="flex flex-col space-y-6">
            <Link
              href="/"
              className="text-lg font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#003366] dark:text-[#00CC66]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
              Home
            </Link>

            <div className="border-b border-gray-100 dark:border-gray-800 py-2"></div>

            <Link
              href="/about"
              className="text-lg font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#003366] dark:text-[#00CC66]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              About
            </Link>

            <Link
              href="/services"
              className="text-lg font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#003366] dark:text-[#00CC66]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Services
            </Link>

            <Link
              href="/blog"
              className="text-lg font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#003366] dark:text-[#00CC66]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                    clipRule="evenodd"
                  />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
              </span>
              Blog
            </Link>

            <Link
              href="/contact"
              className="text-lg font-medium p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="w-10 h-10 rounded-full bg-[#003366]/10 dark:bg-[#003366]/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#003366] dark:text-[#00CC66]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              Contact
            </Link>

            <div className="pt-6">
              <Button
              onClick={handleGetStarted}
              className="bg-[#00CC66] hover:bg-[#00BB55] text-white w-full rounded-xl py-6 text-lg shadow-lg">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

