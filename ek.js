// Hikayeler ve fiil cekimleri. Her const'un degeri kati JSON olmali
// (cift tirnak, sonda virgul yok) cunku araclar/ses-uret.py bunu okuyor.
//
// Hikaye: kisiler -> {harf: [ad, ses]}  (ses: anlatici, kadin, erkek, garson, nine)
//   satirlar: ["kisi harfi", "ispanyolca", "turkce"]  ya da  ara soru: ["?", "soru", ["dogru", "yanlis", "yanlis"]]
//   sorular: hikaye sonu sorulari, ilk secenek dogru (uygulama karistirir)
//   gerekli: hangi unitenin kelimelerini bilmek gerekiyor (UNITELER sirasi, 0'dan)

const HIKAYELER = [
{"id": "kafe", "ad": "Kafede", "emoji": "☕", "gerekli": 0, "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"], "C": ["Garson", "garson"]}, "satirlar": [["N", "Ana está en una cafetería.", "Ana bir kafede."], ["C", "¡Hola! Buenos días.", "Merhaba! Günaydın."], ["A", "Buenos días. Un café con leche, por favor.", "Günaydın. Sütlü bir kahve, lütfen."], ["C", "¿Algo más?", "Başka bir şey?"], ["A", "Sí, un pan con tomate.", "Evet, domatesli bir ekmek."], ["?", "Ana ne içmek istiyor?", ["Sütlü kahve", "Çay", "Su"]], ["C", "Muy bien. Son tres euros.", "Çok güzel. Üç avro."], ["A", "Aquí tiene. Gracias.", "Buyurun. Teşekkürler."], ["C", "De nada. ¡Hasta luego!", "Rica ederim. Görüşürüz!"], ["N", "Ana bebe su café. Está muy rico.", "Ana kahvesini içiyor. Çok lezzetli."]], "sorular": [["Ana nerede?", ["Kafede", "Evde", "Mutfakta"]], ["Ana kaç avro ödüyor?", ["Üç", "İki", "On"]], ["Kahve nasıl?", ["Çok lezzetli", "Soğuk", "Kötü"]]]},
{"id": "aile", "ad": "Benim ailem", "emoji": "👨‍👩‍👧", "gerekli": 3, "kisiler": {"P": ["Pedro", "erkek"]}, "satirlar": [["P", "Hola, me llamo Pedro.", "Merhaba, benim adım Pedro."], ["P", "Tengo una familia grande.", "Kalabalık bir ailem var."], ["P", "Mi madre se llama Carmen y mi padre se llama Luis.", "Annemin adı Carmen, babamın adı Luis."], ["P", "Tengo dos hermanas: Ana y Lucía.", "İki kız kardeşim var: Ana ve Lucía."], ["?", "Pedro'nun kaç kız kardeşi var?", ["İki", "Üç", "Bir"]], ["P", "Ana tiene veinte años y Lucía tiene diez años.", "Ana yirmi yaşında, Lucía on yaşında."], ["P", "Mi abuela vive con nosotros.", "Ninem bizimle yaşıyor."], ["P", "Ella hace una sopa muy rica.", "O çok lezzetli bir çorba yapıyor."], ["P", "Y tú, ¿tienes hermanos?", "Ya sen, kardeşlerin var mı?"]], "sorular": [["Pedro'nun annesinin adı ne?", ["Carmen", "Lucía", "Ana"]], ["Pedro'larla kim yaşıyor?", ["Ninesi", "Dedesi", "Bir arkadaşı"]], ["Lucía kaç yaşında?", ["On", "Yirmi", "İki"]]]},
{"id": "ev", "ad": "Ana'nın evi", "emoji": "🏠", "gerekli": 5, "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"]}, "satirlar": [["N", "Esta es la casa de Ana.", "Bu, Ana'nın evi."], ["A", "Mi casa es pequeña, pero bonita.", "Evim küçük ama güzel."], ["A", "La puerta es azul y las ventanas son blancas.", "Kapı mavi, pencereler beyaz."], ["?", "Kapı ne renk?", ["Mavi", "Kırmızı", "Yeşil"]], ["A", "En la cocina hay una mesa y cuatro sillas.", "Mutfakta bir masa ve dört sandalye var."], ["A", "Mi cama es grande y muy cómoda.", "Yatağım büyük ve çok rahat."], ["A", "En el salón hay un sofá rojo y una televisión.", "Salonda kırmızı bir kanepe ve bir televizyon var."], ["A", "Me gusta mucho mi casa.", "Evimi çok seviyorum."]], "sorular": [["Ana'nın evi nasıl?", ["Küçük ama güzel", "Büyük ve eski", "Çok soğuk"]], ["Mutfakta kaç sandalye var?", ["Dört", "İki", "Altı"]], ["Kanepe ne renk?", ["Kırmızı", "Mavi", "Beyaz"]]]},
{"id": "anahtar", "ad": "Anahtarlarım nerede?", "emoji": "🔑", "gerekli": 5, "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"], "P": ["Pedro", "erkek"]}, "satirlar": [["P", "¡Ana! ¿Dónde están mis llaves?", "Ana! Anahtarlarım nerede?"], ["A", "¿No están en la mesa?", "Masada değil mi?"], ["P", "No, no están en la mesa.", "Hayır, masada değiller."], ["A", "¿Y en la cocina?", "Ya mutfakta?"], ["P", "No... ¡Voy a llegar tarde!", "Hayır... Geç kalacağım!"], ["?", "Pedro ne arıyor?", ["Anahtarlarını", "Telefonunu", "Kitabını"]], ["A", "Pedro... ¿qué tienes en la mano?", "Pedro... elinde ne var?"], ["P", "¡Ay! ¡Mis llaves!", "Ay! Anahtarlarım!"], ["N", "Ana se ríe mucho.", "Ana çok gülüyor."]], "sorular": [["Anahtarlar neredeymiş?", ["Pedro'nun elinde", "Masada", "Mutfakta"]], ["Pedro neden telaşlı?", ["Geç kalacak", "Acıkmış", "Uykusu var"]], ["Sonunda Ana ne yapıyor?", ["Gülüyor", "Ağlıyor", "Uyuyor"]]]},
{"id": "hafta", "ad": "Sıradan bir hafta", "emoji": "📅", "gerekli": 6, "kisiler": {"A": ["Ana", "kadin"]}, "satirlar": [["A", "De lunes a viernes, trabajo en una oficina.", "Pazartesiden cumaya bir ofiste çalışıyorum."], ["A", "Los lunes estoy un poco cansada.", "Pazartesileri biraz yorgunum."], ["A", "Los miércoles como con mi madre.", "Çarşambaları annemle yemek yiyorum."], ["?", "Ana çarşambaları kiminle yemek yiyor?", ["Annesiyle", "Babasıyla", "Pedro ile"]], ["A", "Los jueves leo un libro en el sofá.", "Perşembeleri kanepede kitap okuyorum."], ["A", "El viernes por la noche voy al cine con Pedro.", "Cuma akşamı Pedro ile sinemaya gidiyorum."], ["A", "El sábado duermo mucho.", "Cumartesi çok uyuyorum."], ["A", "Y el domingo... ¡no hago nada!", "Ve pazar... hiçbir şey yapmıyorum!"]], "sorular": [["Ana nerede çalışıyor?", ["Bir ofiste", "Bir kafede", "Evde"]], ["Ana cuma akşamı ne yapıyor?", ["Sinemaya gidiyor", "Kitap okuyor", "Çok uyuyor"]], ["Ana pazar günü ne yapıyor?", ["Hiçbir şey", "Çalışıyor", "Annesiyle yemek yiyor"]]]},
{"id": "dogumgunu", "ad": "Ninenin doğum günü", "emoji": "🎂", "gerekli": 7, "kisiler": {"N": ["Anlatıcı", "anlatici"], "G": ["Nine", "nine"], "P": ["Pedro", "erkek"], "A": ["Ana", "kadin"]}, "satirlar": [["N", "Hoy es sábado. Es el cumpleaños de la abuela.", "Bugün cumartesi. Ninenin doğum günü."], ["N", "Toda la familia está en su casa.", "Bütün aile onun evinde."], ["G", "¡Hola a todos! ¡Qué alegría!", "Herkese merhaba! Ne mutluluk!"], ["P", "¡Feliz cumpleaños, abuela! ¿Cuántos años tienes?", "Doğum günün kutlu olsun nine! Kaç yaşındasın?"], ["G", "Tengo ochenta años, hijo.", "Seksen yaşındayım, evladım."], ["?", "Nine kaç yaşında?", ["Seksen", "Sekiz", "Yirmi"]], ["A", "Abuela, aquí tienes tu regalo.", "Nine, işte hediyen."], ["G", "¡Un libro! Muchas gracias, Ana.", "Bir kitap! Çok teşekkürler Ana."], ["N", "Después, todos comen tarta y beben café.", "Sonra herkes pasta yiyor ve kahve içiyor."]], "sorular": [["Bugün günlerden ne?", ["Cumartesi", "Pazar", "Pazartesi"]], ["Ana ninesine ne hediye ediyor?", ["Bir kitap", "Bir çiçek", "Bir telefon"]], ["Herkes ne yiyor?", ["Pasta", "Çorba", "Balık"]]]},
{"id": "tren", "ad": "Sevilla'ya yolculuk", "emoji": "🚆", "seviye": "A2", "gerekli": 24, "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"], "P": ["Pedro", "erkek"], "R": ["Görevli", "garson"]}, "satirlar": [["N", "El verano pasado, Ana y Pedro fueron a Sevilla en tren.", "Geçen yaz Ana ile Pedro trenle Sevilla'ya gittiler."], ["N", "Salieron de Madrid muy temprano.", "Madrid'den çok erken çıktılar."], ["A", "Perdone, ¿de qué andén sale el tren?", "Affedersiniz, tren hangi perondan kalkıyor?"], ["R", "Del andén tres. Sale a las ocho.", "Üç numaralı perondan. Saat sekizde kalkıyor."], ["?", "Tren saat kaçta kalkıyor?", ["Sekizde", "Üçte", "Dokuzda"]], ["N", "En el tren, Pedro durmió y Ana leyó un libro.", "Trende Pedro uyudu, Ana bir kitap okudu."], ["N", "Cuando llegaron, hacía mucho calor.", "Vardıklarında hava çok sıcaktı."], ["P", "¡Qué calor! Necesito agua.", "Ne sıcak! Suya ihtiyacım var."], ["A", "Primero vamos al hotel y después visitamos la catedral.", "Önce otele gidelim, sonra katedrali gezelim."], ["?", "Vardıklarında hava nasıldı?", ["Çok sıcak", "Yağmurlu", "Soğuk"]], ["N", "Por la noche cenaron en una terraza y vieron un espectáculo de flamenco.", "Akşam bir terasta yemek yediler ve bir flamenko gösterisi izlediler."]], "sorular": [["Nereye gittiler?", ["Sevilla'ya", "Barselona'ya", "Madrid'e"]], ["Trende Ana ne yaptı?", ["Kitap okudu", "Uyudu", "Yemek yedi"]], ["Akşam ne izlediler?", ["Flamenko", "Futbol maçı", "Film"]]]},
{"id": "doktor", "ad": "Doktorda", "emoji": "🩺", "seviye": "A2", "gerekli": 25, "kisiler": {"N": ["Anlatıcı", "anlatici"], "P": ["Pedro", "erkek"], "D": ["Doktor", "kadin"]}, "satirlar": [["N", "Ayer Pedro se levantó con dolor de cabeza y fiebre.", "Dün Pedro baş ağrısı ve ateşle uyandı."], ["N", "Por eso no fue al trabajo y llamó al médico.", "Bu yüzden işe gitmedi ve doktoru aradı."], ["D", "Buenos días. ¿Qué le pasa?", "Günaydın. Neyiniz var?"], ["P", "Me duele la cabeza y tengo mucha tos.", "Başım ağrıyor ve çok öksürüğüm var."], ["D", "¿Desde cuándo está así?", "Ne zamandan beri böylesiniz?"], ["P", "Desde el domingo.", "Pazardan beri."], ["?", "Pedro ne zamandan beri hasta?", ["Pazardan beri", "Bir aydır", "Bu sabahtan beri"]], ["D", "Tiene gripe. Tome esta medicina tres veces al día.", "Grip olmuşsunuz. Bu ilacı günde üç kez alın."], ["D", "Y beba mucha agua. En una semana estará mejor.", "Bir de bol su için. Bir haftaya iyileşirsiniz."], ["?", "Pedro ilacı günde kaç kez alacak?", ["Üç", "Bir", "Beş"]], ["N", "Pedro volvió a casa, tomó la medicina y durmió toda la tarde.", "Pedro eve döndü, ilacı aldı ve bütün öğleden sonra uyudu."]], "sorular": [["Pedro neden işe gitmedi?", ["Hastaydı", "Tatildeydi", "Treni kaçırdı"]], ["Doktor ne dedi?", ["Grip olmuş", "Kolu kırık", "Hiçbir şeyi yok"]], ["Ne zaman iyileşecek?", ["Bir haftaya", "Yarın", "Bir aya"]]]},
{"id": "entrevista", "ad": "İş görüşmesi", "emoji": "💼", "seviye": "B1", "gerekli": 41, "kisiler": {"N": ["Anlatıcı", "anlatici"], "A": ["Ana", "kadin"], "J": ["Müdür", "erkek"]}, "satirlar": [["N", "Ana buscaba trabajo desde hacía tres meses.", "Ana üç aydır iş arıyordu."], ["N", "Un día recibió un correo de una empresa de diseño.", "Bir gün bir tasarım şirketinden e-posta aldı."], ["J", "Buenos días, Ana. Cuénteme un poco sobre su experiencia.", "Günaydın Ana. Bana biraz deneyiminden bahset."], ["A", "Trabajé cuatro años en una agencia de publicidad. Allí aprendí a trabajar en equipo.", "Dört yıl bir reklam ajansında çalıştım. Orada ekip çalışmasını öğrendim."], ["J", "¿Y por qué quiere cambiar de trabajo?", "Peki neden iş değiştirmek istiyorsun?"], ["A", "Porque quiero crecer profesionalmente y me interesan los proyectos de su empresa.", "Çünkü mesleki olarak gelişmek istiyorum ve şirketinizin projeleri ilgimi çekiyor."], ["?", "Ana önceden nerede çalıştı?", ["Reklam ajansında", "Bir bankada", "Bir okulda"]], ["J", "Me parece muy bien. Le enviaremos una respuesta la próxima semana.", "Bence çok iyi. Size gelecek hafta bir cevap göndereceğiz."], ["N", "Ana salió nerviosa, pero contenta.", "Ana gergin ama mutlu çıktı."], ["N", "Siete días después, sonó su teléfono: ¡había conseguido el trabajo!", "Yedi gün sonra telefonu çaldı: işi almıştı!"], ["?", "Cevap ne zaman geldi?", ["Bir hafta sonra", "Ertesi gün", "Bir ay sonra"]]], "sorular": [["Ana kaç aydır iş arıyordu?", ["Üç", "Dört", "Yedi"]], ["Ana neden iş değiştirmek istiyor?", ["Mesleki olarak gelişmek için", "Daha az çalışmak için", "Taşındığı için"]], ["Sonunda ne oldu?", ["İşi aldı", "İşi alamadı", "Görüşmeye gitmedi"]]]},
{"id": "pueblo", "ad": "Köydeki değişim", "emoji": "🌳", "seviye": "B1", "gerekli": 43, "kisiler": {"N": ["Anlatıcı", "anlatici"], "G": ["Nine", "nine"], "P": ["Pedro", "erkek"]}, "satirlar": [["N", "Pedro visitó a su abuela en el pueblo durante las vacaciones.", "Pedro tatilde köydeki ninesini ziyaret etti."], ["G", "Cuando yo era joven, aquí llovía mucho y el río siempre tenía agua.", "Ben gençken burada çok yağmur yağardı ve derede hep su olurdu."], ["G", "Ahora los veranos son más largos y el río está casi seco.", "Şimdi yazlar daha uzun ve dere neredeyse kurumuş."], ["P", "Es por el cambio climático, abuela. Es un problema en todo el mundo.", "İklim değişikliği yüzünden nine. Bütün dünyada bir sorun."], ["?", "Nine gençken köyde ne olurdu?", ["Çok yağmur yağardı", "Hiç kar yağmazdı", "Dere kuruydu"]], ["G", "¿Y qué podemos hacer nosotros?", "Peki biz ne yapabiliriz?"], ["P", "Podemos ahorrar agua, reciclar y usar menos el coche.", "Su tasarrufu yapabilir, geri dönüşüm yapabilir ve arabayı daha az kullanabiliriz."], ["P", "Además, el año que viene plantaremos árboles con la escuela del pueblo.", "Ayrıca seneye köy okuluyla ağaç dikeceğiz."], ["G", "Me parece una idea estupenda. Yo os ayudaré.", "Bence harika bir fikir. Ben de size yardım edeceğim."], ["?", "Seneye ne yapacaklar?", ["Ağaç dikecekler", "Ev yapacaklar", "Şehre taşınacaklar"]]], "sorular": [["Pedro nereye gitti?", ["Köydeki ninesine", "Denize", "Okula"]], ["Dere şimdi nasıl?", ["Neredeyse kuru", "Çok dolu", "Donmuş"]], ["Nine ne diyor?", ["Yardım edeceğim", "Bu fikir kötü", "Yorgunum"]]]}
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
  ["estar", "olmak, bulunmak", ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"], "imp"],
  ["hablar", "konuşmak", ["hablaré", "hablarás", "hablará", "hablaremos", "hablaréis", "hablarán"], "fut"],
  ["comer", "yemek", ["comeré", "comerás", "comerá", "comeremos", "comeréis", "comerán"], "fut"],
  ["vivir", "yaşamak", ["viviré", "vivirás", "vivirá", "viviremos", "viviréis", "vivirán"], "fut"],
  ["ir", "gitmek", ["iré", "irás", "irá", "iremos", "iréis", "irán"], "fut"],
  ["ser", "olmak", ["seré", "serás", "será", "seremos", "seréis", "serán"], "fut"],
  ["estar", "olmak, bulunmak", ["estaré", "estarás", "estará", "estaremos", "estaréis", "estarán"], "fut"],
  ["tener", "sahip olmak", ["tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán"], "futd"],
  ["hacer", "yapmak", ["haré", "harás", "hará", "haremos", "haréis", "harán"], "futd"],
  ["poder", "-ebilmek", ["podré", "podrás", "podrá", "podremos", "podréis", "podrán"], "futd"],
  ["decir", "söylemek", ["diré", "dirás", "dirá", "diremos", "diréis", "dirán"], "futd"],
  ["venir", "gelmek", ["vendré", "vendrás", "vendrá", "vendremos", "vendréis", "vendrán"], "futd"],
  ["salir", "çıkmak", ["saldré", "saldrás", "saldrá", "saldremos", "saldréis", "saldrán"], "futd"],
  ["saber", "bilmek", ["sabré", "sabrás", "sabrá", "sabremos", "sabréis", "sabrán"], "futd"],
  ["querer", "istemek", ["querré", "querrás", "querrá", "querremos", "querréis", "querrán"], "futd"]
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
   ]},
  {"id": "fut", "ad": "Gelecek zaman (futuro)", "emoji": "🔮", "not": "Mastar + é, ás, á, emos, éis, án",
   "uzun": "Futuro: ileride olacak şeyler. Türkçedeki -ecek gibi: konuşacağım, yiyeceğiz.\nÇok kolay: kök yok, mastarın tamamına ek gelir.\nBütün fiillerde aynı ekler: é, ás, á, emos, éis, án\nKonuşmada daha sık: ir a + mastar → voy a comer (yiyeceğim).\nİpucu kelimeler: mañana (yarın), la próxima semana (gelecek hafta).",
   "cumleler": [
     ["Mañana hablaré con mi jefe.", "Yarın patronumla konuşacağım.", "hablaré", ["hablé", "hablo"]],
     ["El año que viene viviremos en Sevilla.", "Seneye Sevilla'da yaşayacağız.", "viviremos", ["vivimos", "vivíamos"]],
     ["Esta noche voy a cocinar.", "Bu akşam yemek pişireceğim.", "voy", ["fui", "iba"]],
     ["¿Irás a la fiesta el sábado?", "Cumartesi partiye gidecek misin?", "Irás", ["Fuiste", "Ibas"]],
     ["Mañana estará nublado.", "Yarın hava bulutlu olacak.", "estará", ["estuvo", "estaba"]]
   ]},
  {"id": "futd", "ad": "Gelecek: düzensizler", "emoji": "🚀", "not": "tendré, haré, podré, diré, vendré…",
   "uzun": "Bu fiillerde ekler aynı (é, ás, á, emos, éis, án), sadece kök değişir:\ntener → tendr-, venir → vendr-, salir → saldr-\npoder → podr-, saber → sabr-, querer → querr-\nhacer → har-, decir → dir-",
   "cumleler": [
     ["El lunes tendré un examen.", "Pazartesi sınavım olacak.", "tendré", ["tuve", "tengo"]],
     ["Mañana haremos una fiesta.", "Yarın bir parti yapacağız.", "haremos", ["hicimos", "hacemos"]],
     ["¿Vendrás a mi casa?", "Evime gelecek misin?", "Vendrás", ["Viniste", "Venías"]],
     ["Te diré la verdad.", "Sana doğruyu söyleyeceğim.", "diré", ["dije", "decía"]],
     ["No podremos salir esta noche.", "Bu akşam çıkamayacağız.", "podremos", ["pudimos", "podemos"]]
   ]},
  {"id": "nesne", "ad": "Nesne zamirleri", "emoji": "🎯", "zamirsiz": true, "not": "me, te, lo/la, le, nos, os, los/las",
   "uzun": "Nesne zamirleri fiilden ÖNCE gelir: Te quiero = Seni seviyorum.\nme beni · te seni · lo onu (erkek/şey) · la onu (kadın/şey) · nos bizi · os sizi · los/las onları\nKime? sorusuna le / les: Le doy un libro = Ona bir kitap veriyorum.\nMastarda sona yapışabilir: Voy a llamarte = Seni arayacağım.",
   "cumleler": [
     ["Te quiero mucho.", "Seni çok seviyorum.", "Te", ["Me", "Lo"]],
     ["¿Me ayudas, por favor?", "Bana yardım eder misin lütfen?", "Me", ["Te", "Nos"]],
     ["Compré un libro y lo leí.", "Bir kitap aldım ve onu okudum.", "lo", ["la", "los"]],
     ["Tengo una manzana. La como.", "Bir elmam var. Onu yiyorum.", "La", ["Lo", "Las"]],
     ["Mis padres nos visitan los domingos.", "Annemler bizi pazarları ziyaret ediyor.", "nos", ["os", "los"]],
     ["Le doy un regalo a mi madre.", "Anneme bir hediye veriyorum.", "Le", ["La", "Lo"]],
     ["¿Las flores? Las compré ayer.", "Çiçekler mi? Onları dün aldım.", "Las", ["Los", "La"]],
     ["Voy a llamarte mañana.", "Yarın seni arayacağım.", "llamarte", ["llamarme", "llamarlo"]]
   ]}
];

// Dokununca anlami gorunen kelimeler (kelime listesinde ve fiil tablosunda olmayanlar).
// Anahtar kucuk harf, noktalamasiz.
const SOZLUK = {
  "a": "-e, -a (yön)", "abre": "aç (abrir)", "agencia": "ajans", "al": "-e (a + el)", "alegría": "mutluluk, neşe",
  "algo": "bir şey", "alto": "uzun boylu", "amiga": "arkadaş (kadın)", "ana": "Ana (isim)", "andén": "peron",
  "aprendí": "öğrendim (aprender)", "aquí": "burada", "aquí tiene": "buyurun", "así": "böyle", "ay": "ay! (şaşırma)",
  "ayudaré": "yardım edeceğim (ayudar)", "años": "yıllar, yaş", "barcelona": "Barcelona (şehir)", "beba": "için (beber)", "blanca": "beyaz (dişi)",
  "blancas": "beyaz (dişi, çoğul)", "bonita": "güzel, hoş", "buenas": "iyi (dişi, çoğul)", "buenos": "iyi (çoğul)", "buscaba": "arıyordu (buscar)",
  "cafetería": "kafe", "cafés": "kahveler", "caliente": "sıcak", "calor": "sıcak", "cansada": "yorgun (kadın)",
  "carmen": "Carmen (isim)", "catedral": "katedral", "cenaron": "akşam yemeği yediler (cenar)", "cielo": "gökyüzü", "cine": "sinema",
  "climático": "iklim (sıfat)", "coche": "araba", "color": "renk", "con": "ile", "conseguido": "elde etmiş (conseguir)",
  "contenta": "mutlu", "crecer": "büyümek, gelişmek", "cumpleaños": "doğum günü", "cuántos": "kaç tane?", "cuénteme": "anlatın bana (contar)",
  "cómo": "nasıl?", "cómoda": "rahat", "de": "-den, -in", "del": "-in (de + el)", "después": "sonra",
  "diseño": "tasarım", "duele": "ağrıyor (doler)", "durmió": "uyudu (dormir)", "días": "günler", "dónde": "nerede?",
  "el": "(erkek artikel)", "ella": "o (kadın)", "ellos": "onlar", "en": "-de, içinde", "enviaremos": "göndereceğiz (enviar)",
  "es": "-dır, -dir (ser); o ... -dır", "eso": "bu, o", "español": "İspanyolca", "espectáculo": "gösteri", "esta": "bu",
  "estupenda": "harika", "euros": "avro", "favor": "iyilik", "feliz": "mutlu", "flamenco": "flamenko",
  "flores": "çiçekler", "fue": "idi (ser, geçmiş)", "gato": "kedi", "grande": "büyük", "gripe": "grip",
  "gusta": "hoşuna gidiyor", "gusto": "zevk, memnuniyet", "había": "-mıştı (haber)", "hacía": "yapıyordu; hava … idi (hacer)", "hasta": "-e kadar; hasta luego = görüşürüz",
  "hay": "var", "hermanas": "kız kardeşler", "hermanos": "kardeşler", "hijos": "çocuklar", "interesan": "ilgimi çekiyor (interesar)",
  "la": "(dişi artikel)", "largos": "uzun", "las": "(dişi çoğul artikel)", "le": "ona, size", "levantó": "kalktı (levantarse)",
  "leyó": "okudu (leer)", "libros": "kitaplar", "llama": "adı ... (llamarse)", "llamas": "adın ... (llamarse)", "llamo": "adım ... (llamarse)",
  "llamó": "aradı (llamar)", "llaves": "anahtarlar", "llegar": "varmak", "llegaron": "vardılar (llegar)", "llovía": "yağmur yağardı (llover)",
  "los": "(erkek çoğul artikel)", "lucía": "Lucía (isim)", "luego": "sonra", "luis": "Luis (isim)", "madrid": "Madrid (şehir)",
  "mano": "el (vücut), elin", "maría": "María (isim)", "me": "bana, beni", "mejor": "daha iyi", "menos": "daha az",
  "meses": "aylar", "mi": "benim", "mis": "benim (çoğul)", "mucha": "çok", "muchas": "çok (dişi, çoğul)",
  "mucho": "çok", "mundo": "dünya", "muy": "çok", "más": "daha", "nada": "hiçbir şey",
  "necesito": "ihtiyacım var (necesitar)", "nerviosa": "gergin", "noches": "geceler", "nosotros": "biz", "ochenta": "seksen",
  "oficina": "ofis", "os": "size, sizi", "parece": "görünüyor; me parece = bence", "pasa": "oluyor (pasar)", "pedro": "Pedro (isim)",
  "pequeña": "küçük", "pequeños": "küçük (çoğul)", "perdone": "affedersiniz", "pero": "ama", "perro": "köpek",
  "plantaremos": "dikeceğiz (plantar)", "poco": "biraz", "podemos": "-ebiliriz (poder)", "por": "için, -de", "por eso": "bu yüzden",
  "profesionalmente": "mesleki olarak", "proyectos": "projeler", "próxima": "gelecek, sonraki", "publicidad": "reklam", "que": "ki, -en (bağlaç)", "que viene": "gelecek (el año que viene = seneye)",
  "qué": "ne?", "recibió": "aldı (recibir)", "regalo": "hediye", "rica": "lezzetli (dişi)", "rico": "lezzetli",
  "roja": "kırmızı (dişi)", "rojas": "kırmızı (dişi, çoğul)", "ríe": "gülüyor", "sale": "kalkıyor, çıkıyor (salir)", "salieron": "çıktılar (salir)",
  "salió": "çıktı (salir)", "salón": "salon", "se": "kendini (dönüşlü)", "seco": "kuru", "sevilla": "Sevilla (şehir)",
  "señor": "beyefendi", "sillas": "sandalyeler", "sonó": "çaldı (sonar)", "su": "onun", "tal": "öyle; ¿qué tal? = nasılsın?",
  "tarde": "geç; öğleden sonra", "tarta": "pasta", "te": "seni, sana", "terraza": "teras", "toda": "bütün (dişi)",
  "todo": "her şey", "todos": "herkes", "tome": "alın (tomar)", "tomó": "aldı (tomar)", "tu": "senin",
  "turquía": "Türkiye", "tú": "sen", "un": "bir (erkek)", "una": "bir (dişi)", "veces": "kez, defa",
  "ventanas": "pencereler", "veranos": "yazlar", "viene": "geliyor (venir)", "vieron": "gördüler, izlediler (ver)", "visitamos": "geziyoruz, gezelim (visitar)",
  "visitó": "ziyaret etti (visitar)", "volvió": "döndü (volver)", "voy a": "-eceğim (gelecek)", "y": "ve", "yo": "ben",
  "árboles": "ağaçlar"
};
