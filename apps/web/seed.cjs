const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT NOT NULL,
    excerpt TEXT NOT NULL, content_body TEXT NOT NULL, featured_image TEXT NOT NULL,
    source_name TEXT NOT NULL, source_url TEXT NOT NULL, published_at TEXT NOT NULL,
    locale TEXT NOT NULL, category TEXT NOT NULL, UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT NOT NULL, product_slug TEXT NOT NULL,
    product_image TEXT NOT NULL, description_short TEXT NOT NULL, price_display TEXT NOT NULL,
    price_amount REAL NOT NULL, affiliate_link TEXT NOT NULL, partner_name TEXT NOT NULL,
    locale TEXT NOT NULL, category TEXT NOT NULL, in_stock INTEGER NOT NULL DEFAULT 1,
    UNIQUE(product_slug, locale)
  );
  CREATE TABLE IF NOT EXISTS ad_spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT, spot_name TEXT NOT NULL, ad_type TEXT NOT NULL,
    ad_image_url TEXT, click_url TEXT, locale TEXT NOT NULL, is_active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, slug TEXT NOT NULL,
    description TEXT NOT NULL, event_image TEXT NOT NULL, venue TEXT NOT NULL,
    event_date TEXT NOT NULL, event_end TEXT, ticket_url TEXT, price_range TEXT,
    category TEXT NOT NULL, locale TEXT NOT NULL, is_featured INTEGER NOT NULL DEFAULT 0,
    UNIQUE(slug, locale)
  );
`);

// Clear
db.exec("DELETE FROM news; DELETE FROM products; DELETE FROM ad_spots; DELETE FROM events;");

// Insert helpers
const insNews = db.prepare(`INSERT INTO news (title,slug,excerpt,content_body,featured_image,source_name,source_url,published_at,locale,category) VALUES (?,?,?,?,?,?,?,?,?,?)`);
const insProd = db.prepare(`INSERT INTO products (product_name,product_slug,product_image,description_short,price_display,price_amount,affiliate_link,partner_name,locale,category) VALUES (?,?,?,?,?,?,?,?,?,?)`);
const insAd = db.prepare(`INSERT INTO ad_spots (spot_name,ad_type,ad_image_url,click_url,locale,is_active) VALUES (?,?,?,?,?,?)`);
const insEvt = db.prepare(`INSERT INTO events (title,slug,description,event_image,venue,event_date,event_end,ticket_url,price_range,category,locale,is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);

// ═══════════ NEWS ═══════════
const slugs = [
  { s: "city-champions-league-quarter-final", img: "photo-1522778119026-d647f0596c20", src: "BBC Sport", url: "https://bbc.co.uk/sport", d: "2026-03-14T10:00:00Z", cat: "football" },
  { s: "etihad-campus-expansion", img: "photo-1577223625816-7546f13df25d", src: "Manchester Evening News", url: "https://manchestereveningnews.co.uk", d: "2026-03-13T14:30:00Z", cat: "city" },
  { s: "northern-quarter-cultural-renaissance", img: "photo-1515542622106-78bda8ba0e5b", src: "The Guardian", url: "https://theguardian.com", d: "2026-03-12T09:15:00Z", cat: "culture" },
  { s: "premier-league-title-race", img: "photo-1431324155629-1a6deb1dec8d", src: "Sky Sports", url: "https://skysports.com", d: "2026-03-11T16:00:00Z", cat: "football" },
  { s: "matchday-dining-etihad", img: "photo-1555396273-367ea4eb4db5", src: "Time Out Manchester", url: "https://timeout.com/manchester", d: "2026-03-10T11:00:00Z", cat: "food" },
  { s: "youth-academy-star-contract", img: "photo-1574629810360-7efbbe195018", src: "City Xtra", url: "https://cityxtra.com", d: "2026-03-09T08:45:00Z", cat: "football" },
];

const newsData = {
  en: [
    ["Manchester City Prepares for Champions League Quarter-Final", "The sky blues gear up for a crucial European clash.", "Manchester City are preparing for their Champions League quarter-final match with key players returning from injury."],
    ["New Etihad Campus Expansion Announced", "A major development project will transform the area surrounding the Etihad Stadium.", "City Football Group has announced plans to expand the Etihad Campus with new training facilities and community spaces."],
    ["Manchester's Northern Quarter: A Cultural Renaissance", "How Manchester's creative heartbeat continues to shape the city's identity.", "The Northern Quarter has long been the cultural heart of Manchester, with its independent shops, street art, and vibrant nightlife."],
    ["Premier League Title Race Heats Up", "Every point counts in the most competitive season in years.", "The Premier League title race is reaching a fever pitch as teams battle for the coveted trophy."],
    ["Best Matchday Dining Spots Near Etihad Stadium", "From local favourites to hidden gems — where to eat before the big match.", "The area around the Etihad Stadium offers fantastic dining options from curry houses to trendy brunch spots."],
    ["Youth Academy Star Signs Professional Contract", "Another product of the world-class academy system earns their first professional deal.", "Manchester City's academy continues to produce top-level talent with another graduate signing a professional contract."],
  ],
  ar: [
    ["مانشستر سيتي يستعد لربع نهائي دوري أبطال أوروبا", "السماويون يستعدون لمواجهة أوروبية حاسمة.", "يستعد مانشستر سيتي لمباراة ربع نهائي دوري أبطال أوروبا مع عودة اللاعبين الرئيسيين."],
    ["الإعلان عن توسعة جديدة لمجمع الاتحاد", "مشروع تطوير كبير سيحول المنطقة المحيطة بملعب الاتحاد.", "أعلنت مجموعة سيتي فوتبول عن خطط لتوسيع مجمع الاتحاد بمرافق تدريب جديدة."],
    ["الحي الشمالي في مانشستر: نهضة ثقافية", "كيف يستمر قلب مانشستر الإبداعي في تشكيل هوية المدينة.", "لطالما كان الحي الشمالي القلب الثقافي لمانشستر بمحلاته المستقلة وفنون الشارع."],
    ["سباق لقب الدوري الإنجليزي يحتدم", "مع بقاء أسابيع قليلة، كل نقطة مهمة.", "يصل سباق لقب الدوري الإنجليزي الممتاز إلى ذروته."],
    ["أفضل أماكن تناول الطعام بالقرب من ملعب الاتحاد", "أين تأكل قبل المباراة الكبيرة.", "المنطقة المحيطة بملعب الاتحاد توفر خيارات رائعة."],
    ["نجم الأكاديمية الشاب يوقع عقداً احترافياً", "منتج آخر من نظام الأكاديمية العالمي.", "تواصل أكاديمية مانشستر سيتي إنتاج مواهب من الدرجة الأولى."],
  ],
  he: [
    ["מנצ'סטר סיטי נערכת לרבע גמר ליגת האלופות", "הכחולים נערכים לעימות אירופי מכריע.", "מנצ'סטר סיטי נערכת למשחק רבע הגמר בליגת האלופות."],
    ["הוכרזה הרחבה חדשה של קמפוס איתיחאד", "פרויקט פיתוח גדול ישנה את האזור.", "קבוצת סיטי פוטבול הכריזה על תוכניות להרחבת קמפוס איתיחאד."],
    ["הרובע הצפוני של מנצ'סטר: רנסנס תרבותי", "כיצד הלב היצירתי של מנצ'סטר ממשיך לעצב את זהות העיר.", "הרובע הצפוני היה מאז ומתמיד הלב התרבותי של מנצ'סטר."],
    ["מירוץ האליפות בפרמייר ליג מתחמם", "עם שבועות ספורים שנותרו, כל נקודה חשובה.", "מירוץ האליפות בפרמייר ליג מגיע לשיאו."],
    ["מקומות האוכל הטובים ביותר ליד אצטדיון איתיחאד", "איפה לאכול לפני המשחק הגדול.", "האזור סביב אצטדיון איתיחאד מציע אפשרויות נהדרות."],
    ["כוכב האקדמיה הצעיר חותם על חוזה מקצועי", "עוד תוצר של מערכת האקדמיה.", "האקדמיה של מנצ'סטר סיטי ממשיכה לייצר כישרונות."],
  ],
  es: [
    ["Manchester City se prepara para cuartos de final de Champions League", "Los celestes se preparan para un enfrentamiento europeo crucial.", "El Manchester City se está preparando para su partido de cuartos de final."],
    ["Anunciada la nueva expansión del Campus Etihad", "Un importante proyecto de desarrollo transformará la zona.", "City Football Group ha anunciado planes para ampliar el Campus Etihad."],
    ["El Northern Quarter de Manchester: un renacimiento cultural", "Cómo el corazón creativo de Manchester sigue dando forma a la identidad.", "El Northern Quarter ha sido durante mucho tiempo el corazón cultural de Manchester."],
    ["La carrera por el título de la Premier League se intensifica", "Con pocas semanas restantes, cada punto cuenta.", "La carrera por el título está alcanzando su punto álgido."],
    ["Los mejores restaurantes cerca del Estadio Etihad", "Dónde comer antes del gran partido.", "La zona alrededor del Estadio Etihad ofrece opciones fantásticas."],
    ["Estrella juvenil firma contrato profesional", "Otro producto del sistema de academia de clase mundial.", "La academia del Manchester City sigue produciendo talento de primer nivel."],
  ],
};

const insertAllNews = db.transaction(() => {
  for (const [locale, articles] of Object.entries(newsData)) {
    articles.forEach((a, i) => {
      const m = slugs[i];
      insNews.run(a[0], m.s, a[1], a[2], `https://images.unsplash.com/${m.img}?w=800&h=450&fit=crop`, m.src, m.url, m.d, locale, m.cat);
    });
  }
});
insertAllNews();
console.log("✅ News: 24 records");

// ═══════════ PRODUCTS ═══════════
const prodSlugs = [
  { s: "manchester-skyline-print", img: "photo-1605034313761-73ea4a0cfbf3", price: 29.99, partner: "Amazon UK", cat: "art" },
  { s: "sky-blue-heritage-scarf", img: "photo-1520903920243-00d872a2d1c9", price: 19.99, partner: "Fanatics", cat: "apparel" },
  { s: "city-guide-book", img: "photo-1544947950-fa07a98d237f", price: 14.99, partner: "Amazon UK", cat: "books" },
  { s: "football-culture-magazine", img: "photo-1526666923127-b2970f64b422", price: 9.99, partner: "Press Partner", cat: "magazines" },
];

const prodData = {
  en: [
    ["Manchester Skyline Premium Print", "Stunning high-quality print of the Manchester skyline.", "£29.99"],
    ["Sky Blue Heritage Scarf", "Classic sky blue and white scarf.", "£19.99"],
    ["Manchester City Guide Book", "The definitive guide to Manchester.", "£14.99"],
    ["Football Culture Magazine", "Monthly magazine covering football culture.", "£9.99/mo"],
  ],
  ar: [
    ["طباعة أفق مانشستر الفاخرة", "طباعة عالية الجودة لأفق مانشستر.", "£29.99"],
    ["وشاح التراث الأزرق السماوي", "وشاح كلاسيكي باللون الأزرق السماوي.", "£19.99"],
    ["كتاب دليل مانشستر", "الدليل الشامل لمانشستر.", "£14.99"],
    ["مجلة ثقافة كرة القدم", "مجلة شهرية تغطي ثقافة كرة القدم.", "£9.99/شهرياً"],
  ],
  he: [
    ["הדפס פרימיום של קו הרקיע של מנצ'סטר", "הדפס איכותי מדהים של קו הרקיע.", "£29.99"],
    ["צעיף מורשת כחול שמיים", "צעיף קלאסי בכחול שמיים ולבן.", "£19.99"],
    ["ספר מדריך מנצ'סטר", "המדריך המוחלט למנצ'סטר.", "£14.99"],
    ["מגזין תרבות כדורגל", "מגזין חודשי המכסה תרבות כדורגל.", "£9.99/חודש"],
  ],
  es: [
    ["Impresión Premium del Horizonte de Manchester", "Impresión de alta calidad del horizonte.", "£29.99"],
    ["Bufanda Heritage Azul Cielo", "Bufanda clásica en azul cielo y blanco.", "£19.99"],
    ["Libro Guía de Manchester", "La guía definitiva de Manchester.", "£14.99"],
    ["Revista Cultura del Fútbol", "Revista mensual sobre cultura futbolística.", "£9.99/mes"],
  ],
};

const insertAllProds = db.transaction(() => {
  for (const [locale, prods] of Object.entries(prodData)) {
    prods.forEach((p, i) => {
      const m = prodSlugs[i];
      insProd.run(p[0], m.s, `https://images.unsplash.com/${m.img}?w=400&h=400&fit=crop`, p[1], p[2], m.price, "#", m.partner, locale, m.cat);
    });
  }
});
insertAllProds();
console.log("✅ Products: 16 records");

// ═══════════ ADS ═══════════
insAd.run("header-banner", "image", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=120&fit=crop", "#", "en", 1);
insAd.run("content-inline", "image", "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=200&fit=crop", "#", "en", 1);
console.log("✅ Ads: 2 records");

// ═══════════ EVENTS ═══════════
const evtData = [
  ["Manchester City vs Arsenal", "city-vs-arsenal-pl", "A crucial Premier League clash at the Etihad Stadium.", "photo-1522778119026-d647f0596c20", "Etihad Stadium", "2026-04-05T15:00:00Z", null, "https://mancity.com/tickets", "£45-£120", "sport", "en", 1],
  ["Manchester International Festival 2026", "manchester-international-festival", "The city's premier arts and culture festival.", "photo-1501281668745-f7f57925c3b4", "Various Venues", "2026-06-15T10:00:00Z", "2026-07-06T23:00:00Z", "https://mif.co.uk", "Free-£50", "culture", "en", 1],
  ["Etihad Stadium Tour", "etihad-stadium-tour", "Go behind the scenes of the Etihad Stadium.", "photo-1577223625816-7546f13df25d", "Etihad Stadium", "2026-03-20T10:00:00Z", null, "https://mancity.com/tours", "£25", "sport", "en", 1],
  ["Food & Drink Festival", "food-drink-festival-2026", "Celebrating Manchester's incredible food scene.", "photo-1555396273-367ea4eb4db5", "Albert Square", "2026-05-10T12:00:00Z", "2026-05-20T22:00:00Z", null, "Free", "food", "en", 1],
  // AR
  ["مانشستر سيتي ضد آرسنال", "city-vs-arsenal-pl", "مواجهة حاسمة في الدوري الإنجليزي.", "photo-1522778119026-d647f0596c20", "ملعب الاتحاد", "2026-04-05T15:00:00Z", null, "https://mancity.com/tickets", "£45-£120", "sport", "ar", 1],
  ["مهرجان مانشستر الدولي 2026", "manchester-international-festival", "يعود مهرجان الفنون والثقافة.", "photo-1501281668745-f7f57925c3b4", "أماكن متعددة", "2026-06-15T10:00:00Z", "2026-07-06T23:00:00Z", "https://mif.co.uk", "مجاني-£50", "culture", "ar", 1],
  ["جولة ملعب الاتحاد", "etihad-stadium-tour", "اذهب وراء الكواليس.", "photo-1577223625816-7546f13df25d", "ملعب الاتحاد", "2026-03-20T10:00:00Z", null, "https://mancity.com/tours", "£25", "sport", "ar", 1],
  // HE
  ["מנצ'סטר סיטי נגד ארסנל", "city-vs-arsenal-pl", "עימות מכריע בפרמייר ליג.", "photo-1522778119026-d647f0596c20", "אצטדיון איתיחאד", "2026-04-05T15:00:00Z", null, "https://mancity.com/tickets", "£45-£120", "sport", "he", 1],
  ["פסטיבל מנצ'סטר הבינלאומי 2026", "manchester-international-festival", "פסטיבל האמנות והתרבות המוביל.", "photo-1501281668745-f7f57925c3b4", "מקומות שונים", "2026-06-15T10:00:00Z", "2026-07-06T23:00:00Z", "https://mif.co.uk", "חינם-£50", "culture", "he", 1],
  ["סיור באצטדיון איתיחאד", "etihad-stadium-tour", "היכנסו מאחורי הקלעים.", "photo-1577223625816-7546f13df25d", "אצטדיון איתיחאד", "2026-03-20T10:00:00Z", null, "https://mancity.com/tours", "£25", "sport", "he", 1],
  // ES
  ["Manchester City vs Arsenal", "city-vs-arsenal-pl", "Un choque crucial de la Premier League.", "photo-1522778119026-d647f0596c20", "Estadio Etihad", "2026-04-05T15:00:00Z", null, "https://mancity.com/tickets", "£45-£120", "sport", "es", 1],
  ["Festival Internacional de Manchester 2026", "manchester-international-festival", "El principal festival de artes y cultura.", "photo-1501281668745-f7f57925c3b4", "Varios lugares", "2026-06-15T10:00:00Z", "2026-07-06T23:00:00Z", "https://mif.co.uk", "Gratis-£50", "culture", "es", 1],
  ["Tour del Estadio Etihad", "etihad-stadium-tour", "Ve detrás de escena.", "photo-1577223625816-7546f13df25d", "Estadio Etihad", "2026-03-20T10:00:00Z", null, "https://mancity.com/tours", "£25", "sport", "es", 1],
];

const insertAllEvents = db.transaction(() => {
  for (const e of evtData) {
    insEvt.run(e[0], e[1], e[2], `https://images.unsplash.com/${e[3]}?w=800&h=450&fit=crop`, e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11]);
  }
});
insertAllEvents();
console.log("✅ Events:", evtData.length, "records");

db.close();
console.log("🎉 Seed complete!");
