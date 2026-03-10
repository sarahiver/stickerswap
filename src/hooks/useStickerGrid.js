import { useState, useCallback, useRef, useTransition } from 'react'
import { supabase } from '../lib/supabase'

// ============================================================
// useStickerGrid — Kapitel 3
//
// State-Management für das Sticker-Grid:
//   - Lädt Album-Sticker via get_album_stickers() RPC
//   - Optimistic UI: Status-Update sofort lokal, API im Hintergrund
//   - Rollback bei Fehler + Toast
//   - Batch-Update für "Alle markieren"
//   - Selection-Mode für Multi-Select
//
// SICHERHEIT: Frontend sendet nur sticker_id + status.
// Validierung + locked-Schutz liegt in der RPC/RLS.
// ============================================================

// Status-Reihenfolge für Cycling (Tap ohne Sheet)
const STATUS_CYCLE = ['need', 'have', 'double']
const nextStatus = (current) => {
  const idx = STATUS_CYCLE.indexOf(current)
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
}

export const useStickerGrid = (albumId) => {
  // ── State ─────────────────────────────────────────────────
  // Map<sticker_id, {number, name, category, rarity_score, image_url, status, quantity}>
  const [stickers,    setStickers]    = useState(new Map())
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [stats,       setStats]       = useState({ total: 0, have: 0, double: 0, need: 0, locked: 0 })

  // Selection-Mode (für Batch-Updates)
  const [selected,    setSelected]    = useState(new Set())
  const [selectMode,  setSelectMode]  = useState(false)

  // Pending-Indicator für Optimistic-Updates (Map<sticker_id, true>)
  const pending = useRef(new Map())

  // React 18: useTransition verhindert Ruckeln bei großen State-Updates
  const [, startTransition] = useTransition()

  // ── Album laden ───────────────────────────────────────────
  const loadAlbum = useCallback(async (language = 'en') => {
    if (!albumId) return
    setLoading(true)
    setError(null)

    const { data, error: rpcError } = await supabase.rpc('get_album_stickers', {
      p_album_id: albumId,
      p_language: language,
    })

    if (rpcError) {
      setError(rpcError.message)
      setLoading(false)
      return
    }

    // Array → Map für O(1)-Zugriff
    startTransition(() => {
      const map = new Map()
      ;(data || []).forEach(s => map.set(s.sticker_id, s))
      setStickers(map)
    })

    // Stats separat laden
    const { data: statsData } = await supabase.rpc('get_album_stats', {
      p_album_id: albumId,
    })
    if (statsData) setStats(statsData)

    setLoading(false)
  }, [albumId])

  // ── Stats neu berechnen (lokal, ohne RPC) ─────────────────
  const recalcStats = useCallback((map) => {
    let have = 0, double_ = 0, need = 0, locked = 0
    map.forEach(s => {
      if (s.status === 'have')   have++
      if (s.status === 'double') double_++
      if (s.status === 'need')   need++
      if (s.status === 'locked') locked++
    })
    setStats(prev => ({ ...prev, have, double: double_, need, locked }))
  }, [])

  // ── Einzelner Sticker-Update (Optimistic) ─────────────────
  const updateSticker = useCallback(async (stickerId, newStatus) => {
    const sticker = stickers.get(stickerId)
    if (!sticker) return { success: false, error: 'Sticker not found' }

    // 'locked' kann nur das Swap-System setzen
    if (newStatus === 'locked') return { success: false, error: 'Not allowed' }
    if (sticker.status === 'locked') return { success: false, error: 'Locked in swap' }

    const oldStatus = sticker.status

    // ── OPTIMISTIC UPDATE: sofort im UI sichtbar ─────────────
    setStickers(prev => {
      const next = new Map(prev)
      next.set(stickerId, { ...sticker, status: newStatus })
      return next
    })

    // Pending markieren
    pending.current.set(stickerId, true)

    // ── API-Call im Hintergrund ───────────────────────────────
    const { data, error: rpcError } = await supabase.rpc('upsert_user_sticker', {
      p_sticker_id: stickerId,
      p_status:     newStatus,
    })

    pending.current.delete(stickerId)

    if (rpcError) {
      // ── ROLLBACK: Alten Status wiederherstellen ─────────────
      setStickers(prev => {
        const next = new Map(prev)
        next.set(stickerId, { ...sticker, status: oldStatus })
        return next
      })
      return { success: false, error: rpcError.message }
    }

    // Stats lokal aktualisieren (kein Extra-RPC nötig)
    setStickers(prev => {
      recalcStats(prev)
      return prev
    })

    return { success: true, data }
  }, [stickers, recalcStats])

  // ── Batch-Update (bis zu 50 Sticker) ─────────────────────
  const batchUpdate = useCallback(async (stickerIds, newStatus) => {
    if (!stickerIds.length) return { success: false, error: 'No stickers selected' }
    if (newStatus === 'locked') return { success: false, error: 'Not allowed' }

    // Nur nicht-locked Sticker
    const eligible = stickerIds.filter(id => {
      const s = stickers.get(id)
      return s && s.status !== 'locked'
    })

    if (!eligible.length) return { success: false, error: 'All locked' }

    // Snapshot für Rollback
    const snapshots = new Map(
      eligible.map(id => [id, stickers.get(id)?.status])
    )

    // Optimistic Update
    startTransition(() => {
      setStickers(prev => {
        const next = new Map(prev)
        eligible.forEach(id => {
          const s = next.get(id)
          if (s) next.set(id, { ...s, status: newStatus })
        })
        return next
      })
    })

    // Batches von 50
    const BATCH_SIZE = 50
    let totalUpdated = 0
    let totalErrors  = []

    for (let i = 0; i < eligible.length; i += BATCH_SIZE) {
      const chunk = eligible.slice(i, i + BATCH_SIZE)
      const updates = chunk.map(id => ({ sticker_id: id, status: newStatus }))

      const { data, error: rpcError } = await supabase.rpc('batch_update_stickers', {
        p_updates: JSON.stringify(updates),
      })

      if (rpcError) {
        // Rollback dieser Chunk
        setStickers(prev => {
          const next = new Map(prev)
          chunk.forEach(id => {
            const s = next.get(id)
            if (s) next.set(id, { ...s, status: snapshots.get(id) || 'need' })
          })
          return next
        })
        totalErrors.push(rpcError.message)
      } else {
        totalUpdated += data?.updated ?? 0
        if (data?.errors?.length) totalErrors.push(...data.errors)
      }
    }

    // Selection leeren
    setSelected(new Set())
    setSelectMode(false)

    // Stats neu berechnen
    setStickers(prev => { recalcStats(prev); return prev })

    return {
      success:  totalErrors.length === 0,
      updated:  totalUpdated,
      errors:   totalErrors,
    }
  }, [stickers, recalcStats])

  // ── Selection-Mode ────────────────────────────────────────
  const toggleSelect = useCallback((stickerId) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(stickerId) ? next.delete(stickerId) : next.add(stickerId)
      return next
    })
  }, [])

  const selectAll   = useCallback(() =>
    setSelected(new Set(stickers.keys())), [stickers])

  const clearSelect = useCallback(() => {
    setSelected(new Set())
    setSelectMode(false)
  }, [])

  // ── Status cycling (Quick-Tap ohne Sheet) ─────────────────
  const cycleStatus = useCallback((stickerId) => {
    const s = stickers.get(stickerId)
    if (!s || s.status === 'locked') return null
    return nextStatus(s.status)
  }, [stickers])

  // ── isPending helper ──────────────────────────────────────
  const isPending = useCallback((stickerId) =>
    pending.current.has(stickerId), [])

  return {
    // Data
    stickers,          // Map<uuid, StickerData>
    stickersArray: [...stickers.values()],  // für react-window
    stats,
    loading,
    error,
    // Actions
    loadAlbum,
    updateSticker,
    batchUpdate,
    cycleStatus,
    // Selection
    selected,
    selectMode,
    setSelectMode,
    toggleSelect,
    selectAll,
    clearSelect,
    // Helpers
    isPending,
    totalSelected: selected.size,
  }
}
