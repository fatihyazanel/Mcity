const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const outFile = "D:\\get-shit-done-main\\seed-result.txt";
try {
const db = new Database(path.join(__dirname, "data.db"));
db.pragma("journal_mode = WAL");

// Clear and re-insert ALL products
db.exec("DELETE FROM products;");

const ins = db.prepare(`INSERT OR REPLACE INTO products (product_name, product_slug, product_image, description_short, price_display, price_amount, affiliate_link, partner_name, locale, category, in_stock) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
function img(id) { return "https://images.unsplash.com/" + id + "?w=400&h=400&fit=crop&q=75"; }

const en = [
  ["Home Kit 2025/26","home-kit-25",img("photo-1580087256394-dc596e1c8f4f"),"Official Manchester City home jersey. Lightweight Dri-FIT.","£75",75,"#","City Store","en","jersey",1],
  ["Away Kit 2025/26","away-kit-25",img("photo-1579952363873-27f3bade9f55"),"Navy away kit with gold accents. Premium breathable fabric.","£75",75,"#","City Store","en","jersey",1],
  ["Third Kit 2025/26","third-kit-25",img("photo-1551854838-212c50b4c184"),"Limited edition burgundy third kit with retro collar.","£80",80,"#","City Store","en","jersey",1],
  ["Retro 1969 FA Cup Kit","retro-1969",img("photo-1574629810360-7efbbe195018"),"Faithful reproduction of the iconic 1969 cup-winning shirt.","£55",55,"#","City Store","en","jersey",1],
  ["Goalkeeper Kit 2025","gk-kit-25",img("photo-1606107557195-0e29a4b5b4aa"),"Neon green GK jersey with padded elbows. Match spec.","£70",70,"#","City Store","en","jersey",1],
  ["Kids Home Kit","kids-home-kit",img("photo-1503919545889-aef636e10ad4"),"Complete mini kit for young fans — shirt, shorts, socks.","£50",50,"#","City Store","en","jersey",1],
  ["Training Tracksuit","training-tracksuit",img("photo-1556906781-9a412961c28c"),"Official training tracksuit. Zip jacket + matching pants.","£95",95,"#","City Store","en","apparel",1],
  ["City Hoodie Grey","hoodie-grey",img("photo-1556821840-3a63f95609a7"),"Premium cotton-blend hoodie with embossed City crest.","£50",50,"#","City Store","en","apparel",1],
  ["Training Jacket Black","training-jacket",img("photo-1591047139829-d91aecb6caea"),"Lightweight training jacket. Breathable, water-resistant.","£65",65,"#","City Store","en","apparel",1],
  ["Polo Shirt Sky","polo-sky",img("photo-1598033129183-c4f50c736c10"),"Smart casual polo in sky blue. Perfect for matchday.","£35",35,"#","City Store","en","apparel",1],
  ["City Joggers Navy","joggers-navy",img("photo-1552902865-b72c031ac5ea"),"Tapered fit joggers with zip pockets. Navy with sky trim.","£40",40,"#","City Store","en","apparel",1],
  ["Baseball Cap","cap-sky",img("photo-1588850561407-ed78c334e67a"),"Adjustable cap with embroidered crest. 100% cotton.","£16",16,"#","City Store","en","accessory",1],
  ["Sky Blue Bar Scarf","scarf-sky",img("photo-1520903920243-00d872a2d1c9"),"Classic bar scarf in sky blue and white. 100% acrylic.","£18",18,"#","City Store","en","accessory",1],
  ["Beanie Hat Navy","beanie-navy",img("photo-1576871337622-98d48d1cf531"),"Ribbed knit beanie with embroidered crest.","£15",15,"#","City Store","en","accessory",1],
  ["Matchday Gloves","gloves",img("photo-1578662996442-48f60103fc96"),"Touchscreen-compatible gloves with silicone grip.","£12",12,"#","City Store","en","accessory",1],
  ["City Umbrella","umbrella",img("photo-1534483509719-8948e5b3f120"),"Windproof automatic umbrella. Manchester weather essential.","£22",22,"#","City Store","en","accessory",1],
  ["Backpack Navy","backpack-navy",img("photo-1553062407-98eeb64c6a62"),"Padded laptop backpack with multiple compartments.","£38",38,"#","City Store","en","accessory",1],
  ["Football Boots Pro","boots-pro",img("photo-1543326727-cf6c39e8f84c"),"Lightweight boots with textured upper for ball control.","£120",120,"#","Nike","en","footwear",1],
  ["Training Shoes","training-shoes",img("photo-1542291026-7eec264c27ff"),"Versatile indoor/outdoor training shoes with City branding.","£85",85,"#","Puma","en","footwear",1],
  ["City Crest Mug","mug-crest",img("photo-1514228742587-6b1558fcca3d"),"Ceramic mug with wraparound sky blue design.","£10",10,"#","City Store","en","home",1],
  ["Etihad 3D Puzzle","puzzle-etihad",img("photo-1577223625816-7546f13df25d"),"380-piece 3D stadium puzzle. Great for all ages.","£28",28,"#","City Store","en","home",1],
  ["Cushion Sky Blue","cushion-sky",img("photo-1555041469-a586c61ea9bc"),"Soft-touch cushion with embroidered crest. 45x45cm.","£20",20,"#","City Store","en","home",1],
  ["Water Bottle 750ml","water-bottle",img("photo-1602143407151-7111542de6e8"),"Stainless steel, double insulated. Keeps drinks cold 24h.","£18",18,"#","City Store","en","home",1],
  ["Framed Etihad Print","print-etihad",img("photo-1508098682722-e99c43a406b2"),"A3 framed photograph of the Etihad at sunset.","£45",45,"#","City Store","en","collectible",1],
  ["Signed Football","signed-ball",img("photo-1575361204480-aadea25e6e68"),"Official ball signed by the full first-team squad.","£199",199,"#","City Store","en","collectible",0],
  ["Miniature PL Trophy","mini-trophy",img("photo-1560272564-c83b66b1ad12"),"Die-cast miniature Premier League trophy. 15cm tall.","£30",30,"#","City Store","en","collectible",1],
  ["Pin Badge Set","pin-badges",img("photo-1605000797499-95a51c5269ae"),"Set of 6 enamel pin badges. Iconic City moments.","£14",14,"#","City Store","en","collectible",1],
  ["Match Programme Pack","programme-pack",img("photo-1544947950-fa07a98d237f"),"Pack of 5 collector match-day programmes.","£25",25,"#","City Store","en","collectible",1],
  ["Gift Card £25","gift-25",img("photo-1549465220-1a8b9238f7e8"),"Digital gift card. Redeemable at the official City Store.","£25",25,"#","City Store","en","gift",1],
  ["Gift Card £50","gift-50",img("photo-1549465220-1a8b9238f7e8"),"The perfect gift for any City fan.","£50",50,"#","City Store","en","gift",1],
  ["Baby Bodysuit Kit","baby-bodysuit",img("photo-1519689680058-324335c77eba"),"Adorable baby bodysuit in home kit design. 0-18 months.","£22",22,"#","City Store","en","gift",1],
  ["Dog Bandana","dog-bandana",img("photo-1587300003388-59208cc962cb"),"Sky blue bandana for your four-legged fan. S/M/L.","£8",8,"#","City Store","en","gift",1],
];

// Build translated sets
function makeLocale(locale, nameMap, partner) {
  return en.map(p => {
    const slug = p[1];
    const t = nameMap[slug];
    return [
      t ? t[0] : p[0], slug, p[2], t ? t[1] : p[3], p[4], p[5], p[6],
      partner, locale, p[9], p[10]
    ];
  });
}

const ar_map = {
  "home-kit-25":["قميص البيت 2025/26","قميص مانشستر سيتي الرسمي للموسم."],
  "away-kit-25":["قميص الضيف 2025/26","قميص كحلي مع لمسات ذهبية."],
  "third-kit-25":["القميص الثالث 2025/26","إصدار محدود بتصميم ريترو."],
  "retro-1969":["قميص ريترو 1969","نسخة طبق الأصل من قميص كأس 1969."],
  "gk-kit-25":["قميص الحارس 2025","قميص أخضر مع أكواع مبطنة."],
  "kids-home-kit":["طقم الأطفال","طقم كامل للمشجعين الصغار."],
  "training-tracksuit":["بدلة تدريب","بدلة التدريب الرسمية."],
  "hoodie-grey":["هودي رمادي","هودي قطن فاخر مع شعار."],
  "scarf-sky":["وشاح أزرق سماوي","وشاح كلاسيكي أزرق وأبيض."],
  "mug-crest":["كوب السيتي","كوب سيراميك بتصميم أزرق."],
  "signed-ball":["كرة موقعة","كرة رسمية موقعة من الفريق."],
  "gift-25":["بطاقة هدية £25","بطاقة هدية رقمية."],
  "gift-50":["بطاقة هدية £50","بطاقة هدية مثالية لأي مشجع."],
  "boots-pro":["حذاء كرة قدم احترافي","حذاء خفيف للتحكم الأمثل."],
  "water-bottle":["زجاجة مياه","زجاجة ستانلس ستيل معزولة."],
  "backpack-navy":["حقيبة ظهر","حقيبة ظهر مع جيب لابتوب."],
};
const he_map = {
  "home-kit-25":["חולצת בית 2025/26","חולצת הבית הרשמית לעונה."],
  "away-kit-25":["חולצת חוץ 2025/26","חולצה כחול כהה עם דגשים זהובים."],
  "third-kit-25":["חולצה שלישית 2025/26","מהדורה מוגבלת בבורדו."],
  "retro-1969":["חולצת רטרו 1969","שחזור של חולצת הגביע 1969."],
  "gk-kit-25":["חולצת שוער 2025","ירוק ניאון עם מרפקים מרופדים."],
  "kids-home-kit":["ערכת ילדים","ערכה מלאה לאוהדים צעירים."],
  "training-tracksuit":["חליפת אימון","חליפת האימון הרשמית."],
  "hoodie-grey":["קפוצ'ון אפור","קפוצ'ון כותנה פרימיום."],
  "scarf-sky":["צעיף תכלת","צעיף קלאסי בתכלת ולבן."],
  "mug-crest":["ספל סיטי","ספל קרמיקה תכלת."],
  "signed-ball":["כדור חתום","כדור רשמי חתום."],
  "gift-25":["כרטיס מתנה £25","כרטיס מתנה דיגיטלי."],
  "gift-50":["כרטיס מתנה £50","המתנה המושלמת לכל אוהד."],
  "boots-pro":["נעלי כדורגל מקצועיות","נעליים קלות לשליטה."],
  "water-bottle":["בקבוק מים","נירוסטה, בידוד כפול."],
  "backpack-navy":["תיק גב","תיק גב עם תא למחשב נייד."],
};
const es_map = {
  "home-kit-25":["Camiseta Local 2025/26","Camiseta oficial del Manchester City."],
  "away-kit-25":["Camiseta Visitante 2025/26","Azul marino con acentos dorados."],
  "third-kit-25":["Tercera Camiseta 2025/26","Edición limitada en burdeos."],
  "retro-1969":["Camiseta Retro 1969","Reproducción de la camiseta de 1969."],
  "gk-kit-25":["Camiseta Portero 2025","Verde neón con codos acolchados."],
  "kids-home-kit":["Kit Niños","Kit completo para jóvenes fans."],
  "training-tracksuit":["Chándal Entrenamiento","Chándal oficial del equipo."],
  "hoodie-grey":["Sudadera Gris","Sudadera premium de algodón."],
  "scarf-sky":["Bufanda Celeste","Bufanda clásica en celeste y blanco."],
  "mug-crest":["Taza del City","Taza de cerámica con diseño celeste."],
  "signed-ball":["Balón Firmado","Balón oficial firmado por la plantilla."],
  "gift-25":["Tarjeta Regalo £25","Tarjeta regalo digital."],
  "gift-50":["Tarjeta Regalo £50","El regalo perfecto para cualquier fan."],
  "boots-pro":["Botas Fútbol Pro","Botas ligeras para control óptimo."],
  "water-bottle":["Botella de Agua","Acero inoxidable, doble aislamiento."],
  "backpack-navy":["Mochila","Mochila con compartimento portátil."],
};

const all = [
  ...en,
  ...makeLocale("ar", ar_map, "متجر السيتي"),
  ...makeLocale("he", he_map, "חנות סיטי"),
  ...makeLocale("es", es_map, "City Store"),
];

const insertAll = db.transaction(() => {
  for (const p of all) {
    ins.run(p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],p[8],p[9],p[10]);
  }
});
insertAll();

const counts = db.prepare("SELECT locale, count(*) as c FROM products GROUP BY locale").all();
const fs = require("fs");
let out = "";
counts.forEach(r => out += r.locale + ": " + r.c + " products\n");
out += "TOTAL: " + db.prepare("SELECT count(*) as c FROM products").get().c + "\n";
out += "Done!\n";
fs.writeFileSync(path.join(__dirname, "seed-result.txt"), out);
fs.writeFileSync(outFile, out);
console.log(out);
db.close();
} catch(e) {
  const fs2 = require("fs");
  fs2.writeFileSync(outFile, "ERROR: " + e.message + "\n" + e.stack);
}
