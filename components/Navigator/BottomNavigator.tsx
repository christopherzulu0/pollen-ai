"use client"

import { useState, useEffect } from "react"
import { Mic, Globe, Loader2, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Widget from "@/components/voice/Widget"
import { VoiceNavigator } from "@/components/voice/voice-navigator"
import { useLanguage } from "@/contexts/LanguageContext"
import { usePathname } from "next/navigation"

export default function BottomNavigator() {
  const { language, languages, isTranslating, handleLanguageChange, isDropdownOpen, setIsDropdownOpen } = useLanguage()
  const [showWidget, setShowWidget] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const handleVoiceClick = () => {
    // Trigger the VoiceNavigator button click programmatically
    const voiceButton = document.querySelector(
      '[aria-label="Start voice navigation"], [aria-label="Stop listening"]',
    ) as HTMLButtonElement
    if (voiceButton) {
      voiceButton.click()
    }
  }

  useEffect(() => {
    setIsMounted(true)
    const updateTime = () => {
      const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      setCurrentTime(timeString)
    }
    updateTime()
    const intervalId = setInterval(updateTime, 60000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-screen-xl mx-auto px-4 pb-3 md:pb-4">
          <div className="pointer-events-auto relative bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl overflow-hidden rounded-2xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-3 px-3 py-2.5 md:px-4 md:py-3">
              {/* Left Section - Meeting Info (Desktop only) */}
              <div className="hidden lg:flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40">
                {isMounted && (
                  <>
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_1px_rgba(16,185,129,0.3)]" />
                    </div>
                    <span className="text-xs font-semibold text-foreground" suppressHydrationWarning>
                      {currentTime}
                    </span>
                    <div className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
                    <span className="text-xs font-medium text-muted-foreground">Pollen Daily</span>
                  </>
                )}
              </div>

              {/* Center Section - Main Controls */}
              <div className="flex items-center justify-center gap-2 md:gap-3 mx-auto lg:mx-0">
                {isMounted && (
                  <TooltipProvider delayDuration={200}>
                    {/* Voice Navigator Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="relative rounded-full h-11 w-11 md:h-12 md:w-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white hover:opacity-90 hover:brightness-110 border-0 shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                          onClick={handleVoiceClick}
                        >
                          <Mic className="h-5 w-5 md:h-5.5 md:w-5.5" />
                          <span className="sr-only">Voice Navigator</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="mb-2">
                        <p>Voice Navigator</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* AI Chat Widget Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className={`relative rounded-full h-11 w-11 md:h-12 md:w-12 border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                            showWidget
                              ? "bg-primary border-primary text-primary-foreground shadow-lg"
                              : "bg-card/80 border-border hover:bg-accent hover:border-accent shadow-md hover:shadow-lg"
                          }`}
                          onClick={() => setShowWidget(!showWidget)}
                        >
                          <MessageCircle
                            className={`h-5 w-5 md:h-5.5 md:w-5.5 transition-colors ${showWidget ? "text-primary-foreground" : "text-foreground"}`}
                          />
                          <span className="sr-only">AI Assistant</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="mb-2">
                        <p>AI Chat Assistant</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Language Switcher - Only visible on home page */}
                    {isHomePage && (
                      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="relative rounded-full h-11 md:h-12 px-3 md:px-4 bg-card/80 border-2 border-border hover:bg-accent hover:border-accent shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                              >
                                <Globe className="h-4 w-4 md:h-5 md:w-5 mr-1.5 text-foreground" />
                                <span className="text-xs md:text-sm font-semibold text-foreground">
                                  {languages.find((l) => l.code === language)?.name.substring(0, 3)}
                                </span>
                                {isTranslating ? (
                                  <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 ml-1.5 animate-spin text-primary" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 ml-1.5 text-muted-foreground" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="mb-2">
                            <p>Change Language</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent
                          align="end"
                          side="top"
                          className="w-44 bg-popover/95 backdrop-blur-xl border-border shadow-xl rounded-xl p-1 mb-2"
                        >
                          {languages.map((lang) => (
                            <DropdownMenuItem
                              key={lang.code}
                              onClick={() => handleLanguageChange(lang.code)}
                              className={`cursor-pointer rounded-lg px-3 py-2 transition-all duration-150 ${
                                language === lang.code
                                  ? "bg-primary/15 text-primary font-semibold"
                                  : "hover:bg-accent text-foreground font-medium"
                              }`}
                            >
                              {lang.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TooltipProvider>
                )}
              </div>

              {/* Right Section - Spacer for balance on desktop */}
              <div className="hidden lg:block w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Voice Navigator - Hidden button, triggered from BottomNavigator */}
      <div className="voice-navigator-wrapper [&_button]:!hidden">
        <VoiceNavigator />
      </div>

      {/* Widget - Conditional Render */}
      {showWidget && <Widget onClose={() => setShowWidget(false)} />}
    </>
  )
}
