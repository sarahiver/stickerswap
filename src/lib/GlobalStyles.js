// src/lib/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0; padding: 0;
  }

  :root {
    --color-bg:        #0f0f1a;
    --color-surface:   #1a1a2e;
    --color-surface2:  #22223a;
    --color-accent:    #7c6fcd;
    --color-accent2:   #5de8a0;
    --color-text:      #ffffff;
    --color-text-dim:  rgba(255,255,255,0.5);
    --color-text-mute: rgba(255,255,255,0.25);
    --color-border:    rgba(255,255,255,0.07);
    --color-danger:    #ff7070;
    --color-warning:   #ffb400;
    --nav-height:      60px;
    --safe-bottom:     env(safe-area-inset-bottom, 0px);
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    touch-action: manipulation;
  }

  body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    overscroll-behavior: none;
    overflow-x: hidden;
  }

  /* RTL: body bekommt dir="rtl" wenn ar-Sprache */
  [dir="rtl"] * {
    letter-spacing: 0 !important;
  }

  button, input, textarea, select {
    font-family: inherit;
  }

  /* Touch targets */
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* Scrollbar global */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.1) transparent;
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

  /* Focus visible global */
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  :focus:not(:focus-visible) { outline: none; }
`;

export default GlobalStyles;
