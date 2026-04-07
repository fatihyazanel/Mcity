const { createClient } = require("@libsql/client");
const path = require("path");

const client = createClient({
  url: "file:" + path.join(process.cwd(), "data.db"),
});

async function run() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS page_views (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      path       TEXT    NOT NULL,
      locale     TEXT    NOT NULL DEFAULT 'en',
      referrer   TEXT,
      user_agent TEXT,
      ip_hash    TEXT,
      created_at TEXT    DEFAULT (datetime('now'))
    )
  `);
  await client.execute(
    "CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views(created_at)"
  );
  await client.execute(
    "CREATE INDEX IF NOT EXISTS idx_pv_path ON page_views(path)"
  );
  console.log("OK — page_views tablosu hazır");
}

run().catch((e) => { console.error(e.message); process.exit(1); });
