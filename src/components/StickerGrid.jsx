import React, {
  useState, useCallback, useEffect, useRef, useMemo, memo
} from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { above } from '../theme/theme'
import { rtlOnly, insetEnd } from '../theme/rtl'

// ============================================================
// StickerGrid.jsx — Kapitel 3
//
// Virtualisiertes Grid für 600+ Sticker auf Mobile.
// Technik: react-window FixedSizeList mit manuell berechneten
// Rows (jede Row = N Sticker nebeneinander).
//
// Features:
//   - Nur sichtbare Rows im DOM (react-window)
//   - Optimistic UI via useStickerGrid hook
//   - Long-Press → Selection Mode (Batch)
//   - Single-Tap → StickerStatusSheet
//   - RTL: Grid füllt sich von rechts nach links
//   - Kategorien als Trenn-Header (virtualisiert)
//   - Rarity-Glow für seltene Sticker
//   - Skeleton-Loader beim ersten Laden
// ============================================================

// ── Konstanten ────────────────────────────────────────────────
// Zellgröße: minmax(55px, 1fr) → auf 360px-Screen: ~7 Spalten
// Exakte Berechnung in useGridLayout()
const CELL_MIN      = 55   // px — minSize pro Sticker
const CELL_GAP      = 6    // px — zwischen Zellen
const CELL_ASPECT   = 4/3  // h/w — Hochformat
const ROW_PADDING   = 16   // px — links + rechts Page-Padding
const HEADER_HEIGHT = 40   // px — Kategorie-Trennzeile
const LONG_PRESS_MS = 450  // ms — Long-Press für Selection

// ── Status-Design-Tokens ──────────────────────────────────────
export const STATUS_CONFIG = {
  need: {
    bg:     'rgba(42,42,58,0.6)',
    border: 'rgba(107,107,138,0.35)',
    color:  '#6b6b8a',
    label:  { de: 'Fehlt',  en: 'Need',   es: 'Falta',  ar: 'مفقود'  },
    emoji:  '○',
    icon:   null,
  },
  have: {
    bg:     'rgba(74,222,174,0.07)',
    border: 'rgba(74,222,174,0.5)',
    color:  '#4adeae',
    label:  { de: 'Habe',   en: 'Have',   es: 'Tengo',  ar: 'لديّ'   },
    emoji:  '●',
    icon:   null,
  },
  double: {
    bg:     'rgba(245,200,66,0.08)',
    border: 'rgba(245,200,66,0.5)',
    color:  '#f5c842',
    label:  { de: 'Doppelt', en: 'Double', es: 'Doble',  ar: 'مكرر'   },
    emoji:  '◆',
    icon:   null,
  },
  locked: {
    bg:     'rgba(232,67,90,0.08)',
    border: 'rgba(232,67,90,0.4)',
    color:  '#e8435a',
    label:  { de: 'Im Tausch', en: 'In trade', es: 'En cambio', ar: 'في تبادل' },
    emoji:  '🔒',
    icon:   null,
  },
}

// ── Animations ────────────────────────────────────────────────
const pressAnim = keyframes`
  0%   { transform: scale(1); }
  35%  { transform: scale(0.88); }
  100% { transform: scale(1); }
`
const popIn = keyframes`
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
`
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`
const shimmer = keyframes`
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
`
const rarityGlow = keyframes`
  0%,100% { box-shadow: 0 0 6px rgba(245,200,66,0.3); }
  50%     { box-shadow: 0 0 14px rgba(245,200,66,0.7), 0 0 28px rgba(245,200,66,0.2); }
`

// ── Outer Container ───────────────────────────────────────────
export const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  /* RTL: Grid-Richtung automatisch */
  direction: inherit;
`

// ── Kategorie-Header (virtualisiert als eigene Row) ───────────
const CategoryRow = styled.div`
  height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding-inline: ${ROW_PADDING}px;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 2;
  /* Frosted glass */
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(245,200,66,0.08);
`
const CategoryName = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
`
const CategoryCount = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: rgba(107,107,138,0.6);
`
const CategoryLine = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(245,200,66,0.06);
`

// ── Sticker Row (enthält N Zellen) ───────────────────────────
const StickerRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, 1fr);
  gap: ${CELL_GAP}px;
  padding-inline: ${ROW_PADDING}px;
  align-items: start;
  /* RTL: Zellen von rechts nach links */
  direction: inherit;
`

// ── Sticker Cell ──────────────────────────────────────────────
const CellBtn = styled.button`
  /* Grundform */
  width: 100%;
  aspect-ratio: 3 / 4;
  min-height: 44px;       /* PRINZIP 3: Touch-Target */
  border-radius: 7px;
  border: 1.5px solid ${({ $s }) => STATUS_CONFIG[$s]?.border || STATUS_CONFIG.need.border};
  background:      ${({ $s }) => STATUS_CONFIG[$s]?.bg     || STATUS_CONFIG.need.bg};
  color:           ${({ $s }) => STATUS_CONFIG[$s]?.color  || STATUS_CONFIG.need.color};

  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  position: relative;
  overflow: hidden;

  /* Touch */
  touch-action: manipulation;        /* Kein 300ms-Delay */
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  /* Transition */
  transition:
    border-color 0.12s ease,
    background   0.12s ease,
    box-shadow   0.12s ease,
    transform    0.12s ease;

  /* Rarity Glow (score > 50) */
  ${({ $rarity }) => $rarity > 50 && css`
    animation: ${rarityGlow} 2.5s ease-in-out infinite;
    border-color: rgba(245,200,66,0.8);
  `}

  /* Pending: pulsieren während API läuft */
  ${({ $pending }) => $pending && css`
    animation: ${pulse} 0.9s ease-in-out infinite;
  `}

  /* Press-Animation */
  &:active:not(:disabled) {
    animation: ${pressAnim} 0.18s ease both;
  }

  /* Selection Mode: ausgewählte Zelle */
  ${({ $selected }) => $selected && css`
    border-color: #f5c842;
    box-shadow: 0 0 0 2px rgba(245,200,66,0.35),
                inset 0 0 0 1px rgba(245,200,66,0.2);
  `}

  /* Locked: nicht anklickbar */
  ${({ $s }) => $s === 'locked' && css`
    cursor: not-allowed;
    opacity: 0.75;
  `}

  /* Neue Zelle: pop-in */
  ${({ $animated }) => $animated && css`
    animation: ${popIn} 0.2s ease both;
  `}
`

// Sticker-Nummer
const CellNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 8.5px;
  line-height: 1;
  opacity: 0.65;
  letter-spacing: -0.02em;
  pointer-events: none;
`

// Status-Emoji / Icon
const CellStatus = styled.span`
  font-size: 15px;
  line-height: 1;
  pointer-events: none;
  transition: transform 0.12s ease;
  ${CellBtn}:active & { transform: scale(0.85); }
`

// Doppelt-Badge (top-right)
const DoubleBadge = styled.span`
  position: absolute;
  top: -5px;
  ${insetEnd('-5px')}   /* RTL-kompatibel: oben-rechts (LTR) / oben-links (RTL) */
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 8px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 4px;
  line-height: 1.4;
  pointer-events: none;
  ${rtlOnly`right: auto; left: -5px;`}
`

// Selection-Checkbox (oben links)
const SelectDot = styled.span`
  position: absolute;
  top: 3px;
  inset-inline-start: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid rgba(245,200,66,0.5);
  background: ${({ $on }) => $on ? '#f5c842' : 'transparent'};
  transition: background 0.1s;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #0a0a0f;
`

// Rarity-Overlay (oben: subtiler Glanz-Streifen für score > 30)
const RaritySheen = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background: linear-gradient(
    135deg,
    rgba(245,200,66,0.04) 0%,
    rgba(255,255,255,0.06) 50%,
    transparent 100%
  );
  pointer-events: none;
`

// ── Skeleton Loader ───────────────────────────────────────────
const SkeletonCell = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  min-height: 44px;
  border-radius: 7px;
  background: linear-gradient(
    90deg,
    rgba(42,42,58,0.6) 25%,
    rgba(60,60,80,0.6) 50%,
    rgba(42,42,58,0.6) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`

const SkeletonRow = ({ cols, padding }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: CELL_GAP,
    paddingInline: padding,
    marginBottom: CELL_GAP,
  }}>
    {Array.from({ length: cols }, (_, i) => <SkeletonCell key={i} />)}
  </div>
)

// ── useGridLayout ─────────────────────────────────────────────
// Berechnet Anzahl Spalten + Zellhöhe basierend auf Container-Breite.
// Wird bei Resize neu berechnet.
const useGridLayout = (containerWidth) => {
  return useMemo(() => {
    const available = containerWidth - ROW_PADDING * 2
    const cols      = Math.max(4, Math.floor((available + CELL_GAP) / (CELL_MIN + CELL_GAP)))
    const cellW     = (available - (cols - 1) * CELL_GAP) / cols
    const cellH     = Math.ceil(cellW * CELL_ASPECT)
    const rowH      = cellH + CELL_GAP
    return { cols, cellW, cellH, rowH }
  }, [containerWidth])
}

// ── Sticker-Daten in virtuelle Rows aufteilen ─────────────────
// Kategorien werden als spezielle "header"-Rows eingefügt.
const buildVirtualRows = (stickersArray, cols) => {
  if (!stickersArray.length) return []

  const rows = []
  let buffer = []
  let lastCategory = null

  const flushBuffer = () => {
    if (!buffer.length) return
    // Volle Rows
    for (let i = 0; i < buffer.length; i += cols) {
      rows.push({ type: 'stickers', cells: buffer.slice(i, i + cols) })
    }
    buffer = []
  }

  stickersArray.forEach(sticker => {
    const cat = sticker.category || '__default'
    if (cat !== lastCategory) {
      flushBuffer()
      rows.push({ type: 'header', category: cat, label: sticker.category })
      lastCategory = cat
    }
    buffer.push(sticker)
  })
  flushBuffer()

  return rows
}

// ── Memoized Cell ─────────────────────────────────────────────
const MemoCell = memo(({
  sticker, selectMode, isSelected, isPending,
  onTap, onLongPress, lang
}) => {
  const longPressTimer = useRef(null)
  const didLongPress   = useRef(false)

  const handleTouchStart = useCallback(() => {
    didLongPress.current = false
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true
      onLongPress(sticker.sticker_id)
    }, LONG_PRESS_MS)
  }, [onLongPress, sticker.sticker_id])

  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current)
    if (!didLongPress.current) onTap(sticker)
  }, [onTap, sticker])

  const config  = STATUS_CONFIG[sticker.status] || STATUS_CONFIG.need
  const isLocked = sticker.status === 'locked'

  return (
    <CellBtn
      $s={sticker.status}
      $rarity={sticker.rarity_score || 0}
      $pending={isPending}
      $selected={isSelected}
      $animated={false}
      disabled={isLocked && !selectMode}
      aria-label={`#${sticker.number} — ${config.label[lang] || config.label.en}`}
      aria-pressed={isSelected}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={selectMode ? undefined : undefined}
    >
      {/* Rarity-Glow-Overlay */}
      {sticker.rarity_score > 30 && <RaritySheen />}

      {/* Selection Dot */}
      {selectMode && (
        <SelectDot $on={isSelected}>
          {isSelected && '✓'}
        </SelectDot>
      )}

      {/* Doppelt-Badge */}
      {sticker.status === 'double' && sticker.quantity > 1 && (
        <DoubleBadge>×{sticker.quantity}</DoubleBadge>
      )}

      <CellNum>#{sticker.number}</CellNum>
      <CellStatus>{config.emoji}</CellStatus>
    </CellBtn>
  )
}, (prev, next) => {
  // Nur re-rendern wenn sich relevante Props ändern
  return (
    prev.sticker.status    === next.sticker.status    &&
    prev.sticker.quantity  === next.sticker.quantity  &&
    prev.selectMode        === next.selectMode        &&
    prev.isSelected        === next.isSelected        &&
    prev.isPending         === next.isPending
  )
})
MemoCell.displayName = 'StickerCell'

// ── Virtualisierter Row-Renderer ──────────────────────────────
const makeRowRenderer = (
  virtualRows, cols, rowH, cellH,
  selectMode, selected, pendingRef,
  onTap, onLongPress, lang
) => memo(({ index, style }) => {
  const row = virtualRows[index]

  if (!row) return null

  if (row.type === 'header') {
    return (
      <div style={{ ...style, height: HEADER_HEIGHT }}>
        <CategoryRow>
          <CategoryName>{row.label || '—'}</CategoryName>
          <CategoryLine />
          <CategoryCount>{row.cells?.length ?? ''}</CategoryCount>
        </CategoryRow>
      </div>
    )
  }

  // Sticker-Row
  return (
    <div style={{ ...style, paddingBottom: CELL_GAP }}>
      <StickerRow $cols={cols}>
        {row.cells.map(sticker => (
          <MemoCell
            key={sticker.sticker_id}
            sticker={sticker}
            selectMode={selectMode}
            isSelected={selected.has(sticker.sticker_id)}
            isPending={pendingRef.current?.has(sticker.sticker_id) ?? false}
            onTap={onTap}
            onLongPress={onLongPress}
            lang={lang}
          />
        ))}
        {/* Leere Platzhalter-Zellen für letzte unvollständige Row */}
        {Array.from({ length: cols - row.cells.length }, (_, i) => (
          <div key={`empty-${i}`} aria-hidden="true" />
        ))}
      </StickerRow>
    </div>
  )
})

// ── Batch-Toolbar ─────────────────────────────────────────────
const BatchBar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0; right: 0;
  padding: 10px ${ROW_PADDING}px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  background: rgba(10,10,15,0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(245,200,66,0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
`
const BatchCount = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accent};
  flex: 1;
`
const BatchBtn = styled.button`
  min-height: 36px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  touch-action: manipulation;
  transition: opacity 0.15s;
  &:active { opacity: 0.7; }

  background: ${({ $variant }) =>
    $variant === 'have'   ? 'rgba(74,222,174,0.12)' :
    $variant === 'double' ? 'rgba(245,200,66,0.12)'  :
    $variant === 'need'   ? 'rgba(107,107,138,0.12)' :
    $variant === 'cancel' ? 'transparent'            : 'transparent'};
  color: ${({ $variant }) =>
    $variant === 'have'   ? '#4adeae' :
    $variant === 'double' ? '#f5c842' :
    $variant === 'need'   ? '#6b6b8a' :
    $variant === 'cancel' ? '#6b6b8a' : '#f0f0f5'};
  border: 1px solid ${({ $variant }) =>
    $variant === 'have'   ? 'rgba(74,222,174,0.3)'  :
    $variant === 'double' ? 'rgba(245,200,66,0.3)'   :
    $variant === 'need'   ? 'rgba(107,107,138,0.25)' :
    'rgba(107,107,138,0.2)'};
`

// ── Stats-Bar ─────────────────────────────────────────────────
const StatsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px ${ROW_PADDING}px 6px;
  flex-shrink: 0;
`
const StatChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ $bg }) => $bg || 'rgba(42,42,58,0.5)'};
  border: 1px solid ${({ $border }) => $border || 'rgba(107,107,138,0.2)'};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 700;
  color: ${({ $color }) => $color || '#6b6b8a'};
  flex-shrink: 0;
`
const ProgressTrack = styled.div`
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: rgba(42,42,58,0.8);
  overflow: hidden;
`
const ProgressFill = styled.div`
  height: 100%;
  border-radius: 2px;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, #4adeae, #f5c842);
  transition: width 0.4s ease;
`

// ── Haupt-Komponente ──────────────────────────────────────────
const StickerGrid = ({
  // Daten
  stickersArray = [],
  stats         = { total: 0, have: 0, double: 0, need: 0, locked: 0 },
  loading       = false,
  // Actions vom useStickerGrid Hook
  onStickerTap,     // (sticker) => void → öffnet Sheet
  onLongPress,      // (stickerId) => void → aktiviert Selection
  batchUpdate,      // (ids[], status) => Promise
  // Selection-State
  selectMode    = false,
  selected      = new Set(),
  clearSelect,
  // Pending-Ref (wird direkt vom Hook übergeben)
  pendingRef    = { current: new Map() },
  // i18n
  language      = 'en',
}) => {
  const { t } = useTranslation()
  const [containerW, setContainerW] = useState(360)
  const listRef = useRef(null)

  const { cols, cellH, rowH } = useGridLayout(containerW)

  // Virtuelle Rows aufbauen (memo: nur wenn Daten oder cols sich ändern)
  const virtualRows = useMemo(
    () => buildVirtualRows(stickersArray, cols),
    [stickersArray, cols]
  )

  // Row-Höhen-Berechnung (Header hat fixe Höhe, Sticker-Rows variable)
  const getRowHeight = useCallback((index) => {
    const row = virtualRows[index]
    if (!row) return rowH
    return row.type === 'header' ? HEADER_HEIGHT : rowH
  }, [virtualRows, rowH])

  // Row-Renderer memoizen (re-erstellen wenn Grid-Layout oder Selection-State sich ändert)
  const RowRenderer = useMemo(
    () => makeRowRenderer(
      virtualRows, cols, rowH, cellH,
      selectMode, selected, pendingRef,
      onStickerTap, onLongPress, language
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [virtualRows, cols, rowH, cellH, selectMode, selected, language]
  )

  // Fortschritt
  const pct = stats.total > 0
    ? Math.round(((stats.have + stats.double) / stats.total) * 100)
    : 0

  // Batch-Handler
  const handleBatch = useCallback(async (status) => {
    if (!batchUpdate) return
    await batchUpdate([...selected], status)
  }, [batchUpdate, selected])

  if (loading && !stickersArray.length) {
    return (
      <GridWrapper>
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonRow key={i} cols={cols} padding={ROW_PADDING} />
        ))}
      </GridWrapper>
    )
  }

  return (
    <GridWrapper>

      {/* Stats-Bar */}
      <StatsBar>
        <StatChip $bg="rgba(74,222,174,0.08)" $border="rgba(74,222,174,0.25)" $color="#4adeae">
          ● {stats.have}
        </StatChip>
        <StatChip $bg="rgba(245,200,66,0.08)" $border="rgba(245,200,66,0.25)" $color="#f5c842">
          ◆ {stats.double}
        </StatChip>
        <ProgressTrack>
          <ProgressFill $pct={pct} />
        </ProgressTrack>
        <StatChip $bg="rgba(42,42,58,0.5)" $border="rgba(107,107,138,0.2)" $color="#6b6b8a">
          {pct}%
        </StatChip>
      </StatsBar>

      {/* Virtualisiertes Grid */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <AutoSizer onResize={({ width }) => setContainerW(width || 360)}>
          {({ height, width }) => (
            <FixedSizeList
              ref={listRef}
              height={height}
              width={width}
              itemCount={virtualRows.length}
              itemSize={rowH}   // react-window braucht fixe Größe für FixedSizeList
              overscanCount={4} // 4 Rows über/unter Viewport vorrendern
              style={{ overflowX: 'hidden', willChange: 'transform' }}
            >
              {RowRenderer}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>

      {/* Batch-Toolbar (nur im Selection-Mode) */}
      {selectMode && (
        <BatchBar>
          <BatchCount>
            {selected.size} {selected.size === 1 ? 'Sticker' : 'Sticker'} ✓
          </BatchCount>
          <BatchBtn $variant="have"   onClick={() => handleBatch('have')}>
            ● {STATUS_CONFIG.have.label[language]   || 'Have'}
          </BatchBtn>
          <BatchBtn $variant="double" onClick={() => handleBatch('double')}>
            ◆ {STATUS_CONFIG.double.label[language] || 'Double'}
          </BatchBtn>
          <BatchBtn $variant="need"   onClick={() => handleBatch('need')}>
            ○ {STATUS_CONFIG.need.label[language]   || 'Need'}
          </BatchBtn>
          <BatchBtn $variant="cancel" onClick={clearSelect}>✕</BatchBtn>
        </BatchBar>
      )}
    </GridWrapper>
  )
}

export default StickerGrid
