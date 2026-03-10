import styled, { css } from 'styled-components';
import { above } from '../theme/theme';

// ============================================================
// BottomNav — Mobile Navigation
// Kapitel 0: Prinzip 1 (Mobile-First Layout)
//
// Nur auf Mobile sichtbar (versteckt ab md Breakpoint).
// Auf Desktop wird später eine Sidebar/TopNav verwendet.
// ============================================================

const Nav = styled.nav`
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};

  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);

  /* Safe Area iPhone X+ Home Indicator */
  padding-bottom: env(safe-area-inset-bottom, 0px);

  /* Auf Desktop verstecken */
  ${above('md')} { display: none; }
`;

const Item = styled.button`
  /* PRINZIP 3: min 44px */
  min-height: ${({ theme }) => theme.touch.min};
  padding: 8px 4px 6px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;

  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.muted};
  transition: color 0.15s;

  &:active { opacity: 0.65; }
`;

const IconWrap = styled.span`
  font-size: 22px;
  line-height: 1;
  position: relative;

  ${({ $badge }) => $badge && css`
    &::after {
      content: '${({ $badge }) => $badge}';
      position: absolute;
      top: -4px; right: -10px;
      background: #e8435a;
      color: #fff;
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      padding: 1px 4px;
      border-radius: 6px;
      line-height: 1.4;
      min-width: 16px;
      text-align: center;
    }
  `}
`;

const Label = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

// items: [{ icon: '📊', label: 'Home', badge?: '3' }]
const BottomNav = ({ items, activeIndex, onSelect }) => (
  <Nav $count={items.length}>
    {items.map((item, i) => (
      <Item
        key={i}
        $active={i === activeIndex}
        onClick={() => onSelect(i)}
        aria-label={item.label}
        aria-current={i === activeIndex ? 'page' : undefined}
      >
        <IconWrap $badge={item.badge}>{item.icon}</IconWrap>
        <Label>{item.label}</Label>
      </Item>
    ))}
  </Nav>
);

export default BottomNav;
