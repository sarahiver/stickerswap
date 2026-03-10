import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

import { theme }    from './theme/theme';
import GlobalStyles from './theme/GlobalStyles';
import BottomNav    from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';

// ============================================================
// App.js — Root Component
// Hier leben: ThemeProvider, GlobalStyles, Navigation
// ============================================================

const AppWrapper = styled.div`
  min-height: 100vh;
  /* dvh = dynamic viewport height — korrekt auf iOS Safari
     wenn die Adressleiste ein- und ausblendet              */
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.bg};
  /* PRINZIP 4: kein horizontales Scrollen */
  overflow-x: hidden;
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

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 26px;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accent};
  span { color: ${({ theme }) => theme.colors.accent2}; }
`;

const TokenBadge = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.accent};
  background: rgba(245,200,66,0.1);
  border: 1px solid rgba(245,200,66,0.2);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
`;

const NAV_ITEMS = [
  { icon: '📊', label: 'Home' },
  { icon: '📖', label: 'Album' },
  { icon: '🔄', label: 'Tauschen', badge: '3' },
  { icon: '👤', label: 'Profil' },
];

// Page placeholder — wird in späteren Kapiteln ausgebaut
const PlaceholderPage = ({ label }) => (
  <div style={{ padding: '32px 16px', textAlign: 'center', color: '#6b6b8a' }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
    <div style={{ fontFamily: "'Bebas Neue',cursive", fontSize: 28, letterSpacing: '0.06em' }}>
      {label}
    </div>
    <div style={{ fontSize: 14, marginTop: 8 }}>
      Wird in einem späteren Kapitel implementiert.
    </div>
  </div>
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
        <TopBar>
          <Logo>Sticker<span>Swap</span></Logo>
          <TokenBadge>⭐ 127 Token</TokenBadge>
        </TopBar>

        {renderPage()}

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
