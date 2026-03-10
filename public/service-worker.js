// public/service-worker.js
// StickerSwap PWA Service Worker — Kapitel 7
// Strategie:
//   - Static Assets (JS/CSS/Fonts): Cache First (lang)
//   - Bilder (Cloudinary): Cache First mit 7-Tage-Limit
//   - API-Requests (Supabase): Network First mit Offline-Fallback
//   - HTML (SPA): Network First, Fallback auf /index.html

const CACHE_VERSION    = 'v1';
const STATIC_CACHE     = `stickerswap-static-${CACHE_VERSION}`;
const IMAGE_CACHE      = `stickerswap-images-${CACHE_VERSION}`;
const API_CACHE        = `stickerswap-api-${CACHE_VERSION}`;

const IMAGE_CACHE_MAX  = 200;   // max Bilder im Cache
const IMAGE_CACHE_DAYS = 7;     // Bilder nach 7 Tagen veraltet

// Statische Assets die beim Install gecacht werden
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ─── Install: Precache statische Assets ───────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching static assets');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: Alte Caches löschen ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const validCaches = [STATIC_CACHE, IMAGE_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !validCaches.includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: Routing-Strategien ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // POST/PUT/DELETE → niemals cachen
  if (request.method !== 'GET') return;

  // Chrome Extensions ignorieren
  if (url.protocol === 'chrome-extension:') return;

  // ── Supabase API: Network First → API Cache Fallback ──────────────────────
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirstWithFallback(request, API_CACHE, 3000));
    return;
  }

  // ── Cloudinary Bilder: Cache First (7 Tage) ───────────────────────────────
  if (url.hostname.includes('cloudinary.com') || url.hostname.includes('res.cloudinary.com')) {
    event.respondWith(cacheFirstWithExpiry(request, IMAGE_CACHE, IMAGE_CACHE_DAYS));
    return;
  }

  // ── Statische Assets (JS/CSS/Fonts/Icons): Cache First ────────────────────
  if (
    request.destination === 'script'   ||
    request.destination === 'style'    ||
    request.destination === 'font'     ||
    request.destination === 'image'    ||
    url.pathname.startsWith('/static/') ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(cacheFirstWithNetworkFallback(request, STATIC_CACHE));
    return;
  }

  // ── HTML / SPA Navigation: Network First → index.html Fallback ───────────
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(spaNavigationHandler(request));
    return;
  }

  // ── Alles andere: Network mit Cache Fallback ──────────────────────────────
  event.respondWith(networkFirstWithFallback(request, STATIC_CACHE, 5000));
});

// ─── Strategien ───────────────────────────────────────────────────────────────

// Cache First: erst Cache prüfen, dann Netzwerk (für statische Assets)
async function cacheFirstWithNetworkFallback(request, cacheName) {
  const cache    = await caches.open(cacheName);
  const cached   = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Cache First mit Ablaufzeit (für Bilder)
async function cacheFirstWithExpiry(request, cacheName, maxAgeDays) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    const cachedDate = cached.headers.get('sw-cached-at');
    if (cachedDate) {
      const ageMs  = Date.now() - new Date(cachedDate).getTime();
      const maxMs  = maxAgeDays * 24 * 60 * 60 * 1000;
      if (ageMs < maxMs) return cached;
    } else {
      return cached; // kein Datum → trotzdem nutzen
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Response klonen und sw-cached-at Header hinzufügen
      const headers  = new Headers(response.headers);
      headers.set('sw-cached-at', new Date().toISOString());
      const modified = new Response(await response.blob(), {
        status:     response.status,
        statusText: response.statusText,
        headers,
      });
      await limitCacheSize(cache, IMAGE_CACHE_MAX);
      cache.put(request, modified);
      return modified;
    }
    return response;
  } catch {
    return cached ?? new Response('Image offline', { status: 503 });
  }
}

// Network First mit Timeout (für API-Calls)
async function networkFirstWithFallback(request, cacheName, timeoutMs = 5000) {
  const cache = await caches.open(cacheName);

  const networkPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), timeoutMs)
  );

  try {
    return await Promise.race([networkPromise, timeoutPromise]);
  } catch {
    const cached = await cache.match(request);
    return cached ?? new Response(
      JSON.stringify({ error: 'offline', cached: false }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// SPA Navigation: Network First → /index.html Fallback
async function spaNavigationHandler(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Offline → immer index.html zurückgeben (React Router übernimmt)
    const cache  = await caches.open(STATIC_CACHE);
    const cached = await cache.match('/index.html');
    return cached ?? await cache.match('/offline.html')
      ?? new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
  }
}

// Cache-Größe begrenzen (älteste Einträge löschen)
async function limitCacheSize(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length >= maxItems) {
    await cache.delete(keys[0]);
  }
}

// ─── Push Notifications (vorbereitet für spätere Aktivierung) ─────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'StickerSwap', {
      body:    data.body ?? '',
      icon:    '/icons/icon-192x192.png',
      badge:   '/icons/icon-72x72.png',
      tag:     data.tag ?? 'stickerswap',
      data:    { url: data.url ?? '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(url));
});
