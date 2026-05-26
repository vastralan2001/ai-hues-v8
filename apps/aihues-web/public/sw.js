// The previous static demo registered a root-scoped service worker that cached
// legacy HTML pages. The Next.js app must render fresh catalog data, so this
// replacement clears old caches and unregisters itself.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) =>
        Promise.all(clients.map((client) => client.navigate(client.url)))
      )
  );
});
