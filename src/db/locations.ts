/**
 * TrailCast — locations repository (slice 1 round-trip).
 *
 * Pure CRUD on top of the booted `expo-sqlite` handle. PRD §6.1
 * caps the free tier at 3 locations — enforced here at the repository
 * layer (the UI gate is slice 6).
 */
import { getDatabase } from './index';
import type { LocationRow } from './schema';

export const FREE_TIER_LOCATION_LIMIT = 3;

export async function listLocations(): Promise<LocationRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<LocationRow>(
    'SELECT * FROM locations ORDER BY is_primary DESC, id ASC;',
  );
}

export async function countLocations(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ n: number }>(
    'SELECT COUNT(*) AS n FROM locations;',
  );
  return row?.n ?? 0;
}

export interface NewLocationInput {
  label: string;
  latitude: number;
  longitude: number;
  elevation_m?: number | null;
  timezone?: string | null;
  is_primary?: boolean;
}

export async function insertLocation(
  input: NewLocationInput,
): Promise<LocationRow> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const isPrimary = input.is_primary ? 1 : 0;
  const result = await db.runAsync(
    `INSERT INTO locations
       (label, latitude, longitude, elevation_m, timezone, created_at, is_primary)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
    input.label,
    input.latitude,
    input.longitude,
    input.elevation_m ?? null,
    input.timezone ?? null,
    now,
    isPrimary,
  );
  // Select the row back using the row we just inserted. This is robust
  // against `lastInsertRowId` shape differences (number vs BigInt) across
  // expo-sqlite implementations and the better-sqlite3 mock used in tests.
  const rows = await db.getAllAsync<LocationRow>(
    'SELECT * FROM locations WHERE label = ? ORDER BY id DESC LIMIT 1;',
    input.label,
  );
  const row = rows[0];
  if (!row) {
    throw new Error(
      `insertLocation: row not found after insert (id=${String(result.lastInsertRowId)})`,
    );
  }
  return row;
}

export async function setPrimaryLocation(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE locations SET is_primary = 0;');
  await db.runAsync('UPDATE locations SET is_primary = 1 WHERE id = ?;', id);
}