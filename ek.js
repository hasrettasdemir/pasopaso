// Hikayeler ve fiil cekimleri. Her const'un degeri kati JSON olmali
// (cift tirnak, sonda virgul yok) cunku araclar/ses-uret.py bunu okuyor.
//
// Hikaye: kisiler -> {harf: [ad, ses]}  (ses: anlatici, kadin, erkek, garson, nine)
//   satirlar: ["kisi harfi", "ispanyolca", "turkce"]  ya da  ara soru: ["?", "soru", ["dogru", "yanlis", "yanlis"]]
//   sorular: hikaye sonu sorulari, ilk secenek dogru (uygulama karistirir)
//   gerekli: hangi unitenin kelimelerini bilmek gerekiyor (UNITELER sirasi, 0'dan)

const HIKAYELER = [
  {
    "id": "kafe", "ad": "Kafede", "emoji": "☕", "gerekli": 0,
    "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"], "C": ["Garson", "garson"]},
    "satirlar": [
      ["N", "Ana está en una cafetería.", "Ana bir kafede."],
      ["C", "¡Hola! Buenos días.", "Merhaba! Günaydın."],
      ["A", "Buenos días. Un café con leche, por favor.", "Günaydın. Sütlü bir kahve, lütfen."],
      ["C", "¿Algo más?", "Başka bir şey?"],
      ["A", "Sí, un pan con tomate.", "Evet, domatesli bir ekmek."],
      ["?", "Ana ne içmek istiyor?", ["Sütlü kahve", "Çay", "Su"]],
      ["C", "Muy bien. Son tres euros.", "Çok güzel. Üç avro."],
      ["A", "Aquí tiene. Gracias.", "Buyurun. Teşekkürler."],
      ["C", "De nada. ¡Hasta luego!", "Rica ederim. Görüşürüz!"],
      ["N", "Ana bebe su café. Está muy rico.", "Ana kahvesini içiyor. Çok lezzetli."]
    ],
    "sorular": [
      ["Ana nerede?", ["Kafede", "Evde", "Mutfakta"]],
      ["Ana kaç avro ödüyor?", ["Üç", "İki", "On"]],
      ["Kahve nasıl?", ["Çok lezzetli", "Soğuk", "Kötü"]]
    ]
  },
  {
    "id": "aile", "ad": "Benim ailem", "emoji": "👨‍👩‍👧", "gerekli": 3,
    "kisiler": {"P": ["Pedro", "erkek"]},
    "satirlar": [
      ["P", "Hola, me llamo Pedro.", "Merhaba, benim adım Pedro."],
      ["P", "Tengo una familia grande.", "Kalabalık bir ailem var."],
      ["P", "Mi madre se llama Carmen y mi padre se llama Luis.", "Annemin adı Carmen, babamın adı Luis."],
      ["P", "Tengo dos hermanas: Ana y Lucía.", "İki kız kardeşim var: Ana ve Lucía."],
      ["?", "Pedro'nun kaç kız kardeşi var?", ["İki", "Üç", "Bir"]],
      ["P", "Ana tiene veinte años y Lucía tiene diez años.", "Ana yirmi yaşında, Lucía on yaşında."],
      ["P", "Mi abuela vive con nosotros.", "Ninem bizimle yaşıyor."],
      ["P", "Ella hace una sopa muy rica.", "O çok lezzetli bir çorba yapıyor."],
      ["P", "Y tú, ¿tienes hermanos?", "Ya sen, kardeşlerin var mı?"]
    ],
    "sorular": [
      ["Pedro'nun annesinin adı ne?", ["Carmen", "Lucía", "Ana"]],
      ["Pedro'larla kim yaşıyor?", ["Ninesi", "Dedesi", "Bir arkadaşı"]],
      ["Lucía kaç yaşında?", ["On", "Yirmi", "İki"]]
    ]
  },
  {
    "id": "ev", "ad": "Ana'nın evi", "emoji": "🏠", "gerekli": 5,
    "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"]},
    "satirlar": [
      ["N", "Esta es la casa de Ana.", "Bu, Ana'nın evi."],
      ["A", "Mi casa es pequeña, pero bonita.", "Evim küçük ama güzel."],
      ["A", "La puerta es azul y las ventanas son blancas.", "Kapı mavi, pencereler beyaz."],
      ["?", "Kapı ne renk?", ["Mavi", "Kırmızı", "Yeşil"]],
      ["A", "En la cocina hay una mesa y cuatro sillas.", "Mutfakta bir masa ve dört sandalye var."],
      ["A", "Mi cama es grande y muy cómoda.", "Yatağım büyük ve çok rahat."],
      ["A", "En el salón hay un sofá rojo y una televisión.", "Salonda kırmızı bir kanepe ve bir televizyon var."],
      ["A", "Me gusta mucho mi casa.", "Evimi çok seviyorum."]
    ],
    "sorular": [
      ["Ana'nın evi nasıl?", ["Küçük ama güzel", "Büyük ve eski", "Çok soğuk"]],
      ["Mutfakta kaç sandalye var?", ["Dört", "İki", "Altı"]],
      ["Kanepe ne renk?", ["Kırmızı", "Mavi", "Beyaz"]]
    ]
  },
  {
    "id": "anahtar", "ad": "Anahtarlarım nerede?", "emoji": "🔑", "gerekli": 5,
    "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"], "P": ["Pedro", "erkek"]},
    "satirlar": [
      ["P", "¡Ana! ¿Dónde están mis llaves?", "Ana! Anahtarlarım nerede?"],
      ["A", "¿No están en la mesa?", "Masada değil mi?"],
      ["P", "No, no están en la mesa.", "Hayır, masada değiller."],
      ["A", "¿Y en la cocina?", "Ya mutfakta?"],
      ["P", "No... ¡Voy a llegar tarde!", "Hayır... Geç kalacağım!"],
      ["?", "Pedro ne arıyor?", ["Anahtarlarını", "Telefonunu", "Kitabını"]],
      ["A", "Pedro... ¿qué tienes en la mano?", "Pedro... elinde ne var?"],
      ["P", "¡Ay! ¡Mis llaves!", "Ay! Anahtarlarım!"],
      ["N", "Ana se ríe mucho.", "Ana çok gülüyor."]
    ],
    "sorular": [
      ["Anahtarlar neredeymiş?", ["Pedro'nun elinde", "Masada", "Mutfakta"]],
      ["Pedro neden telaşlı?", ["Geç kalacak", "Acıkmış", "Uykusu var"]],
      ["Sonunda Ana ne yapıyor?", ["Gülüyor", "Ağlıyor", "Uyuyor"]]
    ]
  },
  {
    "id": "hafta", "ad": "Sıradan bir hafta", "emoji": "📅", "gerekli": 6,
    "kisiler": {"A": ["Ana", "kadin"]},
    "satirlar": [
      ["A", "De lunes a viernes, trabajo en una oficina.", "Pazartesiden cumaya bir ofiste çalışıyorum."],
      ["A", "Los lunes estoy un poco cansada.", "Pazartesileri biraz yorgunum."],
      ["A", "Los miércoles como con mi madre.", "Çarşambaları annemle yemek yiyorum."],
      ["?", "Ana çarşambaları kiminle yemek yiyor?", ["Annesiyle", "Babasıyla", "Pedro ile"]],
      ["A", "Los jueves leo un libro en el sofá.", "Perşembeleri kanepede kitap okuyorum."],
      ["A", "El viernes por la noche voy al cine con Pedro.", "Cuma akşamı Pedro ile sinemaya gidiyorum."],
      ["A", "El sábado duermo mucho.", "Cumartesi çok uyuyorum."],
      ["A", "Y el domingo... ¡no hago nada!", "Ve pazar... hiçbir şey yapmıyorum!"]
    ],
    "sorular": [
      ["Ana nerede çalışıyor?", ["Bir ofiste", "Bir kafede", "Evde"]],
      ["Ana cuma akşamı ne yapıyor?", ["Sinemaya gidiyor", "Kitap okuyor", "Çok uyuyor"]],
      ["Ana pazar günü ne yapıyor?", ["Hiçbir şey", "Çalışıyor", "Annesiyle yemek yiyor"]]
    ]
  },
  {
    "id": "dogumgunu", "ad": "Ninenin doğum günü", "emoji": "🎂", "gerekli": 7,
    "kisiler": {"N": ["Anlatıcı", "anlatici"], "G": ["Nine", "nine"], "P": ["Pedro", "erkek"], "A": ["Ana", "kadin"]},
    "satirlar": [
      ["N", "Hoy es sábado. Es el cumpleaños de la abuela.", "Bugün cumartesi. Ninenin doğum günü."],
      ["N", "Toda la familia está en su casa.", "Bütün aile onun evinde."],
      ["G", "¡Hola a todos! ¡Qué alegría!", "Herkese merhaba! Ne mutluluk!"],
      ["P", "¡Feliz cumpleaños, abuela! ¿Cuántos años tienes?", "Doğum günün kutlu olsun nine! Kaç yaşındasın?"],
      ["G", "Tengo ochenta años, hijo.", "Seksen yaşındayım, evladım."],
      ["?", "Nine kaç yaşında?", ["Seksen", "Sekiz", "Yirmi"]],
      ["A", "Abuela, aquí tienes tu regalo.", "Nine, işte hediyen."],
      ["G", "¡Un libro! Muchas gracias, Ana.", "Bir kitap! Çok teşekkürler Ana."],
      ["N", "Después, todos comen tarta y beben café.", "Sonra herkes pasta yiyor ve kahve içiyor."]
    ],
    "sorular": [
      ["Bugün günlerden ne?", ["Cumartesi", "Pazar", "Pazartesi"]],
      ["Ana ninesine ne hediye ediyor?", ["Bir kitap", "Bir çiçek", "Bir telefon"]],
      ["Herkes ne yiyor?", ["Pasta", "Çorba", "Balık"]]
    ]
  }
];

// Fiil: [mastar, turkce, [yo, tu, el/ella, nosotros, vosotros, ellos/ellas], grup]
const FIILLER = [
  ["hablar", "konuşmak", ["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"], "ar"],
  ["trabajar", "çalışmak", ["trabajo", "trabajas", "trabaja", "trabajamos", "trabajáis", "trabajan"], "ar"],
  ["comer", "yemek", ["como", "comes", "come", "comemos", "coméis", "comen"], "er"],
  ["beber", "içmek", ["bebo", "bebes", "bebe", "bebemos", "bebéis", "beben"], "er"],
  ["leer", "okumak", ["leo", "lees", "lee", "leemos", "leéis", "leen"], "er"],
  ["vivir", "yaşamak", ["vivo", "vives", "vive", "vivimos", "vivís", "viven"], "ir"],
  ["escribir", "yazmak", ["escribo", "escribes", "escribe", "escribimos", "escribís", "escriben"], "ir"],
  ["ser", "olmak (kalıcı)", ["soy", "eres", "es", "somos", "sois", "son"], "ser"],
  ["estar", "olmak, bulunmak", ["estoy", "estás", "está", "estamos", "estáis", "están"], "ser"],
  ["tener", "sahip olmak", ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"], "duz"],
  ["ir", "gitmek", ["voy", "vas", "va", "vamos", "vais", "van"], "duz"],
  ["querer", "istemek", ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"], "duz"],
  ["hacer", "yapmak", ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"], "duz"],
  ["dormir", "uyumak", ["duermo", "duermes", "duerme", "dormimos", "dormís", "duermen"], "duz"],
  ["hablar", "konuşmak", ["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"], "pret"],
  ["trabajar", "çalışmak", ["trabajé", "trabajaste", "trabajó", "trabajamos", "trabajasteis", "trabajaron"], "pret"],
  ["comer", "yemek", ["comí", "comiste", "comió", "comimos", "comisteis", "comieron"], "pret"],
  ["beber", "içmek", ["bebí", "bebiste", "bebió", "bebimos", "bebisteis", "bebieron"], "pret"],
  ["vivir", "yaşamak", ["viví", "viviste", "vivió", "vivimos", "vivisteis", "vivieron"], "pret"],
  ["escribir", "yazmak", ["escribí", "escribiste", "escribió", "escribimos", "escribisteis", "escribieron"], "pret"],
  ["ir", "gitmek (ser de aynı)", ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"], "pretd"],
  ["tener", "sahip olmak", ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"], "pretd"],
  ["estar", "olmak, bulunmak", ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"], "pretd"],
  ["hacer", "yapmak", ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"], "pretd"],
  ["poder", "-ebilmek", ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"], "pretd"],
  ["decir", "söylemek", ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"], "pretd"],
  ["venir", "gelmek", ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"], "pretd"],
  ["querer", "istemek", ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"], "pretd"],
  ["hablar", "konuşmak", ["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"], "imp"],
  ["comer", "yemek", ["comía", "comías", "comía", "comíamos", "comíais", "comían"], "imp"],
  ["vivir", "yaşamak", ["vivía", "vivías", "vivía", "vivíamos", "vivíais", "vivían"], "imp"],
  ["ser", "olmak", ["era", "eras", "era", "éramos", "erais", "eran"], "imp"],
  ["ir", "gitmek", ["iba", "ibas", "iba", "íbamos", "ibais", "iban"], "imp"],
  ["ver", "görmek", ["veía", "veías", "veía", "veíamos", "veíais", "veían"], "imp"],
  ["tener", "sahip olmak", ["tenía", "tenías", "tenía", "teníamos", "teníais", "tenían"], "imp"],
  ["estar", "olmak, bulunmak", ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"], "imp"]
];

const ZAMIRLER = [["yo", "ben"], ["tú", "sen"], ["él / ella", "o"], ["nosotros", "biz"], ["vosotros", "siz"], ["ellos / ellas", "onlar"]];

const FIIL_GRUPLARI = [
  {"id": "ar", "ad": "-ar fiilleri", "emoji": "🗣️", "not": "Kök + o, as, a, amos, áis, an"},
  {"id": "er", "ad": "-er fiilleri", "emoji": "🍽️", "not": "Kök + o, es, e, emos, éis, en"},
  {"id": "ir", "ad": "-ir fiilleri", "emoji": "🏡", "not": "Kök + o, es, e, imos, ís, en"},
  {"id": "ser", "ad": "ser ve estar", "emoji": "🪞", "not": "İkisi de 'olmak'. ser kalıcı (kim, ne), estar geçici (nerede, nasıl)"},
  {"id": "duz", "ad": "Düzensizler", "emoji": "🌀", "not": "Kurala uymaz, ezberlenir: tengo, voy, quiero, hago, duermo"},
  {"id": "pret", "ad": "Geçmiş: düzenli (pretérito)", "emoji": "⏮️", "not": "Bitmiş, tek seferlik olay",
   "uzun": "Pretérito: geçmişte olup bitmiş, tek seferlik olaylar. Türkçedeki -dı gibi: yedim, gittim.\n-ar: é, aste, ó, amos, asteis, aron\n-er / -ir: í, iste, ió, imos, isteis, ieron\nİpucu kelimeler: ayer (dün), anoche (dün gece), el año pasado (geçen yıl).",
   "cumleler": [
     ["Ayer comí paella.", "Dün paella yedim.", "comí", ["comía", "como"]],
     ["Anoche vimos una película.", "Dün gece bir film izledik.", "vimos", ["veíamos", "vemos"]],
     ["Ella habló con el profesor.", "O öğretmenle konuştu.", "habló", ["hablo", "hablaba"]]
   ]},
  {"id": "pretd", "ad": "Geçmiş: düzensizler", "emoji": "🌪️", "not": "fui, tuve, estuve, hice, dije…",
   "uzun": "En sık kullanılan fiiller pretéritoda düzensizdir, ezberlenir.\nDikkat: ser ve ir aynı çekilir: fui = oldum ya da gittim, anlam cümleden çıkar.\nBu fiillerde vurgu işareti yoktur: tuve, hice, dije, vino.",
   "cumleler": [
     ["El año pasado fui a México.", "Geçen yıl Meksika'ya gittim.", "fui", ["iba", "voy"]],
     ["Ayer estuve en casa todo el día.", "Dün bütün gün evdeydim.", "estuve", ["estoy", "estaré"]],
     ["¿Qué hiciste el fin de semana?", "Hafta sonu ne yaptın?", "hiciste", ["haces", "harás"]]
   ]},
  {"id": "imp", "ad": "Geçmiş: alışkanlık (imperfecto)", "emoji": "🕰️", "not": "Eskiden yapardım, -yordu",
   "uzun": "İmperfecto: geçmişte süregelen, alışkanlık olan ya da betimlenen durumlar. Türkçedeki -ırdı / -yordu gibi: oynardım, yağıyordu.\n-ar: aba, abas, aba, ábamos, abais, aban\n-er / -ir: ía, ías, ía, íamos, íais, ían\nSadece 3 düzensiz: ser (era), ir (iba), ver (veía).\nKısa kural: tek olay → pretérito; arka plan ya da alışkanlık → imperfecto.",
   "cumleler": [
     ["Cuando era pequeño, jugaba en el parque.", "Küçükken parkta oynardım.", "jugaba", ["jugué", "juego"]],
     ["De niña, tenía un perro.", "Küçükken bir köpeğim vardı.", "tenía", ["tuve", "tengo"]],
     ["Mi abuelo siempre contaba historias.", "Dedem hep hikâyeler anlatırdı.", "contaba", ["contó", "cuenta"]],
     ["Mientras leía, sonó el teléfono.", "Ben okurken telefon çaldı.", "sonó", ["sonaba", "suena"]],
     ["Antes vivíamos en Madrid.", "Eskiden Madrid'de yaşardık.", "vivíamos", ["viviremos", "vivir"]]
   ]}
];

// Dokununca anlami gorunen kelimeler (kelime listesinde ve fiil tablosunda olmayanlar).
// Anahtar kucuk harf, noktalamasiz.
const SOZLUK = {
  "a": "-e, -a (yön)", "abre": "aç (abrir)", "al": "-e (a + el)", "alegría": "mutluluk, neşe", "algo": "bir şey",
  "alto": "uzun boylu", "amiga": "arkadaş (kadın)", "aquí": "burada", "aquí tiene": "buyurun", "ay": "ay! (şaşırma)",
  "años": "yıllar, yaş", "blanca": "beyaz (dişi)", "blancas": "beyaz (dişi, çoğul)", "bonita": "güzel, hoş",
  "buenos": "iyi (çoğul)", "buenas": "iyi (dişi, çoğul)", "cafetería": "kafe", "cafés": "kahveler", "caliente": "sıcak", "cansada": "yorgun (kadın)",
  "cielo": "gökyüzü", "cine": "sinema", "coche": "araba", "color": "renk", "con": "ile", "cumpleaños": "doğum günü",
  "cuántos": "kaç tane?", "cómo": "nasıl?", "cómoda": "rahat", "de": "-den, -in", "del": "-in (de + el)", "después": "sonra",
  "dónde": "nerede?", "el": "(erkek artikel)", "ella": "o (kadın)", "ellos": "onlar", "en": "-de, içinde", "es": "-dır, -dir (ser); o ... -dır",
  "español": "İspanyolca", "esta": "bu", "euros": "avro", "favor": "iyilik", "feliz": "mutlu", "flores": "çiçekler",
  "fue": "idi (ser, geçmiş)", "gato": "kedi", "grande": "büyük", "gusta": "hoşuna gidiyor", "gusto": "zevk, memnuniyet",
  "hay": "var", "hermanas": "kız kardeşler", "hermanos": "kardeşler", "hijos": "çocuklar", "la": "(dişi artikel)",
  "las": "(dişi çoğul artikel)", "libros": "kitaplar", "llama": "adı ... (llamarse)", "llamas": "adın ... (llamarse)",
  "llamo": "adım ... (llamarse)", "llaves": "anahtarlar", "llegar": "varmak", "los": "(erkek çoğul artikel)",
  "luego": "sonra", "hasta": "-e kadar; hasta luego = görüşürüz", "mano": "el (vücut), elin", "me": "bana, beni", "mi": "benim", "mis": "benim (çoğul)", "mucho": "çok",
  "muchas": "çok (dişi, çoğul)", "muy": "çok", "más": "daha", "nada": "hiçbir şey", "noches": "geceler", "días": "günler",
  "nosotros": "biz", "ochenta": "seksen", "oficina": "ofis", "pequeña": "küçük", "pequeños": "küçük (çoğul)",
  "pero": "ama", "perro": "köpek", "poco": "biraz", "por": "için, -de", "qué": "ne?", "regalo": "hediye",
  "rica": "lezzetli (dişi)", "rico": "lezzetli", "roja": "kırmızı (dişi)", "rojas": "kırmızı (dişi, çoğul)", "ríe": "gülüyor",
  "salón": "salon", "se": "kendini (dönüşlü)", "señor": "beyefendi", "sillas": "sandalyeler", "su": "onun",
  "tal": "öyle; ¿qué tal? = nasılsın?", "tarde": "geç; öğleden sonra", "tarta": "pasta", "te": "seni, sana",
  "toda": "bütün (dişi)", "todo": "her şey", "todos": "herkes", "tu": "senin", "tú": "sen", "un": "bir (erkek)",
  "una": "bir (dişi)", "ventanas": "pencereler", "y": "ve", "yo": "ben", "voy a": "-eceğim (gelecek)",
  "ana": "Ana (isim)", "pedro": "Pedro (isim)", "carmen": "Carmen (isim)", "lucía": "Lucía (isim)", "luis": "Luis (isim)",
  "maría": "María (isim)", "madrid": "Madrid (şehir)", "barcelona": "Barcelona (şehir)", "turquía": "Türkiye"
};
