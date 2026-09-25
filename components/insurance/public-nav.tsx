"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function PublicNav() {
  const { t } = useLanguage()
  const copy = t.insurance
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/insurance" className="flex items-center gap-2 font-semibold text-lg">
            <Shield className="h-6 w-6 text-primary" />
            <span>{copy.brand}</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copy.products}
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copy.how_it_works}
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copy.about}
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {copy.contact}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/member">{copy.log_in}</Link>
            </Button>
            <Button asChild>
              <Link href="/kyc/submit">{copy.get_started}</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
