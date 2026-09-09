/**
 * TrailCast — idempotent SQLite migration runner.
 *
 * Strategy:
 *   - Apply every DDL statement in `SCHEMA_SQL` via `execAsync` (idempotent
 *     thanks to `IF NOT EXISTS`).
 *   - Insert the schema version row in `schema_meta`. The insert is wrapped
 *     in `INSERT OR IGNORE` so re-running on an up-to-date DB is a no-op.
 *
 * This function is called once at app boot, before any other DB code runs.
 * It is deliberately synchronous in shape (one execAsync chain) so the
 * rest of the app can assume the schema exists.
 *
 * Returns the set of versions recorded as applied (always contains the
 * current SCHEMA_VERSION after a successful run).
 */
import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL, SCHEMA_VERSION } from './schema';

export interface MigrationResult {
  applied: readonly number[];
  alreadyUpToDate: boolean;
}

export async function runMigrations(
  db: SQLite.SQLiteDatabase,
): Promise<MigrationResult> {
  // Run every DDL statement.
  for (const stmt of SCHEMA_SQL) {
    await db.execAsync(stmt);
  }

  // Check existing version.
  const existing = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM schema_meta WHERE version = ?;',
    SCHEMA_VERSION,
  );

  if (existing !== null) {
    return { applied: [SCHEMA_VERSION], alreadyUpToDate: true };
  }

  await db.runAsync(
    'INSERT OR IGNORE INTO schema_meta(version, applied_at) VALUES (?, ?);',
    SCHEMA_VERSION,
    new Date().toISOString(),
  );

  return { applied: [SCHEMA_VERSION], alreadyUpToDate: false };
}