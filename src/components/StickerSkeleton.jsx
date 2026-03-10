// src/components/StickerSkeleton.jsx
// Kapitel 7 — Skeleton Screen für StickerGrid + React Suspense Wrapper

import React, { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Shimmer Animation ────────────────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.09) 50%,
    rgba(255,255,255,0.04) 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  border-radius: ${({ $radius }) => $radius || '8px'};
`;

// ─── Einzelne Sticker-Zelle Skeleton ─────────────────────────────────────────
const CellWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const CellImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
`;

const CellLabel = styled(SkeletonBase)`
  height: 8px;
  width: 60%;
`;

export const StickerCellSkeleton = () => (
  <CellWrap aria-hidden="true">
    <CellImage />
    <CellLabel />
  </CellWrap>
);

// ─── Grid Skeleton (n Zellen) ─────────────────────────────────────────────────
const GridWrap = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols || 5}, 1fr)`};
  gap: 8px;
  padding: 12px;
`;

export const StickerGridSkeleton = ({ cols = 5, rows = 6 }) => (
  <GridWrap
    $cols={cols}
    role="status"
    aria-label="Sticker werden geladen…"
    aria-live="polite"
    aria-busy="true"
  >
    {Array.from({ length: cols * rows }).map((_, i) => (
      <StickerCellSkeleton key={i} />
    ))}
  </GridWrap>
);

// ─── AlbumPage Header Skeleton ────────────────────────────────────────────────
const HeaderWrap = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeaderLine = styled(SkeletonBase)`
  height: ${({ $h }) => $h || 16}px;
  width: ${({ $w }) => $w || '100%'};
`;

export const AlbumHeaderSkeleton = () => (
  <HeaderWrap aria-hidden="true">
    <HeaderLine $h={22} $w="60%" />
    <HeaderLine $h={12} $w="40%" />
    <HeaderLine $h={8}  $w="100%" $radius="4px" />
  </HeaderWrap>
);

// ─── MatchCard Skeleton ───────────────────────────────────────────────────────
const CardWrap = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AvatarSkeleton = styled(SkeletonBase)`
  width: 48px; height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const CardLines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MatchCardSkeleton = () => (
  <CardWrap aria-hidden="true">
    <AvatarSkeleton />
    <CardLines>
      <HeaderLine $h={14} $w="55%" />
      <HeaderLine $h={10} $w="35%" />
    </CardLines>
  </CardWrap>
);

// ─── Suspense Wrapper für lazy-geladene Seiten ────────────────────────────────
const PageLoadingWrap = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PageSkeleton = () => (
  <PageLoadingWrap role="status" aria-label="Seite wird geladen…" aria-busy="true">
    <AlbumHeaderSkeleton />
    <StickerGridSkeleton />
  </PageLoadingWrap>
);

/**
 * Wrapper für React.lazy() Komponenten
 * Nutzung:
 *   const AlbumPage = React.lazy(() => import('./pages/AlbumPage'));
 *   <SuspenseWrapper><AlbumPage /></SuspenseWrapper>
 */
export const SuspenseWrapper = ({ children, fallback }) => (
  <Suspense fallback={fallback ?? <PageSkeleton />}>
    {children}
  </Suspense>
);

export default StickerGridSkeleton;
