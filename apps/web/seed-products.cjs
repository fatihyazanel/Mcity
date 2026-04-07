const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

const ins = db.prepare(`INSERT OR REPLACE INTO products (product_name, product_slug, product_image, description_short, price_display, price_amount, affiliate_link, partner_name, locale, category, in_stock) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);

const products = [
  // ── EN (20 new products) ──
  ["Man City Home Kit 24/25","city-home-kit-2425","photo-1522778119026-d647f0596c20","Official Manchester City home jersey for the 2024/25 season. Lightweight AEROREADY fabric.","£75.00",75,"https://store.mancity.com","Man City Store","en","apparel",1],
  ["Man City Away Kit 24/25","city-away-kit-2425","photo-1580087256394-dc596e1c8f4f","The iconic away kit in midnight navy. Breathable, moisture-wicking material.","£75.00",75,"https://store.mancity.com","Man City Store","en","apparel",1],
  ["Man City Third Kit 24/25","city-third-kit-2425","photo-1519125323398-675f0ddb6308","Bold alternative design with unique graphic elements. Limited edition.","£80.00",80,"https://store.mancity.com","Man City Store","en","apparel",1],
  ["Training Tracksuit","training-tracksuit","photo-1556906781-9a412961c28c","Official training tracksuit worn by the squad. Zip-up jacket with matching pants.","£95.00",95,"https://store.mancity.com","Man City Store","en","apparel",1],
  ["Vintage 1972 Retro Shirt","vintage-1972-retro","photo-1571019613454-1cb2f99b2d8b","Classic retro shirt from the 1972 season. Embroidered badge, cotton feel.","£45.00",45,"https://store.mancity.com","Man City Store","en","apparel",1],
  ["Manchester City Scarf","city-premium-scarf","photo-1544966503-7cc5c5e0fcd8","Premium knitted scarf in sky blue and white. Perfect for matchday.","£22.00",22,"https://store.mancity.com","Man City Store","en","accessories",1],
  ["City Beanie Hat","city-beanie-hat","photo-1576871337632-b9aef4c17ab9","Warm knitted beanie with embroidered club crest. One size fits all.","£18.00",18,"https://store.mancity.com","Man City Store","en","accessories",1],
  ["Man City Cap","city-cap","photo-1588850561407-ed78c334e67a","Adjustable baseball cap with curved brim. Sky blue with white logo.","£15.00",15,"https://store.mancity.com","Man City Store","en","accessories",1],
  ["Etihad Stadium Mug","etihad-stadium-mug","photo-1514228742587-6b1558fcca3d","Ceramic mug featuring a panoramic view of the Etihad Stadium. 330ml.","£12.00",12,"https://store.mancity.com","Man City Store","en","homeware",1],
  ["Man City Phone Case","city-phone-case","photo-1511707171634-5f897ff02aa6","Protective phone case with club design. Available for iPhone & Samsung.","£15.00",15,"https://store.mancity.com","Man City Store","en","accessories",1],
  ["Football Boots Pro","football-boots-pro","photo-1543326727-cf6c39e8f84c","Lightweight boots with textured upper for optimal ball control.","£120.00",120,"https://store.mancity.com","Nike","en","footwear",1],
  ["Kids Mini Kit","kids-mini-kit","photo-1503919545889-aef636e10ad4","Complete mini kit for young fans — shirt, shorts, and socks.","£50.00",50,"https://store.mancity.com","Man City Store","en","kids",1],
  ["Kids Training Top","kids-training-top","photo-1560769629-975ec94e6a86","Comfortable training top for junior fans. Breathable fabric.","£35.00",35,"https://store.mancity.com","Man City Store","en","kids",1],
  ["Stadium Backpack","stadium-backpack","photo-1553062407-98eeb64c6a62","Spacious backpack with laptop compartment. Club-branded zippers.","£40.00",40,"https://store.mancity.com","Man City Store","en","accessories",1],
  ["Water Bottle 750ml","city-water-bottle","photo-1602143407151-7111542de6e8","BPA-free water bottle with flip-top lid and club logo. 750ml.","£10.00",10,"https://store.mancity.com","Man City Store","en","homeware",1],
  ["Manchester Hoodie","manchester-hoodie","photo-1556821840-3a63f95609a7","Premium cotton-blend hoodie with Manchester skyline graphic.","£55.00",55,"https://store.mancity.com","Man City Store","en","apparel",1],
  ["Signed Match Ball","signed-match-ball","photo-1551958219-acbc608c6377","Official match ball signed by first-team players. Certificate included.","£150.00",150,"https://store.mancity.com","Man City Store","en","collectibles",1],
  ["Stadium Canvas Print","stadium-canvas-print","photo-1508098682722-e99c43a406b2","High-quality canvas print of the Etihad Stadium at sunset. 60x40cm.","£35.00",35,"https://store.mancity.com","Man City Store","en","homeware",1],
  ["City Keychain","city-keychain","photo-1578662996442-48f60103fc96","Metal keychain with enamel club crest. Gift-boxed.","£8.00",8,"https://store.mancity.com","Man City Store","en","accessories",1],
  ["Manchester Pin Badge Set","manchester-pin-badges","photo-1608889175123-8ee362201f81","Set of 5 collectible enamel pin badges featuring city landmarks.","£12.00",12,"https://store.mancity.com","Man City Store","en","collectibles",1],

  // ── AR (12 new products) ──
  ["طقم مانشستر سيتي الأساسي 24/25","city-home-kit-2425","photo-1522778119026-d647f0596c20","قميص مانشستر سيتي الرسمي لموسم 24/25. قماش AEROREADY خفيف الوزن.","£75.00",75,"https://store.mancity.com","Man City Store","ar","apparel",1],
  ["طقم مانشستر سيتي الاحتياطي 24/25","city-away-kit-2425","photo-1580087256394-dc596e1c8f4f","الطقم الاحتياطي الأيقوني باللون الأزرق الداكن.","£75.00",75,"https://store.mancity.com","Man City Store","ar","apparel",1],
  ["بدلة تدريب","training-tracksuit","photo-1556906781-9a412961c28c","بدلة التدريب الرسمية التي يرتديها الفريق.","£95.00",95,"https://store.mancity.com","Man City Store","ar","apparel",1],
  ["قميص ريترو 1972","vintage-1972-retro","photo-1571019613454-1cb2f99b2d8b","قميص كلاسيكي من موسم 1972. شعار مطرز.","£45.00",45,"https://store.mancity.com","Man City Store","ar","apparel",1],
  ["وشاح مانشستر سيتي","city-premium-scarf","photo-1544966503-7cc5c5e0fcd8","وشاح منسوج فاخر بالأزرق السماوي والأبيض.","£22.00",22,"https://store.mancity.com","Man City Store","ar","accessories",1],
  ["قبعة صوفية","city-beanie-hat","photo-1576871337632-b9aef4c17ab9","قبعة صوفية دافئة مع شعار النادي المطرز.","£18.00",18,"https://store.mancity.com","Man City Store","ar","accessories",1],
  ["كوب ملعب الاتحاد","etihad-stadium-mug","photo-1514228742587-6b1558fcca3d","كوب سيراميك بمنظر بانورامي لملعب الاتحاد.","£12.00",12,"https://store.mancity.com","Man City Store","ar","homeware",1],
  ["حذاء كرة قدم احترافي","football-boots-pro","photo-1543326727-cf6c39e8f84c","حذاء خفيف مع سطح محكم للتحكم الأمثل.","£120.00",120,"https://store.mancity.com","Man City Store","ar","footwear",1],
  ["طقم أطفال","kids-mini-kit","photo-1503919545889-aef636e10ad4","طقم كامل للمشجعين الصغار — قميص وشورت وجوارب.","£50.00",50,"https://store.mancity.com","Man City Store","ar","kids",1],
  ["حقيبة ظهر ملعبية","stadium-backpack","photo-1553062407-98eeb64c6a62","حقيبة ظهر واسعة مع حجرة لابتوب.","£40.00",40,"https://store.mancity.com","Man City Store","ar","accessories",1],
  ["هودي مانشستر","manchester-hoodie","photo-1556821840-3a63f95609a7","هودي قطن فاخر مع رسم أفق مانشستر.","£55.00",55,"https://store.mancity.com","Man City Store","ar","apparel",1],
  ["كرة مباراة موقعة","signed-match-ball","photo-1551958219-acbc608c6377","كرة مباراة رسمية موقعة من لاعبي الفريق الأول.","£150.00",150,"https://store.mancity.com","Man City Store","ar","collectibles",1],

  // ── HE (12 new products) ──
  ["חולצת בית סיטי 24/25","city-home-kit-2425","photo-1522778119026-d647f0596c20","חולצת הבית הרשמית של מנצ'סטר סיטי לעונת 24/25.","£75.00",75,"https://store.mancity.com","Man City Store","he","apparel",1],
  ["חולצת חוץ סיטי 24/25","city-away-kit-2425","photo-1580087256394-dc596e1c8f4f","חולצת החוץ האייקונית בכחול כהה.","£75.00",75,"https://store.mancity.com","Man City Store","he","apparel",1],
  ["חליפת אימון","training-tracksuit","photo-1556906781-9a412961c28c","חליפת האימון הרשמית. ג'קט רוכסן עם מכנסיים תואמים.","£95.00",95,"https://store.mancity.com","Man City Store","he","apparel",1],
  ["חולצת רטרו 1972","vintage-1972-retro","photo-1571019613454-1cb2f99b2d8b","חולצה קלאסית מעונת 1972. סמל רקום.","£45.00",45,"https://store.mancity.com","Man City Store","he","apparel",1],
  ["צעיף סיטי","city-premium-scarf","photo-1544966503-7cc5c5e0fcd8","צעיף סרוג פרימיום בתכלת ולבן.","£22.00",22,"https://store.mancity.com","Man City Store","he","accessories",1],
  ["כובע גרב סיטי","city-beanie-hat","photo-1576871337632-b9aef4c17ab9","כובע גרב חם עם סמל המועדון הרקום.","£18.00",18,"https://store.mancity.com","Man City Store","he","accessories",1],
  ["ספל אצטדיון איתיחאד","etihad-stadium-mug","photo-1514228742587-6b1558fcca3d","ספל קרמיקה עם תמונה פנורמית של האצטדיון.","£12.00",12,"https://store.mancity.com","Man City Store","he","homeware",1],
  ["נעלי כדורגל מקצועיות","football-boots-pro","photo-1543326727-cf6c39e8f84c","נעליים קלות עם חלק עליון מרקם לשליטה אופטימלית.","£120.00",120,"https://store.mancity.com","Man City Store","he","footwear",1],
  ["ערכת ילדים","kids-mini-kit","photo-1503919545889-aef636e10ad4","ערכה מלאה לאוהדים צעירים — חולצה, מכנסיים וגרביים.","£50.00",50,"https://store.mancity.com","Man City Store","he","kids",1],
  ["תיק גב אצטדיון","stadium-backpack","photo-1553062407-98eeb64c6a62","תיק גב רחב עם תא למחשב נייד.","£40.00",40,"https://store.mancity.com","Man City Store","he","accessories",1],
  ["הודי מנצ'סטר","manchester-hoodie","photo-1556821840-3a63f95609a7","הודי כותנה פרימיום עם גרפיקת קו הרקיע של מנצ'סטר.","£55.00",55,"https://store.mancity.com","Man City Store","he","apparel",1],
  ["כדור משחק חתום","signed-match-ball","photo-1551958219-acbc608c6377","כדור משחק רשמי חתום על ידי שחקני ההרכב. כולל תעודה.","£150.00",150,"https://store.mancity.com","Man City Store","he","collectibles",1],

  // ── ES (12 new products) ──
  ["Camiseta Local City 24/25","city-home-kit-2425","photo-1522778119026-d647f0596c20","Camiseta oficial de local del Manchester City temporada 24/25.","£75.00",75,"https://store.mancity.com","Man City Store","es","apparel",1],
  ["Camiseta Visitante City 24/25","city-away-kit-2425","photo-1580087256394-dc596e1c8f4f","La icónica camiseta de visitante en azul marino.","£75.00",75,"https://store.mancity.com","Man City Store","es","apparel",1],
  ["Chándal de Entrenamiento","training-tracksuit","photo-1556906781-9a412961c28c","Chándal oficial de entrenamiento del equipo.","£95.00",95,"https://store.mancity.com","Man City Store","es","apparel",1],
  ["Camiseta Retro 1972","vintage-1972-retro","photo-1571019613454-1cb2f99b2d8b","Camiseta clásica de la temporada 1972. Escudo bordado.","£45.00",45,"https://store.mancity.com","Man City Store","es","apparel",1],
  ["Bufanda Manchester City","city-premium-scarf","photo-1544966503-7cc5c5e0fcd8","Bufanda tejida premium en azul cielo y blanco.","£22.00",22,"https://store.mancity.com","Man City Store","es","accessories",1],
  ["Gorro City","city-beanie-hat","photo-1576871337632-b9aef4c17ab9","Gorro de punto cálido con escudo del club bordado.","£18.00",18,"https://store.mancity.com","Man City Store","es","accessories",1],
  ["Taza Estadio Etihad","etihad-stadium-mug","photo-1514228742587-6b1558fcca3d","Taza de cerámica con vista panorámica del estadio.","£12.00",12,"https://store.mancity.com","Man City Store","es","homeware",1],
  ["Botas de Fútbol Pro","football-boots-pro","photo-1543326727-cf6c39e8f84c","Botas ligeras con textura para control óptimo del balón.","£120.00",120,"https://store.mancity.com","Man City Store","es","footwear",1],
  ["Kit Niños","kids-mini-kit","photo-1503919545889-aef636e10ad4","Kit completo para jóvenes fans — camiseta, pantalón y calcetines.","£50.00",50,"https://store.mancity.com","Man City Store","es","kids",1],
  ["Mochila Stadium","stadium-backpack","photo-1553062407-98eeb64c6a62","Mochila espaciosa con compartimento para portátil.","£40.00",40,"https://store.mancity.com","Man City Store","es","accessories",1],
  ["Sudadera Manchester","manchester-hoodie","photo-1556821840-3a63f95609a7","Sudadera premium de algodón con gráfico del skyline.","£55.00",55,"https://store.mancity.com","Man City Store","es","apparel",1],
  ["Balón Firmado","signed-match-ball","photo-1551958219-acbc608c6377","Balón oficial firmado por jugadores del primer equipo.","£150.00",150,"https://store.mancity.com","Man City Store","es","collectibles",1],
];

const insertAll = db.transaction(() => {
  for (const p of products) {
    ins.run(
      p[0], p[1],
      `https://images.unsplash.com/${p[2]}?w=600&h=600&fit=crop&q=75`,
      p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10]
    );
  }
});
insertAll();
console.log("✅ Added", products.length, "products");

// Also optimize existing product images to smaller sizes
db.prepare("UPDATE products SET product_image = REPLACE(product_image, 'w=800&h=450', 'w=600&h=600&q=75') WHERE product_image LIKE '%w=800%'").run();
console.log("✅ Optimized existing image URLs");

// Show final count
const count = db.prepare("SELECT COUNT(*) as c FROM products").get();
console.log("Total products:", count.c);
const enCount = db.prepare("SELECT COUNT(*) as c FROM products WHERE locale='en'").get();
console.log("EN products:", enCount.c);

db.close();
