// ============================================================
// RTL Helpers — Kapitel 1
//
// CSS Logical Properties ersetzen physische Eigenschaften.
// Damit spiegeln sich Layouts automatisch für Arabisch (RTL).
//
// REGELN:
//   margin-left  → margin-inline-start
//   margin-right → margin-inline-end
//   padding-left → padding-inline-start
//   text-align: left → text-align: start
//   border-left  → border-inline-start
//   left: 0      → inset-inline-start: 0
//
// Diese Datei exportiert helper-css-Funktionen die in
// Styled Components verwendet werden können.
// ============================================================

import { css } from 'styled-components'

// Margin-Helpers (inline = horizontal = RTL-aware)
export const marginStart  = (val) => css`margin-inline-start:  ${val};`
export const marginEnd    = (val) => css`margin-inline-end:    ${val};`
export const paddingStart = (val) => css`padding-inline-start: ${val};`
export const paddingEnd   = (val) => css`padding-inline-end:   ${val};`

// Border-Helpers
export const borderStart  = (val) => css`border-inline-start: ${val};`
export const borderEnd    = (val) => css`border-inline-end:   ${val};`

// Position-Helpers
export const insetStart   = (val) => css`inset-inline-start:  ${val};`
export const insetEnd     = (val) => css`inset-inline-end:    ${val};`

// Text-Alignment
export const textStart    = css`text-align: start;`
export const textEnd      = css`text-align: end;`

// ── RTL-spezifische Überschreibungen via Styled Components ──
// Verwendung: ${rtlOnly`transform: scaleX(-1);`}
export const rtlOnly = (...args) => css`
  [dir="rtl"] & { ${css(...args)} }
`
export const ltrOnly = (...args) => css`
  [dir="ltr"] & { ${css(...args)} }
`

// ── Beispiel-Anwendung ───────────────────────────────────────
//
// VORHER (bricht RTL):
//   const Icon = styled.div`
//     margin-left: 8px;
//     border-left: 2px solid gold;
//   `
//
// NACHHER (RTL-kompatibel):
//   import { marginStart, borderStart } from '../theme/rtl'
//   const Icon = styled.div`
//     ${marginStart('8px')}
//     ${borderStart('2px solid gold')}
//   `
//
// Im Browser:
//   LTR → margin-left: 8px  + border-left: 2px solid gold
//   RTL → margin-right: 8px + border-right: 2px solid gold
