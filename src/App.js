// src/App.js
// Kapitel 8 — Haupt-App: Router, Auth, PrivateRoutes, Notifications

import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import GlobalStyles from './lib/GlobalStyles';
import { ToastProvider } from './hooks/useToast';
import useAuth from './hooks/useAuth';
import useNotifications from './hooks/useNotifications';
import usePWA from './hooks/usePWA';
import AppShell from './components/AppShell';
import InstallBanner from './components/InstallBanner';
import { SuspenseWrapper } from './components/StickerSkeleton';

// Lazy-loaded pages
const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const AlbumLibrary    = lazy(() => import('./pages/AlbumLibrary'));
const AlbumPage       = lazy(() => import('./pages/AlbumPage'));
const MatchPage       = lazy(() => import('./pages/MatchPage'));
const SwapDetailView  = lazy(() => import('./components/SwapDetailView'));
const WalletPage      = lazy(() => import('./pages/WalletPage'));
const SettingsPage    = lazy(() => import('./pages/SettingsPage'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));

// ─── Private Route ────────────────────────────────────────────────────────────
const PrivateRoute = ({ user, loading, children }) => {
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

// ─── Inner App (braucht Router-Context) ──────────────────────────────────────
const InnerApp = () => {
  const { user, profile, loading, signOut, reloadProfile } = useAuth();
  const { swUpdateAvailable, applyUpdate } = usePWA();
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  // Aktiver Swap für Notification-Deduplication
  const activeSwapId = location.pathname.startsWith('/swap/')
    ? location.pathname.split('/swap/')[1]
    : null;

  // Globale Realtime-Benachrichtigungen
  useNotifications({
    userId: user?.id,
    activeSwapId,
    onSwapUpdate: () => {},
    onNewMessage: () => setUnreadCount(c => c + 1),
  });

  // SW Update Banner
  if (swUpdateAvailable) {
    return (
      <div style={{ position:'fixed',inset:0,background:'#0f0f1a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:24,zIndex:9999 }}>
        <p style={{ color:'#fff',fontSize:16,fontWeight:700,textAlign:'center' }}>
          🚀 Update verfügbar!
        </p>
        <button
          onClick={applyUpdate}
          style={{ background:'#7c6fcd',color:'#fff',border:'none',borderRadius:12,padding:'13px 28px',fontSize:15,fontWeight:800,cursor:'pointer' }}
        >
          Jetzt aktualisieren
        </button>
      </div>
    );
  }

  const lang = profile?.language ?? i18n.language?.slice(0,2) ?? 'de';

  const privateProps = { user, profile };

  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            user && !loading
              ? <Navigate to="/" replace />
              : <SuspenseWrapper><LoginPage /></SuspenseWrapper>
          }
        />

        {/* Private: AppShell mit Tab-Bar */}
        <Route
          element={
            <PrivateRoute user={user} loading={loading}>
              <AppShell unreadCount={unreadCount} />
            </PrivateRoute>
          }
        >
          <Route index element={
            <SuspenseWrapper>
              <DashboardPage {...privateProps} />
            </SuspenseWrapper>
          } />
          <Route path="albums" element={
            <SuspenseWrapper>
              <AlbumLibrary userId={user?.id} language={lang} />
            </SuspenseWrapper>
          } />
          <Route path="album/:id" element={
            <SuspenseWrapper>
              <AlbumPage userId={user?.id} />
            </SuspenseWrapper>
          } />
          <Route path="matches" element={
            <SuspenseWrapper>
              <MatchPage albums={[]} currentUser={user} />
            </SuspenseWrapper>
          } />
          <Route path="swap/:id" element={
            <SuspenseWrapper>
              <SwapDetailView
                swapId={location.pathname.split('/swap/')[1]}
                currentUserId={user?.id}
                onBack={() => window.history.back()}
              />
            </SuspenseWrapper>
          } />
          <Route path="wallet" element={
            <SuspenseWrapper>
              <WalletPage currentUser={user} language={lang} />
            </SuspenseWrapper>
          } />
          <Route path="settings" element={
            <SuspenseWrapper>
              <SettingsPage
                {...privateProps}
                onSignOut={signOut}
                onProfileUpdated={reloadProfile}
              />
            </SuspenseWrapper>
          } />
        </Route>

        {/* 404 → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <InstallBanner />
    </>
  );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
const App = () => (
  <I18nextProvider i18n={i18n}>
    <ToastProvider>
      <GlobalStyles />
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </ToastProvider>
  </I18nextProvider>
);

export default App;
