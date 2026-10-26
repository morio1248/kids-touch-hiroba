// オフライン用。ファイルを更新したら VERSION を上げる
const VERSION = 'v3';
const CORE = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './sounds/ashika.mp3', './sounds/buta.mp3', './sounds/hitsuji.mp3', './sounds/hiyoko.mp3', './sounds/inoshishi.mp3', './sounds/inu.mp3', './sounds/karasu.mp3', './sounds/lion.mp3', './sounds/neko.mp3', './sounds/niwatori.mp3', './sounds/ookami.mp3', './sounds/suzume.mp3', './sounds/uma.mp3', './sounds/ushi.mp3', './sounds/yagi.mp3', './sounds/zou.mp3'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Google Fonts: 一度読んだらキャッシュから
  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.open(VERSION).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // 自分のファイル: ネット優先、つながらなければキャッシュ
  e.respondWith(fetch(req).then(res => {
    const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
