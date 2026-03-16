import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './lib/GlobalStyles';
import useAuth from './hooks/useAuth';

// Public
import LandingPage from './pages/LandingPage';
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Private
const AppShell       = lazy(() => import('./components/AppShell'));
const DashboardPage  = lazy(() => import('./pages/DashboardPage'));
const AlbumLibrary   = lazy(() => import('./pages/AlbumLibrary'));
const AlbumPage      = lazy(() => import('./pages/AlbumPage'));
const MatchPage      = lazy(() => import('./pages/MatchPage'));
const SwapDetailView = lazy(() => import('./components/SwapDetailView'));
const WalletPage     = lazy(() => import('./pages/WalletPage'));
const SettingsPage   = lazy(() => import('./pages/SettingsPage'));

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function Loader() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 32,
        letterSpacing: '0.08em', color: 'var(--accent)',
      }}>
        Sticker<span style={{ color: 'var(--accent2)' }}>Swap</span>
      </div>
      <div style={{
        width: 48, height: 3, borderRadius: 2,
        background: 'var(--surface2)', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1s linear infinite',
        }} />
      </div>
    </div>
  );
}

// DashboardPage mit user+profile als Props
const DashboardWrapper = () => {
  const { user, profile } = useAuth();
  return <DashboardPage user={user} profile={profile} />;
};

// AlbumLibrary mit userId
const AlbumLibraryWrapper = () => {
  const { user } = useAuth();
  return <AlbumLibrary userId={user?.id} />;
};

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

          {/* PRIVATE — inside AppShell */}
          <Route path="/*" element={
            <PrivateRoute>
              <AppShell>
                <Routes>
                  <Route path="/dashboard"  element={<DashboardWrapper />} />
                  <Route path="/albums"     element={<AlbumLibraryWrapper />} />
                  <Route path="/album/:id"  element={<AlbumPage />} />
                  <Route path="/matches"    element={<MatchPage />} />
                  <Route path="/swap/:id"   element={<SwapDetailView />} />
                  <Route path="/wallet"     element={<WalletPage />} />
                  <Route path="/settings"   element={<SettingsPage />} />
                  <Route path="*"           element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AppShell>
            </PrivateRoute>
          } />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
