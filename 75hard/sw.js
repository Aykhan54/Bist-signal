// 75 Hard — çevrimdışı çalışma: önce internetten dene (güncel kalsın), yoksa önbellekten aç.
const ONBELLEK = 'h75-v1';
const DOSYALAR = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(ONBELLEK).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith('h75-') && k !== ONBELLEK).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(yanit => {
      if (yanit.ok) { const k = yanit.clone(); caches.open(ONBELLEK).then(c => c.put(r, k)); }
      return yanit;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./index.html')))
  );
});
