// Internetsiz calisma.
// Kurulumda uygulama dosyalari hemen kaydedilir; ses dosyalari arka planda azar azar indirilir
// (ilk acilisi bekletmesin diye). Calinan ses de aninda kaydedilir.
// Uygulama dosyalari: once internetten (guncel kalsin), yoksa kayittan. Sesler: once kayittan.
// Icerik degisince SURUM bir artirilir (yayinla.sh bunu kendisi yapar).
const SURUM = "paso-v7";
importScripts("ses/liste.js");
const DOSYALAR = ["./", "index.html", "stil.css", "veri.js", "veri-a1.js", "veri-a2.js", "veri-b1.js", "ek.js", "uygulama.js",
  "manifest.json", "ses/liste.js", "simge-180.png", "simge-192.png", "simge-512.png"];
const SES_YOLLARI = Object.values(SESLER).map(f => "ses/" + f);

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

// Sesleri 20'serli gruplar hâlinde indir; inmiş olanı atla
async function sesleriIndir() {
  const c = await caches.open(SURUM);
  for (let i = 0; i < SES_YOLLARI.length; i += 20) {
    await Promise.all(SES_YOLLARI.slice(i, i + 20).map(async u => {
      if (await c.match(u)) return;
      try { const r = await fetch(u); if (r.ok) await c.put(u, r); } catch {}
    }));
  }
}

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(adlar => Promise.all(adlar.filter(a => a !== SURUM).map(a => caches.delete(a)))).then(() => self.clients.claim()));
  sesleriIndir();
});

// Uygulama her acildiginda eksik sesleri tamamlamayi dener (ilk seferde yarim kaldiysa)
self.addEventListener("message", e => { if (e.data === "sesleri-indir") e.waitUntil(sesleriIndir()); });

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
