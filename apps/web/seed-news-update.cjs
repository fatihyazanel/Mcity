/**
 * seed-news-update.cjs
 * Güncel haberler ekler (Mart 2026). Mevcut haberleri silmez, sadece INSERT OR IGNORE yapar.
 */
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

const ins = db.prepare(`
  INSERT OR IGNORE INTO news
  (title, slug, excerpt, content_body, featured_image, source_name, source_url, published_at, locale, category)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// ─── Slug / image / meta tanımları ───────────────────────────────────────────
const stories = [
  {
    slug: "city-title-push-march-2026",
    img: "photo-1431324155629-1a6deb1dec8d",
    src: "Sky Sports",
    url: "https://skysports.com",
    date: "2026-03-22T16:00:00Z",
    cat: "football",
  },
  {
    slug: "anfield-showdown-preview",
    img: "photo-1522778119026-d647f0596c20",
    src: "BBC Sport",
    url: "https://bbc.co.uk/sport",
    date: "2026-03-21T10:00:00Z",
    cat: "football",
  },
  {
    slug: "manchester-spring-food-scene",
    img: "photo-1555396273-367ea4eb4db5",
    src: "Time Out Manchester",
    url: "https://timeout.com/manchester",
    date: "2026-03-20T11:30:00Z",
    cat: "food",
  },
  {
    slug: "northern-quarter-new-openings",
    img: "photo-1515542622106-78bda8ba0e5b",
    src: "Manchester Evening News",
    url: "https://manchestereveningnews.co.uk",
    date: "2026-03-19T09:00:00Z",
    cat: "culture",
  },
  {
    slug: "erling-haaland-milestone",
    img: "photo-1574629810360-7efbbe195018",
    src: "City Xtra",
    url: "https://cityxtra.com",
    date: "2026-03-18T14:00:00Z",
    cat: "football",
  },
  {
    slug: "manchester-transport-update-2026",
    img: "photo-1449824913935-59a10b8d2000",
    src: "Manchester Evening News",
    url: "https://manchestereveningnews.co.uk",
    date: "2026-03-17T08:00:00Z",
    cat: "city",
  },
  {
    slug: "champions-league-semi-preview",
    img: "photo-1486406146926-c627a92ad1ab",
    src: "The Guardian",
    url: "https://theguardian.com",
    date: "2026-03-16T13:00:00Z",
    cat: "football",
  },
  {
    slug: "mcr-street-art-festival",
    img: "photo-1501281668745-f7f57925c3b4",
    src: "Visit Manchester",
    url: "https://visitmanchester.com",
    date: "2026-03-15T10:00:00Z",
    cat: "culture",
  },
];

// ─── Çok dilli içerik ────────────────────────────────────────────────────────
const content = {
  "city-title-push-march-2026": {
    en: ["City's Relentless Title Push Continues Into Final Weeks", "Manchester City refuse to let their lead slip as the Premier League run-in heats up.", "Manchester City maintained their two-point lead at the top of the Premier League table with a dominant 3-1 victory over Wolverhampton Wanderers at the Etihad. Kevin De Bruyne orchestrated the win with a goal and two assists, while Erling Haaland extended his season tally to 28 goals. Manager Pep Guardiola praised the squad's focus heading into the final nine matches of the season, with clashes against Arsenal and Liverpool still to come. City have won their last six home fixtures and look well-placed to secure a fourth consecutive league title."],
    ar: ["استمرار مسيرة سيتي في السباق نحو اللقب في الأسابيع الأخيرة", "يرفض مانشستر سيتي التخلي عن صدارته مع اشتداد المنافسة في الدوري الإنجليزي.", "حافظ مانشستر سيتي على تقدمه بنقطتين في صدارة الدوري الإنجليزي الممتاز بفوز ساحق 3-1 على وولفرهامبتون ووندررز في ملعب الإتحاد."],
    he: ["ההתקפה הבלתי פוסקת של סיטי ללקב ממשיכה לשבועות האחרונים", "מנצ'סטר סיטי מסרבת לאפשר להובלתה להחמק כשמרוץ הפרמייר ליג מתחמם.", "מנצ'סטר סיטי שמרה על הובלה של שתי נקודות בראש טבלת הפרמייר ליג עם ניצחון מכריע 3-1 על וולברהמפטון באיתיחאד."],
    es: ["El imparable empuje por el título del City continúa en las semanas finales", "El Manchester City se niega a perder su ventaja mientras la recta final de la Premier League se calienta.", "El Manchester City mantuvo su ventaja de dos puntos en la cima de la Premier League con una victoria dominante por 3-1 sobre el Wolverhampton Wanderers en el Etihad."],
  },
  "anfield-showdown-preview": {
    en: ["Anfield Showdown: City vs Liverpool — The Decider?", "Sunday's clash at Anfield could define the Premier League title race once and for all.", "Manchester City travel to Anfield on Sunday in what many are calling the match of the season. A City win would open a five-point gap over Liverpool and leave their title rivals needing to rely on dropped points elsewhere. Pep Guardiola has a fully-fit squad available, with Rodri returning from a minor knock just in time. Liverpool manager Jurgen Klopp insists his side are ready for the battle. Kick-off is at 4:30pm and the match will be broadcast live on Sky Sports Premier League."],
    ar: ["معركة أنفيلد: سيتي ضد ليفربول - الفاصل؟", "قد تحدد مباراة الأحد في أنفيلد سباق لقب الدوري الإنجليزي نهائياً.", "يتوجه مانشستر سيتي إلى أنفيلد يوم الأحد في ما يصفه كثيرون بأنه مباراة الموسم."],
    he: ["עימות אנפילד: סיטי נגד ליברפול - המכריע?", "העימות של יום ראשון באנפילד עשוי להכריע את מרוץ אליפות הפרמייר ליג אחת ולתמיד.", "מנצ'סטר סיטי נוסעת לאנפילד ביום ראשון במה שרבים מכנים משחק העונה."],
    es: ["El choque de Anfield: City vs Liverpool — ¿El decisivo?", "El enfrentamiento del domingo en Anfield podría definir la carrera por el título de la Premier League de una vez por todas.", "El Manchester City viaja a Anfield el domingo en lo que muchos están llamando el partido de la temporada."],
  },
  "manchester-spring-food-scene": {
    en: ["Manchester's Spring Food Scene: 10 Must-Try Openings", "From bold Asian fusion to reimagined British classics, Manchester's restaurant scene is thriving this spring.", "Manchester's food scene is having a moment. This spring sees a wave of exciting new restaurant and café openings across the city, from Ancoats to the Northern Quarter. Standouts include Sōl Kitchen, an innovative Japanese-Mancunian fusion concept on Dale Street, and The Coal Yard, a wood-fired grill restaurant in a converted railway arch in Ancoats. Brunch lovers are flocking to Bloom on Oxford Road, while the Piccadilly area has welcomed three new independent coffee shops in as many weeks. Here are the ten best new openings you need to visit before summer."],
    ar: ["مشهد الطعام الربيعي في مانشستر: 10 افتتاحيات لا بد من تجربتها", "من الاندماج الآسيوي الجريء إلى الكلاسيكيات البريطانية المُعاد تصورها، يزدهر مشهد المطاعم في مانشستر هذا الربيع.", "يعيش مشهد الطعام في مانشستر لحظته. يشهد هذا الربيع موجة من افتتاحيات المطاعم والمقاهي المثيرة في جميع أنحاء المدينة."],
    he: ["סצנת האוכל האביבית של מנצ'סטר: 10 פתיחות שחייבים לנסות", "מפיוז'ן אסייתי נועז ועד לקלאסיקה בריטית מחודשת, סצנת המסעדות של מנצ'סטר פורחת באביב הזה.", "סצנת האוכל של מנצ'סטר חווה רגע. האביב הזה רואה גל של פתיחות מסעדות ובתי קפה מרגשים ברחבי העיר."],
    es: ["La escena gastronómica primaveral de Manchester: 10 aperturas imprescindibles", "Desde la fusión asiática audaz hasta los clásicos británicos reinventados, la escena de restaurantes de Manchester está floreciendo esta primavera.", "La escena gastronómica de Manchester está viviendo su momento. Esta primavera ve una oleada de emocionantes aperturas de restaurantes y cafés en toda la ciudad."],
  },
  "northern-quarter-new-openings": {
    en: ["Northern Quarter Gets Bold New Wave of Independent Retailers", "Manchester's creative neighbourhood welcomes a fresh crop of independent shops, studios, and galleries.", "The Northern Quarter continues to cement its reputation as Manchester's most vibrant independent shopping destination with a string of exciting new arrivals this March. Among the newcomers is Fold, a concept store dedicated to sustainable fashion and design on Thomas Street; Wavelength Records, a vinyl specialist bringing rare imports and local releases to Tib Street; and Studio Collective, a shared creative workspace-cum-gallery on Oldham Street. The area's footfall has increased by 18% year-on-year according to data from Manchester City Council, reflecting growing interest in independent retail."],
    ar: ["الحي الشمالي يستقبل موجة جديدة جريئة من تجار التجزئة المستقلين", "تستقبل أكثر أحياء مانشستر إبداعاً محصولاً جديداً من المحلات والاستوديوهات والمعارض المستقلة.", "يواصل الحي الشمالي ترسيخ سمعته كوجهة تسوق مستقلة الأكثر حيوية في مانشستر."],
    he: ["הרובע הצפוני מקבל גל חדש ונועז של קמעונאים עצמאיים", "השכונה היצירתית של מנצ'סטר מברכת על קבוצה רעננה של חנויות, סטודיות וגלריות עצמאיות.", "הרובע הצפוני ממשיך לגבש את מוניטינו כיעד הקניות העצמאי החי ביותר במנצ'סטר."],
    es: ["El Northern Quarter recibe una audaz nueva ola de comercios independientes", "El barrio más creativo de Manchester da la bienvenida a una nueva cosecha de tiendas, estudios y galerías independientes.", "El Northern Quarter continúa consolidando su reputación como el destino de compras independientes más vibrante de Manchester."],
  },
  "erling-haaland-milestone": {
    en: ["Haaland Reaches 100 Premier League Goals in Record Time", "The Norwegian striker achieves an unprecedented milestone in English football history.", "Erling Haaland became the fastest player in Premier League history to score 100 goals, reaching the milestone in just 106 appearances — surpassing the previous record held by Alan Shearer. The goal, a clinical header from a Kevin De Bruyne cross in the 67th minute against Fulham, sparked huge celebrations at the Etihad. Haaland, 25, joined City from Borussia Dortmund in 2022 and has been the most prolific striker in Premier League history, averaging almost one goal per game. Manager Pep Guardiola called it 'an achievement that will stand forever in football history'."],
    ar: ["هالاند يصل إلى 100 هدف في الدوري الإنجليزي في وقت قياسي", "يحقق المهاجم النرويجي إنجازاً غير مسبوق في تاريخ كرة القدم الإنجليزية.", "أصبح إيرلينج هالاند أسرع لاعب في تاريخ الدوري الإنجليزي الممتاز يسجل 100 هدف."],
    he: ["הולאנד מגיע ל-100 שערים בפרמייר ליג בזמן שיא", "התוקף הנורווגי משיג ציון דרך חסר תקדים בהיסטוריה של הכדורגל האנגלי.", "ארלינג הולאנד הפך לשחקן המהיר ביותר בהיסטוריה של הפרמייר ליג שמגיע ל-100 שערים."],
    es: ["Haaland alcanza 100 goles en la Premier League en tiempo récord", "El delantero noruego logra un hito sin precedentes en la historia del fútbol inglés.", "Erling Haaland se convirtió en el jugador más rápido de la historia de la Premier League en marcar 100 goles."],
  },
  "manchester-transport-update-2026": {
    en: ["Manchester's £500m Transport Upgrade: What You Need to Know", "Major improvements to Metrolink, buses, and cycling infrastructure are transforming how the city moves.", "Transport for Greater Manchester has unveiled a comprehensive £500 million investment plan to overhaul the city's transport network over the next three years. Key improvements include the extension of the Metrolink network to Stockport, a city-wide bus rapid transit corridor along Oxford Road, and over 200km of new protected cycling lanes. Construction begins this summer, with the first new Metrolink stops opening by late 2027. The plan also includes new park-and-ride facilities at five locations around the city, aimed at reducing car traffic in the city centre by 25%."],
    ar: ["ترقية النقل بـ500 مليون جنيه في مانشستر: ما تحتاج معرفته", "تحويلات رئيسية في مترولينك والحافلات وبنية الدراجات الهوائية تغير طريقة تنقل المدينة.", "كشف معهد النقل لمنطقة مانشستر الكبرى عن خطة استثمار شاملة بقيمة 500 مليون جنيه إسترليني."],
    he: ["שדרוג התחבורה ב-500 מיליון פאונד של מנצ'סטר: מה שצריך לדעת", "שיפורים מרכזיים ב-Metrolink, באוטובוסים ובתשתית האופניים משנים את אופן התנועה של העיר.", "Transport for Greater Manchester חשפה תוכנית השקעות מקיפה של 500 מיליון פאונד."],
    es: ["La mejora de transporte de 500 millones de libras de Manchester: lo que necesitas saber", "Mejoras importantes en Metrolink, autobuses e infraestructura ciclista están transformando cómo se mueve la ciudad.", "Transport for Greater Manchester ha presentado un plan de inversión integral de 500 millones de libras."],
  },
  "champions-league-semi-preview": {
    en: ["City Draw Real Madrid in Champions League Semi-Finals", "The draw has been made — and it's the tie everyone wanted. Can City avenge last season's exit?", "Manchester City have been drawn against Real Madrid in the UEFA Champions League semi-finals, setting up a blockbuster two-legged tie that captures the imagination of football fans worldwide. The first leg will be played at the Etihad Stadium on April 29, with the return match at the Santiago Bernabeu on May 6. City have twice been knocked out by Madrid in recent seasons, but Guardiola insists his squad is ready to go one step further this year. Tickets for the home leg go on sale to season ticket holders on Friday morning."],
    ar: ["سيتي يواجه ريال مدريد في نصف نهائي دوري أبطال أوروبا", "تم إجراء القرعة - وهي المباراة التي أرادها الجميع. هل يمكن لسيتي الانتقام من الخروج الموسم الماضي؟", "سيواجه مانشستر سيتي ريال مدريد في نصف نهائي دوري أبطال أوروبا للاتحاد الأوروبي."],
    he: ["סיטי מגרילה את ריאל מדריד בחצי גמר ליגת האלופות", "הגרלה בוצעה - וזהו העימות שכולם רצו. האם סיטי יכולה להתנקם מהיציאה בעונה שעברה?", "מנצ'סטר סיטי הוגרלה נגד ריאל מדריד בחצי גמר ליגת האלופות של UEFA."],
    es: ["City enfrenta al Real Madrid en las semifinales de la Champions League", "El sorteo se ha realizado — y es el enfrentamiento que todos querían. ¿Puede City vengar la eliminación de la temporada pasada?", "El Manchester City ha sido emparejado con el Real Madrid en las semifinales de la UEFA Champions League."],
  },
  "mcr-street-art-festival": {
    en: ["Manchester Street Art Festival Returns for 2026", "The city's most colourful celebration of urban art brings world-class muralists to Manchester's walls.", "Manchester's annual Street Art Festival is back for its fifth edition, transforming blank walls across the city into vibrant canvases until the end of March. This year's festival features 25 artists from 14 countries, including acclaimed muralists from Mexico City, São Paulo, and Johannesburg alongside local talent from Hulme and Moss Side. Key locations include Stevenson Square, Pollard Street, and a new kilometre-long wall along the Ashton Canal towpath. All events are free and open to the public, with guided tours available every weekend."],
    ar: ["مهرجان فن الشارع في مانشستر يعود لعام 2026", "يجلب احتفال المدينة الأكثر ألواناً بالفن الحضري رسامي جداريات عالميين إلى جدران مانشستر.", "مهرجان فن الشارع السنوي في مانشستر يعود بدورته الخامسة."],
    he: ["פסטיבל אמנות הרחוב של מנצ'סטר חוזר לשנת 2026", "החגיגה הצבעונית ביותר של העיר לאמנות עירונית מביאה ציירי קיר מהשורה הראשונה לקירות מנצ'סטר.", "פסטיבל אמנות הרחוב השנתי של מנצ'סטר חוזר למהדורה החמישית שלו."],
    es: ["El Festival de Arte Callejero de Manchester regresa para 2026", "La celebración más colorida de la ciudad del arte urbano trae muralistas de clase mundial a las paredes de Manchester.", "El Festival de Arte Callejero anual de Manchester está de vuelta para su quinta edición."],
  },
};

// ─── Insert ───────────────────────────────────────────────────────────────────
const locales = ["en", "ar", "he", "es"];

const insertAll = db.transaction(() => {
  let count = 0;
  for (const story of stories) {
    for (const locale of locales) {
      const c = content[story.slug][locale];
      const imgUrl = `https://images.unsplash.com/${story.img}?w=800&h=450&fit=crop`;
      ins.run(c[0], story.slug, c[1], c[2], imgUrl, story.src, story.url, story.date, locale, story.cat);
      count++;
    }
  }
  console.log(`✅ Inserted ${count} news records across ${locales.length} locales`);
});

insertAll();
db.close();
console.log("🎉 News update complete!");
