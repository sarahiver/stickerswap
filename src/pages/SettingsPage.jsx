// src/pages/SettingsPage.jsx
// Kapitel 8 — Einstellungen: Sprache, Land, International-Toggle, Benachrichtigungen

import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

const fadeIn = keyframes`from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}`;

// ─── Styled ───────────────────────────────────────────────────────────────────
const Page = styled.main`
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--color-bg);
  animation: ${fadeIn} 250ms ease;
`;

const Header = styled.header`padding: 20px 16px 8px;`;
const PageTitle = styled.h1`font-size: 22px; font-weight: 800; color: #fff; margin: 0;`;

const Content = styled.div`
  padding: 12px 16px 40px;
  display: flex; flex-direction: column; gap: 8px;
  max-width: 480px; margin: 0 auto;
`;

const SectionLabel = styled.h2`
  font-size: 11px; font-weight: 700;
  color: var(--color-text-mute);
  text-transform: uppercase; letter-spacing: 0.7px;
  margin: 12px 0 4px; padding: 0 4px;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex; align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
  &:last-child { border-bottom: none; }
`;

const RowIcon = styled.span`font-size: 18px; flex-shrink: 0;`;
const RowText = styled.div`flex: 1; min-width: 0;`;
const RowLabel = styled.p`font-size: 14px; font-weight: 600; color: #fff; margin: 0 0 1px;`;
const RowSub   = styled.p`font-size: 11px; color: var(--color-text-mute); margin: 0;`;

// Select
const Select = styled.select`
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: #fff;
  font-size: 13px; font-weight: 600;
  padding: 7px 10px;
  cursor: pointer;
  min-height: 36px;
  max-width: 130px;
  &:focus { outline: 2px solid var(--color-accent); outline-offset: -1px; }
  option { background: #1a1a2e; }
`;

// Toggle
const ToggleWrap = styled.label`
  position: relative;
  width: 46px; height: 26px;
  flex-shrink: 0;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  opacity: 0; width: 0; height: 0; position: absolute;
  &:focus-visible + span {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: 13px;
  }
`;

const ToggleSlider = styled.span`
  position: absolute; inset: 0;
  background: ${({ $on }) => $on ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'};
  border-radius: 13px;
  transition: background 200ms;
  &::before {
    content: '';
    position: absolute;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #fff;
    top: 3px;
    left: ${({ $on }) => $on ? '23px' : '3px'};
    transition: left 200ms;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
`;

// Info hint
const InfoHint = styled.div`
  display: flex; align-items: flex-start; gap: 8px;
  background: rgba(255,180,0,0.08);
  border: 1px solid rgba(255,180,0,0.2);
  border-radius: 10px;
  padding: 10px 12px;
  margin-top: 2px;
`;

const InfoIcon = styled.span`font-size: 14px; flex-shrink: 0; margin-top: 1px;`;
const InfoText = styled.p`font-size: 12px; color: rgba(255,180,0,0.9); margin: 0; line-height: 1.5;`;

// Save Feedback
const SavedBadge = styled.span`
  font-size: 12px; font-weight: 700; color: var(--color-accent2);
  animation: ${fadeIn} 200ms ease;
`;

// Sign Out
const SignOutBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: rgba(255,80,80,0.08);
  border: 1px solid rgba(255,80,80,0.2);
  border-radius: 14px;
  color: var(--color-danger);
  font-size: 15px; font-weight: 700;
  cursor: pointer;
  touch-action: manipulation;
  margin-top: 8px;
  min-height: 52px;
  transition: background 150ms;
  &:active { background: rgba(255,80,80,0.15); }
`;

// ─── Sprachkonfiguration ──────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'pt', label: '🇵🇹 Português' },
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'ar', label: '🇸🇦 العربية' },
  { code: 'tr', label: '🇹🇷 Türkçe' },
  { code: 'pl', label: '🇵🇱 Polski' },
  { code: 'nl', label: '🇳🇱 Nederlands' },
  { code: 'sv', label: '🇸🇪 Svenska' },
  { code: 'no', label: '🇳🇴 Norsk' },
  { code: 'da', label: '🇩🇰 Dansk' },
  { code: 'fi', label: '🇫🇮 Suomi' },
];

const COUNTRIES = [
  { code: 'DE', label: '🇩🇪 Deutschland' },
  { code: 'AT', label: '🇦🇹 Österreich' },
  { code: 'CH', label: '🇨🇭 Schweiz' },
  { code: 'GB', label: '🇬🇧 Großbritannien' },
  { code: 'US', label: '🇺🇸 USA' },
  { code: 'FR', label: '🇫🇷 Frankreich' },
  { code: 'ES', label: '🇪🇸 Spanien' },
  { code: 'IT', label: '🇮🇹 Italien' },
  { code: 'NL', label: '🇳🇱 Niederlande' },
  { code: 'PL', label: '🇵🇱 Polen' },
  { code: 'TR', label: '🇹🇷 Türkei' },
  { code: 'SA', label: '🇸🇦 Saudi-Arabien' },
];

// ─── Hauptkomponente ──────────────────────────────────────────────────────────
const SettingsPage = ({ profile, user, onSignOut, onProfileUpdated }) => {
  const { t, i18n } = useTranslation();

  const [language,    setLanguage]    = useState(i18n.language?.slice(0,2) ?? 'de');
  const [country,     setCountry]     = useState(profile?.country_code ?? 'DE');
  const [intlSwaps,   setIntlSwaps]   = useState(profile?.search_international ?? false);
  const [emailNotif,  setEmailNotif]  = useState(profile?.email_notifications ?? true);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  // Auto-Save bei jeder Änderung
  const saveSettings = useCallback(async (patch) => {
    if (!user?.id) return;
    setSaving(true);
    await supabase.from('profiles').update(patch).eq('id', user.id);
    onProfileUpdated?.();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [user?.id, onProfileUpdated]);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    saveSettings({ language: code });
  };

  const handleCountryChange = (code) => {
    setCountry(code);
    saveSettings({ country_code: code });
  };

  const handleIntlToggle = (val) => {
    setIntlSwaps(val);
    saveSettings({ search_international: val });
  };

  const handleEmailToggle = (val) => {
    setEmailNotif(val);
    saveSettings({ email_notifications: val });
  };

  return (
    <Page>
      <Header>
        <PageTitle>{t('settings.title')}</PageTitle>
      </Header>

      <Content>
        {/* ── Sprache & Region ── */}
        <SectionLabel>{t('settings.language')} & Region</SectionLabel>
        <Card>
          <Row>
            <RowIcon aria-hidden="true">🌍</RowIcon>
            <RowText>
              <RowLabel>{t('settings.language')}</RowLabel>
            </RowText>
            <Select
              value={language}
              onChange={e => handleLanguageChange(e.target.value)}
              aria-label={t('settings.language')}
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </Select>
          </Row>

          <Row>
            <RowIcon aria-hidden="true">📍</RowIcon>
            <RowText>
              <RowLabel>{t('settings.country')}</RowLabel>
            </RowText>
            <Select
              value={country}
              onChange={e => handleCountryChange(e.target.value)}
              aria-label={t('settings.country')}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </Select>
          </Row>
        </Card>

        {/* ── Tausch-Einstellungen ── */}
        <SectionLabel>Tausch</SectionLabel>
        <Card>
          <Row>
            <RowIcon aria-hidden="true">🌐</RowIcon>
            <RowText>
              <RowLabel>{t('settings.internationalSwaps')}</RowLabel>
            </RowText>
            <ToggleWrap aria-label={t('settings.internationalSwaps')}>
              <ToggleInput
                type="checkbox"
                checked={intlSwaps}
                onChange={e => handleIntlToggle(e.target.checked)}
              />
              <ToggleSlider $on={intlSwaps} />
            </ToggleWrap>
          </Row>
        </Card>

        {intlSwaps && (
          <InfoHint role="note">
            <InfoIcon aria-hidden="true">⚠️</InfoIcon>
            <InfoText>{t('settings.internationalHint')}</InfoText>
          </InfoHint>
        )}

        {/* ── Benachrichtigungen ── */}
        <SectionLabel>{t('settings.notifications')}</SectionLabel>
        <Card>
          <Row>
            <RowIcon aria-hidden="true">📧</RowIcon>
            <RowText>
              <RowLabel>{t('settings.notifications')}</RowLabel>
              <RowSub>Swap-Updates & Nachrichten per E-Mail</RowSub>
            </RowText>
            <ToggleWrap aria-label={t('settings.notifications')}>
              <ToggleInput
                type="checkbox"
                checked={emailNotif}
                onChange={e => handleEmailToggle(e.target.checked)}
              />
              <ToggleSlider $on={emailNotif} />
            </ToggleWrap>
          </Row>
        </Card>

        {/* ── Save Feedback ── */}
        {(saving || saved) && (
          <div style={{ textAlign: 'center' }}>
            {saving && <span style={{ fontSize: 12, color: 'var(--color-text-mute)' }}>Speichert…</span>}
            {saved  && <SavedBadge role="status">{t('settings.saved')}</SavedBadge>}
          </div>
        )}

        {/* ── Account ── */}
        <SectionLabel>{t('settings.account')}</SectionLabel>
        <Card>
          <Row>
            <RowIcon aria-hidden="true">👤</RowIcon>
            <RowText>
              <RowLabel>{profile?.display_name ?? 'Mein Account'}</RowLabel>
              <RowSub>{user?.email}</RowSub>
            </RowText>
          </Row>
        </Card>

        {/* ── Sign Out ── */}
        {!showSignOut ? (
          <SignOutBtn onClick={() => setShowSignOut(true)}>
            {t('settings.signOut')}
          </SignOutBtn>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <SignOutBtn
              style={{ flex: 1 }}
              onClick={onSignOut}
            >
              {t('settings.signOutConfirm')} →
            </SignOutBtn>
            <button
              onClick={() => setShowSignOut(false)}
              style={{ flex: 1, padding: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', borderRadius: 14, color: 'var(--color-text-dim)', fontWeight: 700, cursor: 'pointer', minHeight: 52 }}
            >
              {t('common.cancel')}
            </button>
          </div>
        )}
      </Content>
    </Page>
  );
};

export default SettingsPage;
