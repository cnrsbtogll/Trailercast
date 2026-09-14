/**
 * TrailCast — weather_snapshots repository.
 *
 * Stores the forecast captured at session-save time so a logged session
 * can later show "what the weather was like during that run".
 */
import { getDatabase } from './index';
import type { ParsedCurrent, ParsedForecast } from '@/weather/openMeteo';

export interface NewSnapshotInput {
  location_id?: number | null;
  current: ParsedCurrent;
  precip?: ParsedForecast;
  captured_at?: string;
}

export async function insertWeatherSnapshot(input: NewSnapshotInput): Promise<number | null> {
  if (input.current.temperatureC === null && input.current.weatherCode === null) return null;
  const db = await getDatabase();
  const now = input.captured_at ?? new Date().toISOString();
  const payload = JSON.stringify({
    current: input.current,
    precip: input.precip?.hours ?? [],
  });
  const result = await db.runAsync(
    `INSERT INTO weather_snapshots
       (location_id, captured_at, temp_c, feels_like_c, humidity_pct, precipitation_mm, wind_kmh, gust_kmh, cloud_cover_pct, condition_code, raw_payload_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    input.location_id ?? null,
    now,
    input.current.temperatureC,
    input.current.feelsLikeC,
    input.current.humidityPct,
    input.current.precipitationMm,
    input.current.windKmh,
    input.current.gustKmh,
    input.current.cloudCoverPct,
    input.current.weatherCode,
    payload,
  );
  return Number(result.lastInsertRowId);
}