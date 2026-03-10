import styled, { keyframes } from 'styled-components';

// ============================================================
// ProgressBar — Album-Fortschrittsanzeige
// ============================================================

const fill = keyframes`
  from { width: 0%; }
`;

const Track = styled.div`
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: 100px;
  height: ${({ $h }) => $h || '8px'};
  overflow: hidden;
  width: 100%;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.accent3},
    ${({ theme }) => theme.colors.accent}
  );
  width: ${({ $pct }) => $pct}%;
  animation: ${fill} 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

const ProgressBar = ({ value, max, height }) => (
  <Track $h={height}>
    <Fill $pct={max > 0 ? Math.round((value / max) * 100) : 0} />
  </Track>
);

export default ProgressBar;
