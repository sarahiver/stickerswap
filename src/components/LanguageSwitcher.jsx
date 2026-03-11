import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { LANGUAGES, setLanguage } from '../locales/i18n';

const fadeDown = keyframes`from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}`;

const Wrap = styled.div`position: relative;`;

const Trigger = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-sm); font-size: 13px;
  color: var(--text2); transition: all 0.15s;
  white-space: nowrap;
  &:hover { border-color: var(--accent3); color: var(--text); }
`;

const Arrow = styled.span`
  font-size: 10px; color: var(--muted);
  transition: transform 0.2s;
  transform: ${p => p.$open ? 'rotate(180deg)' : 'rotate(0)'};
`;

const Dropdown = styled.div`
  position: absolute; top: calc(100% + 6px); right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 200;
  overflow: hidden;
  animation: ${fadeDown} 0.18s ease;
  width: 190px;
  max-height: 420px;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`;

const LangItem = styled.button`
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 14px;
  font-size: 13px; text-align: left;
  transition: background 0.12s;
  color: ${p => p.$active ? 'var(--accent)' : 'var(--text2)'};
  background: ${p => p.$active ? 'rgba(245,200,66,0.07)' : 'transparent'};
  border-bottom: 1px solid ${p => p.$last ? 'transparent' : 'rgba(42,42,58,0.5)'};
  font-weight: ${p => p.$active ? 600 : 400};
  &:hover { background: var(--surface2); color: var(--text); }
`;

const Flag = styled.span`font-size: 16px; flex-shrink: 0;`;

const CheckMark = styled.span`
  margin-left: auto; color: var(--accent); font-size: 12px;
`;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === i18n.language)
    || LANGUAGES.find(l => l.code === 'en');

  // Außen-Klick schließt Dropdown
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (code) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <Wrap ref={ref}>
      <Trigger onClick={() => setOpen(o => !o)}>
        <Flag>{current.flag}</Flag>
        {current.code.toUpperCase()}
        <Arrow $open={open}>▾</Arrow>
      </Trigger>

      {open && (
        <Dropdown>
          {LANGUAGES.map((l, i) => (
            <LangItem
              key={l.code}
              $active={l.code === i18n.language}
              $last={i === LANGUAGES.length - 1}
              onClick={() => select(l.code)}
            >
              <Flag>{l.flag}</Flag>
              {l.label}
              {l.code === i18n.language && <CheckMark>✓</CheckMark>}
            </LangItem>
          ))}
        </Dropdown>
      )}
    </Wrap>
  );
}
