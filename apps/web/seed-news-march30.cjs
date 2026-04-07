/**
 * seed-news-march30.cjs
 * 30 Mart 2026 tarihli güncel haberler — 4 dil
 */
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

const insert = db.prepare(`
  INSERT OR IGNORE INTO news
    (title, slug, excerpt, content_body, featured_image, source_name, source_url, published_at, locale, category)
  VALUES
    (@title, @slug, @excerpt, @content_body, @featured_image, @source_name, @source_url, @published_at, @locale, @category)
`);

const news = [
  // ── English ─────────────────────────────────────────────────────────────────
  {
    slug: "city-champions-league-semi-draw",
    published_at: "2026-03-30T09:00:00Z",
    source_name: "m.city Sport",
    source_url: "https://www.m.city/en/news/city-champions-league-semi-draw",
    category: "football",
    locale: "en",
    title: "City Draw Real Madrid in Champions League Semi-Final",
    excerpt: "Manchester City have been drawn against Real Madrid in the Champions League semi-finals, setting up a blockbuster clash at the Etihad.",
    content_body: "Manchester City face Real Madrid in the Champions League semi-finals following today's draw in Nyon. The first leg will be played at the Etihad Stadium on 22 April, with the return fixture at the Bernabéu a week later. Pep Guardiola called it 'the tie everyone wanted to see,' while the squad are focused on maintaining their Premier League lead heading into the break. City have beaten Real Madrid in two of the last three Champions League knockout meetings, and fans will be hoping history repeats itself. Ticket information for the home leg will be released via the official club website later this week.",
    featured_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
  },
  {
    slug: "manchester-april-events-guide-2026",
    published_at: "2026-03-30T08:00:00Z",
    source_name: "m.city Guide",
    source_url: "https://www.m.city/en/news/manchester-april-events-guide-2026",
    category: "lifestyle",
    locale: "en",
    title: "Manchester April 2026: The Ultimate Events Guide",
    excerpt: "From food festivals to live music and cultural exhibitions — April is packed with incredible things to do in Manchester.",
    content_body: "April in Manchester is shaping up to be one of the most exciting months in years. The Manchester Food & Drink Festival returns to Piccadilly Gardens from April 5-14, showcasing over 80 local restaurants and street food vendors. The Warehouse Project is back at Depot Mayfield with a special Easter weekend lineup featuring internationally acclaimed DJs. The Manchester Art Gallery's new exhibition 'Northern Light: 100 Years of Modern Art' opens on April 10 and runs through August. Meanwhile, Manchester Theatre's spring season kicks off with a highly anticipated revival of a classic musical at the Opera House. For football fans, the Etihad hosts three home matches in April including the crucial Champions League first leg against Real Madrid.",
    featured_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  },
  {
    slug: "haaland-injury-update-march-2026",
    published_at: "2026-03-30T07:30:00Z",
    source_name: "m.city Sport",
    source_url: "https://www.m.city/en/news/haaland-injury-update-march-2026",
    category: "football",
    locale: "en",
    title: "Haaland Set to Return for Crucial April Run-In",
    excerpt: "Erling Haaland is on track to return from injury ahead of Manchester City's pivotal April fixtures, including the Champions League semi-final.",
    content_body: "Erling Haaland is expected to be fit and available for selection when Manchester City resume competitive action in April, according to Pep Guardiola's press conference this morning. The Norwegian striker has been sidelined with a muscle complaint for the past fortnight but returned to full training on Friday. 'He looks sharp, he looks hungry,' Guardiola said. 'We will not rush him, but I expect him to be ready.' City face Wolverhampton Wanderers in their next Premier League fixture before the crucial Champions League first leg against Real Madrid. Haaland has scored 29 goals in all competitions this season and his return will be a massive boost for the title and European double charge.",
    featured_image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80",
  },
  {
    slug: "manchester-property-market-spring-2026",
    published_at: "2026-03-29T14:00:00Z",
    source_name: "m.city Living",
    source_url: "https://www.m.city/en/news/manchester-property-market-spring-2026",
    category: "city",
    locale: "en",
    title: "Manchester Property Market Booms as Spring Demand Surges",
    excerpt: "Manchester's property market is seeing its strongest spring in five years, with demand from young professionals driving prices in the Northern Quarter and Ancoats.",
    content_body: "Manchester's residential property market has entered its strongest spring period since 2021, according to new data from estate agents across the city. Average asking prices in the city centre have risen 8.2% year-on-year, with the Northern Quarter and Ancoats leading the charge. Young professionals moving to Manchester from London continue to drive demand, attracted by the city's thriving tech and creative industries alongside comparatively affordable prices. New developments including the 450-unit NOMA Phase 3 project are due to complete later this year, which agents hope will relieve some pressure on supply. Meanwhile, rental yields in areas like Salford Quays and Castlefield remain among the highest in the UK outside London at 6.8% average gross yield.",
    featured_image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
  },
  {
    slug: "city-vs-spurs-match-report-march-2026",
    published_at: "2026-03-29T22:00:00Z",
    source_name: "m.city Sport",
    source_url: "https://www.m.city/en/news/city-vs-spurs-match-report-march-2026",
    category: "football",
    locale: "en",
    title: "City 3-1 Spurs: Clinical Display Keeps Title Dream Alive",
    excerpt: "Manchester City produced a commanding performance to beat Tottenham 3-1 at the Etihad, maintaining their one-point lead at the top of the Premier League.",
    content_body: "Manchester City delivered a masterclass in clinical finishing as they swept aside Tottenham Hotspur 3-1 at the Etihad Stadium on Saturday evening. Phil Foden opened the scoring with a superb curling effort before Kevin De Bruyne doubled the lead with a trademark long-range drive. Spurs pulled one back through Son Heung-min's header just before half time, but City reasserted their dominance in the second half when substitute Bernardo Silva slid home the third on the hour mark. The result keeps City one point ahead of Arsenal with eight games remaining. Guardiola praised his team's 'professionalism and desire' but warned the title race is far from over. 'Arsenal will not drop points easily,' he said. 'We must win every game.'",
    featured_image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  },

  // ── Arabic ──────────────────────────────────────────────────────────────────
  {
    slug: "city-champions-league-semi-draw",
    published_at: "2026-03-30T09:00:00Z",
    source_name: "m.city رياضة",
    source_url: "https://www.m.city/ar/news/city-champions-league-semi-draw",
    category: "football",
    locale: "ar",
    title: "سيتي يواجه ريال مدريد في نصف نهائي دوري أبطال أوروبا",
    excerpt: "قرعة نصف النهائي تضع مانشستر سيتي في مواجهة ريال مدريد في مباراة نارية متوقعة بملعب الإتحاد.",
    content_body: "سيواجه مانشستر سيتي نظيره الإسباني ريال مدريد في نصف نهائي دوري أبطال أوروبا، وذلك إثر قرعة أُجريت اليوم في نيون. ستُقام مباراة الذهاب في ملعب الإتحاد بتاريخ 22 أبريل، فيما تُقام مباراة الإياب في ملعب برنابيو بعد أسبوع. ووصف المدرب بيب غوارديولا المواجهة بأنها 'اللقاء الذي أراده الجميع'. وقد حقق سيتي الفوز على ريال مدريد في اثنتين من آخر ثلاث مواجهات في مراحل الإقصاء، ويأمل المشجعون في تكرار التاريخ.",
    featured_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
  },
  {
    slug: "manchester-april-events-guide-2026",
    published_at: "2026-03-30T08:00:00Z",
    source_name: "m.city دليل",
    source_url: "https://www.m.city/ar/news/manchester-april-events-guide-2026",
    category: "lifestyle",
    locale: "ar",
    title: "مانشستر في أبريل 2026: الدليل الشامل للفعاليات",
    excerpt: "من مهرجانات الطعام إلى الموسيقى الحية والمعارض الثقافية — أبريل مليء بالأشياء الرائعة للاستمتاع بها في مانشستر.",
    content_body: "يبدو أبريل في مانشستر من بين أكثر الأشهر إثارة منذ سنوات. يعود مهرجان مانشستر للطعام والشراب إلى Piccadilly Gardens من 5 إلى 14 أبريل، ليضم أكثر من 80 مطعماً محلياً وبائع طعام. كما يعود The Warehouse Project بتشكيلة عطلة عيد الفصح الخاصة في Depot Mayfield. ويُفتتح معرض 'Northern Light' في المعرض الفني بمانشستر في 10 أبريل ويستمر حتى أغسطس.",
    featured_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  },
  {
    slug: "haaland-injury-update-march-2026",
    published_at: "2026-03-30T07:30:00Z",
    source_name: "m.city رياضة",
    source_url: "https://www.m.city/ar/news/haaland-injury-update-march-2026",
    category: "football",
    locale: "ar",
    title: "هالاند في طريقه للعودة قبيل مباريات أبريل الحاسمة",
    excerpt: "إيرلينغ هالاند على المسار الصحيح للعودة من الإصابة استعداداً لمباريات مانشستر سيتي المحورية في أبريل.",
    content_body: "أكد المدرب بيب غوارديولا في مؤتمره الصحفي اليوم أن المهاجم إيرلينغ هالاند سيكون جاهزاً للمشاركة عند استئناف المنافسات في أبريل. أمضى النرويجي أسبوعين خارج الملاعب بسبب إصابة عضلية، لكنه عاد إلى التدريبات الكاملة يوم الجمعة. وقال غوارديولا: 'يبدو متحفزاً وجاهزاً، لكننا لن نستعجل أمره.' سجّل هالاند 29 هدفاً في جميع المسابقات هذا الموسم.",
    featured_image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80",
  },
  {
    slug: "city-vs-spurs-match-report-march-2026",
    published_at: "2026-03-29T22:00:00Z",
    source_name: "m.city رياضة",
    source_url: "https://www.m.city/ar/news/city-vs-spurs-match-report-march-2026",
    category: "football",
    locale: "ar",
    title: "سيتي 3-1 توتنهام: أداء متميز يُبقي حلم اللقب حياً",
    excerpt: "قدّم مانشستر سيتي عرضاً متكاملاً لتحقيق الفوز على توتنهام 3-1 في الإتحاد، محافظاً على صدارة الدوري بفارق نقطة.",
    content_body: "قدّم مانشستر سيتي درساً رائعاً في الكفاءة الهجومية بفوزه الساحق على توتنهام هوتسبر 3-1 في ملعب الإتحاد. افتتح فيل فودن التسجيل بتسديدة ملتوية رائعة، ليضاعف كيفن دي بروين التقدم بصاروخية من بعيد. سجّل سون هيونغ-مين هدف التقليص قبيل نهاية الشوط الأول، لكن البرتغالي بيرناردو سيلفا حسم الأمر بهدف ثالث في الساعة الأولى من الشوط الثاني.",
    featured_image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  },

  // ── Hebrew ──────────────────────────────────────────────────────────────────
  {
    slug: "city-champions-league-semi-draw",
    published_at: "2026-03-30T09:00:00Z",
    source_name: "m.city ספורט",
    source_url: "https://www.m.city/he/news/city-champions-league-semi-draw",
    category: "football",
    locale: "he",
    title: "סיטי נגד ריאל מדריד בחצי גמר ליגת האלופות",
    excerpt: "הגרלת חצי הגמר שיבצה את מנצ'סטר סיטי נגד ריאל מדריד, במפגש ענק צפוי באצטדיון אתיהד.",
    content_body: "מנצ'סטר סיטי יתמודד מול ריאל מדריד בחצי גמר ליגת האלופות, לאחר הגרלה שנערכה היום בניון. משחק הבית יתקיים באצטדיון אתיהד ב-22 באפריל, ואילו המשחק החוזר יתקיים בברנאבאו שבוע לאחר מכן. גוארדיולה כינה את הדו-קרב 'המפגש שכולם רצו לראות'. סיטי ניצח את ריאל מדריד בשניים מתוך שלושת המפגשים האחרונים בשלבי הנוק-אאוט.",
    featured_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
  },
  {
    slug: "manchester-april-events-guide-2026",
    published_at: "2026-03-30T08:00:00Z",
    source_name: "m.city מדריך",
    source_url: "https://www.m.city/he/news/manchester-april-events-guide-2026",
    category: "lifestyle",
    locale: "he",
    title: "מנצ'סטר באפריל 2026: המדריך המלא לאירועים",
    excerpt: "פסטיבלי אוכל, מוזיקה חיה ותערוכות תרבותיות — אפריל עמוס בדברים מדהימים לעשות במנצ'סטר.",
    content_body: "אפריל במנצ'סטר מציג את אחד הלוחות הצפופים ביותר של אירועים בשנים האחרונות. פסטיבל האוכל והשתייה של מנצ'סטר חוזר לגני פיקדילי מה-5 עד ה-14 באפריל, עם למעלה מ-80 מסעדות ודוכני רחוב. The Warehouse Project חוזר עם תוכנית מיוחדת לחג הפסחא ב-Depot Mayfield. תערוכת 'Northern Light' נפתחת בגלריה לאמנות ב-10 באפריל ונמשכת עד אוגוסט.",
    featured_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  },
  {
    slug: "haaland-injury-update-march-2026",
    published_at: "2026-03-30T07:30:00Z",
    source_name: "m.city ספורט",
    source_url: "https://www.m.city/he/news/haaland-injury-update-march-2026",
    category: "football",
    locale: "he",
    title: "הולאנד בדרך לחזרה לקראת מרוץ אפריל המכריע",
    excerpt: "ארלינג הולאנד בדרך לחזרה מפציעה לקראת משחקי מנצ'סטר סיטי המרכזיים באפריל.",
    content_body: "גוארדיולה הודיע בוועידת העיתונאים שהולאנד צפוי להיות מוכן לאפריל. הנורווגי שב לאימונים מלאים ביום שישי לאחר שבועיים בגלל בעיה שרירית. 'הוא נראה חד ורעב,' אמר גוארדיולה. הולאנד כבר רשם 29 גולים בכל התחרויות עונה זו.",
    featured_image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80",
  },
  {
    slug: "city-vs-spurs-match-report-march-2026",
    published_at: "2026-03-29T22:00:00Z",
    source_name: "m.city ספורט",
    source_url: "https://www.m.city/he/news/city-vs-spurs-match-report-march-2026",
    category: "football",
    locale: "he",
    title: "סיטי 3-1 טוטנהאם: הופעה קלינית שומרת על חלום האליפות",
    excerpt: "מנצ'סטר סיטי הדף את טוטנהאם 3-1 באתיהד, ושומר על פסגת הטבלה עם יתרון נקודה.",
    content_body: "מנצ'סטר סיטי הציג שיעור בסיום קליני בניצחון 3-1 על טוטנהאם הוטספר. פיל פודן פתח בשערו הנהדר, ודה-ברוינה הכפיל מרחוק. סון קצר את הפער לפני חצי היה, אבל ברנרדו סילבה חתם ב-60 דקות. הניצחון מותיר את סיטי נקודה אחת מעל ארסנל עם 8 משחקים לסיום.",
    featured_image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  },

  // ── Spanish ─────────────────────────────────────────────────────────────────
  {
    slug: "city-champions-league-semi-draw",
    published_at: "2026-03-30T09:00:00Z",
    source_name: "m.city Deporte",
    source_url: "https://www.m.city/es/news/city-champions-league-semi-draw",
    category: "football",
    locale: "es",
    title: "City se enfrenta al Real Madrid en semifinales de la Champions",
    excerpt: "El sorteo de semifinales empareja al Manchester City con el Real Madrid en un esperado choque en el Etihad.",
    content_body: "El Manchester City se enfrentará al Real Madrid en las semifinales de la Champions League, tras el sorteo celebrado hoy en Nyon. El partido de ida se disputará en el Etihad Stadium el 22 de abril, y la vuelta será en el Bernabéu una semana después. Guardiola calificó el enfrentamiento como 'el duelo que todos querían ver'. City ha vencido al Real Madrid en dos de los últimos tres encuentros en la fase de eliminación directa.",
    featured_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
  },
  {
    slug: "manchester-april-events-guide-2026",
    published_at: "2026-03-30T08:00:00Z",
    source_name: "m.city Guía",
    source_url: "https://www.m.city/es/news/manchester-april-events-guide-2026",
    category: "lifestyle",
    locale: "es",
    title: "Mánchester en abril de 2026: la guía definitiva de eventos",
    excerpt: "Festivales gastronómicos, música en vivo y exposiciones culturales — abril está repleto de planes increíbles en Mánchester.",
    content_body: "El abril de Mánchester promete ser uno de los más animados en años. El Manchester Food & Drink Festival regresa a los Piccadilly Gardens del 5 al 14 de abril, con más de 80 restaurantes y puestos callejeros. The Warehouse Project vuelve al Depot Mayfield con una programación especial de Semana Santa. La nueva exposición 'Northern Light' de la Manchester Art Gallery inaugura el 10 de abril y estará hasta agosto.",
    featured_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  },
  {
    slug: "haaland-injury-update-march-2026",
    published_at: "2026-03-30T07:30:00Z",
    source_name: "m.city Deporte",
    source_url: "https://www.m.city/es/news/haaland-injury-update-march-2026",
    category: "football",
    locale: "es",
    title: "Haaland apunta a regresar para los cruciales partidos de abril",
    excerpt: "Erling Haaland está en camino de recuperarse de su lesión a tiempo para los decisivos encuentros del Manchester City en abril.",
    content_body: "Guardiola confirmó en rueda de prensa que Haaland estará disponible en abril. El delantero noruego, que llevaba dos semanas sin jugar por una lesión muscular, volvió a entrenarse el viernes. 'Se le ve afilado y con hambre', dijo el técnico. Haaland suma 29 goles en todas las competiciones esta temporada.",
    featured_image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=80",
  },
  {
    slug: "city-vs-spurs-match-report-march-2026",
    published_at: "2026-03-29T22:00:00Z",
    source_name: "m.city Deporte",
    source_url: "https://www.m.city/es/news/city-vs-spurs-match-report-march-2026",
    category: "football",
    locale: "es",
    title: "City 3-1 Spurs: exhibición clínica que mantiene vivo el sueño del título",
    excerpt: "El Manchester City goleó al Tottenham 3-1 en el Etihad y mantiene un punto de ventaja en lo alto de la Premier League.",
    content_body: "El Manchester City ofreció una lección de eficacia al superar al Tottenham Hotspur 3-1 en el Etihad. Phil Foden abrió el marcador con un disparo en rosca, De Bruyne dobló ventaja desde lejos, Son recortó antes del descanso, pero Bernardo Silva cerró la cuenta en el minuto 60. El resultado deja al City con un punto de ventaja sobre el Arsenal con ocho jornadas por delante.",
    featured_image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  },
];

const insertMany = db.transaction((items) => {
  let inserted = 0;
  let skipped = 0;
  for (const item of items) {
    const result = insert.run(item);
    if (result.changes > 0) inserted++;
    else skipped++;
  }
  return { inserted, skipped };
});

const result = insertMany(news);
console.log(`✅ Tamamlandı: ${result.inserted} yeni haber eklendi, ${result.skipped} zaten vardı.`);

// Toplam kontrol
const total = db.prepare("SELECT locale, COUNT(*) as count FROM news GROUP BY locale").all();
console.log("\n📊 Locale başına haber sayısı:");
total.forEach((r) => console.log(`  ${r.locale}: ${r.count} haber`));

const latest = db.prepare("SELECT title, published_at, locale FROM news ORDER BY published_at DESC LIMIT 4").all();
console.log("\n🔔 En son haberler:");
latest.forEach((r) => console.log(`  [${r.locale}] ${r.title} — ${r.published_at}`));
