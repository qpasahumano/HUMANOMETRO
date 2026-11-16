/* HUMANÓMETRO — actualización de recursos sin borrar datos locales */
const CACHE_NAME = "humanometro-assets-2026-11-16";
const ASSETS_TO_CACHE = [
  "./", "./index.html", "./style.css", "./script.js",
  "./manifest.json", "./humanometro-v2/index.html",
  "./humanometro-v2/style.css", "./humanometro-v2/script.js"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    await Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
  }));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("humanometro-") && key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const fresh = await fetch(event.request);
      if (fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, fresh.clone());
      }
      return fresh;
    } catch {
      const cached = await caches.match(event.request);
      return cached || Response.error();
    }
  })());
});
