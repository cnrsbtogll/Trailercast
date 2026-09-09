import { ScrollView, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import { DEMO_FIXTURES } from '@/weather/fixtures';
import { WeatherCard, PrecipStripCard, MetricsRow } from '@/components/WeatherCard';

/**
 * Today tab — PRD §3.1 / §4.
 *
 * Day-1 deliverable: skeleton renders on internal TestFlight. Live data
 * wiring is Day-2 morning (slice 3 of the impl plan). For now this
 * renders the screen with the PRD §3.1 anchor fixture (Ankara) so the
 * layout is verifiable in a `jest-expo` snapshot test.
 */
export default function TodayScreen() {
  const language = useSettings((s) => s.language);
  // DEMO_FIXTURES is a non-empty readonly array by construction; assert
  // at runtime so we get a clear error if a future tick ever ships an
  // empty fixture list.
  const fixture = DEMO_FIXTURES[0];
  if (!fixture) {
    throw new Error('TodayScreen: DEMO_FIXTURES is empty');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID="today-screen"
    >
      <Text style={styles.title}>{t(language, 'today.header')}</Text>
      <Text style={styles.subtitle}>{fixture.city}</Text>

      <WeatherCard current={fixture.current} />

      <PrecipStripCard hours={fixture.precip.hours} />

      <MetricsRow current={fixture.current} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: -8, marginBottom: 4 },
});