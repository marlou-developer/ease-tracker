self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});

// CRITICAL FOR ANDROID PWA: Must have a fetch handler
self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
});
