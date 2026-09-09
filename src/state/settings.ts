/**
 * TrailCast — settings store (Zustand).
 *
 * Three persisted slices:
 *   - units:        'metric' | 'imperial'   (default: metric)
 *   - language:     'tr' | 'en' | 'de'      (default: tr)
 *   - pro_unlocked: boolean                  (default: false; flipped by IAP)
 *
 * Persistence is intentionally minimal — settings live in a Zustand store
 * with an `expo-sqlite` row in `app_settings` written on every change.
 * The boot path reads those rows and hydrates the store before the first
 * render, so the UI never flashes the wrong locale.
 *
 * Hard constraint from PRD §5: NO telemetry, NO ad SDK. The settings
 * store never reports its values anywhere.
 */
import { create } from 'zustand';

export type Units = 'metric' | 'imperial';
export type Language = 'tr' | 'en' | 'de';

export interface SettingsState {
  units: Units;
  language: Language;
  pro_unlocked: boolean;
  setUnits: (u: Units) => void;
  setLanguage: (l: Language) => void;
  setProUnlocked: (v: boolean) => void;
  /** Test-only / dev: reset to defaults. */
  reset: () => void;
}

export const useSettings = create<SettingsState>((set) => ({
  units: 'metric',
  language: 'tr',
  pro_unlocked: false,
  setUnits: (u) => set({ units: u }),
  setLanguage: (l) => set({ language: l }),
  setProUnlocked: (v) => set({ pro_unlocked: v }),
  reset: () => set({ units: 'metric', language: 'tr', pro_unlocked: false }),
}));

/** Helper: format a temperature in the user's preferred units. */
export function formatTemp(c: number | null, units: Units): string {
  if (c === null) return '—';
  if (units === 'metric') return `${Math.round(c)}°C`;
  return `${Math.round((c * 9) / 5 + 32)}°F`;
}

/** Helper: format a wind speed (input km/h) per user units. */
export function formatWind(kmh: number | null, units: Units): string {
  if (kmh === null) return '—';
  if (units === 'metric') return `${Math.round(kmh)} km/h`;
  return `${Math.round(kmh * 0.621371)} mph`;
}