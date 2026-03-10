import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

import { theme }     from './theme/theme';
import GlobalStyles  from './theme/GlobalStyles';
import BottomNav     from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';

// ============================================================
// App.js — Root Component
// Semantisch: <body> → <div#root> → AppWrapper (kein extra div)
// Layout: <header> (TopBar, bereits semantisch) +
//         <main> (renderPage) + <nav> (BottomNav)
// ============================================================

// <body> trägt min-height via GlobalStyles.
// AppWrapper ist das direkte Kind von #root — kein semantischer
// Wrapper nötig, aber wir brauchen overflow-x: hidden hier.
const AppWrapper = styled.div`
  min-height: 100vh;
  /* dvh = dynamic viewport height — korrekt auf iOS Safari
     wenn die Adressleiste ein- und ausblendet              */
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.bg};
  /* PRINZIP 4: kein horizontales Scrollen */
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: rgba(10,10,15,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Safe Area für iPhone Notch */
  padding-top: calc(12px + env(safe-area-inset-top, 0px));
`;

// <span> statt <div>: Logo ist kein Inhaltsblock, sondern ein Label im <header>
const Logo = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 26px;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accent};
  /* Kein display:block nötig — steht in flex-header */
  em { font-style: normal; color: ${({ theme }) => theme.colors.accent2}; }
`;

// <output> ist das korrekte semantische Element für berechnete Werte (Token-Guthaben)
const TokenBadge = styled.output`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accent};
  background: rgba(245,200,66,0.1);
  border: 1px solid rgba(245,200,66,0.2);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
`;

// <main> erhält flex: 1 damit sie den Platz zwischen TopBar + BottomNav füllt
const PageMain = styled.main`
  flex: 1;
  /* Kein overflow-hidden hier — jede Page steuert ihren Scroll selbst */
`;

const NAV_ITEMS = [
  { icon: '📊', label: 'Home' },
  { icon: '📖', label: 'Album' },
  { icon: '🔄', label: 'Tauschen', badge: '3' },
  { icon: '👤', label: 'Profil' },
];

// Page placeholder — semantisch: <section> mit <h2> + <p>
const PlaceholderPage = ({ label }) => (
  <section style={{ padding: '32px 16px', textAlign: 'center', color: '#6b6b8a' }}
           aria-label={label}>
    <p style={{ fontSize: 48, margin: '0 0 16px' }} aria-hidden="true">🚧</p>
    <h2 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28,
                 letterSpacing: '0.06em', margin: '0 0 8px', color: '#f0f0f5' }}>
      {label}
    </h2>
    <p style={{ fontSize: 14, margin: 0 }}>
      Wird in einem späteren Kapitel implementiert.
    </p>
  </section>
);

function App() {
  const [activeNav, setActiveNav] = useState(0);

  const renderPage = () => {
    switch (activeNav) {
      case 0:  return <DashboardPage />;
      case 1:  return <PlaceholderPage label="Mein Album" />;
      case 2:  return <PlaceholderPage label="Tauschbörse" />;
      case 3:  return <PlaceholderPage label="Profil" />;
      default: return <DashboardPage />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AppWrapper>
        {/* <header> ist bereits semantisch — TopBar aus Kapitel 0 */}
        <TopBar>
          {/* <h1>: App-Name ist die einzige H1 der gesamten App */}
          <h1 style={{ margin: 0, lineHeight: 1 }}>
            <Logo>Sticker<em>Swap</em></Logo>
          </h1>
          <TokenBadge aria-label="Token-Guthaben">⭐ 127 Token</TokenBadge>
        </TopBar>

        {/* <main>: Einziger main-Bereich der App — React-Router tauscht Inhalt */}
        <PageMain id="main-content">
          {renderPage()}
        </PageMain>

        {/* <nav> ist bereits in BottomNav semantisch */}
        <BottomNav
          items={NAV_ITEMS}
          activeIndex={activeNav}
          onSelect={setActiveNav}
        />
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
