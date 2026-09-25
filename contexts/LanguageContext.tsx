"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import i18n, { SUPPORTED_LANGUAGES } from "@/lib/i18n"
import en from "@/locales/en.json"

export type Language = (typeof SUPPORTED_LANGUAGES)[number]

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof en
  isTranslating: boolean
  handleLanguageChange: (newLanguage: Language) => void
  languages: Array<{ code: Language; name: string }>
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const languages: Array<{ code: Language; name: string }> = [
  { code: "en", name: "English" },
  { code: "bem", name: "Bemba" },
  { code: "nya", name: "Nyanja" },
  { code: "to", name: "Tonga" },
  { code: "loz", name: "Lozi" },
  { code: "kqn", name: "Kaonde" },
  { code: "lun", name: "Lunda" },
]

function normalizeLanguage(value: string | undefined): Language {
  const base = (value || "en").split("-")[0] as Language
  return SUPPORTED_LANGUAGES.includes(base) ? base : "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n: i18nInstance } = useTranslation()
  const [language, setLanguageState] = useState<Language>("en")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("i18nextLng")
    const next = normalizeLanguage(stored || undefined)
    if (next !== "en") {
      void i18n.changeLanguage(next)
      setLanguageState(next)
    }
  }, [])

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setLanguageState(normalizeLanguage(lng))
    }
    i18nInstance.on("languageChanged", handleLanguageChanged)
    return () => {
      i18nInstance.off("languageChanged", handleLanguageChanged)
    }
  }, [i18nInstance])

  const applyLanguage = (newLanguage: Language) => {
    if (newLanguage === language) return
    setIsDropdownOpen(false)
    setLanguageState(newLanguage)
    window.localStorage.setItem("i18nextLng", newLanguage)
    void i18n.changeLanguage(newLanguage)
  }

  const bundle = i18n.getResourceBundle(language, "translation") as typeof en | undefined
  const t = bundle ?? en

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: applyLanguage,
        t,
        isTranslating: false,
        handleLanguageChange: applyLanguage,
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
