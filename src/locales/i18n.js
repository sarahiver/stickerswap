import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import landing from './landing';

// Alle 15 Sprachen als Ressourcen aufbauen
const resources = {};
Object.entries(landing).forEach(([lang, data]) => {
  resources[lang] = { landing: data };
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',          // Fallback wenn Sprache fehlt
    defaultNS:   'landing',

    detection: {
      // 1. localStorage (User-Wahl), 2. Browser-Sprache
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ss_lang',
      caches: ['localStorage'],
    },

    interpolation: { escapeValue: false },

    // Unterstützte Sprachen
    supportedLngs: [
      'de','en','fr','es','it','pt',
      'pl','nl','ro','cs','hu','tr',
      'ar','uk','hr',
    ],
  });

export default i18n;

/* ─── Hilfsfunktionen ─────────────────────────── */

export const LANGUAGES = [
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪' },
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Español',    flag: '🇪🇸' },
  { code: 'it', label: 'Italiano',   flag: '🇮🇹' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹' },
  { code: 'pl', label: 'Polski',     flag: '🇵🇱' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'ro', label: 'Română',     flag: '🇷🇴' },
  { code: 'cs', label: 'Čeština',    flag: '🇨🇿' },
  { code: 'hu', label: 'Magyar',     flag: '🇭🇺' },
  { code: 'tr', label: 'Türkçe',     flag: '🇹🇷' },
  { code: 'ar', label: 'العربية',    flag: '🇸🇦', rtl: true },
  { code: 'uk', label: 'Українська', flag: '🇺🇦' },
  { code: 'hr', label: 'Hrvatski',   flag: '🇭🇷' },
];

export function setLanguage(code) {
  i18n.changeLanguage(code);
  localStorage.setItem('ss_lang', code);
  // RTL für Arabisch
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = code;
}
