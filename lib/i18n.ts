import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import en from "@/locales/en.json"
import bem from "@/locales/bem.json"
import nya from "@/locales/nya.json"
import to from "@/locales/to.json"
import loz from "@/locales/loz.json"
import kqn from "@/locales/kqn.json"
import lun from "@/locales/lun.json"

export const SUPPORTED_LANGUAGES = ["en", "bem", "nya", "to", "loz", "kqn", "lun"] as const

const resources = {
  en: { translation: en },
  bem: { translation: bem },
  nya: { translation: nya },
  to: { translation: to },
  loz: { translation: loz },
  kqn: { translation: kqn },
  lun: { translation: lun },
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: [...SUPPORTED_LANGUAGES],
      load: "currentOnly",
      nonExplicitSupportedLngs: true,
      // Force English for the first render so server HTML and client hydration match.
      // The provider applies a stored language after mount.
      lng: "en",
      defaultNS: "translation",
      interpolation: { escapeValue: false },
      returnObjects: true,
      detection: {
        order: ["localStorage"],
        caches: [],
        lookupLocalStorage: "i18nextLng",
      },
      react: { useSuspense: false },
    })
}

export default i18n
