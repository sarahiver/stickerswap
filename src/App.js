import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './lib/GlobalStyles';
import useAuth from './hooks/useAuth';

// Public
import LandingPage from './pages/LandingPage';
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Private (lazy)
const AppShell        = lazy(() => import('./components/AppShell'));
const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const AlbumLibrary    = lazy(() => import('./pages/AlbumLibrary'));
const AlbumPage       = lazy(() => import('./pages/AlbumPage'));
const MatchPage       = lazy(() => import('./pages/MatchPage'));
const SwapDetailView  = lazy(() => import('./components/SwapDetailView'));
const WalletPage      = lazy(() => import('./pages/WalletPage'));
const SettingsPage    = lazy(() => import('./pages/SettingsPage'));

/* ─── Route Guards ─────────────────────── */
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  // Already logged in → go to dashboard
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function FullPageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        letterSpacing: '0.06em',
        color: 'var(--accent)',
      }}>
        STICKER<span style={{ color: 'var(--accent2)' }}>SWAP</span>
      </div>
      <div style={{
        width: '40px',
        height: '3px',
        borderRadius: '2px',
        background: 'var(--surface3)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--accent)',
          animation: 'shimmer 1s linear infinite',
          backgroundSize: '200% 100%',
          backgroundImage: 'linear-gradient(90deg, transparent 25%, var(--accent) 50%, transparent 75%)',
        }} />
      </div>
    </div>
  );
}

/* ─── App ─────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />

      <Suspense fallback={<FullPageLoader />}>
        <Routes>

          {/* ── PUBLIC ── */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* ── PRIVATE (all inside AppShell) ── */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppShell>
                  <Routes>
                    <Route path="/dashboard"  element={<DashboardPage />} />
                    <Route path="/albums"     element={<AlbumLibrary />} />
                    <Route path="/album/:id"  element={<AlbumPage />} />
                    <Route path="/matches"    element={<MatchPage />} />
                    <Route path="/swap/:id"   element={<SwapDetailView />} />
                    <Route path="/wallet"     element={<WalletPage />} />
                    <Route path="/settings"   element={<SettingsPage />} />
                    {/* Catch-all for authenticated users */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppShell>
              </PrivateRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
