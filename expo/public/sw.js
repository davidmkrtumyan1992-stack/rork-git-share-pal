// SharePal Service Worker
const CACHE_NAME = 'sharepal-v1';

// On install — take control immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// On activate — remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — stale-while-revalidate for navigation, cache-first for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip Supabase API and external requests
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('rork.') ||
    url.protocol === 'chrome-extension:'
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response.ok && response.status < 400) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        // Return cached immediately if available, update in background
        return cached || networkFetch;
      })
    )
  );
});
