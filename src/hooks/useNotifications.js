// src/hooks/useNotifications.js
// Kapitel 6 — Supabase Realtime: swaps + swap_messages
// Toast-Benachrichtigungen + last_seen_at Update

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './useToast';
import { useTranslation } from 'react-i18next';

// Wie oft last_seen_at aktualisieren (ms)
const LAST_SEEN_INTERVAL = 60_000; // 1 Minute

const useNotifications = ({
  userId,
  activeSwapId = null,   // aktiver Swap (Chat offen) → keine Duplicate Toasts
  onSwapUpdate = null,   // (swap) => void — für Realtime-Refresh
  onNewMessage = null,   // (message) => void — für Chat
}) => {
  const { showToast } = useToast();
  const { t }         = useTranslation();
  const channelsRef   = useRef([]);
  const lastSeenTimer = useRef(null);

  // ── last_seen_at aktualisieren ─────────────────────────────────────────────
  const updateLastSeen = useCallback(async () => {
    if (!userId) return;
    await supabase.rpc('update_last_seen');
  }, [userId]);

  // ── Toast-Nachricht für Swap-Status ───────────────────────────────────────
  const getSwapToast = useCallback((oldStatus, newStatus, swap) => {
    const isUserA = swap.user_a_id === userId;
    const partner = isUserA ? swap.user_b?.display_name : swap.user_a?.display_name;

    const messages = {
      locked:       { text: t('notif.swapAccepted', '{{name}} hat deinen Tausch angenommen!', { name: partner }), type: 'success' },
      shipped_a:    isUserA ? null : { text: t('notif.partnerShipped', '{{name}} hat versendet 📦', { name: partner }), type: 'info' },
      shipped_b:    isUserA ? { text: t('notif.partnerShipped', '{{name}} hat versendet 📦', { name: partner }), type: 'info' } : null,
      both_shipped: { text: t('notif.bothShipped', 'Beide haben versendet! Auf Lieferung warten ✉️'), type: 'info' },
      completed:    { text: t('notif.swapCompleted', 'Tausch abgeschlossen! +5 Reputation 🎉'), type: 'success' },
      disputed:     { text: t('notif.disputeOpened', 'Problem gemeldet — unser Team prüft den Fall ⚠️'), type: 'warning' },
      cancelled:    { text: t('notif.swapCancelled', 'Tausch wurde abgebrochen'), type: 'error' },
    };

    return messages[newStatus] ?? null;
  }, [userId, t]);

  // ── Supabase Realtime Setup ────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    // ── Kanal 1: Swap-Status-Änderungen ──────────────────────────────────────
    const swapChannel = supabase
      .channel(`swaps:${userId}`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'swaps',
          // Filter: nur Swaps wo user beteiligt ist
          // Supabase Realtime unterstützt OR-Filter noch nicht nativ →
          // beide Kanäle getrennt
        },
        (payload) => {
          const swap      = payload.new;
          const oldStatus = payload.old?.status;
          const newStatus = swap.status;

          // Nur eigene Swaps verarbeiten (clientseitiger Filter)
          if (swap.user_a_id !== userId && swap.user_b_id !== userId) return;
          if (oldStatus === newStatus) return;

          // Toast anzeigen
          const toast = getSwapToast(oldStatus, newStatus, swap);
          if (toast) showToast(toast.text, toast.type);

          // Callback für Refresh
          onSwapUpdate?.(swap);

          // E-Mail für Offline-User triggern (fire & forget)
          const recipientId = swap.user_a_id === userId ? swap.user_b_id : swap.user_a_id;
          supabase.functions.invoke('send-swap-update', {
            body: {
              swap_id:      swap.id,
              event_type:   newStatus === 'locked'   ? 'swap_accepted' :
                            newStatus.includes('shipped') ? 'swap_shipped' :
                            newStatus === 'disputed' ? 'swap_disputed' : null,
              recipient_id: recipientId,
              params:       { partnerName: userId }, // Display-Name über Profile abrufbar
            },
          }).catch(() => {}); // Fehler ignorieren — E-Mail ist nicht kritisch
        }
      )
      .subscribe();

    // ── Kanal 2: Neue Chat-Nachrichten ────────────────────────────────────────
    const messageChannel = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'swap_messages',
        },
        (payload) => {
          const msg = payload.new;

          // Eigene Nachrichten ignorieren
          if (msg.sender_id === userId) return;

          // System-Nachrichten im aktiven Swap: kein Toast (Chat zeigt sie)
          if (msg.type === 'system' && msg.swap_id === activeSwapId) return;

          // Callback für Chat-Refresh
          onNewMessage?.(msg);

          // Toast nur wenn Chat nicht offen
          if (msg.swap_id !== activeSwapId) {
            if (msg.type === 'system') {
              // System-Nachricht übersetzen
              const text = t(msg.i18n_key, msg.content, msg.i18n_params ?? {});
              showToast(`💬 ${text}`, 'info');
            } else {
              const preview = msg.content.length > 50
                ? msg.content.slice(0, 47) + '…'
                : msg.content;
              showToast(`💬 ${preview}`, 'info');
            }
          }
        }
      )
      .subscribe();

    channelsRef.current = [swapChannel, messageChannel];

    // ── last_seen_at: sofort + dann alle 60s ──────────────────────────────────
    updateLastSeen();
    lastSeenTimer.current = setInterval(updateLastSeen, LAST_SEEN_INTERVAL);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      channelsRef.current.forEach(ch => supabase.removeChannel(ch));
      channelsRef.current = [];
      if (lastSeenTimer.current) clearInterval(lastSeenTimer.current);
    };
  }, [userId, activeSwapId, getSwapToast, onSwapUpdate, onNewMessage, showToast, updateLastSeen]);

  // ── Manuell alle Kanäle trennen (z.B. bei Logout) ────────────────────────
  const disconnect = useCallback(() => {
    channelsRef.current.forEach(ch => supabase.removeChannel(ch));
    channelsRef.current = [];
    if (lastSeenTimer.current) clearInterval(lastSeenTimer.current);
  }, []);

  return { disconnect };
};

export default useNotifications;
