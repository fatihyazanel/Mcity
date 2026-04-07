/**
 * db.ts — Unified database client
 *
 * LOCAL DEV:  uses @libsql/client with local file (data.db)
 * PRODUCTION: uses @libsql/client pointing to Turso remote
 *
 * Set env vars for production:
 *   TURSO_DATABASE_URL=libsql://your-db.turso.io
 *   TURSO_AUTH_TOKEN=your-token
 */
import { createClient, type Client, type ResultSet } from "@libsql/client";
import path from "path";
import fs from "fs";

let _client: Client | null = null;

export function getClient(): Client {
  if (_client) return _client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    // Production — Turso remote
    _client = createClient({ url, authToken });
  } else {
    // Local — data.db'yi bul: cwd, cwd/apps/web sırasıyla dene
    const candidates = [
      path.join(process.cwd(), "data.db"),
      path.join(process.cwd(), "apps", "web", "data.db"),
      path.resolve(__dirname, "../../../../../data.db"), // .next/server/chunks → apps/web
    ];
    const filePath = candidates.find((p) => fs.existsSync(p)) ?? candidates[0];
    _client = createClient({ url: `file:${filePath}` });
  }

  return _client;
}

export async function query<T>(
  sql: string,
  args: (string | number | null)[] = []
): Promise<T[]> {
  const result: ResultSet = await getClient().execute({ sql, args });
  return result.rows as unknown as T[];
}

export async function queryOne<T>(
  sql: string,
  args: (string | number | null)[] = []
): Promise<T | undefined> {
  const rows = await query<T>(sql, args);
  return rows[0];
}

export async function execute(
  sql: string,
  args: (string | number | null)[] = []
): Promise<void> {
  await getClient().execute({ sql, args });
}

// initDb is no longer needed — tables are created via Turso/seed scripts.
// Kept as a no-op for backward compat.
export async function initDb(): Promise<void> {
  // no-op: use seed scripts to populate the DB
}
