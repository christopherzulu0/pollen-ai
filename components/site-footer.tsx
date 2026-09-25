import type React from "react"
import { cn } from "@/lib/utils"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ by CryptoFinance. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CryptoFinance</p>
        </div>
      </div>
    </footer>
  )
}

