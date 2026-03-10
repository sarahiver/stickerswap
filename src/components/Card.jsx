import styled, { css } from 'styled-components';

// ============================================================
// Card — Basis-Container für alle Content-Blöcke
// ============================================================

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $borderColor, theme }) => $borderColor || theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ $p, theme }) => $p || theme.spacing.md};
  overflow: hidden;
  /* PRINZIP 4: kein horizontaler Overflow */
  max-width: 100%;

  ${({ $glow }) => $glow && css`
    box-shadow: 0 0 20px rgba(245,200,66,0.12);
  `}
`;

export default Card;
