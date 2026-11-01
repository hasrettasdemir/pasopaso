# Paso a Paso — sıfırdan İspanyolca öğrenmek için telefon uygulaması

Kelime, cümle, fiil çekimi ve hikayelerden oluşan, telefona kurulabilen bir web uygulaması (PWA).
Seviye testiyle başlar. Akıllı tekrarla (Leitner kutuları) bilemediğin şeyi daha sık sorar.
Kelimeyi öğrendikçe sorular zorlaşır: önce seçmeli, sonra dinleme, yazma ve konuşma.
Bütün sesler uygulamanın içinde; telefonda internetsiz çalışır, ilerleme telefonda saklanır.
**Harici bağımlılık yok.** Sadece HTML ve JavaScript. Bilgisayarda denemek ve ses üretmek için Python 3 yeterli.

Yayında: **https://hasrettasdemir.github.io/pasopaso/** (GitHub Pages, depo: `hasrettasdemir/pasopaso`)

Eski adresler: `pasopasospanish.netlify.app` (Netlify ücretsiz kredisi bitti, eski sürümde kaldı),
`pasopaso.pages.dev` (Cloudflare Pages; **pages.dev Türkiye'de erişime kapalı**, kullanılmıyor).

## Kurulum
```bash
./calistir.sh
```
Sonra tarayıcıda `http://localhost:8765` adresini aç. Telefona kurmak için [KULLANIM.md](KULLANIM.md) dosyasına bak.

## Komutlar
| komut | ne yapar |
|---|---|
| `./calistir.sh` | uygulamayı bilgisayarda açar (http://localhost:8765) |
| `./yayinla.sh` | **siteyi günceller**: eksik sesleri üretir, `sw.js` sürümünü artırır, GitHub'a gönderir (1-2 dk'da yayında) |
| `python3 araclar/ses-uret.py` | eksik ses dosyalarını Mac sesleriyle üretir (`ses/`). Yeni içerik ekleyince çalıştır |
| `KAYNAK=elevenlabs SES_ID=... python3 araclar/ses-uret.py` | sesleri ElevenLabs ile üretir (`YENIDEN=1` eklersen eskilerin yerine). Karakterlere ayrı ses: `SES_ID_KADIN`, `SES_ID_ERKEK`, `SES_ID_GARSON`, `SES_ID_NINE` |
| `python3 araclar/simge-uret.py` | uygulama simgelerini (simge-180/192/512.png) yeniden üretir |

## Dosyalar
| dosya | ne var |
|---|---|
| `veri.js` | ilk 8 A1 ünitesi: 107 kelime, 65 cümle (görsel, açıklama, hatırlatıcı) |
| `veri-a1.js`, `veri-a2.js`, `veri-b1.js` | 44 ünite daha: A1 16, A2 14, B1 14 ünite. **Toplam 52 ünite, 998 kelime, 329 cümle** |
| `ek.js` | 6 hikaye, 14 fiilin çekim tablosu, dokununca anlam gösteren sözlük. **Kesin JSON**: ses aracı bu dosyayı okuyor |
| `uygulama.js` | ekranlar, 20 alıştırma tipi, akıllı tekrar, XP, rozetler |
| `stil.css` | 6 tema: Otomatik, Krem, Bulut, Nane, Lavanta, Gece |
| `ses/` | ~2050 ses dosyası + `liste.js` (ses aracı yazar, elle düzenleme) |
| `sw.js` | internetsiz çalışma. İçerik değişince `SURUM` bir artırılır |

## Alıştırma türleri
| bölüm | yöntem |
|---|---|
| İlk açılış | seviye testi: A1, A2, B1'den 3'er rastgele ünite (ünite başına 3 soru), "Bilmiyorum" seçeneği. Bir seviyenin test edilen üniteleri tam bilinirse o seviyenin hepsi bilinir sayılır. İki zayıf ünitede erken biter |
| Kelime | tanıtım kartı · görselden seç · anlamını seç · açıklamadan bul · dinle ve seç · harfleri diz · **yazarak cevapla** · **dikte** · **sesli söyle** · eşleştirme · hafıza |
| Cümle | boşluk doldurma · **yazarak boşluk doldurma** · anlamını seç · kelimeleri sırala · **dikte** · **sesli söyle** |
| Fiil çekimi | kural kartı · çekim tablosu (dokununca okunur) · doğru çekimi seç · **doğru çekimi yaz** (5 grup: -ar, -er, -ir, ser/estar, düzensizler) |
| Hikaye | karakterlerin kendi sesiyle sohbet balonları · kelimeye dokununca anlam · satır satır Türkçesi · ara sorular · sonda 3 soru, yıldız |
| Bugün | günün dersi (zamanı gelen her şey) · zorlandıkların · hızlı tur (60 sn) · hafıza oyunu |

Zorluk merdiveni: kutu 0-1 seçmeli ve görselli; 2 açıklama, dinleme, harf dizme; 3 yazma; 4+ dikte ve konuşma.
Yazarken aksan, artikel ya da tek harf hatası doğru sayılır ve not düşülür (Duolingo gibi).

**Oyunlaştırma:** her doğru cevap 2 XP (5'li seride 3), ders sonu 5 XP, hatasız ders +5.
Günlük hedef 20/40/80/120 XP (Ayarlar). Gün serisi, son 7 gün şeridi, 12 rozet, maskot Vulpes (tilki), konfeti ve kısa ses efektleri.
Telefonda "hareketi azalt" açıksa animasyonlar kapanır.

## Veri kaynakları
| Kaynak | Ne verir | Anahtar |
|---|---|---|
| `veri.js`, `ek.js` (elle yazıldı, ajanla iki kez doğrulandı) | kelime, cümle, hikaye, fiil, sözlük | yok |
| Mac sesleri: Mónica (anlatıcı), Flo (Ana), Eddy (Pedro), Reed (garson), Grandma (nine) | `ses/*.m4a` | yok |
| Telefonun kendi sesi (Web Speech) | ses dosyası olmayan metin için yedek | yok |
| Telefonun konuşma tanıma özelliği (Web Speech) | "sesli söyle" alıştırması | yok |

## Bilinen sınırlar
- **Sesler şimdilik Mac sesleri**: anlaşılır ama robotik. ElevenLabs'e geçilecek (`ses-uret.py KAYNAK=elevenlabs`).
- **Konuşma alıştırması** telefonun konuşma tanımasına bağlı. iPhone'da ana ekrandan açılan uygulamada çalışmayabilir.
  Çalışmazsa "Şu an konuşamıyorum" o soruyu cezasız geçer ve bir saat boyunca konuşma sorusu gelmez. Ayarlar'dan tamamen kapatılabilir.
  Benzerlik eşiği %60: telaffuzu kabaca kontrol eder, ince hataları yakalamaz.
- **İlerleme sadece o telefonda.** Başka cihaza geçmez. Tarayıcı verisi silinirse ilerleme de silinir.
- Siteye yeni sürüm yüklenince telefon bunu uygulamanın **ikinci** açılışında gösterir.
- İlk açılışta uygulama dosyaları hemen, ~2000 ses dosyası (~20 MB) arka planda azar azar telefona iner. Bitene kadar internetsiz çalışırken bazı sesler telefonun kendi sesiyle okunur. Uygulama her açılışta eksik sesleri tamamlar.
- Kelimeler B1'e kadar; hikayeler ve fiil tabloları hâlâ A1 düzeyinde (şimdiki zaman). A2/B1 hikayeleri ve geçmiş zaman tabloları henüz yok.
- Yeni ünitelerin cümlelerindeki her kelimeye dokununca anlam çıkmayabilir (sözlük ilk 8 ünite ve hikayeler için tam).
