// ============================================================
// StickerSwap — Design Tokens
// Kapitel 0: Design-Philosophie & Mobile-First
//
// ALLE Farben, Abstände, Breakpoints etc. sind hier zentral
// definiert. Niemals Hardcode-Werte in Komponenten!
// Zugriff via: props.theme.colors.accent etc.
// ============================================================

export const theme = {
  colors: {
    bg:       '#0a0a0f',
    surface:  '#12121a',
    surface2: '#1a1a26',
    border:   '#2a2a3a',
    accent:   '#f5c842',   // Gold  — Primär, CTAs
    accent2:  '#e8435a',   // Rot   — Danger, Badges
    accent3:  '#4adeae',   // Mint  — Success, verified
    text:     '#f0f0f5',
    muted:    '#6b6b8a',
    overlay:  'rgba(0,0,0,0.75)',
  },

  fonts: {
    display: "'Bebas Neue', cursive",
    body:    "'DM Sans', sans-serif",
    mono:    "'Space Mono', monospace",
  },

  spacing: {
    xs:  '4px',
    sm:  '8px',
    md:  '16px',
    lg:  '24px',
    xl:  '32px',
    xxl: '48px',
  },

  radius: {
    sm:    '8px',
    md:    '12px',
    lg:    '16px',
    xl:    '20px',
    pill:  '100px',
    sheet: '20px 20px 0 0',
  },

  // MOBILE BREAKPOINTS
  // Wir schreiben Mobile-First: Base = Mobile, then override upwards
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
  },

  // Apple HIG + WCAG 2.5.5 — min 44x44px touch targets
  touch: {
    min: '44px',
  },

  shadows: {
    card:  '0 4px 24px rgba(0,0,0,0.4)',
    sheet: '0 -8px 40px rgba(0,0,0,0.6)',
    glow:  '0 0 20px rgba(245,200,66,0.25)',
  },

  zIndex: {
    base:    0,
    card:    10,
    sticky:  100,
    overlay: 190,
    sheet:   200,
    toast:   300,
  },
};

// ── Responsive helpers ──────────────────────────────────────
// Verwendung: ${above('md')} { ... }
export const above = (bp) => `@media (min-width: ${theme.breakpoints[bp]})`;
export const below = (bp) => `@media (max-width: ${theme.breakpoints[bp]})`;
