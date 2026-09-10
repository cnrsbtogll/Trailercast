import { Modal, View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSettings } from '@/state/settings';
import { t, type StringKey } from '@/i18n/strings';
import type { SessionRow } from '@/db/schema';

const TYPE_EMOJI: Record<string, string> = { run: '🏃', ride: '🚴', hike: '🥾', walk: '🚶', other: '◍' };

function fmtDate(iso: string, locale: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function SessionDetailModal({ session, onClose, onDelete }: { session: SessionRow | null; onClose: () => void; onDelete: (id: number) => void }) {
  const language = useSettings((s) => s.language);
  if (!session) return null;
  const mins = Math.round(session.duration_sec / 60);
  const km = session.distance_m !== null ? (session.distance_m / 1000).toFixed(1) : null;
  const minShort = t(language, 'common.unit.minShort');
  const kmUnit = t(language, 'common.unit.km');
  const loc = session.session_city ?? null;
  const hasCoords = session.session_lat !== null && session.session_lon !== null;

  return (
    <Modal visible={!!session} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} testID="session-detail-modal">
          <View style={styles.accentBar} />
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t(language, 'log.detail.title')}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} testID="detail-close" accessibilityLabel={t(language, 'log.modal.cancel')}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <View style={styles.hero}>
              <Text style={styles.heroEmoji}>{TYPE_EMOJI[session.activity_type] ?? '◍'}</Text>
              <Text style={styles.heroType}>{t(language, `activity.${session.activity_type}` as StringKey)}</Text>
              <Text style={styles.heroDate}>{fmtDate(session.started_at, language)}</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.cell}>
                <Text style={styles.cellLabel}>{t(language, 'log.detail.duration')}</Text>
                <Text style={styles.cellValue}>{mins} {minShort}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellLabel}>{t(language, 'log.detail.distance')}</Text>
                <Text style={styles.cellValue}>{km ? `${km} ${kmUnit}` : '—'}</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.cellLabel}>{t(language, 'log.detail.rpe')}</Text>
                <Text style={styles.cellValue}>{session.rpe !== null ? `RPE ${session.rpe}` : '—'}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t(language, 'log.detail.location')}</Text>
              <Text style={styles.rowValue}>{loc ? `📍 ${loc}` : '—'}</Text>
              {hasCoords && (
                <Text style={styles.rowHint}>{session.session_lat!.toFixed(4)}, {session.session_lon!.toFixed(4)}</Text>
              )}
            </View>

            {session.note ? (
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{t(language, 'log.detail.note')}</Text>
                <Text style={styles.rowValue}>{session.note}</Text>
              </View>
            ) : null}

            <View style={styles.row}>
              <Text style={styles.rowLabel}>{t(language, 'log.detail.date')}</Text>
              <Text style={styles.rowValue}>{fmtDate(session.started_at, language)}</Text>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.btnGhost, pressed && { opacity: 0.86 }]} testID="detail-close-footer">
              <Text style={styles.btnGhostText}>{t(language, 'log.modal.cancel')}</Text>
            </Pressable>
            <Pressable
              onPress={() => { onDelete(session.id); onClose(); }}
              style={({ pressed }) => [styles.btnDanger, pressed && { opacity: 0.86 }]}
              testID="detail-delete"
            >
              <Text style={styles.btnDangerText}>{t(language, 'log.card.delete')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.52)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#F8FAFC', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', borderBottomWidth: 0 },
  accentBar: { height: 4, backgroundColor: '#0F172A' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  closeText: { fontSize: 16, color: '#475569', fontWeight: '600' },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 12, gap: 16 },
  hero: { alignItems: 'center', gap: 4, paddingVertical: 8 },
  heroEmoji: { fontSize: 36 },
  heroType: { fontSize: 18, fontWeight: '800', color: '#0F172A', textTransform: 'capitalize' },
  heroDate: { fontSize: 12, color: '#64748B' },
  grid: { flexDirection: 'row', gap: 8 },
  cell: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, alignItems: 'center', gap: 4 },
  cellLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: '#64748B' },
  cellValue: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  row: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, gap: 4 },
  rowLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: '#64748B' },
  rowValue: { fontSize: 14, color: '#0F172A' },
  rowHint: { fontSize: 11, color: '#94A3B8' },
  footer: { flexDirection: 'row', gap: 12, padding: 16, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  btnGhost: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  btnGhostText: { fontSize: 15, fontWeight: '700', color: '#334155' },
  btnDanger: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#DC2626' },
  btnDangerText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
});
