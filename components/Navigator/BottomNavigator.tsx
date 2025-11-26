"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Video, VideoOff, Share, Settings, MoreVertical, Users, Volume2, Info, PhoneOff, Globe, Loader2, ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Widget from "@/components/voice/Widget"
import { VoiceNavigator } from "@/components/voice/voice-navigator"
import { useLanguage } from "@/contexts/LanguageContext"

export default function BottomNavigator() {
    const { language, languages, isTranslating, handleLanguageChange, isDropdownOpen, setIsDropdownOpen } = useLanguage()
    const [showWidget, setShowWidget] = useState(false)
    const [currentTime, setCurrentTime] = useState("")

    const handleVoiceClick = () => {
        // Trigger the VoiceNavigator button click programmatically
        const voiceButton = document.querySelector('[aria-label="Start voice navigation"], [aria-label="Stop listening"]') as HTMLButtonElement
        if (voiceButton) {
            voiceButton.click()
        }
    }

    useEffect(() => {
        const updateTime = () => {
            const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            setCurrentTime(timeString)
        }

        updateTime()
        const intervalId = setInterval(updateTime, 60000)
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="fixed bottom-0 left-0 z-50 grid w-full  grid-cols-1 px-8 bg-white dark:bg-gray-900 backdrop-blur border-t border-border md:grid-cols-3 rounded-t-2xl overflow-hidden">
            <div className="items-center justify-center hidden text-foreground me-auto md:flex">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium">{currentTime}</span>
                    <span className="text-xs text-muted-foreground">|</span>
                    <span className="text-sm font-medium">Pollen Daily Standup</span>
                </div>
            </div>

            <div className="flex items-center justify-center mx-auto flex-wrap gap-4">
                <TooltipProvider>
                    {/* Voice Navigator Button - Replaces Mic */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="rounded-full h-12 w-12 bg-[#4C4EFB] text-white hover:bg-[#4C4EFB]/90 border-border transition-all duration-300"
                                    onClick={handleVoiceClick}
                                >
                                    <Mic className="h-5 w-5" />
                                    <span className="sr-only">Voice Navigator</span>
                                </Button>
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground md:text-xs">Voice</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Voice Navigator</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* AI Chat Widget Button - Replaces Video */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-1">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className={`rounded-full h-12 w-12 ${showWidget ? 'bg-[#4C4EFB] text-white hover:bg-[#4C4EFB]/90' : 'bg-background hover:bg-muted'} border-border transition-all duration-300`}
                                    onClick={() => setShowWidget(!showWidget)}
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span className="sr-only">AI Assistant</span>
                                </Button>
                                <span className="text-[10px] uppercase tracking-wide text-muted-foreground md:text-xs">AI Chat</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>AI Chat Assistant</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-background hover:bg-muted border-border">
                                <Share className="h-5 w-5" />
                                <span className="sr-only">Share screen</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Share screen</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" size="icon" className="rounded-full h-14 w-14 shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                                <PhoneOff className="h-6 w-6" />
                                <span className="sr-only">End call</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>End call</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-background hover:bg-muted border-border">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Settings</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-background hover:bg-muted border-border">
                                <MoreVertical className="h-5 w-5" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Show participants</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Volume2 className="mr-2 h-4 w-4" />
                                <span>Adjust volume</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Info className="mr-2 h-4 w-4" />
                                <span>Show information</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}


                     {/* Language Switcher */}
                     <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-1">
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full hover:bg-muted px-3"
                                        >
                                            <Globe className="h-4 w-4 mr-2" />
                                            <span className="text-sm font-medium">{languages.find(l => l.code === language)?.name.substring(0, 3)}</span>
                                            {isTranslating ? (
                                                <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 ml-2" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground md:text-xs">Language</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Change Language</p>
                            </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-48">
                            {languages.map((lang) => (
                                <DropdownMenuItem
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={language === lang.code ? "bg-accent" : ""}
                                >
                                    {lang.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipProvider>
            </div>

            <div className="items-center justify-center hidden ms-auto md:flex space-x-2">
                {/* <TooltipProvider> */}
                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                                <Users className="h-5 w-5" />
                                <span className="sr-only">Participants</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Participants</p>
                        </TooltipContent>
                    </Tooltip> */}

                    {/* <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                                <Info className="h-5 w-5" />
                                <span className="sr-only">Info</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Meeting Info</p>
                        </TooltipContent>
                    </Tooltip> */}

                   
                {/* </TooltipProvider> */}
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