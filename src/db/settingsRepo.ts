/**
 * TrailCast — app_settings repository (key/value prefs).
 *
 * ponytail: 3-row K/V table, no ORM. Load all on boot, write-on-change.
 * Values are stored as JSON strings so booleans/numbers survive round-trip.
 */
import { getDatabase } from './index';

export interface SettingsSnapshot {
  language: string | null;
  units: string | null;
  pro_unlocked: string | null;
}

export async function loadSettings(): Promise<SettingsSnapshot> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM app_settings;',
  );
  const out: SettingsSnapshot = { language: null, units: null, pro_unlocked: null };
  for (const r of rows) {
    if (r.key === 'language' || r.key === 'units' || r.key === 'pro_unlocked') {
      out[r.key] = r.value;
    }
  }
  return out;
}

export async function saveSetting(key: 'language' | 'units' | 'pro_unlocked', value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?);', key, value);
}