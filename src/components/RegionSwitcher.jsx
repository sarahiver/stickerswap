import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useRegion } from '../hooks/useRegion'
import BottomSheet from './BottomSheet'
import Button from './Button'
import { useBottomSheet } from '../hooks/useBottomSheet'
import { FlagIcon, Icon } from './icons/Icons'
import { paddingStart } from '../theme/rtl'

// ============================================================
// RegionSwitcher — Kapitel 2
// Zeigt Country-Filter + International-Toggle
// SICHERHEIT: Änderungen gehen via update_region_settings() RPC
// Regions-Filter in SQL — nicht im Frontend
// ============================================================

// Länder-Liste: nach Region gruppiert
const COUNTRIES = {
  '🌍 Europa': [
    { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
    { code: 'AT', name: 'Österreich', flag: '🇦🇹' },
    { code: 'CH', name: 'Schweiz', flag: '🇨🇭' },
    { code: 'ES', name: 'España', flag: '🇪🇸' },
    { code: 'IT', name: 'Italia', flag: '🇮🇹' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'NL', name: 'Nederland', flag: '🇳🇱' },
    { code: 'BE', name: 'België', flag: '🇧🇪' },
    { code: 'PL', name: 'Polska', flag: '🇵🇱' },
    { code: 'SE', name: 'Sverige', flag: '🇸🇪' },
    { code: 'NO', name: 'Norge', flag: '🇳🇴' },
    { code: 'DK', name: 'Danmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Suomi', flag: '🇫🇮' },
    { code: 'TR', name: 'Türkiye', flag: '🇹🇷' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  ],
  '🌎 Amerika': [
    { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'US', name: 'USA', flag: '🇺🇸' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  ],
  '🌏 Naher Osten': [
    { code: 'SA', name: 'السعودية', flag: '🇸🇦' },
    { code: 'AE', name: 'الإمارات', flag: '🇦🇪' },
    { code: 'EG', name: 'مصر', flag: '🇪🇬' },
    { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  ],
}

// ── Styles ────────────────────────────────────────────────────

const TriggerRow = styled.button`
  min-height: ${({ theme }) => theme.touch.min};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s;
  &:active { border-color: ${({ theme }) => theme.colors.accent}; }
`

const IntlBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ $active, theme }) =>
    $active ? 'rgba(74,222,174,0.15)' : 'rgba(107,107,138,0.15)'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent3 : theme.colors.muted};
`

const SectionHead = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 16px 0 8px;
  ${paddingStart('2px')}
`

const Toggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background 0.15s;
  &:active { background: ${({ theme }) => theme.colors.border}; }
`

const ToggleSwitch = styled.div`
  width: 44px;
  height: 26px;
  border-radius: 13px;
  background: ${({ $on, theme }) => $on ? theme.colors.accent3 : theme.colors.border};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    inset-inline-start: ${({ $on }) => $on ? '21px' : '3px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: inset-inline-start 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  }
`

const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`

const CountryOption = styled.button`
  min-height: ${({ theme }) => theme.touch.min};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) =>
    $active ? 'rgba(245,200,66,0.1)' : theme.colors.surface2};
  border: 1.5px solid ${({ $active, theme }) =>
    $active ? theme.colors.accent : 'transparent'};
  text-align: start;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.text};
  transition: all 0.15s;
  &:active { border-color: ${({ theme }) => theme.colors.accent}; }
`

const ToggleInfo = styled.div`
  flex: 1;
`
const ToggleTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
`
const ToggleSub = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
`

// ── Component ─────────────────────────────────────────────────

const RegionSwitcher = () => {
  const { t } = useTranslation()
  const sheet = useBottomSheet()
  const { countryCode, searchInternational, updateRegionSettings, loading } = useRegion()

  const [pendingCountry, setPendingCountry] = useState(countryCode)
  const [pendingIntl,    setPendingIntl]    = useState(searchInternational)

  const currentCountry = Object.values(COUNTRIES).flat().find(c => c.code === countryCode)

  const handleOpen = () => {
    setPendingCountry(countryCode)
    setPendingIntl(searchInternational)
    sheet.open()
  }

  const handleSave = async () => {
    await updateRegionSettings({
      countryCode: pendingCountry,
      searchInternational: pendingIntl,
    })
    sheet.close()
  }

  return (
    <>
      <TriggerRow onClick={handleOpen} aria-label="Region settings">
        <span style={{ fontSize: 20 }}>{currentCountry?.flag || '🌐'}</span>
        <span style={{ fontWeight: 600 }}>{currentCountry?.code || countryCode}</span>
        <IntlBadge $active={searchInternational}>
          {searchInternational ? '🌍 GLOBAL' : '📍 LOKAL'}
        </IntlBadge>
      </TriggerRow>

      <BottomSheet
        isOpen={sheet.isOpen}
        onClose={sheet.close}
        title="📍 Region & Matching"
        snap="full"
      >
        {/* International Toggle */}
        <Toggle onClick={() => setPendingIntl(v => !v)}>
          <span style={{ fontSize: 24, marginInlineEnd: 12 }}>
            {pendingIntl ? '🌍' : '📍'}
          </span>
          <ToggleInfo>
            <ToggleTitle>
              {pendingIntl ? t('region.worldwide') : t('region.localOnly')}
            </ToggleTitle>
            <ToggleSub>
              {pendingIntl
                ? 'Matches weltweit suchen — mehr Ergebnisse'
                : 'Nur in deinem Land suchen — schnellerer Versand'}
            </ToggleSub>
          </ToggleInfo>
          <ToggleSwitch $on={pendingIntl} aria-hidden="true" />
        </Toggle>

        {/* Länder-Auswahl */}
        {Object.entries(COUNTRIES).map(([region, countries]) => (
          <div key={region}>
            <SectionHead>{region}</SectionHead>
            <CountryGrid>
              {countries.map(({ code, name, flag }) => (
                <CountryOption
                  key={code}
                  $active={pendingCountry === code}
                  onClick={() => setPendingCountry(code)}
                  aria-label={name}
                >
                  <span style={{ fontSize: 22 }}>{flag}</span>
                  <span style={{ lineHeight: 1.3 }}>{name}</span>
                  {pendingCountry === code && (
                    <span style={{ marginInlineStart: 'auto', color: '#f5c842' }}>✓</span>
                  )}
                </CountryOption>
              ))}
            </CountryGrid>
          </div>
        ))}

        <div style={{ height: 16 }} />
        <Button
          $variant="primary"
          $full
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('common.save')}
        </Button>
      </BottomSheet>
    </>
  )
}

export default RegionSwitcher
