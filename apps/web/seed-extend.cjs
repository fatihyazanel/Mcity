const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

// ── New tables ──
db.exec(`
  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, slug TEXT NOT NULL, description TEXT NOT NULL,
    image TEXT NOT NULL, category TEXT NOT NULL,
    address TEXT, price_range TEXT, rating REAL, stars INTEGER,
    website TEXT, phone TEXT, locale TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 0,
    UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, slug TEXT NOT NULL, description TEXT NOT NULL,
    image TEXT NOT NULL, discount_text TEXT NOT NULL,
    original_price TEXT, deal_price TEXT, deal_url TEXT,
    valid_until TEXT, locale TEXT NOT NULL, category TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS neighbourhoods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, slug TEXT NOT NULL, description TEXT NOT NULL,
    image TEXT NOT NULL, highlights TEXT NOT NULL,
    locale TEXT NOT NULL, UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, slug TEXT NOT NULL, excerpt TEXT NOT NULL,
    content_body TEXT NOT NULL, image TEXT NOT NULL,
    category TEXT NOT NULL, read_time INTEGER NOT NULL DEFAULT 3,
    published_at TEXT NOT NULL, locale TEXT NOT NULL,
    UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS free_things (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, slug TEXT NOT NULL, description TEXT NOT NULL,
    image TEXT NOT NULL, location TEXT NOT NULL,
    category TEXT NOT NULL, locale TEXT NOT NULL,
    UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS visitor_info (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL, slug TEXT NOT NULL, content TEXT NOT NULL,
    icon TEXT NOT NULL, category TEXT NOT NULL,
    locale TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE(slug, locale)
  );
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL, product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
    total_amount REAL NOT NULL, currency TEXT NOT NULL DEFAULT 'GBP',
    customer_email TEXT, customer_name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL, product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL, price_amount REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );
`);
console.log("✅ Tables created");

// ── PLACES (where-to-stay + eat-drink) ──
const insPlace = db.prepare(`INSERT OR REPLACE INTO places (name,slug,description,image,category,address,price_range,rating,stars,website,locale,is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
const placesData = [
  // Hotels (en)
  ["The Edwardian Manchester","edwardian-manchester","A 5-star luxury hotel with spa in Manchester's city centre, offering world-class dining and elegant rooms.","photo-1566073771259-6a8506099945","hotel","Free Trade Hall, Peter St","£200-£500/night",4.7,5,"https://edwardian.com","en",1],
  ["Dakota Manchester","dakota-manchester","An eight-story boutique hotel offering stylish rooms and a vibrant bar and grill.","photo-1551882547-ff40c63fe5fa","hotel","29 Ducie St, M1 2JL","£150-£350/night",4.6,4,"https://dakotahotels.co.uk","en",1],
  ["YOTEL Manchester","yotel-manchester","Smart, tech-forward hotel just off Deansgate with compact luxury cabins.","photo-1618773928121-c32242e63f39","hotel","1 Deansgate, M3 1AZ","£70-£150/night",4.3,3,"https://yotel.com","en",1],
  ["Kimpton Clocktower","kimpton-clocktower","Luxury hotel with an industrial soul sprawled across Oxford Road's iconic Refuge building.","photo-1582719508461-905c673771fd","hotel","Oxford St, M60 7HA","£180-£400/night",4.5,4,"https://clocktowerhotel.com","en",1],
  ["YHA Manchester","yha-manchester","Budget-friendly hostel in Potato Wharf with dorms and private rooms near Castlefield.","photo-1555854877-bab0e564b8d5","hostel","Potato Wharf, M3 4NB","£20-£45/night",4.1,2,"https://yha.org.uk","en",0],
  // Restaurants (en)
  ["Rudy's Pizza","rudys-pizza","Neapolitan pizza at its finest. Award-winning dough, simple toppings, always queues.","photo-1565299624946-b28f40a0ae38","restaurant","9 Cotton St, Ancoats","£8-£15",4.8,0,"https://rudyspizza.co.uk","en",1],
  ["Hawksmoor Manchester","hawksmoor-manchester","Premium British steakhouse in a stunning Victorian courthouse.","photo-1544025162-d76694265947","restaurant","184 Deansgate, M3 3WB","£30-£70",4.7,0,"https://thehawksmoor.com","en",1],
  ["Dishoom Manchester","dishoom-manchester","Bombay-inspired cafe serving breakfast naan rolls, black daal, and craft cocktails.","photo-1517248135467-4c7edcad34c4","restaurant","32 Bridge St, M3 3BT","£12-£25",4.6,0,"https://dishoom.com","en",1],
  ["Mackie Mayor","mackie-mayor","Beautiful Grade II listed market hall housing multiple independent food traders.","photo-1414235077428-338989a2e8c0","restaurant","1 Eagle St, NQ, M4 5BU","£8-£20",4.5,0,"https://mackiemayor.co.uk","en",1],
  // Bars (en)
  ["The Refuge","the-refuge","Grand bar and restaurant in the Kimpton Clocktower hotel with DJ nights.","photo-1572116469696-31de0f17cc34","bar","Oxford St, M60 7HA","£5-£15",4.4,0,"https://refugemcr.co.uk","en",0],
  ["Speak in Code","speak-in-code","Hidden speakeasy-style cocktail bar in the Northern Quarter.","photo-1470337458703-46ad1756a187","bar","Stevenson Square, NQ","£8-£16",4.5,0,null,"en",0],
  // Hotels (ar)
  ["فندق إدواردي مانشستر","edwardian-manchester","فندق فاخر من فئة 5 نجوم مع سبا في وسط مدينة مانشستر.","photo-1566073771259-6a8506099945","hotel","Free Trade Hall, Peter St","£200-£500/ليلة",4.7,5,"https://edwardian.com","ar",1],
  ["داكوتا مانشستر","dakota-manchester","فندق بوتيك أنيق من ثمانية طوابق مع بار ومشوى نابض بالحياة.","photo-1551882547-ff40c63fe5fa","hotel","29 Ducie St","£150-£350/ليلة",4.6,4,"https://dakotahotels.co.uk","ar",1],
  ["روديز بيتزا","rudys-pizza","بيتزا نابولية في أفضل حالاتها. عجينة حائزة على جوائز.","photo-1565299624946-b28f40a0ae38","restaurant","9 Cotton St, Ancoats","£8-£15",4.8,0,"https://rudyspizza.co.uk","ar",1],
  ["هوكسمور مانشستر","hawksmoor-manchester","مطعم ستيك بريطاني فاخر في محكمة فيكتورية مذهلة.","photo-1544025162-d76694265947","restaurant","184 Deansgate","£30-£70",4.7,0,"https://thehawksmoor.com","ar",1],
  // Hotels (he)
  ["אדוארדי מנצ'סטר","edwardian-manchester","מלון 5 כוכבים יוקרתי עם ספא במרכז מנצ'סטר.","photo-1566073771259-6a8506099945","hotel","Free Trade Hall, Peter St","£200-£500/לילה",4.7,5,"https://edwardian.com","he",1],
  ["דקוטה מנצ'סטר","dakota-manchester","מלון בוטיק מסוגנן בן שמונה קומות עם בר וגריל תוסס.","photo-1551882547-ff40c63fe5fa","hotel","29 Ducie St","£150-£350/לילה",4.6,4,"https://dakotahotels.co.uk","he",1],
  ["רודי'ס פיצה","rudys-pizza","פיצה נפוליטנית במיטבה. בצק עטור פרסים.","photo-1565299624946-b28f40a0ae38","restaurant","9 Cotton St, Ancoats","£8-£15",4.8,0,"https://rudyspizza.co.uk","he",1],
  ["הוקסמור מנצ'סטר","hawksmoor-manchester","מסעדת סטייק בריטית מובחרת בבית משפט ויקטוריאני מרהיב.","photo-1544025162-d76694265947","restaurant","184 Deansgate","£30-£70",4.7,0,"https://thehawksmoor.com","he",1],
  // Hotels (es)
  ["The Edwardian Manchester","edwardian-manchester","Hotel de lujo 5 estrellas con spa en el centro de Manchester.","photo-1566073771259-6a8506099945","hotel","Free Trade Hall, Peter St","£200-£500/noche",4.7,5,"https://edwardian.com","es",1],
  ["Dakota Manchester","dakota-manchester","Hotel boutique elegante de ocho pisos con bar y parrilla vibrante.","photo-1551882547-ff40c63fe5fa","hotel","29 Ducie St","£150-£350/noche",4.6,4,"https://dakotahotels.co.uk","es",1],
  ["Rudy's Pizza","rudys-pizza","Pizza napolitana en su mejor expresión. Masa galardonada.","photo-1565299624946-b28f40a0ae38","restaurant","9 Cotton St, Ancoats","£8-£15",4.8,0,"https://rudyspizza.co.uk","es",1],
  ["Hawksmoor Manchester","hawksmoor-manchester","Steakhouse británico premium en un impresionante tribunal victoriano.","photo-1544025162-d76694265947","restaurant","184 Deansgate","£30-£70",4.7,0,"https://thehawksmoor.com","es",1],
];
const insertPlaces = db.transaction(() => {
  for (const p of placesData) {
    insPlace.run(p[0],p[1],p[2],`https://images.unsplash.com/${p[3]}?w=800&h=450&fit=crop`,p[4],p[5],p[6],p[7],p[8],p[9],p[10],p[11]);
  }
});
insertPlaces();
console.log("✅ Places:", placesData.length);

// ── DEALS ──
const insDeal = db.prepare(`INSERT OR REPLACE INTO deals (title,slug,description,image,discount_text,original_price,deal_price,deal_url,valid_until,locale,category) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
const dealsData = [
  ["20% Off Etihad Stadium Tour","etihad-tour-discount","Book online and save 20% on the behind-the-scenes stadium experience.","photo-1577223625816-7546f13df25d","20% OFF","£25","£20","https://mancity.com/tours","2026-06-30","en","attraction"],
  ["Free Dessert at Dishoom","dishoom-free-dessert","Get a complimentary dessert with any main course order.","photo-1517248135467-4c7edcad34c4","FREE DESSERT",null,null,"https://dishoom.com","2026-04-30","en","food"],
  ["Stay 3 Nights Pay 2 at Dakota","dakota-stay-deal","Extended stay deal at Dakota Manchester — perfect for a city break.","photo-1551882547-ff40c63fe5fa","3 FOR 2","£450","£300","https://dakotahotels.co.uk","2026-05-31","en","hotel"],
  ["Visit Manchester Pass — 20% Off","manchester-pass-discount","Access 12 top attractions with the Visit Manchester Pass at a discount.","photo-1449824913935-59a10b8d2000","20% OFF","£50","£40","https://manchester-pass.com","2026-12-31","en","attraction"],
  // AR
  ["خصم 20% على جولة ملعب الاتحاد","etihad-tour-discount","احجز عبر الإنترنت ووفر 20% على تجربة الملعب.","photo-1577223625816-7546f13df25d","خصم 20%","£25","£20","https://mancity.com/tours","2026-06-30","ar","attraction"],
  ["حلوى مجانية في ديشوم","dishoom-free-dessert","احصل على حلوى مجانية مع أي طبق رئيسي.","photo-1517248135467-4c7edcad34c4","حلوى مجانية",null,null,"https://dishoom.com","2026-04-30","ar","food"],
  // HE
  ["20% הנחה על סיור באצטדיון איתיחאד","etihad-tour-discount","הזמינו אונליין וחסכו 20% על חוויית האצטדיון.","photo-1577223625816-7546f13df25d","20% הנחה","£25","£20","https://mancity.com/tours","2026-06-30","he","attraction"],
  ["קינוח חינם בדישום","dishoom-free-dessert","קבלו קינוח חינם עם כל מנה עיקרית.","photo-1517248135467-4c7edcad34c4","קינוח חינם",null,null,"https://dishoom.com","2026-04-30","he","food"],
  // ES
  ["20% Descuento Tour Estadio Etihad","etihad-tour-discount","Reserva online y ahorra 20% en la experiencia del estadio.","photo-1577223625816-7546f13df25d","20% DESC.","£25","£20","https://mancity.com/tours","2026-06-30","es","attraction"],
  ["Postre Gratis en Dishoom","dishoom-free-dessert","Obtén un postre gratis con cualquier plato principal.","photo-1517248135467-4c7edcad34c4","POSTRE GRATIS",null,null,"https://dishoom.com","2026-04-30","es","food"],
];
const insertDeals = db.transaction(() => { for (const d of dealsData) inssDeal(d); });
function inssDeal(d) { insDeal.run(d[0],d[1],d[2],`https://images.unsplash.com/${d[3]}?w=800&h=450&fit=crop`,d[4],d[5],d[6],d[7],d[8],d[9],d[10]); }
const insertDeals2 = db.transaction(() => { for (const d of dealsData) inssDeal(d); });
insertDeals2();
console.log("✅ Deals:", dealsData.length);

// ── NEIGHBOURHOODS ──
const insNh = db.prepare(`INSERT OR REPLACE INTO neighbourhoods (name,slug,description,image,highlights,locale) VALUES (?,?,?,?,?,?)`);
const nhData = [
  ["Northern Quarter","northern-quarter","Manchester's creative and cultural heartbeat. Independent shops, street art, vinyl stores, craft beer bars, and the best coffee in the city.","photo-1515542622106-78bda8ba0e5b","Afflecks Palace|Stevenson Square|Craft Beer Bars|Street Art|Vinyl Shops","en"],
  ["Ancoats","ancoats","Once an industrial powerhouse, now Manchester's coolest neighbourhood. Home to Rudy's Pizza, Pollen Bakery, and cutting-edge restaurants.","photo-1449824913935-59a10b8d2000","Rudy's Pizza|Cutting Room Square|Pollen Bakery|Great Ancoats Street","en"],
  ["Deansgate","deansgate","The main artery of Manchester. Luxury shopping, rooftop bars, and vibrant nightlife stretching from the cathedral to Castlefield.","photo-1486406146926-c627a92ad1ab","Deansgate Square|Beetham Tower|Barton Arcade|Castlefield","en"],
  ["Didsbury","didsbury","Leafy, bohemian suburb with independent boutiques, gastropubs, and beautiful parks. A foodie haven.","photo-1506905925346-21bda4d32df4","Burton Road|Didsbury Village|Fletcher Moss Park|Craft Pubs","en"],
  ["Spinningfields","spinningfields","Manchester's business district turned lifestyle destination with outdoor dining, bars, and luxury retail.","photo-1480714378408-67cf0d13bc1b","The Ivy|Australasia|Leftbank|Cloud 23","en"],
  // AR
  ["الحي الشمالي","northern-quarter","قلب مانشستر الإبداعي والثقافي. محلات مستقلة وفن شارع ومقاهي حرفية.","photo-1515542622106-78bda8ba0e5b","قصر أفليكس|ساحة ستيفنسون|بارات البيرة الحرفية|فن الشارع","ar"],
  ["أنكوتس","ancoats","كان مركزاً صناعياً، والآن أروع حي في مانشستر.","photo-1449824913935-59a10b8d2000","روديز بيتزا|ساحة القطع|مخبز بولن","ar"],
  ["دينزغيت","deansgate","الشريان الرئيسي لمانشستر. تسوق فاخر وبارات على الأسطح.","photo-1486406146926-c627a92ad1ab","ساحة دينزغيت|برج بيثام|باستفيلد","ar"],
  // HE
  ["הרובע הצפוני","northern-quarter","הלב היצירתי והתרבותי של מנצ'סטר. חנויות עצמאיות, אמנות רחוב, בירה אומנותית.","photo-1515542622106-78bda8ba0e5b","ארמון אפלקס|כיכר סטיבנסון|בארים אומנותיים|אמנות רחוב","he"],
  ["אנקוטס","ancoats","פעם מרכז תעשייתי, היום השכונה הכי מגניבה במנצ'סטר.","photo-1449824913935-59a10b8d2000","רודי'ס פיצה|כיכר חדר החיתוך|מאפיית פולן","he"],
  ["דינסגייט","deansgate","העורק הראשי של מנצ'סטר. קניות יוקרה, בארים על הגג.","photo-1486406146926-c627a92ad1ab","כיכר דינסגייט|מגדל ביתהם|קאסלפילד","he"],
  // ES
  ["Northern Quarter","northern-quarter","El corazón creativo y cultural de Manchester. Tiendas independientes, arte callejero, cerveza artesanal.","photo-1515542622106-78bda8ba0e5b","Afflecks Palace|Stevenson Square|Cerveza Artesanal|Arte Callejero","es"],
  ["Ancoats","ancoats","Antes un centro industrial, ahora el barrio más cool de Manchester.","photo-1449824913935-59a10b8d2000","Rudy's Pizza|Cutting Room Square|Pollen Bakery","es"],
  ["Deansgate","deansgate","La arteria principal de Manchester. Compras de lujo, bares en azoteas y vida nocturna.","photo-1486406146926-c627a92ad1ab","Deansgate Square|Beetham Tower|Castlefield","es"],
];
const insertNh = db.transaction(() => { for (const n of nhData) insNh.run(n[0],n[1],n[2],`https://images.unsplash.com/${n[3]}?w=800&h=450&fit=crop`,n[4],n[5]); });
insertNh();
console.log("✅ Neighbourhoods:", nhData.length);

// ── IDEAS & INSPIRATION ──
const insIdea = db.prepare(`INSERT OR REPLACE INTO ideas (title,slug,excerpt,content_body,image,category,read_time,published_at,locale) VALUES (?,?,?,?,?,?,?,?,?)`);
const ideasData = [
  ["Top 10 Free Things to Do in Manchester","top-10-free-things","Discover the best free attractions, museums, and experiences Manchester has to offer.","From the stunning Manchester Art Gallery to the peaceful Fletcher Moss Park, Manchester is full of incredible free experiences. The city's museums are world-class and almost all free to enter.","photo-1515542622106-78bda8ba0e5b","guide",5,"2026-03-10T10:00:00Z","en"],
  ["A Perfect Weekend in Manchester","perfect-weekend-manchester","How to spend 48 hours exploring the best of Manchester.","Start your Saturday morning with breakfast at Federal Cafe in the Northern Quarter, then explore the street art and vintage shops of Afflecks Palace.","photo-1449824913935-59a10b8d2000","itinerary",7,"2026-03-08T10:00:00Z","en"],
  ["Manchester's Best Hidden Gems","manchester-hidden-gems","Go beyond the tourist trail and discover Manchester's secret spots.","From the hidden rooftop garden at the National Football Museum to the secret speakeasy behind a bookcase in the Northern Quarter.","photo-1486406146926-c627a92ad1ab","guide",4,"2026-03-05T10:00:00Z","en"],
  ["The Ultimate Matchday Guide","ultimate-matchday-guide","Everything you need to know for a perfect matchday at the Etihad Stadium.","Arrive early, soak up the atmosphere, and make the most of your Manchester City matchday experience with our comprehensive guide.","photo-1522778119026-d647f0596c20","sport",6,"2026-03-01T10:00:00Z","en"],
  // AR
  ["أفضل 10 أشياء مجانية في مانشستر","top-10-free-things","اكتشف أفضل المعالم والمتاحف والتجارب المجانية في مانشستر.","من معرض مانشستر الفني المذهل إلى حديقة فليتشر موس الهادئة.","photo-1515542622106-78bda8ba0e5b","guide",5,"2026-03-10T10:00:00Z","ar"],
  ["عطلة نهاية أسبوع مثالية في مانشستر","perfect-weekend-manchester","كيف تقضي 48 ساعة في استكشاف أفضل ما في مانشستر.","ابدأ صباح السبت بالإفطار في مقهى فيدرال في الحي الشمالي.","photo-1449824913935-59a10b8d2000","itinerary",7,"2026-03-08T10:00:00Z","ar"],
  // HE
  ["10 דברים חינמיים מובילים במנצ'סטר","top-10-free-things","גלו את האטרקציות, המוזיאונים והחוויות החינמיות הטובות ביותר.","מגלריית מנצ'סטר לאמנות ועד פארק פלטשר מוס.","photo-1515542622106-78bda8ba0e5b","guide",5,"2026-03-10T10:00:00Z","he"],
  ["סוף שבוע מושלם במנצ'סטר","perfect-weekend-manchester","איך לבלות 48 שעות בחקירת מיטב מנצ'סטר.","התחילו את שבת בבוקר עם ארוחת בוקר בפדרל קפה ברובע הצפוני.","photo-1449824913935-59a10b8d2000","itinerary",7,"2026-03-08T10:00:00Z","he"],
  // ES
  ["Top 10 Cosas Gratis en Manchester","top-10-free-things","Descubre las mejores atracciones, museos y experiencias gratuitas.","Desde la impresionante Galería de Arte de Manchester hasta el tranquilo Fletcher Moss Park.","photo-1515542622106-78bda8ba0e5b","guide",5,"2026-03-10T10:00:00Z","es"],
  ["Un Fin de Semana Perfecto en Manchester","perfect-weekend-manchester","Cómo pasar 48 horas explorando lo mejor de Manchester.","Comienza tu sábado con desayuno en Federal Cafe en el Northern Quarter.","photo-1449824913935-59a10b8d2000","itinerary",7,"2026-03-08T10:00:00Z","es"],
];
const insertIdeas = db.transaction(() => { for (const i of ideasData) insIdea.run(i[0],i[1],i[2],i[3],`https://images.unsplash.com/${i[4]}?w=800&h=450&fit=crop`,i[5],i[6],i[7],i[8]); });
insertIdeas();
console.log("✅ Ideas:", ideasData.length);

// ── FREE THINGS ──
const insFree = db.prepare(`INSERT OR REPLACE INTO free_things (title,slug,description,image,location,category,locale) VALUES (?,?,?,?,?,?,?)`);
const freeData = [
  ["Manchester Art Gallery","manchester-art-gallery","World-class art collection spanning six centuries, from Pre-Raphaelites to contemporary works.","photo-1515542622106-78bda8ba0e5b","Mosley Street, M2 3JL","museum","en"],
  ["Science and Industry Museum","science-industry-museum","Explore Manchester's industrial heritage and scientific achievements in this fascinating museum.","photo-1486406146926-c627a92ad1ab","Liverpool Road, M3 4FP","museum","en"],
  ["Heaton Park","heaton-park","One of the largest municipal parks in Europe. Perfect for walks, cycling, and family picnics.","photo-1506905925346-21bda4d32df4","Heaton Park, M25 2SW","park","en"],
  ["The John Rylands Library","john-rylands-library","Stunning neo-Gothic library housing rare books and manuscripts. A must-see architectural gem.","photo-1507003211169-0a1dd7228f2d","150 Deansgate, M3 3EH","library","en"],
  ["National Football Museum","national-football-museum","The world's biggest and best football museum with interactive exhibits and memorabilia.","photo-1522778119026-d647f0596c20","Urbis Building, Cathedral Gardens","museum","en"],
  ["Fletcher Moss Park","fletcher-moss-park","Beautiful botanical gardens in Didsbury with riverside walks and tennis courts.","photo-1506905925346-21bda4d32df4","Millgate Lane, Didsbury","park","en"],
  // AR
  ["معرض مانشستر للفنون","manchester-art-gallery","مجموعة فنية عالمية تمتد لستة قرون.","photo-1515542622106-78bda8ba0e5b","شارع موزلي","museum","ar"],
  ["متحف العلوم والصناعة","science-industry-museum","استكشف تراث مانشستر الصناعي والإنجازات العلمية.","photo-1486406146926-c627a92ad1ab","شارع ليفربول","museum","ar"],
  ["حديقة هيتون","heaton-park","واحدة من أكبر الحدائق البلدية في أوروبا.","photo-1506905925346-21bda4d32df4","حديقة هيتون","park","ar"],
  // HE
  ["גלריית מנצ'סטר לאמנות","manchester-art-gallery","אוסף אמנות ברמה עולמית המשתרע על פני שישה מאות שנה.","photo-1515542622106-78bda8ba0e5b","רחוב מוזלי","museum","he"],
  ["מוזיאון המדע והתעשייה","science-industry-museum","חקרו את המורשת התעשייתית וההישגים המדעיים של מנצ'סטר.","photo-1486406146926-c627a92ad1ab","רחוב ליברפול","museum","he"],
  ["פארק היטון","heaton-park","אחד הפארקים העירוניים הגדולים באירופה.","photo-1506905925346-21bda4d32df4","פארק היטון","park","he"],
  // ES
  ["Galería de Arte de Manchester","manchester-art-gallery","Colección de arte de clase mundial que abarca seis siglos.","photo-1515542622106-78bda8ba0e5b","Mosley Street","museum","es"],
  ["Museo de Ciencia e Industria","science-industry-museum","Explora el patrimonio industrial y los logros científicos de Manchester.","photo-1486406146926-c627a92ad1ab","Liverpool Road","museum","es"],
  ["Heaton Park","heaton-park","Uno de los parques municipales más grandes de Europa.","photo-1506905925346-21bda4d32df4","Heaton Park","park","es"],
];
const insertFree = db.transaction(() => { for (const f of freeData) insFree.run(f[0],f[1],f[2],`https://images.unsplash.com/${f[3]}?w=800&h=450&fit=crop`,f[4],f[5],f[6]); });
insertFree();
console.log("✅ Free things:", freeData.length);

// ── VISITOR INFO ──
const insVI = db.prepare(`INSERT OR REPLACE INTO visitor_info (title,slug,content,icon,category,locale,sort_order) VALUES (?,?,?,?,?,?,?)`);
const viData = [
  ["Getting Here","getting-here","Manchester is well connected by air (Manchester Airport — UK's 3rd busiest), rail (Manchester Piccadilly & Victoria stations), and road (M60/M62/M56 motorways). From London: 2h by train, 4h by car.","✈️","transport","en",1],
  ["Getting Around","getting-around","Manchester's Metrolink tram network connects the city centre to suburbs. Free Metroshuttle buses run through the city centre. Bee Network buses cover Greater Manchester. Cycling is popular with dedicated lanes.","🚊","transport","en",2],
  ["Emergency Numbers","emergency-numbers","Emergency: 999 | Non-emergency police: 101 | NHS: 111 | Manchester Royal Infirmary: 0161 276 1234","🚨","safety","en",3],
  ["Currency & Payments","currency-payments","Currency: British Pound (GBP/£). Contactless payments widely accepted. ATMs available throughout the city. Tipping: 10-15% in restaurants.","💷","practical","en",4],
  ["Weather & Best Time","weather-best-time","Manchester has a mild oceanic climate. Summer (Jun-Aug): 15-22°C. Winter (Dec-Feb): 2-8°C. Rain is common year-round — pack layers and a waterproof!","🌦️","practical","en",5],
  ["Useful Apps","useful-apps","TfGM app (transport), Bee Network (buses), Uber, CityMapper, Visit Manchester Pass app, Just Eat/Deliveroo (food delivery).","📱","practical","en",6],
  // AR
  ["الوصول إلى مانشستر","getting-here","مانشستر متصلة جيداً بالطيران (مطار مانشستر) والسكك الحديدية والطرق.","✈️","transport","ar",1],
  ["التنقل في المدينة","getting-around","شبكة ميتروليك تربط وسط المدينة بالضواحي. حافلات مجانية في وسط المدينة.","🚊","transport","ar",2],
  ["أرقام الطوارئ","emergency-numbers","الطوارئ: 999 | الشرطة: 101 | الصحة: 111","🚨","safety","ar",3],
  // HE
  ["הגעה למנצ'סטר","getting-here","מנצ'סטר מחוברת היטב באוויר, ברכבת ובכביש.","✈️","transport","he",1],
  ["התניידות בעיר","getting-around","רשת הטראם מטרולינק מחברת את מרכז העיר לפרברים. אוטובוסים חינמיים במרכז.","🚊","transport","he",2],
  ["מספרי חירום","emergency-numbers","חירום: 999 | משטרה: 101 | בריאות: 111","🚨","safety","he",3],
  // ES
  ["Cómo Llegar","getting-here","Manchester está bien conectada por aire (Aeropuerto de Manchester), tren y carretera.","✈️","transport","es",1],
  ["Cómo Moverse","getting-around","La red de tranvía Metrolink conecta el centro con los suburbios. Autobuses gratuitos en el centro.","🚊","transport","es",2],
  ["Números de Emergencia","emergency-numbers","Emergencia: 999 | Policía: 101 | Salud: 111","🚨","safety","es",3],
];
const insertVI = db.transaction(() => { for (const v of viData) insVI.run(v[0],v[1],v[2],v[3],v[4],v[5],v[6]); });
insertVI();
console.log("✅ Visitor Info:", viData.length);

db.close();
console.log("🎉 Extended seed complete!");
