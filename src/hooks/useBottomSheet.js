import { useState, useCallback } from 'react';

// ============================================================
// useBottomSheet Hook
// Verwaltet open/close state + optionale Payload-Daten
// Verwendung:
//   const sheet = useBottomSheet();
//   sheet.open({ sticker: {...} })  → öffnet mit Daten
//   sheet.close()                   → schließt
//   sheet.data                      → die übergebenen Daten
// ============================================================

export const useBottomSheet = () => {
  const [state, setState] = useState({ isOpen: false, data: null });

  const open = useCallback((data = null) => {
    setState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, data: null });
  }, []);

  return {
    isOpen: state.isOpen,
    data:   state.data,
    open,
    close,
  };
};
