"use client"

import { useState, useEffect } from "react"
import { Mic, Globe, Loader2, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Widget from "@/components/voice/Widget"
import { VoiceNavigator } from "@/components/voice/voice-navigator"
import { useLanguage } from "@/contexts/LanguageContext"

export default function BottomNavigator() {
  const { language, languages, isTranslating, handleLanguageChange, isDropdownOpen, setIsDropdownOpen } = useLanguage()
  const [showWidget, setShowWidget] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [isMounted, setIsMounted] = useState(false)

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
    <div className="fixed bottom-0 left-0 z-50 w-full px-4 pb-4 md:px-8 md:pb-2">
      <div className="relative bg-card/95 backdrop-blur-2xl border border-border shadow-2xl overflow-hidden rounded-3xl md:rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(76,78,251,0.08),transparent_50%)] pointer-events-none" />

        <div className="absolute inset-0 opacity-30 dark:opacity-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-4 md:px-6 md:py-5">
          {/* Left Section - Meeting Info */}
          <div className="items-center justify-center hidden text-foreground me-auto md:flex">
            {isMounted && (
              <div className="flex items-center space-x-3 px-5 py-3 rounded-full bg-muted/90 border border-border shadow-lg backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_2px_rgba(16,185,129,0.4)]" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <span className="text-sm font-bold text-foreground" suppressHydrationWarning>
                  {currentTime}
                </span>
                <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span className="text-sm font-semibold text-foreground">Pollen Daily Standup</span>
              </div>
            )}
          </div>

          {/* Center Section - Main Controls */}
          <div className="flex items-center justify-center mx-auto gap-4 md:gap-5">
            {isMounted && (
              <TooltipProvider delayDuration={200}>
                {/* Voice Navigator Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 group">
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative rounded-full h-16 w-16 md:h-[4.5rem] md:w-[4.5rem] bg-gradient-to-br from-[#5D5FFC] via-[#4C4EFB] to-[#3D3ECC] text-white hover:from-[#6E70FD] hover:via-[#5D5FFC] hover:to-[#4C4EFB] border-0 shadow-[0_8px_32px_-4px_rgba(76,78,251,0.5)] hover:shadow-[0_12px_40px_-4px_rgba(76,78,251,0.6)] transition-all duration-300 hover:scale-110 active:scale-95"
                        onClick={handleVoiceClick}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Mic className="h-6 w-6 md:h-7 md:w-7 relative z-10 drop-shadow-lg" />
                        <span className="sr-only">Voice Navigator</span>
                      </Button>
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors duration-300">
                        Voice
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border-border shadow-2xl font-semibold px-4 py-2">
                    <p>Voice Navigator</p>
                  </TooltipContent>
                </Tooltip>

                {/* AI Chat Widget Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center gap-2 group">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`relative rounded-full h-16 w-16 md:h-[4.5rem] md:w-[4.5rem] border-[3px] transition-all duration-300 hover:scale-110 active:scale-95 ${
                          showWidget
                            ? "bg-gradient-to-br from-primary via-primary to-primary/90 border-primary text-primary-foreground shadow-lg"
                            : "bg-card border-border hover:border-primary shadow-md hover:shadow-lg"
                        }`}
                        onClick={() => setShowWidget(!showWidget)}
                      >
                        <div
                          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${showWidget ? "bg-gradient-to-tr from-white/30 via-transparent to-transparent opacity-100" : "bg-muted/50 opacity-0 group-hover:opacity-100"}`}
                        />
                        <MessageCircle
                          className={`h-6 w-6 md:h-7 md:w-7 relative z-10 transition-all duration-300 ${showWidget ? "text-primary-foreground drop-shadow-lg" : "text-foreground group-hover:text-primary"}`}
                        />
                        <span className="sr-only">AI Assistant</span>
                      </Button>
                      <span
                        className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${showWidget ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                      >
                        AI Chat
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border-border shadow-2xl font-semibold px-4 py-2">
                    <p>AI Chat Assistant</p>
                  </TooltipContent>
                </Tooltip>

                {/* Language Switcher */}
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-2 group">
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="relative rounded-full h-16 md:h-[4.5rem] px-5 md:px-6 bg-card border-[3px] border-border hover:border-primary shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <div className="absolute inset-0 rounded-full bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Globe className="h-5 w-5 md:h-6 md:w-6 mr-2.5 text-foreground group-hover:text-primary relative z-10 transition-colors duration-300" />
                            <span className="text-sm md:text-base font-bold text-foreground relative z-10">
                              {languages.find((l) => l.code === language)?.name.substring(0, 3)}
                            </span>
                            {isTranslating ? (
                              <Loader2 className="h-4 w-4 md:h-5 md:w-5 ml-2.5 animate-spin text-primary relative z-10" />
                            ) : (
                              <ChevronDown className="h-4 w-4 md:h-5 md:w-5 ml-2.5 text-muted-foreground group-hover:text-primary relative z-10 transition-colors duration-300" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors duration-300">
                          Language
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground border-border shadow-2xl font-semibold px-4 py-2">
                      <p>Change Language</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-popover/98 backdrop-blur-2xl border-border shadow-2xl rounded-2xl p-1.5"
                  >
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`cursor-pointer rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          language === lang.code
                            ? "bg-primary/15 text-primary font-bold shadow-sm"
                            : "hover:bg-accent text-foreground font-medium"
                        }`}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>
            )}
          </div>

          {/* Right Section - Empty for balance */}
          <div className="items-center justify-center hidden ms-auto md:flex">
            {/* Placeholder for visual balance */}
          </div>
        </div>
      </div>

      {/* Voice Navigator - Hidden button, triggered from BottomNavigator */}
      <div className="voice-navigator-wrapper [&_button]:!hidden">
        <VoiceNavigator />
      </div>

      {/* Widget - Conditional Render */}
      {showWidget && <Widget onClose={() => setShowWidget(false)} />}
    </div>
  )
}
