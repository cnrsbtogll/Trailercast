/**
 * TrailCast — weather card component.
 *
 * Pure presentational: takes parsed weather data (from the live
 * Open-Meteo client OR a fixture) and renders the PRD §3.1 hero card.
 * No data fetching here. That's the contract that lets the Today tab
 * use the same component in fixture-mode (slice 2) and live-mode
 * (slice 3 onwards).
 */
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import { weatherCodeToLabel } from '@/weather/openMeteo';
import type { ParsedCurrent } from '@/weather/openMeteo';

export interface WeatherCardProps {
  current: ParsedCurrent;
  testID?: string;
}

function fmtTemp(c: number | null): string {
  if (c === null) return '—°';
  return `${Math.round(c)}°`;
}

function fmtPct(p: number | null): string {
  if (p === null) return '—';
  return `${Math.round(p)}%`;
}

function fmtKmh(kmh: number | null): string {
  if (kmh === null) return '—';
  return `${Math.round(kmh)} km/h`;
}

export function WeatherCard({ current, testID = 'today-hero' }: WeatherCardProps) {
  const language = useSettings((s) => s.language);

  return (
    <View style={styles.heroCard} testID={testID}>
      <Text style={styles.heroTemp}>{fmtTemp(current.temperatureC)}</Text>
      <Text style={styles.heroCondition}>
        {weatherCodeToLabel(current.weatherCode)}
      </Text>
      <Text style={styles.heroFeels}>
        {t(language, 'today.hero.feels')}: {fmtTemp(current.feelsLikeC)}
      </Text>
    </View>
  );
}

export interface PrecipStripCardProps {
  hours: ReadonlyArray<{
    time: string;
    precipitationMm: number | null;
    precipitationProbPct: number | null;
    weatherCode: number | null;
  }>;
  testID?: string;
}

export function PrecipStripCard({ hours, testID = 'today-precip-strip' }: PrecipStripCardProps) {
  const language = useSettings((s) => s.language);
  // ponytail: 24h geliyor, "önümüzdeki 6 saat" = now'dan itibaren 6
  const nowHour = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const startIdx = hours.findIndex((h) => h.time.slice(0, 13) >= nowHour);
  const display = startIdx >= 0 ? hours.slice(startIdx, startIdx + 6) : hours.slice(0, 6);
  const hasRain = display.some((h) => (h.precipitationMm ?? 0) > 0 || (h.precipitationProbPct ?? 0) > 0);

  return (
    <View style={styles.precipCard} testID={testID}>
      <Text style={styles.sectionTitle}>{t(language, 'today.precip.next6h')}</Text>
      {hasRain ? (
        <View style={styles.stripRow}>
          {display.map((h) => {
            const hh = h.time.slice(11, 16); // "HH:MM"
            const mm = h.precipitationMm === null ? '—' : h.precipitationMm.toFixed(1);
            const pct = h.precipitationProbPct === null ? '—' : `${h.precipitationProbPct}%`;
            return (
              <View key={h.time} style={styles.stripCell} testID={`strip-${hh}`}>
                <Text style={styles.stripTime}>{hh}</Text>
                <Text style={styles.stripMm}>{mm} mm</Text>
                <Text style={styles.stripPct}>{pct}</Text>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyRow} testID="precip-empty">
          <Text style={styles.emptyText}>☀️ {t(language, 'today.precip.none')}</Text>
          <Text style={styles.emptySubtext}>{t(language, 'today.precip.noneHint')}</Text>
        </View>
      )}
    </View>
  );
}

export interface MetricsRowProps {
  current: ParsedCurrent;
}

export function MetricsRow({ current }: MetricsRowProps) {
  const language = useSettings((s) => s.language);
  return (
    <View style={styles.row}>
      <View style={styles.rowItem}>
        <Text style={styles.rowLabel}>{t(language, 'today.wind')}</Text>
        <Text style={styles.rowValue}>{fmtKmh(current.windKmh)}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.rowLabel}>{t(language, 'today.humidity')}</Text>
        <Text style={styles.rowValue}>{fmtPct(current.humidityPct)}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.rowLabel}>{t(language, 'today.cloudCover')}</Text>
        <Text style={styles.rowValue}>{fmtPct(current.cloudCoverPct)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#0F172A',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  heroTemp: { fontSize: 56, fontWeight: '800', color: '#F8FAFC' },
  heroCondition: { fontSize: 16, color: '#CBD5E1' },
  heroFeels: { fontSize: 14, color: '#94A3B8' },
  precipCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  stripRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  stripCell: { alignItems: 'center', flex: 1, minWidth: 0 },
  stripTime: { fontSize: 11, color: '#64748B', textAlign: 'center' },
  stripMm: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginTop: 2 },
  stripPct: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  emptyRow: { alignItems: 'center', paddingVertical: 12, gap: 4 },
  emptyText: { fontSize: 14, fontWeight: '600', color: '#0F172A', textAlign: 'center' },
  emptySubtext: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 8 },
  rowItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  rowLabel: { fontSize: 12, color: '#64748B' },
  rowValue: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginTop: 4 },
});