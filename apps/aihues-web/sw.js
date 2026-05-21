/**
 * AIHues Service Worker - Offline Support
 * Cache-first strategy for tools and games
 */

const CACHE_NAME = 'aihues-v6-5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/tools.html',
  '/login.html',
  '/wishlist.html',
  '/ranking.html',
  '/js/i18n.js',
  '/manifest.json',
  '/robots.txt',
];

// Tool pages to cache
const TOOL_PAGES = [
  '/tools/jwt.html',
  '/tools/json.html',
  '/tools/regex.html',
  '/tools/uuid.html',
  '/tools/timestamp.html',
  '/tools/markdown.html',
  '/tools/qrcode.html',
  '/tools/sha256.html',
  '/tools/fullwidth.html',
  '/tools/chi-squared.html',
  '/tools/url-encode.html',
  '/tools/base-convert.html',
  '/tools/password-gen.html',
  '/tools/title-case.html',
  '/tools/http-status.html',
  '/tools/html-entity.html',
  '/tools/pomodoro.html',
  '/tools/cron-parser.html',
  '/tools/sql.html',
  '/tools/word-count.html',
  '/tools/base64.html',
  '/tools/diff.html',
  '/tools/x-post.html',
  '/tools/seo-title.html',
  '/tools/image-to-base64.html',
  '/tools/css-gradient.html',
  '/tools/color-convert.html',
  '/tools/csv-json.html',
  '/tools/ip-lookup.html',
  '/tools/curl-gen.html',
  '/tools/lorem-ipsum.html',
  '/tools/diff-pro.html',
  '/tools/unit-convert.html',
];

const GAME_PAGES = [
  '/games/daily-luck.html',
  '/games/slot-machine.html',
  '/games/basketball.html',
];

const ALL_CACHE_URLS = [...STATIC_ASSETS, ...TOOL_PAGES, ...GAME_PAGES];

// Install: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ALL_CACHE_URLS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external API calls (let them go to network)
  if (request.url.startsWith('http') && !request.url.includes(self.location.host)) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cached) => {
      // Return cached version if found
      if (cached) {
        // Refresh cache in background
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
          }
        }).catch(() => {}); // Ignore network errors
        return cached;
      }
      
      // Fetch from network
      return fetch(request).then((response) => {
        if (!response.ok) return response;
        
        // Cache new responses
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      }).catch(() => {
        // Offline fallback
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline - Content not cached', { status: 503 });
      });
    })
  );
});
