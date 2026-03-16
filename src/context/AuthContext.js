import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import i18n from '../i18n/i18n'

// ============================================================
// AuthContext — Kapitel 1: Auth & Session Management
//
// Features:
//   - Google OAuth (Primär-Login)
//   - E-Mail/Passwort Login (Sekundär)
//   - Session-Persistenz via Supabase Auth
//   - Auth-State-Listener (onAuthStateChange)
//   - Profil aus public.profiles laden
//   - Sprache aus Profil beim Login wiederherstellen
//   - 2FA-Status prüfen
// ============================================================

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)    // Supabase Auth User
  const [profile, setProfile] = useState(null)   // public.profiles Row
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ── Profil laden (aus sicherer View) ─────────────────────
  const loadProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles_public')  // Sichere View — kein totp_secret etc.
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('loadProfile error:', error)
      return null
    }

    // Sprache aus Profil wiederherstellen
    if (data?.language) {
      await i18n.changeLanguage(data.language)
    }

    return data
  }, [])

  // ── Auth State Listener ───────────────────────────────────
  useEffect(() => {
    let mounted = true

    // Aktuelle Session prüfen
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return

      if (session?.user) {
        setUser(session.user)
        const p = await loadProfile(session.user.id)
        setProfile(p)
      }
      setLoading(false)
    })

    // Auth-Änderungen abonnieren
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          const p = await loadProfile(session.user.id)
          setProfile(p)
        }
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
        }
        if (event === 'TOKEN_REFRESHED') {
          // Session wurde automatisch verlängert — kein Action nötig
        }
        if (event === 'USER_UPDATED') {
          const p = await loadProfile(session?.user?.id)
          setProfile(p)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [loadProfile])

  // ── Google OAuth Login ────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:  `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt:      'consent',
        },
      },
    })
    if (error) {
      setError(error.message)
    }
  }, [])

  // ── E-Mail/Passwort Login ─────────────────────────────────
  const loginWithEmail = useCallback(async (email, password) => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
    return { success: true }
  }, [])

  // ── Registrierung ─────────────────────────────────────────
  const register = useCallback(async (email, password) => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
    return { success: true, message: 'Bestätigungs-E-Mail gesendet!' }
  }, [])

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  // ── Passwort Reset ────────────────────────────────────────
  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { success: !error, error: error?.message }
  }, [])

  // ── Profil aktualisieren ──────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    // Erlaubte Felder für Frontend-Update (token_balance etc. NICHT hier)
    const allowedUpdates = {
      display_name: updates.display_name,
      avatar_url:   updates.avatar_url,
      country:      updates.country,
      language:     updates.language,
    }
    // Undefined-Werte entfernen
    Object.keys(allowedUpdates).forEach(k => allowedUpdates[k] === undefined && delete allowedUpdates[k])

    const { error } = await supabase
      .from('profiles')
      .update(allowedUpdates)
      .eq('id', user.id)

    if (error) return { success: false, error: error.message }

    // Profil neu laden
    const p = await loadProfile(user.id)
    setProfile(p)
    return { success: true }
  }, [user, loadProfile])

  // ── 2FA: TOTP Setup initiieren ────────────────────────────
  // Gibt ein QR-Code-Secret zurück — Aktivierung via separaten Endpoint
  const initiate2FA = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer:     'StickerSwap',
    })
    if (error) return { success: false, error: error.message }
    return {
      success: true,
      qrCode:  data.totp.qr_code,
      secret:  data.totp.secret,
      id:      data.id,
    }
  }, [])

  const verify2FA = useCallback(async (factorId, code) => {
    // Challenge erstellen
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) return { success: false, error: challengeError.message }

    // Challenge verifizieren
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })
    if (verifyError) return { success: false, error: verifyError.message }
    return { success: true }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      error,
      isAuthenticated: !!user,
      // Auth Actions
      loginWithGoogle,
      loginWithEmail,
      register,
      logout,
      resetPassword,
      updateProfile,
      // 2FA
      initiate2FA,
      verify2FA,
      // Refresh
      refreshProfile: () => user && loadProfile(user.id).then(setProfile),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
