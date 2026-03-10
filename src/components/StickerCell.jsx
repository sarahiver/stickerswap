import styled, { keyframes, css } from 'styled-components';
import { above } from '../theme/theme';

// ============================================================
// StickerCell + StickerGrid — Semantik-Refactor Kapitel 3
//
// StickerGrid:   <ul role="grid">   statt <div>
//                grid gibt an dass es ein 2D-Navigationsmuster ist
// StickerCell:   <li>               (Listenelement im Grid)
//                  <button>         (interaktive Zelle, touch-action)
//
// Barrierefreiheit:
//   - role="grid" + role="gridcell" ermöglicht Tastatur-Navigation
//     (Pfeiltasten zwischen Stickern)
//   - aria-label beschreibt Sticker + Status
//   - aria-pressed für Toggle-Status (have/double/need)
//   - aria-disabled für locked-Status
// ============================================================

const STATUS = {
  have:   { bg: 'rgba(74,222,174,0.08)',  border: '#4adeae', color: '#4adeae' },
  double: { bg: 'rgba(245,200,66,0.10)',  border: '#f5c842', color: '#f5c842' },
  need:   { bg: 'rgba(42,42,58,0.50)',    border: '#2a2a3a', color: '#6b6b8a' },
  locked: { bg: 'rgba(232,67,90,0.08)',   border: '#e8435a', color: '#e8435a' },
};

const STATUS_LABELS = {
  have:   'vorhanden',
  double: 'doppelt',
  need:   'fehlt',
  locked: 'im Tausch gesperrt',
};

const press = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(0.90); }
  100% { transform: scale(1); }
`;

// <ul role="grid">: Grid-Widget für 2D-Tastatur-Navigation
export const StickerGrid = styled.ul.attrs({ role: 'grid' })`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;

  ${above('md')} {
    grid-template-columns: repeat(10, 1fr);
    gap: 8px;
  }
  ${above('lg')} {
    grid-template-columns: repeat(14, 1fr);
    gap: 8px;
  }
`;

// <li role="gridcell">: Zelle im Grid-Widget
const CellItem = styled.li.attrs({ role: 'gridcell' })`
  /* li selbst hat keine visuelle Darstellung */
  display: contents; /* Zelle füllt direkt den Grid-Slot aus */
`;

// <button>: interaktives Element — kein div!
// aria-label: "Sticker #42 — doppelt" → Screen-Reader spricht es vor
const CellBtn = styled.button`
  /* PRINZIP 3: min 44×44px */
  min-height: ${({ theme }) => theme.touch.min};
  width: 100%;
  aspect-ratio: 3 / 4;

  border-radius: ${({ theme }) => theme.radius.sm};
  border: 2px solid ${({ $s }) => STATUS[$s]?.border || STATUS.need.border};
  background:     ${({ $s }) => STATUS[$s]?.bg     || STATUS.need.bg};
  color:          ${({ $s }) => STATUS[$s]?.color  || STATUS.need.color};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;

  position: relative;
  overflow: visible;

  /* PRINZIP 5: kein 300ms-Tap-Delay */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  transition: border-color 0.15s, background 0.15s;

  &:active:not([aria-disabled="true"]) {
    animation: ${press} 0.18s ease both;
  }

  /* Locked: cursor zeigt Nicht-Verfügbarkeit an */
  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.7;
  }

  /* Double-badge oben rechts */
  ${({ $s, $count }) =>
    $s === 'double' && $count > 1 &&
    css`
      &::after {
        content: '×${$count}';
        position: absolute;
        top: -6px; right: -6px;
        background: ${({ theme }) => theme.colors.accent};
        color: ${({ theme }) => theme.colors.bg};
        font-family: ${({ theme }) => theme.fonts.mono};
        font-size: 9px;
        font-weight: 700;
        padding: 2px 4px;
        border-radius: 4px;
        line-height: 1;
        pointer-events: none;
      }
    `}
`;

// Sticker-Nummer: <span> mit visuell verborgenem Präfix für SR
const Num = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  opacity: 0.7;
  line-height: 1;
`;

// Sticker-Icon: aria-hidden (dekorativ, nicht informativ)
const StickerIcon = styled.span.attrs({ 'aria-hidden': true })`
  font-size: 16px;
  line-height: 1;
`;

// ── Component ─────────────────────────────────────────────────
const StickerCell = ({ number, icon = '⚽', status = 'need', count = 1, onClick }) => {
  const label    = `Sticker #${number} — ${STATUS_LABELS[status] || status}`;
  const isLocked = status === 'locked';

  return (
    // <li role="gridcell"> → <button>
    // display: contents auf CellItem sorgt dafür dass der button
    // direkt in der Grid-Zelle sitzt ohne Box-Model-Bruch
    <CellItem aria-label={label}>
      <CellBtn
        $s={status}
        $count={count}
        onClick={isLocked ? undefined : onClick}
        aria-label={label}
        aria-pressed={status === 'have' || status === 'double' ? true : false}
        aria-disabled={isLocked ? 'true' : undefined}
        type="button"
      >
        <Num>#{number}</Num>
        <StickerIcon>{icon}</StickerIcon>
      </CellBtn>
    </CellItem>
  );
};

export default StickerCell;
