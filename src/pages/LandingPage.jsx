import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/* ─────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
const float = keyframes`
  0%,100% { transform: translateY(0px) rotate(-2deg); }
  50%     { transform: translateY(-12px) rotate(1deg); }
`;
const float2 = keyframes`
  0%,100% { transform: translateY(0px) rotate(3deg); }
  50%     { transform: translateY(-16px) rotate(-1deg); }
`;
const glowPulse = keyframes`
  0%,100% { box-shadow: 0 0 20px rgba(245,200,66,0.2), 0 4px 24px rgba(0,0,0,0.5); }
  50%     { box-shadow: 0 0 48px rgba(245,200,66,0.5), 0 4px 24px rgba(0,0,0,0.5); }
`;
const countUp = keyframes`
  from { opacity: 0; transform: scale(0.7) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const scanLine = keyframes`
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(400%); opacity: 0; }
`;

/* ─────────────────────────────────────────────
   LAYOUT
───────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: var(--bg);
  overflow-x: hidden;
`;

/* NAV */
const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(10,10,15,0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(42,42,58,0.6);
  animation: ${fadeIn} 0.4s ease;
`;

const Logo = styled.div`
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 0.06em;
  cursor: pointer;
  span { color: var(--accent); }
  em { color: var(--accent2); font-style: normal; }
`;

const NavActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const BtnOutline = styled.button`
  padding: 9px 20px;
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  color: var(--text2);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s var(--ease);
  &:hover { border-color: var(--accent3); color: var(--accent3); }
`;

const BtnPrimary = styled.button`
  padding: 9px 22px;
  background: var(--accent);
  border-radius: var(--radius-sm);
  color: #0a0a0f;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s var(--ease);
  &:hover {
    background: #f7d45c;
    transform: translateY(-1px);
    box-shadow: var(--glow-gold);
  }
  &:active { transform: translateY(0); }
`;

/* ─── HERO ─── */
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--nav-height) + 48px) 24px 80px;
  position: relative;
  overflow: hidden;
  text-align: center;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 65% 45% at 15% 55%, rgba(245,200,66,0.07) 0%, transparent 65%),
    radial-gradient(ellipse 55% 65% at 85% 25%, rgba(232,67,90,0.06) 0%, transparent 65%),
    radial-gradient(ellipse 45% 55% at 55% 85%, rgba(74,222,174,0.05) 0%, transparent 65%);
  pointer-events: none;
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.035;
  background-image:
    repeating-linear-gradient(0deg, var(--accent) 0px, transparent 1px, transparent 64px, var(--accent) 65px),
    repeating-linear-gradient(90deg, var(--accent) 0px, transparent 1px, transparent 64px, var(--accent) 65px);
  pointer-events: none;
`;

const Eyebrow = styled.div`
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent3);
  padding: 6px 18px;
  border: 1px solid rgba(74,222,174,0.3);
  border-radius: 100px;
  background: rgba(74,222,174,0.06);
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  display: inline-block;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: 0.1s;
`;

const HeroTitle = styled.h1`
  font-size: clamp(56px, 11vw, 128px);
  line-height: 0.92;
  letter-spacing: 0.025em;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: 0.2s;

  .line1 { display: block; color: var(--text); }
  .line2 { display: block; color: var(--accent); }
`;

const HeroSub = styled.p`
  font-size: 18px;
  color: var(--muted);
  max-width: 500px;
  line-height: 1.65;
  margin-bottom: 44px;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: 0.3s;

  strong { color: var(--text2); font-weight: 500; }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: 0.4s;
`;

const BtnHeroPrimary = styled.button`
  padding: 16px 36px;
  background: var(--accent);
  border-radius: var(--radius);
  color: #0a0a0f;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.01em;
  animation: ${glowPulse} 3s ease-in-out infinite;
  transition: transform 0.2s var(--ease), filter 0.2s;
  white-space: nowrap;
  &:hover { transform: translateY(-2px) scale(1.02); filter: brightness(1.1); }
  &:active { transform: translateY(0) scale(0.98); }
`;

const BtnHeroGhost = styled.button`
  padding: 15px 28px;
  border: 1px solid var(--border2);
  border-radius: var(--radius);
  color: var(--text2);
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s var(--ease);
  white-space: nowrap;
  &:hover { border-color: var(--accent3); color: var(--accent3); background: rgba(74,222,174,0.05); }
`;

/* ─── FLOATING STICKER CARDS ─── */
const FloatingCards = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 64px;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeIn} 0.8s ease both;
  animation-delay: 0.5s;

  @media (max-width: 600px) { gap: 12px; }
`;

const FloatCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${p => p.$float2 ? float2 : float} ${p => p.$duration || '4s'} ease-in-out infinite;
  animation-delay: ${p => p.$delay || '0s'};
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset;
  min-width: 140px;

  @media (max-width: 480px) { min-width: 110px; padding: 10px 12px; }
`;

const CardAlbumName = styled.div`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const CardRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

/* ─── STATS ─── */
const StatsRow = styled.div`
  display: flex;
  gap: 48px;
  margin-top: 64px;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: 0.6s;

  @media (max-width: 480px) { gap: 28px; }
`;

const Stat = styled.div`
  text-align: center;
`;
const StatNum = styled.span`
  font-family: var(--font-display);
  font-size: 44px;
  color: var(--accent);
  display: block;
  line-height: 1;
  animation: ${countUp} 0.8s var(--ease) both;
  animation-delay: ${p => p.$delay || '0.7s'};
`;
const StatLabel = styled.span`
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  display: block;
  font-family: var(--font-mono);
  letter-spacing: 0.06em;
`;

/* ─── HOW IT WORKS ─── */
const Section = styled.section`
  padding: 100px 24px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
`;

const SectionHeader = styled.div`
  margin-bottom: 56px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(42px, 7vw, 72px);
  letter-spacing: 0.04em;
  margin-bottom: 10px;
`;

const SectionSub = styled.p`
  color: var(--muted);
  font-size: 16px;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StepCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s var(--ease), transform 0.25s var(--ease);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0;
    background: ${p => p.$gradient};
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: ${p => p.$accent};
    transform: translateY(-3px);
    &::before { opacity: 1; }
  }
`;

const StepNum = styled.div`
  font-family: var(--font-display);
  font-size: 72px;
  color: ${p => p.$color};
  opacity: 0.12;
  position: absolute;
  top: 12px;
  right: 20px;
  line-height: 1;
  pointer-events: none;
`;

const StepIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const StepTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
  color: var(--text);
  position: relative;
  z-index: 1;
`;

const StepDesc = styled.p`
  font-size: 14px;
  color: var(--muted);
  line-height: 1.65;
  position: relative;
  z-index: 1;
`;

/* ─── SCANNER VISUAL ─── */
const ScannerVisual = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: var(--surface2);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  margin: 0 auto 8px;

  &::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent3), transparent);
    animation: ${scanLine} 2s ease-in-out infinite;
    animation-delay: ${p => p.$delay || '0s'};
  }
`;

const ScannerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  height: 100%;
`;

const ScannerCell = styled.div`
  border-radius: 3px;
  background: ${p => p.$color || 'var(--surface3)'};
  opacity: ${p => p.$opacity || 1};
`;

/* ─── SOCIAL PROOF ─── */
const ProofSection = styled.section`
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 80px 24px;
  text-align: center;
`;

const ProofInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const ProofBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px 8px 12px;
  background: rgba(74,222,174,0.08);
  border: 1px solid rgba(74,222,174,0.2);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent3);
  margin-bottom: 48px;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent3);
  box-shadow: 0 0 8px var(--accent3);
  animation: ${keyframes`
    0%,100% { opacity: 1; }
    50%      { opacity: 0.3; }
  `} 1.5s ease-in-out infinite;
`;

const CounterDisplay = styled.div`
  font-family: var(--font-display);
  font-size: clamp(64px, 12vw, 120px);
  line-height: 1;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, var(--accent) 30%, var(--accent2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
`;

const CounterLabel = styled.p`
  font-size: 18px;
  color: var(--text2);
  max-width: 400px;
  margin: 0 auto 48px;
  line-height: 1.5;

  strong { color: var(--accent3); font-weight: 600; }
`;

const ProofGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: left;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ProofCard = styled.div`
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: border-color 0.2s;
  &:hover { border-color: var(--border2); }
`;

const ProofCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${p => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const AvatarName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
`;
const AvatarSub = styled.div`
  font-size: 11px;
  color: var(--muted);
  font-family: var(--font-mono);
`;

const ProofCardText = styled.p`
  font-size: 13px;
  color: var(--text2);
  line-height: 1.55;
`;

/* ─── CTA ─── */
const CtaSection = styled.section`
  padding: 100px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(245,200,66,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const CtaTitle = styled.h2`
  font-size: clamp(48px, 9vw, 100px);
  line-height: 0.92;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;

  .gold { color: var(--accent); }
`;

const CtaSub = styled.p`
  font-size: 17px;
  color: var(--muted);
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
`;

const BtnCtaLarge = styled.button`
  padding: 18px 48px;
  background: var(--accent);
  border-radius: var(--radius);
  color: #0a0a0f;
  font-size: 17px;
  font-weight: 700;
  animation: ${glowPulse} 3s ease-in-out infinite;
  transition: transform 0.2s var(--ease);
  position: relative;
  z-index: 1;
  &:hover { transform: translateY(-2px) scale(1.02); filter: brightness(1.08); }
  &:active { transform: translateY(0); }
`;

const CtaNote = styled.p`
  font-size: 13px;
  color: var(--muted);
  margin-top: 16px;
  position: relative;
  z-index: 1;
`;

/* ─── FOOTER ─── */
const Footer = styled.footer`
  border-top: 1px solid var(--border);
  padding: 32px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 480px) { flex-direction: column; text-align: center; }
`;

const FooterLogo = styled.div`
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 0.06em;
  span { color: var(--accent); }
  em { color: var(--accent2); font-style: normal; }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;
  a {
    font-size: 13px;
    color: var(--muted);
    &:hover { color: var(--text2); }
  }
`;

/* ─── ANIMATED COUNTER HOOK ─── */
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const startVal = 0;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const proofRef = useRef(null);
  const [counterStarted, setCounterStarted] = useState(false);
  const swapCount = useCountUp(1247, 2000, counterStarted);

  // Start counter when proof section enters viewport
  useEffect(() => {
    const el = proofRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCounterStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goToLogin = () => navigate('/login');

  return (
    <Page>
      {/* ─── NAV ─── */}
      <Nav>
        <Logo>STICKER<span>SWAP</span><em>.</em></Logo>
        <NavActions>
          <BtnOutline onClick={goToLogin}>Anmelden</BtnOutline>
          <BtnPrimary onClick={goToLogin}>Kostenlos starten</BtnPrimary>
        </NavActions>
      </Nav>

      {/* ─── HERO ─── */}
      <HeroSection>
        <HeroBg />
        <GridBg />

        <Eyebrow>⚡ WM 2026 Edition — jetzt live</Eyebrow>

        <HeroTitle>
          <span className="line1">Tausche dich</span>
          <span className="line2">zum vollen Album.</span>
        </HeroTitle>

        <HeroSub>
          Verbinde dich mit Sammlern in deiner Region.<br />
          <strong>Doubles raus, Fehlende rein</strong> — smart, sicher, kostenlos.
        </HeroSub>

        <HeroActions>
          <BtnHeroPrimary onClick={goToLogin}>🚀 Jetzt kostenlos starten</BtnHeroPrimary>
          <BtnHeroGhost>Wie funktioniert's?</BtnHeroGhost>
        </HeroActions>

        {/* Floating sticker preview cards */}
        <FloatingCards>
          <FloatCard $delay="0s" $duration="4.2s">
            <CardAlbumName>WM 2026 · Gruppe A</CardAlbumName>
            <CardRow>
              <span className="sticker-pill double">2× #142</span>
              <span className="sticker-pill double">3× #89</span>
            </CardRow>
            <CardRow>
              <span className="sticker-pill need">#201</span>
              <span className="sticker-pill need">#78</span>
            </CardRow>
          </FloatCard>

          <FloatCard $float2 $delay="0.6s" $duration="5s">
            <CardAlbumName>Bundesliga 24/25</CardAlbumName>
            <CardRow>
              <span className="sticker-pill have">#44</span>
              <span className="sticker-pill have">#98</span>
              <span className="sticker-pill have">#3</span>
            </CardRow>
            <CardRow>
              <span className="sticker-pill need">#201</span>
            </CardRow>
          </FloatCard>

          <FloatCard $delay="1.1s" $duration="3.8s">
            <CardAlbumName>Champions League</CardAlbumName>
            <CardRow>
              <span className="sticker-pill double">2× #17</span>
            </CardRow>
            <CardRow>
              <span className="sticker-pill need">#55</span>
              <span className="sticker-pill need">#99</span>
            </CardRow>
          </FloatCard>
        </FloatingCards>

        <StatsRow>
          <Stat>
            <StatNum $delay="0.7s">12.400+</StatNum>
            <StatLabel>Sammler</StatLabel>
          </Stat>
          <Stat>
            <StatNum $delay="0.8s">98.7%</StatNum>
            <StatLabel>Erfolgsrate</StatLabel>
          </Stat>
          <Stat>
            <StatNum $delay="0.9s">4,8 ★</StatNum>
            <StatLabel>Bewertung</StatLabel>
          </Stat>
        </StatsRow>
      </HeroSection>

      {/* ─── HOW IT WORKS ─── */}
      <Section>
        <SectionHeader>
          <SectionTitle>So einfach geht's.</SectionTitle>
          <SectionSub>Drei Schritte zum vollständigen Album.</SectionSub>
        </SectionHeader>

        <StepsGrid>
          <StepCard
            $accent="rgba(74,222,174,0.4)"
            $gradient="linear-gradient(135deg, rgba(74,222,174,0.04) 0%, transparent 70%)"
          >
            <StepNum $color="var(--accent3)">01</StepNum>
            <StepIconWrap $bg="rgba(74,222,174,0.1)" $border="rgba(74,222,174,0.2)">
              📖
            </StepIconWrap>
            <StepTitle>Album scannen</StepTitle>
            <StepDesc>
              Trag deine vorhandenen und fehlenden Sticker ein — einmalig per Tabellen-Import oder Kachel für Kachel. Wir merken uns alles.
            </StepDesc>
          </StepCard>

          <StepCard
            $accent="rgba(124,111,205,0.4)"
            $gradient="linear-gradient(135deg, rgba(124,111,205,0.04) 0%, transparent 70%)"
          >
            <StepNum $color="var(--accent4)">02</StepNum>
            <StepIconWrap $bg="rgba(124,111,205,0.1)" $border="rgba(124,111,205,0.2)">
              🎯
            </StepIconWrap>
            <StepTitle>Matches finden</StepTitle>
            <StepDesc>
              Unser Smart-Matching-Algorithmus findet Sammler in deiner Region, die genau das haben, was du brauchst — und umgekehrt.
            </StepDesc>
          </StepCard>

          <StepCard
            $accent="rgba(245,200,66,0.4)"
            $gradient="linear-gradient(135deg, rgba(245,200,66,0.04) 0%, transparent 70%)"
          >
            <StepNum $color="var(--accent)">03</StepNum>
            <StepIconWrap $bg="rgba(245,200,66,0.1)" $border="rgba(245,200,66,0.2)">
              🤝
            </StepIconWrap>
            <StepTitle>Sicher tauschen</StepTitle>
            <StepDesc>
              Token-Sicherung, Tracking-Upload und Reputationssystem sorgen dafür, dass jeder Tausch fair und nachvollziehbar abläuft.
            </StepDesc>
          </StepCard>
        </StepsGrid>
      </Section>

      {/* ─── SOCIAL PROOF ─── */}
      <ProofSection ref={proofRef}>
        <ProofInner>
          <ProofBadge>
            <LiveDot />
            Live-Statistik für Deutschland
          </ProofBadge>

          <CounterDisplay>
            {counterStarted ? swapCount.toLocaleString('de-DE') : '0'}
          </CounterDisplay>

          <CounterLabel>
            erfolgreiche Tausche in Deutschland.<br />
            Jeden Tag werden es <strong>mehr</strong>.
          </CounterLabel>

          <ProofGrid>
            <ProofCard>
              <ProofCardTop>
                <Avatar $bg="rgba(74,222,174,0.12)">🧒</Avatar>
                <div>
                  <AvatarName>Tim, 12</AvatarName>
                  <AvatarSub>Hamburg · WM 2026</AvatarSub>
                </div>
              </ProofCardTop>
              <ProofCardText>
                "In 3 Tagen hatte ich endlich alle fehlenden Sticker! Das war früher unmöglich."
              </ProofCardText>
            </ProofCard>

            <ProofCard>
              <ProofCardTop>
                <Avatar $bg="rgba(124,111,205,0.12)">👨</Avatar>
                <div>
                  <AvatarName>Marco, 34</AvatarName>
                  <AvatarSub>München · Bundesliga</AvatarSub>
                </div>
              </ProofCardTop>
              <ProofCardText>
                "Meine Doppelten lagen jahrelang rum. Jetzt tausche ich sie gegen genau das, was mir fehlt."
              </ProofCardText>
            </ProofCard>

            <ProofCard>
              <ProofCardTop>
                <Avatar $bg="rgba(245,200,66,0.12)">👩</Avatar>
                <div>
                  <AvatarName>Jana, 28</AvatarName>
                  <AvatarSub>Berlin · Champions League</AvatarSub>
                </div>
              </ProofCardTop>
              <ProofCardText>
                "Das Matching ist genial. Ich musste nichts suchen — die richtigen Tauschpartner kamen zu mir."
              </ProofCardText>
            </ProofCard>
          </ProofGrid>
        </ProofInner>
      </ProofSection>

      {/* ─── FINAL CTA ─── */}
      <CtaSection>
        <CtaTitle>
          <span>Dein Album</span><br />
          <span className="gold">wartet auf dich.</span>
        </CtaTitle>
        <CtaSub>Kostenlos registrieren. Sofort loslegen.</CtaSub>
        <BtnCtaLarge onClick={goToLogin}>
          🚀 Jetzt kostenlos starten
        </BtnCtaLarge>
        <CtaNote>Kein Abo. Keine Kreditkarte. Für immer kostenlos nutzbar.</CtaNote>
      </CtaSection>

      {/* ─── FOOTER ─── */}
      <Footer>
        <FooterLogo>STICKER<span>SWAP</span><em>.</em></FooterLogo>
        <FooterLinks>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="/agb">AGB</a>
          <a href="mailto:hallo@stickerswap.de">Kontakt</a>
        </FooterLinks>
      </Footer>
    </Page>
  );
}
