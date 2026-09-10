/**
 * TrailCast — i18n strings (TR / EN / DE).
 *
 * Locale-default per PRD §3.1: **TR (default), EN, DE** at launch.
 *
 * Keys are flat strings, dot-namespaced, no nested interpolation (keeps
 * the parser trivial and reduces bug surface). Adding a language = adding
 * a `Strings` map; the `Language` type in settings.ts is the source of
 * truth.
 */

export type StringKey =
  | 'today.header'
  | 'today.hero.feels'
  | 'today.precip.strip'
  | 'today.precip.next6h'
  | 'today.precip.none'
  | 'today.precip.noneHint'
  | 'today.wind'
  | 'today.humidity'
  | 'today.cloudCover'
  | 'today.addPin'
  | 'today.logSession'
  | 'log.title'
  | 'log.empty'
  | 'log.newCta'
  | 'log.modal.activity'
  | 'log.modal.duration'
  | 'log.modal.distance'
  | 'log.modal.rpe'
  | 'log.modal.note'
  | 'log.modal.save'
  | 'log.modal.cancel'
  | 'settings.title'
  | 'settings.units'
  | 'settings.language'
  | 'settings.units.metric'
  | 'settings.units.imperial'
  | 'settings.export'
  | 'settings.upgrade'
  | 'settings.privacy'
  | 'settings.about'
  | 'settings.attribution'
  | 'common.cancel'
  | 'common.save'
  | 'common.loading'
  | 'common.error.network';

type Strings = Record<StringKey, string>;

const TR: Strings = {
  'today.header': 'Bugün',
  'today.hero.feels': 'Hissedilen',
  'today.precip.strip': 'Yağış şeridi',
  'today.precip.next6h': 'Önümüzdeki 6 saat',
  'today.precip.none': 'Yağış beklenmiyor',
  'today.precip.noneHint': 'Açık hava için ideal — 6 saat boyunca kuru',
  'today.wind': 'Rüzgâr',
  'today.humidity': 'Nem',
  'today.cloudCover': 'Bulut',
  'today.addPin': 'Patika noktası ekle',
  'today.logSession': 'Antrenman kaydet',
  'log.title': 'Günlük',
  'log.empty': 'Henüz kayıt yok. İlk antrenmanını ekle.',
  'log.newCta': 'Yeni antrenman',
  'log.modal.activity': 'Aktivite türü',
  'log.modal.duration': 'Süre (dk)',
  'log.modal.distance': 'Mesafe (km)',
  'log.modal.rpe': 'Efor (1–10)',
  'log.modal.note': 'Not',
  'log.modal.save': 'Kaydet',
  'log.modal.cancel': 'Vazgeç',
  'settings.title': 'Ayarlar',
  'settings.units': 'Birim',
  'settings.language': 'Dil',
  'settings.units.metric': 'Metrik',
  'settings.units.imperial': 'İngiliz',
  'settings.export': 'Dışa aktar (CSV / JSON)',
  'settings.upgrade': 'PRO kilidini aç',
  'settings.privacy': 'Gizlilik politikası',
  'settings.about': 'Hakkında',
  'settings.attribution': 'Hava verisi: Open-Meteo.com (CC BY 4.0)',
  'common.cancel': 'Vazgeç',
  'common.save': 'Kaydet',
  'common.loading': 'Yükleniyor…',
  'common.error.network': 'Ağ hatası. Tekrar dene.',
};

const EN: Strings = {
  'today.header': 'Today',
  'today.hero.feels': 'Feels like',
  'today.precip.strip': 'Precipitation strip',
  'today.precip.next6h': 'Next 6 hours',
  'today.precip.none': 'No rain expected',
  'today.precip.noneHint': 'Ideal for outdoors — dry for the next 6 hours',
  'today.wind': 'Wind',
  'today.humidity': 'Humidity',
  'today.cloudCover': 'Cloud',
  'today.addPin': 'Add trail pin',
  'today.logSession': 'Log session',
  'log.title': 'Log',
  'log.empty': 'No sessions yet. Log your first run.',
  'log.newCta': 'New session',
  'log.modal.activity': 'Activity type',
  'log.modal.duration': 'Duration (min)',
  'log.modal.distance': 'Distance (km)',
  'log.modal.rpe': 'RPE (1–10)',
  'log.modal.note': 'Note',
  'log.modal.save': 'Save',
  'log.modal.cancel': 'Cancel',
  'settings.title': 'Settings',
  'settings.units': 'Units',
  'settings.language': 'Language',
  'settings.units.metric': 'Metric',
  'settings.units.imperial': 'Imperial',
  'settings.export': 'Export (CSV / JSON)',
  'settings.upgrade': 'Unlock PRO',
  'settings.privacy': 'Privacy policy',
  'settings.about': 'About',
  'settings.attribution': 'Weather by Open-Meteo.com (CC BY 4.0)',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.loading': 'Loading…',
  'common.error.network': 'Network error. Try again.',
};

const DE: Strings = {
  'today.header': 'Heute',
  'today.hero.feels': 'Gefühlt',
  'today.precip.strip': 'Niederschlags-Streifen',
  'today.precip.next6h': 'Nächste 6 Stunden',
  'today.precip.none': 'Kein Regen erwartet',
  'today.precip.noneHint': 'Ideal für draußen — 6 Stunden trocken',
  'today.wind': 'Wind',
  'today.humidity': 'Feuchte',
  'today.cloudCover': 'Wolken',
  'today.addPin': 'Trail-Pin hinzufügen',
  'today.logSession': 'Sitzung protokollieren',
  'log.title': 'Tagebuch',
  'log.empty': 'Noch keine Einträge. Erste Einheit erfassen.',
  'log.newCta': 'Neue Einheit',
  'log.modal.activity': 'Aktivität',
  'log.modal.duration': 'Dauer (Min.)',
  'log.modal.distance': 'Distanz (km)',
  'log.modal.rpe': 'Anstrengung (1–10)',
  'log.modal.note': 'Notiz',
  'log.modal.save': 'Speichern',
  'log.modal.cancel': 'Abbrechen',
  'settings.title': 'Einstellungen',
  'settings.units': 'Einheiten',
  'settings.language': 'Sprache',
  'settings.units.metric': 'Metrisch',
  'settings.units.imperial': 'Imperial',
  'settings.export': 'Export (CSV / JSON)',
  'settings.upgrade': 'PRO freischalten',
  'settings.privacy': 'Datenschutz',
  'settings.about': 'Über',
  'settings.attribution': 'Wetter von Open-Meteo.com (CC BY 4.0)',
  'common.cancel': 'Abbrechen',
  'common.save': 'Speichern',
  'common.loading': 'Lädt…',
  'common.error.network': 'Netzwerkfehler. Erneut versuchen.',
};

export const STRINGS: Record<'tr' | 'en' | 'de', Strings> = {
  tr: TR,
  en: EN,
  de: DE,
};

export function t(lang: 'tr' | 'en' | 'de', key: StringKey): string {
  return STRINGS[lang][key];
}