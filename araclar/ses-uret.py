"""veri.js ve ek.js'deki her kelime, cumle, fiil cekimi ve hikaye satiri icin
ses dosyasi uretir (ses/ klasorune). Hikayelerde her karakterin kendi sesi var.
Harici bagimlilik yok.

Kullanim:
  python3 araclar/ses-uret.py                      # Mac'in Monica sesiyle (ucretsiz)
  KAYNAK=elevenlabs SES_ID=... python3 araclar/ses-uret.py
                                                   # ElevenLabs ile (~/.elevenlabs-key okunur)
                                                   # karakterlere ayri ses: SES_ID_KADIN, SES_ID_ERKEK,
                                                   # SES_ID_GARSON, SES_ID_NINE (yoksa SES_ID)
  YENIDEN=1 python3 araclar/ses-uret.py            # var olanlari da bastan uret

Var olan dosyayi atlar; yarida kesilirse tekrar calistirmak yeter.
Sonunda ses/liste.js yazilir: uygulama hangi metnin dosyasi oldugunu oradan bilir.
"""
import json, os, re, subprocess, sys, tempfile, unicodedata, urllib.request

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SES = os.path.join(KOK, "ses")
KAYNAK = os.environ.get("KAYNAK", "mac")
YENIDEN = os.environ.get("YENIDEN") == "1"


def ad(metin):
    """uygulama.js'deki sesAdi() ile birebir ayni olmali."""
    s = unicodedata.normalize("NFD", metin.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


MAC_SESLERI = {"anlatici": "Mónica", "kadin": "Flo (İspanyolca (İspanya))", "erkek": "Eddy (İspanyolca (İspanya))",
               "garson": "Reed (İspanyolca (İspanya))", "nine": "Grandma (İspanyolca (İspanya))"}
ZAMIR_SES = ["yo", "tú", "ella", "nosotros", "vosotros", "ellos"]


def ek_veri(ad_):
    d = open(os.path.join(KOK, "ek.js"), encoding="utf-8").read()
    return json.loads(re.search(r"const " + ad_ + r" = (.*?);\n", d, re.S).group(1))


def parcalar(cumle):
    for p in cumle.split(" "):
        p = re.sub(r"[¿?¡!.,:]", "", p)
        if p:
            yield p.lower()


def metinler():
    """{dosya anahtari: (metin, ses rolu)}: kelimeler, cumleler, cumle parcalari,
    fiil cekimleri ("nosotros comemos") ve hikaye satirlari ("h-kafe-3")."""
    veri = "".join(open(os.path.join(KOK, f), encoding="utf-8").read() for f in sorted(os.listdir(KOK)) if re.match(r"veri.*\.js$", f))
    satirlar = re.findall(r'^\s*\["([^"]+)"', veri, re.M)
    sonuc = {}
    def ekle(anahtar, metin, rol="anlatici"):
        sonuc.setdefault(anahtar, (metin, rol))
    for s in satirlar:
        ekle(ad(s), s)
        if " " in s and re.search(r"[.?!]$", s):
            for p in parcalar(s):
                ekle(ad(p), p)
    for mastar, _, formlar, _ in ek_veri("FIILLER"):
        ekle(ad(mastar), mastar)
        for i, f in enumerate(formlar):
            ekle(ad(f), f)
            ekle(ad(f"{ZAMIR_SES[i]} {f}"), f"{ZAMIR_SES[i]} {f}")
    for h in ek_veri("HIKAYELER"):
        for n, (kim, metin, _) in enumerate(h["satirlar"]):
            if kim == "?":
                continue
            ekle(ad(f"h {h['id']} {n}"), metin, h["kisiler"][kim][1])
            for p in parcalar(metin):
                ekle(ad(p), p)
    return sonuc


def mac(metin, yol, rol):
    with tempfile.NamedTemporaryFile(suffix=".aiff") as gecici:
        subprocess.run(["say", "-v", MAC_SESLERI[rol], "-r", "165", "-o", gecici.name, metin], check=True)
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-c", "1", "-b", "48000", gecici.name, yol], check=True)


def elevenlabs(metin, yol, rol):
    anahtar = open(os.path.expanduser("~/.elevenlabs-key")).read().strip()
    ses_id = os.environ.get("SES_ID_" + rol.upper()) or os.environ["SES_ID"]
    istek = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ses_id}?output_format=mp3_44100_64",
        data=json.dumps({"text": metin, "model_id": os.environ.get("MODEL", "eleven_multilingual_v2"),
                         "language_code": "es"}).encode(),
        headers={"xi-api-key": anahtar, "Content-Type": "application/json"})
    with urllib.request.urlopen(istek) as yanit, open(yol, "wb") as f:
        f.write(yanit.read())


def main():
    os.makedirs(SES, exist_ok=True)
    uzanti = ".mp3" if KAYNAK == "elevenlabs" else ".m4a"
    uret = elevenlabs if KAYNAK == "elevenlabs" else mac
    liste = {}
    yeni = 0
    for anahtar, (metin, rol) in metinler().items():
        dosya = anahtar + uzanti
        yol = os.path.join(SES, dosya)
        if YENIDEN or not os.path.exists(yol):
            try:
                uret(metin, yol, rol)
                yeni += 1
            except Exception as hata:
                print(f"  atlandi: {metin} ({hata})", file=sys.stderr)
                continue
        liste[anahtar] = dosya
    # eski kaynaktan kalan dosyalar da listede dursun (once yeni uzanti)
    for f in sorted(os.listdir(SES)):
        k, u = os.path.splitext(f)
        if u in (".mp3", ".m4a"):
            liste.setdefault(k, f)
    with open(os.path.join(SES, "liste.js"), "w", encoding="utf-8") as f:
        f.write("// araclar/ses-uret.py uretti, elle duzenleme\nconst SESLER = " + json.dumps(liste, ensure_ascii=False) + ";\n")
    print(f"{yeni} yeni ses uretildi, toplam {len(liste)}")


main()
