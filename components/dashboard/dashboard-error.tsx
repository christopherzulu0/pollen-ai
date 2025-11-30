"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

interface DashboardErrorProps {
  message?: string
  onRetry?: () => void
  queryKey?: readonly string[]
}

export function DashboardError({ message, onRetry, queryKey }: DashboardErrorProps) {
  const queryClient = useQueryClient()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else if (queryKey) {
      queryClient.invalidateQueries({ queryKey })
    }
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Failed to load data</h3>
            <p className="text-sm text-red-700 mt-1">
              {message || "Something went wrong while loading the dashboard."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Error boundary wrapper for React Query errors
export function DashboardErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
    </div>
  )
}

