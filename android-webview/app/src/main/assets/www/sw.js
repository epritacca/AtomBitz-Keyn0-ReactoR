const CACHE_NAME = "atom-bitz-keno-reactor-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/atom-bitz-corner-logo.png",
  "./assets/atom-bitz-wordmark-gold.png",
  "./assets/atom-bitz-red-logo.png",
  "./assets/atom-bitz-gold-logo.png",
  "./assets/atom-bitz-green-logo.png",
  "./assets/atom-bitz-purple-logo.png",
  "./assets/atom-bitz-pink-logo.png",
  "./assets/atomic-chip-icon.png",
  "./assets/ab-micro-icon.png",
  "./assets/orbit-electron-icon.png",
  "./assets/flame-mini-red.png",
  "./assets/flame-mini-yellow.png",
  "./assets/flame-mini-green.png",
  "./assets/flame-mini-purple.png",
  "./assets/flame-mini-pink.png",
  "./assets/atom-hit-badge.png",
  "./assets/atom-hit-flame-badge.png",
  "./assets/atom-bitz-header.png",
  "./assets/theme-red-header.png",
  "./assets/theme-yellow-header.png",
  "./assets/theme-green-header.png",
  "./assets/theme-purple-header.png",
  "./assets/theme-pink-header.png",
  "./assets/theme-red-button.png",
  "./assets/theme-yellow-button.png",
  "./assets/theme-green-button.png",
  "./assets/theme-purple-button.png",
  "./assets/theme-pink-button.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
