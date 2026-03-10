import styled, { css } from 'styled-components';

// ============================================================
// Button — Kapitel 0: Prinzip 3 (min 44px)
// Varianten: primary | secondary | danger | success | ghost
// Sizes: default | sm | lg
// ============================================================

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.bg};
    font-weight: 600;
    &:active { background: #f7d45c; transform: scale(0.97); }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:active { border-color: ${({ theme }) => theme.colors.accent}; transform: scale(0.97); }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.accent2};
    color: #fff;
    &:active { background: #f05570; transform: scale(0.97); }
  `,
  success: css`
    background: ${({ theme }) => theme.colors.accent3};
    color: ${({ theme }) => theme.colors.bg};
    font-weight: 600;
    &:active { background: #3bc99a; transform: scale(0.97); }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.muted};
    &:active { color: ${({ theme }) => theme.colors.text}; }
  `,
};

const sizes = {
  sm: css`
    padding: 0 14px;
    font-size: 13px;
  `,
  default: css`
    padding: 0 20px;
    font-size: 15px;
  `,
  lg: css`
    padding: 0 28px;
    font-size: 17px;
  `,
};

const Button = styled.button`
  /* PRINZIP 3: min 44px */
  min-height: ${({ theme }) => theme.touch.min};
  min-width:  ${({ theme }) => theme.touch.min};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  letter-spacing: 0.01em;

  transition: all 0.15s;
  user-select: none;
  white-space: nowrap;

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  ${({ $full }) => $full && css`width: 100%;`}
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.default}
`;

export default Button;
