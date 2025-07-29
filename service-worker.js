const CACHE_NAME = 'ar-scanner-pro-cache-v1';
const LOCAL_ASSETS = [
  './',
  './index.html',
  './js/main.js',
  './css/styles.css',
  '/images/photo1753762115.jpg',
  '/images/icon.jpg',
  '/images/icon.jpg',
  './manifest.json',
  './js/firebase-config.js',
  './js/scanner-ar.js',
  './js/gallery.js',
  './js/share.js',
  './js/ui.js',
  './js/localization.js',
  './js/theme-manager.js',
  './locales/en.json',
  './locales/ar.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching local assets');
        return cache.addAll(LOCAL_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(err => {
            console.log('[Service Worker] Fetch failed:', err);
            // You could return a custom offline page here
          });
      })
  );
});