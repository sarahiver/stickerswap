import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { changeLanguage } from '../i18n/i18n'
import { useAuth } from '../context/AuthContext'

// ============================================================
// useRegion — Kapitel 2: Regional-Matching & Sprach-Settings
//
// Verwaltet:
//   - country_code (2-stellig, ISO 3166-1)
//   - search_international (boolean)
//   - language (aus LANGUAGES-Map)
//
// SICHERHEIT: Alle Änderungen gehen via update_region_settings() RPC.
// Das Frontend schreibt NIEMALS direkt in profiles.
// ============================================================

export const useRegion = () => {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // Aus Profil lesen (initial)
  const countryCode          = profile?.country_code          ?? 'DE'
  const searchInternational  = profile?.search_international  ?? false
  const currentLanguage      = profile?.language              ?? 'de'

  // ── Regionale Einstellungen ändern ───────────────────────
  const updateRegionSettings = useCallback(async ({
    countryCode: newCountry,
    searchInternational: newIntl,
    language: newLang,
  }) => {
    setLoading(true)
    setError(null)

    // Validierung im Frontend (zweite Prüfung ist in SQL)
    if (newLang) await changeLanguage(newLang)

    const { data, error: rpcError } = await supabase.rpc('update_region_settings', {
      p_country_code:         newCountry         ?? countryCode,
      p_search_international: newIntl            ?? searchInternational,
      p_language:             newLang            ?? currentLanguage,
    })

    setLoading(false)

    if (rpcError) {
      setError(rpcError.message)
      return { success: false, error: rpcError.message }
    }

    await refreshProfile()
    return { success: true, data }
  }, [countryCode, searchInternational, currentLanguage, refreshProfile])

  // ── Matches laden (regional oder weltweit) ────────────────
  // Regions-Filter liegt VOLLSTÄNDIG im SQL (get_regional_matches RPC)
  const fetchMatches = useCallback(async (albumId, { limit = 20, offset = 0 } = {}) => {
    if (!albumId) return { data: [], error: 'No album selected' }

    const { data, error: rpcError } = await supabase.rpc('get_regional_matches', {
      p_album_id: albumId,
      p_limit:    limit,
      p_offset:   offset,
    })

    if (rpcError) return { data: [], error: rpcError.message }
    return { data: data ?? [], error: null }
  }, [])

  // ── DB-Übersetzungen laden und cachen ─────────────────────
  const fetchDbTranslations = useCallback(async (lang) => {
    const cacheKey = `stickerswap_translations_${lang}`
    const cacheTs  = localStorage.getItem(`${cacheKey}_ts`)

    // Cache: 1 Stunde gültig
    if (cacheTs && Date.now() - parseInt(cacheTs) < 3_600_000) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) return JSON.parse(cached)
    }

    const { data, error: rpcError } = await supabase.rpc('get_ui_translations', {
      p_language: lang,
    })

    if (rpcError || !data) return {}

    // Array zu Objekt umwandeln: [{key, value}] → {key: value}
    const translations = data.reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    localStorage.setItem(cacheKey, JSON.stringify(translations))
    localStorage.setItem(`${cacheKey}_ts`, Date.now().toString())

    return translations
  }, [])

  return {
    // State
    countryCode,
    searchInternational,
    currentLanguage,
    loading,
    error,
    // Actions
    updateRegionSettings,
    fetchMatches,
    fetchDbTranslations,
  }
}
