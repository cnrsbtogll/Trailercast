/**
 * Slice 1 verification — boot path + locations repo round-trip.
 * Exercises the real `runMigrations` + insert/select cycle against
 * the better-sqlite3-backed mock of `expo-sqlite` in jest.setup.ts.
 */
import {
  getDatabase,
  __resetDatabaseForTests,
} from '@/db';
import {
  countLocations,
  insertLocation,
  listLocations,
  setPrimaryLocation,
} from '@/db/locations';

describe('db boot + locations round-trip (slice 1)', () => {
  beforeEach(() => {
    __resetDatabaseForTests();
  });

  it('boots and applies the v1 schema', async () => {
    const db = await getDatabase();
    const tables = await db.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
    );
    const names = tables.map((row) => row.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'locations',
        'weather_snapshots',
        'sessions',
        'schema_meta',
      ]),
    );

    const version = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_meta;',
    );
    expect(version?.version).toBe(1);
  });

  it('re-running boot is idempotent (alreadyUpToDate)', async () => {
    await getDatabase();
    // Second call hits the cache; reset + reopen to force re-migration.
    __resetDatabaseForTests();
    const db = await getDatabase();
    const version = await db.getFirstAsync<{ version: number }>(
      'SELECT version FROM schema_meta;',
    );
    expect(version?.version).toBe(1);
  });

  it('insert + list + count locations', async () => {
    await getDatabase();
    expect(await countLocations()).toBe(0);

    const inserted = await insertLocation({
      label: 'Ankara',
      latitude: 39.9334,
      longitude: 32.8597,
      timezone: 'Europe/Istanbul',
      is_primary: true,
    });
    expect(inserted.id).toBeGreaterThan(0);
    expect(inserted.label).toBe('Ankara');
    expect(inserted.is_primary).toBe(1);

    const all = await listLocations();
    expect(all).toHaveLength(1);
    expect(all[0]?.label).toBe('Ankara');

    expect(await countLocations()).toBe(1);
  });

  it('setPrimaryLocation flips the flag for only one row', async () => {
    await getDatabase();
    const a = await insertLocation({ label: 'A', latitude: 0, longitude: 0 });
    const b = await insertLocation({ label: 'B', latitude: 0, longitude: 0 });
    expect(a.is_primary).toBe(0);
    expect(b.is_primary).toBe(0);

    await setPrimaryLocation(b.id);

    const rows = await listLocations();
    const aRow = rows.find((r) => r.id === a.id);
    const bRow = rows.find((r) => r.id === b.id);
    expect(aRow?.is_primary).toBe(0);
    expect(bRow?.is_primary).toBe(1);
  });

  it('enforces CHECK constraint on activity_type via sessions insert', async () => {
    const db = await getDatabase();
    const now = new Date().toISOString();
    await expect(
      db.runAsync(
        `INSERT INTO sessions
           (activity_type, started_at, duration_sec, created_at)
           VALUES (?, ?, ?, ?);`,
        'paraglide',
        now,
        1800,
        now,
      ),
    ).rejects.toBeDefined();
  });
});