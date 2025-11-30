"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

interface GroupsErrorProps {
  error: Error
  reset: () => void
}

export function GroupsError({ error, reset }: GroupsErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-12 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Groups</h2>
        
        <p className="text-muted-foreground mb-1">
          We couldn't load the savings groups. This might be a temporary issue.
        </p>
        
        {error.message && (
          <p className="text-sm text-muted-foreground/80 mb-6 font-mono bg-muted/50 p-2 rounded">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="rounded-lg"
            size="lg"
          >
            <RefreshCcw className="mr-2 size-4" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = "/dashboard"}
            className="rounded-lg"
            size="lg"
          >
            Go to Dashboard
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please contact support or check your internet connection.
          </p>
        </div>
      </div>
    </div>
  )
}

