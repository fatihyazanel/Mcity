const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "data.db"));

const tables = [
  ["news", "featured_image"],
  ["events", "event_image"],
  ["places", "image"],
  ["deals", "image"],
  ["neighbourhoods", "image"],
  ["ideas", "image"],
  ["free_things", "image"],
];

for (const [table, col] of tables) {
  const r = db.prepare(`UPDATE ${table} SET ${col} = REPLACE(${col}, 'w=800&h=450', 'w=600&h=400&q=75') WHERE ${col} LIKE '%w=800%'`).run();
  console.log(`${table}: ${r.changes} images optimized`);
}

db.close();
console.log("✅ Done");
