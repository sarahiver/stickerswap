import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// ============================================================
// StickerSwap — i18n v2 (Kapitel 2)
// 15 Sprachen: Tier 1-3 + Fallback EN
// RTL: AR automatisch
// Hybrid: Static JSON + dynamische DB-Übersetzungen (ui_translations)
// ============================================================

// Tier 1 (höchste Prio, vollständig übersetzt)
import en from './locales/en/translation.json'
import es from './locales/es/translation.json'
import pt from './locales/pt/translation.json'
import it from './locales/it/translation.json'
// Tier 2
import fr from './locales/fr/translation.json'
import de from './locales/de/translation.json'
import ar from './locales/ar/translation.json'
import tr from './locales/tr/translation.json'
import pl from './locales/pl/translation.json'
// Tier 3
import nl from './locales/nl/translation.json'
import sv from './locales/sv/translation.json'
import no from './locales/no/translation.json'
import da from './locales/da/translation.json'
import fi from './locales/fi/translation.json'

// ── Konfiguration ─────────────────────────────────────────────

export const LANGUAGES = {
  // Tier 1
  en: { name: 'English',    nativeName: 'English',     flag: '🇬🇧', tier: 1, rtl: false },
  es: { name: 'Spanish',    nativeName: 'Español',     flag: '🇪🇸', tier: 1, rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português',   flag: '🇧🇷', tier: 1, rtl: false },
  it: { name: 'Italian',    nativeName: 'Italiano',    flag: '🇮🇹', tier: 1, rtl: false },
  // Tier 2
  fr: { name: 'French',     nativeName: 'Français',    flag: '🇫🇷', tier: 2, rtl: false },
  de: { name: 'German',     nativeName: 'Deutsch',     flag: '🇩🇪', tier: 2, rtl: false },
  ar: { name: 'Arabic',     nativeName: 'العربية',     flag: '🇸🇦', tier: 2, rtl: true  },
  tr: { name: 'Turkish',    nativeName: 'Türkçe',      flag: '🇹🇷', tier: 2, rtl: false },
  pl: { name: 'Polish',     nativeName: 'Polski',      flag: '🇵🇱', tier: 2, rtl: false },
  // Tier 3
  nl: { name: 'Dutch',      nativeName: 'Nederlands',  flag: '🇳🇱', tier: 3, rtl: false },
  sv: { name: 'Swedish',    nativeName: 'Svenska',     flag: '🇸🇪', tier: 3, rtl: false },
  no: { name: 'Norwegian',  nativeName: 'Norsk',       flag: '🇳🇴', tier: 3, rtl: false },
  da: { name: 'Danish',     nativeName: 'Dansk',       flag: '🇩🇰', tier: 3, rtl: false },
  fi: { name: 'Finnish',    nativeName: 'Suomi',       flag: '🇫🇮', tier: 3, rtl: false },
}

export const RTL_LANGUAGES = Object.keys(LANGUAGES).filter(k => LANGUAGES[k].rtl)
export const isRTL = (lang) => LANGUAGES[lang]?.rtl === true

// ── Sprache setzen (HTML dir, lang, localStorage) ─────────────
export const changeLanguage = async (lang) => {
  const validLang = LANGUAGES[lang] ? lang : 'en'
  await i18n.changeLanguage(validLang)
  document.documentElement.dir  = isRTL(validLang) ? 'rtl' : 'ltr'
  document.documentElement.lang = validLang
  localStorage.setItem('stickerswap_lang', validLang)
}

// ── Browser-Sprach-Erkennung ──────────────────────────────────
// Logik: localStorage → navigator.language (exact) →
//        navigator.language (base) → navigator.languages →
//        Fallback 'en'
export const detectBrowserLanguage = () => {
  // 1. localStorage (manuelle Auswahl)
  const stored = localStorage.getItem('stickerswap_lang')
  if (stored && LANGUAGES[stored]) return stored

  // 2. Browser-Sprache exakt
  const navLang = navigator.language?.toLowerCase().split('-')[0]
  if (navLang && LANGUAGES[navLang]) return navLang

  // 3. navigator.languages Array
  for (const lang of (navigator.languages || [])) {
    const base = lang.toLowerCase().split('-')[0]
    if (LANGUAGES[base]) return base
  }

  // 4. Fallback: EN
  return 'en'
}

// ── i18next initialisieren ────────────────────────────────────
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en, es, pt, it, fr, de, ar, tr, pl, nl, sv, no, da, fi },
    fallbackLng: 'en',

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'stickerswap_lang',
      caches: ['localStorage'],
    },

    interpolation: { escapeValue: false },
    defaultNS: 'translation',
    ns: ['translation'],
  })

// Initial HTML-Attribute setzen
const initialLang = detectBrowserLanguage()
document.documentElement.dir  = isRTL(initialLang) ? 'rtl' : 'ltr'
document.documentElement.lang = initialLang

export default i18n
