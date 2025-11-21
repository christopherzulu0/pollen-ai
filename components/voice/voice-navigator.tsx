"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Mic, MicOff, Loader2, Volume2, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type CommandResponse = {
  action: string
  target?: string | null
  message?: string | null
  confidence?: number
  source?: string
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null
  onaudiostart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
  onsoundstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
  onspeechstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
  onspeechend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
  onaudioend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export function VoiceNavigator() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasSupport, setHasSupport] = useState(true)
  const [audioDetected, setAudioDetected] = useState(false)
  const [speechDetected, setSpeechDetected] = useState(false)

  useEffect(() => {
    if (!SpeechRecognition) {
      setHasSupport(false)
    }
  }, [])

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setIsListening(false)
    setAudioDetected(false)
    setSpeechDetected(false)
  }, [])

  const handleAction = useCallback(
    (payload: CommandResponse) => {
      const action = payload.action
      const target = payload.target
      const message = payload.message

      switch (action) {
        case "navigate": {
          if (target) {
            router.push(target)
            toast.success(message ?? `Navigating to ${target}`)
          } else {
            toast.info("I couldn't determine where to navigate.")
          }
          break
        }
        case "back":
          router.back()
          toast.success(message ?? "Going back")
          break
        case "forward":
          router.forward()
          toast.success(message ?? "Going forward")
          break
        case "scroll": {
          if (target === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" })
          } else if (target === "bottom") {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
          } else if (target === "down") {
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
          } else {
            window.scrollBy({ top: -window.innerHeight / 1.5, behavior: "smooth" })
          }
          toast.success(message ?? "Scrolling")
          break
        }
        case "theme": {
          if (target === "light" || target === "dark") {
            setTheme(target)
          } else {
            setTheme(theme === "dark" ? "light" : "dark")
          }
          toast.success(message ?? "Theme updated")
          break
        }
        case "notify":
          toast(message ?? "Done!")
          break
        default:
          toast.info(message ?? "I couldn't understand that yet.")
      }
    },
    [router, setTheme, theme]
  )

  const processTranscript = useCallback(
    async (text: string) => {
      setIsProcessing(true)
      try {
        // Add timeout for the entire request (20 seconds)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 20000)

        const response = await fetch("/api/voice-commands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, pathname }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("Voice command API error:", errorData)
          
          // Show specific error message if available
          if (errorData.message) {
            toast.error(errorData.message)
          } else {
            toast.error("Failed to interpret command. Please try again.")
          }
          return
        }

        const data: CommandResponse = await response.json()
        
        // Check if the response indicates an unknown command
        if (data.action === "unknown") {
          toast.warning(data.message || "I couldn't understand that command. Try: 'Go to dashboard'")
          return
        }
        
        handleAction(data)
      } catch (error: any) {
        console.error("Voice command failed:", error)
        
        // Handle different types of errors
        if (error.name === 'AbortError') {
          toast.error("Command took too long. Please try a simpler phrase.")
        } else if (error.message?.includes('fetch')) {
          toast.error("Network error. Please check your connection.")
        } else {
          toast.error("Sorry, I couldn't process that command.")
        }
      } finally {
        setIsProcessing(false)
        setTranscript(null)
      }
    },
    [handleAction, pathname]
  )

  const startRecognition = useCallback(() => {
    if (!SpeechRecognition) {
      toast.error("Voice recognition isn't supported in this browser.")
      setHasSupport(false)
      return
    }

    if (isListening || isProcessing) return

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = true // Show interim results to help with detection
    recognition.maxAlternatives = 3 // Get multiple alternatives

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started - speak now!")
      setIsListening(true)
      setAudioDetected(false)
      setSpeechDetected(false)
      toast.info("Listening... Speak LOUD and CLEAR!", { duration: 3000 })
    }
    
    recognition.onaudiostart = () => {
      console.log("🔊 Audio capture started")
      setAudioDetected(true)
      toast.info("Microphone active - now speak!", { duration: 2000 })
    }
    
    recognition.onsoundstart = () => {
      console.log("🔉 Sound detected")
    }
    
    recognition.onspeechstart = () => {
      console.log("🗣️ Speech detected")
      setSpeechDetected(true)
      toast.success("Speech detected! Keep talking...", { duration: 2000 })
    }
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorType = event.error
      
      // Only log unexpected errors to console (not "no-speech" or "aborted" which are common/expected)
      if (errorType !== "no-speech" && errorType !== "aborted") {
        console.error("❌ Speech recognition error:", errorType, event)
      } else {
        console.log(`⚠️ ${errorType === "no-speech" ? "No speech detected" : "Recognition aborted"}`)
      }
      
      // Provide specific error messages based on error type
      switch (errorType) {
        case "not-allowed":
        case "service-not-allowed":
          toast.error("Microphone access denied. Please enable it in your browser settings.", {
            duration: 5000,
          })
          setHasSupport(false)
          break
        case "no-speech":
          toast.warning("No speech detected. Speak louder and try again!", {
            duration: 3000,
          })
          break
        case "audio-capture":
          toast.error("No microphone found. Please connect a microphone and try again.", {
            duration: 5000,
          })
          break
        case "network":
          toast.error("Network error. Please check your internet connection.", {
            duration: 4000,
          })
          break
        case "aborted":
          // User stopped listening, don't show error
          break
        default:
          toast.error(`Voice recognition error: ${errorType || "Unknown error"}`, {
            duration: 4000,
          })
      }
      
      stopRecognition()
    }
    
    recognition.onend = () => {
      console.log("🛑 Speech recognition ended")
      setIsListening(false)
      recognitionRef.current = null
    }
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Get the latest result
      const resultIndex = event.resultIndex
      const result = event.results[resultIndex]
      const text = result[0].transcript
      const confidence = result[0].confidence
      const isFinal = result.isFinal
      
      console.log(`${isFinal ? '✅' : '⏳'} ${isFinal ? 'Final' : 'Interim'} result: "${text}" (confidence: ${confidence})`)
      
      if (isFinal) {
        // Only process final results
        console.log(`🎯 Processing final transcript: "${text}"`)
        setTranscript(text)
        toast.success(`Heard: "${text}"`, { duration: 2000 })
        processTranscript(text)
      } else {
        // Show interim results in console for feedback
        console.log(`💬 You're saying: "${text}"...`)
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isListening, isProcessing, processTranscript, stopRecognition])

  useEffect(() => {
    return () => {
      stopRecognition()
    }
  }, [stopRecognition])

  const statusLabel = useMemo(() => {
    if (!hasSupport) return "Voice controls are unavailable in this browser."
    if (isProcessing) return "Processing command..."
    if (isListening) {
      if (speechDetected) return "🗣️ Speech detected! Keep talking..."
      if (audioDetected) return "🔊 Microphone active - speak now!"
      return "🎤 Listening... Speak LOUD!"
    }
    if (transcript) return `Heard: "${transcript}"`
    return "Voice navigation ready"

  }, [hasSupport, isListening, isProcessing, transcript, audioDetected, speechDetected])

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-6 md:left-auto md:right-28 lg:right-32 z-50">
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              disabled={!hasSupport}
              onClick={isListening ? stopRecognition : startRecognition}
              className={cn(
                "rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200",
                isListening ? "bg-red-500 hover:bg-red-600" : "bg-[#4C4EFB] hover:bg-[#4C4EFB]/90",
                !hasSupport && "opacity-60 cursor-not-allowed",
                isProcessing && "animate-pulse"
              )}
              aria-pressed={isListening}
              aria-label={isListening ? "Stop listening" : "Start voice navigation"}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : isListening ? (
                <MicOff className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 w-6 text-white" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            align="center"
            className="max-w-xs md:max-w-sm p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            sideOffset={10}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-base">
                <Volume2 className="h-4 w-4 text-[#4C4EFB]" />
                <span>Voice Assistant</span>
              </div>
              
              <div className={cn(
                "text-sm font-medium",
                !hasSupport && "text-red-600 dark:text-red-400",
                isListening && speechDetected && "text-green-600 dark:text-green-400",
                isListening && !speechDetected && "text-yellow-600 dark:text-yellow-400"
              )}>
                {statusLabel}
              </div>
              
              {hasSupport && !isListening && (
                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-medium">Try saying:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>"Go to dashboard"</li>
                    <li>"Open services"</li>
                    <li>"Scroll down"</li>
                    <li>"Toggle dark mode"</li>
                  </ul>
                </div>
              )}
              
              {hasSupport && isListening && (
                <div className="text-xs text-muted-foreground pt-2 border-t border-slate-200 dark:border-slate-700">
                  💡 Speak LOUD and CLEAR for best results
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

