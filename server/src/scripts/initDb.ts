import fs from 'fs';
import path from 'path';
import { Client } from 'pg';

// Guarded, idempotent-ish DB initializer for Render
// Usage (Render Build Command example):
//   RUN_DB_INIT=true npm run build && node dist/scripts/initDb.js
// Safety:
// - Skips by default unless RUN_DB_INIT === 'true'
// - If tables already exist, it will SKIP unless FORCE_DB_RESET === 'true'

function log(msg: string) {
  console.log(`[initDb] ${msg}`);
}

async function main() {
  if (process.env.RUN_DB_INIT !== 'true') {
    log('RUN_DB_INIT is not true; skipping schema initialization.');
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set.');
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    log('Connected to database.');

    // Check if a common table already exists to avoid destructive resets by default
    const check = await client.query(
      `SELECT COUNT(*)::int AS count
       FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'users'`
    );
    const existingUsersTable = (check.rows?.[0]?.count ?? 0) > 0;

    if (existingUsersTable && process.env.FORCE_DB_RESET !== 'true') {
      log('Detected existing tables (e.g., users). Skipping initialize.sql (set FORCE_DB_RESET=true to override).');
      return;
    }

    const sqlFile = path.resolve(__dirname, '../..', 'db', 'initialize.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    if (/\bDROP\b/i.test(sql) && process.env.FORCE_DB_RESET !== 'true') {
      log('initialize.sql contains DROP statements; set FORCE_DB_RESET=true to proceed. Skipping.');
      return;
    }

    log(`Running initialize.sql (${sql.length} bytes)...`);
    await client.query(sql);
    log('Schema initialization completed successfully.');
  } finally {
    await client.end().catch(() => void 0);
    log('Connection closed.');
  }
}

main().catch((err) => {
  console.error('[initDb] Error:', err);
  process.exitCode = 1;
});
