// Service Worker — ระบบจองวันลา
const CACHE = 'leave-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first สำหรับ API calls
  if (e.request.url.includes('workers.dev')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response(JSON.stringify({success:false,message:'ไม่มีอินเทอร์เน็ต'}),
        {headers:{'Content-Type':'application/json'}})
    ));
    return;
  }
  // Cache first สำหรับ assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
