// src/components/AppShell.jsx
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

const Shell = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-bg);
`;

const PageArea = styled.main`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const BottomNav = styled.nav`
  flex-shrink: 0;
  background: rgba(15, 15, 26, 0.97);
  border-top: 1px solid var(--color-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding-bottom: var(--safe-bottom);
`;

const TabList = styled.ul`
  list-style: none;
  display: flex;
  height: var(--nav-height);
  [dir="rtl"] & { flex-direction: row-reverse; }
`;

const TabItem = styled.li`
  flex: 1;
  display: flex;
`;

const TabLink = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: var(--color-text-mute);
  transition: color 150ms;
  position: relative;
  min-height: 44px;

  &.active {
    color: var(--color-accent);
  }

  &.active::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%;
    height: 2px;
    background: var(--color-accent);
    border-radius: 0 0 2px 2px;
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: -2px;
    border-radius: 4px;
  }
`;

const TabIcon = styled.span`
  font-size: 22px;
  line-height: 1;
  ${TabLink}.active & { transform: scale(1.05); }
  transition: transform 150ms;
`;

const TabLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: calc(50% - 18px);
  [dir="rtl"] & { right: auto; left: calc(50% - 18px); }
  background: var(--color-danger);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  padding: 0 4px;
  pointer-events: none;
`;

// /dashboard statt / als Home-Tab
const TABS = [
  { to: '/dashboard', icon: '🏠', labelKey: 'nav.home'     },
  { to: '/albums',    icon: '📖', labelKey: 'nav.album'    },
  { to: '/matches',   icon: '🤝', labelKey: 'nav.matches'  },
  { to: '/wallet',    icon: '👛', labelKey: 'nav.wallet'   },
  { to: '/settings',  icon: '⚙️', labelKey: 'nav.settings' },
];

const AppShell = ({ children, unreadCount = 0 }) => {
  const { t } = useTranslation();

  return (
    <Shell>
      <PageArea>
        {/* children wenn direkt übergeben (aus App.js), sonst Outlet */}
        {children || <Outlet />}
      </PageArea>

      <BottomNav aria-label={t('nav.main', 'Hauptnavigation')}>
        <TabList>
          {TABS.map(tab => (
            <TabItem key={tab.to}>
              <TabLink
                to={tab.to}
                aria-label={t(tab.labelKey)}
              >
                <TabIcon aria-hidden="true">{tab.icon}</TabIcon>
                <TabLabel>{t(tab.labelKey)}</TabLabel>
                {tab.to === '/matches' && unreadCount > 0 && (
                  <Badge aria-label={`${unreadCount} neue Matches`}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </TabLink>
            </TabItem>
          ))}
        </TabList>
      </BottomNav>
    </Shell>
  );
};

export default AppShell;
