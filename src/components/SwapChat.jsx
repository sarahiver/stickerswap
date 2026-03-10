// src/components/SwapChat.jsx
// Kapitel 6 — Mini-Chat innerhalb SwapDetailView
// RTL: Sprechblasen gespiegelt, System-Nachrichten zentriert
// Dispute-Button öffnet Dialog mit Pflichtfeld

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

// ─── Animationen ─────────────────────────────────────────────────────────────
const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

// ─── Styled Components ────────────────────────────────────────────────────────
const ChatSection = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const ChatHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 10px;
`;

const ChatTitle = styled.h2`
  font-size: 13px; font-weight: 700;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase; letter-spacing: 0.6px;
  margin: 0;
`;

const DisputeBtn = styled.button`
  font-size: 11px; font-weight: 700;
  color: rgba(255,100,100,0.8);
  background: rgba(255,80,80,0.1);
  border: 1px solid rgba(255,80,80,0.2);
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  touch-action: manipulation;
  min-height: 32px;
  transition: all 150ms;
  &:hover, &:focus-visible {
    background: rgba(255,80,80,0.18);
    outline: none;
  }
  &:disabled { opacity: 0.4; pointer-events: none; }
`;

// Nachrichtenliste — scrollbar
const MessageList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  min-height: 180px;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.08) transparent;
`;

const MessageItem = styled.li`
  animation: ${fadeSlideUp} 200ms ease;
  display: flex;
  flex-direction: column;
  /* RTL: eigene Nachrichten rechts → bei RTL links */
  align-items: ${({ $own }) => $own ? 'flex-end' : 'flex-start'};

  [dir="rtl"] & {
    align-items: ${({ $own }) => $own ? 'flex-start' : 'flex-end'};
  }
`;

const Bubble = styled.div`
  max-width: 78%;
  padding: 8px 12px;
  border-radius: ${({ $own }) =>
    $own ? '14px 14px 4px 14px' : '14px 14px 14px 4px'};
  font-size: 13px;
  line-height: 1.45;
  word-break: break-word;
  white-space: pre-wrap;

  /* RTL: Border-Radius spiegeln */
  [dir="rtl"] & {
    border-radius: ${({ $own }) =>
      $own ? '14px 14px 14px 4px' : '14px 14px 4px 14px'};
  }

  ${({ $own }) => $own
    ? css`
        background: var(--color-accent, #7c6fcd);
        color: #fff;
      `
    : css`
        background: rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.85);
      `
  }
`;

// System-Nachrichten: zentriert, kein Bubble
const SystemMessage = styled.div`
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  font-style: italic;
  padding: 4px 0;
  position: relative;

  &::before, &::after {
    content: '';
    display: inline-block;
    width: 30px;
    height: 1px;
    background: rgba(255,255,255,0.1);
    vertical-align: middle;
    margin: 0 6px;
  }
`;

const MsgTime = styled.time`
  font-size: 10px;
  color: rgba(255,255,255,0.25);
  margin-top: 2px;
  padding: 0 4px;
`;

// Input
const InputRow = styled.form`
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const TextArea = styled.textarea`
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  padding: 10px 12px;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.4;
  font-family: inherit;
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus {
    outline: 2px solid var(--color-accent, #7c6fcd);
    outline-offset: -1px;
    border-color: transparent;
  }
  /* RTL: text-align auto via dir-Attribut */
`;

const SendBtn = styled.button`
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent, #7c6fcd);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  touch-action: manipulation;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 150ms, transform 150ms;
  &:active { transform: scale(0.92); }
  &:disabled { opacity: 0.4; pointer-events: none; }
  &:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
`;

const Spinner = styled.span`
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 600ms linear infinite;
  display: inline-block;
`;

const CharCount = styled.span`
  font-size: 10px;
  color: ${({ $over }) => $over ? '#ff7070' : 'rgba(255,255,255,0.25)'};
  align-self: flex-end;
  padding-bottom: 12px;
  flex-shrink: 0;
`;

// Dispute Dialog
const DisputeOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  display: flex; align-items: flex-end;
`;

const DisputeSheet = styled.dialog`
  width: 100%; margin: 0;
  background: var(--color-surface, #1a1a2e);
  border-radius: 20px 20px 0 0;
  border: none;
  padding: 20px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  &:focus { outline: none; }
  &::backdrop { display: none; }
`;

const DisputeTitle = styled.h2`
  font-size: 17px; font-weight: 800; color: #fff; margin: 0 0 6px;
`;

const DisputeHint = styled.p`
  font-size: 13px; color: rgba(255,255,255,0.4); margin: 0 0 14px;
`;

const DisputeTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  padding: 12px;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus { outline: 2px solid #ff7070; outline-offset: -1px; border-color: transparent; }
`;

const DisputeBtns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
`;

const DBtn = styled.button`
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-size: 14px; font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  min-height: 44px;
  transition: opacity 150ms;
  &:disabled { opacity: 0.4; pointer-events: none; }
  ${({ $variant }) => $variant === 'danger'
    ? css`background: rgba(255,80,80,0.2); color: #ff7070; border: 1px solid rgba(255,80,80,0.3);`
    : css`background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.6);`
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatMsgTime = (iso) =>
  new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

const MAX_CHARS = 500;

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
const SwapChat = ({
  swapId,
  swap,          // vollständiges Swap-Objekt
  currentUserId,
  onDisputeOpened,
}) => {
  const { t }         = useTranslation();
  const listRef       = useRef(null);
  const inputRef      = useRef(null);

  const [messages,       setMessages]       = useState([]);
  const [inputValue,     setInputValue]     = useState('');
  const [sending,        setSending]        = useState(false);
  const [showDispute,    setShowDispute]    = useState(false);
  const [disputeReason,  setDisputeReason]  = useState('');
  const [disputeSending, setDisputeSending] = useState(false);
  const [loadingMsgs,    setLoadingMsgs]    = useState(true);

  const isClosed  = ['completed','cancelled','expired'].includes(swap?.status);
  const isDisputed = swap?.status === 'disputed';

  // ── Nachrichten laden ──────────────────────────────────────────────────────
  const loadMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('swap_messages')
      .select('*')
      .eq('swap_id', swapId)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data ?? []);
    setLoadingMsgs(false);
  }, [swapId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // ── Realtime: neue Nachrichten ─────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${swapId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'swap_messages',
        filter: `swap_id=eq.${swapId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        // Als gelesen markieren wenn Chat offen
        supabase.rpc('mark_messages_read', { p_swap_id: swapId }).catch(() => {});
      })
      .subscribe();

    // Beim Öffnen: als gelesen markieren
    supabase.rpc('mark_messages_read', { p_swap_id: swapId }).catch(() => {});

    return () => supabase.removeChannel(channel);
  }, [swapId]);

  // ── Auto-Scroll nach unten ─────────────────────────────────────────────────
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Nachricht senden ───────────────────────────────────────────────────────
  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || sending || text.length > MAX_CHARS) return;

    setSending(true);
    setInputValue('');

    const { error } = await supabase.rpc('send_chat_message', {
      p_swap_id: swapId,
      p_content: text,
    });

    if (error) {
      setInputValue(text); // Restore on error
      // Toast via Parent
    }
    setSending(false);
    inputRef.current?.focus();
  }, [inputValue, sending, swapId]);

  // Enter ohne Shift = Senden
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Dispute öffnen ─────────────────────────────────────────────────────────
  const handleOpenDispute = useCallback(async () => {
    if (disputeReason.trim().length < 10) return;
    setDisputeSending(true);

    const { error } = await supabase.rpc('open_dispute', {
      p_swap_id: swapId,
      p_reason:  disputeReason.trim(),
    });

    if (!error) {
      setShowDispute(false);
      setDisputeReason('');
      onDisputeOpened?.();
    }
    setDisputeSending(false);
  }, [swapId, disputeReason, onDisputeOpened]);

  // ── System-Nachricht rendern ───────────────────────────────────────────────
  const renderSystemMsg = (msg) => {
    const text = msg.i18n_key
      ? t(msg.i18n_key, msg.content, msg.i18n_params ?? {})
      : msg.content;
    return (
      <MessageItem key={msg.id}>
        <SystemMessage role="status" aria-live="polite">
          {text}
        </SystemMessage>
      </MessageItem>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <ChatSection aria-label={t('chat.label', 'Nachrichten')}>
      {/* ── Header ── */}
      <ChatHeader>
        <ChatTitle>{t('chat.title', 'Nachrichten')}</ChatTitle>
        {!isClosed && !isDisputed && (
          <DisputeBtn
            onClick={() => setShowDispute(true)}
            aria-label={t('chat.reportProblem', 'Problem melden')}
          >
            ⚠️ {t('chat.reportProblem', 'Problem melden')}
          </DisputeBtn>
        )}
        {isDisputed && (
          <span style={{ fontSize: 11, color: '#ff9900', fontWeight: 700 }}>
            ⚠️ {t('chat.disputed', 'In Prüfung')}
          </span>
        )}
      </ChatHeader>

      {/* ── Nachrichtenliste ── */}
      <MessageList
        ref={listRef}
        aria-label={t('chat.messageList', 'Nachrichtenverlauf')}
        aria-live="polite"
        aria-relevant="additions"
      >
        {loadingMsgs && (
          <li style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, padding: 16 }}>
            {t('common.loading', 'Lädt…')}
          </li>
        )}

        {!loadingMsgs && messages.length === 0 && (
          <li style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, padding: 16 }}>
            {t('chat.empty', 'Noch keine Nachrichten — schreib als Erster!')}
          </li>
        )}

        {messages.map(msg => {
          if (msg.type === 'system' || msg.type === 'status_change') {
            return renderSystemMsg(msg);
          }

          const isOwn = msg.sender_id === currentUserId;
          return (
            <MessageItem key={msg.id} $own={isOwn}>
              <Bubble
                $own={isOwn}
                role="article"
                aria-label={isOwn
                  ? t('chat.ownMessage', 'Deine Nachricht')
                  : t('chat.partnerMessage', 'Nachricht des Partners')
                }
              >
                {msg.content}
              </Bubble>
              <MsgTime dateTime={msg.created_at}>
                {formatMsgTime(msg.created_at)}
              </MsgTime>
            </MessageItem>
          );
        })}
      </MessageList>

      {/* ── Input ── */}
      {!isClosed && !isDisputed && (
        <InputRow
          onSubmit={handleSend}
          aria-label={t('chat.inputForm', 'Nachricht schreiben')}
        >
          <TextArea
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('chat.inputPlaceholder', 'Nachricht…')}
            aria-label={t('chat.inputLabel', 'Nachricht eingeben')}
            maxLength={MAX_CHARS + 10}   // Soft limit, harte Validierung in RPC
            rows={1}
          />
          <CharCount $over={inputValue.length > MAX_CHARS} aria-hidden="true">
            {inputValue.length}/{MAX_CHARS}
          </CharCount>
          <SendBtn
            type="submit"
            disabled={!inputValue.trim() || sending || inputValue.length > MAX_CHARS}
            aria-label={t('chat.send', 'Senden')}
          >
            {sending ? <Spinner aria-hidden="true" /> : <span aria-hidden="true">→</span>}
          </SendBtn>
        </InputRow>
      )}

      {isClosed && (
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', padding: '8px 0' }}>
          {t('chat.closed', 'Chat ist geschlossen')}
        </p>
      )}

      {/* ── Dispute Dialog ── */}
      {showDispute && (
        <DisputeOverlay
          onClick={(e) => e.target === e.currentTarget && setShowDispute(false)}
          aria-hidden={!showDispute}
        >
          <DisputeSheet
            open
            aria-modal="true"
            aria-labelledby="dispute-title"
            onKeyDown={e => e.key === 'Escape' && setShowDispute(false)}
          >
            <DisputeTitle id="dispute-title">
              ⚠️ {t('dispute.title', 'Problem melden')}
            </DisputeTitle>
            <DisputeHint>
              {t('dispute.hint', 'Beschreibe das Problem. Die Token bleiben gesperrt, bis unser Team den Fall geprüft hat.')}
            </DisputeHint>
            <DisputeTextarea
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              placeholder={t('dispute.placeholder', 'Was ist das Problem? (mind. 10 Zeichen)')}
              aria-label={t('dispute.reasonLabel', 'Problembeschreibung')}
              rows={4}
              autoFocus
            />
            <DisputeBtns>
              <DBtn onClick={() => setShowDispute(false)} aria-label={t('common.cancel', 'Abbrechen')}>
                {t('common.cancel', 'Abbrechen')}
              </DBtn>
              <DBtn
                $variant="danger"
                onClick={handleOpenDispute}
                disabled={disputeReason.trim().length < 10 || disputeSending}
                aria-label={t('dispute.submit', 'Problem einreichen')}
              >
                {disputeSending
                  ? <Spinner aria-hidden="true" />
                  : t('dispute.submit', 'Einreichen')}
              </DBtn>
            </DisputeBtns>
          </DisputeSheet>
        </DisputeOverlay>
      )}
    </ChatSection>
  );
};

export default SwapChat;
