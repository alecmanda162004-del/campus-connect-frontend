// Campus-Connect Service Worker v3
// JS/CSS: never cached (always fresh)
// Images: cached for performance
// API: never cached

const CACHE_NAME = 'campus-connect-v3';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', async (event) => {
  // Delete ALL old caches on activate
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // NEVER cache: API calls, railway, supabase, cloudinary
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('railway.app') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('cloudinary') ||
    url.hostname.includes('render.com')
  ) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response('{"error":"Offline"}', {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // NEVER cache: JS and CSS files — always fetch fresh so deploys show immediately
  if (
    url.pathname.includes('/static/js/') ||
    url.pathname.includes('/static/css/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Images: cache-first for performance
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 404 }));
      })
    );
    return;
  }

  // Navigation: network-first, fallback to cached index
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  // Everything else: network-first
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});