/**
 * migrate-reviews.cjs
 * Turso'da product_reviews tablosunu oluşturur
 * Çalıştır: node migrate-reviews.cjs
 */
const { createClient } = require("@libsql/client");

const client = createClient({
  url: "libsql://mcity-fatihyazanel.aws-eu-west-1.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU1ODI3MzQsImlkIjoiMDE5ZDY4ZjktYWEwMS03MGFhLTk5ODUtZjdjM2VhNjcyMzg1IiwicmlkIjoiODMzYTI4MWMtNmUxYi00ODVhLWE5MjQtNzk3NTc3NDI4MGI0In0.W-ncULPLtSEg-pHV_7zwPtzRsBQ7McGv1q0JwWEL29dEN5yaijnEKmF2kKg9XBY7CfouP8WFljNgrkwkVf-ZAA",
});

async function run() {
  console.log("Creating product_reviews table...");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id  INTEGER NOT NULL,
      reviewer_name TEXT NOT NULL,
      rating      INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      review_text TEXT NOT NULL,
      locale      TEXT NOT NULL DEFAULT 'en',
      ip_hash     TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    CREATE INDEX IF NOT EXISTS idx_reviews_product
    ON product_reviews(product_id, created_at DESC)
  `);

  console.log("✅ product_reviews table created successfully!");

  // Tablo yapısını doğrula
  const result = await client.execute("SELECT COUNT(*) as cnt FROM product_reviews");
  console.log("Row count:", result.rows[0].cnt);
}

run().catch(console.error);
