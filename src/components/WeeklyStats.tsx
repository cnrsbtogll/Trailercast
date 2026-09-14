/**
 * TrailCast — Weekly stats summary card (Log tab header).
 *
 * ponytail: reads sessions from SQLite, computes this-week totals inline.
 * No separate state — just a pure component that receives sessions and renders.
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import type { SessionRow } from '@/db/schema';

interface Props {
  sessions: SessionRow[];
}

export function WeeklyStats({ sessions }: Props) {
  const language = useSettings((s) => s.language);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);

  const weekSessions = sessions.filter(
    (s) => new Date(s.started_at) >= weekStart,
  );

  const totalMin = weekSessions.reduce((acc, s) => acc + Math.round(s.duration_sec / 60), 0);
  const totalKm = weekSessions.reduce((acc, s) => acc + (s.distance_m ?? 0) / 1000, 0);

  if (weekSessions.length === 0) return null;

  return (
    <View style={styles.card} testID="weekly-stats">
      <Text style={styles.title}>{t(language, 'log.weekly.title')}</Text>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.value}>{totalKm > 0 ? totalKm.toFixed(1) : '—'}</Text>
          <Text style={styles.label}>{t(language, 'log.weekly.distance')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.value}>{totalMin}</Text>
          <Text style={styles.label}>{t(language, 'common.unit.minShort')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.value}>{weekSessions.length}</Text>
          <Text style={styles.label}>{t(language, 'log.weekly.count')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  title: { fontSize: 14, fontWeight: '600', color: '#475569' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { flex: 1, alignItems: 'center' },
  value: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  label: { fontSize: 11, color: '#64748B', marginTop: 2 },
});