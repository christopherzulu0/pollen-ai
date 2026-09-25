"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface GroupsErrorProps {
  error: Error
  reset: () => void
}

export function GroupsError({ error, reset }: GroupsErrorProps) {
  const { t } = useLanguage()
  const g = t.groups
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-12 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">{g.load_failed_title}</h2>
        
        <p className="text-muted-foreground mb-1">
          {g.load_failed_body}
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
            {g.try_again_button}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = "/dashboard"}
            className="rounded-lg"
            size="lg"
          >
            {g.go_dashboard}
          </Button>
        </div>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {g.persist_help}
          </p>
        </div>
      </div>
    </div>
  )
}

