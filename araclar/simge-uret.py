"""Uygulama simgesini (PNG) uretir. Harici bagimlilik yok.
Adacayi yesili zemin uzerinde krem renkli uc basamak: paso a paso."""
import struct, zlib, os

ZEMIN = (95, 132, 102)
BASAMAK = (244, 239, 230)

def png(boyut, yol):
    s = boyut
    # basamaklar guvenli alanin (ortadaki %60) icinde
    sol, alt, gen = 0.22 * s, 0.74 * s, 0.56 * s / 3
    yuks = [0.16 * s, 0.30 * s, 0.44 * s]
    satirlar = []
    for y in range(s):
        satir = bytearray([0])
        for x in range(s):
            renk = ZEMIN
            for i, h in enumerate(yuks):
                x0 = sol + i * gen
                if x0 <= x < x0 + gen - 0.02 * s and alt - h <= y < alt:
                    renk = BASAMAK
            satir += bytes(renk)
        satirlar.append(bytes(satir))
    ham = zlib.compress(b"".join(satirlar), 9)
    def parca(tip, veri):
        return struct.pack(">I", len(veri)) + tip + veri + struct.pack(">I", zlib.crc32(tip + veri) & 0xffffffff)
    with open(yol, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + parca(b"IHDR", struct.pack(">IIBBBBB", s, s, 8, 2, 0, 0, 0)) + parca(b"IDAT", ham) + parca(b"IEND", b""))

kok = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for b in (180, 192, 512):
    png(b, os.path.join(kok, f"simge-{b}.png"))
print("simgeler hazir")
