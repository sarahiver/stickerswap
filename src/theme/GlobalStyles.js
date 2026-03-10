import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  * { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
  html { overflow-x: hidden; scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body {
    overflow-x: hidden;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 16px; line-height: 1.5;
    overscroll-behavior: none; -webkit-overflow-scrolling: touch;
  }
  button, a, [role="button"], [role="tab"], select, input[type="checkbox"] {
    min-height: ${({ theme }) => theme.touch.min}; cursor: pointer;
  }
  button { border: none; background: none; font-family: inherit; color: inherit; }
  input, select, textarea { font-family: inherit; font-size: 16px; color: inherit; }
  a { color: inherit; text-decoration: none; }
  img, video, svg { max-width: 100%; display: block; }

  /* RTL: Arabic font + line-height */
  :lang(ar) { font-family: 'Segoe UI','Tahoma','Arial',sans-serif; line-height: 1.8; }

  .scroll-y { overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; }
  .safe-top    { padding-top:            env(safe-area-inset-top, 0px); }
  .safe-bottom { padding-bottom:         env(safe-area-inset-bottom, 0px); }
  .safe-left   { padding-inline-start:   env(safe-area-inset-left, 0px); }
  .safe-right  { padding-inline-end:     env(safe-area-inset-right, 0px); }

  :focus-visible { outline: 2px solid ${({ theme }) => theme.colors.accent}; outline-offset: 2px; border-radius: 4px; }
  :focus:not(:focus-visible) { outline: none; }

  [dir="rtl"] .icon-directional { transform: scaleX(-1); }
`
export default GlobalStyles
