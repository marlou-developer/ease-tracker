// public/sw.js
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

// Mandatory fetch handler for PWA installability check
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});