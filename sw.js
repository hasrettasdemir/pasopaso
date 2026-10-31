// Internetsiz calisma. Uygulama dosyalari: once internetten (guncel kalsin), yoksa kayittan.
// Ses dosyalari: once kayittan (degismezler, hizli acilsin).
// Icerigi degistirdikten sonra SURUM'u bir artir ki eski kayitlar temizlensin.
const SURUM = "paso-v4";
importScripts("ses/liste.js");
const DOSYALAR = ["./", "index.html", "stil.css", "veri.js", "ek.js", "uygulama.js", "manifest.json", "ses/liste.js",
  "simge-180.png", "simge-192.png", "simge-512.png", ...Object.values(SESLER).map(f => "ses/" + f)];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(adlar => Promise.all(adlar.filter(a => a !== SURUM).map(a => caches.delete(a)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const ses = /\/ses\/[^/]+\.(m4a|mp3)$/.test(new URL(e.request.url).pathname);
  e.respondWith(caches.open(SURUM).then(async c => {
    const kayitli = await c.match(e.request, { ignoreSearch: true });
    if (ses && kayitli) return kayitli;
    try {
      const r = await fetch(e.request, { cache: "no-cache" });
      if (r.ok && r.status === 200) c.put(e.request, r.clone());
      return r;
    } catch {
      return kayitli || Response.error();
    }
  }));
});
