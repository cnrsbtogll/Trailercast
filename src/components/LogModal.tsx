/**
 * TrailCast — LogModal (slice 4).
 * Distinctive but minimal: slate ink + paper stock, amber accent rule,
 * monospaced section labels — avoids the generic purple gradient.
 */
import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';
import type { ActivityType } from '@/db/schema';
import { insertSession } from '@/db/sessions';

const ACTIVITIES: readonly ActivityType[] = ['run', 'ride', 'hike', 'walk', 'other'] as const;

const ACTIVITY_EMOJI: Record<ActivityType, string> = {
  run: '🏃',
  ride: '🚴',
  hike: '🥾',
  walk: '🚶',
  other: '◍',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function LogModal({ visible, onClose, onSaved }: Props) {
  const language = useSettings((s) => s.language);
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [durationMin, setDurationMin] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [rpe, setRpe] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function reset() {
    setActivity(null);
    setDurationMin('');
    setDistanceKm('');
    setRpe(null);
    setNote('');
    setErrors({});
    setSaving(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!activity) e.activity = t(language, 'log.modal.error.required');
    const dur = parseFloat(durationMin.replace(',', '.').replace('/', '.'));
    if (!durationMin.trim()) e.duration = t(language, 'log.modal.error.required');
    else if (Number.isNaN(dur) || dur <= 0) e.duration = t(language, 'log.modal.error.duration');
    if (distanceKm.trim()) {
      const d = parseFloat(distanceKm.replace(',', '.').replace('/', '.'));
      if (Number.isNaN(d) || d < 0) e.distance = t(language, 'log.modal.error.distance');
    }
    if (rpe !== null && (rpe < 1 || rpe > 10)) e.rpe = '1–10';
    if (note.length > 280) e.note = t(language, 'log.modal.error.note');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    if (!activity) return;
    setSaving(true);
    try {
      const durMin = parseFloat(durationMin.replace(',', '.').replace('/', '.'));
      const distKm = distanceKm.trim() ? parseFloat(distanceKm.replace(',', '.').replace('/', '.')) : null;
      await insertSession({
        activity_type: activity,
        duration_sec: Math.round(durMin * 60),
        distance_m: distKm !== null && !Number.isNaN(distKm) ? Math.round(distKm * 1000) : null,
        rpe: rpe ?? null,
        note: note.trim() ? note.trim().slice(0, 280) : null,
        started_at: new Date().toISOString(),
      });
      reset();
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kav}
        >
          <View style={styles.sheet} testID="log-modal">
            <View style={styles.accentBar} />
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{t(language, 'log.newCta')}</Text>
              <Pressable
                onPress={handleClose}
                style={styles.closeBtn}
                testID="log-modal-cancel"
                accessibilityLabel={t(language, 'log.modal.cancel')}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Activity */}
              <Text style={styles.label}>{t(language, 'log.modal.activity')}</Text>
              <View style={styles.chipRow}>
                {ACTIVITIES.map((a) => {
                  const selected = activity === a;
                  return (
                    <Pressable
                      key={a}
                      onPress={() => setActivity(a)}
                      testID={`activity-chip-${a}`}
                      style={({ pressed }) => [
                        styles.chip,
                        selected && styles.chipSelected,
                        pressed && styles.chipPressed,
                      ]}
                    >
                      <Text style={[styles.chipEmoji]}>{ACTIVITY_EMOJI[a]}</Text>
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{a}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.activity ? (
                <Text style={styles.error} testID="error-activity">
                  {errors.activity}
                </Text>
              ) : null}

              {/* Duration */}
              <Text style={styles.label}>{t(language, 'log.modal.duration')} *</Text>
              <TextInput
                value={durationMin}
                onChangeText={(v) => setDurationMin(v.replace('/', '.').replace(',', '.'))}
                placeholder="45"
                keyboardType="decimal-pad"
                style={[styles.input, errors.duration && styles.inputError]}
                testID="input-duration"
              />
              {errors.duration ? (
                <Text style={styles.error} testID="error-duration">
                  {errors.duration}
                </Text>
              ) : null}

              {/* Distance */}
              <Text style={styles.label}>{t(language, 'log.modal.distance')}</Text>
              <TextInput
                value={distanceKm}
                onChangeText={(v) => setDistanceKm(v.replace('/', '.').replace(',', '.'))}
                placeholder="5.2"
                keyboardType="decimal-pad"
                style={[styles.input, errors.distance && styles.inputError]}
                testID="input-distance"
              />
              {errors.distance ? (
                <Text style={styles.error} testID="error-distance">
                  {errors.distance}
                </Text>
              ) : null}

              {/* RPE */}
              <Text style={styles.label}>{t(language, 'log.modal.rpe')}</Text>
              <View style={styles.rpeRow}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const selected = rpe === n;
                  return (
                    <Pressable
                      key={n}
                      onPress={() => setRpe(selected ? null : n)}
                      testID={`rpe-${n}`}
                      style={({ pressed }) => [
                        styles.rpeCell,
                        selected && styles.rpeCellSelected,
                        pressed && styles.chipPressed,
                      ]}
                    >
                      <Text style={[styles.rpeText, selected && styles.rpeTextSelected]}>{n}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.rpe ? (
                <Text style={styles.error} testID="error-rpe">
                  {errors.rpe}
                </Text>
              ) : null}

              {/* Note */}
              <Text style={styles.label}>
                {t(language, 'log.modal.note')} · {note.length}/280
              </Text>
              <TextInput
                value={note}
                onChangeText={(v) => setNote(v.slice(0, 280))}
                placeholder={t(language, 'log.modal.notePlaceholder')}
                multiline
                numberOfLines={3}
                maxLength={280}
                style={[styles.input, styles.noteInput, errors.note && styles.inputError]}
                testID="input-note"
              />
              {errors.note ? (
                <Text style={styles.error} testID="error-note">
                  {errors.note}
                </Text>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable
                onPress={handleClose}
                style={({ pressed }) => [styles.btnGhost, pressed && styles.dim]}
                testID="log-modal-cancel-footer"
              >
                <Text style={styles.btnGhostText}>{t(language, 'log.modal.cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={saving}
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.dim, saving && styles.disabled]}
                testID="log-modal-save"
              >
                <Text style={styles.btnPrimaryText}>
                  {saving ? t(language, 'common.loading') : t(language, 'log.modal.save')}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.52)',
    justifyContent: 'flex-end',
  },
  kav: { justifyContent: 'flex-end', flex: 1 },
  sheet: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 0,
  },
  accentBar: { height: 4, backgroundColor: '#F59E0B' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 16, color: '#475569', fontWeight: '600' },
  scroll: { flexGrow: 0 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 8, gap: 0 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  chipSelected: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  chipPressed: { opacity: 0.86 },
  chipEmoji: { fontSize: 14 },
  chipText: { fontSize: 13, fontWeight: '700', color: '#334155', textTransform: 'capitalize' },
  chipTextSelected: { color: '#F8FAFC' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  inputError: { borderColor: '#EF4444' },
  noteInput: { minHeight: 84, textAlignVertical: 'top', paddingTop: 12 },
  error: { fontSize: 12, color: '#EF4444', marginTop: 6, fontWeight: '600' },
  rpeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  rpeCell: {
    width: 32,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeCellSelected: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  rpeText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  rpeTextSelected: { color: '#F8FAFC' },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  btnGhost: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnGhostText: { fontSize: 15, fontWeight: '700', color: '#334155' },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '800', color: '#F8FAFC' },
  dim: { opacity: 0.86 },
  disabled: { opacity: 0.6 },
});
