// src/hooks/useToast.js
// Globaler Toast-State via Context

import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

const slideDown = keyframes`
  from { transform: translateY(-100%) translateX(-50%); opacity: 0; }
  to   { transform: translateY(0)      translateX(-50%); opacity: 1; }
`;

const ToastWrap = styled.div`
  position: fixed;
  top: calc(16px + env(safe-area-inset-top, 0px));
  left: 50%; transform: translateX(-50%);
  z-index: 9999;
  display: flex; flex-direction: column; gap: 8px;
  pointer-events: none;
  width: calc(100vw - 32px);
  max-width: 380px;
`;

const ToastItem = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px; font-weight: 600;
  color: #fff;
  animation: ${slideDown} 250ms ease;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);

  ${({ $type }) => {
    if ($type === 'success') return css`background: rgba(50,180,100,0.9);`;
    if ($type === 'error')   return css`background: rgba(220,60,60,0.9);`;
    if ($type === 'warning') return css`background: rgba(200,140,0,0.9);`;
    return css`background: rgba(40,40,80,0.95); border: 1px solid rgba(124,111,205,0.3);`;
  }}
`;

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastWrap aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <ToastItem key={t.id} $type={t.type} role="status">
            {t.message}
          </ToastItem>
        ))}
      </ToastWrap>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
