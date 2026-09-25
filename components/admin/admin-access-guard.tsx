"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"

interface AdminAccessGuardProps {
  children: ReactNode
}

export function AdminAccessGuard({ children }: AdminAccessGuardProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (!isLoaded) return

    // Check if user is authenticated
    if (!user) {
      router.push("/sign-in")
      return
    }

    // Get user's organizations and roles
    if (user?.organizationMemberships && user.organizationMemberships.length > 0) {
      // Check if user has admin role in any organization
      const hasAdminRole = user.organizationMemberships.some((org) => {
        const role = org.role
        return role === "org:admin" || role === "admin" || role?.includes("admin")
      })

      if (hasAdminRole) {
        setIsAuthorized(true)
        console.log("✅ User has admin role")
      } else {
        console.log("❌ User does not have admin role")
        setIsAuthorized(false)
      }
    } else {
      console.log("❌ User does not belong to any organization")
      setIsAuthorized(false)
    }

    setIsCheckingAuth(false)
  }, [isLoaded, user, router])

  // Show loading state
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Checking access...</p>
        </div>
      </div>
    )
  }

  // Show access denied message
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
                <ShieldX className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">Access Denied</CardTitle>
            <CardDescription className="text-base mt-2">
              You do not have permission to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your organization role must be <strong>Admin</strong> to access the admin dashboard.
            </p>
            {user?.organizationMemberships && user.organizationMemberships.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your current role: <strong>{user.organizationMemberships[0]?.role || 'None'}</strong>
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contact your organization administrator to request admin access.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="flex-1"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Contact Administrator
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authorized, render children
  return <>{children}</>
}

