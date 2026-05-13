const assets = [
  "/",
  "css/style.css",
  "js/app.js",
  "manifest.json"
];

const CACHE_NAME = "basic-pwa-v1";

// Install event
self.addEventListener("install", (installEvt) => {
  installEvt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets...");
      return cache.addAll(assets);
    }).then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removed old cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request);
      });
    })
  );
});
  );
});
