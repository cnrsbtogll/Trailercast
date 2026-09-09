import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';

/**
 * Log tab — PRD §3.1.
 *
 * Day-1 deliverable: empty list + new-session CTA. Reverse-chrono list
 * + modal form land in slice 4 (Day-2 afternoon).
 */
export default function LogScreen() {
  const language = useSettings((s) => s.language);
  return (
    <View style={styles.container} testID="log-screen">
      <Text style={styles.empty}>{t(language, 'log.empty')}</Text>
      <Text style={styles.cta}>{t(language, 'log.newCta')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
    gap: 12,
  },
  empty: { fontSize: 16, color: '#64748B', marginTop: 24, textAlign: 'center' },
  cta: { fontSize: 16, color: '#0F172A', fontWeight: '600', textAlign: 'center' },
});