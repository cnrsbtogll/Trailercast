/**
 * TrailCast — Weekly forecast card + Best Hours card.
 * ponytail: same file = same import, fewer files to open.
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import { type ParsedDaily, type ParsedForecast } from '@/weather/openMeteo';
import { bestHours } from '@/weather/bestHours';

/* ---------- weather code → emoji ---------- */
function weatherEmoji(code: number | null): string {
  if (code === null) return '☁️';
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function scoreColor(score: number): string {
  if (score <= 2) return '#16A34A'; // green
  if (score <= 5) return '#F59E0B'; // amber
  return '#DC2626'; // red
}

/* ---------- Best Hours Card ---------- */
interface BestHoursProps {
  forecast: ParsedForecast;
}

export function BestHoursCard({ forecast }: BestHoursProps) {
  const language = useSettings((s) => s.language);
  const hours = bestHours(forecast, 3);

  return (
    <View style={styles.card} testID="best-hours-card">
      <View style={styles.cardHeader}>
        <Text style={styles.sectionTitle}>{t(language, 'today.bestHours')}</Text>
        <Text style={styles.sectionHint}>{t(language, 'today.bestHours.hint')}</Text>
      </View>
      {hours.length === 0 ? (
        <Text style={styles.hint}>—</Text>
      ) : (
        <View style={styles.hoursRow}>
          {hours.map((h) => (
            <View key={h.time} style={styles.hourCell}>
              <Text style={styles.hourTime}>{h.hourLabel}</Text>
              <View style={[styles.scoreBadge, { backgroundColor: scoreColor(h.score) }]}>
                <Text style={styles.scoreText}>{h.score.toFixed(1)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/* ---------- Weekly Forecast Card ---------- */
interface WeeklyProps {
  daily: ParsedDaily;
}

const TR_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export function WeeklyForecastCard({ daily }: WeeklyProps) {
  const language = useSettings((s) => s.language);
  const days = daily.days.slice(0, 7);

  return (
    <View style={styles.card} testID="weekly-card">
      <Text style={styles.sectionTitle}>{t(language, 'today.weekly')}</Text>
      {days.length === 0 ? (
        <Text style={styles.hint}>Veri yok</Text>
      ) : (
        <View style={styles.weekRow}>
          {days.map((d, i) => {
            const date = d.date.length >= 10 ? d.date.slice(5) : d.date; // "MM-DD"
            const dayLabel = language === 'tr' && i < 7 ? TR_DAYS[new Date(d.date + 'T12:00:00').getDay() === 0 ? 6 : new Date(d.date + 'T12:00:00').getDay() - 1] : date;
            return (
              <View key={d.date} style={styles.weekDay}>
                <Text style={styles.weekDayLabel}>{dayLabel}</Text>
                <Text style={styles.weekEmoji}>{weatherEmoji(d.weatherCode)}</Text>
                <Text style={styles.weekTempMax}>{d.tempMaxC !== null ? Math.round(d.tempMaxC) + '°' : '—'}</Text>
                <Text style={styles.weekTempMin}>{d.tempMinC !== null ? Math.round(d.tempMinC) + '°' : '—'}</Text>
                {d.precipProbMaxPct !== null && d.precipProbMaxPct > 0 && (
                  <Text style={styles.weekRain}>{d.precipProbMaxPct}%</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
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
  cardHeader: { gap: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#475569' },
  sectionHint: { fontSize: 11, color: '#94A3B8' },
  hint: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic' },
  hoursRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  hourCell: { flex: 1, alignItems: 'center', gap: 6 },
  hourTime: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  scoreText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  weekRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  weekDay: { flex: 1, alignItems: 'center', gap: 2 },
  weekDayLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' },
  weekEmoji: { fontSize: 20 },
  weekTempMax: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  weekTempMin: { fontSize: 12, color: '#94A3B8' },
  weekRain: { fontSize: 10, color: '#3B82F6', fontWeight: '600', marginTop: 1 },
});