// src/components/SwapDetailView.jsx
// Kapitel 5 — Swap-Detail + Versand-Nachweis (Cloudinary signierter Upload)
// Mobile-First, semantisch korrekt, Foto-Pflicht vor shipped-Status

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

// ─── Animationen ─────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); }`;
const spin   = keyframes`to { transform: rotate(360deg); }`;
const pulse  = keyframes`0%,100% { opacity: 1; } 50% { opacity: 0.5; }`;

// ─── Styled Components ────────────────────────────────────────────────────────
const Page = styled.main`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg, #0f0f1a);
  overflow: hidden;
  animation: ${fadeIn} 250ms ease;
`;

const PageHeader = styled.header`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
`;

const BackBtn = styled.button`
  width: 36px; height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.7);
  font-size: 18px;
  cursor: pointer;
  touch-action: manipulation;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  &:focus-visible { outline: 2px solid var(--color-accent,#7c6fcd); outline-offset: 2px; }
`;

const HeaderTitle = styled.h1`
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin: 0;
  flex: 1;
`;

const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

// Status Timeline
const Timeline = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineStep = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 15px;
    top: 32px;
    width: 2px;
    bottom: -8px;
    background: ${({ $done }) => $done ? 'var(--color-accent,#7c6fcd)' : 'rgba(255,255,255,0.1)'};
    transition: background 300ms;
  }
`;

const StepDot = styled.div`
  width: 32px; height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
  background: ${({ $done, $active }) =>
    $done   ? 'var(--color-accent,#7c6fcd)' :
    $active ? 'rgba(124,111,205,0.2)'       :
              'rgba(255,255,255,0.06)'};
  border: 2px solid ${({ $done, $active }) =>
    $done   ? 'var(--color-accent,#7c6fcd)' :
    $active ? 'var(--color-accent,#7c6fcd)' :
              'rgba(255,255,255,0.1)'};
  ${({ $active }) => $active && css`animation: ${pulse} 2s ease infinite;`}
`;

const StepText = styled.div`
  padding: 6px 0 16px;
`;

const StepTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $done, $active }) => $done || $active ? '#fff' : 'rgba(255,255,255,0.4)'};
  margin: 0 0 2px;
`;

const StepSub = styled.p`
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  margin: 0;
`;

// Partner Card
const PartnerCard = styled.section`
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PartnerAvatar = styled.figure`
  width: 48px; height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  flex-shrink: 0;
  margin: 0;
`;

const PartnerImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

const PartnerMeta = styled.div`flex: 1; min-width: 0;`;

const PartnerName = styled.h2`
  font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 3px;
`;

const ReputationBadge = styled.span`
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 12px;
  ${({ $tier }) => {
    if ($tier === 'top')     return css`background: rgba(50,200,120,0.15); color: #5de8a0;`;
    if ($tier === 'warning') return css`background: rgba(255,80,80,0.15);  color: #ff7070;`;
    return css`background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5);`;
  }}
`;

// Sticker Exchange Summary
const ExchangeCard = styled.section`
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 14px;
`;

const ExchangeTitle = styled.h2`
  font-size: 13px; font-weight: 700;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase; letter-spacing: 0.6px;
  margin: 0 0 10px;
`;

const ExchangeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px; align-items: start;
`;

const ExchangeSide = styled.div``;

const ExchangeLabel = styled.p`
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin: 0 0 6px;
  color: ${({ $dir }) => $dir === 'give' ? 'rgba(255,180,0,0.8)' : 'rgba(50,200,120,0.8)'};
`;

const StickerList = styled.ul`
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-wrap: wrap; gap: 4px;
`;

const StickerChip = styled.li`
  font-size: 11px; font-weight: 600;
  padding: 3px 7px; border-radius: 8px;
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.65);
`;

const ChevronDiv = styled.div`
  padding-top: 4px;
  font-size: 16px; opacity: 0.5;
  [dir="rtl"] & { transform: scaleX(-1); }
`;

// Upload Section
const UploadSection = styled.section`
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 14px;
`;

const UploadTitle = styled.h2`
  font-size: 14px; font-weight: 700; color: #fff; margin: 0 0 4px;
`;

const UploadHint = styled.p`
  font-size: 12px; color: rgba(255,255,255,0.4); margin: 0 0 12px;
`;

const UploadZone = styled.button`
  width: 100%;
  min-height: 120px;
  border-radius: 12px;
  border: 2px dashed ${({ $hasImage }) => $hasImage ? 'var(--color-accent,#7c6fcd)' : 'rgba(255,255,255,0.12)'};
  background: ${({ $hasImage }) => $hasImage ? 'rgba(124,111,205,0.06)' : 'rgba(255,255,255,0.02)'};
  cursor: pointer;
  touch-action: manipulation;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px;
  transition: all 150ms;
  position: relative;
  overflow: hidden;
  padding: 12px;

  &:focus-visible { outline: 2px solid var(--color-accent,#7c6fcd); outline-offset: 2px; }
  &:hover { border-color: var(--color-accent,#7c6fcd); background: rgba(124,111,205,0.06); }
`;

const UploadPreview = styled.img`
  width: 100%; height: 100%;
  object-fit: cover;
  position: absolute; inset: 0;
  border-radius: 10px;
`;

const UploadIcon = styled.span`font-size: 32px; line-height: 1;`;
const UploadText = styled.span`font-size: 12px; color: rgba(255,255,255,0.4);`;

const TrackingInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin-top: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  box-sizing: border-box;
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus { outline: 2px solid var(--color-accent,#7c6fcd); outline-offset: -1px; border-color: transparent; }
`;

// Action Button
const ActionBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  font-size: 15px; font-weight: 800;
  cursor: pointer;
  touch-action: manipulation;
  min-height: 52px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: opacity 150ms, transform 150ms;
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.4; pointer-events: none; }

  ${({ $variant }) => $variant === 'danger'
    ? css`background: rgba(255,80,80,0.15); color: #ff7070; border: 1px solid rgba(255,80,80,0.3);`
    : css`background: var(--color-accent,#7c6fcd); color: #fff;`
  }
`;

const Spinner = styled.span`
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 600ms linear infinite;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getReputationTier = (score) => {
  if (score >= 50)  return { tier: 'top',     label: 'Top-Tauscher', icon: '🏆' };
  if (score >= 10)  return { tier: 'normal',  label: 'Erfahren',     icon: '✅' };
  if (score >= 0)   return { tier: 'newbie',  label: 'Neuling',      icon: '🌱' };
  return              { tier: 'warning', label: 'Warnung',      icon: '⚠️' };
};

const SWAP_STEPS = [
  { key: 'pending',      label: 'Anfrage gesendet',   icon: '📨' },
  { key: 'locked',       label: 'Kaution hinterlegt', icon: '🔒' },
  { key: 'shipped',      label: 'Versendet',          icon: '📦' },
  { key: 'both_shipped', label: 'Beide versendet',    icon: '✉️' },
  { key: 'completed',    label: 'Abgeschlossen',      icon: '🎉' },
];

const statusToStep = (status) => {
  const map = { pending: 0, locked: 1, shipped_a: 2, shipped_b: 2, both_shipped: 3, completed: 4 };
  return map[status] ?? 0;
};

// ─── Cloudinary signierter Upload ─────────────────────────────────────────────
const uploadToCloudinary = async (file, swapId) => {
  // Signiertes Upload-Token von unserer Edge Function holen
  const { data: { token, timestamp, folder }, error } = await supabase.functions.invoke(
    'get-cloudinary-token',
    { body: { folder: `stickerswap/swaps/${swapId}` } }
  );
  if (error) throw new Error('Upload-Token konnte nicht geladen werden');

  const formData = new FormData();
  formData.append('file',        file);
  formData.append('api_key',     process.env.REACT_APP_CLOUDINARY_API_KEY ?? '');
  formData.append('timestamp',   String(timestamp));
  formData.append('signature',   token);
  formData.append('folder',      folder);
  formData.append('transformation', 'c_limit,w_1200,h_1200,q_auto,f_auto');

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ?? '';
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Cloudinary Upload fehlgeschlagen');
  const data = await res.json();
  return data.secure_url;
};

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
const SwapDetailView = ({ swapId, currentUserId, onBack, onSwapUpdated }) => {
  const { t }        = useTranslation();
  const fileInputRef = useRef(null);

  const [swap,           setSwap]           = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [uploading,      setUploading]      = useState(false);
  const [submitting,     setSubmitting]     = useState(false);
  const [proofImageUrl,  setProofImageUrl]  = useState(null);
  const [proofPreview,   setProofPreview]   = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  // ── Swap laden ─────────────────────────────────────────────────────────────
  const loadSwap = useCallback(async () => {
    const { data, error } = await supabase
      .from('swaps')
      .select(`
        *,
        swap_stickers(sticker_id, direction),
        user_a:profiles!user_a_id(id, display_name, avatar_url, reputation_score, country_code),
        user_b:profiles!user_b_id(id, display_name, avatar_url, reputation_score, country_code)
      `)
      .eq('id', swapId)
      .single();

    if (!error) setSwap(data);
    setLoading(false);
  }, [swapId]);

  useEffect(() => { loadSwap(); }, [loadSwap]);

  // ── Datei auswählen ────────────────────────────────────────────────────────
  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vorschau
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target?.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, swapId);
      setProofImageUrl(url);
    } catch (err) {
      alert(err.message);
      setProofPreview(null);
    } finally {
      setUploading(false);
    }
  }, [swapId]);

  // ── Als versendet markieren ────────────────────────────────────────────────
  const handleMarkShipped = useCallback(async () => {
    if (!proofImageUrl) return;
    setSubmitting(true);

    const { error } = await supabase.rpc('mark_shipped', {
      p_swap_id:         swapId,
      p_proof_image_url: proofImageUrl,
      p_tracking_number: trackingNumber || null,
    });

    if (error) {
      alert(error.message);
    } else {
      await loadSwap();
      onSwapUpdated?.();
    }
    setSubmitting(false);
  }, [swapId, proofImageUrl, trackingNumber, loadSwap, onSwapUpdated]);

  // ── Empfang bestätigen ─────────────────────────────────────────────────────
  const handleConfirmReceived = useCallback(async () => {
    setSubmitting(true);
    const { error } = await supabase.rpc('confirm_received', { p_swap_id: swapId });
    if (error) {
      alert(error.message);
    } else {
      await loadSwap();
      onSwapUpdated?.();
    }
    setSubmitting(false);
  }, [swapId, loadSwap, onSwapUpdated]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <Page>
      <PageHeader>
        <BackBtn onClick={onBack} aria-label="Zurück">←</BackBtn>
        <HeaderTitle>Laden…</HeaderTitle>
      </PageHeader>
    </Page>
  );

  if (!swap) return null;

  const isUserA    = currentUserId === swap.user_a_id;
  const partner    = isUserA ? swap.user_b : swap.user_a;
  const repInfo    = getReputationTier(partner?.reputation_score ?? 0);
  const currentStep = statusToStep(swap.status);

  const myShipped   = isUserA ? !!swap.shipped_at_a  : !!swap.shipped_at_b;
  const myConfirmed = isUserA ? !!swap.confirmed_at_a : !!swap.confirmed_at_b;

  const giveStickers = swap.swap_stickers
    ?.filter(s => isUserA ? s.direction === 'a_to_b' : s.direction === 'b_to_a')
    .map(s => s.sticker_id.slice(0, 8));

  const receiveStickers = swap.swap_stickers
    ?.filter(s => isUserA ? s.direction === 'b_to_a' : s.direction === 'a_to_b')
    .map(s => s.sticker_id.slice(0, 8));

  const canMarkShipped = swap.status === 'locked' && !myShipped;
  const canConfirm     = ['both_shipped', 'shipped_a', 'shipped_b'].includes(swap.status) && !myConfirmed;

  return (
    <Page>
      {/* ── Header ── */}
      <PageHeader>
        <BackBtn onClick={onBack} aria-label={t('common.back', 'Zurück')}>
          ←
        </BackBtn>
        <HeaderTitle>
          {t('swap.detail.title', 'Tausch-Details')}
        </HeaderTitle>
      </PageHeader>

      <ScrollContent>
        {/* ── Partner ── */}
        <PartnerCard aria-label={t('swap.detail.partner', 'Tauschpartner')}>
          <PartnerAvatar>
            {partner?.avatar_url
              ? <PartnerImg src={partner.avatar_url} alt="" aria-hidden="true" />
              : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22 }} aria-hidden="true">👤</div>
            }
          </PartnerAvatar>
          <PartnerMeta>
            <PartnerName>{partner?.display_name ?? 'Sammler'}</PartnerName>
            <ReputationBadge $tier={repInfo.tier}>
              <span aria-hidden="true">{repInfo.icon}</span>
              {repInfo.label}
            </ReputationBadge>
          </PartnerMeta>
        </PartnerCard>

        {/* ── Status Timeline ── */}
        <section aria-label={t('swap.detail.timeline', 'Status-Verlauf')}>
          <Timeline>
            {SWAP_STEPS.map((step, i) => (
              <TimelineStep key={step.key} $done={i < currentStep}>
                <StepDot $done={i < currentStep} $active={i === currentStep}>
                  <span aria-hidden="true">{i < currentStep ? '✓' : step.icon}</span>
                </StepDot>
                <StepText>
                  <StepTitle $done={i < currentStep} $active={i === currentStep}>
                    {step.label}
                  </StepTitle>
                  {i === currentStep && (
                    <StepSub>{t('swap.detail.currentStep', 'Aktueller Schritt')}</StepSub>
                  )}
                </StepText>
              </TimelineStep>
            ))}
          </Timeline>
        </section>

        {/* ── Sticker-Übersicht ── */}
        <ExchangeCard aria-label={t('swap.detail.exchange', 'Tausch-Inhalt')}>
          <ExchangeTitle>{t('swap.detail.exchangeTitle', 'Tausch-Inhalt')}</ExchangeTitle>
          <ExchangeRow>
            <ExchangeSide>
              <ExchangeLabel $dir="give">{t('match.youGive', 'Du gibst')}</ExchangeLabel>
              <StickerList>
                {giveStickers?.map(id => <StickerChip key={id}>#{id}</StickerChip>)}
              </StickerList>
            </ExchangeSide>
            <ChevronDiv aria-hidden="true">⇄</ChevronDiv>
            <ExchangeSide>
              <ExchangeLabel $dir="receive">{t('match.youGet', 'Du bekommst')}</ExchangeLabel>
              <StickerList>
                {receiveStickers?.map(id => <StickerChip key={id}>#{id}</StickerChip>)}
              </StickerList>
            </ExchangeSide>
          </ExchangeRow>
        </ExchangeCard>

        {/* ── Versand-Upload (nur wenn an der Reihe) ── */}
        {canMarkShipped && (
          <UploadSection aria-label={t('swap.detail.proofUpload', 'Versand-Nachweis')}>
            <UploadTitle>{t('swap.detail.proofTitle', 'Foto des Briefes hochladen')}</UploadTitle>
            <UploadHint>
              {t('swap.detail.proofHint', 'Lade ein Foto des frankierten Umschlags hoch. Erst dann kannst du den Status auf "Versendet" setzen.')}
            </UploadHint>

            <UploadZone
              $hasImage={!!proofPreview}
              onClick={() => fileInputRef.current?.click()}
              aria-label={t('swap.detail.uploadZone', 'Foto auswählen')}
            >
              {proofPreview && <UploadPreview src={proofPreview} alt="" aria-hidden="true" />}
              {!proofPreview && (
                <>
                  <UploadIcon aria-hidden="true">
                    {uploading ? '⏳' : '📷'}
                  </UploadIcon>
                  <UploadText>
                    {uploading
                      ? t('swap.detail.uploading', 'Wird hochgeladen…')
                      : t('swap.detail.uploadCta', 'Tippe um Foto aufzunehmen oder auszuwählen')
                    }
                  </UploadText>
                </>
              )}
            </UploadZone>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"   // direkt Kamera auf Mobile
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            <TrackingInput
              type="text"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              placeholder={t('swap.detail.trackingPlaceholder', 'Sendungsnummer (optional)')}
              aria-label={t('swap.detail.trackingLabel', 'Sendungsnummer')}
            />

            <ActionBtn
              style={{ marginTop: 12 }}
              onClick={handleMarkShipped}
              disabled={!proofImageUrl || uploading || submitting}
              aria-label={t('swap.detail.markShipped', 'Als versendet markieren')}
            >
              {submitting ? <Spinner aria-hidden="true" /> : <span aria-hidden="true">📦</span>}
              {t('swap.detail.markShipped', 'Als versendet markieren')}
            </ActionBtn>
          </UploadSection>
        )}

        {/* ── Empfang bestätigen ── */}
        {canConfirm && (
          <ActionBtn
            onClick={handleConfirmReceived}
            disabled={submitting}
            aria-label={t('swap.detail.confirmReceived', 'Empfang bestätigen')}
          >
            {submitting ? <Spinner aria-hidden="true" /> : <span aria-hidden="true">✅</span>}
            {t('swap.detail.confirmReceived', 'Empfang bestätigen')}
          </ActionBtn>
        )}

        {/* ── Abgeschlossen ── */}
        {swap.status === 'completed' && (
          <section style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ fontSize: 48, margin: '0 0 8px' }} aria-hidden="true">🎉</p>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: 0 }}>
              {t('swap.detail.completed', 'Tausch erfolgreich abgeschlossen!')}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>
              {t('swap.detail.reputationGained', '+5 Reputation für beide Seiten')}
            </p>
          </section>
        )}
      </ScrollContent>
    </Page>
  );
};

export default SwapDetailView;
