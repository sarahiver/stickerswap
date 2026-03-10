import styled, { keyframes } from 'styled-components';

// ============================================================
// ProgressBar — Semantik-Refactor Kapitel 3
//
// Nutzt natives <progress>-Element. Vorteil:
//   - aria-valuenow/valuemin/valuemax automatisch
//   - Screen-Reader kündigt Fortschritt an
//   - Kein role="progressbar" manuell nötig
//
// CSS: appearance: none + vendor-prefixed Pseudo-Elemente
//      für Track + Fill.
// ============================================================

const fill = keyframes`
  from { width: 0%; }
`;

// Wrapper für konsistente Höhe und border-radius
const ProgressWrap = styled.div`
  width: 100%;
  height: ${({ $h }) => $h || '8px'};
  border-radius: 100px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface2};
  position: relative;
`;

// Nativer <progress>-Balken — vollständig restyled
const ProgressEl = styled.progress`
  /* Reset browser-native styles */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent; /* Track kommt vom Wrapper */

  /* Webkit: Track + Fill */
  &::-webkit-progress-bar   { background: transparent; }
  &::-webkit-progress-value {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent3},
      ${({ theme }) => theme.colors.accent}
    );
    border-radius: 100px;
    /* Animation via JS-gesteuerte width ist hier nicht nötig —
       der Browser interpoliert value-Änderungen automatisch */
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Firefox: Fill */
  &::-moz-progress-bar {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent3},
      ${({ theme }) => theme.colors.accent}
    );
    border-radius: 100px;
  }
`;

const ProgressBar = ({ value, max = 100, height, label }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <ProgressWrap $h={height}>
      <ProgressEl
        value={value}
        max={max}
        // aria-label für Screen-Reader wenn kein sichtbares Label
        aria-label={label || `${pct}% abgeschlossen`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </ProgressWrap>
  );
};

export default ProgressBar;
