import { useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================================
// BottomSheet — Kapitel 0: Prinzip 2 — Semantik-Refactor Kap.3
//
// Semantische Änderungen:
//   Sheet:   <div> → <dialog> (native ARIA role=dialog)
//            aria-modal, aria-labelledby, open-Attribut
//   Handle:  <div> → <div role="presentation"> (kein Inhalt)
//   Header:  <div> → <header> (landmark im dialog)
//   Title:   <h3>  — war schon semantisch ✓
//   Content: <div> — bleibt div (scrollbare Region, kein Landmark)
//            aria-label="Inhalt" für Screen-Reader
//
// ARIA-Anmerkung: <dialog> + aria-modal=true sperrt den
// Screen-Reader-Fokus korrekt innerhalb des Sheets.
// ============================================================

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// Overlay bleibt <div> — rein visuell, kein ARIA-Landmark
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  animation: ${fadeIn} 0.2s ease both;
  touch-action: none;
`;

// <dialog> ist das korrekte native Element für modale Overlays.
// Wir nutzen styled-components + open-Attribut statt browser-nativem showModal()
// weil wir die Animation + Positionierung selbst steuern.
const SheetDialog = styled.dialog`
  /* Reset browser-native dialog-Styles */
  border: none;
  padding: 0;
  margin: 0;
  color: inherit;
  /* Positionierung */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sheet};

  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.sheet};
  box-shadow: ${({ theme }) => theme.shadows.sheet};

  max-width: 100vw;
  width: 100%;
  overflow: hidden;

  max-height: ${({ $snap }) => $snap === 'full' ? '92vh' : '60vh'};

  animation: ${slideUp} 0.32s cubic-bezier(0.32, 0.72, 0, 1) both;
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);

  padding-bottom: env(safe-area-inset-bottom, 0px);

  /* dialog::backdrop entfernen (wir haben eigenen Overlay) */
  &::backdrop { display: none; }
`;

// role="presentation": der Handle hat keine semantische Bedeutung
const Handle = styled.div.attrs({ role: 'presentation', 'aria-hidden': true })`
  min-height: ${({ theme }) => theme.touch.min};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  flex-shrink: 0;

  &::after {
    content: '';
    width: 36px;
    height: 4px;
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
    transition: background 0.15s;
  }
  &:active::after {
    background: ${({ theme }) => theme.colors.muted};
    cursor: grabbing;
  }
`;

// <header> als landmark innerhalb des <dialog>
const SheetHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  letter-spacing: 0.05em;
  margin: 0;
`;

const CloseBtn = styled.button`
  min-width: ${({ theme }) => theme.touch.min};
  min-height: ${({ theme }) => theme.touch.min};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background 0.15s, color 0.15s;
  &:active {
    background: ${({ theme }) => theme.colors.surface2};
    color: ${({ theme }) => theme.colors.text};
  }
`;

// Scrollbarer Content-Bereich — kein Landmark, aber aria-label für SR
const Content = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  max-height: calc(
    ${({ $snap }) => $snap === 'full' ? '92vh' : '60vh'}
    - 44px
    - ${({ $hasTitle }) => $hasTitle ? '56px' : '0px'}
  );
`;

// ── Component ─────────────────────────────────────────────────
const TITLE_ID = 'bottom-sheet-title';

const BottomSheet = ({ isOpen, onClose, title, snap = 'half', children }) => {
  const sheetRef  = useRef(null);
  const startY    = useRef(null);
  const currentDY = useRef(0);

  // Body-Scroll sperren + Fokus-Management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Fokus auf das Dialog-Element setzen (ARIA best practice)
      sheetRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape-Taste schließt Sheet (ARIA-Dialog-Anforderung)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const onDragStart = useCallback((e) => {
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
  }, []);

  const onDragMove = useCallback((e) => {
    if (startY.current === null) return;
    const y  = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = Math.max(0, y - startY.current);
    currentDY.current = dy;
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
      sheetRef.current.style.transform  = `translateY(${dy}px)`;
    }
  }, []);

  const onDragEnd = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = '';
      sheetRef.current.style.transform  = '';
    }
    if (currentDY.current > 120) onClose();
    startY.current    = null;
    currentDY.current = 0;
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <SheetDialog
        ref={sheetRef}
        $snap={snap}
        open                         /* natives open-Attribut für <dialog> */
        aria-modal="true"
        aria-labelledby={title ? TITLE_ID : undefined}
        tabIndex={-1}                /* Fokus-Empfänger beim Öffnen */
      >
        <Handle
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
        />
        {title && (
          <SheetHeader>
            <Title id={TITLE_ID}>{title}</Title>
            <CloseBtn onClick={onClose} aria-label="Schließen" type="button">✕</CloseBtn>
          </SheetHeader>
        )}
        <Content $snap={snap} $hasTitle={!!title} aria-label="Sheet-Inhalt">
          {children}
        </Content>
      </SheetDialog>
    </>
  );
};

export default BottomSheet;
