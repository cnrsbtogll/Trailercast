/**
 * TrailCast — export util: sessions → CSV / JSON → share sheet.
 *
 * ponytail: no fancy serializer; backtick CSV + JSON.stringify are enough.
 */
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { getSessions } from '@/db/sessions';
import type { SessionRow } from '@/db/schema';

function csvEscape(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(sessions: SessionRow[]): string {
  const header = ['id', 'started_at', 'activity_type', 'duration_sec', 'distance_m', 'rpe', 'note', 'session_city', 'session_lat', 'session_lon', 'weather_snapshot_id'];
  const rows = sessions.map((s) =>
    header.map((h) => csvEscape((s as unknown as Record<string, string | number | null | undefined>)[h])).join(','),
  );
  return [header.join(','), ...rows].join('\n');
}

export async function exportSessions(format: 'csv' | 'json'): Promise<boolean> {
  try {
    const sessions = await getSessions();
    const stamp = new Date().toISOString().slice(0, 10);
    const ext = format === 'csv' ? 'csv' : 'json';
    const content =
      format === 'csv'
        ? toCsv(sessions)
        : JSON.stringify({ exportedAt: new Date().toISOString(), sessions }, null, 2);
    const file = new File(Paths.document, `trailcast-export-${stamp}.${ext}`);
    file.write(content);
    if (!file.exists) {
      file.create({ intermediates: true, overwrite: true });
    }
    if (!(await Sharing.isAvailableAsync())) {
      return false;
    }
    await Sharing.shareAsync(file.uri, { mimeType: format === 'csv' ? 'text/csv' : 'application/json', dialogTitle: 'TrailCast export' });
    return true;
  } catch (e) {
    console.warn('Export failed:', e);
    return false;
  }
}