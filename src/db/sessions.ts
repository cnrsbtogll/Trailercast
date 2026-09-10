/**
 * TrailCast — sessions repository (slice 4).
 * CRUD on top of the booted expo-sqlite handle, mirrors locations.ts shape.
 */
import { getDatabase } from './index';
import type { ActivityType, SessionRow } from './schema';

export interface NewSessionInput {
  activity_type: ActivityType;
  duration_sec: number;
  distance_m?: number | null;
  rpe?: number | null;
  note?: string | null;
  location_id?: number | null;
  weather_snapshot_id?: number | null;
  started_at?: string;
}

export async function insertSession(input: NewSessionInput): Promise<SessionRow> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const startedAt = input.started_at ?? now;
  const result = await db.runAsync(
    `INSERT INTO sessions
       (location_id, activity_type, started_at, duration_sec, distance_m, rpe, note, weather_snapshot_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    input.location_id ?? null,
    input.activity_type,
    startedAt,
    input.duration_sec,
    input.distance_m ?? null,
    input.rpe ?? null,
    input.note ?? null,
    input.weather_snapshot_id ?? null,
    now,
  );
  const rows = await db.getAllAsync<SessionRow>(
    'SELECT * FROM sessions WHERE rowid = ?;',
    result.lastInsertRowId,
  );
  // fallback for better-sqlite3 mock where rowid lookup may mismatch — select newest
  if (rows.length === 0) {
    const fallback = await db.getAllAsync<SessionRow>(
      'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
    );
    const row = fallback[0];
    if (!row) throw new Error(`insertSession: row not found after insert (id=${String(result.lastInsertRowId)})`);
    return row;
  }
  return rows[0]!;
}

export async function getSessions(): Promise<SessionRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<SessionRow>(
    'SELECT * FROM sessions ORDER BY started_at DESC, id DESC;',
  );
}

export async function deleteSession(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sessions WHERE id = ?;', id);
}
