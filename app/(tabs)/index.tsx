import { ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import { DEMO_FIXTURES } from '@/weather/fixtures';
import { WeatherCard, PrecipStripCard, MetricsRow } from '@/components/WeatherCard';
import { fetchWeather } from '@/weather/fetch';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Location from 'expo-location';

/**
 * Today tab — PRD §3.1 / §4.
 *
 * GPS-first: requests foreground location on mount, reverse-geocodes city,
 * then fetches Open-Meteo for live coords. Falls back to Ankara fixture
 * (demo) if permission denied or location unavailable — ponytail: no extra
 * dep, stdlib + expo-location only.
 */
export default function TodayScreen() {
  const language = useSettings((s) => s.language);
  const fixture = DEMO_FIXTURES[0]!;
  const [weather, setWeather] = useState(fixture);
  const [cityLabel, setCityLabel] = useState(fixture.city);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'denied' | 'live'>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWithLocation() {
      // Show fixture immediately while locating
      setLocationStatus('locating');
      setLoading(true);
      setError(null);

      let lat = fixture.latitude;
      let lon = fixture.longitude;
      let city = fixture.city;
      let country = fixture.country;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) setLocationStatus('denied');
          throw new Error('permission_denied');
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;

        // Reverse geocode for city name — best effort, falls back to generic label
        try {
          const places = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
          const p = places[0];
          if (p) {
            city = p.city ?? p.subregion ?? p.region ?? t(language, 'today.location.current');
            country = p.country ?? country;
          } else {
            city = t(language, 'today.location.current');
          }
        } catch {
          city = t(language, 'today.location.current');
        }
        if (isMounted) setLocationStatus('live');
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        if (msg === 'permission_denied') {
          // keep Ankara fixture coords, already set denied above
        } else {
          console.warn('Location failed, falling back to demo:', e);
          if (isMounted && locationStatus !== 'denied') setLocationStatus('denied');
        }
      }

      // Fetch weather for resolved coords (live or fallback)
      try {
        const liveData = await fetchWeather(lat, lon);
        const liveFixture = {
          city,
          country,
          latitude: lat,
          longitude: lon,
          capturedAt: new Date().toISOString(),
          current: liveData.current,
          precip: liveData.precip,
          cached: liveData.cached,
          fetchedAt: liveData.fetchedAt,
        };
        if (isMounted) {
          setWeather(liveFixture);
          setCityLabel(city);
        }
      } catch (err) {
        console.error('Failed to fetch live weather:', err);
        if (isMounted) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWithLocation();
    return () => {
      isMounted = false;
    };
    // language used only for fallback city label; don't re-trigger on lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} testID="today-screen">
      <Text style={styles.title}>{t(language, 'today.header')}</Text>
      <Text style={styles.subtitle}>{cityLabel}</Text>

      {locationStatus === 'locating' && !loading && (
        <Text style={styles.locationHint}>{t(language, 'today.location.loading')}</Text>
      )}
      {locationStatus === 'denied' && (
        <Text style={styles.locationHint}>{t(language, 'today.location.denied')}</Text>
      )}

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
  locationHint: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic' },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  loadingText: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  errorContainer: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, gap: 4, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { fontSize: 13, color: '#DC2626', fontWeight: '600' },
  fallbackText: { fontSize: 12, color: '#991B1B' },
});
