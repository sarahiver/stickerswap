import styled, { keyframes, css } from 'styled-components';
import { above } from '../theme/theme';

// ============================================================
// StickerCell + StickerGrid — Kapitel 0: Prinzip 3
//
// StickerCell: min 44x44px touch target
// StickerGrid: 7 Spalten Mobile → 10 Tablet → 14 Desktop
// Status: 'have' | 'double' | 'need' | 'locked'
// ============================================================

const STATUS = {
  have:   { bg: 'rgba(74,222,174,0.08)',  border: '#4adeae', color: '#4adeae' },
  double: { bg: 'rgba(245,200,66,0.10)',  border: '#f5c842', color: '#f5c842' },
  need:   { bg: 'rgba(42,42,58,0.50)',    border: '#2a2a3a', color: '#6b6b8a' },
  locked: { bg: 'rgba(232,67,90,0.08)',   border: '#e8435a', color: '#e8435a' },
};

const press = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(0.90); }
  100% { transform: scale(1); }
`;

export const StickerGrid = styled.div`
  display: grid;
  /* Mobile first: 7 Spalten. Bei 320px Viewport → ~41px/Zelle.
     Mit gap 6px → effektiv ~43px. Kombiniert mit min-height 44px
     auf dem Cell-Wrapper erfüllt das Prinzip 3.              */
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;

  ${above('md')} {
    grid-template-columns: repeat(10, 1fr);
    gap: 8px;
  }
  ${above('lg')} {
    grid-template-columns: repeat(14, 1fr);
    gap: 8px;
  }
`;

const CellWrapper = styled.button`
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
  transition: border-color 0.15s, background 0.15s;

  &:active {
    animation: ${press} 0.18s ease both;
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

const Num = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  opacity: 0.7;
  line-height: 1;
`;

const Icon = styled.span`
  font-size: 16px;
  line-height: 1;
`;

const StickerCell = ({ number, icon = '⚽', status = 'need', count = 1, onClick }) => (
  <CellWrapper
    $s={status}
    $count={count}
    onClick={onClick}
    aria-label={`Sticker #${number} — ${status}`}
  >
    <Num>#{number}</Num>
    <Icon>{icon}</Icon>
  </CellWrapper>
);

export default StickerCell;
