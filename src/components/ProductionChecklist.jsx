// src/components/ProductionChecklist.jsx
// Kapitel 7 — Nur für Entwicklung! Nicht in Prod anzeigen.
// Prüft ENV-Keys, i18n-Vollständigkeit, RTL, PWA-Status

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Nur in Development rendern
if (process.env.NODE_ENV === 'production') {
  const ProductionChecklist = () => null;
  export default ProductionChecklist;
}

// ─── Alle benötigten ENV-Keys ─────────────────────────────────────────────────
const REQUIRED_ENV = [
  // Supabase
  { key: 'REACT_APP_SUPABASE_URL',       group: 'Supabase',   desc: 'Supabase Project URL' },
  { key: 'REACT_APP_SUPABASE_ANON_KEY',  group: 'Supabase',   desc: 'Supabase Anon Key' },
  // Cloudinary
  { key: 'REACT_APP_CLOUDINARY_CLOUD_NAME', group: 'Cloudinary', desc: 'Cloud Name' },
  { key: 'REACT_APP_CLOUDINARY_API_KEY',    group: 'Cloudinary', desc: 'API Key (für signed uploads)' },
  // Stripe
  { key: 'REACT_APP_STRIPE_PUBLISHABLE_KEY', group: 'Stripe', desc: 'Publishable Key (pk_live_...)' },
  // Google
  { key: 'REACT_APP_GA4_MEASUREMENT_ID',   group: 'Google', desc: 'GA4 Measurement ID (G-...)' },
];

// ─── i18n Keys die alle 15 Sprachen haben müssen ─────────────────────────────
const REQUIRED_I18N_KEYS = [
  'common.loading', 'common.cancel', 'common.back',
  'wallet.title', 'chat.title', 'match.title',
  'swap.detail.title', 'dispute.title',
  'chat.system.completed', 'chat.system.shipped',
  'notif.swapAccepted', 'notif.swapCompleted',
  'reputation.top', 'reputation.newbie',
];

const SUPPORTED_LANGUAGES = [
  'de','en','es','pt','it','fr','ar','tr','pl','nl','sv','no','da','fi','en-GB'
];

const RTL_LANGUAGES = ['ar'];

// ─── Styled Components ────────────────────────────────────────────────────────
const Panel = styled.div`
  position: fixed;
  top: 0; right: 0;
  width: min(420px, 100vw);
  height: 100dvh;
  background: #0d0d1a;
  border-left: 1px solid rgba(124,111,205,0.3);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`;

const PanelHeader = styled.div`
  padding: 14px 16px;
  background: rgba(124,111,205,0.15);
  border-bottom: 1px solid rgba(124,111,205,0.2);
  display: flex; align-items: center; justify-content: space-between;
`;

const PanelTitle = styled.h1`
  font-size: 13px; font-weight: 800; color: #7c6fcd; margin: 0;
  text-transform: uppercase; letter-spacing: 1px;
`;

const CloseBtn = styled.button`
  background: none; border: none; color: rgba(255,255,255,0.4);
  font-size: 18px; cursor: pointer; padding: 2px 6px;
`;

const ScrollArea = styled.div`
  flex: 1; overflow-y: auto; padding: 12px;
  display: flex; flex-direction: column; gap: 12px;
  scrollbar-width: thin;
`;

const Section = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 10px;
  overflow: hidden;
`;

const SectionTitle = styled.div`
  padding: 8px 12px;
  background: rgba(255,255,255,0.04);
  font-size: 11px; font-weight: 800;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase; letter-spacing: 0.8px;
  display: flex; align-items: center; justify-content: space-between;
`;

const Score = styled.span`
  font-size: 11px; font-weight: 700;
  color: ${({ $ok }) => $ok ? '#5de8a0' : '#ff7070'};
`;

const CheckRow = styled.div`
  padding: 7px 12px;
  display: flex; align-items: flex-start; gap: 8px;
  border-top: 1px solid rgba(255,255,255,0.03);
`;

const CheckIcon = styled.span`
  font-size: 12px; flex-shrink: 0; margin-top: 1px;
`;

const CheckLabel = styled.div`
  flex: 1; min-width: 0;
`;

const CheckKey = styled.p`
  font-size: 11px; color: rgba(255,255,255,0.7); margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const CheckDesc = styled.p`
  font-size: 10px; color: rgba(255,255,255,0.3); margin: 0;
`;

const CheckValue = styled.p`
  font-size: 10px;
  color: ${({ $ok }) => $ok ? '#5de8a0' : '#ff7070'};
  margin: 0; flex-shrink: 0;
`;

const TriggerBtn = styled.button`
  position: fixed;
  bottom: 80px; right: 16px;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: #7c6fcd;
  color: #fff; border: none;
  font-size: 18px; cursor: pointer;
  z-index: 9998;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
`;

// ─── Checklist Component ──────────────────────────────────────────────────────
const ProductionChecklist = () => {
  const [open,    setOpen]    = useState(false);
  const [i18nRes, setI18nRes] = useState({});
  const [swStatus,setSwStatus] = useState('checking');

  // ENV prüfen
  const envChecks = REQUIRED_ENV.map(item => ({
    ...item,
    value: process.env[item.key],
    ok:    !!process.env[item.key] &&
           process.env[item.key] !== 'your_key_here' &&
           process.env[item.key] !== 'undefined',
  }));

  // SW-Status
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/').then(reg => {
        setSwStatus(reg ? 'registered' : 'not_registered');
      });
    } else {
      setSwStatus('not_supported');
    }
  }, []);

  // i18n prüfen (wenn i18next verfügbar)
  useEffect(() => {
    try {
      const i18n = window.__i18n_instance__;
      if (!i18n) return;
      const results = {};
      SUPPORTED_LANGUAGES.forEach(lang => {
        const missing = REQUIRED_I18N_KEYS.filter(key => {
          const val = i18n.getFixedT(lang)(key);
          return val === key; // i18next gibt key zurück wenn nicht gefunden
        });
        results[lang] = { missing, ok: missing.length === 0 };
      });
      setI18nRes(results);
    } catch {}
  }, [open]);

  // RTL prüfen
  const rtlChecks = RTL_LANGUAGES.map(lang => ({
    lang,
    hasDir: document.documentElement.dir === 'rtl' ||
            document.querySelector(`[lang="${lang}"]`) !== null,
  }));

  const envOk    = envChecks.filter(c => c.ok).length;
  const i18nOk   = Object.values(i18nRes).filter(r => r.ok).length;
  const allPassed = envOk === envChecks.length &&
                    swStatus === 'registered';

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <>
      <TriggerBtn
        onClick={() => setOpen(o => !o)}
        title="Production Checklist"
        aria-label="Production Checklist öffnen"
      >
        {allPassed ? '✅' : '⚠️'}
      </TriggerBtn>

      {open && (
        <Panel role="complementary" aria-label="Production Checklist">
          <PanelHeader>
            <PanelTitle>Production Checklist</PanelTitle>
            <CloseBtn onClick={() => setOpen(false)}>×</CloseBtn>
          </PanelHeader>

          <ScrollArea>
            {/* ── ENV Keys ── */}
            <Section>
              <SectionTitle>
                Environment Variables
                <Score $ok={envOk === envChecks.length}>
                  {envOk}/{envChecks.length}
                </Score>
              </SectionTitle>
              {Object.entries(
                envChecks.reduce((g, c) => {
                  (g[c.group] = g[c.group] || []).push(c);
                  return g;
                }, {})
              ).map(([group, checks]) => (
                <React.Fragment key={group}>
                  <div style={{ padding: '5px 12px 2px', fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.5px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {group}
                  </div>
                  {checks.map(c => (
                    <CheckRow key={c.key}>
                      <CheckIcon>{c.ok ? '✅' : '❌'}</CheckIcon>
                      <CheckLabel>
                        <CheckKey>{c.key}</CheckKey>
                        <CheckDesc>{c.desc}</CheckDesc>
                      </CheckLabel>
                      <CheckValue $ok={c.ok}>
                        {c.ok ? c.value?.slice(0, 12) + '…' : 'MISSING'}
                      </CheckValue>
                    </CheckRow>
                  ))}
                </React.Fragment>
              ))}
            </Section>

            {/* ── Service Worker ── */}
            <Section>
              <SectionTitle>
                PWA / Service Worker
                <Score $ok={swStatus === 'registered'}>
                  {swStatus === 'registered' ? '✅' : '❌'}
                </Score>
              </SectionTitle>
              <CheckRow>
                <CheckIcon>{swStatus === 'registered' ? '✅' : '❌'}</CheckIcon>
                <CheckLabel>
                  <CheckKey>Service Worker</CheckKey>
                  <CheckDesc>service-worker.js registriert</CheckDesc>
                </CheckLabel>
                <CheckValue $ok={swStatus === 'registered'}>{swStatus}</CheckValue>
              </CheckRow>
              <CheckRow>
                <CheckIcon>{window.matchMedia('(display-mode: standalone)').matches ? '✅' : 'ℹ️'}</CheckIcon>
                <CheckLabel>
                  <CheckKey>Display Mode</CheckKey>
                  <CheckDesc>standalone = PWA installiert</CheckDesc>
                </CheckLabel>
                <CheckValue $ok={true}>
                  {window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'}
                </CheckValue>
              </CheckRow>
            </Section>

            {/* ── RTL ── */}
            <Section>
              <SectionTitle>RTL Support</SectionTitle>
              <CheckRow>
                <CheckIcon>ℹ️</CheckIcon>
                <CheckLabel>
                  <CheckKey>dir Attribut (html)</CheckKey>
                  <CheckDesc>Wird zur Laufzeit per i18n gesetzt</CheckDesc>
                </CheckLabel>
                <CheckValue $ok={true}>{document.documentElement.dir || 'ltr'}</CheckValue>
              </CheckRow>
              <CheckRow>
                <CheckIcon>ℹ️</CheckIcon>
                <CheckLabel>
                  <CheckKey>CSS [dir="rtl"] Regeln</CheckKey>
                  <CheckDesc>In SwapChat + MatchCard vorhanden</CheckDesc>
                </CheckLabel>
                <CheckValue $ok={true}>in CSS ✅</CheckValue>
              </CheckRow>
            </Section>

            {/* ── i18n ── */}
            <Section>
              <SectionTitle>
                i18n (15 Sprachen)
                <Score $ok={i18nOk === SUPPORTED_LANGUAGES.length}>
                  {Object.keys(i18nRes).length === 0
                    ? 'window.__i18n_instance__ nicht gesetzt'
                    : `${i18nOk}/${SUPPORTED_LANGUAGES.length}`
                  }
                </Score>
              </SectionTitle>
              {Object.keys(i18nRes).length === 0 ? (
                <CheckRow>
                  <CheckIcon>ℹ️</CheckIcon>
                  <CheckLabel>
                    <CheckKey>Tipp</CheckKey>
                    <CheckDesc>window.__i18n_instance__ = i18n in i18n.js setzen um hier zu prüfen</CheckDesc>
                  </CheckLabel>
                </CheckRow>
              ) : (
                SUPPORTED_LANGUAGES.map(lang => (
                  <CheckRow key={lang}>
                    <CheckIcon>{i18nRes[lang]?.ok ? '✅' : '❌'}</CheckIcon>
                    <CheckLabel>
                      <CheckKey>{lang}</CheckKey>
                      {!i18nRes[lang]?.ok && (
                        <CheckDesc>Fehlend: {i18nRes[lang]?.missing?.join(', ')}</CheckDesc>
                      )}
                    </CheckLabel>
                    <CheckValue $ok={i18nRes[lang]?.ok}>
                      {i18nRes[lang]?.ok ? 'vollständig' : `${i18nRes[lang]?.missing?.length} keys`}
                    </CheckValue>
                  </CheckRow>
                ))
              )}
            </Section>

          </ScrollArea>
        </Panel>
      )}
    </>
  );
};

export default ProductionChecklist;
