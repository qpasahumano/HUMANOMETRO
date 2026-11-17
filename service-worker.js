/* HUMANÓMETRO — caché de recursos estáticos; HTML y JS siempre se revalidan. */
const CACHE_NAME = "humanometro-v1-cache-20261117";
const ASSETS_TO_CACHE = [
  "./style.css",
  "./manifest.json",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    await Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
  }));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("humanometro-v1-cache") && key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  const url = new URL(event.request.url);
  if (event.request.mode === "navigate" || /\.(?:js|html)$/i.test(url.pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
