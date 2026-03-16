// src/hooks/useStickerGrid.js — echtes Schema (user_stickers + stickers RPCs)
import { useState, useCallback, useRef, useTransition } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_CYCLE = ['need', 'have', 'double']
const nextStatus = (current) => {
  const idx = STATUS_CYCLE.indexOf(current)
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
}

export const useStickerGrid = (albumId) => {
  const [stickers,   setStickers]   = useState(new Map())
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [stats,      setStats]      = useState({ total: 0, have: 0, double: 0, need: 0, locked: 0 })
  const [selected,   setSelected]   = useState(new Set())
  const [selectMode, setSelectMode] = useState(false)

  const pending = useRef(new Map())
  const [, startTransition] = useTransition()

  // ── Album laden via RPC ──────────────────────────────────
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

    startTransition(() => {
      const map = new Map()
      ;(data || []).forEach(s => map.set(s.sticker_id, s))
      setStickers(map)
    })

    // Stats laden
    const { data: statsData } = await supabase.rpc('get_album_stats', {
      p_album_id: albumId,
    })
    if (statsData) setStats(statsData)

    setLoading(false)
  }, [albumId])

  // ── Stats lokal neu berechnen ────────────────────────────
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

  // ── Einzelner Update (Optimistic) ────────────────────────
  const updateSticker = useCallback(async (stickerId, newStatus) => {
    const sticker = stickers.get(stickerId)
    if (!sticker) return { success: false, error: 'Not found' }
    if (newStatus === 'locked') return { success: false, error: 'Not allowed' }
    if (sticker.status === 'locked') return { success: false, error: 'Locked' }

    const oldStatus = sticker.status

    // Optimistic
    setStickers(prev => {
      const next = new Map(prev)
      next.set(stickerId, { ...sticker, status: newStatus })
      return next
    })
    pending.current.set(stickerId, true)

    const { error: rpcError } = await supabase.rpc('upsert_user_sticker', {
      p_sticker_id: stickerId,
      p_status:     newStatus,
    })

    pending.current.delete(stickerId)

    if (rpcError) {
      // Rollback
      setStickers(prev => {
        const next = new Map(prev)
        next.set(stickerId, { ...sticker, status: oldStatus })
        return next
      })
      return { success: false, error: rpcError.message }
    }

    setStickers(prev => { recalcStats(prev); return prev })
    return { success: true }
  }, [stickers, recalcStats])

  // ── Batch-Update ─────────────────────────────────────────
  const batchUpdate = useCallback(async (stickerIds, newStatus) => {
    if (!stickerIds.length) return { success: false }
    if (newStatus === 'locked') return { success: false }

    const eligible = stickerIds.filter(id => {
      const s = stickers.get(id)
      return s && s.status !== 'locked'
    })
    if (!eligible.length) return { success: false }

    const snapshots = new Map(eligible.map(id => [id, stickers.get(id)?.status]))

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

    const BATCH = 50
    let updated = 0
    const errors = []

    for (let i = 0; i < eligible.length; i += BATCH) {
      const chunk = eligible.slice(i, i + BATCH)
      const updates = chunk.map(id => ({ sticker_id: id, status: newStatus }))

      const { data, error: rpcError } = await supabase.rpc('batch_update_stickers', {
        p_updates: JSON.stringify(updates),
      })

      if (rpcError) {
        setStickers(prev => {
          const next = new Map(prev)
          chunk.forEach(id => {
            const s = next.get(id)
            if (s) next.set(id, { ...s, status: snapshots.get(id) || 'need' })
          })
          return next
        })
        errors.push(rpcError.message)
      } else {
        updated += data?.updated ?? 0
        if (data?.errors?.length) errors.push(...data.errors)
      }
    }

    setSelected(new Set())
    setSelectMode(false)
    setStickers(prev => { recalcStats(prev); return prev })

    return { success: errors.length === 0, updated, errors }
  }, [stickers, recalcStats])

  // ── Selection ────────────────────────────────────────────
  const toggleSelect = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const clearSelect = useCallback(() => {
    setSelected(new Set())
    setSelectMode(false)
  }, [])

  const cycleStatus = useCallback((id) => {
    const s = stickers.get(id)
    if (!s || s.status === 'locked') return null
    return nextStatus(s.status)
  }, [stickers])

  const isPending = useCallback((id) => pending.current.has(id), [])

  return {
    stickers,
    stickersArray: [...stickers.values()],
    stats,
    loading,
    error,
    loadAlbum,
    updateSticker,
    batchUpdate,
    cycleStatus,
    selected,
    selectMode,
    setSelectMode,
    toggleSelect,
    clearSelect,
    isPending,
    pendingRef: pending,
    totalSelected: selected.size,
  }
}
