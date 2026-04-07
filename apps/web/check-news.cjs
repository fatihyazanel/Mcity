const { createClient } = require('@libsql/client');
const db = createClient({ url: 'file:D:/m.city/apps/web/data.db' });

async function main() {
  const r = await db.execute("SELECT id, title, source_name, source_url, published_at FROM news WHERE locale='en' ORDER BY published_at DESC LIMIT 25");
  console.log('\n=== EN NEWS (newest first) ===\n');
  r.rows.forEach(row => {
    console.log(`[${row.id}] ${String(row.published_at).slice(0,10)} | ${String(row.source_name).padEnd(22)} | ${String(row.title).slice(0,60)}`);
    console.log(`       URL: ${String(row.source_url).slice(0,80)}`);
    console.log('');
  });
}
main().catch(console.error);
