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
  | 'today.location.loading'
  | 'today.location.denied'
  | 'today.location.current'
  | 'log.title'
  | 'log.empty'
  | 'log.newCta'
  | 'log.modal.activity'
  | 'log.modal.duration'
  | 'log.modal.distance'
  | 'log.modal.rpe'
  | 'log.modal.note'
  | 'log.modal.notePlaceholder'
  | 'log.modal.save'
  | 'log.modal.cancel'
  | 'log.modal.error.required'
  | 'log.modal.error.duration'
  | 'log.modal.error.distance'
  | 'log.modal.error.note'
  | 'log.count_one'
  | 'log.count_other'
  | 'log.card.delete'
  | 'common.unit.minShort'
  | 'common.unit.km'
  | 'activity.run'
  | 'activity.ride'
  | 'activity.hike'
  | 'activity.walk'
  | 'activity.other'
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
  'today.location.loading': 'Konum alınıyor…',
  'today.location.denied': 'Konum izni verilmedi — demo konum gösteriliyor',
  'today.location.current': 'Mevcut konum',
  'log.title': 'Günlük',
  'log.empty': 'Henüz kayıt yok. İlk antrenmanını ekle.',
  'log.newCta': 'Yeni antrenman',
  'log.modal.activity': 'Aktivite türü',
  'log.modal.duration': 'Süre (dk)',
  'log.modal.distance': 'Mesafe (km)',
  'log.modal.rpe': 'Efor (1–10)',
  'log.modal.note': 'Not',
  'log.modal.notePlaceholder': 'Nasıl hissettin? (örn. rüzgâr sertti, son yokuş zordu)',
  'log.modal.save': 'Kaydet',
  'log.modal.cancel': 'Vazgeç',
  'log.modal.error.required': 'Zorunlu',
  'log.modal.error.duration': 'Dakika > 0 gir',
  'log.modal.error.distance': 'Km ≥ 0 gir',
  'log.modal.error.note': 'En fazla 280 karakter',
  'log.count_one': '{{count}} antrenman',
  'log.count_other': '{{count}} antrenman',
  'log.card.delete': 'Sil',
  'common.unit.minShort': 'dk',
  'common.unit.km': 'km',
  'activity.run': 'Koşu',
  'activity.ride': 'Bisiklet',
  'activity.hike': 'Yürüyüş',
  'activity.walk': 'Doğa Yürüyüşü',
  'activity.other': 'Diğer',
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
  'today.location.loading': 'Getting location…',
  'today.location.denied': 'Location permission denied — showing demo location',
  'today.location.current': 'Current location',
  'log.title': 'Log',
  'log.empty': 'No sessions yet. Log your first run.',
  'log.newCta': 'New session',
  'log.modal.activity': 'Activity type',
  'log.modal.duration': 'Duration (min)',
  'log.modal.distance': 'Distance (km)',
  'log.modal.rpe': 'RPE (1–10)',
  'log.modal.note': 'Note',
  'log.modal.notePlaceholder': 'How did it feel? (e.g. windy ridge, tough final climb)',
  'log.modal.save': 'Save',
  'log.modal.cancel': 'Cancel',
  'log.modal.error.required': 'Required',
  'log.modal.error.duration': 'Enter minutes > 0',
  'log.modal.error.distance': 'Enter km ≥ 0',
  'log.modal.error.note': 'Max 280 chars',
  'log.count_one': '{{count}} session',
  'log.count_other': '{{count}} sessions',
  'log.card.delete': 'Delete',
  'common.unit.minShort': 'min',
  'common.unit.km': 'km',
  'activity.run': 'Run',
  'activity.ride': 'Ride',
  'activity.hike': 'Hike',
  'activity.walk': 'Walk',
  'activity.other': 'Other',
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
  'today.location.loading': 'Standort wird ermittelt…',
  'today.location.denied': 'Standort verweigert — Demo-Standort wird angezeigt',
  'today.location.current': 'Aktueller Standort',
  'log.title': 'Tagebuch',
  'log.empty': 'Noch keine Einträge. Erste Einheit erfassen.',
  'log.newCta': 'Neue Einheit',
  'log.modal.activity': 'Aktivität',
  'log.modal.duration': 'Dauer (Min.)',
  'log.modal.distance': 'Distanz (km)',
  'log.modal.rpe': 'Anstrengung (1–10)',
  'log.modal.note': 'Notiz',
  'log.modal.notePlaceholder': 'Wie fühlte es sich an?',
  'log.modal.save': 'Speichern',
  'log.modal.cancel': 'Abbrechen',
  'log.modal.error.required': 'Pflichtfeld',
  'log.modal.error.duration': 'Minuten > 0 eingeben',
  'log.modal.error.distance': 'Km ≥ 0 eingeben',
  'log.modal.error.note': 'Max 280 Zeichen',
  'log.count_one': '{{count}} Einheit',
  'log.count_other': '{{count}} Einheiten',
  'log.card.delete': 'Löschen',
  'common.unit.minShort': 'Min.',
  'common.unit.km': 'km',
  'activity.run': 'Laufen',
  'activity.ride': 'Radfahren',
  'activity.hike': 'Wandern',
  'activity.walk': 'Spazieren',
  'activity.other': 'Sonstiges',
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