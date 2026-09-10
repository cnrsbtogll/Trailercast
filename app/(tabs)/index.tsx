import { ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import { DEMO_FIXTURES } from '@/weather/fixtures';
import { WeatherCard, PrecipStripCard, MetricsRow } from '@/components/WeatherCard';
import { fetchWeather } from '@/weather/fetch';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

/**
 * Today tab — PRD §3.1 / §4.
 *
 * Day-1 deliverable: skeleton renders on internal TestFlight. Live data
 * wiring is Day-2 morning (slice 3 of the impl plan). Renders with the
 * PRD §3.1 anchor fixture (Ankara) and attempts live fetch on mount.
 */
export default function TodayScreen() {
  const language = useSettings((s) => s.language);
  const fixture = DEMO_FIXTURES[0];
  if (!fixture) {
    throw new Error('TodayScreen: DEMO_FIXTURES is empty');
  }

  const [weather, setWeather] = useState(fixture);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadLiveWeather() {
      if (!isMounted) return;
      setLoading(true);
      setError(null);

      try {
        const fixtureLocation = DEMO_FIXTURES[0];
        if (!fixtureLocation) throw new Error('No fixture location available');

        const liveData = await fetchWeather(fixtureLocation.latitude, fixtureLocation.longitude);

        const liveFixture = {
          city: fixtureLocation.city,
          country: fixtureLocation.country,
          latitude: fixtureLocation.latitude,
          longitude: fixtureLocation.longitude,
          capturedAt: new Date().toISOString(),
          current: liveData.current,
          precip: liveData.precip,
          cached: liveData.cached,
          fetchedAt: liveData.fetchedAt,
        };

        if (isMounted) {
          setWeather(liveFixture);
        }
      } catch (err) {
        console.error('Failed to fetch live weather:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLiveWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID="today-screen"
    >
      <Text style={styles.title}>{t(language, 'today.header')}</Text>
      <Text style={styles.subtitle}>{weather.city}</Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F172A" />
          <Text style={styles.loadingText}>{t(language, 'common.loading')}</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Weather fetch failed: {error}</Text>
          <Text style={styles.fallbackText}>Showing cached fixture data.</Text>
        </View>
      )}

      {!loading && weather && (
        <>
          <WeatherCard current={weather.current} />
          <PrecipStripCard hours={weather.precip.hours} />
          <MetricsRow current={weather.current} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: -8, marginBottom: 4 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  loadingText: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  errorContainer: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, gap: 4, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { fontSize: 13, color: '#DC2626', fontWeight: '600' },
  fallbackText: { fontSize: 12, color: '#991B1B' },
});
