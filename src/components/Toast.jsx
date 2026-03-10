import styled, { keyframes } from 'styled-components';

// ============================================================
// Toast — Kurze Feedback-Meldungen
// Typen: 'default' | 'success' | 'error'
// Wird via useToast Hook gesteuert
// ============================================================

const slideDown = keyframes`
  from { transform: translateY(-16px) translateX(-50%); opacity: 0; }
  to   { transform: translateY(0)     translateX(-50%); opacity: 1; }
`;

const ToastWrap = styled.div`
  position: fixed;
  top: calc(${({ theme }) => theme.spacing.md} + env(safe-area-inset-top, 0px));
  left: 50%;
  transform: translateX(-50%);
  z-index: ${({ theme }) => theme.zIndex.toast};

  background: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.accent3 :
    $type === 'error'   ? theme.colors.accent2 :
                          theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};

  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;

  animation: ${slideDown} 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
`;

const Toast = ({ message, type = 'default' }) => (
  <ToastWrap $type={type}>{message}</ToastWrap>
);

export default Toast;
