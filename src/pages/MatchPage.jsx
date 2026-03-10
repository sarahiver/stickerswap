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

// ============================================================
// MatchPage — Semantik-Refactor Kapitel 3
//
// Page:        <section> (innerhalb von <main> in App.js)
// Header:      <header> (innerhalb der section)
// Title:       <h2>     ✓ war schon h2
// FilterRow:   <div>    (Werkzeug-Leiste, kein Landmark-Wert)
//              + role="toolbar" aria-label="Filter"
// MatchCard:   <article> (eigenständiger Tausch-Partner-Block)
// MatchHeader: <header>  (innerhalb des article)
// Avatar:      <figure>  (visuelle User-Repräsentation)
// Username:    <h3>      (Überschrift des article)
// MetaRow:     <p>       (Metadaten-Absatz)
// ExchangeRow: <section> aria-label="Tausch-Details"
// EmptyState:  <p>       (einfache Nachricht)
// MatchList:   <ul>      (Liste der Match-Artikel)
// MatchItem:   <li>      (Listenelement)
// ============================================================

// <section> für die gesamte Seite (innerhalb <main>)
const PageSection = styled.section`
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  overflow-x: hidden;
`

// <header> innerhalb der <section> — nicht der globale <header>
const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  gap: 8px;
`

// H2 war schon korrekt — nur Margin reset
const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 28px;
  letter-spacing: 0.04em;
  margin: 0;
`

// role="toolbar": Gruppe von Steuerelementen (Filter-Tags)
const FilterToolbar = styled.div.attrs({
  role: 'toolbar',
  'aria-label': 'Filter',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

// <ul> für Match-Liste
const MatchList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`
const MatchItem = styled.li`
  margin-bottom: 10px;
`

// <article> für jeden Match (eigenständiger Inhaltsblock)
const MatchArticle = styled(Card).attrs({ as: 'article' })`
  padding: 14px;
`

// <header> des article
const MatchArticleHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

// <figure> für User-Avatar
const AvatarFigure = styled.figure`
  margin: 0;
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
  aria-hidden: true;
`

// Wrapper für User-Info neben Avatar
const MatchUserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

// <h3>: Artikel-Überschrift (Benutzername des Match-Partners)
const MatchUsername = styled.h3`
  font-weight: 600;
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 6px;
`

// <p> für Metadaten-Zeile
const MatchMetaP = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 2px 0 0;
  flex-wrap: wrap;
`

// <section> für Tausch-Details (Icon-First Anzeige)
const ExchangeSection = styled.section`
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
  background: ${({ $type }) =>
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

const ScoreBadge = styled.output`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent};
`

// <p> für Empty-State — kein extra div
const EmptyStateP = styled.p`
  text-align: center;
  padding: 48px 16px;
  color: ${({ theme }) => theme.colors.muted};
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

      {/* <section> statt <div>: Eigenständiger Seitenbereich */}
      <PageSection aria-labelledby="matches-heading">

        {/* <header> innerhalb der section */}
        <SectionHeader>
          <div>
            <Title id="matches-heading">🎯 Matches</Title>
            {/* <p> statt div für kurze Beschreibung */}
            <p style={{ fontSize: 12, color: '#6b6b8a', margin: '2px 0 0' }}>
              {localCount} lokal · {matchCount - localCount} international
            </p>
          </div>
          <RegionSwitcher />
        </SectionHeader>

        {/* role="toolbar" — Filter-Steuerelemente */}
        <FilterToolbar>
          <Tag $color={!searchInternational ? 'green' : undefined}>
            📍 {t('region.localOnly')}
          </Tag>
          {searchInternational && (
            <Tag $color="green">🌍 {t('region.worldwide')}</Tag>
          )}
          <Tag>🎯 {matchCount} {matchCount === 1 ? 'Match' : 'Matches'}</Tag>
        </FilterToolbar>

        {/* <aside>: ergänzende Info (Security-Hinweis) */}
        <Card as="aside" style={{ marginBottom: 12, padding: '10px 12px' }}
              aria-label="Suchmodus-Hinweis">
          <p style={{ display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: 12, color: '#6b6b8a', margin: 0 }}>
            <span aria-hidden="true" style={{ fontSize: 16 }}>🔐</span>
            {searchInternational
              ? 'Globaler Modus — Matches weltweit'
              : 'Lokaler Modus — nur ' + (DEMO_MATCHES[0]?.match_country_code || 'DE')}
          </p>
        </Card>

        {/* Match-Karten: <ul> mit <li><article> */}
        {DEMO_MATCHES.length === 0 ? (
          // <p> für leere Liste — kein extra div
          <EmptyStateP role="status" aria-live="polite">
            <span aria-hidden="true" style={{ display: 'block', fontSize: 48, marginBottom: 12 }}>🔍</span>
            <strong style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 24,
                             letterSpacing: '0.04em', display: 'block' }}>
              Keine Matches
            </strong>
            <span style={{ fontSize: 13, marginTop: 8, display: 'block' }}>
              {searchInternational
                ? 'Weltweit keine Matches — lade mehr Sticker hoch'
                : 'Aktiviere "Weltweit" für mehr Ergebnisse'}
            </span>
          </EmptyStateP>
        ) : (
          <MatchList aria-label="Tausch-Partner">
            {DEMO_MATCHES.map((match) => (
              <MatchItem key={match.match_user_id}>
                {/* <article>: eigenständiger Match-Block */}
                <MatchArticle
                  $borderColor={match.is_local ? 'rgba(74,222,174,0.2)' : undefined}
                  aria-label={`Match mit ${match.match_username}`}
                >
                  {/* <header> des article */}
                  <MatchArticleHeader>
                    {/* <figure> für Avatar — aria-hidden weil Username vorhanden */}
                    <AvatarFigure aria-hidden="true">
                      {match.match_username[0].toUpperCase()}
                    </AvatarFigure>

                    <MatchUserInfo>
                      {/* <h3>: Artikel-Überschrift */}
                      <MatchUsername>
                        {match.match_username}
                        {match.match_is_verified && (
                          <span title="Verifiziert" aria-label="verifiziert" style={{ fontSize: 14 }}>✅</span>
                        )}
                        {match.match_plan === 'pro' && (
                          <span title="Pro-Mitglied" aria-label="Pro" style={{ fontSize: 14 }}>⭐</span>
                        )}
                      </MatchUsername>
                      {/* <p> für Metadaten */}
                      <MatchMetaP>
                        <FlagIcon code={match.match_country_code} size={14} />
                        <span>{match.match_country_code}</span>
                        <span aria-hidden="true">·</span>
                        <span>⭐ {match.match_reputation}</span>
                        <span aria-hidden="true">·</span>
                        <span>🔄 {match.match_swap_count}</span>
                      </MatchMetaP>
                    </MatchUserInfo>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      {/* <output>: berechneter Score-Wert */}
                      <ScoreBadge aria-label={`${match.match_score} Punkte Match-Score`}>
                        {match.match_score} pts
                      </ScoreBadge>
                      {match.is_local
                        ? <LocalBadge aria-label="Lokaler Match">📍 lokal</LocalBadge>
                        : <span style={{ fontSize: 10, color: '#6b6b8a' }} aria-label="Internationaler Match">🌍 intl.</span>
                      }
                    </div>
                  </MatchArticleHeader>

                  {/* <section> für Tausch-Details */}
                  <ExchangeSection aria-label="Sticker-Tausch-Details">
                    <ExchangeSide>
                      <span aria-hidden="true" style={{ fontSize: 16 }}>↑</span>
                      <StatusDot status="double" />
                      <span style={{ fontSize: 12, color: '#6b6b8a', marginInlineEnd: 2 }}>
                        <span className="sr-only">Ich gebe: </span>
                      </span>
                      {Array.from({ length: match.i_have_they_need }, (_, i) => (
                        <StickerPill key={i} $type="give">#{10 + i}</StickerPill>
                      ))}
                    </ExchangeSide>
                    <span aria-hidden="true" style={{ color: '#2a2a3a', fontSize: 18 }}>⇄</span>
                    <ExchangeSide>
                      <span aria-hidden="true" style={{ fontSize: 16 }}>↓</span>
                      <StatusDot status="need" />
                      <span style={{ fontSize: 12, color: '#6b6b8a', marginInlineEnd: 2 }}>
                        <span className="sr-only">Ich bekomme: </span>
                      </span>
                      {Array.from({ length: match.i_need_they_have }, (_, i) => (
                        <StickerPill key={i} $type="get">#{50 + i}</StickerPill>
                      ))}
                    </ExchangeSide>
                  </ExchangeSection>

                  <Button $variant="success" $full $size="sm"
                    onClick={() => handleMatchTap(match)}>
                    🤝 {t('swap.requestSwap')}
                  </Button>
                </MatchArticle>
              </MatchItem>
            ))}
          </MatchList>
        )}
      </PageSection>

      {/* Match Detail Sheet */}
      <BottomSheet
        isOpen={matchSheet.isOpen}
        onClose={matchSheet.close}
        title={selectedMatch ? `🤝 Tausch mit @${selectedMatch.match_username}` : ''}
        snap="half"
      >
        {selectedMatch && (
          <>
            {/* <dl>: Label-Wert-Paare für Match-Details */}
            <Card as="div" style={{ marginBottom: 12 }}>
              <dl style={{ margin: 0 }}>
                {[
                  ['Match-Score', `${selectedMatch.match_score} Punkte`, '#f5c842'],
                  ['🎁 Ich gebe', `${selectedMatch.i_have_they_need} Sticker`, '#4adeae'],
                  ['📦 Ich bekomme', `${selectedMatch.i_need_they_have} Sticker`, '#f5c842'],
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between',
                                            fontSize: 13, marginBottom: 8 }}>
                    <dt style={{ color: '#6b6b8a' }}>{label}</dt>
                    <dd style={{ margin: 0, color, fontWeight: 700,
                                 fontFamily: "'Space Mono',monospace" }}>{value}</dd>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <dt style={{ color: '#6b6b8a' }}>📍 Standort</dt>
                  <dd style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FlagIcon code={selectedMatch.match_country_code} size={14} />
                    <span>{selectedMatch.is_local ? 'Lokal 🚀' : 'International ✈️'}</span>
                  </dd>
                </div>
              </dl>
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
