/**
 * migrate-all-v2.cjs — gerçek kolon yapısıyla tam migration
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

async function recreate(tableName, createSQL, insertFn) {
  console.log(`\n📦 ${tableName}...`);
  await remote.execute(`DROP TABLE IF EXISTS ${tableName}`);
  await remote.execute(createSQL);
  const { rows } = await local.execute(`SELECT * FROM ${tableName}`);
  const arr = Array.from(rows);
  let ok = 0;
  for (const row of arr) {
    try { await insertFn(row); ok++; } catch (e) {
      if (!e.message?.includes("UNIQUE")) console.warn(`  skip: ${e.message?.slice(0,80)}`);
      else ok++; // already exists is fine
    }
  }
  console.log(`  ✅ ${ok}/${arr.length}`);
}

async function run() {
  console.log("🚀 Migration v2 başlıyor...\n");

  // ── ideas ──
  await recreate("ideas", `
    CREATE TABLE IF NOT EXISTS ideas (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      slug         TEXT NOT NULL,
      excerpt      TEXT,
      content_body TEXT,
      image        TEXT,
      category     TEXT DEFAULT 'general',
      read_time    INTEGER DEFAULT 5,
      published_at TEXT,
      locale       TEXT NOT NULL,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO ideas (title,slug,excerpt,content_body,image,category,read_time,published_at,locale) VALUES (?,?,?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.excerpt),s(row.content_body),s(row.image),s(row.category),n(row.read_time),s(row.published_at),s(row.locale)],
  }));

  // ── places ──
  await recreate("places", `
    CREATE TABLE IF NOT EXISTS places (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      category    TEXT DEFAULT 'restaurant',
      address     TEXT,
      price_range TEXT,
      rating      REAL DEFAULT 0,
      stars       INTEGER DEFAULT 0,
      website     TEXT,
      phone       TEXT,
      locale      TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO places (name,slug,description,image,category,address,price_range,rating,stars,website,phone,locale,is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [s(row.name),s(row.slug),s(row.description),s(row.image),s(row.category),s(row.address),s(row.price_range),n(row.rating),n(row.stars),s(row.website),s(row.phone),s(row.locale),n(row.is_featured)],
  }));

  // ── deals ──
  await recreate("deals", `
    CREATE TABLE IF NOT EXISTS deals (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      title          TEXT NOT NULL,
      slug           TEXT NOT NULL,
      description    TEXT,
      image          TEXT,
      discount_text  TEXT,
      original_price TEXT,
      deal_price     TEXT,
      deal_url       TEXT,
      valid_until    TEXT,
      locale         TEXT NOT NULL,
      category       TEXT DEFAULT 'general',
      is_active      INTEGER DEFAULT 1,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO deals (title,slug,description,image,discount_text,original_price,deal_price,deal_url,valid_until,locale,category,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.description),s(row.image),s(row.discount_text),s(row.original_price),s(row.deal_price),s(row.deal_url),s(row.valid_until),s(row.locale),s(row.category),n(row.is_active)],
  }));

  // ── neighbourhoods ──
  await recreate("neighbourhoods", `
    CREATE TABLE IF NOT EXISTS neighbourhoods (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      highlights  TEXT,
      locale      TEXT NOT NULL,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO neighbourhoods (name,slug,description,image,highlights,locale) VALUES (?,?,?,?,?,?)`,
    args: [s(row.name),s(row.slug),s(row.description),s(row.image),s(row.highlights),s(row.locale)],
  }));

  // ── free_things ──
  await recreate("free_things", `
    CREATE TABLE IF NOT EXISTS free_things (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      image       TEXT,
      location    TEXT,
      category    TEXT DEFAULT 'attraction',
      locale      TEXT NOT NULL,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO free_things (title,slug,description,image,location,category,locale) VALUES (?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.description),s(row.image),s(row.location),s(row.category),s(row.locale)],
  }));

  // ── visitor_info ──
  await recreate("visitor_info", `
    CREATE TABLE IF NOT EXISTS visitor_info (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      slug       TEXT NOT NULL,
      content    TEXT,
      icon       TEXT,
      category   TEXT DEFAULT 'general',
      locale     TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO visitor_info (title,slug,content,icon,category,locale,sort_order) VALUES (?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.content),s(row.icon),s(row.category),s(row.locale),n(row.sort_order)],
  }));

  // ── events ──
  await recreate("events", `
    CREATE TABLE IF NOT EXISTS events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL,
      description TEXT,
      event_image TEXT,
      venue       TEXT,
      event_date  TEXT,
      event_end   TEXT,
      ticket_url  TEXT,
      price_range TEXT,
      category    TEXT DEFAULT 'general',
      locale      TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      UNIQUE(slug, locale)
    )`, (row) => remote.execute({
    sql: `INSERT OR IGNORE INTO events (title,slug,description,event_image,venue,event_date,event_end,ticket_url,price_range,category,locale,is_featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [s(row.title),s(row.slug),s(row.description),s(row.event_image),s(row.venue),s(row.event_date),s(row.event_end),s(row.ticket_url),s(row.price_range),s(row.category),s(row.locale),n(row.is_featured)],
  }));

  // ── page_views ──
  await remote.execute(`CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT 'en', referrer TEXT, user_agent TEXT,
    ip_hash TEXT, created_at TEXT DEFAULT (datetime('now'))
  )`);
  console.log("\n  ✅ page_views (zaten vardı)");

  console.log("\n═══════════════════════════════════");
  console.log("🎉 Tüm tablolar hazır!");
  console.log("═══════════════════════════════════");
}

run().catch((e) => { console.error("❌", e.message); process.exit(1); });
