const Database = require("better-sqlite3");
const db = new Database("D:\\m.city\\apps\\web\\data.db");
console.log("Products:", db.prepare("SELECT COUNT(*) as c FROM products").get().c);
console.log("By locale:", JSON.stringify(db.prepare("SELECT locale, COUNT(*) as c FROM products GROUP BY locale").all()));
console.log("Categories EN:", JSON.stringify(db.prepare("SELECT DISTINCT category FROM products WHERE locale='en'").all()));
db.close();
