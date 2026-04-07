/**
 * migrate-all-tables.cjs
 * Tüm tabloları local data.db → Turso'ya aktarır
 */
const { createClient } = require("@libsql/client");
const path = require("path");

const local = createClient({ url: "file:" + path.join(process.cwd(), "data.db") });
const remote = createClient({
  url: "libsql://mcity-fatihyazanel.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU1ODI3MzQsImlkIjoiMDE5ZDY4ZjktYWEwMS03MGFhLTk5ODUtZjdjM2VhNjcyMzg1IiwicmlkIjoiODMzYTI4MWMtNmUxYi00ODVhLWE5MjQtNzk3NTc3NDI4MGI0In0.W-ncULPLtSEg-pHV_7zwPtzRsBQ7McGv1q0JwWEL29dEN5yaijnEKmF2kKg9XBY7CfouP8WFljNgrkwkVf-ZAA",
});

const s = (v) => (v == null ? null : String(v));
const n = (v) => (v == null ? 0 : Number(v));

async function migrateTable(tableName, createSQL, insertFn) {
  console.log(`\n📦 ${tableName} aktarılıyor...`);
  try {
    await remote.execute(createSQL);
    const rows = await local.execute(`SELECT * FROM ${tableName}`);
    const arr = Array.from(rows.rows);
    let count = 0;
    for (const row of arr) {
      try {
        await insertFn(row);
        count++;
      } catch (e) {
        // UNIQUE constraint ihlali → zaten var, atla
        if (!e.message?.includes("UNIQUE")) {
          console.warn(`  skip: ${e.message?.slice(0, 80)}`);
        }
      }
    }
    console.log(`✅ ${count}/${arr.length} kayıt`);
  } catch (e) {
    console.error(`❌ ${tableName}: ${e.message}`);
  }
}

async function run() {
  console.log("🚀 Full migration başlıyor...");

  // ── places ──
  await migrateTable("places", `
    CREATE TABLE IF NOT EXISTS places (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      address     TEXT,
      category    TEXT DEFAULT 'restaurant',
      rating      REAL DEFAULT 0,
      price_range TEXT,
      website     TEXT,
      locale      TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO places (name,slug,description,image,address,category,rating,price_range,website,locale,is_featured,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [s(row.name),s(row.slug),s(row.description),s(row.image),s(row.address),s(row.category),n(row.rating),s(row.price_range),s(row.website),s(row.locale),n(row.is_featured),s(row.created_at)],
  }));

  // ── deals ──
  await migrateTable("deals", `
    CREATE TABLE IF NOT EXISTS deals (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      discount    TEXT,
      original_price TEXT,
      deal_price  TEXT,
      valid_until TEXT,
      affiliate_link TEXT,
      partner_name TEXT,
      locale      TEXT NOT NULL,
      is_active   INTEGER DEFAULT 1,
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO deals (title,slug,description,image,discount,original_price,deal_price,valid_until,affiliate_link,partner_name,locale,is_active,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.description),s(row.image),s(row.discount),s(row.original_price),s(row.deal_price),s(row.valid_until),s(row.affiliate_link),s(row.partner_name),s(row.locale),n(row.is_active),s(row.created_at)],
  }));

  // ── neighbourhoods ──
  await migrateTable("neighbourhoods", `
    CREATE TABLE IF NOT EXISTS neighbourhoods (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      highlights  TEXT,
      locale      TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO neighbourhoods (name,slug,description,image,highlights,locale,created_at) VALUES (?,?,?,?,?,?,?)`,
    args: [s(row.name),s(row.slug),s(row.description),s(row.image),s(row.highlights),s(row.locale),s(row.created_at)],
  }));

  // ── ideas ──
  await migrateTable("ideas", `
    CREATE TABLE IF NOT EXISTS ideas (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      slug         TEXT NOT NULL,
      excerpt      TEXT,
      content_body TEXT,
      image        TEXT,
      category     TEXT DEFAULT 'general',
      locale       TEXT NOT NULL,
      created_at   TEXT DEFAULT (datetime('now')),
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO ideas (title,slug,excerpt,content_body,image,category,locale,created_at) VALUES (?,?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.excerpt),s(row.content_body),s(row.image),s(row.category),s(row.locale),s(row.created_at)],
  }));

  // ── free_things ──
  await migrateTable("free_things", `
    CREATE TABLE IF NOT EXISTS free_things (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      location    TEXT,
      category    TEXT DEFAULT 'attraction',
      locale      TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO free_things (title,slug,description,image,location,category,locale,created_at) VALUES (?,?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.description),s(row.image),s(row.location),s(row.category),s(row.locale),s(row.created_at)],
  }));

  // ── visitor_info ──
  await migrateTable("visitor_info", `
    CREATE TABLE IF NOT EXISTS visitor_info (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL,
      content     TEXT,
      category    TEXT DEFAULT 'general',
      locale      TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO visitor_info (title,slug,content,category,locale,created_at) VALUES (?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.content),s(row.category),s(row.locale),s(row.created_at)],
  }));

  // ── where_to_stay (hotels) ──
  const hotelTables = await local.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%stay%' OR name LIKE '%hotel%'").catch(() => ({ rows: [] }));
  console.log("\n🏨 Stay tabloları:", hotelTables.rows.map(r => r.name).join(", ") || "yok");

  console.log("\n═══════════════════════════════════");
  console.log("🎉 Full migration tamamlandı!");
  console.log("═══════════════════════════════════");
}

run().catch((e) => { console.error("❌", e.message); process.exit(1); });
