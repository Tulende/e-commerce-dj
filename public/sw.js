// Service Worker for SoundRent PRO PWA
const CACHE_NAME = 'soundrent-pro-cache-v4';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

self.addEventListener('install', (event) => {
  // Langsung aktifkan SW baru tanpa menunggu tab ditutup
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  // Hapus semua cache versi lama seketika
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Hanya proses HTTP GET request
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. JANGAN PERNAH CACHE API / Payment Gateway (Midtrans, Cloudflare API)
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('midtrans.com') ||
    url.hostname.includes('cloudflare.com')
  ) {
    return;
  }

  // 2. NAVIGASI HTML (Utama: Network-First agar selalu dapat update tampilan terbaru)
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Hanya fallback ke cache jika benar-benar offline (tidak ada koneksi internet)
          return caches.match(event.request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // 3. Aset Statis (Vite assets dengan hash, gambar, font): Cache-First dengan Network Fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
