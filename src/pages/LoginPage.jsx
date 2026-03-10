// src/pages/LoginPage.jsx
// Kapitel 8 — Login via Magic Link (primär) + Password (sekundär)

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';

const fadeIn = keyframes`from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}`;
const spin   = keyframes`to{transform:rotate(360deg);}`;

const Page = styled.main`
  height: 100dvh;
  background: var(--color-bg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px;
  animation: ${fadeIn} 300ms ease;
`;

const Logo = styled.div`
  font-size: 48px; margin-bottom: 8px; text-align: center;
`;

const AppName = styled.h1`
  font-size: 28px; font-weight: 800; color: #fff;
  text-align: center; margin: 0 0 4px;
`;

const Tagline = styled.p`
  font-size: 14px; color: var(--color-text-dim);
  text-align: center; margin: 0 0 36px;
`;

const Form = styled.div`
  width: 100%; max-width: 360px;
  display: flex; flex-direction: column; gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: #fff; font-size: 15px;
  &::placeholder { color: var(--color-text-mute); }
  &:focus { outline: 2px solid var(--color-accent); outline-offset: -1px; border-color: transparent; }
`;

const PrimaryBtn = styled.button`
  width: 100%; padding: 15px;
  background: var(--color-accent);
  color: #fff; border: none; border-radius: 12px;
  font-size: 15px; font-weight: 800;
  cursor: pointer; touch-action: manipulation;
  min-height: 52px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  &:disabled { opacity: 0.5; pointer-events: none; }
`;

const Divider = styled.div`
  display: flex; align-items: center; gap: 10px; margin: 4px 0;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
  span { font-size: 11px; color: var(--color-text-mute); }
`;

const SecondaryBtn = styled.button`
  width: 100%; padding: 13px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-text-dim); font-size: 14px; font-weight: 600;
  cursor: pointer; touch-action: manipulation; min-height: 44px;
`;

const MsgBox = styled.div`
  padding: 12px 14px;
  background: ${({ $type }) => $type === 'success' ? 'rgba(50,180,100,0.1)' : 'rgba(255,80,80,0.1)'};
  border: 1px solid ${({ $type }) => $type === 'success' ? 'rgba(50,180,100,0.3)' : 'rgba(255,80,80,0.3)'};
  border-radius: 10px;
  font-size: 13px;
  color: ${({ $type }) => $type === 'success' ? '#5de8a0' : '#ff9090'};
  text-align: center;
`;

const Spinner = styled.span`
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 600ms linear infinite;
  display: inline-block;
`;

const LoginPage = () => {
  const { t } = useTranslation();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [mode,     setMode]     = useState('magic'); // 'magic' | 'password' | 'signup'
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState(null);    // { text, type }

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    setMessage(error
      ? { text: error.message, type: 'error' }
      : { text: t('auth.magicLinkSent'), type: 'success' }
    );
  };

  const handlePassword = async () => {
    if (!email || !password) return;
    setLoading(true); setMessage(null);
    const fn = mode === 'signup'
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) setMessage({ text: error.message, type: 'error' });
    else if (mode === 'signup') setMessage({ text: 'Willkommen! Check deine E-Mails.', type: 'success' });
  };

  return (
    <Page>
      <Logo aria-hidden="true">🔄</Logo>
      <AppName>StickerSwap</AppName>
      <Tagline>Panini-Sticker tauschen — WM 2026 🏆</Tagline>

      <Form>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          aria-label={t('auth.email')}
          inputMode="email"
          autoComplete="email"
          onKeyDown={e => e.key === 'Enter' && mode === 'magic' && handleMagicLink()}
        />

        {mode !== 'magic' && (
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('auth.password')}
            aria-label={t('auth.password')}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            onKeyDown={e => e.key === 'Enter' && handlePassword()}
          />
        )}

        {message && <MsgBox $type={message.type}>{message.text}</MsgBox>}

        {mode === 'magic' ? (
          <>
            <PrimaryBtn onClick={handleMagicLink} disabled={loading || !email}>
              {loading ? <Spinner /> : null}
              {t('auth.magicLink')} ✉️
            </PrimaryBtn>
            <Divider><span>oder</span></Divider>
            <SecondaryBtn onClick={() => setMode('password')}>
              {t('auth.login')} mit Passwort
            </SecondaryBtn>
            <SecondaryBtn onClick={() => setMode('signup')}>
              {t('auth.noAccount')} {t('auth.signup')}
            </SecondaryBtn>
          </>
        ) : (
          <>
            <PrimaryBtn onClick={handlePassword} disabled={loading || !email || !password}>
              {loading ? <Spinner /> : null}
              {mode === 'signup' ? t('auth.signup') : t('auth.login')}
            </PrimaryBtn>
            <SecondaryBtn onClick={() => setMode('magic')}>
              ← {t('auth.magicLink')} nutzen
            </SecondaryBtn>
          </>
        )}
      </Form>
    </Page>
  );
};

export default LoginPage;
