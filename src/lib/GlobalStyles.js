import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

  :root {
    --bg:        #0a0a0f;
    --surface:   #12121a;
    --surface2:  #1a1a26;
    --border:    #2a2a3a;
    --accent:    #f5c842;
    --accent2:   #e8435a;
    --accent3:   #4adeae;
    --accent4:   #7c6fcd;
    --text:      #f0f0f5;
    --text2:     #b0b0c8;
    --muted:     #6b6b8a;
    --success:   #4adeae;
    --warning:   #f5c842;
    --danger:    #e8435a;

    --font-display: 'Bebas Neue', cursive;
    --font-body:    'DM Sans', sans-serif;
    --font-mono:    'Space Mono', monospace;

    --radius-sm: 8px;
    --radius:    10px;
    --radius-lg: 14px;
    --radius-xl: 16px;
    --radius-2xl: 20px;

    --shadow:    0 4px 24px rgba(0,0,0,0.5);
    --shadow-lg: 0 8px 48px rgba(0,0,0,0.6);
    --ease:      cubic-bezier(0.4, 0, 0.2, 1);

    --nav-height: 64px;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    line-height: 1.5;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  #root { min-height: 100vh; display: flex; flex-direction: column; }

  h1,h2,h3,h4,h5,h6 {
    font-family: var(--font-display);
    letter-spacing: 0.04em;
    line-height: 1;
  }

  a { color: var(--accent); text-decoration: none; }
  a:hover { opacity: 0.85; }

  button {
    font-family: var(--font-body);
    cursor: pointer;
    border: none;
    background: none;
    -webkit-tap-highlight-color: transparent;
  }

  input, select, textarea {
    font-family: var(--font-body);
    color: var(--text);
  }

  ::selection { background: rgba(245,200,66,0.25); color: var(--text); }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

  :focus-visible { outline: 2px solid var(--accent3); outline-offset: 2px; }

  /* ── GLOBAL BUTTON CLASSES ── */
  .btn {
    padding: 10px 20px;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s var(--ease);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    text-decoration: none;
    white-space: nowrap;
  }
  .btn-primary  { background: var(--accent); color: #0a0a0f; }
  .btn-primary:hover { background: #f7d45c; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(245,200,66,0.3); }
  .btn-secondary { background: transparent; color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger   { background: var(--accent2); color: #fff; }
  .btn-danger:hover { background: #f05570; transform: translateY(-1px); }
  .btn-success  { background: var(--accent3); color: #0a0a0f; }
  .btn-success:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-ghost    { background: transparent; color: var(--muted); }
  .btn-ghost:hover { color: var(--text); }
  .btn-sm { padding: 6px 14px; font-size: 13px; }
  .btn-lg { padding: 14px 28px; font-size: 16px; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

  /* ── TAGS ── */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 100px; font-size: 12px; font-weight: 600;
  }
  .tag-green  { background: rgba(74,222,174,0.1);  color: var(--accent3); border: 1px solid rgba(74,222,174,0.2); }
  .tag-yellow { background: rgba(245,200,66,0.1);  color: var(--accent);  border: 1px solid rgba(245,200,66,0.2); }
  .tag-red    { background: rgba(232,67,90,0.1);   color: var(--accent2); border: 1px solid rgba(232,67,90,0.2); }
  .tag-violet { background: rgba(124,111,205,0.1); color: var(--accent4); border: 1px solid rgba(124,111,205,0.2); }

  /* ── TRUST BADGES ── */
  .trust-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; padding: 3px 8px; border-radius: 100px; font-weight: 600;
  }
  .trust-badge.verified { background: rgba(74,222,174,0.1); color: var(--accent3); border: 1px solid rgba(74,222,174,0.2); }
  .trust-badge.premium  { background: rgba(245,200,66,0.1); color: var(--accent);  border: 1px solid rgba(245,200,66,0.2); }

  /* ── STICKER CELLS (Album Grid) ── */
  .sticker-cell {
    aspect-ratio: 3/4;
    border-radius: var(--radius-sm);
    border: 2px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s var(--ease);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    position: relative;
    overflow: hidden;
    background: var(--surface);
    box-shadow: 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset;
  }
  .sticker-cell:hover { transform: scale(1.08); z-index: 2; box-shadow: 0 6px 20px rgba(0,0,0,0.6); }
  .sticker-cell .num { font-size: 10px; color: var(--muted); }
  .sticker-cell .initial { font-size: 14px; font-weight: 800; }

  .sticker-cell.have   { border-color: var(--accent3); background: rgba(74,222,174,0.08); color: var(--accent3); }
  .sticker-cell.double { border-color: var(--accent);  background: rgba(245,200,66,0.1);  color: var(--accent); }
  .sticker-cell.double::after {
    content: attr(data-count);
    position: absolute; top: 3px; right: 4px;
    font-size: 9px; background: var(--accent); color: var(--bg);
    border-radius: 4px; padding: 1px 3px; line-height: 1;
  }
  .sticker-cell.need { border-color: var(--border); color: var(--muted); opacity: 0.45; }

  /* ── KPI CARDS ── */
  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .kpi-card:hover { border-color: rgba(245,200,66,0.2); }
  .kpi-label { font-size: 12px; color: var(--muted); margin-bottom: 8px; letter-spacing: 0.04em; text-transform: uppercase; font-family: var(--font-mono); }
  .kpi-val   { font-family: var(--font-display); font-size: 38px; color: var(--accent); line-height: 1; }
  .kpi-sub   { font-size: 12px; color: var(--muted); margin-top: 4px; }

  /* ── PROGRESS BAR ── */
  .progress-bar { background: var(--surface2); border-radius: 100px; height: 8px; overflow: hidden; }
  .progress-fill {
    height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, var(--accent3), var(--accent));
    transition: width 0.6s var(--ease);
  }

  /* ── FORM ELEMENTS ── */
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--muted); }
  .form-input {
    width: 100%; padding: 12px 16px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); color: var(--text);
    font-family: var(--font-body); font-size: 15px;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(245,200,66,0.12);
  }
  .form-input::placeholder { color: var(--muted); }

  /* ── GLASS ── */
  .glass {
    background: rgba(18,18,26,0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(74,222,174,0.1);
  }

  /* ── DIVIDER ── */
  .divider { border: none; border-top: 1px solid var(--border); }

  /* ── SKELETON ── */
  .skeleton {
    background: linear-gradient(90deg, var(--surface2) 25%, var(--surface) 50%, var(--surface2) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: var(--radius-sm);
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0) rotate(-1deg); }
    50%     { transform: translateY(-10px) rotate(1deg); }
  }
  @keyframes float2 {
    0%,100% { transform: translateY(0) rotate(2deg); }
    50%     { transform: translateY(-14px) rotate(-1deg); }
  }
  @keyframes pulseDot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%     { opacity: 0.4; transform: scale(0.8); }
  }
  @keyframes glowCta {
    0%,100% { box-shadow: 0 0 20px rgba(245,200,66,0.2), 0 4px 24px rgba(0,0,0,0.4); }
    50%     { box-shadow: 0 0 48px rgba(245,200,66,0.5), 0 4px 24px rgba(0,0,0,0.4); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.75) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
  }
`;

export default GlobalStyles;
