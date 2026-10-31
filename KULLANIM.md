# Paso a Paso — Kullanım Rehberi

## 1. Telefona kurmak (bir kere yapılır)

Uygulamanın adresi: **https://hasrettasdemir.github.io/pasopaso/**

İlk açılışta uygulamayı internete bağlıyken **1 dakika açık bırak**: bu sürede bütün sesler telefona kaydedilir,
sonra internetsiz de çalışır.

**iPhone'da:**
1. Yukarıdaki adresi **Safari** ile aç (Chrome'da bu özellik yok).
2. Alttaki **Paylaş** düğmesine bas (kare ve yukarı ok).
3. **Ana Ekrana Ekle**'ye bas.
4. Ana ekranda yeşil, basamaklı simge çıkar. Artık normal bir uygulama gibi açılır ve internetsiz çalışır.

**Android'de:**
1. Adresi **Chrome** ile aç.
2. Sağ üstteki üç noktaya bas, sonra **Ana ekrana ekle**'ye ya da **Uygulamayı yükle**'ye bas.

## 2. Nasıl çalışmalı?

- **Her gün "Bugün" sekmesinden başla.** Uygulama o gün tekrar etmen gerekenleri kendisi seçer.
  Günde 5-10 dakika, haftada bir uzun oturumdan çok daha etkilidir.
- Tekrarın bitince **5 yeni kelime** öğren. Ünite ünite ilerle.
- Bir kelime ünitesini bitirince aynı ünitenin **Cümle** dersine geç.
- 🔊 düğmesine bol bol bas ve kelimeyi **sesli tekrar et**. Dinleyip söylemek ezberi çok hızlandırır.
- Kart renklerine dikkat et: **mavi = el (erkek)**, **şeftali = la (dişi)**.
  Kelimeyi hep artikeliyle birlikte ezberle.
- **Sözlük** sekmesinde her kelimenin yanında 5 nokta var. Dolu nokta sayısı, o kelimeyi ne kadar
  iyi bildiğini gösterir.

## Uygulamada neler var?

- **Bugün:** günlük hedef halkası, seri, rozetler ve **Günün dersi**. Her gün buradan başla.
- **Kelime:** her derste 5 yeni kelime. Önce görsel ve sesle tanışırsın, sonra oyunlarla pekiştirirsin.
- **Cümle:** cümle alıştırmaları ve **fiil çekimi** (ben konuşurum, sen konuşursun…).
- **Hikaye:** kısa hikayeleri dinle. Bilmediğin kelimeye dokun, anlamı çıkar. **TR**'ye basınca o satırın Türkçesi görünür.
- **Sözlük:** bütün kelimeler ve fiil tabloları.
- **⚙️ Ayarlar** (Bugün sayfasının sağ üstü): renk teması, günlük hedef, ses efektleri, konuşma hızı, konuşma alıştırmaları.

**Yazma soruları:** telefon klavyesinde á, ñ gibi harfleri bulmak zorsa, kutunun altındaki harf düğmelerini kullan.
Aksanı unutursan ya da tek harf yanlış yazarsan yine doğru sayılır, sadece not düşülür.

**Sesli söyle soruları:** 🎤 düğmesine bas ve cümleyi söyle. İlk seferde telefon mikrofon izni ister, **İzin ver** de.
Toplu taşımada ya da sessiz bir yerdeysen **Şu an konuşamıyorum**'a bas: bir saat boyunca konuşma sorusu gelmez.

## 3. Bilgisayarda denemek

1. **Terminal**'i aç: `Cmd + Boşluk` tuşlarına bas, "Terminal" yaz, Enter'a bas.
2. `cd ` yaz (sonunda bir boşluk olsun). Sonra Finder'dan **Ispanyolca** klasörünü Terminal
   penceresine sürükle. Klasörün yolu kendiliğinden yazılır. Enter'a bas.
   (`cd`, "bu klasörün içine gir" demek.)
3. `./calistir.sh` yaz, Enter'a bas.
4. Tarayıcıda **http://localhost:8765** adresini aç.
5. Kapatmak için Terminal'de `Ctrl + C` tuşlarına bas.

## 4. Yeni kelime eklemek

`veri.js` dosyasını metin düzenleyiciyle aç. Her satır bir kelime:

```
["la mesa", "masa", "🍽️", "Üstünde yemek yenen eşya", "Türkçedeki 'masa' ile neredeyse aynı!"],
```
Sırasıyla: İspanyolca (artikeliyle), Türkçe, emoji, açıklama, hatırlatıcı (hatırlatıcı yazmak zorunlu değil).

Değiştirdikten sonra Terminal'de uygulamanın klasöründe şunu yaz:

```
./yayinla.sh
```
Bu komut eksik sesleri üretir, sürümü artırır ve siteyi günceller. 1-2 dakika sonra telefonda uygulamayı
kapatıp iki kez açınca yeni hâli gelir. Sürükle-bırak ya da Netlify'a gerek yok.

## Bir şey ters giderse

| sorun | çözüm |
|---|---|
| 🔊 basınca ses gelmiyor | iPhone'da sessiz moddaysa kapat. Ayarlar → Erişilebilirlik → Seslendirilen İçerik → Sesler → İspanyolca'dan bir ses indir |
| Ses robot gibi | Sesler şimdilik bilgisayar sesi. ElevenLabs alınca gerçek insan sesine geçilecek |
| Yaptığım değişiklik telefonda görünmüyor | Uygulamayı tamamen kapatıp yeniden aç; yeni sürüm ikinci açılışta gelir |
| 🎤 çalışmıyor | Ayarlar → Safari (ya da Chrome) → Mikrofon iznine bak. Olmuyorsa uygulamada ⚙️ → Konuşma alıştırmaları: Kapalı |
| `permission denied` hatası | Terminal'de önce `chmod +x calistir.sh` yaz, sonra tekrar dene |
| `Address already in use` hatası | Uygulama zaten açık. Tarayıcıda http://localhost:8765 adresine git |
| İlerlemem silindi | Safari'nin "geçmişi temizle" özelliği uygulama verisini de siler. Uygulamayı ana ekrandan açınca bu daha az olur |

**Güvence:** Uygulama ve scriptler bilgisayarındaki hiçbir dosyayı silmez ya da değiştirmez.
İlerlemen yalnızca telefonda saklanır, hiçbir yere gönderilmez.
