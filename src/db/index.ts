/**
 * TrailCast — boot path for the SQLite database.
 *
 * The runner is intentionally small: open the named database (kvv2),
 * run the idempotent migrations, and return the handle. Anything that
 * needs the DB later should call `getDatabase()` from here — we
 * intentionally do NOT support multiple connections to avoid the
 * "two writers, one writer wins" pitfall called out in the PRD §6.1.
 *
 * On the host running jest, `expo-sqlite` is mocked to a
 * better-sqlite3-backed in-memory DB (see `jest.setup.ts`), so this
 * module is safe to import in tests.
 */
import * as SQLite from 'expo-sqlite';
import { runMigrations } from './migrate';

const DB_NAME = 'trailcast.db';
const DB_CACHE_KEY = 'trailcast.boot.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbPromise === null) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await runMigrations(db);
      return db;
    })();
  }
  return dbPromise;
}

/** Test-only — clear the cached promise so a fresh DB is opened next call. */
export function __resetDatabaseForTests(): void {
  dbPromise = null;
}

// Cache key exported for diagnostics / future cache-eviction logic.
export { DB_NAME, DB_CACHE_KEY };