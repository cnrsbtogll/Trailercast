import * as SQLite from 'expo-sqlite';
import { runMigrations } from '@/db/migrate';
import { SCHEMA_VERSION } from '@/db/schema';

describe('runMigrations', () => {
  it('applies the schema on an empty DB', async () => {
    const db = await SQLite.openDatabaseAsync('test-migrate-1');
    const result = await runMigrations(db);
    expect(result.applied).toContain(SCHEMA_VERSION);

    // Verify all expected tables exist.
    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
    );
    const names = tables.map((t: { name: string }) => t.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'locations',
        'weather_snapshots',
        'sessions',
        'schema_meta',
      ]),
    );
    await db.closeAsync();
  });

  it('is idempotent — second run reports alreadyUpToDate', async () => {
    const db = await SQLite.openDatabaseAsync('test-migrate-2');
    const first = await runMigrations(db);
    const second = await runMigrations(db);
    expect(first.applied).toContain(SCHEMA_VERSION);
    expect(second.applied).toContain(SCHEMA_VERSION);
    expect(second.alreadyUpToDate).toBe(true);

    // The version row should still exist exactly once.
    const versionRows = await db.getAllAsync<{ version: number }>(
      'SELECT version FROM schema_meta;',
    );
    expect(versionRows).toHaveLength(1);
    expect(versionRows[0]?.version).toBe(SCHEMA_VERSION);
    await db.closeAsync();
  });

  it('creates the indexes used by the journal query path', async () => {
    const db = await SQLite.openDatabaseAsync('test-migrate-3');
    await runMigrations(db);

    const indexes = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%';",
    );
    const names = indexes.map((i: { name: string }) => i.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'idx_locations_primary',
        'idx_snapshots_location_time',
        'idx_sessions_started_at',
        'idx_sessions_activity_type',
      ]),
    );
    await db.closeAsync();
  });

  it('round-trips an insert/select on sessions', async () => {
    const db = await SQLite.openDatabaseAsync('test-migrate-4');
    await runMigrations(db);

    await db.runAsync(
      `INSERT INTO locations(label, latitude, longitude, created_at)
       VALUES (?, ?, ?, ?);`,
      'Ankara',
      39.9334,
      32.8597,
      new Date().toISOString(),
    );

    const locRows = await db.getAllAsync<{ id: number; label: string }>(
      'SELECT id, label FROM locations;',
    );
    const locationId = locRows[0]?.id ?? 0;
    expect(locRows).toHaveLength(1);
    expect(locRows[0]?.label).toBe('Ankara');

    await db.runAsync(
      `INSERT INTO sessions(location_id, activity_type, started_at, duration_sec, rpe, note, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      locationId,
      'run',
      '2026-09-08T07:30:00.000Z',
      45 * 60,
      6,
      'Sabah koşusu, hafif rüzgâr.',
      new Date().toISOString(),
    );

    const sessions = await db.getAllAsync<{
      activity_type: string;
      duration_sec: number;
      rpe: number;
    }>(
      'SELECT activity_type, duration_sec, rpe FROM sessions ORDER BY started_at DESC;',
    );
    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toEqual({
      activity_type: 'run',
      duration_sec: 2700,
      rpe: 6,
    });
    await db.closeAsync();
  });
});