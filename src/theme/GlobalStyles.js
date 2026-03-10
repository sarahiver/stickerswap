import { createGlobalStyle } from 'styled-components';

// ============================================================
// GlobalStyles — Kapitel 0: Mobile-First Prinzipien
//
// ALLE 5 Prinzipien sind hier verankert.
// Diese Datei wird einmal in App.js eingebunden.
// ============================================================

const GlobalStyles = createGlobalStyle`

  /* ── Reset ─────────────────────────────────────────────── */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── PRINZIP 5: touch-action: manipulation ──────────────
     Eliminiert die 300ms Tap-Verzögerung auf ALLEN mobilen
     Browsern (Chrome Android, Safari iOS, Samsung Browser).
     'manipulation' = Tap + Pinch-Zoom erlaubt,
     Double-Tap-Zoom blockiert (das verursacht den Delay).    */
  * {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    /* Verhindert ungewollte Text-Selektion bei schnellen Taps */
    -webkit-touch-callout: none;
  }

  /* ── PRINZIP 4: Kein horizontales Scrollen ──────────────
     overflow-x: hidden auf BEIDEN Elementen nötig:
     - html: verhindert Scrollbar-bedingten Layout-Shift
     - body: verhindert Overflow durch absolute Elemente      */
  html {
    overflow-x: hidden;
    scroll-behavior: smooth;
    /* Verhindert Font-Größen-Anpassung durch iOS Safari
       bei Landscape-Orientierung                             */
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    overflow-x: hidden;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px;
    line-height: 1.5;
    /* Verhindert iOS Overscroll-Bounce (wichtig für Sheets) */
    overscroll-behavior: none;
    /* Smooth Scrolling mit Momentum auf iOS               */
    -webkit-overflow-scrolling: touch;
  }

  /* ── PRINZIP 3: Mindest-Touch-Target 44×44px ───────────
     Gilt für ALLE interaktiven Elemente global.
     Einzelne Komponenten können größer sein, nie kleiner.    */
  button,
  a,
  [role="button"],
  [role="tab"],
  [role="menuitem"],
  input[type="checkbox"],
  input[type="radio"],
  select {
    min-height: ${({ theme }) => theme.touch.min};
    cursor: pointer;
  }

  button {
    border: none;
    background: none;
    font-family: inherit;
    color: inherit;
  }

  /* ── iOS Safari Input-Zoom verhindern ──────────────────
     font-size < 16px auf Input → iOS zoomt automatisch rein.
     Das ist extrem störend. Immer >= 16px auf Inputs setzen. */
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: 16px;
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img, video, svg {
    max-width: 100%;
    display: block;
  }

  /* ── Scrollable Container Helper ───────────────────────
     Überall wo gescrollt wird: Klasse .scroll-y verwenden   */
  .scroll-y {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  /* ── Safe Area Utilities ────────────────────────────────
     iPhone X+ hat Notch oben und Home-Indicator unten.
     env(safe-area-inset-*) gibt den nötigen Abstand.         */
  .safe-top    { padding-top:    env(safe-area-inset-top, 0px); }
  .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
  .safe-left   { padding-left:   env(safe-area-inset-left, 0px); }
  .safe-right  { padding-right:  env(safe-area-inset-right, 0px); }

  /* ── Focus Styles (Accessibility) ──────────────────────
     Sichtbarer Fokus-Ring für Keyboard-Navigation           */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 4px;
  }
  :focus:not(:focus-visible) {
    outline: none;
  }
`;

export default GlobalStyles;
