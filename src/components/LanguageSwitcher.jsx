import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, changeLanguage } from '../i18n/i18n'
import BottomSheet from './BottomSheet'
import { useBottomSheet } from '../hooks/useBottomSheet'
import { paddingStart, marginStart } from '../theme/rtl'

// ============================================================
// LanguageSwitcher — Kapitel 2
// Icon-First: Flaggen statt Text-Labels
// Tier-Gruppierung sichtbar
// RTL-kompatibel via Logical Properties
// ============================================================

const TriggerBtn = styled.button`
  min-height: ${({ theme }) => theme.touch.min};
  min-width:  ${({ theme }) => theme.touch.min};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s;
  &:active { border-color: ${({ theme }) => theme.colors.accent}; }
`

const TierLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  ${paddingStart('4px')}
  margin-block: 12px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 4px;
`

const LangGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`

const LangOption = styled.button`
  min-height: ${({ theme }) => theme.touch.min};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) =>
    $active ? 'rgba(245,200,66,0.1)' : theme.colors.surface2};
  border: 1.5px solid ${({ $active, theme }) =>
    $active ? theme.colors.accent : 'transparent'};
  transition: all 0.15s;
  text-align: start;    /* RTL-kompatibel */
  &:active { border-color: ${({ theme }) => theme.colors.accent}; }
`

const LangInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
`

const LangName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? theme.colors.accent : theme.colors.text};
  line-height: 1.3;
`

const LangNative = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.2;
`

const CheckMark = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.accent};
  ${marginStart('auto')}
`

const TIER_LABELS = { 1: 'Tier 1 — Vollständig', 2: 'Tier 2 — Übersetzt', 3: 'Tier 3 — Beta' }
const TIERS = [1, 2, 3]

const LanguageSwitcher = ({ onLanguageChange }) => {
  const { i18n } = useTranslation()
  const sheet = useBottomSheet()
  const currentLang = i18n.language?.split('-')[0] || 'en'
  const currentMeta = LANGUAGES[currentLang] || LANGUAGES.en

  const handleSelect = async (langCode) => {
    await changeLanguage(langCode)
    if (onLanguageChange) onLanguageChange(langCode)
    sheet.close()
  }

  const langsByTier = TIERS.map(tier =>
    Object.entries(LANGUAGES).filter(([, meta]) => meta.tier === tier)
  )

  return (
    <>
      <TriggerBtn onClick={sheet.open} aria-label="Change language">
        <span style={{ fontSize: 20 }}>{currentMeta.flag}</span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{currentMeta.nativeName}</span>
      </TriggerBtn>

      <BottomSheet isOpen={sheet.isOpen} onClose={sheet.close} title="🌐 Sprache / Language" snap="full">
        {langsByTier.map((langs, idx) => (
          <div key={idx}>
            <TierLabel>{TIER_LABELS[idx + 1]}</TierLabel>
            <LangGrid>
              {langs.map(([code, meta]) => (
                <LangOption
                  key={code}
                  $active={code === currentLang}
                  onClick={() => handleSelect(code)}
                  aria-label={`${meta.name} — ${meta.nativeName}`}
                >
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{meta.flag}</span>
                  <LangInfo>
                    <LangName $active={code === currentLang}>{meta.nativeName}</LangName>
                    <LangNative>{meta.name}</LangNative>
                  </LangInfo>
                  {code === currentLang && <CheckMark>✓</CheckMark>}
                </LangOption>
              ))}
            </LangGrid>
          </div>
        ))}
      </BottomSheet>
    </>
  )
}

export default LanguageSwitcher
