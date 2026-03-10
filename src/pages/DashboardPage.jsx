// src/pages/DashboardPage.jsx
// Kapitel 8 — Home Dashboard: Greeting, Stats, Action-Center, Live-Ticker

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { AlbumHeaderSkeleton } from '../components/StickerSkeleton';

const fadeIn = keyframes`from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); }`;

// ─── Styled ───────────────────────────────────────────────────────────────────
const Page = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  background: var(--color-bg);
  animation: ${fadeIn} 250ms ease;
`;

const PageInner = styled.div`
  padding: 20px 16px calc(16px);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
  margin: 0 auto;
`;

// Welcome
const WelcomeCard = styled.section`
  background: linear-gradient(135deg, rgba(124,111,205,0.2) 0%, rgba(80,60,180,0.08) 100%);
  border: 1px solid rgba(124,111,205,0.2);
  border-radius: 20px;
  padding: 18px;
`;

const Greeting = styled.h1`
  font-size: 20px; font-weight: 800; color: #fff; margin: 0 0 4px;
`;

const ProgressText = styled.p`
  font-size: 13px; color: var(--color-text-dim); margin: 0 0 10px;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent2));
  border-radius: 3px;
  transition: width 600ms ease;
`;

// Stats Row
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
`;

const StatItem = styled.div`
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;
`;

const StatValue = styled.p`
  font-size: 20px; font-weight: 800; color: #fff; margin: 0 0 2px;
`;

const StatLabel = styled.p`
  font-size: 9px; font-weight: 700;
  color: var(--color-text-mute);
  text-transform: uppercase; letter-spacing: 0.5px;
  margin: 0;
`;

// Action Center
const SectionTitle = styled.h2`
  font-size: 13px; font-weight: 700;
  color: var(--color-text-dim);
  text-transform: uppercase; letter-spacing: 0.6px;
  margin: 0 0 10px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const ActionBtn = styled.button`
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px 12px;
  text-align: center;
  cursor: pointer;
  touch-action: manipulation;
  transition: all 150ms;
  min-height: 90px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 8px;

  &:active {
    background: rgba(124,111,205,0.12);
    border-color: var(--color-accent);
    transform: scale(0.97);
  }
  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
`;

const ActionIcon = styled.span`font-size: 28px; line-height: 1;`;
const ActionLabel = styled.span`
  font-size: 13px; font-weight: 700; color: #fff;
`;

// Activity Feed
const FeedList = styled.ul`
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 2px;
`;

const FeedItem = styled.li`
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  animation: ${fadeIn} 300ms ease;
  &:last-child { border-bottom: none; }
`;

const FeedIcon = styled.div`
  width: 32px; height: 32px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
`;

const FeedText = styled.p`
  font-size: 13px; color: var(--color-text-dim); margin: 0;
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const FeedTime = styled.time`
  font-size: 10px; color: var(--color-text-mute); flex-shrink: 0;
`;

const EmptyFeed = styled.p`
  text-align: center; padding: 20px 0;
  color: var(--color-text-mute); font-size: 13px;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = (t) => {
  const h = new Date().getHours();
  if (h < 12) return t('dashboard.greeting.morning',   'Guten Morgen');
  if (h < 18) return t('dashboard.greeting.afternoon', 'Guten Tag');
  return              t('dashboard.greeting.evening',   'Guten Abend');
};

const formatRelTime = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return 'Jetzt';
  if (diff < 3600) return `${Math.floor(diff/60)}m`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h`;
  return `${Math.floor(diff/86400)}d`;
};

const activityFromLedger = (tx, t) => {
  const icons = { purchase: '📥', swap_lock: '🔒', swap_refund: '🔓', reputation_change: '⭐', default: '🔄' };
  return {
    icon: icons[tx.type] ?? icons.default,
    text: tx.description || t(`wallet.txType.${tx.type}`, tx.type),
    time: tx.created_at,
  };
};

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
const DashboardPage = ({ user, profile }) => {
  const { t }    = useTranslation();
  const navigate = useNavigate();

  const [stats,    setStats]    = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!user?.id) return;

    const [ledgerRes, swapsRes, albumRes] = await Promise.all([
      supabase.from('token_ledger')
        .select('*').eq('user_id', user.id)
        .order('created_at', { ascending: false }).limit(8),
      supabase.from('swaps')
        .select('id,status')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .in('status', ['pending','locked','shipped_a','shipped_b','both_shipped']),
      // Fortschritt: erstes Album des Users
      supabase.from('user_stickers')
        .select('status', { count: 'exact' })
        .eq('user_id', user.id),
    ]);

    const totalStickers = albumRes.count ?? 0;
    const haveStickers  = albumRes.data?.filter(s => s.status === 'have').length ?? 0;
    const pct = totalStickers > 0 ? Math.round((haveStickers / totalStickers) * 100) : 0;

    setStats({
      pct,
      openSwaps:  swapsRes.data?.length ?? 0,
      reputation: profile?.reputation_score ?? 0,
      balance:    profile?.token_balance ?? 0,
    });

    setActivity((ledgerRes.data ?? []).map(tx => activityFromLedger(tx, t)));
    setLoading(false);
  }, [user?.id, profile, t]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'Sammler';

  if (loading) return (
    <Page><PageInner><AlbumHeaderSkeleton /><AlbumHeaderSkeleton /></PageInner></Page>
  );

  return (
    <Page>
      <PageInner>
        {/* ── Welcome ── */}
        <WelcomeCard aria-label="Willkommen">
          <Greeting>{getGreeting(t)}, {displayName} 👋</Greeting>
          {stats && (
            <>
              <ProgressText>
                {t('dashboard.progress', { percent: stats.pct, album: 'WM 2026' })}
              </ProgressText>
              <ProgressBar role="progressbar" aria-valuenow={stats.pct} aria-valuemin={0} aria-valuemax={100}>
                <ProgressFill $pct={stats.pct} />
              </ProgressBar>
              <StatsRow>
                <StatItem>
                  <StatValue>{stats.openSwaps}</StatValue>
                  <StatLabel>{t('dashboard.openSwaps')}</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{stats.reputation}</StatValue>
                  <StatLabel>{t('dashboard.reputation')}</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{stats.balance}</StatValue>
                  <StatLabel>{t('dashboard.balance')}</StatLabel>
                </StatItem>
              </StatsRow>
            </>
          )}
        </WelcomeCard>

        {/* ── Action Center ── */}
        <section aria-label="Schnellzugriff">
          <SectionTitle>Quick Actions</SectionTitle>
          <ActionGrid>
            <ActionBtn
              onClick={() => navigate('/albums')}
              aria-label={t('dashboard.actionEnter')}
            >
              <ActionIcon aria-hidden="true">✏️</ActionIcon>
              <ActionLabel>{t('dashboard.actionEnter')}</ActionLabel>
            </ActionBtn>
            <ActionBtn
              onClick={() => navigate('/matches')}
              aria-label={t('dashboard.actionMatches')}
            >
              <ActionIcon aria-hidden="true">🤝</ActionIcon>
              <ActionLabel>{t('dashboard.actionMatches')}</ActionLabel>
            </ActionBtn>
          </ActionGrid>
        </section>

        {/* ── Activity Feed ── */}
        <section aria-label={t('dashboard.recentActivity')}>
          <SectionTitle>{t('dashboard.recentActivity')}</SectionTitle>
          {activity.length === 0 ? (
            <EmptyFeed>{t('dashboard.noActivity')}</EmptyFeed>
          ) : (
            <FeedList aria-live="polite">
              {activity.map((item, i) => (
                <FeedItem key={i}>
                  <FeedIcon aria-hidden="true">{item.icon}</FeedIcon>
                  <FeedText>{item.text}</FeedText>
                  <FeedTime dateTime={item.time}>{formatRelTime(item.time)}</FeedTime>
                </FeedItem>
              ))}
            </FeedList>
          )}
        </section>
      </PageInner>
    </Page>
  );
};

export default DashboardPage;
