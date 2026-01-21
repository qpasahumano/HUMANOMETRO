/* =========================================
   SERVICE WORKER — HUMANÓMETRO
   Cache básico para PWA
========================================= */

const CACHE_NAME = "humanometro-v1-cache";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./bloqueos.js",
  "./manifest.json",
  "./activos/logo-hm.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];

/* ===============================
   INSTALACIÓN
=============================== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* ===============================
   ACTIVACIÓN
=============================== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ===============================
   FETCH (CACHE FIRST)
=============================== */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
