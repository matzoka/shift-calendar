const CACHE_NAME = 'shift-calendar-v1';
const urlsToCache = [
  '/shift-calendar/',
  '/shift-calendar/index.html',
  '/shift-calendar/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
        const responseToCache = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
        return resp;
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
    ))
  );
});
