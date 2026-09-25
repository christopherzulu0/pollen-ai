"use client"

import { useState, useEffect } from "react"
import { Bell, Menu, LogOut, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import WalletConnectButton from "../celo/wallet-connect-button"
import { useLanguage, type Language } from "@/contexts/LanguageContext"

interface MemberHeaderProps {
  onMenuClick: () => void
}

export function MemberHeader({ onMenuClick }: MemberHeaderProps) {
  const [mounted, setMounted] = useState(false)
  const { language, languages, handleLanguageChange, t } = useLanguage()
  const selectedLanguageShort = languages.find((item) => item.code === language)?.name.substring(0, 3) ?? "Lan"

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t.member.header.title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full h-9 px-3">
                <Globe className="h-4 w-4 mr-1.5" />
                <span className="text-xs font-semibold">{selectedLanguageShort}</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code as Language)}
                  className={language === lang.code ? "bg-primary/15 text-primary font-semibold" : ""}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <WalletConnectButton/>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {mounted && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="/thoughtful-man-in-library.png" alt="Member" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-foreground">Alice Johnson</p>
                  <p className="text-xs text-muted-foreground">alice@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t.member.header.profileSettings}</DropdownMenuItem>
              <DropdownMenuItem>{t.member.header.myGroups}</DropdownMenuItem>
              <DropdownMenuItem>{t.member.header.wallet}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                {t.member.header.logOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!mounted && (
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src="/thoughtful-man-in-library.png" alt="Member" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </div>
    </header>
  )
}
