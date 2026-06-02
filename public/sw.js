const CACHE_NAME = "techspec-scanner-v74";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=20260601-3",
  "/app.js?v=20260601-3",
  "/manifest.webmanifest",
  "/support/",
  "/support/admin-feedback.html",
  "/support/beta.html",
  "/support/privacy.html",
  "/support/terms.html",
  "/support/legal.html",
  "/support/feedback.html",
  "/support/support.css",
  "/support/support-config.js",
  "/support/support.js",
  "/support/admin-feedback.js",
  "/support/feedback.js",
  "/Logo_TechSpec_Scanner.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  const isAppShellRequest = request.mode === "navigate"
    || url.pathname === "/"
    || url.pathname === "/index.html"
    || url.pathname === "/app.js"
    || url.pathname === "/styles.css";

  if (isAppShellRequest) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok && url.origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match("/index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok && url.origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match("/index.html"));

      return cached || network;
    })
  );
});
