// Paso a Paso - uygulama mantigi.
// Icerik: veri.js (kelime, cumle), ek.js (hikaye, fiil, sozluk). Sesler: ses/ klasoru.
//
// Akilli tekrar (Leitner kutulari): her kelime/cumle/fiil formu 0-5 arasi bir kutudadir.
// Dogru bilince bir ust kutuya cikar ve daha gec sorulur; yanlis bilince 1. kutuya duser.
// Kutu ve seviye yukseldikce soru tipi zorlasir: secmeli -> dinleme -> yazma -> konusma.

const ARALIK_GUN = [0, 1, 2, 4, 8, 16];   // kutu -> kac gun sonra tekrar
const GUN = 86400000;
const ANAHTAR = "pasoapaso-v1";
const OVGULER = ["¡Muy bien!", "¡Perfecto!", "¡Excelente!", "¡Eso es!", "¡Genial!", "¡Fenomenal!"];
const HIZ_SURE = 60;
const SEVIYE_ADI = { A1: "Başlangıç", A2: "Temel", B1: "Orta" };
const TEMALAR = [["oto", "Otomatik"], ["krem", "Krem"], ["bulut", "Bulut"], ["nane", "Nane"], ["lavanta", "Lavanta"], ["gece", "Gece"]];
const ZAMIR_SES = ["yo", "tú", "ella", "nosotros", "vosotros", "ellos"];
const TORO = [
  ["¡Vamos!", "Hadi bakalım!"], ["¡Poco a poco!", "Azar azar, adım adım!"], ["¡Tú puedes!", "Sen yaparsın!"],
  ["¡Qué bien!", "Ne güzel!"], ["¡Ánimo!", "Gayret!"], ["¡A por ello!", "Haydi, üstüne git!"],
];

// --- Veriyi nesnelere cevir ---
const KELIMELER = [];
const CUMLELER = [];
const FORMLAR = [];
for (const u of UNITELER) {
  u.seviye = u.seviye || "A1";
  u.k = u.kelimeler.map(([es, tr, e, a, h, g]) => {
    const o = { tur: "k", id: `k:${u.id}:${es}`, unite: u, es, tr, e, a, h, g: g || cinsiyet(es) };
    KELIMELER.push(o);
    return o;
  });
  u.c = u.cumleler.map(([es, tr, b, y]) => {
    const o = { tur: "c", id: `c:${u.id}:${es}`, unite: u, es, tr, b, y };
    CUMLELER.push(o);
    return o;
  });
}
for (const [mastar, tr, formlar, grup] of FIILLER) {
  formlar.forEach((es, i) => FORMLAR.push({ tur: "f", id: `f:${mastar}:${i}`, es, i, mastar, tr, grup, formlar, zamir: ZAMIRLER[i] }));
}

function cinsiyet(es) {
  if (/^(el|los) /.test(es)) return "m";
  if (/^(la|las) /.test(es)) return "f";
  return "";
}

// --- Kayit (telefonda saklanir) ---
const BOS = () => ({
  kutu: {}, seri: 0, enSeri: 0, son: "", gunTarih: "", gunSayi: 0, seviye: null, efekt: true, yavas: false, enHiz: 0,
  tema: "oto", hedef: 40, toplamXp: 0, gunXp: {}, hikaye: {}, rozet: [], dersSayisi: 0, mukemmel: 0,
  fiilGrup: {}, konusSayisi: 0, konusma: true,
});
let D = yukle();
function yukle() {
  try { return Object.assign(BOS(), JSON.parse(localStorage.getItem(ANAHTAR) || "{}")); }
  catch { return BOS(); }
}
function kaydet() {
  try { localStorage.setItem(ANAHTAR, JSON.stringify(D)); } catch {}
}
const tarihStr = (t = Date.now()) => new Date(t).toLocaleDateString("sv");
const goruldu = o => !!D.kutu[o.id];
const zamaniGeldi = o => goruldu(o) && D.kutu[o.id].t <= Date.now();
const kutusu = o => (D.kutu[o.id] ? D.kutu[o.id].b : 0);
const bugunXp = () => D.gunXp[tarihStr()] || 0;
function seviyeAdi() {
  const n = KELIMELER.filter(goruldu).length;
  return n === 0 ? "Sıfırdan başlıyorsun" : n < 150 ? "A1'e başladın" : n < 400 ? "A1" : n < 650 ? "A2" : n < 950 ? "B1" : "B1 tamam 🎓";
}
if (D.gunTarih !== tarihStr()) { D.gunTarih = tarihStr(); D.gunSayi = 0; }
if (D.seviye == null && Object.keys(D.kutu).length) D.seviye = 0;
if (![20, 40, 80, 120].includes(D.hedef)) D.hedef = 40;

function temaUygula() {
  document.documentElement.dataset.tema = D.tema;
  const renk = getComputedStyle(document.documentElement).getPropertyValue("--zemin").trim();
  document.querySelector('meta[name="theme-color"]').content = renk || "#F4EFE6";
}

// --- Ses: once kayitli dosya (ses/), yoksa telefonun kendi sesi ---
const SES_DOSYA = typeof SESLER !== "undefined" ? SESLER : {};
const sesAdi = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sesMetni = o => (o.tur === "f" ? `${ZAMIR_SES[o.i]} ${o.es}` : o.es);
let calan = null;

function soyle(metin, anahtar, yavas) {
  const dosya = SES_DOSYA[anahtar || sesAdi(metin)];
  if (calan) calan.pause();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (dosya) {
    calan = new Audio(`ses/${dosya}`);
    calan.playbackRate = yavas ? 0.7 : D.yavas ? 0.85 : 1;
    calan.play().catch(() => telefonSesi(metin, yavas));
  } else telefonSesi(metin, yavas);
}

function telefonSesi(metin, yavas) {
  if (!("speechSynthesis" in window)) return;
  const s = new SpeechSynthesisUtterance(metin);
  s.lang = "es-ES";
  const sesler = speechSynthesis.getVoices().filter(v => v.lang.replace("_", "-").startsWith("es"));
  const iyi = v => /premium|enhanced|mejorad|geli[sş]mi[sş]/i.test(v.name);
  const ses = sesler.find(v => iyi(v) && v.lang.includes("ES")) || sesler.find(iyi) || sesler.find(v => /ES$/.test(v.lang)) || sesler[0];
  if (ses) s.voice = ses;
  s.rate = yavas ? 0.6 : D.yavas ? 0.75 : 0.9;
  speechSynthesis.speak(s);
}

// --- Kisa ses efektleri (dosya gerekmez, telefon uretir) ---
let ac = null;
function efekt(tur) {
  if (!D.efekt) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    const notalar = { dogru: [660, 880], yanlis: [300, 240], bitis: [523, 659, 784, 1047], cevir: [520], rozet: [784, 988, 1175, 1568] }[tur];
    notalar.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      const t = ac.currentTime + i * 0.09;
      o.type = tur === "yanlis" ? "triangle" : "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.25);
    });
  } catch {}
}

// --- Yardimcilar ---
const karistir = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rastgele = a => a[Math.floor(Math.random() * a.length)];
const temizle = s => s.replace(/[¿?¡!.,:]/g, "");
const titret = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch {} };
const resimli = o => o.tur === "k" && !!o.e;
const govde = o => o.es.replace(/^(el|la|los|las) /, "");
const harfUygun = o => o.tur === "k" && !/\s/.test(govde(o)) && govde(o).length >= 3 && govde(o).length <= 9;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const konusmaVar = () => !!SR && D.konusma && !(window.konusmaKapaliTa > Date.now());
const norm = s => s.toLowerCase().replace(/[¿?¡!.,;:"]/g, "").replace(/\s+/g, " ").trim();
const aksansiz = s => norm(s).normalize("NFD").replace(/[̀-ͯ]/g, "");

function mesafe(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// Yazilan cevabi degerlendir: tam dogru, kucuk hata (aksan/harf/artikel; dogru sayilir) ya da yanlis
function yaziKontrol(cevap, dogru, artikelsiz) {
  if (!cevap.trim()) return { sonuc: "yanlis" };
  if (norm(cevap) === norm(dogru)) return { sonuc: "tam" };
  if (aksansiz(cevap) === aksansiz(dogru)) return { sonuc: "kucuk", not: `Aksanlara dikkat: <b>${dogru}</b>` };
  if (artikelsiz && norm(cevap) === norm(artikelsiz)) return { sonuc: "kucuk", not: `Artikeliyle ezberle: <b>${dogru}</b>` };
  const izin = aksansiz(dogru).length >= 6 ? 1 : 0;
  if (mesafe(aksansiz(cevap), aksansiz(dogru)) <= izin) return { sonuc: "kucuk", not: `Küçük bir yazım hatası. Doğrusu: <b>${dogru}</b>` };
  return { sonuc: "yanlis" };
}

// Kelimenin gorseli: emoji, renk kutusu, rakam ya da haftanin gunu seridi
function gorsel(o, buyuk) {
  const e = o.e;
  if (!e) return "";
  const c = `gorsel ${buyuk ? "buyuk" : ""}`;
  if (e[0] === "#") return `<span class="${c} renk" style="background:${e}"></span>`;
  if (e[0] === "=") return `<span class="${c} rakam">${e.slice(1)}</span>`;
  if (e[0] === "@") {
    const n = +e.slice(1);
    const gunler = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    return `<span class="${c} hafta">${gunler.map((g, i) => `<i class="${i === n ? "bu" : ""} ${i > 4 ? "hs" : ""}">${buyuk ? g : ""}</i>`).join("")}</span>`;
  }
  return `<span class="${c} emoji">${e}</span>`;
}
const anlamEtiketi = o => `${gorsel(o)} ${o.tr}`;

// Cumledeki her kelime dokunulabilir: anlami balonda cikar
function kelimeli(metin) {
  return metin.split(" ").map(ham => {
    const [, on, oz, son] = ham.match(/^([¿¡"]*)(.*?)([.,!?:;"]*)$/);
    return oz ? `${on}<span class="kel" data-k="${oz.toLowerCase()}">${oz}</span>${son}` : ham;
  }).join(" ");
}

function anlamBul(k) {
  if (SOZLUK[k]) return SOZLUK[k];
  const kelime = KELIMELER.find(o => o.es === k || govde(o) === k);
  if (kelime) return kelime.tr;
  const form = FORMLAR.find(o => o.es === k);
  if (form) return `${form.mastar} (${form.tr}) · ${form.zamir[0]}`;
  const mastar = FIILLER.find(f => f[0] === k);
  if (mastar) return mastar[1];
  return null;
}

function celdiriciler(o, havuz, alan) {
  const ayni = x => x === o || x[alan] === o[alan];
  let secilen = karistir(havuz.filter(x => !ayni(x))).slice(0, 3);
  if (secilen.length < 3) {
    const genel = o.tur === "k" ? KELIMELER : CUMLELER;
    secilen = secilen.concat(karistir(genel.filter(x => !ayni(x) && !secilen.includes(x))).slice(0, 3 - secilen.length));
  }
  return karistir([o, ...secilen]);
}

// Cumleyi siralama parcalarina ayir; cumle basindaki kelime kucuk harfe iner ki ipucu olmasin
function parcala(es) {
  let bas = true;
  return es.split(" ").map(ham => {
    let p = temizle(ham);
    if (bas) p = p.charAt(0).toLowerCase() + p.slice(1);
    bas = /[.?!]$/.test(ham);
    return p;
  }).filter(Boolean);
}

// ================= EKRANLAR =================
const ekran = document.getElementById("ekran");
let sekme = "bugun";
let ders = null;
let hiz = null;

function sekmeGoster(ad) {
  sekme = ad;
  ders = null;
  hizDurdur();
  dinlemeDurdur();
  document.querySelectorAll("#menu button").forEach(b => b.classList.toggle("secili", b.dataset.sekme === ad));
  ekran.innerHTML = D.seviye == null ? karsilama() : { bugun: bugunEkrani, kelime: kelimeEkrani, cumle: cumleEkrani, hikaye: hikayeEkrani, sozluk: sozlukEkrani }[ad]();
  document.body.classList.toggle("derste", D.seviye == null);
  window.scrollTo(0, 0);
}

function karsilama() {
  return `<div class="karsilama">
    <div class="buyuk-emoji zipla">🐂</div>
    <h1>¡Hola! Ben Toro</h1>
    <p class="alt">İspanyolca yolculuğunda sana eşlik edeceğim. Önce seviyeni ölçelim: bildiğini işaretle,
      bilmediğinde <b>Bilmiyorum</b>'a bas. Bildiğin üniteleri atlarız.</p>
    <button class="dugme" data-is="test">Seviyemi ölç (3 dakika)</button>
    <button class="dugme ikincil" data-is="sifirdan">Hiç bilmiyorum, sıfırdan başla</button>
  </div>`;
}

function hedefHalkasi() {
  const oran = Math.min(1, bugunXp() / D.hedef);
  const cevre = 2 * Math.PI * 34;
  return `<svg class="halka" viewBox="0 0 80 80" aria-hidden="true">
    <circle cx="40" cy="40" r="34" class="halka-zemin"/>
    <circle cx="40" cy="40" r="34" class="halka-dolu" stroke-dasharray="${cevre}" stroke-dashoffset="${cevre * (1 - oran)}"/>
    <text x="40" y="38" text-anchor="middle" class="halka-sayi">${bugunXp()}</text>
    <text x="40" y="53" text-anchor="middle" class="halka-alt">/ ${D.hedef} XP</text></svg>`;
}

function haftaSeridi() {
  const harfler = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];
  return `<div class="hafta-seridi">${[6, 5, 4, 3, 2, 1, 0].map(n => {
    const t = Date.now() - n * GUN;
    const xp = D.gunXp[tarihStr(t)] || 0;
    return `<span class="${xp ? "yandi" : ""} ${n === 0 ? "bugun" : ""}"><i>${xp ? "🔥" : "·"}</i>${harfler[new Date(t).getDay()]}</span>`;
  }).join("")}</div>`;
}

function bugunEkrani() {
  const hepsi = [...KELIMELER, ...CUMLELER, ...FORMLAR];
  const vakti = hepsi.filter(zamaniGeldi).length;
  const zayif = hepsi.filter(o => kutusu(o) === 1).length;
  const ogrenilen = KELIMELER.filter(goruldu).length;
  const siradaki = UNITELER.find(u => u.k.some(o => !goruldu(o)));
  const hikaye = HIKAYELER.find(h => hikayeAcik(h) && D.hikaye[h.id] == null);
  let gunluk;
  if (vakti > 0) {
    gunluk = `<p>${vakti} kelime ve cümlenin tekrar zamanı geldi.</p>
      <button class="dugme" data-is="tekrar">Günün dersine başla</button>`;
  } else if (ogrenilen === 0) {
    gunluk = `<p>İlk dersle başlayalım: 5 yeni kelime, görselleri ve sesleriyle.</p>
      <button class="dugme" data-is="yeni:${UNITELER.indexOf(siradaki)}">İlk derse başla</button>`;
  } else {
    gunluk = `<p>Tekrarların bitti 🎉 Yeni bir şey öğrenelim mi?</p>
      ${siradaki ? `<button class="dugme" data-is="yeni:${UNITELER.indexOf(siradaki)}">5 yeni kelime: ${siradaki.ad}</button>` : ""}
      ${hikaye ? `<button class="dugme ikincil" data-is="hikayeoku:${HIKAYELER.indexOf(hikaye)}">${hikaye.emoji} Yeni hikaye: ${hikaye.ad}</button>` : ""}`;
  }
  const [es, tr] = rastgele(TORO);
  return `
    <div class="baslik-satir">
      <div class="toro"><span class="toro-yuz">🐂</span><span class="toro-balon"><b>${es}</b> ${tr}</span></div>
      <button class="ayar-dugme" data-is="ayarlar" aria-label="Ayarlar">⚙️</button>
    </div>
    <div class="kart hedef-kart">
      ${hedefHalkasi()}
      <div class="hedef-bilgi">
        <b>${bugunXp() >= D.hedef ? "Günlük hedef tamam! 🎯" : "Günlük hedef"}</b>
        <span class="alt">${D.seri ? `🔥 ${D.seri} gün seri` : "Bugün seriye başla"} · ${ogrenilen} kelime · ${seviyeAdi()}</span>
        ${haftaSeridi()}
      </div>
    </div>
    <div class="kart gunluk"><h2 style="margin-top:0">Günün dersi</h2>${gunluk}
      ${zayif >= 3 ? `<button class="dugme ikincil" data-is="zayif">💪 Zorlandığın ${zayif} şeyi çalış</button>` : ""}</div>
    <h2>Oyunlar</h2>
    <div class="oyunlar">
      <button class="kart oyun" data-is="hiz"><span>⚡</span><b>Hızlı tur</b><small>60 saniye: doğru mu, yanlış mı?${D.enHiz ? ` Rekor: ${D.enHiz}` : ""}</small></button>
      <button class="kart oyun" data-is="hafizaoyna"><span>🃏</span><b>Hafıza</b><small>Kartları çevir, eşini bul</small></button>
    </div>
    <h2>Rozetler <span class="alt">${D.rozet.length} / ${ROZETLER.length}</span></h2>
    <div class="rozetler">${ROZETLER.map(r => `<button class="rozet ${D.rozet.includes(r[0]) ? "kazanildi" : ""}" data-is="rozetbilgi:${r[0]}"><span>${r[1]}</span><small>${r[2]}</small></button>`).join("")}</div>
    <h2>Kart renkleri ne demek?</h2>
    <div class="kart">
      <p>İspanyolcada her ismin bir cinsiyeti var. Kartın rengi bunu hatırlatır:</p>
      <div class="gosterge"><span class="etiket m">el … erkek</span><span class="etiket f">la … dişi</span></div>
      <p class="alt" style="margin-top:10px">Kelimeyi hep artikeliyle ezberle: <b>la</b> mesa, <b>el</b> libro.</p>
    </div>`;
}

function uniteListesi(alan, eylem) {
  return `<div class="uniteler">${UNITELER.map((u, i) => {
    const ogeler = u[alan];
    const n = ogeler.filter(goruldu).length;
    const baslik = i === 0 || UNITELER[i - 1].seviye !== u.seviye ? `<h3 class="seviye-baslik">${u.seviye} · ${SEVIYE_ADI[u.seviye]}</h3>` : "";
    return `${baslik}<button class="kart unite" data-is="${eylem}:${i}">
      <span class="simge">${u.emoji}</span>
      <span class="bilgi"><b>${u.ad}</b><span class="alt">${n} / ${ogeler.length}</span>
        <span class="cubuk"><i style="width:${(100 * n) / ogeler.length}%"></i></span></span>
      <span class="ok">${n === ogeler.length ? "✅" : "›"}</span></button>`;
  }).join("")}</div>`;
}

function kelimeEkrani() {
  return `<h1>Kelimeler</h1>
    <p class="alt">A1'den B1'e ${UNITELER.length} ünite, ${KELIMELER.length} kelime. Her derste 5 yeni kelime: önce görsel ve sesle tanış, sonra oyunlarla pekiştir.</p>
    <h2>Üniteler</h2>${uniteListesi("k", "unite")}`;
}

function cumleEkrani() {
  return `<h1>Cümleler</h1>
    <p class="alt">Boşluk doldur, sırala, yaz, dinle, söyle. Kelime ünitesinden sonra daha kolay gelir.</p>
    <h2>Fiil çekimi</h2>
    <div class="uniteler">${FIIL_GRUPLARI.map((g, i) => {
      const formlar = FORMLAR.filter(o => o.grup === g.id);
      const n = formlar.filter(goruldu).length;
      return `<button class="kart unite" data-is="fiil:${i}">
        <span class="simge">${g.emoji}</span>
        <span class="bilgi"><b>${g.ad}</b><span class="alt">${FIILLER.filter(f => f[3] === g.id).map(f => f[0]).join(", ")}</span>
          <span class="cubuk"><i style="width:${(100 * n) / formlar.length}%"></i></span></span>
        <span class="ok">›</span></button>`;
    }).join("")}</div>
    <h2>Cümle üniteleri</h2>${uniteListesi("c", "cumle")}`;
}

function hikayeAcik(h) {
  return h.gerekli === 0 || UNITELER[h.gerekli].k.filter(goruldu).length >= 5;
}

function hikayeEkrani() {
  return `<h1>Hikayeler</h1>
    <p class="alt">Kısa hikayeleri dinle ve oku. Bilmediğin kelimeye dokun, anlamı çıksın. Aralarda ve sonda sorular var.</p>
    <div class="uniteler" style="margin-top:18px">${HIKAYELER.map((h, i) => {
      const acik = hikayeAcik(h);
      const puan = D.hikaye[h.id];
      return `<button class="kart unite ${acik ? "" : "kilitli"}" data-is="${acik ? "hikayeoku" : "kilit"}:${i}">
        <span class="simge">${acik ? h.emoji : "🔒"}</span>
        <span class="bilgi"><b>${h.ad}</b><span class="alt">${acik
          ? (puan != null ? `${"⭐".repeat(puan)}${"☆".repeat(h.sorular.length - puan)} · tekrar oku` : `${h.satirlar.filter(s => s[0] !== "?").length} satır · yeni`)
          : `Önce "${UNITELER[h.gerekli].ad}" ünitesinden 5 kelime öğren`}</span></span>
        <span class="ok">›</span></button>`;
    }).join("")}</div>`;
}

function sozlukEkrani() {
  return `<h1>Sözlük</h1>
    <p class="alt">Bütün kelimeler. Soluk olanları henüz öğrenmedin. Dokununca okunur.</p>
    <input id="sozluk-ara" class="yazi" type="search" placeholder="🔍 Ara: İspanyolca ya da Türkçe" autocomplete="off" autocapitalize="off" spellcheck="false">
    ${UNITELER.map(u => `<div class="sozluk-unite"><h2>${u.emoji} ${u.ad} <span class="seviye-etiket">${u.seviye}</span></h2><div class="kart">${u.k.map(o => {
      const b = kutusu(o);
      return `<div class="kelime-satir ${goruldu(o) ? "" : "yeni"}" data-ara="${aksansiz(o.es + " " + o.tr)}">
        <span class="e">${gorsel(o)}</span>
        <span class="k"><b class="${o.g}">${o.es}</b><small>${o.tr}${goruldu(o) ? ` <span class="kutu-isareti">${"●".repeat(b)}${"○".repeat(5 - b)}</span>` : ""}</small></span>
        <button class="ses" data-is="sozses:${KELIMELER.indexOf(o)}" aria-label="Dinle">🔊</button></div>`;
    }).join("")}</div></div>`).join("")}
    <h2>🌀 Fiil tabloları</h2>
    ${FIILLER.map((f, i) => `<div class="kart fiil-mini">${fiilTablosu(i, false)}</div>`).join("")}`;
}

function fiilTablosu(fi, buyuk) {
  const [mastar, tr, formlar, grup] = FIILLER[fi];
  const kok = ["ar", "er", "ir"].includes(grup) ? mastar.slice(0, -2) : null;
  return `<div class="fiil-baslik"><b>${mastar}</b> <span class="alt">${tr}</span></div>
    <div class="fiil-tablo ${buyuk ? "buyuk" : ""}">${formlar.map((f, i) => {
      const goster = kok && f.startsWith(kok) ? `${kok}<em>${f.slice(kok.length)}</em>` : `<em>${f}</em>`;
      return `<button data-is="formses:${fi}-${i}"><small>${ZAMIRLER[i][0]}</small>${goster}</button>`;
    }).join("")}</div>`;
}

function pencere(icerik) {
  const p = document.createElement("div");
  p.className = "perde";
  p.dataset.is = "pencerekapat";
  p.innerHTML = `<div class="pencere">${icerik}</div>`;
  ekran.appendChild(p);
}

function unitePenceresi(i) {
  const u = UNITELER[i];
  const yeniSayi = u.k.filter(o => !goruldu(o)).length;
  const bilinen = u.k.filter(goruldu).length;
  pencere(`<h2>${u.emoji} ${u.ad}</h2>
    <p class="alt" style="margin-bottom:16px">${bilinen} / ${u.k.length} kelime öğrenildi</p>
    ${yeniSayi ? `<button class="dugme" data-is="yeni:${i}">${Math.min(5, yeniSayi)} yeni kelime öğren</button>` : `<p style="margin-bottom:12px">Bu ünitenin bütün kelimelerini öğrendin 🎉</p>`}
    <button class="dugme ikincil" data-is="pratik:${i}" ${bilinen ? "" : "disabled"}>Öğrendiklerimi tekrar et</button>`);
}

function ayarPenceresi() {
  pencere(`<h2>Ayarlar</h2>
    <p class="ayar-etiket">Renk teması</p>
    <div class="tema-sec">${TEMALAR.map(([id, ad]) => `<button class="tema-cip ${D.tema === id ? "secili" : ""}" data-is="tema:${id}" data-ornek="${id}"><i></i>${ad}</button>`).join("")}</div>
    <p class="ayar-etiket">Günlük hedef</p>
    <div class="tema-sec">${[[20, "Rahat"], [40, "Normal"], [80, "Ciddi"], [120, "Çılgın"]].map(([n, ad]) => `<button class="tema-cip ${D.hedef === n ? "secili" : ""}" data-is="hedef:${n}">${ad} · ${n} XP</button>`).join("")}</div>
    <button class="ayar-satir" data-is="efektac"><span>Ses efektleri</span><b>${D.efekt ? "Açık" : "Kapalı"}</b></button>
    <button class="ayar-satir" data-is="yavasac"><span>Konuşma hızı</span><b>${D.yavas ? "Yavaş" : "Normal"}</b></button>
    ${SR ? `<button class="ayar-satir" data-is="konusac"><span>Konuşma alıştırmaları</span><b>${D.konusma ? "Açık" : "Kapalı"}</b></button>` : ""}
    <button class="ayar-satir" data-is="yedekal"><span>💾 Yedek al (dosya indir)</span><b>›</b></button>
    <button class="ayar-satir" data-is="yedeksec"><span>📂 Yedeği geri yükle</span><b>›</b></button>
    <input type="file" id="yedek-dosya" accept=".json,application/json" hidden>
    <button class="ayar-satir" data-is="test"><span>Seviye testini yeniden yap</span><b>›</b></button>
    <button class="ayar-satir tehlike" data-is="sifirla"><span>İlerlememi sıfırla</span><b>›</b></button>`);
}

// ================= ROZETLER =================
const ROZETLER = [
  ["ilk", "🌱", "İlk adım", "İlk dersini bitir", () => D.dersSayisi >= 1],
  ["seri3", "🔥", "3 gün", "3 gün üst üste çalış", () => D.enSeri >= 3],
  ["seri7", "🏆", "1 hafta", "7 gün üst üste çalış", () => D.enSeri >= 7],
  ["k50", "📚", "50 kelime", "50 kelime öğren", () => KELIMELER.filter(goruldu).length >= 50],
  ["k100", "🎓", "100 kelime", "100 kelime öğren", () => KELIMELER.filter(goruldu).length >= 100],
  ["k500", "🏅", "500 kelime", "500 kelime öğren (A2)", () => KELIMELER.filter(goruldu).length >= 500],
  ["k1000", "👑", "B1 ustası", "Bütün kelimeleri öğren", () => KELIMELER.filter(goruldu).length >= KELIMELER.length - 10],
  ["kusursuz", "💎", "Kusursuz", "Bir dersi hiç hata yapmadan bitir", () => D.mukemmel >= 1],
  ["hikaye", "📖", "Okur", "İlk hikayeni bitir", () => Object.keys(D.hikaye).length >= 1],
  ["masalci", "🏰", "Masalcı", "Bütün hikayeleri bitir", () => HIKAYELER.every(h => D.hikaye[h.id] != null)],
  ["simsek", "⚡", "Şimşek", "Hızlı turda 20 puan yap", () => D.enHiz >= 20],
  ["cekimci", "🌀", "Çekimci", "Bütün fiil gruplarını çalış", () => FIIL_GRUPLARI.every(g => D.fiilGrup[g.id])],
  ["konuskan", "🎤", "Konuşkan", "10 kez doğru söyle", () => D.konusSayisi >= 10],
  ["xp500", "⭐", "500 XP", "Toplam 500 XP topla", () => D.toplamXp >= 500],
];

function rozetKontrol() {
  const yeni = ROZETLER.filter(r => !D.rozet.includes(r[0]) && r[4]());
  yeni.forEach(r => D.rozet.push(r[0]));
  return yeni;
}

// ================= DERS MOTORU =================
// Kelime: tanit, resim, anlam, aciklama, dinle, harf, yaz, dikte, konus, eslestir, hafiza
// Cumle:  bosluk, yazbosluk, ceviri, sirala, dikte, konus
// Fiil:   tablo, fiilsec, fiilyaz      Hikaye: hsatir, hsoru

const zorluk = o => kutusu(o) + ((D.seviye || 0) >= 3 ? 1 : 0);
function uygunTip(tipler, o) {
  const t = tipler.filter(t => (t !== "resim" || resimli(o)) && (t !== "harf" || harfUygun(o)) && (t !== "konus" || konusmaVar())
    && (t !== "dikte" || o.tur !== "c" || o.es.split(" ").length <= 6));
  return t.length ? t : ["anlam"];
}
function kelimeSorusu(o) {
  const z = zorluk(o);
  const tipler = z <= 1 ? ["resim", "anlam", "resim", "anlam"] : z === 2 ? ["aciklama", "dinle", "anlam", "harf", "konus"]
    : z === 3 ? ["harf", "yaz", "dinle", "aciklama", "konus"] : ["yaz", "dikte", "harf", "konus"];
  return { tip: rastgele(uygunTip(tipler, o)), o };
}
function cumleSorusu(o) {
  const z = zorluk(o);
  const tipler = z <= 1 ? ["bosluk"] : z === 2 ? ["ceviri", "sirala", "bosluk"] : z === 3 ? ["yazbosluk", "sirala", "konus"] : ["dikte", "yazbosluk", "konus"];
  const t = uygunTip(tipler, o).filter(x => x !== "anlam");
  return { tip: rastgele(t.length ? t : ["bosluk"]), o };
}
const fiilSorusu = o => ({ tip: zorluk(o) <= 1 ? "fiilsec" : rastgele(["fiilyaz", "fiilsec", "fiilyaz"]), o });
const soruSec = o => (o.tur === "k" ? kelimeSorusu(o) : o.tur === "c" ? cumleSorusu(o) : fiilSorusu(o));
const eslesmeOyunu = ogeler => ({ tip: Math.random() < 0.5 ? "eslestir" : "hafiza", ogeler: ogeler.slice(0, ogeler.length >= 5 && Math.random() < 0.5 ? 5 : 4) });

function yeniKelimeDersi(u) {
  const yeni = u.k.filter(o => !goruldu(o)).slice(0, 5);
  const adimlar = yeni.map(o => ({ tip: "tanit", o }));
  if (yeni.length >= 3) adimlar.push(eslesmeOyunu(yeni));
  const sorular = yeni.flatMap(o => karistir(uygunTip(["resim", "anlam", "aciklama", "dinle"], o)).slice(0, 2).map(tip => ({ tip, o })));
  // Sonda biraz yazma ve konusma: yeni kelimeyi elle yazmak akilda tutar
  const son = karistir(yeni).slice(0, 2).map(o => ({ tip: "yaz", o }));
  if (konusmaVar()) son.push({ tip: "konus", o: rastgele(yeni) });
  dersBaslat(adimlar.concat(karistir(sorular), son));
}

function unitePratigi(u) {
  const ogeler = karistir(u.k.filter(goruldu)).slice(0, 8);
  const adimlar = ogeler.length >= 4 ? [eslesmeOyunu(ogeler)] : [];
  dersBaslat(adimlar.concat(ogeler.map(kelimeSorusu)));
}

function cumleDersi(u) {
  const sira = o => (goruldu(o) ? kutusu(o) + Math.random() : -1 + Math.random());
  const ogeler = [...u.c].sort((a, b) => sira(a) - sira(b)).slice(0, 4);
  const iki = karistir(ogeler).slice(0, 2);
  dersBaslat([
    ...karistir(ogeler).map(o => ({ tip: "bosluk", o })),
    ...karistir(ogeler).map(o => ({ tip: "ceviri", o })),
    ...karistir(ogeler).map(o => ({ tip: "sirala", o })),
    ...iki.map(o => ({ tip: "yazbosluk", o })),
    { tip: uygunTip(["konus", "dikte"], iki[0]).filter(t => t !== "anlam")[0] || "sirala", o: iki[0] },
  ]);
}

function fiilDersi(gi) {
  const g = FIIL_GRUPLARI[gi];
  const fiiller = FIILLER.map((f, i) => [f, i]).filter(([f]) => f[3] === g.id);
  const adimlar = [{ tip: "kural", g }];
  for (const [f, fi] of fiiller) adimlar.push({ tip: "tablo", fi });
  const formlar = FORMLAR.filter(o => o.grup === g.id);
  const sorular = karistir(formlar).slice(0, 10).map(o => (goruldu(o) ? fiilSorusu(o) : { tip: "fiilsec", o }));
  D.fiilGrup[g.id] = true;
  dersBaslat(adimlar.concat(sorular));
}

function gununDersi() {
  const hepsi = [...KELIMELER, ...CUMLELER, ...FORMLAR];
  let ogeler = hepsi.filter(zamaniGeldi).sort((a, b) => D.kutu[a.id].t - D.kutu[b.id].t).slice(0, 12);
  if (!ogeler.length) ogeler = karistir(hepsi.filter(goruldu)).slice(0, 10);
  if (!ogeler.length) return yeniKelimeDersi(UNITELER[0]);
  const kelimeler = ogeler.filter(o => o.tur === "k");
  const adimlar = kelimeler.length >= 4 ? [eslesmeOyunu(karistir(kelimeler))] : [];
  dersBaslat(adimlar.concat(karistir(ogeler.map(soruSec))));
}

function zayifDersi() {
  const ogeler = karistir([...KELIMELER, ...CUMLELER, ...FORMLAR].filter(o => kutusu(o) === 1)).slice(0, 10);
  dersBaslat(ogeler.map(o => (o.tur === "k" ? { tip: rastgele(uygunTip(["resim", "anlam", "dinle"], o)), o } : soruSec(o))));
}

function hafizaOyunu() {
  let havuz = KELIMELER.filter(goruldu);
  if (havuz.length < 6) havuz = UNITELER[0].k.concat(havuz);
  dersBaslat([{ tip: "hafiza", ogeler: karistir(havuz).slice(0, 6), oyun: true }]);
}

function hikayeOku(hi) {
  const h = HIKAYELER[hi];
  const adimlar = [];
  h.satirlar.forEach((s, n) => {
    if (s[0] === "?") adimlar.push({ tip: "hsoru", h, n, soru: s[1], cevaplar: s[2], o: { id: `h:${h.id}:${n}` }, tekrar: true });
    else adimlar.push({ tip: "hsatir", h, n });
  });
  h.sorular.forEach(([soru, cevaplar], n) => adimlar.push({ tip: "hsoru", h, son: true, soru, cevaplar, o: { id: `h:${h.id}:s${n}` }, tekrar: true }));
  dersBaslat(adimlar, { hikaye: h, trGoster: {} });
}

// Seviye testi: her seviyeden (A1, A2, B1) 3 rastgele unite, her uniteden 2 kelime + 1 cumle.
// Ust uste iki unitede cogu yanlissa erken biter.
function seviyeTesti() {
  const secilen = ["A1", "A2", "B1"].flatMap(s => karistir(UNITELER.filter(u => u.seviye === s)).slice(0, 3)
    .sort((a, b) => UNITELER.indexOf(a) - UNITELER.indexOf(b)));
  const adimlar = [];
  secilen.forEach(u => {
    const ui = UNITELER.indexOf(u);
    karistir(u.k).slice(0, 2).forEach(o => adimlar.push({ tip: "anlam", o, test: ui }));
    adimlar.push({ tip: "bosluk", o: rastgele(u.c), test: ui });
  });
  dersBaslat(adimlar, { test: true, puan: UNITELER.map(() => 0), zayif: 0, testUniteler: secilen });
}

function dersBaslat(adimlar, ek = {}) {
  ders = Object.assign({ adimlar, i: 0, sonuc: {}, dogru: 0, toplam: 0, cevaplandi: false, art: 0, enArt: 0, xp: 0, ilkXp: bugunXp() }, ek);
  document.body.classList.add("derste");
  adimCiz();
}

function adimHazirla(a) {
  if (a.hazir) return;
  a.hazir = true;
  const o = a.o;
  if (["resim", "aciklama", "dinle"].includes(a.tip)) {
    a.secenekler = celdiriciler(o, o.unite.k, "es");
    a.etiketler = a.secenekler.map(x => x.es);
  } else if (a.tip === "anlam") {
    a.secenekler = celdiriciler(o, o.unite.k, "tr");
    a.etiketler = a.secenekler.map(x => x.tr);
  } else if (a.tip === "ceviri") {
    a.secenekler = celdiriciler(o, o.unite.c, "tr");
    a.etiketler = a.secenekler.map(x => x.tr);
  } else if (a.tip === "bosluk") {
    a.etiketler = karistir([o.b, ...o.y]);
    a.secenekler = a.etiketler.map(s => (s === o.b ? o : null));
  } else if (a.tip === "fiilsec") {
    const diger = karistir(o.formlar.filter(f => f !== o.es)).slice(0, 3);
    a.etiketler = karistir([o.es, ...diger]);
    a.secenekler = a.etiketler.map(s => (s === o.es ? o : null));
  } else if (a.tip === "hsoru") {
    a.etiketler = karistir(a.cevaplar);
    a.secenekler = a.etiketler.map(s => (s === a.cevaplar[0] ? o : null));
  } else if (a.tip === "sirala" || a.tip === "harf") {
    a.hedef = a.tip === "sirala" ? parcala(o.es) : govde(o).split("");
    a.parcalar = karistir(a.hedef.map((p, i) => ({ p, i })));
    a.dizi = [];
  } else if (a.tip === "eslestir") {
    a.sol = karistir(a.ogeler);
    a.sag = karistir(a.ogeler);
    a.secik = {};
    a.biten = new Set();
  } else if (a.tip === "hafiza") {
    a.kartlar = karistir(a.ogeler.flatMap(x => [{ o: x, yuz: "es" }, { o: x, yuz: "tr" }]));
    a.acik = [];
    a.biten = new Set();
    a.hamle = 0;
  }
}

function adimCiz() {
  const a = ders.adimlar[ders.i];
  adimHazirla(a);
  ders.cevaplandi = false;
  const ust = `<div class="ders-ust"><button class="kapat" data-is="dersikapat" aria-label="Kapat">✕</button>
    <div class="cubuk"><i style="width:${(100 * ders.i) / ders.adimlar.length}%"></i></div>
    ${ders.art >= 2 ? `<span class="art">🔥${ders.art}</span>` : ""}</div>`;
  ekran.innerHTML = ust + `<div class="adim gir">${adimIcerik(a)}</div><div class="yer-tut"></div>`;
  window.scrollTo(0, a.tip === "hsatir" || a.tip === "hsoru" ? document.body.scrollHeight : 0);
  if (["tanit", "anlam", "dinle", "ceviri", "dikte"].includes(a.tip)) soyle(sesMetni(a.o));
  if (a.tip === "hsatir") soyle(a.h.satirlar[a.n][1], sesAdi(`h ${a.h.id} ${a.n}`));
  if (["tanit", "tablo", "kural", "hsatir"].includes(a.tip)) panelGoster("", "", "", "Devam");
  const girdi = ekran.querySelector("#yazi");
  if (girdi) setTimeout(() => girdi.focus(), 50);
}

function secenekler(a) {
  const bilmiyorum = ders.test ? `<button class="secenek bilmiyorum" data-is="sec:-1">🤷 Bilmiyorum</button>` : "";
  return `<div class="secenekler">${a.etiketler.map((t, i) => `<button class="secenek" data-is="sec:${i}">${t}</button>`).join("")}${bilmiyorum}</div>`;
}

function yaziAlani(ipucu) {
  return `<input id="yazi" class="yazi" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" lang="es" placeholder="${ipucu || "İspanyolca yaz"}">
    <div class="aksanlar">${["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"].map(h => `<button data-is="harfekle:${h}">${h}</button>`).join("")}</div>
    <button class="dugme" data-is="yazkontrol">Kontrol et</button>
    <button class="atla" data-is="yazatla">Bilmiyorum, cevabı göster</button>`;
}

function bosluklu(o, doldur) {
  let kondu = false;
  return o.es.split(" ").map(ham => {
    if (!kondu && temizle(ham) === o.b) {
      kondu = true;
      return ham.replace(o.b, `<span class="bosluk">${doldur || "&nbsp;"}</span>`);
    }
    return ham;
  }).join(" ");
}

function hikayeSatirlari(a, sonN) {
  const h = a.h;
  return `<div class="hikaye-akis">${h.satirlar.slice(0, sonN + 1).map((s, n) => {
    if (s[0] === "?") return "";
    const [ad, ses] = h.kisiler[s[0]];
    const yeni = n === sonN && a.tip === "hsatir";
    return `<div class="hsatir ${ses} ${yeni ? "yeni" : ""}">
      <span class="kim">${ad}</span>
      <div class="balon-satir"><span class="metin">${kelimeli(s[1])}</span>
        <span class="hdugmeler"><button data-is="hses:${n}" aria-label="Dinle">🔊</button><button data-is="htr:${n}" aria-label="Çeviri">TR</button></span></div>
      ${ders.trGoster[n] ? `<div class="htr">${s[2]}</div>` : ""}
    </div>`;
  }).join("")}</div>`;
}

function adimIcerik(a) {
  const o = a.o;
  switch (a.tip) {
    case "tanit": {
      const not = o.g === "m" ? "el → erkek kelime" : o.g === "f" ? (o.es.startsWith("el ") ? "dişi kelime, ama 'el' alır" : "la → dişi kelime") : "";
      return `<p class="soru-baslik">Yeni kelime</p>
        <div class="kart tanitim ${o.g}">
          ${o.e ? `<div class="gorsel-alan">${gorsel(o, true)}</div>` : ""}
          <div class="es">${o.es}</div>
          <div class="tr">${o.tr}</div>
          <button class="ses" data-is="soyle">🔊</button>
          ${not ? `<div class="cinsiyet-not">${not}</div>` : ""}
          ${o.h ? `<div class="ipucu">💡 ${o.h}</div>` : ""}
        </div>`;
    }
    case "resim":
      return `<p class="soru-baslik">Bu hangi kelime?</p><div class="gorsel-alan">${gorsel(o, true)}</div>${secenekler(a)}`;
    case "anlam":
      return `<p class="soru-baslik">${ders.test ? `Seviye testi · ${o.unite.ad}` : "Bu kelimenin anlamı ne?"}</p>
        <div class="soru-metin">${o.es} <button class="ses" data-is="soyle">🔊</button></div>${secenekler(a)}`;
    case "aciklama":
      return `<p class="soru-baslik">Açıklamaya uyan kelimeyi bul</p>
        <div class="kart soru-metin uzun">${o.a}</div>${secenekler(a)}`;
    case "dinle":
      return `<p class="soru-baslik">Dinle ve doğru kelimeyi seç</p>
        <button class="ses kocaman" data-is="soyle">🔊</button>${secenekler(a)}`;
    case "yaz":
      return `<p class="soru-baslik">İspanyolcasını yaz</p>
        <div class="harf-ipucu">${o.e ? gorsel(o, true) : ""}<div>${o.tr}</div></div>
        ${yaziAlani(o.g ? "artikeliyle yaz (el / la …)" : "")}`;
    case "dikte":
      return `<p class="soru-baslik">Dinle ve duyduğunu yaz</p>
        <div class="dikte-dugmeler"><button class="ses kocaman" data-is="soyle">🔊</button><button class="ses yavas" data-is="soyleyavas">🐢</button></div>
        ${yaziAlani()}`;
    case "konus":
      return `<p class="soru-baslik">Sesli söyle</p>
        <div class="kart soru-metin ${o.tur === "c" ? "uzun" : ""}">${o.tur === "c" ? kelimeli(o.es) : o.es} <button class="ses" data-is="soyle">🔊</button></div>
        <p class="alt" style="text-align:center">${o.tur === "c" ? o.tr : o.tr}</p>
        <button class="mikrofon" data-is="mikrofon"><span>🎤</span>Bas ve söyle</button>
        <p class="konus-durum alt"></p>
        <button class="atla" data-is="konusatla">Şu an konuşamıyorum</button>`;
    case "bosluk":
      return `<p class="soru-baslik">${ders.test ? `Seviye testi · ${o.unite.ad}` : "Boşluğu doldur"}</p>
        <div class="cumle-tr">${o.tr}</div><div class="cumle-es">${bosluklu(o)}</div>${secenekler(a)}`;
    case "yazbosluk":
      return `<p class="soru-baslik">Boşluğu yazarak doldur</p>
        <div class="cumle-tr">${o.tr}</div><div class="cumle-es">${bosluklu(o)}</div>${yaziAlani("eksik kelime")}`;
    case "ceviri":
      return `<p class="soru-baslik">Bu cümle ne demek?</p>
        <div class="cumle-es">${kelimeli(o.es)} <button class="ses" data-is="soyle">🔊</button></div>${secenekler(a)}`;
    case "sirala":
    case "harf": {
      const harf = a.tip === "harf";
      const ust = harf
        ? `<p class="soru-baslik">Harfleri dizerek kelimeyi yaz</p>
           <div class="harf-ipucu">${o.e ? gorsel(o, true) : ""}<div>${o.tr}</div></div>`
        : `<p class="soru-baslik">Kelimeleri sırala</p><div class="cumle-tr">${o.tr}</div>`;
      const artikel = harf && o.es !== govde(o) ? `<span class="artikel ${o.g}">${o.es.split(" ")[0]}</span>` : "";
      return `${ust}
        <div class="dizi ${harf ? "harfler" : ""}">${artikel}${harf
          ? a.hedef.map((_, j) => a.dizi[j] != null ? `<button class="parca" data-is="geri:${j}">${a.parcalar[a.dizi[j]].p}</button>` : `<span class="yuva"></span>`).join("")
          : a.dizi.map((pi, j) => `<button class="parca" data-is="geri:${j}">${a.parcalar[pi].p}</button>`).join("")}</div>
        <div class="havuz">${a.parcalar.map((x, pi) => `<button class="parca ${a.dizi.includes(pi) ? "kullanildi" : ""}" data-is="al:${pi}">${x.p}</button>`).join("")}</div>
        <div style="margin-top:28px"><button class="dugme" data-is="kontrol" ${a.dizi.filter(x => x != null).length === a.parcalar.length ? "" : "disabled"}>Kontrol et</button></div>`;
    }
    case "eslestir":
      return `<p class="soru-baslik">Eşleştir</p>
        <div class="eslestir">${a.sol.map((x, i) => {
          const kart = (y, taraf, j) => `<button class="secenek ${a.biten.has(y) ? "bitti" : ""} ${a.secik[taraf] === j ? "secik" : ""}" data-is="es:${taraf}${j}" ${a.biten.has(y) ? "disabled" : ""}>${taraf === "L" ? y.es : anlamEtiketi(y)}</button>`;
          return kart(x, "L", i) + kart(a.sag[i], "R", i);
        }).join("")}</div>`;
    case "hafiza":
      return `<p class="soru-baslik">Hafıza: kartları çevir, İspanyolcası ile anlamını eşle</p>
        <div class="hafiza">${a.kartlar.map((k, i) => {
          const acik = a.acik.includes(i) || a.biten.has(k.o);
          return `<button class="hkart ${acik ? "acik" : ""} ${a.biten.has(k.o) ? "bitti" : ""} ${k.yuz}" data-is="hf:${i}">
            <span class="on">${k.yuz === "es" ? k.o.es : anlamEtiketi(k.o)}</span><span class="arka">?</span></button>`;
        }).join("")}</div>
        <p class="alt hamle" style="text-align:center;margin-top:14px">${a.hamle} hamle</p>`;
    case "kural":
      return `<p class="soru-baslik">Fiil çekimi</p>
        <div class="kart tanitim"><div class="buyuk-emoji" style="font-size:64px">${a.g.emoji}</div>
          <div class="es" style="font-size:26px">${a.g.ad}</div>
          <div class="ipucu">💡 ${a.g.not}</div>
          <div class="zamirler">${ZAMIRLER.map(([es, tr]) => `<span><b>${es}</b> ${tr}</span>`).join("")}</div></div>`;
    case "tablo":
      return `<p class="soru-baslik">Tabloya bak, dokununca okunur</p><div class="kart">${fiilTablosu(a.fi, true)}</div>`;
    case "fiilsec":
    case "fiilyaz":
      return `<p class="soru-baslik">${a.tip === "fiilsec" ? "Doğru çekimi seç" : "Doğru çekimi yaz"}</p>
        <div class="kart fiil-soru"><span class="zamir">${o.zamir[0]}</span><span class="arti">+</span><span class="mastar">${o.mastar}</span>
          <small>${o.zamir[1]} + ${o.tr}</small></div>
        ${a.tip === "fiilsec" ? secenekler(a) : yaziAlani(`${o.zamir[0]} …`)}`;
    case "hsatir":
      return `<p class="soru-baslik">${a.h.emoji} ${a.h.ad}</p>${hikayeSatirlari(a, a.n)}`;
    case "hsoru":
      return a.son
        ? `<p class="soru-baslik">${a.h.emoji} Hikaye soruları</p><div class="kart soru-metin uzun">${a.soru}</div>${secenekler(a)}`
        : `<p class="soru-baslik">${a.h.emoji} ${a.h.ad}</p>${hikayeSatirlari(a, a.n - 1)}
           <div class="kart soru-metin uzun ara-soru">🤔 ${a.soru}</div>${secenekler(a)}`;
  }
}

function xpEkle(n) {
  D.toplamXp += n;
  D.gunXp[tarihStr()] = bugunXp() + n;
  if (ders) ders.xp += n;
}

// Cevabi isle: sonucu kaydet, yanlissa sona tekrar ekle, alttan paneli ac
function cevapla(dogruMu, aciklama, not) {
  const a = ders.adimlar[ders.i];
  ders.cevaplandi = true;
  ders.toplam++;
  let kazanilan = 0;
  if (dogruMu) {
    ders.dogru++; ders.art++; ders.enArt = Math.max(ders.enArt, ders.art);
    if (!ders.test) { D.gunSayi++; kazanilan = 2 + (ders.art >= 5 ? 1 : 0); xpEkle(kazanilan); }
    titret(15); efekt("dogru");
    const secili = ekran.querySelector(".secenek.dogru, .yazi, .dizi, .mikrofon");
    if (secili) secili.classList.add("pop");
  } else {
    ders.art = 0;
    titret([30, 40, 30]); efekt("yanlis");
    ekran.querySelector(".adim")?.classList.add("salla");
    if (!a.tekrar && !ders.test) ders.adimlar.push({ tip: a.tip, o: a.o, tekrar: true });
  }
  if (ders.test) {
    if (dogruMu) ders.puan[a.test]++;
    return setTimeout(EYLEMLER.devam, 650);
  }
  ders.sonuc[a.o.id] = (ders.sonuc[a.o.id] ?? true) && dogruMu;
  const ek = dogruMu ? ` <span class="xp-uc">+${kazanilan} XP</span>${ders.art >= 3 ? ` <span class="art">🔥 ${ders.art}</span>` : ""}` : "";
  const baslik = dogruMu ? (not ? "Doğru sayıldı 👍" : rastgele(OVGULER)) : "Doğrusu:";
  panelGoster(dogruMu ? "dogru" : "yanlis", baslik + ek, (not ? `${not}<br>` : "") + aciklama, "Devam");
}

function panelGoster(tur, mesaj, aciklama, dugme) {
  const p = document.createElement("div");
  p.className = `alt-panel ${tur}`;
  p.innerHTML = `<div>${mesaj ? `<div class="mesaj">${mesaj}</div>` : ""}${aciklama ? `<div class="aciklama">${aciklama}</div>` : ""}
    <button class="dugme" data-is="devam">${dugme}</button></div>`;
  ekran.appendChild(p);
}

function cevapAciklamasi(a) {
  const o = a.o;
  if (a.tip === "hsoru") return `<b>${a.cevaplar[0]}</b>`;
  if (o.tur === "k") return `${gorsel(o)} <b>${o.es}</b> = ${o.tr}`;
  if (o.tur === "f") return `${o.zamir[0]} <b>${o.es}</b> · ${o.mastar} (${o.tr})`;
  return `<b>${o.es}</b><br>${o.tr}`;
}

function konfeti(cok) {
  const renkler = ["#5F8466", "#E8B49D", "#A3C3DF", "#F2C230", "#D69A80", "#7563A8"];
  for (let i = 0; i < (cok ? 80 : 40); i++) {
    const s = document.createElement("i");
    s.className = "konfeti";
    s.style.cssText = `left:${Math.random() * 100}vw;background:${rastgele(renkler)};animation-delay:${Math.random() * 0.6}s;animation-duration:${1.6 + Math.random()}s`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3200);
  }
}

function seriGuncelle() {
  const bugun = tarihStr();
  if (D.son !== bugun) {
    D.seri = D.son === tarihStr(Date.now() - GUN) ? D.seri + 1 : 1;
    D.son = bugun;
    D.enSeri = Math.max(D.enSeri, D.seri);
  }
}

// Ders sonu ekrani: XP, seri, gunluk hedef, yeni rozetler
function bitisEkrani({ emoji, baslik, satirlar, dugmeler }) {
  const hedefYeni = ders && ders.ilkXp < D.hedef && bugunXp() >= D.hedef;
  const yeniRozet = rozetKontrol();
  kaydet();
  if (hedefYeni || yeniRozet.length) { konfeti(true); efekt("rozet"); }
  const [es, tr] = rastgele(TORO);
  ekran.innerHTML = `<div class="bitis">
    <div class="buyuk-emoji zipla">${emoji}</div>
    <h1>${baslik}</h1>
    <p class="alt" style="margin:8px 0 18px">${satirlar}</p>
    <div class="bitis-kutular">
      ${ders && ders.xp ? `<div class="kart"><b>+${ders.xp}</b><small>XP</small></div>` : ""}
      <div class="kart"><b>${D.seri}🔥</b><small>gün seri</small></div>
      <div class="kart"><b>${bugunXp()}/${D.hedef}</b><small>bugün XP</small></div>
    </div>
    ${hedefYeni ? `<div class="kart kutlama">🎯 <b>Günlük hedef tamam!</b> ¡Increíble!</div>` : ""}
    ${yeniRozet.map(r => `<div class="kart kutlama yeni-rozet"><span>${r[1]}</span><div><b>Yeni rozet: ${r[2]}</b><small>${r[3]}</small></div></div>`).join("")}
    <div class="toro bitis-toro"><span class="toro-yuz">🐂</span><span class="toro-balon"><b>${es}</b> ${tr}</span></div>
    ${dugmeler || `<button class="dugme" data-is="bitir">Tamam</button>`}</div>`;
  ders = null;
}

function dersBitti() {
  if (ders.test) return testBitti();
  const simdi = Date.now();
  for (const [id, dogru] of Object.entries(ders.sonuc)) {
    if (id.startsWith("h:")) continue;
    const eski = D.kutu[id] ? D.kutu[id].b : 0;
    const b = dogru ? Math.min(eski + 1, 5) : 1;
    D.kutu[id] = { b, t: dogru ? simdi + ARALIK_GUN[b] * GUN - 3600000 : simdi };
  }
  // Fiil dersinde tablosu gosterilen ama sorulmayan formlar da "goruldu" sayilsin ki tekrar gelsin
  for (const a of ders.adimlar) if (a.tip === "tablo") for (const o of FORMLAR.filter(f => f.mastar === FIILLER[a.fi][0])) if (!goruldu(o)) D.kutu[o.id] = { b: 1, t: simdi + GUN };
  const kusursuz = ders.toplam >= 5 && ders.dogru === ders.toplam;
  xpEkle(5 + (kusursuz ? 5 : 0));
  D.dersSayisi++;
  if (kusursuz) D.mukemmel++;
  seriGuncelle();
  if (ders.hikaye) {
    const h = ders.hikaye;
    const sonDogru = ders.adimlar.filter(a => a.son && ders.sonuc[a.o.id]).length;
    D.hikaye[h.id] = Math.max(D.hikaye[h.id] ?? 0, sonDogru);
    xpEkle(5);
    if (sonDogru === h.sorular.length) konfeti();
    efekt("bitis");
    return bitisEkrani({
      emoji: h.emoji, baslik: "¡Fin! Hikaye bitti",
      satirlar: `Sondaki ${h.sorular.length} sorunun ${sonDogru} tanesini bildin. ${"⭐".repeat(sonDogru)}`,
    });
  }
  const oran = ders.toplam ? ders.dogru / ders.toplam : 1;
  if (oran >= 0.8) { konfeti(); efekt("bitis"); }
  bitisEkrani({
    emoji: kusursuz ? "💎" : oran >= 0.8 ? "🎉" : "💪",
    baslik: kusursuz ? "¡Perfecto! Hiç hata yok" : oran >= 0.8 ? "¡Fantástico!" : "Ders bitti!",
    satirlar: `${ders.toplam ? `${ders.toplam} sorunun ${ders.dogru} tanesini bildin.` : "Tebrikler!"}${ders.enArt >= 3 ? ` En uzun serin: 🔥 ${ders.enArt}` : ""}`,
  });
}

function testBitti() {
  const simdi = Date.now();
  let seviye = 0;
  const satirlar = [];
  for (const u of ders.testUniteler) {
    const ui = UNITELER.indexOf(u);
    const puan = ders.puan[ui];
    const ulasti = ders.adimlar.some((a, i) => a.test === ui && i < ders.i);
    if (!ulasti) { satirlar.push(`<li>${u.emoji} ${u.ad} <span>—</span></li>`); continue; }
    // 3/3 bilinen ünite öğrenilmiş sayılır, 2 gün sonra tekrar sorulur
    if (puan === 3) {
      seviye++;
      for (const o of [...u.k, ...u.c]) if (!goruldu(o)) D.kutu[o.id] = { b: 2, t: simdi + 2 * GUN };
    }
    satirlar.push(`<li>${u.emoji} ${u.ad} <span>${puan === 3 ? "✅ biliyorsun" : puan === 2 ? "🟡 biraz" : "⬜ öğreneceğiz"}</span></li>`);
  }
  // Bir seviyenin test edilen butun uniteleri tam bilindiyse o seviyenin tamami bilinir sayilir
  for (const s of ["A1", "A2", "B1"]) {
    const test = ders.testUniteler.filter(u => u.seviye === s);
    if (test.length && test.every(u => ders.puan[UNITELER.indexOf(u)] === 3))
      for (const u of UNITELER.filter(x => x.seviye === s)) for (const o of [...u.k, ...u.c]) if (!goruldu(o)) D.kutu[o.id] = { b: 2, t: simdi + 2 * GUN };
  }
  D.seviye = seviye;
  kaydet();
  const bilinen = KELIMELER.filter(goruldu).length;
  ekran.innerHTML = `<div class="bitis">
    <div class="buyuk-emoji zipla">${seviye ? "🎯" : "🌱"}</div>
    <h1>${seviyeAdi()}</h1>
    <p class="alt" style="margin:8px 0 18px">${bilinen ? `${bilinen} kelimeyi zaten biliyorsun, onları atlayıp tekrar listesine koydum.` : "Harika, en baştan, adım adım gideceğiz."}</p>
    <ul class="test-sonuc kart">${satirlar.join("")}</ul>
    <button class="dugme" data-is="bitir">Başlayalım</button></div>`;
  ders = null;
}

// ================= KONUSMA =================
let dinleyici = null;
function dinlemeDurdur() { try { dinleyici && dinleyici.abort(); } catch {} dinleyici = null; }

function benzerlik(hedef, duyulan) {
  const h = aksansiz(hedef).split(" "), d = aksansiz(duyulan).split(" ");
  const tutan = h.filter(k => d.some(x => x === k || (k.length > 3 && mesafe(x, k) <= 1))).length;
  return tutan / h.length;
}

function mikrofonAc() {
  const a = ders.adimlar[ders.i];
  if (ders.cevaplandi || dinleyici) return;
  const durum = ekran.querySelector(".konus-durum");
  const dugme = ekran.querySelector(".mikrofon");
  dinleyici = new SR();
  dinleyici.lang = "es-ES";
  dinleyici.interimResults = false;
  dinleyici.maxAlternatives = 5;
  dugme.classList.add("dinliyor");
  durum.textContent = "Dinliyorum…";
  dinleyici.onresult = e => {
    const duyulanlar = [...e.results[0]].map(r => r.transcript);
    const puan = Math.max(...duyulanlar.map(d => benzerlik(a.o.es, d)));
    dinlemeDurdur();
    if (puan >= 0.6) { D.konusSayisi++; cevapla(true, `Duyduğum: “${duyulanlar[0]}”`); }
    else {
      durum.innerHTML = `Duyduğum: “${duyulanlar[0]}”. Bir daha dene 🙂`;
      dugme.classList.remove("dinliyor");
      a.deneme = (a.deneme || 0) + 1;
      if (a.deneme >= 3) cevapla(false, cevapAciklamasi(a));
    }
  };
  dinleyici.onerror = e => {
    dinlemeDurdur();
    dugme.classList.remove("dinliyor");
    durum.textContent = e.error === "not-allowed" || e.error === "service-not-allowed"
      ? "Mikrofon izni yok. Ayarlar'dan izin ver ya da bu soruyu atla." : "Duyamadım, bir daha dene.";
  };
  dinleyici.onend = () => { dinleyici = null; dugme.classList.remove("dinliyor"); };
  try { dinleyici.start(); } catch { dinleyici = null; }
}

// ================= HIZLI TUR =================
function hizBaslat() {
  let havuz = KELIMELER.filter(goruldu);
  if (havuz.length < 8) havuz = UNITELER[0].k.concat(UNITELER[1].k);
  hiz = { havuz, puan: 0, art: 0, bitis: Date.now() + HIZ_SURE * 1000 };
  document.body.classList.add("derste");
  hizSoru();
  hiz.zaman = setInterval(() => {
    const kalan = Math.max(0, hiz.bitis - Date.now());
    const c = ekran.querySelector(".hiz-sure i");
    if (c) c.style.width = `${(100 * kalan) / (HIZ_SURE * 1000)}%`;
    if (!kalan) hizBitti();
  }, 100);
}
function hizDurdur() { if (hiz) { clearInterval(hiz.zaman); hiz = null; } }

function hizSoru() {
  const o = rastgele(hiz.havuz);
  const dogruMu = Math.random() < 0.5;
  const gosterilen = dogruMu ? o : rastgele(hiz.havuz.filter(x => x.tr !== o.tr));
  hiz.soru = { o, dogruMu };
  ekran.innerHTML = `<div class="ders-ust"><button class="kapat" data-is="bitir" aria-label="Kapat">✕</button>
      <div class="cubuk hiz-sure"><i style="width:${(100 * Math.max(0, hiz.bitis - Date.now())) / (HIZ_SURE * 1000)}%"></i></div><span class="art">⚡${hiz.puan}</span></div>
    <p class="soru-baslik" style="text-align:center">Bu ikisi aynı anlama mı geliyor?</p>
    <div class="kart hiz-kart">
      <div class="es">${o.es}</div>
      <div class="esittir">=</div>
      ${gosterilen.e ? gorsel(gosterilen, true) : ""}<div class="tr">${gosterilen.tr}</div>
    </div>
    <div class="hiz-dugmeler">
      <button class="dugme yanlis-d" data-is="hc:0">✗ Hayır</button>
      <button class="dugme" data-is="hc:1">✓ Evet</button>
    </div>`;
}

function hizBitti() {
  const puan = hiz.puan;
  hizDurdur();
  const rekor = puan > D.enHiz;
  if (rekor) { D.enHiz = puan; konfeti(); }
  ders = { xp: 0, ilkXp: bugunXp() };
  xpEkle(Math.ceil(puan / 2));
  seriGuncelle();
  efekt("bitis");
  bitisEkrani({
    emoji: "⚡", baslik: `${puan} puan`, satirlar: rekor ? "Yeni rekor! 🏆" : `Rekorun: ${D.enHiz}`,
    dugmeler: `<button class="dugme" data-is="hiz">Tekrar oyna</button><button class="dugme ikincil" data-is="bitir">Bitir</button>`,
  });
}

// ================= DOKUNMALAR =================
function yaziDegerlendir(atla) {
  const a = ders.adimlar[ders.i];
  if (ders.cevaplandi) return;
  const girdi = ekran.querySelector("#yazi");
  const o = a.o;
  const dogru = a.tip === "yazbosluk" ? o.b : a.tip === "dikte" ? o.es : o.es;
  // Fiil sorusunda zamiri de yazarsa ("nosotros comemos") yine dogru sayilsin
  const yazilan = a.tip === "fiilyaz" ? girdi.value.trim().replace(/^(yo|t[uú]|[eé]l|ella|nosotr[oa]s|vosotr[oa]s|ell[oa]s)\s+/i, "") : girdi.value;
  const sonuc = atla ? { sonuc: "yanlis" } : yaziKontrol(yazilan, dogru, o.tur === "k" && o.g ? govde(o) : null);
  girdi.disabled = true;
  girdi.classList.add(sonuc.sonuc === "yanlis" ? "yanlis" : "dogru");
  ekran.querySelectorAll(".aksanlar button, .atla").forEach(b => (b.disabled = true));
  if (a.tip === "yazbosluk") ekran.querySelector(".cumle-es").innerHTML = bosluklu(o, o.b);
  soyle(sesMetni(o));
  cevapla(sonuc.sonuc !== "yanlis", cevapAciklamasi(a), sonuc.not);
}

const EYLEMLER = {
  tekrar: () => gununDersi(),
  zayif: () => zayifDersi(),
  yeni: i => yeniKelimeDersi(UNITELER[i]),
  pratik: i => unitePratigi(UNITELER[i]),
  unite: i => unitePenceresi(+i),
  cumle: i => cumleDersi(UNITELER[i]),
  fiil: i => fiilDersi(+i),
  hikayeoku: i => hikayeOku(+i),
  kilit: i => { const h = HIKAYELER[i]; pencere(`<h2>🔒 ${h.ad}</h2><p style="margin-bottom:16px">Bu hikayeyi anlamak için önce <b>${UNITELER[h.gerekli].ad}</b> ünitesinden en az 5 kelime öğren.</p><button class="dugme" data-is="yeni:${h.gerekli}">Şimdi öğren</button>`); },
  test: () => seviyeTesti(),
  sifirdan: () => { D.seviye = 0; kaydet(); sekmeGoster("bugun"); },
  hiz: () => hizBaslat(),
  hafizaoyna: () => hafizaOyunu(),
  ayarlar: () => ayarPenceresi(),
  rozetbilgi: id => { const r = ROZETLER.find(x => x[0] === id); pencere(`<div style="text-align:center"><div class="buyuk-emoji" style="${D.rozet.includes(id) ? "" : "filter:grayscale(1);opacity:.5"}">${r[1]}</div><h2>${r[2]}</h2><p class="alt" style="margin-bottom:16px">${r[3]}${D.rozet.includes(id) ? " ✅" : ""}</p></div>`); },
  tema: id => { D.tema = id; kaydet(); temaUygula(); sekmeGoster(sekme); ayarPenceresi(); },
  hedef: n => { D.hedef = +n; kaydet(); sekmeGoster(sekme); ayarPenceresi(); },
  efektac: () => { D.efekt = !D.efekt; kaydet(); sekmeGoster(sekme); ayarPenceresi(); efekt("dogru"); },
  yavasac: () => { D.yavas = !D.yavas; kaydet(); sekmeGoster(sekme); ayarPenceresi(); soyle("Hola, ¿qué tal?"); },
  konusac: () => { D.konusma = !D.konusma; kaydet(); sekmeGoster(sekme); ayarPenceresi(); },
  pencerekapat: (_, el, e) => { if (e.target === el) el.remove(); },
  sozses: i => soyle(KELIMELER[i].es),
  formses: kod => { const [fi, i] = kod.split("-").map(Number); soyle(`${ZAMIR_SES[i]} ${FIILLER[fi][2][i]}`); },
  soyle: () => soyle(sesMetni(ders.adimlar[ders.i].o)),
  soyleyavas: () => soyle(sesMetni(ders.adimlar[ders.i].o), null, true),
  hses: n => soyle(ders.hikaye.satirlar[n][1], sesAdi(`h ${ders.hikaye.id} ${n}`)),
  htr: n => { ders.trGoster[n] = !ders.trGoster[n]; const akis = ekran.querySelector(".hikaye-akis"); const a = ders.adimlar[ders.i]; const yeni = document.createElement("div"); yeni.innerHTML = hikayeSatirlari(a, a.tip === "hsatir" ? a.n : a.son ? -1 : a.n - 1); akis.replaceWith(yeni.firstElementChild); },
  bitir: () => sekmeGoster(sekme),
  dersikapat: () => { if (confirm("Dersten çıkılsın mı? Bu dersin ilerlemesi kaydedilmez.")) sekmeGoster(sekme); },
  sifirla: () => {
    if (confirm("Bütün ilerlemen silinecek. Emin misin?")) {
      D = Object.assign(BOS(), { efekt: D.efekt, yavas: D.yavas, tema: D.tema, gunTarih: tarihStr() });
      kaydet(); sekmeGoster("bugun");
    }
  },
  devam: () => {
    if (!ders) return;
    dinlemeDurdur();
    // Testte iki ünite üst üste zayıfsa (3 sorudan en fazla 1 doğru) devam etmeye gerek yok
    if (ders.test) {
      const a = ders.adimlar[ders.i], sonraki = ders.adimlar[ders.i + 1];
      if (!sonraki || sonraki.test !== a.test) {
        ders.zayif = ders.puan[a.test] <= 1 ? ders.zayif + 1 : 0;
        if (ders.zayif >= 2) { ders.i++; return dersBitti(); }
      }
    }
    ders.i++;
    if (ders.i >= ders.adimlar.length) dersBitti(); else adimCiz();
  },
  sec: (i, el) => {
    if (ders.cevaplandi) return;
    const a = ders.adimlar[ders.i];
    const dogruMu = +i >= 0 && a.secenekler[i] === a.o;
    ekran.querySelectorAll(".secenek").forEach((b, j) => { b.disabled = true; if (a.secenekler[j] === a.o) b.classList.add("dogru"); });
    if (!dogruMu) el.classList.add("yanlis");
    if (a.tip === "bosluk") ekran.querySelector(".cumle-es").innerHTML = bosluklu(a.o, a.o.b);
    if (!ders.test && a.tip !== "hsoru") soyle(sesMetni(a.o));
    cevapla(dogruMu, cevapAciklamasi(a));
  },
  harfekle: h => {
    const g = ekran.querySelector("#yazi");
    if (!g || g.disabled) return;
    const [s, e] = [g.selectionStart ?? g.value.length, g.selectionEnd ?? g.value.length];
    g.value = g.value.slice(0, s) + h + g.value.slice(e);
    g.focus();
    g.setSelectionRange(s + h.length, s + h.length);
  },
  yazkontrol: () => yaziDegerlendir(false),
  yazatla: () => yaziDegerlendir(true),
  mikrofon: () => mikrofonAc(),
  yedekal: () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(D)], { type: "application/json" }));
    a.download = `pasoapaso-yedek-${tarihStr()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
  },
  yedeksec: () => document.getElementById("yedek-dosya").click(),
  konusatla: () => {
    // Bir saat boyunca konusma sorusu gelmesin; bu soru ceza almadan gecilir
    window.konusmaKapaliTa = Date.now() + 3600000;
    dinlemeDurdur();
    ders.cevaplandi = true;
    EYLEMLER.devam();
  },
  al: pi => {
    const a = ders.adimlar[ders.i];
    if (ders.cevaplandi || a.dizi.includes(+pi)) return;
    if (a.tip === "harf") { const j = a.hedef.findIndex((_, k) => a.dizi[k] == null); a.dizi[j] = +pi; efekt("cevir"); }
    else { a.dizi.push(+pi); soyle(a.parcalar[pi].p); }
    adimCiz();
  },
  geri: j => {
    const a = ders.adimlar[ders.i];
    if (ders.cevaplandi) return;
    if (a.tip === "harf") { a.dizi[+j] = null; while (a.dizi.length && a.dizi[a.dizi.length - 1] == null) a.dizi.pop(); }
    else a.dizi.splice(+j, 1);
    adimCiz();
  },
  kontrol: () => {
    const a = ders.adimlar[ders.i];
    if (ders.cevaplandi) return;
    const ayrac = a.tip === "harf" ? "" : " ";
    const dogruMu = a.dizi.map(pi => a.parcalar[pi].p).join(ayrac) === a.hedef.join(ayrac);
    ekran.querySelectorAll(".parca, .dugme").forEach(b => (b.disabled = true));
    soyle(a.o.es);
    cevapla(dogruMu, cevapAciklamasi(a));
  },
  es: (kod, el) => {
    const a = ders.adimlar[ders.i];
    const taraf = kod[0];
    const j = +kod.slice(1);
    if (taraf === "L") soyle(a.sol[j].es);
    a.secik[taraf] = j;
    if (a.secik.L == null || a.secik.R == null) return parcaYenile(a, ".eslestir");
    const sol = a.sol[a.secik.L];
    const sag = a.sag[a.secik.R];
    a.secik = {};
    if (sol === sag) {
      a.biten.add(sol);
      titret(15); efekt("dogru");
      parcaYenile(a, ".eslestir");
      if (a.biten.size === a.ogeler.length) eslesmeBitti();
    } else {
      ders.sonuc[sol.id] = false;
      titret([30, 40, 30]); efekt("yanlis");
      el.classList.add("yanlis");
      setTimeout(() => parcaYenile(a, ".eslestir"), 450);
    }
  },
  hf: i => {
    const a = ders.adimlar[ders.i];
    const k = a.kartlar[+i];
    if (a.kilit || a.biten.has(k.o) || a.acik.includes(+i)) return;
    a.acik.push(+i);
    efekt("cevir");
    if (k.yuz === "es") soyle(k.o.es);
    if (a.acik.length < 2) return parcaYenile(a, ".hafiza");
    a.hamle++;
    const [x, y] = a.acik.map(n => a.kartlar[n]);
    if (x.o === y.o) {
      a.biten.add(x.o);
      a.acik = [];
      efekt("dogru"); titret(15);
      parcaYenile(a, ".hafiza");
      if (a.biten.size === a.ogeler.length) eslesmeBitti(`${a.hamle} hamlede bitirdin.`);
    } else {
      a.kilit = true;
      parcaYenile(a, ".hafiza");
      setTimeout(() => { a.acik = []; a.kilit = false; parcaYenile(a, ".hafiza"); }, 900);
    }
  },
  hc: cevap => {
    if (!hiz || hiz.kilit) return;
    const dogruMu = (cevap === "1") === hiz.soru.dogruMu;
    if (dogruMu) { hiz.art++; hiz.puan += hiz.art >= 5 ? 2 : 1; efekt("dogru"); titret(10); }
    else { hiz.art = 0; efekt("yanlis"); titret([30, 40, 30]); }
    ekran.querySelector(".hiz-kart").classList.add(dogruMu ? "dogru" : "yanlis");
    hiz.kilit = true;
    setTimeout(() => { if (hiz) { hiz.kilit = false; hizSoru(); } }, dogruMu ? 250 : 700);
  },
};

function eslesmeBitti(not) {
  ders.cevaplandi = true;
  const a = ders.adimlar[ders.i];
  xpEkle(a.oyun ? 5 : 2);
  if (a.oyun) { seriGuncelle(); kaydet(); konfeti(); efekt("bitis"); }
  panelGoster("dogru", `${rastgele(OVGULER)} <span class="xp-uc">+${a.oyun ? 5 : 2} XP</span>`, not || "Hepsini eşleştirdin.", "Devam");
}

// Eslestirme/hafizada ekrani bastan cizmeden sadece kartlari yenile (ses kesilmesin)
function parcaYenile(a, secici) {
  const yeni = document.createElement("div");
  yeni.innerHTML = adimIcerik(a);
  ekran.querySelector(secici).replaceWith(yeni.querySelector(secici));
  const hamle = ekran.querySelector(".hamle");
  if (hamle && a.tip === "hafiza") hamle.textContent = `${a.hamle} hamle`;
}

// Dokunulan kelimenin anlamini balonda goster
function anlamBalonu(el) {
  document.querySelectorAll(".anlam-balon").forEach(b => b.remove());
  const k = el.dataset.k;
  const anlam = anlamBul(k);
  soyle(k);
  const r = el.getBoundingClientRect();
  const b = document.createElement("div");
  b.className = "anlam-balon";
  b.innerHTML = `<b>${el.textContent}</b> ${anlam || "—"}`;
  document.body.appendChild(b);
  const sol = Math.min(Math.max(8, r.left + r.width / 2 - b.offsetWidth / 2), window.innerWidth - b.offsetWidth - 8);
  b.style.left = `${sol}px`;
  b.style.top = `${r.top + window.scrollY - b.offsetHeight - 8}px`;
  setTimeout(() => b.remove(), 2600);
}

ekran.addEventListener("click", e => {
  const kel = e.target.closest(".kel");
  if (kel) return anlamBalonu(kel);
  document.querySelectorAll(".anlam-balon").forEach(b => b.remove());
  const el = e.target.closest("[data-is]");
  if (!el) return;
  const i = el.dataset.is.indexOf(":");
  const [is, deger] = i < 0 ? [el.dataset.is, undefined] : [el.dataset.is.slice(0, i), el.dataset.is.slice(i + 1)];
  if (EYLEMLER[is]) EYLEMLER[is](deger, el, e);
});
// Sozlukte arama: yazdikca satirlari ve bos uniteleri gizle
ekran.addEventListener("input", e => {
  if (e.target.id !== "sozluk-ara") return;
  const q = aksansiz(e.target.value);
  ekran.querySelectorAll(".sozluk-unite").forEach(b => {
    let gorunen = 0;
    b.querySelectorAll(".kelime-satir").forEach(s => { const var_ = !q || s.dataset.ara.includes(q); s.hidden = !var_; gorunen += var_; });
    b.hidden = !gorunen;
  });
});
// Yedek dosyasini geri yukle
ekran.addEventListener("change", async e => {
  if (e.target.id !== "yedek-dosya" || !e.target.files[0]) return;
  try {
    const yeni = JSON.parse(await e.target.files[0].text());
    if (!yeni || typeof yeni.kutu !== "object") throw new Error();
    if (!confirm(`Yedekteki ${Object.keys(yeni.kutu).length} kayıt yüklenecek, şimdiki ilerlemenin yerine geçecek. Devam edilsin mi?`)) return;
    D = Object.assign(BOS(), yeni); kaydet(); temaUygula(); sekmeGoster("bugun");
    alert("Yedek yüklendi ✅");
  } catch { alert("Bu dosya bir Paso a Paso yedeği değil."); }
});
ekran.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.id === "yazi") { e.preventDefault(); yaziDegerlendir(false); }
});
document.getElementById("menu").addEventListener("click", e => {
  const b = e.target.closest("[data-sekme]");
  if (b) sekmeGoster(b.dataset.sekme);
});

// Bazi telefonlarda ses listesi gec yuklenir
if ("speechSynthesis" in window) speechSynthesis.getVoices();

// Internetsiz calisma ve verinin telefon tarafindan silinmemesi
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
  navigator.serviceWorker.ready.then(r => r.active && r.active.postMessage("sesleri-indir")).catch(() => {});
}
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

temaUygula();
sekmeGoster("bugun");
