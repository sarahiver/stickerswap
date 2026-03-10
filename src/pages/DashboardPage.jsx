import { useState } from 'react';
import styled from 'styled-components';

import BottomSheet   from '../components/BottomSheet';
import Button        from '../components/Button';
import Card          from '../components/Card';
import Tag           from '../components/Tag';
import ProgressBar   from '../components/ProgressBar';
import StickerCell, { StickerGrid } from '../components/StickerCell';
import Toast         from '../components/Toast';

import { useToast }       from '../hooks/useToast';
import { useBottomSheet } from '../hooks/useBottomSheet';

// ============================================================
// DashboardPage — Semantik-Refactor Kapitel 3
//
// Semantische Struktur:
//   <main> (in App.js)
//     <section aria-label="Übersicht"> → KPIs
//     <section aria-label="Album-Fortschritt"> → Progress
//     <section aria-label="Matches"> → Match-Alert
//     <section aria-labelledby="group-a-heading"> → Sticker-Grid
//       <h2 id="group-a-heading">Gruppe A
//       <ul role="grid"> → Sticker-Liste (virtualisiert)
//         <li> → <article> (jeder Sticker)
//
// Inline-Style-divs wurden ersetzt durch:
//   Album-Name: <h3>   Rarity: <dl>/<dt>/<dd>
//   Match-User: <address> (Kontaktdaten), Avatar: <figure>
//   Sticker-#:  <figcaption> im Sheet
// ============================================================

// ── Styled Components (semantisch) ───────────────────────────

// <section>-Wrapper mit konsistentem Abstand
const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// KPI-Grid: <ul> mit drei <li>s
const KpiList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  list-style: none;
  padding: 0;
  margin: 0;
`;

// KPI-Karte: <li> + <article> innen
const KpiItem = styled.li``;

const KpiCard = styled(Card).attrs({ as: 'article' })`
  text-align: center;
  padding: 14px 8px;
`;

// <strong> für Zahlenwert, <small> für Label
const KpiVal = styled.strong`
  display: block;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 30px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
  font-weight: normal;  /* Bebas Neue hat kein Bold */
`;
const KpiLabel = styled.small`
  display: block;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 3px;
`;

// Album-Card: als <article>
const AlbumCard = styled(Card).attrs({ as: 'article' })``;

const AlbumRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
  flex-wrap: wrap;
`;

// Album-Titel: <h3> (H2 kommt vom Section-Heading)
const AlbumTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 2px;
  color: ${({ theme }) => theme.colors.text};
`;
const AlbumSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

// Match-Alert-Card
const MatchAlertCard = styled(Card).attrs({ as: 'aside' })``;

const MatchAlertRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const MatchAlertTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px;
`;
const MatchAlertSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

// Sticker-Section
const StickerSection = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StickerSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;
`;

// H2 für Gruppen-Überschrift (H1 = App-Name in TopBar)
const GroupHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  letter-spacing: 0.04em;
  margin: 0;
`;

const LegendList = styled.ul`
  display: flex;
  gap: 4px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

// Sheet: Sticker-Detail ───────────────────────────────────────

// <figure> + <figcaption> für Sticker-Vorschau
const StickerFigure = styled.figure`
  text-align: center;
  padding: 8px 0 20px;
  margin: 0;
`;
const StickerFigIcon = styled.p`
  font-size: 64px;
  margin-bottom: 8px;
  line-height: 1;
`;
const StickerFigCaption = styled.figcaption`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 34px;
  letter-spacing: 0.06em;
  margin: 0 0 8px;
`;

// <dl> für Sticker-Metadaten (Label-Wert-Paare)
const MetaDl = styled.dl`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radius.md};
  margin: 0 0 8px;
  & dt { flex: 1; }
  & dd { margin: 0; color: ${({ theme }) => theme.colors.accent}; font-weight: 600; }
`;

// Sticker-Status-Auswahl: semantisches Grid mit Role
const StatusChoiceList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
  list-style: none;
  padding: 0;
`;
const StatusChoiceItem = styled.li``;

// Match-Sheet ─────────────────────────────────────────────────

// Match-Liste: <ul> mit <li>s
const MatchList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const MatchItem = styled.li`
  margin-bottom: 12px;
`;

// Match-Card als <article> (eigenständiger Inhaltsblock)
const MatchArticle = styled(Card).attrs({ as: 'article' })``;

const MatchCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
`;

const MatchUserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// <figure> für User-Avatar
const AvatarFigure = styled.figure`
  margin: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accent2}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.bg};
  font-family: ${({ theme }) => theme.fonts.display};
`;

// <address> für Kontaktdaten des Match-Users
const MatchAddress = styled.address`
  font-style: normal;
`;
const MatchUsername = styled.strong`
  display: block;
  font-size: 14px;
`;
const MatchMeta = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 2px 0 0;
`;

// Sticker-Tausch-Zeile: semantisch via <p> mit <span>
const MatchStickers = styled.p`
  font-size: 12px;
  margin: 10px 0;
  .give { color: ${({ theme }) => theme.colors.accent3}; }
  .get  { color: ${({ theme }) => theme.colors.accent};  }
`;

// Principles-Card
const PrinciplesCard = styled(Card).attrs({ as: 'aside' })``;
const PrinciplesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
const PrincipleItem = styled.li`
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
  font-size: 13px;
`;

// ── Demo Data ─────────────────────────────────────────────────

const STICKERS = Array.from({ length: 42 }, (_, i) => ({
  number: i + 1,
  icon: ['🇩🇪','🇫🇷','🇧🇷','🇪🇸','⭐','🏆','🇮🇹'][i % 7],
  status: i % 7 === 0 ? 'double' :
          i % 5 === 0 ? 'have'   :
          i % 11 === 0 ? 'locked' : 'need',
  count: i % 7 === 0 ? (Math.floor(i / 7) % 3) + 2 : 1,
}));

const MATCHES = [
  { name: 'fußball_kroos', rating: '5.0', trades: 47, city: 'München',
    give: ['#47', '#112'], get: ['#8', '#201'], match: 94 },
  { name: 'sammler_profi', rating: '4.8', trades: 132, city: 'Hamburg',
    give: ['#33', '#78'], get: ['#199', '#304'], match: 87 },
  { name: 'panini_petra',  rating: '4.9', trades: 23,  city: 'Berlin',
    give: ['#5'],          get: ['#88'],          match: 71 },
];

// ── Component ─────────────────────────────────────────────────

const DashboardPage = () => {
  const { toast, show: showToast } = useToast();
  const stickerSheet = useBottomSheet();
  const matchSheet   = useBottomSheet();

  const handleStickerTap = (sticker) => stickerSheet.open(sticker);

  const handleStatusChange = (newStatus) => {
    const labels = {
      have:   '✓ Als vorhanden markiert',
      double: '✓ Als doppelt markiert',
      need:   '✓ Als gesucht markiert',
    };
    showToast(labels[newStatus] || '✓ Gespeichert', 'success');
    stickerSheet.close();
  };

  const handleMatchRequest = (matchName) => {
    showToast(`✓ Tausch-Anfrage an ${matchName} gesendet!`, 'success');
    matchSheet.close();
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Padding + safe-area: inline-Element, kein Landmark-Wrapper nötig */}
      <div style={{ padding: '16px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))', overflowX: 'hidden' }}>

        {/* ── KPI-Sektion ── */}
        <Section aria-label="Sammlungs-Übersicht">
          <KpiList>
            <KpiItem>
              <KpiCard><KpiVal>342</KpiVal><KpiLabel>Gesammelt</KpiLabel></KpiCard>
            </KpiItem>
            <KpiItem>
              <KpiCard><KpiVal>87</KpiVal><KpiLabel>Doppelt</KpiLabel></KpiCard>
            </KpiItem>
            <KpiItem>
              <KpiCard><KpiVal>241</KpiVal><KpiLabel>Gesucht</KpiLabel></KpiCard>
            </KpiItem>
          </KpiList>
        </Section>

        {/* ── Album-Fortschritt ── */}
        <Section aria-label="Album-Fortschritt">
          <AlbumCard>
            <AlbumRow>
              <div>
                <AlbumTitle>WM 2026</AlbumTitle>
                <AlbumSub>51% vollständig</AlbumSub>
              </div>
              <Tag $color="yellow">342 / 670</Tag>
            </AlbumRow>
            <ProgressBar value={342} max={670} label="WM 2026 Album-Fortschritt" />
          </AlbumCard>
        </Section>

        {/* ── Match-Alert ── */}
        <Section aria-label="Neue Matches">
          <MatchAlertCard>
            <MatchAlertRow>
              <div>
                <MatchAlertTitle>🎯 3 neue Matches!</MatchAlertTitle>
                <MatchAlertSub>Jemand hat genau deine Fehlkarten</MatchAlertSub>
              </div>
              <Button $variant="success" $size="sm" onClick={() => matchSheet.open()}>
                Ansehen
              </Button>
            </MatchAlertRow>
          </MatchAlertCard>
        </Section>

        {/* ── Sticker-Grid: Gruppe A ── */}
        <StickerSection aria-labelledby="group-a-heading">
          <StickerSectionHeader>
            <GroupHeading id="group-a-heading">Gruppe A 🇩🇪</GroupHeading>
            <LegendList aria-label="Legende">
              <li><Tag $color="green">● Habe</Tag></li>
              <li><Tag $color="yellow">● Doppelt</Tag></li>
            </LegendList>
          </StickerSectionHeader>
          {/*
            StickerGrid ist <ul role="grid"> intern.
            Jede StickerCell ist <li><button>.
          */}
          <StickerGrid>
            {STICKERS.map((s) => (
              <StickerCell
                key={s.number}
                number={s.number}
                icon={s.icon}
                status={s.status}
                count={s.count}
                onClick={() => handleStickerTap(s)}
              />
            ))}
          </StickerGrid>
        </StickerSection>

        {/* ── Mobile-First Principles ── */}
        <PrinciplesCard aria-label="Kapitel-0-Prinzipien">
          <p style={{
            fontFamily: "'Bebas Neue',cursive",
            fontSize: 16, letterSpacing: '0.06em',
            color: '#f5c842', marginBottom: 12, marginTop: 0,
          }}>
            KAPITEL 0 — MOBILE-FIRST AKTIV
          </p>
          <PrinciplesList>
            {[
              ['P1', 'Layouts funktionieren auf iPhone SE (320px)'],
              ['P2', 'Bottom Sheets statt Modals — tippe auf Sticker'],
              ['P3', 'Alle Touch-Targets ≥ 44×44px'],
              ['P4', 'overflow-x: hidden — kein horizontales Scrollen'],
              ['P5', 'touch-action: manipulation — 0ms Tap-Delay'],
            ].map(([p, desc]) => (
              <PrincipleItem key={p}>
                <span style={{ fontFamily: "'Space Mono',monospace", color: '#4adeae', flexShrink: 0 }}>
                  ✅ {p}
                </span>
                <span style={{ color: '#6b6b8a' }}>{desc}</span>
              </PrincipleItem>
            ))}
          </PrinciplesList>
        </PrinciplesCard>

      </div>

      {/* ── Sticker-Detail Sheet ── */}
      <BottomSheet
        isOpen={stickerSheet.isOpen}
        onClose={stickerSheet.close}
        title={stickerSheet.data ? `Sticker #${stickerSheet.data.number}` : ''}
        snap="half"
      >
        {stickerSheet.data && (
          <>
            {/* <figure>: visuelle Repräsentation des Stickers */}
            <StickerFigure>
              <StickerFigIcon aria-hidden="true">
                {stickerSheet.data.icon}
              </StickerFigIcon>
              <StickerFigCaption>
                STICKER #{stickerSheet.data.number}
              </StickerFigCaption>
              <Tag $color={
                stickerSheet.data.status === 'have'   ? 'green'  :
                stickerSheet.data.status === 'double' ? 'yellow' : 'red'
              }>
                {stickerSheet.data.status === 'have'   ? '✓ Vorhanden' :
                 stickerSheet.data.status === 'double' ? `×${stickerSheet.data.count} Doppelt` :
                 stickerSheet.data.status === 'locked' ? '🔒 Im Tausch' : '✗ Gesucht'}
              </Tag>
            </StickerFigure>

            {/* <dl>: semantische Label-Wert-Paare */}
            <MetaDl>
              <dt>Rarity Score</dt>
              <dd>3.2 — Standard</dd>
            </MetaDl>
            <MetaDl>
              <dt>Token-Wert</dt>
              <dd>2 Token</dd>
            </MetaDl>
            <MetaDl>
              <dt>Andere haben doppelt</dt>
              <dd style={{ color: '#4adeae' }}>47 Sammler</dd>
            </MetaDl>

            {/* Status-Auswahl: <ul> mit <li><button> */}
            <StatusChoiceList aria-label="Status ändern">
              <StatusChoiceItem>
                <Button $variant="success" $size="sm" $full
                  onClick={() => handleStatusChange('have')}>Hab ich</Button>
              </StatusChoiceItem>
              <StatusChoiceItem>
                <Button $variant="primary" $size="sm" $full
                  onClick={() => handleStatusChange('double')}>Doppelt</Button>
              </StatusChoiceItem>
              <StatusChoiceItem>
                <Button $variant="secondary" $size="sm" $full
                  onClick={() => handleStatusChange('need')}>Fehlt mir</Button>
              </StatusChoiceItem>
            </StatusChoiceList>

            {stickerSheet.data.status === 'double' && (
              <Button
                $variant="success" $full
                style={{ marginTop: 12 }}
                onClick={() => { stickerSheet.close(); matchSheet.open(); }}
              >
                🎯 Match für diesen Sticker suchen
              </Button>
            )}
          </>
        )}
      </BottomSheet>

      {/* ── Matches Sheet ── */}
      <BottomSheet
        isOpen={matchSheet.isOpen}
        onClose={matchSheet.close}
        title="🎯 Deine Matches"
        snap="full"
      >
        {/* <ul> für Match-Liste */}
        <MatchList aria-label="Gefundene Tausch-Partner">
          {MATCHES.map((m) => (
            <MatchItem key={m.name}>
              <MatchArticle>
                <MatchCardHeader>
                  <MatchUserRow>
                    {/* <figure> für Avatar */}
                    <AvatarFigure aria-hidden="true">
                      {m.name[0].toUpperCase()}
                    </AvatarFigure>
                    {/* <address> für User-Kontaktdaten */}
                    <MatchAddress>
                      <MatchUsername>{m.name}</MatchUsername>
                      <MatchMeta>⭐ {m.rating} · {m.trades} Tausche · {m.city}</MatchMeta>
                    </MatchAddress>
                  </MatchUserRow>
                  <Tag $color="green">MATCH {m.match}%</Tag>
                </MatchCardHeader>
                <MatchStickers>
                  <span className="give">Du gibst: {m.give.join(', ')} </span>
                  <span style={{ color: '#6b6b8a' }}>→ </span>
                  <span className="get">Du bekommst: {m.get.join(', ')}</span>
                </MatchStickers>
                <Button $variant="success" $size="sm" $full
                  onClick={() => handleMatchRequest(m.name)}>
                  Tausch anfragen
                </Button>
              </MatchArticle>
            </MatchItem>
          ))}
        </MatchList>
      </BottomSheet>
    </>
  );
};

export default DashboardPage;
