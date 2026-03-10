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
// DashboardPage — Haupt-Demo für Kapitel 0
// Zeigt alle 5 Mobile-First Prinzipien live
// ============================================================

const Page = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px));
  overflow-x: hidden;
`;

const Row = styled.div`
  display: flex;
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: ${({ $justify }) => $justify || 'space-between'};
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
`;

const KpiCard = styled(Card)`
  text-align: center;
  padding: 14px 8px;
`;

const KpiVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 30px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1;
`;

const KpiLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 3px;
`;

const Spacer = styled.div`
  height: ${({ $h }) => $h || '16px'};
`;

const SectionHead = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  letter-spacing: 0.04em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const SheetSticker = styled.div`
  text-align: center;
  padding: 8px 0 20px;
`;

const BigIcon = styled.div`
  font-size: 64px;
  margin-bottom: 8px;
`;

const StickerTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 34px;
  letter-spacing: 0.06em;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-top: 16px;
`;

const MatchCard = styled(Card)`
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.accent},
    ${({ theme }) => theme.colors.accent2}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  flex-shrink: 0;
`;

const MatchMeta = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const MatchStickers = styled.div`
  font-size: 12px;
  margin: 10px 0;
  span.give { color: ${({ theme }) => theme.colors.accent3}; }
  span.get  { color: ${({ theme }) => theme.colors.accent}; }
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
    give: ['#5'],         get: ['#88'],          match: 71 },
];

// ── Component ─────────────────────────────────────────────────

const DashboardPage = () => {
  const { toast, show: showToast } = useToast();
  const stickerSheet = useBottomSheet();
  const matchSheet   = useBottomSheet();

  const handleStickerTap = (sticker) => stickerSheet.open(sticker);

  const handleStatusChange = (newStatus) => {
    const labels = { have: '✓ Als vorhanden markiert', double: '✓ Als doppelt markiert', need: '✓ Als gesucht markiert' };
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

      <Page>
        {/* KPIs */}
        <KpiGrid>
          <KpiCard><KpiVal>342</KpiVal><KpiLabel>Gesammelt</KpiLabel></KpiCard>
          <KpiCard><KpiVal>87</KpiVal><KpiLabel>Doppelt</KpiLabel></KpiCard>
          <KpiCard><KpiVal>241</KpiVal><KpiLabel>Gesucht</KpiLabel></KpiCard>
        </KpiGrid>

        {/* Album Progress */}
        <Spacer />
        <Card>
          <Row style={{ marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 600 }}>WM 2026</div>
              <div style={{ fontSize: 12, color: '#6b6b8a' }}>51% vollständig</div>
            </div>
            <Tag $color="yellow">342 / 670</Tag>
          </Row>
          <ProgressBar value={342} max={670} />
        </Card>

        {/* Match Alert */}
        <Spacer />
        <Card $borderColor="rgba(74,222,174,0.3)">
          <Row>
            <div>
              <div style={{ fontWeight: 600 }}>🎯 3 neue Matches!</div>
              <div style={{ fontSize: 12, color: '#6b6b8a', marginTop: 2 }}>
                Jemand hat genau deine Fehlkarten
              </div>
            </div>
            <Button $variant="success" $size="sm" onClick={() => matchSheet.open()}>
              Ansehen
            </Button>
          </Row>
        </Card>

        {/* Sticker Grid */}
        <Spacer $h="24px" />
        <Row style={{ marginBottom: 10 }}>
          <SectionHead>Gruppe A 🇩🇪</SectionHead>
          <Row style={{ gap: 4 }}>
            <Tag $color="green">● Habe</Tag>
            <Tag $color="yellow">● Doppelt</Tag>
          </Row>
        </Row>
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

        {/* Principles Card */}
        <Spacer $h="24px" />
        <Card $borderColor="rgba(245,200,66,0.2)">
          <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 16, letterSpacing: '0.06em', color: '#f5c842', marginBottom: 12 }}>
            KAPITEL 0 — MOBILE-FIRST AKTIV
          </div>
          {[
            ['P1', 'Layouts funktionieren auf iPhone SE (320px)'],
            ['P2', 'Bottom Sheets statt Modals — tippe auf Sticker'],
            ['P3', 'Alle Touch-Targets ≥ 44×44px'],
            ['P4', 'overflow-x: hidden — kein horizontales Scrollen'],
            ['P5', 'touch-action: manipulation — 0ms Tap-Delay'],
          ].map(([p, desc]) => (
            <div key={p} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 13 }}>
              <span style={{ fontFamily: "'Space Mono',monospace", color: '#4adeae', flexShrink: 0 }}>✅ {p}</span>
              <span style={{ color: '#6b6b8a' }}>{desc}</span>
            </div>
          ))}
        </Card>
      </Page>

      {/* ── Sticker Detail Sheet ── */}
      <BottomSheet
        isOpen={stickerSheet.isOpen}
        onClose={stickerSheet.close}
        title={stickerSheet.data ? `Sticker #${stickerSheet.data.number}` : ''}
        snap="half"
      >
        {stickerSheet.data && (
          <>
            <SheetSticker>
              <BigIcon>{stickerSheet.data.icon}</BigIcon>
              <StickerTitle>STICKER #{stickerSheet.data.number}</StickerTitle>
              <div style={{ marginTop: 8 }}>
                <Tag $color={
                  stickerSheet.data.status === 'have'   ? 'green'  :
                  stickerSheet.data.status === 'double' ? 'yellow' : 'red'
                }>
                  {stickerSheet.data.status === 'have'   ? '✓ Vorhanden' :
                   stickerSheet.data.status === 'double' ? `×${stickerSheet.data.count} Doppelt` :
                   stickerSheet.data.status === 'locked' ? '🔒 Im Tausch' : '✗ Gesucht'}
                </Tag>
              </div>
            </SheetSticker>

            <MetaRow><span>Rarity Score</span><span style={{ color: '#f5c842' }}>3.2 — Standard</span></MetaRow>
            <Spacer $h="8px" />
            <MetaRow><span>Token-Wert</span><span style={{ color: '#f5c842' }}>2 Token</span></MetaRow>
            <Spacer $h="8px" />
            <MetaRow><span>Andere haben doppelt</span><span style={{ color: '#4adeae' }}>47 Sammler</span></MetaRow>

            <StatusGrid>
              <Button $variant="success" $size="sm" $full onClick={() => handleStatusChange('have')}>Hab ich</Button>
              <Button $variant="primary" $size="sm" $full onClick={() => handleStatusChange('double')}>Doppelt</Button>
              <Button $variant="secondary" $size="sm" $full onClick={() => handleStatusChange('need')}>Fehlt mir</Button>
            </StatusGrid>

            {stickerSheet.data.status === 'double' && (
              <>
                <Spacer $h="12px" />
                <Button $variant="success" $full onClick={() => { stickerSheet.close(); matchSheet.open(); }}>
                  🎯 Match für diesen Sticker suchen
                </Button>
              </>
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
        {MATCHES.map((m) => (
          <MatchCard key={m.name}>
            <Row style={{ marginBottom: 10 }}>
              <Row style={{ gap: 10, justifyContent: 'flex-start' }}>
                <Avatar>{m.name[0].toUpperCase()}</Avatar>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                  <MatchMeta>⭐ {m.rating} · {m.trades} Tausche · {m.city}</MatchMeta>
                </div>
              </Row>
              <Tag $color="green">MATCH {m.match}%</Tag>
            </Row>
            <MatchStickers>
              <span className="give">Du gibst: {m.give.join(', ')} </span>
              <span style={{ color: '#6b6b8a' }}>→ </span>
              <span className="get">Du bekommst: {m.get.join(', ')}</span>
            </MatchStickers>
            <Button $variant="success" $size="sm" $full onClick={() => handleMatchRequest(m.name)}>
              Tausch anfragen
            </Button>
          </MatchCard>
        ))}
      </BottomSheet>
    </>
  );
};

export default DashboardPage;
