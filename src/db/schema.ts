/**
 * TrailCast — SQLite schema v1.
 *
 * Three tables:
 *   - locations:        user-saved coordinates (max 3 in free tier)
 *   - weather_snapshots: cached weather data per location+timestamp
 *   - sessions:         activity log entries (each captures a weather_snapshot_id)
 *
 * All timestamps are stored as ISO-8601 TEXT in UTC for portability and
 * human-readable SQLite dumps. Distances are stored as REAL meters.
 * Durations are stored as INTEGER seconds.
 *
 * Schema versioning follows the PRD §6.1 "schema-versioned, supports
 * backup/restore". Migrations live in `migrate.ts`.
 */

export const SCHEMA_VERSION = 2;

export const SCHEMA_SQL: readonly string[] = [
  // locations
  `CREATE TABLE IF NOT EXISTS locations (
     id              INTEGER PRIMARY KEY AUTOINCREMENT,
     label           TEXT    NOT NULL,
     latitude        REAL    NOT NULL,
     longitude       REAL    NOT NULL,
     elevation_m     REAL,
     timezone        TEXT,
     created_at      TEXT    NOT NULL,
     is_primary      INTEGER NOT NULL DEFAULT 0
   );`,
  `CREATE INDEX IF NOT EXISTS idx_locations_primary
     ON locations(is_primary);`,

  // weather_snapshots
  `CREATE TABLE IF NOT EXISTS weather_snapshots (
     id                INTEGER PRIMARY KEY AUTOINCREMENT,
     location_id       INTEGER NOT NULL,
     captured_at       TEXT    NOT NULL,
     temp_c            REAL,
     feels_like_c      REAL,
     humidity_pct      REAL,
     precipitation_mm  REAL,
     wind_kmh          REAL,
     gust_kmh          REAL,
     cloud_cover_pct   REAL,
     condition_code    INTEGER,
     raw_payload_json  TEXT    NOT NULL,
     FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
   );`,
  `CREATE INDEX IF NOT EXISTS idx_snapshots_location_time
     ON weather_snapshots(location_id, captured_at DESC);`,

  // sessions (activity log) — v2 adds adhoc session location (ponytail: denormalized for cheap display)
  `CREATE TABLE IF NOT EXISTS sessions (
     id                INTEGER PRIMARY KEY AUTOINCREMENT,
     location_id       INTEGER,
     activity_type     TEXT    NOT NULL CHECK (activity_type IN
                          ('run','ride','hike','walk','other')),
     started_at        TEXT    NOT NULL,
     duration_sec      INTEGER NOT NULL,
     distance_m        REAL,
     rpe               INTEGER CHECK (rpe BETWEEN 1 AND 10),
     note              TEXT    CHECK (length(note) <= 280),
     weather_snapshot_id INTEGER,
     created_at        TEXT    NOT NULL,
     session_city      TEXT,
     session_lat       REAL,
     session_lon       REAL,
     FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
     FOREIGN KEY (weather_snapshot_id) REFERENCES weather_snapshots(id)
       ON DELETE SET NULL
   );`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_started_at
     ON sessions(started_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_activity_type
     ON sessions(activity_type);`,

  // migration metadata
  `CREATE TABLE IF NOT EXISTS schema_meta (
     version   INTEGER PRIMARY KEY,
     applied_at TEXT    NOT NULL
   );`,
];

// v1 → v2 adhoc location columns for existing DBs (CREATE TABLE above covers fresh installs)
export const MIGRATION_V2_SQL: readonly string[] = [
  `ALTER TABLE sessions ADD COLUMN session_city TEXT;`,
  `ALTER TABLE sessions ADD COLUMN session_lat REAL;`,
  `ALTER TABLE sessions ADD COLUMN session_lon REAL;`,
];

export type ActivityType = 'run' | 'ride' | 'hike' | 'walk' | 'other';

export interface LocationRow {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  elevation_m: number | null;
  timezone: string | null;
  created_at: string;
  is_primary: 0 | 1;
}

export interface WeatherSnapshotRow {
  id: number;
  location_id: number;
  captured_at: string;
  temp_c: number | null;
  feels_like_c: number | null;
  humidity_pct: number | null;
  precipitation_mm: number | null;
  wind_kmh: number | null;
  gust_kmh: number | null;
  cloud_cover_pct: number | null;
  condition_code: number | null;
  raw_payload_json: string;
}

export interface SessionRow {
  id: number;
  location_id: number | null;
  activity_type: ActivityType;
  started_at: string;
  duration_sec: number;
  distance_m: number | null;
  rpe: number | null;
  note: string | null;
  weather_snapshot_id: number | null;
  created_at: string;
  session_city: string | null;
  session_lat: number | null;
  session_lon: number | null;
}