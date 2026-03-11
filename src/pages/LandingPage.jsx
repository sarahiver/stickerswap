import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import LanguageSwitcher from '../components/LanguageSwitcher';

/* ─── ANIMATIONS ─── */
const fadeUp  = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const float   = keyframes`0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-12px) rotate(1deg)}`;
const float2  = keyframes`0%,100%{transform:translateY(0) rotate(2deg)}50%{transform:translateY(-16px) rotate(-1deg)}`;
const glowCta = keyframes`0%,100%{box-shadow:0 0 20px rgba(245,200,66,0.2),0 4px 24px rgba(0,0,0,.4)}50%{box-shadow:0 0 48px rgba(245,200,66,.5),0 4px 24px rgba(0,0,0,.4)}`;

/* ─── NAV ─── */
const Nav = styled.nav`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; height: 64px;
  background: rgba(10,10,15,0.95); border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px);
  gap: 12px;
`;
const Logo = styled.div`
  font-family: var(--font-display); font-size: 28px;
  letter-spacing: 0.08em; color: var(--accent); cursor: pointer; flex-shrink: 0;
  span { color: var(--accent2); }
`;
const NavLinks = styled.div`display:flex;align-items:center;gap:8px;flex-wrap:wrap;`;

/* ─── HERO ─── */
const HeroSection = styled.section`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 32px; text-align: center;
  position: relative; overflow: hidden; min-height: calc(100vh - 64px);
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
    repeating-linear-gradient(0deg,var(--accent) 0px,transparent 1px,transparent 60px,var(--accent) 61px),
    repeating-linear-gradient(90deg,var(--accent) 0px,transparent 1px,transparent 60px,var(--accent) 61px);
`;
const Eyebrow = styled.div`
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--accent3); padding: 6px 16px;
  border: 1px solid rgba(74,222,174,0.3); border-radius: 100px;
  background: rgba(74,222,174,0.05); position: relative; z-index: 1;
  margin-bottom: 20px; display: inline-block;
  animation: ${fadeUp} 0.6s ease both 0.1s;
`;
const HeroTitle = styled.h1`
  font-size: clamp(64px, 11vw, 130px); line-height: 0.92; letter-spacing: 0.02em;
  position: relative; z-index: 1; margin-bottom: 24px;
  animation: ${fadeUp} 0.6s ease both 0.2s;
  .line2 { color: var(--accent); display: block; }
`;
const HeroSub = styled.p`
  font-size: 18px; color: var(--muted); max-width: 520px; line-height: 1.6;
  position: relative; z-index: 1; margin-bottom: 40px;
  animation: ${fadeUp} 0.6s ease both 0.3s;
`;
const HeroActions = styled.div`
  display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  position: relative; z-index: 1; animation: ${fadeUp} 0.6s ease both 0.4s;
`;
const BtnCta = styled.button`
  padding: 14px 28px; font-size: 16px; font-weight: 700;
  background: var(--accent); color: #0a0a0f; border-radius: var(--radius-sm); border: none;
  cursor: pointer; animation: ${glowCta} 3s ease-in-out infinite;
  transition: transform 0.2s, filter 0.2s;
  &:hover { transform: translateY(-2px); filter: brightness(1.08); }
`;

/* ─── FLOATING CARDS ─── */
const FloatRow = styled.div`
  display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
  margin-top: 56px; position: relative; z-index: 1;
  animation: ${fadeUp} 0.7s ease both 0.5s;
`;
const FloatCard = styled.div`
  background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
  padding: 16px 20px; min-width: 150px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset;
  animation: ${p => p.$f2 ? float2 : float} ${p => p.$dur || '4s'} ease-in-out infinite;
  animation-delay: ${p => p.$del || '0s'};
`;
const CardLabel = styled.div`font-family:var(--font-mono);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;`;
const ChipRow = styled.div`display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;`;
const Chip = styled.span`
  padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono);
  font-size: 11px; font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;
  &.have   { background:rgba(74,222,174,.1); border:1px solid rgba(74,222,174,.25); color:var(--accent3); }
  &.double { background:rgba(245,200,66,.1); border:1px solid rgba(245,200,66,.25); color:var(--accent); }
  &.need   { background:rgba(124,111,205,.1);border:1px solid rgba(124,111,205,.25);color:var(--accent4); }
`;

/* ─── STATS ─── */
const StatsRow = styled.div`
  display: flex; gap: 48px; margin-top: 64px; position: relative; z-index: 1;
  animation: ${fadeUp} 0.6s ease both 0.6s;
  @media(max-width:480px){gap:24px;}
`;
const Stat = styled.div`text-align:center;`;
const StatNum = styled.span`font-family:var(--font-display);font-size:42px;color:var(--accent);display:block;line-height:1;`;
const StatLabel = styled.div`font-size:13px;color:var(--muted);margin-top:4px;`;

/* ─── SECTIONS ─── */
const SectionWrap = styled.section`padding:80px 32px;max-width:1200px;margin:0 auto;width:100%;`;
const SectionTitle = styled.div`font-family:var(--font-display);font-size:52px;letter-spacing:.04em;margin-bottom:8px;`;
const SectionSub = styled.p`color:var(--muted);margin-bottom:48px;font-size:16px;`;

/* ─── FEATURES ─── */
const FeaturesGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;
`;
const FeatureCard = styled.div`
  background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;
  transition:all .3s;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;inset:0;opacity:0;background:linear-gradient(135deg,rgba(245,200,66,.05),transparent);transition:opacity .3s;}
  &:hover{border-color:rgba(245,200,66,.35);transform:translateY(-2px);}
  &:hover::before{opacity:1;}
`;
const FeatureIcon = styled.div`width:48px;height:48px;background:var(--surface2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:16px;`;

/* ─── TRUST ─── */
const TrustBox = styled.div`
  background:linear-gradient(135deg,rgba(74,222,174,.05),var(--bg));
  border:1px solid rgba(74,222,174,.2);border-radius:16px;padding:32px;
`;
const TrustGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-top:24px;`;

/* ─── PRICING ─── */
const MonoSection = styled.section`
  background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:80px 32px;
`;
const PricingGrid = styled.div`
  display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:20px;max-width:1000px;margin:0 auto 48px;
`;
const PricingCard = styled.div`
  background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:32px;
  transition:all .3s;position:relative;
  &:hover{transform:translateY(-2px);border-color:rgba(245,200,66,.2);}
  &.featured{border-color:var(--accent);background:linear-gradient(135deg,rgba(245,200,66,.07),var(--bg));}
  &.featured::after{
    content:attr(data-popular);
    position:absolute;top:-12px;left:50%;transform:translateX(-50%);
    background:var(--accent);color:var(--bg);
    font-family:var(--font-mono);font-size:10px;font-weight:700;
    padding:4px 14px;border-radius:100px;letter-spacing:.1em;
  }
`;
const PricingName = styled.h3`font-family:var(--font-display);font-size:24px;letter-spacing:.06em;margin-bottom:8px;`;
const Price = styled.div`font-size:38px;font-weight:700;color:var(--accent);line-height:1;margin-bottom:12px;span{font-size:16px;color:var(--muted);font-weight:400;}`;
const PricingList = styled.ul`list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:24px;
  li{font-size:13px;display:flex;align-items:center;gap:8px;line-height:1.4;&::before{content:'✓';color:var(--accent3);font-weight:700;flex-shrink:0;}}
  li.off{opacity:.3;text-decoration:line-through;&::before{content:'✕';color:var(--muted);}}
`;

/* ─── REVENUE ─── */
const RevenueGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:24px;`;
const RevenueCard = styled.div`
  background:linear-gradient(135deg,rgba(245,200,66,.1),var(--surface));
  border:1px solid rgba(245,200,66,.3);border-radius:16px;padding:24px;
  display:flex;align-items:center;gap:20px;transition:transform .2s;
  &:hover{transform:translateY(-2px);}
`;

/* ─── CONCEPT ─── */
const ConceptSection = styled.section`padding:80px 32px;max-width:1000px;margin:0 auto;`;
const ConceptRow = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;
  @media(max-width:700px){grid-template-columns:1fr;}
`;
const ConceptCard = styled.div`
  background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;
  h3{font-family:var(--font-display);font-size:22px;letter-spacing:.05em;margin-bottom:16px;display:flex;align-items:center;gap:10px;}
  ul{list-style:none;display:flex;flex-direction:column;gap:8px;}
  li{font-size:14px;color:var(--muted);display:flex;gap:8px;line-height:1.5;
    &::before{content:'→';color:var(--accent);flex-shrink:0;font-weight:700;}
    strong{color:var(--text2);}
  }
`;

/* ─── CTA + FOOTER ─── */
const CtaSection = styled.section`
  text-align:center;padding:80px 32px;position:relative;overflow:hidden;
  &::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    width:600px;height:300px;background:radial-gradient(ellipse,rgba(245,200,66,.06) 0%,transparent 70%);pointer-events:none;}
`;
const Footer = styled.footer`
  border-top:1px solid var(--border);padding:32px;text-align:center;color:var(--muted);font-size:13px;
`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('landing');

  const goLogin    = () => navigate('/login');
  const goRegister = () => navigate('/login');

  const f = t;  // shorthand

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>

      {/* ─── NAV ─── */}
      <Nav>
        <Logo>Sticker<span>Swap</span></Logo>
        <NavLinks>
          <LanguageSwitcher />
          <button className="btn btn-ghost" onClick={goLogin}>{f('nav.login')}</button>
          <button className="btn btn-primary" onClick={goRegister}>{f('nav.start')}</button>
        </NavLinks>
      </Nav>

      {/* ─── HERO ─── */}
      <HeroSection>
        <HeroBg /><GridBg />
        <Eyebrow>{f('hero.eyebrow')}</Eyebrow>
        <HeroTitle>
          {f('hero.line1')}
          <span className="line2">
            {f('hero.line2').split('\n').map((l, i) => (
              <React.Fragment key={i}>{l}{i === 0 && <br />}</React.Fragment>
            ))}
          </span>
        </HeroTitle>
        <HeroSub>{f('hero.sub')}</HeroSub>
        <HeroActions>
          <BtnCta onClick={goRegister}>{f('hero.cta')}</BtnCta>
          <button className="btn btn-secondary" onClick={goLogin}>{f('hero.demo')}</button>
        </HeroActions>

        {/* Floating Cards — labels immer DE/EN da Sticker-Nummern sind */}
        <FloatRow>
          <FloatCard $del="0s" $dur="4.2s">
            <CardLabel>WM 2026 · Gruppe A</CardLabel>
            <ChipRow><Chip className="double">2× #142</Chip><Chip className="double">3× #89</Chip></ChipRow>
            <ChipRow><Chip className="need">#201</Chip><Chip className="need">#78</Chip></ChipRow>
          </FloatCard>
          <FloatCard $f2 $del="0.7s" $dur="5s">
            <CardLabel>Bundesliga 24/25</CardLabel>
            <ChipRow><Chip className="have">#44</Chip><Chip className="have">#98</Chip><Chip className="have">#3</Chip></ChipRow>
            <ChipRow><Chip className="need">#201</Chip></ChipRow>
          </FloatCard>
          <FloatCard $del="1.2s" $dur="3.9s">
            <CardLabel>Champions League</CardLabel>
            <ChipRow><Chip className="double">2× #17</Chip></ChipRow>
            <ChipRow><Chip className="need">#55</Chip><Chip className="need">#99</Chip></ChipRow>
          </FloatCard>
        </FloatRow>

        <StatsRow>
          <Stat><StatNum>48K</StatNum><StatLabel>{f('stats.users')}</StatLabel></Stat>
          <Stat><StatNum>312K</StatNum><StatLabel>{f('stats.swaps')}</StatLabel></Stat>
          <Stat><StatNum>96%</StatNum><StatLabel>{f('stats.satisfaction')}</StatLabel></Stat>
          <Stat><StatNum>18</StatNum><StatLabel>{f('stats.albums')}</StatLabel></Stat>
        </StatsRow>
      </HeroSection>

      {/* ─── FEATURES ─── */}
      <SectionWrap>
        <SectionTitle>{f('features.title')}</SectionTitle>
        <SectionSub>{f('features.sub')}</SectionSub>
        <FeaturesGrid>
          {f('features.items', { returnObjects: true }).map(item => (
            <FeatureCard key={item.title}>
              <FeatureIcon>{item.icon}</FeatureIcon>
              <h3 style={{ fontFamily:'var(--font-body)', fontSize:17, fontWeight:600, marginBottom:8 }}>{item.title}</h3>
              <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.6 }}>{item.desc}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </SectionWrap>

      {/* ─── TRUST ─── */}
      <SectionWrap style={{ paddingTop:0 }}>
        <TrustBox>
          <SectionTitle style={{ fontSize:42 }}>{f('trust.title')}</SectionTitle>
          <p style={{ color:'var(--muted)', fontSize:14 }}>{f('trust.sub')}</p>
          <TrustGrid>
            {f('trust.items', { returnObjects: true }).map(item => (
              <div key={item.title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ fontSize:24, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontSize:14, fontWeight:600, marginBottom:4, fontFamily:'var(--font-body)' }}>{item.title}</h4>
                  <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </TrustGrid>
        </TrustBox>
      </SectionWrap>

      {/* ─── PRICING ─── */}
      <MonoSection>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <SectionTitle>{f('pricing.title')}</SectionTitle>
          <SectionSub>{f('pricing.sub')}</SectionSub>

          <PricingGrid>
            {f('pricing.plans', { returnObjects: true }).map(plan => (
              <PricingCard
                key={plan.name}
                className={plan.featured ? 'featured' : ''}
                data-popular={f('pricing.popular')}
              >
                <PricingName>{plan.name}</PricingName>
                <Price>{plan.price} <span>{plan.per}</span></Price>
                <p style={{ fontSize:13, color:'var(--muted)', marginBottom:20, lineHeight:1.5 }}>{plan.desc}</p>
                <PricingList>
                  {plan.features.map(feat => <li key={feat}>{feat}</li>)}
                  {plan.disabled.map(feat => <li key={feat} className="off">{feat}</li>)}
                </PricingList>
                <button
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width:'100%' }}
                  onClick={goRegister}
                >
                  {plan.cta}
                </button>
              </PricingCard>
            ))}
          </PricingGrid>

          {/* Revenue */}
          <SectionTitle style={{ fontSize:36 }}>{f('pricing.revenue.title')}</SectionTitle>
          <RevenueGrid>
            {f('pricing.revenue.items', { returnObjects: true }).map(r => (
              <RevenueCard key={r.title}>
                <div style={{ fontSize:36, flexShrink:0 }}>{r.icon}</div>
                <div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontSize:24, color:'var(--accent)', marginBottom:4 }}>{r.title}</h3>
                  <p style={{ fontSize:13, color:'var(--muted)' }}>{r.desc}</p>
                </div>
              </RevenueCard>
            ))}
          </RevenueGrid>
        </div>
      </MonoSection>

      {/* ─── CONCEPT ─── */}
      <ConceptSection>
        <SectionTitle>{f('concept.title')}</SectionTitle>
        <SectionSub>{f('concept.sub')}</SectionSub>
        <ConceptRow>
          {f('concept.cards', { returnObjects: true }).map(card => (
            <ConceptCard key={card.title}>
              <h3>{card.icon} {card.title}</h3>
              <ul>
                {card.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ))}
              </ul>
            </ConceptCard>
          ))}
        </ConceptRow>
      </ConceptSection>

      {/* ─── CTA ─── */}
      <CtaSection>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(52px,9vw,100px)', marginBottom:16, position:'relative', zIndex:1 }}>
          {f('cta.line1')}<br /><span style={{ color:'var(--accent)' }}>{f('cta.line2')}</span>
        </h2>
        <p style={{ color:'var(--muted)', fontSize:17, marginBottom:36, position:'relative', zIndex:1 }}>{f('cta.sub')}</p>
        <BtnCta onClick={goRegister} style={{ position:'relative', zIndex:1, fontSize:17, padding:'16px 44px' }}>
          {f('cta.btn')}
        </BtnCta>
        <p style={{ color:'var(--muted)', fontSize:13, marginTop:14, position:'relative', zIndex:1 }}>{f('cta.fine')}</p>
      </CtaSection>

      {/* ─── FOOTER ─── */}
      <Footer>
        {f('footer.copy')}
        {' · '}<a href="/impressum" style={{ color:'var(--muted)' }}>{f('footer.impressum')}</a>
        {' · '}<a href="/datenschutz" style={{ color:'var(--muted)' }}>{f('footer.privacy')}</a>
        {' · '}<a href="/agb" style={{ color:'var(--muted)' }}>{f('footer.terms')}</a>
      </Footer>
    </div>
  );
}
