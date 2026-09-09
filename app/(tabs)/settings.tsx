import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSettings, type Units, type Language } from '@/state/settings';
import { t } from '@/i18n/strings';

/**
 * Settings tab — PRD §3.1.
 *
 * Day-1 deliverable: units + language toggles wired to the Zustand
 * store. Export, upgrade, privacy link, and about land on Day-2 / Day-3.
 */
export default function SettingsScreen() {
  const { units, language, setUnits, setLanguage } = useSettings();
  return (
    <View style={styles.container} testID="settings-screen">
      <Section title={t(language, 'settings.units')}>
        <ToggleRow
          label={t(language, 'settings.units.metric')}
          active={units === 'metric'}
          onPress={() => setUnits('metric' satisfies Units)}
          testID="units-metric"
        />
        <ToggleRow
          label={t(language, 'settings.units.imperial')}
          active={units === 'imperial'}
          onPress={() => setUnits('imperial' satisfies Units)}
          testID="units-imperial"
        />
      </Section>
      <Section title={t(language, 'settings.language')}>
        <ToggleRow
          label="TR"
          active={language === 'tr'}
          onPress={() => setLanguage('tr' satisfies Language)}
          testID="lang-tr"
        />
        <ToggleRow
          label="EN"
          active={language === 'en'}
          onPress={() => setLanguage('en' satisfies Language)}
          testID="lang-en"
        />
        <ToggleRow
          label="DE"
          active={language === 'de'}
          onPress={() => setLanguage('de' satisfies Language)}
          testID="lang-de"
        />
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function ToggleRow({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.row, active ? styles.rowActive : null]}
    >
      <Text style={[styles.rowLabel, active ? styles.rowLabelActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, gap: 16 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
  sectionBody: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  row: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#E2E8F0' },
  rowActive: { backgroundColor: '#0F172A' },
  rowLabel: { fontSize: 16, color: '#0F172A' },
  rowLabelActive: { color: '#F8FAFC', fontWeight: '700' },
});