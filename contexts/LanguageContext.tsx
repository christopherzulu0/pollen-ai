"use client"

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { DEFAULT_TRANSLATIONS } from "@/lib/translations"
import { toast } from "sonner"

export type Language = "en" | "bem" | "nya" | "to" | "loz" | "kqn" | "lun"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: any
  isTranslating: boolean
  handleLanguageChange: (newLanguage: Language) => void
  languages: Array<{ code: Language; name: string }>
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

async function fetchTranslation(targetLanguage: Language) {
  if (targetLanguage === "en") {
    return DEFAULT_TRANSLATIONS.en
  }

  console.log(`[fetchTranslation] Starting translation to ${targetLanguage}`)

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: DEFAULT_TRANSLATIONS.en,
        targetLanguage,
      }),
    })

    console.log(`[fetchTranslation] Response status: ${response.status}`)

    const data = await response.json()
    console.log(`[fetchTranslation] Response data:`, data)

    if (data.warning) {
      console.warn("[fetchTranslation] Warning:", data.warning)
      toast.warning(data.warning)
      return DEFAULT_TRANSLATIONS.en
    }

    if (!response.ok || data.error) {
      console.error("[fetchTranslation] Error:", data.error, "Details:", data.details)
      const errorMessage = data.error || "Translation failed"
      const errorDetails = data.details ? ` ${data.details}` : ""
      throw new Error(`${errorMessage}${errorDetails}`)
    }

    if (data.translation) {
      console.log(`[fetchTranslation] Translation successful for ${targetLanguage}`)
      return data.translation
    }

    throw new Error("No translation data received")
  } catch (error: any) {
    console.error("[fetchTranslation] Translation error:", error)
    toast.error(error.message || "Failed to translate content. Using English.")
    return DEFAULT_TRANSLATIONS.en
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTranslatingState, setIsTranslatingState] = useState(false)

  const languages = [
    { code: "en" as const, name: "English" },
    { code: "bem" as const, name: "Bemba" },
    { code: "nya" as const, name: "Nyanja" },
    { code: "to" as const, name: "Tonga" },
    { code: "loz" as const, name: "Lozi" },
    { code: "kqn" as const, name: "Kaonde" },
    { code: "lun" as const, name: "Lunda" },
  ]

  const { data: t, isLoading, isFetching, error: translationError } = useQuery({
    queryKey: ["translation", language],
    queryFn: () => {
      console.log("Fetching translation for language:", language)
      setIsTranslatingState(true)
      return fetchTranslation(language)
    },
    initialData: DEFAULT_TRANSLATIONS.en,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  const isTranslating = (isLoading || isFetching || isTranslatingState) && language !== "en"

  useEffect(() => {
    if (!isFetching && !isLoading && language !== "en") {
      const timer = setTimeout(() => {
        setIsTranslatingState(false)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isFetching, isLoading, language])

  const toastIdRef = useRef<string | number | null>(null)
  const hasShownSuccessRef = useRef(false)

  useEffect(() => {
    if (isTranslating && !toastIdRef.current) {
      hasShownSuccessRef.current = false
      const languageName = languages.find(l => l.code === language)?.name || language
      const toastId = toast.loading("Translating content...", {
        description: `Translating to ${languageName}`,
        duration: Infinity,
      })
      toastIdRef.current = toastId
    } else if (!isTranslating && toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
      toastIdRef.current = null

      if (language !== "en" && t && !translationError && !hasShownSuccessRef.current) {
        hasShownSuccessRef.current = true
        const languageName = languages.find(l => l.code === language)?.name || language
        toast.success("Translation complete!", {
          description: `Content has been translated to ${languageName}`,
          duration: 3000,
        })
      }
    }

    if (language === "en") {
      hasShownSuccessRef.current = false
    }
  }, [isTranslating, language, t, translationError, languages])

  const handleLanguageChange = (newLanguage: Language) => {
    console.log("Changing language from", language, "to", newLanguage)
    if (newLanguage !== language) {
      setIsTranslatingState(false)
      setIsDropdownOpen(false)

      if (newLanguage !== "en") {
        setIsTranslatingState(true)
      }

      setLanguage(newLanguage)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isTranslating,
        handleLanguageChange,
        languages,
        isDropdownOpen,
        setIsDropdownOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

