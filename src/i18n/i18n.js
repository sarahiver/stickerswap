// ============================================================
// StickerSwap — i18n Setup
// Kapitel 1: Internationalisierung & RTL
//
// Unterstützte Sprachen: DE, EN, ES, FR, NL, TR, AR
// RTL-Sprachen: AR (automatische dir-Erkennung)
//
// Übersetzungen sind modular in locales/{lang}/translation.json
// ============================================================

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Übersetzungs-Dateien importieren
import de from './locales/de/translation.json'
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import fr from './locales/fr/translation.json'
import nl from './locales/nl/translation.json'
import tr from './locales/tr/translation.json'
import ar from './locales/ar/translation.json'

// RTL-Sprachen
export const RTL_LANGUAGES = ['ar', 'he', 'fa']

export const isRTL = (lang: string): boolean => RTL_LANGUAGES.includes(lang)

// Sprache wechseln + HTML dir-Attribut setzen
export const changeLanguage = async (lang: string): Promise<void> => {
  await i18n.changeLanguage(lang)
  document.documentElement.dir  = isRTL(lang) ? 'rtl' : 'ltr'
  document.documentElement.lang = lang
  // In localStorage für Supabase-Profil-Sync speichern
  localStorage.setItem('stickerswap_lang', lang)
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { de, en, es, fr, nl, tr, ar },
    fallbackLng: 'de',

    // Spracherkennung: localStorage → Navigator → Fallback
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'stickerswap_lang',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React escaped bereits
    },

    // Pluralisierung aktivieren
    pluralSeparator: '_',

    // Namespace
    defaultNS: 'translation',
    ns: ['translation'],
  })

// HTML-Attribute initial setzen
const initialLang = i18n.language?.split('-')[0] || 'de'
document.documentElement.dir  = isRTL(initialLang) ? 'rtl' : 'ltr'
document.documentElement.lang = initialLang

export default i18n
