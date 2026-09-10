import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import { LogModal } from '@/components/LogModal';
import { getSessions, deleteSession } from '@/db/sessions';
import type { SessionRow } from '@/db/schema';

function fmtDate(iso: string, lang: string): string {
  try {
    return new Date(iso).toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'de' ? 'de-DE' : 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso.slice(0, 16);
  }
}

const TYPE_EMOJI: Record<string, string> = {
  run: '🏃',
  ride: '🚴',
  hike: '🥾',
  walk: '🚶',
  other: '◍',
};

function SessionCard({ item, onDelete }: { item: SessionRow; onDelete: (id: number) => void }) {
  const mins = Math.round(item.duration_sec / 60);
  const km = item.distance_m !== null ? (item.distance_m / 1000).toFixed(1) : null;
  return (
    <View style={styles.card} testID={`session-${item.id}`}>
      <View style={styles.cardTop}>
        <Text style={styles.cardEmoji}>{TYPE_EMOJI[item.activity_type] ?? '◍'}</Text>
        <View style={styles.cardMain}>
          <Text style={styles.cardType}>{item.activity_type}</Text>
          <Text style={styles.cardMeta}>
            {mins} min{km ? ` · ${km} km` : ''} {item.rpe !== null ? `· RPE ${item.rpe}` : ''}
          </Text>
        </View>
        <Pressable
          onPress={() => onDelete(item.id)}
          testID={`delete-session-${item.id}`}
          style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}
          accessibilityLabel="Delete"
        >
          <Text style={styles.deleteText}>✕</Text>
        </Pressable>
      </View>
      <Text style={styles.cardDate}>{fmtDate(item.started_at, 'en')}</Text>
      {item.note ? <Text style={styles.cardNote}>{item.note}</Text> : null}
    </View>
  );
}

export default function LogScreen() {
  const language = useSettings((s) => s.language);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const rows = await getSessions();
      setSessions(rows);
    } catch {
      Alert.alert('Error', t(language, 'common.error.network'));
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = useCallback(
    async (id: number) => {
      await deleteSession(id);
      await refresh();
    },
    [refresh],
  );

  if (loading) {
    return (
      <View style={styles.container} testID="log-screen">
        <Text style={styles.loading}>{t(language, 'common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="log-screen">
      {sessions.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>⛰︎</Text>
          <Text style={styles.empty}>{t(language, 'log.empty')}</Text>
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
            onPress={() => setModalOpen(true)}
            testID="log-new-cta"
          >
            <Text style={styles.ctaText}>{t(language, 'log.newCta')}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listCount}>
              {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
            </Text>
            <Pressable
              onPress={() => setModalOpen(true)}
              style={({ pressed }) => [styles.ctaSmall, pressed && styles.ctaPressed]}
              testID="log-new-cta"
            >
              <Text style={styles.ctaSmallText}>＋ {t(language, 'log.newCta')}</Text>
            </Pressable>
          </View>
          <FlatList
            data={sessions}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <SessionCard item={item} onDelete={handleDelete} />}
            contentContainerStyle={styles.listContent}
            testID="session-list"
          />
        </>
      )}

      <LogModal visible={modalOpen} onClose={() => setModalOpen(false)} onSaved={refresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  loading: { fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 32 },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 48,
  },
  emptyIcon: { fontSize: 36, color: '#94A3B8' },
  empty: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 22, maxWidth: 260 },
  cta: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaPressed: { opacity: 0.88 },
  ctaText: { fontSize: 15, color: '#F8FAFC', fontWeight: '700', textAlign: 'center' },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listCount: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#64748B',
  },
  ctaSmall: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  ctaSmallText: { fontSize: 13, color: '#F8FAFC', fontWeight: '700' },
  listContent: { gap: 10, paddingBottom: 24 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 6,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  cardMain: { flex: 1, gap: 2 },
  cardType: { fontSize: 15, fontWeight: '800', color: '#0F172A', textTransform: 'capitalize' },
  cardMeta: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  cardDate: { fontSize: 11, color: '#94A3B8', fontWeight: '600', letterSpacing: 0.3 },
  cardNote: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginTop: 2,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { fontSize: 12, color: '#64748B', fontWeight: '700' },
});
