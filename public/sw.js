const CACHE_NAME = "intell-v1";
const MAX_RUNTIME_CACHE_ITEMS = 40;
const STATIC_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/apple-touch-icon.png",
];

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  await Promise.all(keys.slice(0, keys.length - maxItems).map((key) => cache.delete(key)));
}

function shouldRuntimeCache(url) {
  if (url.pathname.startsWith("/_next/static/")) return true;
  if (url.pathname.match(/\.(?:svg|ico|woff2?)$/i)) return true;
  return false;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const REQUIRED_ASSETS = ["/offline.html"];
      const OPTIONAL_ASSETS = STATIC_ASSETS.filter(
        (asset) => !REQUIRED_ASSETS.includes(asset),
      );

      return Promise.all([
        ...REQUIRED_ASSETS.map((asset) =>
          cache.add(new Request(asset, { cache: "reload" })),
        ),
        Promise.allSettled(
          OPTIONAL_ASSETS.map((asset) =>
            cache.add(new Request(asset, { cache: "reload" })),
          ),
        ),
      ]);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Network-only for API routes — responses are user-specific, never cache them
  if (url.pathname.startsWith("/api/")) return;

  // Network-first for Next.js internal routes; cache only immutable static chunks
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(request).then((response) => {
        if (shouldRuntimeCache(url) && response.ok) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, clone))
            .then(() => trimCache(CACHE_NAME, MAX_RUNTIME_CACHE_ITEMS));
        }
        return response;
      }),
    );
    return;
  }

  // Navigation requests — network first, fall back to offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html")),
    );
    return;
  }

  // Cache-first for static assets (images, fonts, icons, manifest, etc.)
  // with network fallback and cache fallback if both fail
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request)
          .then((response) => {
            if (response.ok && shouldRuntimeCache(url)) {
              const clone = response.clone();
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, clone))
                .then(() => trimCache(CACHE_NAME, MAX_RUNTIME_CACHE_ITEMS));
            }
            return response;
          })
          .catch(() => caches.match(request)),
    ),
  );
});
