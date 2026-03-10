import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/* ─── ANIMATIONS ─── */
const fadeUp  = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const float   = keyframes`0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}`;
const float2  = keyframes`0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-16px) rotate(-1deg)}`;
const glowCta = keyframes`0%,100%{box-shadow:0 0 20px rgba(245,200,66,0.2),0 4px 24px rgba(0,0,0,.4)}50%{box-shadow:0 0 48px rgba(245,200,66,.5),0 4px 24px rgba(0,0,0,.4)}`;
const pulseDot= keyframes`0%,100%{opacity:1}50%{opacity:.3}`;

/* ─── NAV ─── */
const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background: rgba(10,10,15,0.95);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
`;

const Logo = styled.div`
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 0.08em;
  color: var(--accent);
  cursor: pointer;
  span { color: var(--accent2); }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ─── HERO ─── */
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 64px);
`;

const HeroBg = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 60% 40% at 20% 50%, rgba(245,200,66,0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 60% at 80% 30%, rgba(232,67,90,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 60% 80%, rgba(74,222,174,0.05) 0%, transparent 70%);
`;

const GridBg = styled.div`
  position: absolute; inset: 0; opacity: 0.04; pointer-events: none;
  background-image:
    repeating-linear-gradient(0deg,  var(--accent) 0px, transparent 1px, transparent 60px, var(--accent) 61px),
    repeating-linear-gradient(90deg, var(--accent) 0px, transparent 1px, transparent 60px, var(--accent) 61px);
`;

const Eyebrow = styled.div`
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--accent3);
  padding: 6px 16px;
  border: 1px solid rgba(74,222,174,0.3);
  border-radius: 100px;
  background: rgba(74,222,174,0.05);
  position: relative; z-index: 1;
  margin-bottom: 20px;
  display: inline-block;
  animation: ${fadeUp} 0.6s ease both 0.1s;
`;

const HeroTitle = styled.h1`
  font-size: clamp(64px, 11vw, 130px);
  line-height: 0.92;
  letter-spacing: 0.02em;
  position: relative; z-index: 1;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.6s ease both 0.2s;

  .line2 { color: var(--accent); display: block; }
`;

const HeroSub = styled.p`
  font-size: 18px;
  color: var(--muted);
  max-width: 520px;
  line-height: 1.6;
  position: relative; z-index: 1;
  margin-bottom: 40px;
  animation: ${fadeUp} 0.6s ease both 0.3s;
`;

const HeroActions = styled.div`
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  position: relative; z-index: 1;
  animation: ${fadeUp} 0.6s ease both 0.4s;
`;

const BtnCta = styled.button`
  padding: 14px 28px;
  font-size: 16px; font-weight: 700;
  background: var(--accent);
  color: #0a0a0f;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  animation: ${glowCta} 3s ease-in-out infinite;
  transition: transform 0.2s, filter 0.2s;
  &:hover { transform: translateY(-2px); filter: brightness(1.08); }
  &:active { transform: translateY(0); }
`;

/* ─── FLOATING DEMO CARDS ─── */
const FloatRow = styled.div`
  display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
  margin-top: 56px;
  position: relative; z-index: 1;
  animation: ${fadeUp} 0.7s ease both 0.5s;
`;

const FloatCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 20px;
  min-width: 150px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset;
  animation: ${p => p.$float2 ? float2 : float} ${p => p.$dur || '4s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
`;

const CardLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 10px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 10px;
`;

const ChipRow = styled.div`
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px;
`;

const Chip = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;

  &.have   { background: rgba(74,222,174,0.1);  border: 1px solid rgba(74,222,174,0.25); color: var(--accent3); }
  &.double { background: rgba(245,200,66,0.1);  border: 1px solid rgba(245,200,66,0.25); color: var(--accent); }
  &.need   { background: rgba(124,111,205,0.1); border: 1px solid rgba(124,111,205,0.25); color: var(--accent4); }
`;

/* ─── STATS ─── */
const StatsRow = styled.div`
  display: flex; gap: 48px; margin-top: 64px;
  position: relative; z-index: 1;
  animation: ${fadeUp} 0.6s ease both 0.6s;
  @media (max-width: 480px) { gap: 28px; }
`;

const Stat = styled.div`text-align: center;`;
const StatNum = styled.span`
  font-family: var(--font-display);
  font-size: 42px; color: var(--accent);
  display: block; line-height: 1;
`;
const StatLabel = styled.div`font-size: 13px; color: var(--muted); margin-top: 4px;`;

/* ─── SECTIONS ─── */
const SectionWrap = styled.section`
  padding: 80px 32px;
  max-width: 1200px; margin: 0 auto; width: 100%;
`;

const SectionTitle = styled.div`
  font-family: var(--font-display);
  font-size: 52px; letter-spacing: 0.04em;
  margin-bottom: 8px;
`;

const SectionSub = styled.p`
  color: var(--muted); margin-bottom: 48px; font-size: 16px;
`;

/* ─── FEATURES ─── */
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const FeatureCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 28px;
  transition: all 0.3s; position: relative; overflow: hidden;
  &::before {
    content: ''; position: absolute; inset: 0; opacity: 0;
    background: linear-gradient(135deg, rgba(245,200,66,0.05), transparent);
    transition: opacity 0.3s;
  }
  &:hover { border-color: rgba(245,200,66,0.35); transform: translateY(-2px); }
  &:hover::before { opacity: 1; }
`;

const FeatureIcon = styled.div`
  width: 48px; height: 48px;
  background: var(--surface2); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; margin-bottom: 16px;
`;

/* ─── TRUST ─── */
const TrustSectionWrap = styled.div`
  background: linear-gradient(135deg, rgba(74,222,174,0.05), var(--bg));
  border: 1px solid rgba(74,222,174,0.2);
  border-radius: 16px; padding: 32px;
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px; margin-top: 24px;
`;

const TrustItem = styled.div`
  display: flex; gap: 12px; align-items: flex-start;
`;

/* ─── PRICING ─── */
const MonoSection = styled.section`
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 80px 32px;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px; max-width: 1000px; margin: 0 auto 48px;
`;

const PricingCard = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px; padding: 32px;
  transition: all 0.3s;
  position: relative;
  &:hover { transform: translateY(-2px); border-color: rgba(245,200,66,0.2); }

  &.featured {
    border-color: var(--accent);
    background: linear-gradient(135deg, rgba(245,200,66,0.07), var(--bg));
  }
  &.featured::after {
    content: 'BELIEBT';
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: var(--bg);
    font-family: var(--font-mono); font-size: 10px; font-weight: 700;
    padding: 4px 14px; border-radius: 100px; letter-spacing: 0.1em;
  }
`;

const PricingName = styled.h3`
  font-family: var(--font-display);
  font-size: 24px; letter-spacing: 0.06em; margin-bottom: 8px;
`;

const Price = styled.div`
  font-size: 38px; font-weight: 700; color: var(--accent); line-height: 1;
  margin-bottom: 12px;
  span { font-size: 16px; color: var(--muted); font-weight: 400; }
`;

const PricingDesc = styled.p`
  font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.5;
`;

const PricingList = styled.ul`
  list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;
  li {
    font-size: 13px; display: flex; align-items: center; gap: 8px; line-height: 1.4;
    &::before { content: '✓'; color: var(--accent3); font-weight: 700; flex-shrink: 0; }
    &.disabled { opacity: 0.3; text-decoration: line-through;
      &::before { content: '✕'; color: var(--muted); }
    }
  }
`;

/* ─── REVENUE CARDS ─── */
const RevenueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px; margin-top: 24px;
`;

const RevenueCard = styled.div`
  background: linear-gradient(135deg, rgba(245,200,66,0.1), var(--surface));
  border: 1px solid rgba(245,200,66,0.3);
  border-radius: 16px; padding: 24px;
  display: flex; align-items: center; gap: 20px;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
`;

/* ─── CONCEPT ─── */
const ConceptSection = styled.section`
  padding: 80px 32px;
  max-width: 1000px; margin: 0 auto;
`;

const ConceptRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;
  @media (max-width: 700px) { grid-template-columns: 1fr; }
`;

const ConceptCard = styled.div`
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 28px;
  h3 {
    font-family: var(--font-display); font-size: 22px; letter-spacing: 0.05em;
    margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  li {
    font-size: 14px; color: var(--muted); display: flex; gap: 8px; line-height: 1.5;
    &::before { content: '→'; color: var(--accent); flex-shrink: 0; font-weight: 700; }
    strong { color: var(--text2); }
  }
`;

/* ─── CTA BOTTOM ─── */
const CtaSection = styled.section`
  text-align: center; padding: 80px 32px;
  position: relative; overflow: hidden;
  &::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(245,200,66,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
`;

/* ─── FOOTER ─── */
const Footer = styled.footer`
  border-top: 1px solid var(--border);
  padding: 32px; text-align: center;
  color: var(--muted); font-size: 13px;
`;

/* ─── COUNTER HOOK ─── */
function useCountUp(target, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  const swapCount    = useCountUp(312000, 2200, statsVisible);
  const userCount    = useCountUp(48000,  2000, statsVisible);
  const satisfaction = useCountUp(96,     1500, statsVisible);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goLogin    = () => navigate('/login');
  const goRegister = () => navigate('/login');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ─── NAV ─── */}
      <Nav>
        <Logo>Sticker<span>Swap</span></Logo>
        <NavLinks>
          <button className="btn btn-ghost" onClick={goLogin}>Anmelden</button>
          <button className="btn btn-primary" onClick={goRegister}>Kostenlos starten</button>
        </NavLinks>
      </Nav>

      {/* ─── HERO ─── */}
      <HeroSection>
        <HeroBg />
        <GridBg />

        <Eyebrow>🏆 Für WM 2026 &amp; EM Panini-Sammler</Eyebrow>

        <HeroTitle>
          TAUSCH.
          <span className="line2">SAMMLE.<br />GEWINNE.</span>
        </HeroTitle>

        <HeroSub>
          Die erste Panini-Tauschbörse mit verifiziertem Benutzersystem, Betrugschutz und
          über 1.000 Stickern pro Album — endlich wirklich einfach.
        </HeroSub>

        <HeroActions>
          <BtnCta onClick={goRegister}>Jetzt kostenlos registrieren</BtnCta>
          <button className="btn btn-secondary" onClick={goLogin}>Demo ansehen →</button>
        </HeroActions>

        {/* Floating sticker preview */}
        <FloatRow>
          <FloatCard $delay="0s" $dur="4.2s">
            <CardLabel>WM 2026 · Gruppe A</CardLabel>
            <ChipRow>
              <Chip className="double">2× #142</Chip>
              <Chip className="double">3× #89</Chip>
            </ChipRow>
            <ChipRow>
              <Chip className="need">#201</Chip>
              <Chip className="need">#78</Chip>
            </ChipRow>
          </FloatCard>

          <FloatCard $float2 $delay="0.7s" $dur="5s">
            <CardLabel>Bundesliga 24/25</CardLabel>
            <ChipRow>
              <Chip className="have">#44</Chip>
              <Chip className="have">#98</Chip>
              <Chip className="have">#3</Chip>
            </ChipRow>
            <ChipRow>
              <Chip className="need">#201</Chip>
            </ChipRow>
          </FloatCard>

          <FloatCard $delay="1.2s" $dur="3.9s">
            <CardLabel>Champions League</CardLabel>
            <ChipRow>
              <Chip className="double">2× #17</Chip>
            </ChipRow>
            <ChipRow>
              <Chip className="need">#55</Chip>
              <Chip className="need">#99</Chip>
            </ChipRow>
          </FloatCard>
        </FloatRow>

        <StatsRow>
          <Stat>
            <StatNum>48K</StatNum>
            <StatLabel>Aktive Sammler</StatLabel>
          </Stat>
          <Stat>
            <StatNum>312K</StatNum>
            <StatLabel>Erfolgreiche Tausche</StatLabel>
          </Stat>
          <Stat>
            <StatNum>96%</StatNum>
            <StatLabel>Zufriedenheit</StatLabel>
          </Stat>
          <Stat>
            <StatNum>18</StatNum>
            <StatLabel>Aktive Alben</StatLabel>
          </Stat>
        </StatsRow>
      </HeroSection>

      {/* ─── FEATURES ─── */}
      <SectionWrap>
        <SectionTitle>Warum StickerSwap?</SectionTitle>
        <SectionSub>Weil Facebook-Gruppen 2006 waren.</SectionSub>
        <FeaturesGrid>
          {[
            { icon: '🔐', title: '100% Verifizierte User', desc: 'Keine anonymen Profile. Jeder Nutzer wird per E-Mail verifiziert — inkl. Reputationssystem und Tauschhistorie.' },
            { icon: '🎯', title: 'Intelligentes Matching', desc: 'Unser Algorithmus findet automatisch Tauschpartner, die genau das haben, was du brauchst — und brauchen, was du hast.' },
            { icon: '📱', title: 'Scannen via App', desc: 'Sticker einfach per Kamera einscannen oder Nummer eingeben. Dein Album wird automatisch aktualisiert.' },
            { icon: '🌍', title: 'Mehrsprachig', desc: 'Deutsch, Englisch, Französisch, Spanisch, Portugiesisch, Italienisch — tausche mit Sammlern aus ganz Europa.' },
            { icon: '🛡️', title: 'Betrugschutz', desc: 'Rating-System, Tauschsperren bei Beschwerden, anonymisierte Adressvergabe und optionaler Tracking-Code-Pflicht.' },
            { icon: '⚡', title: 'Live-Marktplatz', desc: 'Tauschangebote in Echtzeit — filtere nach Region, Versandkosten, Albumtyp und Tauschpartner-Bewertung.' },
          ].map(f => (
            <FeatureCard key={f.title}>
              <FeatureIcon>{f.icon}</FeatureIcon>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '17px', fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </SectionWrap>

      {/* ─── TRUST ─── */}
      <SectionWrap style={{ paddingTop: 0 }}>
        <TrustSectionWrap>
          <SectionTitle style={{ fontSize: 42 }}>Sicherheit zuerst</SectionTitle>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Wir schützen unsere Community aktiv vor Betrug.</p>
          <TrustGrid>
            {[
              { icon: '🔒', title: 'Adress-Anonymisierung', desc: 'Echte Adressen bleiben verborgen bis zur Tauschbestätigung von beiden Seiten.' },
              { icon: '⭐', title: 'Reputationssystem', desc: 'Jeder Tausch gibt Punkte. Schlechte Bewertungen wirken sofort auf Sichtbarkeit und Limits.' },
              { icon: '🚨', title: 'Meldesystem', desc: 'Betrug oder No-Show melden — wir prüfen innerhalb 24h und sperren bei Missbrauch.' },
              { icon: '📦', title: 'Tracking-Code (Pro)', desc: 'Premium-User können Tracking-Pflicht aktivieren — so weiß jeder wo sein Paket ist.' },
              { icon: '🤝', title: 'Gegenseitige Bestätigung', desc: 'Tausch gilt erst als abgeschlossen, wenn beide Seiten Erhalt bestätigt haben.' },
              { icon: '🏷️', title: 'Verifiziertes Profil-Badge', desc: 'Tausche bevorzugt mit verifizierten Nutzern — erkennbar am grünen Häkchen.' },
            ].map(t => (
              <TrustItem key={t.title}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--font-body)' }}>{t.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{t.desc}</p>
                </div>
              </TrustItem>
            ))}
          </TrustGrid>
        </TrustSectionWrap>
      </SectionWrap>

      {/* ─── PRICING ─── */}
      <MonoSection>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionTitle>Pläne &amp; Preise</SectionTitle>
          <SectionSub>Sammeln ist kostenlos — wer mehr will, zahlt fair.</SectionSub>

          <PricingGrid>
            {/* FREE */}
            <PricingCard>
              <PricingName>Free</PricingName>
              <Price>0€ <span>/ Monat</span></Price>
              <PricingDesc>Für Gelegenheitssammler. Alle Grundfunktionen inklusive.</PricingDesc>
              <PricingList>
                <li>1 aktives Album</li>
                <li>10 Tausche / Monat</li>
                <li>Basis-Matching</li>
                <li>Öffentliches Profil</li>
                <li className="disabled">Priorität im Matching</li>
                <li className="disabled">Smart-Pakete</li>
              </PricingList>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={goRegister}>
                Kostenlos starten
              </button>
            </PricingCard>

            {/* PRO — featured */}
            <PricingCard className="featured">
              <PricingName>Pro</PricingName>
              <Price>2,99€ <span>/ Monat</span></Price>
              <PricingDesc>Für echte Sammler. Schneller fertig werden mit cleveren Features.</PricingDesc>
              <PricingList>
                <li>Unbegrenzte Alben</li>
                <li>Unbegrenzte Tausche</li>
                <li>Priorität im Matching</li>
                <li>Smart-Pakete (5er, 10er)</li>
                <li>Tracking-Code Pflicht</li>
                <li>Ad-free Erlebnis</li>
              </PricingList>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={goRegister}>
                Pro testen
              </button>
            </PricingCard>

            {/* HÄNDLER */}
            <PricingCard>
              <PricingName>Händler</PricingName>
              <Price>9,99€ <span>/ Monat</span></Price>
              <PricingDesc>Für Shops, die Doppelkarten kaufen oder verkaufen wollen.</PricingDesc>
              <PricingList>
                <li>Verkaufsfunktion (Fixpreis)</li>
                <li>Shopseite mit eigenem Profil</li>
                <li>Bulk-Import via CSV</li>
                <li>Analytics &amp; Umsatzbericht</li>
                <li>Verifiziertes Händler-Badge</li>
                <li>5% Provision pro Verkauf</li>
              </PricingList>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={goRegister}>
                Als Händler starten
              </button>
            </PricingCard>
          </PricingGrid>

          {/* Revenue streams */}
          <div>
            <SectionTitle style={{ fontSize: 36 }}>Einnahmemodelle</SectionTitle>
            <RevenueGrid>
              {[
                { icon: '💳', title: 'Subscriptions', desc: 'Free → Pro → Händler. Wiederkehrende Einnahmen, skalierbarer Revenue.' },
                { icon: '🏪', title: '5% Marktplatz-Fee', desc: 'Auf jeden Sticker-Verkauf (kein Tausch) nehmen wir 5% Provision.' },
                { icon: '🎯', title: 'Panini-Partnerschaft', desc: 'Affiliate-Links auf offizielle Startersets, Blindpacks, Sammelalben.' },
                { icon: '📊', title: 'Community-Daten (anonym)', desc: 'Aggregierte Fehlkarten-Insights an Verlage / Retailer lizenzieren.' },
              ].map(r => (
                <RevenueCard key={r.title}>
                  <div style={{ fontSize: 36, flexShrink: 0 }}>{r.icon}</div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', marginBottom: 4 }}>{r.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--muted)' }}>{r.desc}</p>
                  </div>
                </RevenueCard>
              ))}
            </RevenueGrid>
          </div>
        </div>
      </MonoSection>

      {/* ─── CONCEPT / TECH ─── */}
      <ConceptSection>
        <SectionTitle>Konzept &amp; Technologie</SectionTitle>
        <SectionSub>Was dahinter steckt — und wohin es geht.</SectionSub>
        <ConceptRow>
          <ConceptCard>
            <h3>🏗️ Tech-Stack</h3>
            <ul>
              <li>React / CRA Frontend (Vercel)</li>
              <li>Supabase Backend (Auth, DB, Edge Functions)</li>
              <li>Stripe für Subscriptions &amp; Payments</li>
              <li>Brevo SMTP für E-Mails &amp; Notifications</li>
              <li>i18next für Mehrsprachigkeit (15 Sprachen)</li>
              <li>Claude API für Smart-Matching &amp; Fraud-Detection</li>
              <li>Cloudinary für Profilbilder &amp; Sticker-Scans</li>
            </ul>
          </ConceptCard>
          <ConceptCard>
            <h3>📅 Roadmap</h3>
            <ul>
              <li><strong>Phase 1:</strong> MVP — Tauschbörse, Profil, Matching</li>
              <li><strong>Phase 2:</strong> Mobile App (React Native), Barcode-Scan</li>
              <li><strong>Phase 3:</strong> Händler-Modul, Verkaufsfunktion</li>
              <li><strong>Phase 4:</strong> Gamification (Achievements, Ranglisten)</li>
              <li><strong>Phase 5:</strong> AI-Wertschätzung seltener Sticker</li>
              <li><strong>Phase 6:</strong> Erweiterung auf Pokémon etc.</li>
            </ul>
          </ConceptCard>
          <ConceptCard>
            <h3>🎯 Zielgruppe</h3>
            <ul>
              <li>6–16 Mio. aktive Panini-Sammler in D-A-CH</li>
              <li>WM/EM: Spikes mit 5–10x Nutzerwachstum</li>
              <li>Kinder (mit Eltern-Account), Jugendliche, Erwachsene</li>
              <li>Gelegentliche Sammler UND Hardcore-Komplettisten</li>
              <li>Klubs, Schulen, Vereine als Gruppenkonten</li>
            </ul>
          </ConceptCard>
          <ConceptCard>
            <h3>🔑 Alleinstellungsmerkmale</h3>
            <ul>
              <li>Intelligentes Matching statt manueller Suche</li>
              <li>Vollständiger Betrugschutz (Adress-Proxy, Rating)</li>
              <li>1.000+ Sticker pro Album sauber strukturiert</li>
              <li>Mehrsprachig von Anfang an (15 Sprachen)</li>
              <li>Keine anonymen User — nur Community</li>
              <li>Design-Qualität wie eine Tech-Startup-App</li>
            </ul>
          </ConceptCard>
        </ConceptRow>
      </ConceptSection>

      {/* ─── FINAL CTA ─── */}
      <CtaSection>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 9vw, 100px)', marginBottom: 16, position: 'relative', zIndex: 1 }}>
          DEIN ALBUM.<br />
          <span style={{ color: 'var(--accent)' }}>WARTET AUF DICH.</span>
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 17, marginBottom: 36, position: 'relative', zIndex: 1 }}>
          Kostenlos registrieren. Sofort loslegen.
        </p>
        <BtnCta onClick={goRegister} style={{ position: 'relative', zIndex: 1, fontSize: 17, padding: '16px 44px' }}>
          🚀 Jetzt kostenlos starten
        </BtnCta>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 14, position: 'relative', zIndex: 1 }}>
          Kein Abo. Keine Kreditkarte. Für immer kostenlos nutzbar.
        </p>
      </CtaSection>

      {/* ─── FOOTER ─── */}
      <Footer>
        © 2026 StickerSwap · DSGVO-konform · Hamburg
        {' · '}
        <a href="/impressum" style={{ color: 'var(--muted)' }}>Impressum</a>
        {' · '}
        <a href="/datenschutz" style={{ color: 'var(--muted)' }}>Datenschutz</a>
        {' · '}
        <a href="/agb" style={{ color: 'var(--muted)' }}>AGB</a>
      </Footer>
    </div>
  );
}
