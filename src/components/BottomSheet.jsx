import { useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================================
// BottomSheet — Kapitel 0: Prinzip 2
//
// Ersetzt ALLE klassischen Modals in StickerSwap.
// Features:
//   - Drag-to-dismiss (Touch + Mouse)
//   - Backdrop-Click schließt
//   - Body-Scroll-Lock wenn offen
//   - Snap: 'half' (60vh) oder 'full' (92vh)
//   - Safe Area für iPhone X+
//   - Spring-Animation
// ============================================================

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.overlay};
  animation: ${fadeIn} 0.2s ease both;
  /* Verhindert Scroll des Hintergrunds */
  touch-action: none;
`;

const Sheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.sheet};

  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.sheet};
  box-shadow: ${({ theme }) => theme.shadows.sheet};

  /* PRINZIP 4: kein horizontaler Overflow */
  max-width: 100vw;
  overflow: hidden;

  max-height: ${({ $snap }) => $snap === 'full' ? '92vh' : '60vh'};

  animation: ${slideUp} 0.32s cubic-bezier(0.32, 0.72, 0, 1) both;
  transition: transform 0.32s cubic-bezier(0.32, 0.72, 0, 1);

  /* Safe Area iPhone X+ */
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;

const Handle = styled.div`
  /* PRINZIP 3: min 44px Touch-Target */
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

const Header = styled.div`
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
`;

const CloseBtn = styled.button`
  /* PRINZIP 3: 44px touch target via padding */
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

const Content = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  /* Dynamische Höhe: Gesamt-Sheet minus Handle (44px) minus Header (56px) */
  max-height: calc(
    ${({ $snap }) => $snap === 'full' ? '92vh' : '60vh'}
    - 44px
    - ${({ $hasTitle }) => $hasTitle ? '56px' : '0px'}
  );
`;

// ── Component ────────────────────────────────────────────────

const BottomSheet = ({ isOpen, onClose, title, snap = 'half', children }) => {
  const sheetRef  = useRef(null);
  const startY    = useRef(null);
  const currentDY = useRef(0);

  // Body-Scroll sperren
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Drag-to-dismiss
  const onDragStart = useCallback((e) => {
    startY.current = e.touches ? e.touches[0].clientY : e.clientY;
  }, []);

  const onDragMove = useCallback((e) => {
    if (startY.current === null) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const dy = Math.max(0, y - startY.current); // nur nach unten
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
      <Sheet ref={sheetRef} $snap={snap}>
        <Handle
          onTouchStart={onDragStart}
          onTouchMove={onDragMove}
          onTouchEnd={onDragEnd}
          onMouseDown={onDragStart}
          onMouseMove={onDragMove}
          onMouseUp={onDragEnd}
        />
        {title && (
          <Header>
            <Title>{title}</Title>
            <CloseBtn onClick={onClose} aria-label="Schließen">✕</CloseBtn>
          </Header>
        )}
        <Content $snap={snap} $hasTitle={!!title}>
          {children}
        </Content>
      </Sheet>
    </>
  );
};

export default BottomSheet;
