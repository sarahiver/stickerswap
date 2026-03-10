// src/pages/AlbumLibrary.jsx
// Kapitel 8 — Album-Browser: alle Alben aus DB, Fortschrittsanzeige

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { cloudinaryUrl } from '../lib/cloudinaryUtils';
import { AlbumHeaderSkeleton } from '../components/StickerSkeleton';

const fadeIn = keyframes`from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); }`;

const Page = styled.div`
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--color-bg);
`;

const Header = styled.header`
  padding: 20px 16px 8px;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 2px;
`;

const PageSub = styled.p`
  font-size: 13px; color: var(--color-text-dim); margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px 16px 24px;
`;

const AlbumCard = styled.button`
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  touch-action: manipulation;
  text-align: left;
  transition: all 150ms;
  animation: ${fadeIn} 300ms ease;

  &:active { transform: scale(0.97); border-color: var(--color-accent); }
  &:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
`;

const AlbumCover = styled.div`
  width: 100%; aspect-ratio: 4/3;
  background: rgba(255,255,255,0.05);
  overflow: hidden; position: relative;
`;

const CoverImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

const CoverFallback = styled.div`
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 32px;
`;

const AlbumInfo = styled.div`padding: 10px;`;

const AlbumName = styled.h2`
  font-size: 13px; font-weight: 700; color: #fff;
  margin: 0 0 4px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const AlbumMeta = styled.p`
  font-size: 11px; color: var(--color-text-mute); margin: 0 0 6px;
`;

const MiniProgress = styled.div`
  height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;
`;

const MiniProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) => $pct >= 100
    ? 'var(--color-accent2)'
    : 'var(--color-accent)'};
  border-radius: 2px;
  transition: width 400ms ease;
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center; padding: 40px 0;
  color: var(--color-text-mute); font-size: 14px;
`;

const AlbumLibrary = ({ userId, language = 'de' }) => {
  const { t }    = useTranslation();
  const navigate = useNavigate();

  const [albums,  setAlbums]  = useState([]);
  const [stats,   setStats]   = useState({});  // albumId → { done, total, pct }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: albumData } = await supabase
        .from('albums')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!albumData) { setLoading(false); return; }
      setAlbums(albumData);

      // Fortschritt pro Album
      if (userId) {
        const { data: userStickers } = await supabase
          .from('user_stickers')
          .select('sticker_id, status, stickers!inner(album_id)')
          .eq('user_id', userId);

        const statsMap = {};
        albumData.forEach(album => {
          const mine = userStickers?.filter(s => s.stickers?.album_id === album.id) ?? [];
          const done = mine.filter(s => s.status === 'have').length;
          statsMap[album.id] = {
            done,
            total: album.total_stickers ?? 0,
            pct: album.total_stickers > 0 ? Math.round((done / album.total_stickers) * 100) : 0,
          };
        });
        setStats(statsMap);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  const getName = (album) => {
    if (typeof album.name === 'object') return album.name[language] ?? album.name.de ?? album.name.en ?? '';
    return album.name ?? '';
  };

  if (loading) return (
    <Page><Header><AlbumHeaderSkeleton /></Header><Grid>{[1,2,3,4].map(i => <AlbumHeaderSkeleton key={i} />)}</Grid></Page>
  );

  return (
    <Page>
      <Header>
        <PageTitle>{t('albums.title')}</PageTitle>
        <PageSub>{t('albums.subtitle')}</PageSub>
      </Header>

      <Grid role="list" aria-label={t('albums.title')}>
        {albums.length === 0 && (
          <Empty>{t('albums.empty')}</Empty>
        )}
        {albums.map(album => {
          const name = getName(album);
          const s    = stats[album.id] ?? { done: 0, total: 0, pct: 0 };
          const coverUrl = album.cover_image_url
            ? cloudinaryUrl(album.cover_image_url, { width: 300, height: 225, crop: 'fill' })
            : null;

          return (
            <AlbumCard
              key={album.id}
              role="listitem"
              onClick={() => navigate(`/album/${album.id}`)}
              aria-label={`${name}, ${s.pct}% vollständig`}
            >
              <AlbumCover>
                {coverUrl
                  ? <CoverImg src={coverUrl} alt="" loading="lazy" />
                  : <CoverFallback aria-hidden="true">📖</CoverFallback>
                }
              </AlbumCover>
              <AlbumInfo>
                <AlbumName>{name}</AlbumName>
                <AlbumMeta>
                  {s.pct >= 100
                    ? t('albums.complete')
                    : t('albums.progress', { done: s.done, total: s.total })}
                </AlbumMeta>
                <MiniProgress role="progressbar" aria-valuenow={s.pct} aria-valuemin={0} aria-valuemax={100}>
                  <MiniProgressFill $pct={s.pct} />
                </MiniProgress>
              </AlbumInfo>
            </AlbumCard>
          );
        })}
      </Grid>
    </Page>
  );
};

export default AlbumLibrary;
