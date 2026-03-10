import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useRegion } from '../hooks/useRegion'
import { useAuth } from '../context/AuthContext'
import { Icon, IconBtn, FlagIcon, StatusDot } from '../components/icons/Icons'
import Card from '../components/Card'
import Button from '../components/Button'
import Tag from '../components/Tag'
import RegionSwitcher from '../components/RegionSwitcher'
import BottomSheet from '../components/BottomSheet'
import { useBottomSheet } from '../hooks/useBottomSheet'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import { supabase } from '../lib/supabase'
import { paddingStart, marginStart } from '../theme/rtl'

// ============================================================
// MatchPage — Kapitel 2: Regional-Matching + Icon-First UI
//
// Regions-Filter liegt vollständig im SQL (get_regional_matches RPC).
// Das Frontend übergibt nur album_id — keine country_code im Request.
// ============================================================

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  overflow-x: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: 8px;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;
  letter-spacing: 0.04em;
`

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const MatchCard = styled(Card)`
  margin-bottom: 10px;
  padding: 14px;
`

const MatchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accent2}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.bg};
  flex-shrink: 0;
`

const MatchMeta = styled.div`
  flex: 1;
  min-width: 0;
`

const Username = styled.div`
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
  flex-wrap: wrap;
`

// Icon-First Sticker-Richtungs-Anzeige
const ExchangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 10px;
  flex-wrap: wrap;
`

const ExchangeSide = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  flex: 1;
`

const StickerPill = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${({ $type, theme }) =>
    $type === 'give' ? 'rgba(74,222,174,0.12)' : 'rgba(245,200,66,0.12)'};
  color: ${({ $type, theme }) =>
    $type === 'give' ? theme.colors.accent3 : theme.colors.accent};
`

const LocalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(74,222,174,0.1);
  color: ${({ theme }) => theme.colors.accent3};
`

const ScoreBadge = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
`

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 16px;
  color: ${({ theme }) => theme.colors.muted};
`

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`

// ── Demo Data (wird später durch echte API ersetzt) ───────────
const DEMO_MATCHES = [
  {
    match_user_id:      '1',
    match_username:     'fußball_kroos',
    match_display_name: 'Thomas K.',
    match_country_code: 'DE',
    match_reputation:   4.9,
    match_swap_count:   47,
    match_is_verified:  true,
    match_plan:         'pro',
    i_need_they_have:   3,
    i_have_they_need:   2,
    match_score:        5,
    is_local:           true,
  },
  {
    match_user_id:      '2',
    match_username:     'panini_master_es',
    match_display_name: 'Carlos M.',
    match_country_code: 'ES',
    match_reputation:   4.7,
    match_swap_count:   132,
    match_is_verified:  true,
    match_plan:         'pro',
    i_need_they_have:   4,
    i_have_they_need:   3,
    match_score:        7,
    is_local:           false,
  },
  {
    match_user_id:      '3',
    match_username:     'sticker_petra',
    match_display_name: 'Petra B.',
    match_country_code: 'DE',
    match_reputation:   4.8,
    match_swap_count:   23,
    match_is_verified:  false,
    match_plan:         'free',
    i_need_they_have:   2,
    i_have_they_need:   1,
    match_score:        3,
    is_local:           true,
  },
]

// ── Component ─────────────────────────────────────────────────

const MatchPage = () => {
  const { t }                    = useTranslation()
  const { searchInternational }  = useRegion()
  const { toast, show: showToast } = useToast()
  const matchSheet                = useBottomSheet()
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleMatchTap = (match) => {
    setSelectedMatch(match)
    matchSheet.open()
  }

  const handleRequestSwap = async () => {
    showToast('✓ Tausch-Anfrage gesendet!', 'success')
    matchSheet.close()
  }

  const matchCount = DEMO_MATCHES.length
  const localCount = DEMO_MATCHES.filter(m => m.is_local).length

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <Page>
        {/* Header */}
        <Header>
          <div>
            <Title>🎯 Matches</Title>
            <div style={{ fontSize: 12, color: '#6b6b8a', marginTop: 2 }}>
              {localCount} lokal · {matchCount - localCount} international
            </div>
          </div>
          <RegionSwitcher />
        </Header>

        {/* Filter Row — Icon-First */}
        <FilterRow>
          <Tag $color={!searchInternational ? 'green' : undefined}>
            📍 {t('region.localOnly')}
          </Tag>
          {searchInternational && (
            <Tag $color="green">
              🌍 {t('region.worldwide')}
            </Tag>
          )}
          <Tag>
            🎯 {matchCount} {matchCount === 1 ? 'Match' : 'Matches'}
          </Tag>
        </FilterRow>

        {/* Security Notice — Icon-First */}
        <Card style={{ marginBottom: 12, padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b6b8a' }}>
            <span style={{ fontSize: 16 }}>🔐</span>
            <span>
              {searchInternational
                ? 'Globaler Modus — Matches weltweit'
                : 'Lokaler Modus — nur ' + (DEMO_MATCHES[0]?.match_country_code || 'DE')}
            </span>
          </div>
        </Card>

        {/* Match Cards */}
        {DEMO_MATCHES.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🔍</EmptyIcon>
            <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24, letterSpacing: '0.04em' }}>
              Keine Matches
            </div>
            <div style={{ fontSize: 13, marginTop: 8 }}>
              {searchInternational
                ? 'Weltweit keine Matches — lade mehr Sticker hoch'
                : 'Aktiviere "Weltweit" für mehr Ergebnisse'}
            </div>
          </EmptyState>
        ) : (
          DEMO_MATCHES.map((match) => (
            <MatchCard
              key={match.match_user_id}
              $borderColor={match.is_local ? 'rgba(74,222,174,0.2)' : undefined}
            >
              <MatchHeader>
                <Avatar>
                  {match.match_username[0].toUpperCase()}
                </Avatar>

                <MatchMeta>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Username>{match.match_username}</Username>
                    {match.match_is_verified && (
                      <span title="Verifiziert" style={{ fontSize: 14 }}>✅</span>
                    )}
                    {match.match_plan === 'pro' && (
                      <span title="Pro" style={{ fontSize: 14 }}>⭐</span>
                    )}
                  </div>
                  <MetaRow>
                    <FlagIcon code={match.match_country_code} size={14} />
                    <span>{match.match_country_code}</span>
                    <span>·</span>
                    <span>⭐ {match.match_reputation}</span>
                    <span>·</span>
                    <span>🔄 {match.match_swap_count}</span>
                  </MetaRow>
                </MatchMeta>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <ScoreBadge>{match.match_score} pts</ScoreBadge>
                  {match.is_local
                    ? <LocalBadge>📍 lokal</LocalBadge>
                    : <span style={{ fontSize: 10, color: '#6b6b8a' }}>🌍 intl.</span>
                  }
                </div>
              </MatchHeader>

              {/* Exchange — Icon-First Anzeige */}
              <ExchangeRow>
                <ExchangeSide>
                  {/* Was ich gebe */}
                  <span style={{ fontSize: 16 }}>↑</span>
                  <StatusDot status="double" />
                  <span style={{ fontSize: 12, color: '#6b6b8a', marginInlineEnd: 2 }}>gebe:</span>
                  {Array.from({ length: match.i_have_they_need }, (_, i) => (
                    <StickerPill key={i} $type="give">#{10 + i}</StickerPill>
                  ))}
                </ExchangeSide>
                <span style={{ color: '#2a2a3a', fontSize: 18 }}>⇄</span>
                <ExchangeSide>
                  {/* Was ich bekomme */}
                  <span style={{ fontSize: 16 }}>↓</span>
                  <StatusDot status="need" />
                  <span style={{ fontSize: 12, color: '#6b6b8a', marginInlineEnd: 2 }}>bekomme:</span>
                  {Array.from({ length: match.i_need_they_have }, (_, i) => (
                    <StickerPill key={i} $type="get">#{50 + i}</StickerPill>
                  ))}
                </ExchangeSide>
              </ExchangeRow>

              <Button
                $variant="success"
                $full
                $size="sm"
                onClick={() => handleMatchTap(match)}
              >
                🤝 {t('swap.requestSwap')}
              </Button>
            </MatchCard>
          ))
        )}
      </Page>

      {/* Match Detail Sheet */}
      <BottomSheet
        isOpen={matchSheet.isOpen}
        onClose={matchSheet.close}
        title={selectedMatch ? `🤝 Tausch mit @${selectedMatch.match_username}` : ''}
        snap="half"
      >
        {selectedMatch && (
          <>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: '#6b6b8a' }}>Match-Score</span>
                <span style={{ color: '#f5c842', fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>
                  {selectedMatch.match_score} Punkte
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: '#6b6b8a' }}>🎁 Ich gebe</span>
                <span style={{ color: '#4adeae' }}>{selectedMatch.i_have_they_need} Sticker</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: '#6b6b8a' }}>📦 Ich bekomme</span>
                <span style={{ color: '#f5c842' }}>{selectedMatch.i_need_they_have} Sticker</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b6b8a' }}>📍 Standort</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FlagIcon code={selectedMatch.match_country_code} size={14} />
                  <span>{selectedMatch.is_local ? 'Lokal 🚀' : 'International ✈️'}</span>
                </div>
              </div>
            </Card>

            <Button $variant="success" $full onClick={handleRequestSwap}>
              ✓ Tausch-Anfrage senden
            </Button>
          </>
        )}
      </BottomSheet>
    </>
  )
}

export default MatchPage
