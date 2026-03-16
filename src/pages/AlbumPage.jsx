// src/pages/AlbumPage.jsx — echtes Schema (stickers + user_stickers)
import React, { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import StickerGrid from '../components/StickerGrid';
import { useStickerGrid } from '../hooks/useStickerGrid';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// ── Styled Components ─────────────────────────────────────────
const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-bg);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px 8px;
  flex-shrink: 0;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const AlbumTitle = styled.h1`
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const ErrorMsg = styled.div`
  padding: 24px 16px;
  color: #e8435a;
  font-size: 14px;
  text-align: center;
`;

const AlbumPage = () => {
  const { id: albumId } = useParams();
  const navigate        = useNavigate();
  const { i18n }        = useTranslation();
  const { user }        = useAuth();
  const language        = i18n.language?.slice(0, 2) || 'en';

  const [albumName, setAlbumName] = useState('');

  const {
    stickersArray,
    stats,
    loading,
    error,
    loadAlbum,
    updateSticker,
    batchUpdate,
    selected,
    selectMode,
    setSelectMode,
    toggleSelect,
    clearSelect,
    pendingRef,
  } = useStickerGrid(albumId);

  // Album-Name laden
  useEffect(() => {
    if (!albumId) return;
    supabase
      .from('albums')
      .select('name')
      .eq('id', albumId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const n = data.name;
        setAlbumName(
          typeof n === 'object'
            ? n[language] ?? n.en ?? n.de ?? Object.values(n)[0] ?? 'Album'
            : n ?? 'Album'
        );
      });
  }, [albumId, language]);

  // Sticker laden
  useEffect(() => {
    if (albumId && user) loadAlbum(language);
  }, [albumId, user, language, loadAlbum]);

  // Tap → Status cycling
  const handleTap = useCallback(async (sticker) => {
    if (selectMode) {
      toggleSelect(sticker.sticker_id);
      return;
    }
    const nextStatus =
      sticker.status === 'need'   ? 'have'   :
      sticker.status === 'have'   ? 'double' : 'need';
    await updateSticker(sticker.sticker_id, nextStatus);
  }, [selectMode, toggleSelect, updateSticker]);

  // Long-Press → Selection Mode
  const handleLongPress = useCallback((stickerId) => {
    setSelectMode(true);
    toggleSelect(stickerId);
  }, [setSelectMode, toggleSelect]);

  if (error) return (
    <Page>
      <TopBar>
        <BackBtn onClick={() => navigate('/albums')}>← Zurück</BackBtn>
      </TopBar>
      <ErrorMsg>Fehler: {error}</ErrorMsg>
    </Page>
  );

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={() => navigate('/albums')}>←</BackBtn>
        <AlbumTitle>{albumName}</AlbumTitle>
      </TopBar>

      <StickerGrid
        stickersArray={stickersArray}
        stats={stats}
        loading={loading}
        onStickerTap={handleTap}
        onLongPress={handleLongPress}
        batchUpdate={batchUpdate}
        selectMode={selectMode}
        selected={selected}
        clearSelect={clearSelect}
        pendingRef={pendingRef}
        language={language}
      />
    </Page>
  );
};

export default AlbumPage;
