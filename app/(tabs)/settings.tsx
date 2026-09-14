import { View, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useSettings, type Language, type Units } from '@/state/settings';
import { t } from '@/i18n/strings';
import { exportSessions } from '@/utils/exportSessions';

/**
 * Settings tab — PRD §3.1.
 *
 * Units + language toggles wired to the persisted Zustand store;
 * About / privacy / export round out the day-1 deliverable.
 */
export default function SettingsScreen() {
  const { language, setLanguage, units, setUnits } = useSettings();
  const appVersion = Constants.expoConfig?.version ?? '0.1.0';

  const handleExport = async (format: 'csv' | 'json') => {
    const ok = await exportSessions(format);
    Alert.alert(
      ok ? t(language, 'settings.export') : t(language, 'common.error.network'),
      ok ? t(language, 'about.export') : '',
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      testID="settings-screen"
      keyboardShouldPersistTaps="handled"
    >
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

      <Section title={t(language, 'settings.export')}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowInfoText}>{t(language, 'settings.exportDesc')}</Text>
          <View style={styles.rowActions}>
            <Pressable
              onPress={() => handleExport('csv')}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              testID="export-csv"
            >
              <Text style={styles.btnText}>CSV</Text>
            </Pressable>
            <Pressable
              onPress={() => handleExport('json')}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
              testID="export-json"
            >
              <Text style={styles.btnText}>JSON</Text>
            </Pressable>
          </View>
        </View>
      </Section>

      <Section title={t(language, 'privacy.title')}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowInfoText}>{t(language, 'privacy.body')}</Text>
        </View>
      </Section>

      <Section title={t(language, 'settings.about')}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowAboutTitle}>{t(language, 'about.title')}</Text>
          <Text style={styles.rowInfoText}>{t(language, 'about.description')}</Text>
          <Text style={styles.rowInfoText}>
            {t(language, 'about.version')}: {appVersion}
          </Text>
          <Text style={styles.rowInfoText}>
            {t(language, 'about.weather')}: {t(language, 'about.weatherDesc')}
          </Text>
          <Text style={styles.rowInfoText}>{t(language, 'about.data')}</Text>
          <Text style={styles.rowInfoText}>{t(language, 'about.offline')}</Text>
        </View>
      </Section>
    </ScrollView>
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
      style={[styles.row, active ? styles.rowActive : null, label === 'TR' ? null : styles.rowBordered]}
    >
      <Text style={[styles.rowLabel, active ? styles.rowLabelActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#475569', textTransform: 'uppercase' },
  sectionBody: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  row: { padding: 14 },
  rowBordered: { borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#E2E8F0' },
  rowActive: { backgroundColor: '#0F172A' },
  rowLabel: { fontSize: 16, color: '#0F172A' },
  rowLabelActive: { color: '#F8FAFC', fontWeight: '700' },
  rowInfo: { padding: 14, gap: 8 },
  rowInfoText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  rowAboutTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  rowActions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPressed: { opacity: 0.85 },
  btnText: { fontSize: 13, fontWeight: '700', color: '#F8FAFC' },
});