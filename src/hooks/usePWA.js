// src/hooks/usePWA.js
// Kapitel 7 — Service Worker Registrierung + Add to Homescreen Prompt
// iOS: eigene Anleitung (kein beforeinstallprompt Support)

import { useState, useEffect, useCallback } from 'react';

const usePWA = () => {
  const [installPrompt,    setInstallPrompt]    = useState(null);  // Android/Chrome
  const [isInstalled,      setIsInstalled]      = useState(false);
  const [isIOS,            setIsIOS]            = useState(false);
  const [swUpdateAvailable,setSwUpdateAvailable] = useState(false);
  const [swRegistration,   setSwRegistration]   = useState(null);

  // ── Service Worker registrieren ───────────────────────────────────────────
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // CRA registriert eigenen SW — wir nutzen unseren Custom SW
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);
        setSwRegistration(registration);

        // Update-Check beim Laden
        registration.update();

        // Neuer SW wartet → Update verfügbar
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] Update available');
              setSwUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => console.error('[PWA] SW registration failed:', err));

    // Nach SW-Update: Seite neu laden
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  // ── iOS Detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    const ua     = navigator.userAgent;
    const isIos  = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
    // iOS in Safari und noch nicht installiert
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || ('standalone' in navigator && navigator.standalone);
    setIsIOS(isIos && isSafari && !standalone);
  }, []);

  // ── Android/Chrome: beforeinstallprompt ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Bereits installiert?
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      setIsInstalled(e.matches);
    });
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ── Install-Prompt auslösen (Android) ─────────────────────────────────────
  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      setIsInstalled(true);
    }
    return outcome === 'accepted';
  }, [installPrompt]);

  // ── SW Update anwenden ────────────────────────────────────────────────────
  const applyUpdate = useCallback(() => {
    swRegistration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  }, [swRegistration]);

  return {
    canInstall:       !!installPrompt && !isInstalled,
    isIOS,            // iOS: zeige manuelle Anleitung
    isInstalled,
    promptInstall,
    swUpdateAvailable,
    applyUpdate,
  };
};

export default usePWA;
