"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Mic, MicOff, Loader2, Volume2, X, Info } from "lucide-react"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
  const [showBanner, setShowBanner] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    if (!SpeechRecognition) {
      setHasSupport(false)
    }
    
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem('voice-banner-dismissed')
    if (!dismissed) {
      // Show banner after 10 seconds
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 10000)
      return () => clearTimeout(timer)
    } else {
      setBannerDismissed(true)
    }
  }, [])

  const handleDismissBanner = () => {
    setShowBanner(false)
    setBannerDismissed(true)
    sessionStorage.setItem('voice-banner-dismissed', 'true')
  }

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
    <>
      {/* Voice Command Banner */}
      <AnimatePresence>
        {showBanner && !bannerDismissed && hasSupport && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[60] md:w-[90%] md:max-w-2xl"
            style={{ top: '130px' }}
          
          >
            <div className="bg-gradient-to-r from-[#4C4EFB] to-[#6366F1] text-white rounded-lg md:rounded-xl shadow-2xl border border-white/20 backdrop-blur-md">
              <div className="p-3 md:p-5">
                <div className="flex items-start gap-2 md:gap-3">
                  {/* Icon - Hidden on mobile, shown on desktop */}
                  <div className="hidden md:block flex-shrink-0 mt-0.5">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                      <Mic className="h-4 w-4 md:hidden flex-shrink-0 text-white" />
                      <h3 className="text-sm md:text-lg font-bold">Voice Commands Available!</h3>
                    </div>
                    
                    <p className="text-xs md:text-sm text-white/90 mb-2 md:mb-3">
                      Click the mic button and speak commands to navigate hands-free.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] md:text-xs">
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="font-semibold text-white/80">📍 Navigation:</p>
                        <ul className="space-y-0.5 text-white/70 pl-2">
                          <li>• "Go to dashboard"</li>
                          <li>• "Open services"</li>
                          <li>• "Open Blog"</li>
                          <li>• "Open Contact"</li>
                          <li>• "Go Home"</li>
                          <li className="hidden md:block">• "Show blog"</li>
                        </ul>
                      </div>
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="font-semibold text-white/80">⚡ Actions:</p>
                        <ul className="space-y-0.5 text-white/70 pl-2">
                          <li>• "Scroll down"</li>
                          <li>• "Go back"</li>
                          <li className="hidden md:block">• "Toggle dark mode"</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/20 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-white/80">
                      <Info className="h-3 w-3 md:h-3.5 md:w-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">Speak clearly and loudly for best results</span>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={handleDismissBanner}
                    className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors flex items-center justify-center group"
                    aria-label="Dismiss banner"
                  >
                    <X className="h-3.5 w-3.5 md:h-4 md:w-4 text-white/70 group-hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Navigator Button */}
      <div className="fixed bottom-6 left-6 md:left-auto md:right-28 lg:right-32 z-50">
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
          title={statusLabel}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
      </div>
    </>
  )
}

