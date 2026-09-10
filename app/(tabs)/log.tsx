import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
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
      <View style={styles.emptyWrap}>
        <Text style={styles.empty}>{t(language, 'log.empty')}</Text>
        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={() => Alert.alert(t(language, 'log.newCta'), 'Yakında — antrenman formu slice 4 ile geliyor')}
          testID="log-new-cta"
        >
          <Text style={styles.ctaText}>{t(language, 'log.newCta')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 48,
  },
  empty: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  cta: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  ctaPressed: { opacity: 0.88 },
  ctaText: { fontSize: 15, color: '#F8FAFC', fontWeight: '700', textAlign: 'center' },
});
