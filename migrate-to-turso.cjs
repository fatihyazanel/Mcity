/**
 * migrate-to-turso.cjs
 * Local data.db → Turso bulut DB'ye tüm veriyi aktarır
 */
const { createClient } = require("@libsql/client");
const path = require("path");

const LOCAL_DB  = path.join(__dirname, "apps", "web", "data.db");
const TURSO_URL = "libsql://mcity-fatihyazanel.aws-eu-west-1.turso.io";
const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU1ODI3MzQsImlkIjoiMDE5ZDY4ZjktYWEwMS03MGFhLTk5ODUtZjdjM2VhNjcyMzg1IiwicmlkIjoiODMzYTI4MWMtNmUxYi00ODVhLWE5MjQtNzk3NTc3NDI4MGI0In0.W-ncULPLtSEg-pHV_7zwPtzRsBQ7McGv1q0JwWEL29dEN5yaijnEKmF2kKg9XBY7CfouP8WFljNgrkwkVf-ZAA";

const local  = createClient({ url: `file:${LOCAL_DB}` });
const remote = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

async function migrate() {
  console.log("🚀 Turso migration başlıyor...\n");

  // ── 1. Tabloları oluştur ──
  console.log("📦 Tablolar oluşturuluyor...");

  await remote.execute(`CREATE TABLE IF NOT EXISTS news (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    slug          TEXT NOT NULL,
    excerpt       TEXT NOT NULL,
    content_body  TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    source_name   TEXT NOT NULL,
    source_url    TEXT NOT NULL,
    published_at  TEXT NOT NULL,
    locale        TEXT NOT NULL,
    category      TEXT NOT NULL DEFAULT 'news',
    created_at    TEXT DEFAULT (datetime('now')),
    UNIQUE(slug, locale)
  )`);

  await remote.execute(`CREATE TABLE IF NOT EXISTS products (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name      TEXT NOT NULL,
    product_slug      TEXT NOT NULL,
    product_image     TEXT NOT NULL,
    description_short TEXT NOT NULL,
    price_display     TEXT NOT NULL,
    price_amount      REAL DEFAULT 0,
    currency          TEXT DEFAULT 'GBP',
    affiliate_link    TEXT NOT NULL,
    partner_name      TEXT NOT NULL,
    locale            TEXT NOT NULL,
    in_stock          INTEGER DEFAULT 1,
    category          TEXT DEFAULT 'merchandise',
    created_at        TEXT DEFAULT (datetime('now')),
    UNIQUE(product_slug, locale)
  )`);

  await remote.execute(`CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    slug        TEXT NOT NULL,
    description TEXT NOT NULL,
    event_image TEXT NOT NULL,
    venue       TEXT NOT NULL,
    event_date  TEXT NOT NULL,
    event_end   TEXT,
    ticket_url  TEXT,
    price_range TEXT,
    locale      TEXT NOT NULL,
    category    TEXT DEFAULT 'general',
    created_at  TEXT DEFAULT (datetime('now')),
    UNIQUE(slug, locale)
  )`);

  await remote.execute(`CREATE TABLE IF NOT EXISTS ad_spots (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    spot_name        TEXT NOT NULL,
    ad_type          TEXT NOT NULL,
    ad_content_code  TEXT,
    ad_image_url     TEXT,
    click_url        TEXT,
    locale           TEXT NOT NULL,
    is_active        INTEGER DEFAULT 1,
    created_at       TEXT DEFAULT (datetime('now'))
  )`);

  await remote.execute(`CREATE TABLE IF NOT EXISTS page_views (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    path       TEXT NOT NULL,
    locale     TEXT NOT NULL DEFAULT 'en',
    referrer   TEXT,
    user_agent TEXT,
    ip_hash    TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  await remote.execute(`CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views(created_at)`);
  await remote.execute(`CREATE INDEX IF NOT EXISTS idx_pv_path ON page_views(path)`);

  console.log("✅ Tablolar hazır\n");

  // ── 2. News ──
  console.log("📰 Haberler aktarılıyor...");
  const news = await local.execute("SELECT * FROM news");
  let newsCount = 0;
  for (const row of news.rows) {
    try {
      await remote.execute({
        sql: `INSERT OR IGNORE INTO news
              (title, slug, excerpt, content_body, featured_image, source_name, source_url, published_at, locale, category, created_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        args: [
          row.title, row.slug, row.excerpt, row.content_body,
          row.featured_image, row.source_name, row.source_url,
          row.published_at, row.locale, row.category ?? "news", row.created_at
        ],
      });
      newsCount++;
    } catch {}
  }
  console.log(`✅ ${newsCount} haber aktarıldı\n`);

  // ── 3. Products ──
  console.log("🛍️  Ürünler aktarılıyor...");
  const products = await local.execute("SELECT * FROM products");
  let prodCount = 0;
  for (const row of products.rows) {
    try {
      await remote.execute({
        sql: `INSERT OR IGNORE INTO products
              (product_name, product_slug, product_image, description_short, price_display,
               price_amount, currency, affiliate_link, partner_name, locale, in_stock, category, created_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [
          row.product_name, row.product_slug, row.product_image, row.description_short,
          row.price_display, row.price_amount ?? 0, row.currency ?? "GBP",
          row.affiliate_link, row.partner_name, row.locale,
          row.in_stock ?? 1, row.category ?? "merchandise", row.created_at
        ],
      });
      prodCount++;
    } catch {}
  }
  console.log(`✅ ${prodCount} ürün aktarıldı\n`);

  // ── 4. Events ──
  console.log("📅 Etkinlikler aktarılıyor...");
  const events = await local.execute("SELECT * FROM events").catch(() => ({ rows: [] }));
  let evCount = 0;
  for (const row of events.rows) {
    try {
      await remote.execute({
        sql: `INSERT OR IGNORE INTO events
              (title, slug, description, event_image, venue, event_date, event_end, ticket_url, price_range, locale, category, created_at)
              VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [
          row.title, row.slug, row.description, row.event_image,
          row.venue, row.event_date, row.event_end ?? null,
          row.ticket_url ?? null, row.price_range ?? null,
          row.locale, row.category ?? "general", row.created_at
        ],
      });
      evCount++;
    } catch {}
  }
  console.log(`✅ ${evCount} etkinlik aktarıldı\n`);

  // ── 5. Ad Spots ──
  console.log("📣 Reklam spotları aktarılıyor...");
  const ads = await local.execute("SELECT * FROM ad_spots").catch(() => ({ rows: [] }));
  let adCount = 0;
  for (const row of ads.rows) {
    try {
      await remote.execute({
        sql: `INSERT OR IGNORE INTO ad_spots
              (spot_name, ad_type, ad_content_code, ad_image_url, click_url, locale, is_active, created_at)
              VALUES (?,?,?,?,?,?,?,?)`,
        args: [
          row.spot_name, row.ad_type, row.ad_content_code ?? null,
          row.ad_image_url ?? null, row.click_url ?? null,
          row.locale, row.is_active ?? 1, row.created_at
        ],
      });
      adCount++;
    } catch {}
  }
  console.log(`✅ ${adCount} reklam spotu aktarıldı\n`);

  // ── Özet ──
  console.log("═══════════════════════════════════");
  console.log("🎉 Migration tamamlandı!");
  console.log(`   📰 Haberler  : ${newsCount}`);
  console.log(`   🛍️  Ürünler   : ${prodCount}`);
  console.log(`   📅 Etkinlikler: ${evCount}`);
  console.log(`   📣 Reklam    : ${adCount}`);
  console.log("═══════════════════════════════════");
  console.log("\n✅ Vercel'e deploy etmeye hazırsın!");
}

migrate().catch((e) => {
  console.error("❌ Hata:", e.message);
  process.exit(1);
});
