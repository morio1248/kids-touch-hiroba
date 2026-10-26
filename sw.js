// オフライン用。ファイルを更新したら VERSION を上げる
const VERSION = 'v14';
const CORE = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './sounds/ashika.mp3', './sounds/buta.mp3', './sounds/hitsuji.mp3', './sounds/hiyoko.mp3', './sounds/inoshishi.mp3', './sounds/inu.mp3', './sounds/karasu.mp3', './sounds/lion.mp3', './sounds/neko.mp3', './sounds/niwatori.mp3', './sounds/ookami.mp3', './sounds/suzume.mp3', './sounds/uma.mp3', './sounds/ushi.mp3', './sounds/yagi.mp3', './sounds/zou.mp3',
  './voice/v001.mp3', './voice/v002.mp3', './voice/v003.mp3', './voice/v004.mp3', './voice/v005.mp3', './voice/v006.mp3', './voice/v007.mp3', './voice/v008.mp3', './voice/v009.mp3', './voice/v010.mp3', './voice/v011.mp3', './voice/v012.mp3', './voice/v013.mp3', './voice/v014.mp3', './voice/v015.mp3', './voice/v016.mp3', './voice/v017.mp3', './voice/v018.mp3', './voice/v019.mp3', './voice/v020.mp3', './voice/v021.mp3', './voice/v022.mp3', './voice/v023.mp3', './voice/v024.mp3', './voice/v025.mp3', './voice/v026.mp3', './voice/v027.mp3', './voice/v028.mp3', './voice/v029.mp3', './voice/v030.mp3', './voice/v031.mp3', './voice/v032.mp3', './voice/v033.mp3', './voice/v034.mp3', './voice/v035.mp3', './voice/v036.mp3', './voice/v037.mp3', './voice/v038.mp3', './voice/v039.mp3', './voice/v040.mp3', './voice/v041.mp3', './voice/v042.mp3', './voice/v043.mp3', './voice/v044.mp3', './voice/v045.mp3', './voice/v046.mp3', './voice/v047.mp3', './voice/v048.mp3', './voice/v049.mp3', './voice/v050.mp3', './voice/v051.mp3', './voice/v052.mp3', './voice/v053.mp3', './voice/v054.mp3', './voice/v055.mp3', './voice/v056.mp3', './voice/v057.mp3', './voice/v058.mp3', './voice/v059.mp3', './voice/v060.mp3', './voice/v061.mp3', './voice/v062.mp3', './voice/v063.mp3', './voice/v064.mp3', './voice/v065.mp3', './voice/v066.mp3', './voice/v067.mp3', './voice/v068.mp3', './voice/v069.mp3', './voice/v070.mp3', './voice/v071.mp3', './voice/v072.mp3', './voice/v073.mp3', './voice/v074.mp3', './voice/v075.mp3', './voice/v076.mp3', './voice/v077.mp3', './voice/v078.mp3', './voice/v079.mp3', './voice/v080.mp3', './voice/v081.mp3', './voice/v082.mp3', './voice/v083.mp3', './voice/v084.mp3', './voice/v085.mp3', './voice/v086.mp3', './voice/v087.mp3', './voice/v088.mp3', './voice/v089.mp3', './voice/v090.mp3', './voice/v091.mp3', './voice/v092.mp3', './voice/v093.mp3', './voice/v094.mp3', './voice/v095.mp3', './voice/v096.mp3', './voice/v097.mp3', './voice/v098.mp3', './voice/v099.mp3', './voice/v100.mp3', './voice/v101.mp3', './voice/v102.mp3', './voice/v103.mp3', './voice/v104.mp3', './voice/v105.mp3', './voice/v106.mp3', './voice/v107.mp3', './voice/v108.mp3', './voice/v109.mp3', './voice/v110.mp3', './voice/v111.mp3', './voice/v112.mp3', './voice/v113.mp3', './voice/v114.mp3', './voice/v115.mp3', './voice/v116.mp3', './voice/v117.mp3', './voice/v118.mp3', './voice/v119.mp3', './voice/v120.mp3', './voice/v121.mp3', './voice/v122.mp3', './voice/v123.mp3', './voice/v124.mp3', './voice/v125.mp3', './voice/v126.mp3', './voice/v127.mp3', './voice/v128.mp3', './voice/v129.mp3', './voice/v130.mp3', './voice/v131.mp3', './voice/v132.mp3', './voice/v133.mp3', './voice/v134.mp3', './voice/v135.mp3', './voice/v136.mp3', './voice/v137.mp3', './voice/v138.mp3', './voice/v139.mp3', './voice/v140.mp3', './voice/v141.mp3', './voice/v142.mp3', './voice/v143.mp3', './voice/v144.mp3', './voice/v145.mp3', './voice/v146.mp3', './voice/v147.mp3', './voice/v148.mp3'];

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
