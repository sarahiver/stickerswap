import styled, { css } from 'styled-components';

// ============================================================
// Tag / Badge — Kleine Status-Anzeigen
// $color: 'green' | 'yellow' | 'red' | undefined (grau)
// ============================================================

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;

  ${({ $color }) => {
    if ($color === 'green')  return css`background: rgba(74,222,174,0.10);  color: #4adeae; border: 1px solid rgba(74,222,174,0.25);`;
    if ($color === 'yellow') return css`background: rgba(245,200,66,0.10);  color: #f5c842; border: 1px solid rgba(245,200,66,0.25);`;
    if ($color === 'red')    return css`background: rgba(232,67,90,0.10);   color: #e8435a; border: 1px solid rgba(232,67,90,0.25);`;
    return css`background: rgba(107,107,138,0.15); color: #6b6b8a; border: 1px solid rgba(107,107,138,0.2);`;
  }}
`;

export default Tag;
