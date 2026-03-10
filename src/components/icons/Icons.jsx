import React from 'react'
import styled, { css } from 'styled-components'

// ============================================================
// Icons — Kapitel 2: Icon-First Design System
// Touch-Target: min 44×44px (Prinzip 3)
// RTL: icon-directional Klasse für gespiegelte Richtungs-Icons
// ============================================================

const IconBase = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
  user-select: none;
`

// ── SVG Icons ──────────────────────────────────────────────────
const ICONS = {
  home:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  album:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  swap:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  profile:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  search:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
  settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  close:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="20,6 9,17 4,12"/></svg>,
  chevronR: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="icon-directional"><polyline points="9,18 15,12 9,6"/></svg>,
  chevronL: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="icon-directional"><polyline points="15,18 9,12 15,6"/></svg>,
  star:     <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  lock:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  globe:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  local:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  coin:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>,
  shield:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  match:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  send:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="icon-directional"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
}

// ── Icon Component ────────────────────────────────────────────
export const Icon = ({ name, size = 20, color, className, style }) => {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <IconBase className={className} style={{ width: size, height: size, color: color || 'currentColor', ...style }} aria-hidden="true">
      {React.cloneElement(icon, { width: size, height: size })}
    </IconBase>
  )
}

// ── Icon Button — 44px touch target ──────────────────────────
const BtnWrap = styled.button`
  min-width:  ${({ theme }) => theme.touch.min};
  min-height: ${({ theme }) => theme.touch.min};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.muted};
  transition: color 0.15s, background 0.15s;
  padding: 6px;
  &:active { background: ${({ theme }) => theme.colors.surface2}; }
  ${({ $danger }) => $danger && css`color: ${({ theme }) => theme.colors.accent2};`}
`

export const IconBtn = ({ name, size = 22, label, active, danger, onClick, style }) => (
  <BtnWrap onClick={onClick} aria-label={label} title={label} $active={active} $danger={danger} style={style}>
    <Icon name={name} size={size} />
  </BtnWrap>
)

// ── Flag Icon: ISO-3166-1 → Emoji ─────────────────────────────
const toFlagEmoji = (code) => {
  if (!code || code.length !== 2) return '🌐'
  return [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('')
}

export const FlagIcon = ({ code, size = 20 }) => (
  <IconBase style={{ fontSize: size, lineHeight: 1 }} aria-label={code}>
    {toFlagEmoji(code)}
  </IconBase>
)

// ── Status Dot ────────────────────────────────────────────────
const STATUS_COLORS = {
  have: '#4adeae', double: '#f5c842', need: '#6b6b8a', locked: '#e8435a',
  completed: '#4adeae', pending: '#f5c842', disputed: '#e8435a',
}

export const StatusDot = ({ status, size = 8 }) => (
  <span style={{
    display: 'inline-block',
    width: size, height: size,
    borderRadius: '50%',
    background: STATUS_COLORS[status] || '#6b6b8a',
    flexShrink: 0,
  }} />
)

// ── Language Icon ─────────────────────────────────────────────
export const LanguageIcon = ({ langCode, showName = false, LANGUAGES }) => {
  const lang = LANGUAGES?.[langCode]
  if (!lang) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
      <span style={{ fontSize: 18 }}>{lang.flag}</span>
      {showName && <span style={{ color: '#6b6b8a' }}>{lang.nativeName}</span>}
    </span>
  )
}
