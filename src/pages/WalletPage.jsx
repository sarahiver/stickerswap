// src/pages/WalletPage.jsx
// Kapitel 5 — Token-Wallet: Guthaben, gesperrte Token, Transaktionshistorie
// Semantisch korrekt, lokalisierte Währung via Intl.NumberFormat, scrollbar

import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

// ─── Animationen ─────────────────────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const countUp = keyframes`
  from { transform: translateY(4px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (cents, locale = 'de-DE', currency = 'EUR') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);

const formatDate = (iso, locale = 'de-DE') =>
  new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    .format(new Date(iso));

const getTxIcon = (type) => {
  const icons = {
    purchase:          '📥',
    swap_lock:         '🔒',
    swap_refund:       '🔓',
    reputation_change: '⭐',
    bonus:             '🎁',
    default:           '🔄',
  };
  return icons[type] ?? icons.default;
};

const getTxColor = (amount) => {
  if (amount > 0)  return '#5de8a0';   // grün: Eingang
  if (amount < 0)  return '#ff7070';   // rot: Ausgang
  return 'rgba(255,255,255,0.4)';      // neutral: Reputation-Log
};

// ─── Styled Components ────────────────────────────────────────────────────────
const Page = styled.main`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg, #0f0f1a);
  overflow: hidden;
`;

const PageHeader = styled.header`
  flex-shrink: 0;
  padding: 20px 16px 0;
`;

const PageTitle = styled.h1`
  font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 4px;
`;

const PageSubtitle = styled.p`
  font-size: 13px; color: rgba(255,255,255,0.4); margin: 0 0 16px;
`;

// Balance Card
const BalanceCard = styled.section`
  margin: 0 16px 0;
  background: linear-gradient(135deg, rgba(124,111,205,0.25) 0%, rgba(100,80,200,0.12) 100%);
  border: 1px solid rgba(124,111,205,0.3);
  border-radius: 20px;
  padding: 20px;
`;

const BalanceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
`;

const BalanceItem = styled.div`
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 12px;
`;

const BalanceLabel = styled.p`
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: rgba(255,255,255,0.4);
  margin: 0 0 4px;
  display: flex; align-items: center; gap: 4px;
`;

const BalanceValue = styled.p`
  font-size: 24px; font-weight: 800;
  color: #fff; margin: 0;
  animation: ${countUp} 400ms ease;
`;

const BalanceUnit = styled.span`
  font-size: 13px; font-weight: 600;
  color: rgba(255,255,255,0.5);
  margin-left: 3px;
`;

// Token Pakete
const PackagesSection = styled.section`
  flex-shrink: 0;
  padding: 16px 16px 0;
`;

const SectionTitle = styled.h2`
  font-size: 14px; font-weight: 700;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase; letter-spacing: 0.6px;
  margin: 0 0 10px;
`;

const PackageList = styled.ul`
  list-style: none; padding: 0; margin: 0;
  display: flex; gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  padding-bottom: 4px;
`;

const PackageItem = styled.li``;

const PackageBtn = styled.button`
  flex-shrink: 0;
  min-width: 90px;
  padding: 12px 10px;
  border-radius: 14px;
  border: 1.5px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  touch-action: manipulation;
  text-align: center;
  transition: all 150ms;
  min-height: 72px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;

  &:hover, &:focus-visible {
    border-color: var(--color-accent,#7c6fcd);
    background: rgba(124,111,205,0.1);
    outline: none;
  }

  ${({ $popular }) => $popular && `
    border-color: var(--color-accent,#7c6fcd);
    background: rgba(124,111,205,0.12);
    position: relative;
  `}
`;

const PackageTokens = styled.span`
  display: block;
  font-size: 18px; font-weight: 800; color: #fff;
`;

const PackageTokenUnit = styled.span`
  font-size: 10px; color: rgba(255,255,255,0.4); font-weight: 600;
`;

const PackagePrice = styled.span`
  display: block;
  font-size: 13px; font-weight: 700;
  color: var(--color-accent,#7c6fcd);
  margin-top: 2px;
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -8px; left: 50%; transform: translateX(-50%);
  background: var(--color-accent,#7c6fcd);
  color: #fff;
  font-size: 9px; font-weight: 800;
  padding: 2px 8px; border-radius: 10px;
  white-space: nowrap;
`;

// Transaktionshistorie
const HistorySection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 16px 0;
`;

const ScrollList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 32px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
`;

const TxList = styled.ul`
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 2px;
`;

const TxItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);

  &:last-child { border-bottom: none; }
`;

const TxIconWrap = styled.div`
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const TxMeta = styled.div`flex: 1; min-width: 0;`;

const TxDescription = styled.p`
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8);
  margin: 0 0 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const TxDate = styled.time`
  font-size: 11px; color: rgba(255,255,255,0.3);
`;

const TxAmount = styled.span`
  font-size: 15px; font-weight: 800;
  color: ${({ $amount }) => getTxColor($amount)};
  flex-shrink: 0;
  white-space: nowrap;
`;

// Skeleton
const SkeletonLine = styled.div`
  height: ${({ $h }) => $h || 16}px;
  width: ${({ $w }) => $w || '100%'};
  border-radius: 8px;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 100%);
  background-size: 200% auto;
  animation: ${shimmer} 1.5s linear infinite;
`;

const EmptyHistory = styled.div`
  text-align: center; padding: 32px 0;
  color: rgba(255,255,255,0.25);
  font-size: 13px;
`;

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
const WalletPage = ({ currentUser, language = 'de' }) => {
  const { t }  = useTranslation();
  const locale = language === 'de' ? 'de-DE' : language === 'ar' ? 'ar-SA' : 'en-US';

  const [balance,   setBalance]   = useState(null);
  const [locked,    setLocked]    = useState(0);
  const [txHistory, setTxHistory] = useState([]);
  const [packages,  setPackages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [buying,    setBuying]    = useState(null);  // package_id

  // ── Daten laden ─────────────────────────────────────────────────────────────
  const loadWallet = useCallback(async () => {
    const [profileRes, txRes, pkgRes, swapsRes] = await Promise.all([
      supabase.from('profiles').select('token_balance').single(),
      supabase.from('token_ledger')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('token_packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order'),
      // Gesperrte Token = Summe der aktiven Swap-Kautionen
      supabase.from('swaps')
        .select('token_lock_a, token_lock_b, user_a_id, user_b_id')
        .in('status', ['pending','locked','shipped_a','shipped_b','both_shipped']),
    ]);

    if (profileRes.data) setBalance(profileRes.data.token_balance);
    if (txRes.data)      setTxHistory(txRes.data);
    if (pkgRes.data)     setPackages(pkgRes.data);

    // Gesperrte Token berechnen
    if (swapsRes.data && currentUser?.id) {
      const lockedSum = swapsRes.data.reduce((sum, swap) => {
        if (swap.user_a_id === currentUser.id) return sum + (swap.token_lock_a || 0);
        if (swap.user_b_id === currentUser.id) return sum + (swap.token_lock_b || 0);
        return sum;
      }, 0);
      setLocked(lockedSum);
    }

    setLoading(false);
  }, [currentUser?.id]);

  useEffect(() => { loadWallet(); }, [loadWallet]);

  // ── Token kaufen ─────────────────────────────────────────────────────────────
  const handleBuyTokens = useCallback(async (pkg) => {
    setBuying(pkg.id);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          package_id:  pkg.id,
          success_url: `${window.location.origin}/wallet?success=1`,
          cancel_url:  `${window.location.origin}/wallet`,
        },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      alert(err.message);
    } finally {
      setBuying(null);
    }
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Page>
      <PageHeader>
        <PageTitle>{t('wallet.title', 'Mein Wallet')}</PageTitle>
        <PageSubtitle>{t('wallet.subtitle', 'Token-Guthaben und Transaktionen')}</PageSubtitle>
      </PageHeader>

      {/* ── Balance Card ── */}
      <BalanceCard aria-label={t('wallet.balance', 'Guthaben')}>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
          {t('wallet.yourBalance', 'Dein Guthaben')}
        </p>
        <BalanceGrid>
          <BalanceItem>
            <BalanceLabel>
              <span aria-hidden="true">🪙</span>
              {t('wallet.available', 'Verfügbar')}
            </BalanceLabel>
            {loading
              ? <SkeletonLine $h={32} $w="80%" />
              : <BalanceValue>
                  {balance ?? 0}
                  <BalanceUnit>Token</BalanceUnit>
                </BalanceValue>
            }
          </BalanceItem>
          <BalanceItem>
            <BalanceLabel>
              <span aria-hidden="true">🔒</span>
              {t('wallet.locked', 'Gesperrt')}
            </BalanceLabel>
            {loading
              ? <SkeletonLine $h={32} $w="60%" />
              : <BalanceValue style={{ color: locked > 0 ? '#ffb400' : 'rgba(255,255,255,0.4)' }}>
                  {locked}
                  <BalanceUnit>Token</BalanceUnit>
                </BalanceValue>
            }
          </BalanceItem>
        </BalanceGrid>
      </BalanceCard>

      {/* ── Token Pakete ── */}
      <PackagesSection aria-label={t('wallet.buyTokens', 'Token kaufen')}>
        <SectionTitle>{t('wallet.buyTokens', 'Token kaufen')}</SectionTitle>
        {loading ? (
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4].map(i => <SkeletonLine key={i} $h={72} $w="90px" style={{ borderRadius: 14, flexShrink: 0 }} />)}
          </div>
        ) : (
          <PackageList>
            {packages.map((pkg, i) => {
              const name = typeof pkg.name === 'object'
                ? (pkg.name[language] || pkg.name.de || pkg.name.en)
                : pkg.name;
              const isPopular = i === 1; // Standard = beliebtestes

              return (
                <PackageItem key={pkg.id}>
                  <PackageBtn
                    $popular={isPopular}
                    onClick={() => handleBuyTokens(pkg)}
                    disabled={buying === pkg.id}
                    aria-label={`${pkg.token_amount} Token für ${formatCurrency(pkg.price_eur_cents, locale)} kaufen`}
                    style={{ position: 'relative' }}
                  >
                    {isPopular && (
                      <PopularBadge aria-hidden="true">
                        {t('wallet.popular', 'Beliebt')}
                      </PopularBadge>
                    )}
                    <PackageTokens>
                      {buying === pkg.id ? '⏳' : pkg.token_amount}
                    </PackageTokens>
                    <PackageTokenUnit>Token</PackageTokenUnit>
                    <PackagePrice>
                      {formatCurrency(pkg.price_eur_cents, locale)}
                    </PackagePrice>
                  </PackageBtn>
                </PackageItem>
              );
            })}
          </PackageList>
        )}
      </PackagesSection>

      {/* ── Transaktionshistorie ── */}
      <HistorySection>
        <SectionTitle>{t('wallet.history', 'Transaktionen')}</SectionTitle>
        <ScrollList>
          {loading ? (
            <TxList aria-label={t('wallet.loadingHistory', 'Lädt…')}>
              {[1,2,3,4,5].map(i => (
                <TxItem key={i}>
                  <SkeletonLine $h={36} $w="36px" style={{ borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <SkeletonLine $h={13} $w="70%" />
                    <SkeletonLine $h={11} $w="40%" />
                  </div>
                  <SkeletonLine $h={15} $w="48px" style={{ flexShrink: 0 }} />
                </TxItem>
              ))}
            </TxList>
          ) : txHistory.length === 0 ? (
            <EmptyHistory>
              <p style={{ fontSize: 32, margin: '0 0 8px' }} aria-hidden="true">🪙</p>
              <p>{t('wallet.noHistory', 'Noch keine Transaktionen')}</p>
            </EmptyHistory>
          ) : (
            <TxList aria-label={t('wallet.transactionList', 'Transaktionsliste')}>
              {txHistory.map(tx => (
                <TxItem key={tx.id}>
                  <TxIconWrap aria-hidden="true">
                    {getTxIcon(tx.type)}
                  </TxIconWrap>
                  <TxMeta>
                    <TxDescription>
                      {tx.description || t(`wallet.txType.${tx.type}`, tx.type)}
                    </TxDescription>
                    <TxDate dateTime={tx.created_at}>
                      {formatDate(tx.created_at, locale)}
                    </TxDate>
                  </TxMeta>
                  {tx.amount !== 0 && (
                    <TxAmount
                      $amount={tx.amount}
                      aria-label={`${tx.amount > 0 ? '+' : ''}${tx.amount} Token`}
                    >
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </TxAmount>
                  )}
                </TxItem>
              ))}
            </TxList>
          )}
        </ScrollList>
      </HistorySection>
    </Page>
  );
};

export default WalletPage;
