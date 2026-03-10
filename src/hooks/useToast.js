import { useState, useCallback } from 'react';

// ============================================================
// useToast Hook
// Einfaches Toast-System ohne externe Bibliothek
// ============================================================

export const useToast = () => {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = 'default', duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return { toast, show, hide };
};
