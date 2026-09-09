/**
 * TrailCast — Open-Meteo client (URL builder + typed response parser).
 *
 * Live HTTP fetches live in a separate `fetch.ts` so the URL builder can
 * be unit-tested without `fetch` or network mocks.
 *
 * Open-Meteo is the canonical data source per PRD §6.2.1:
 *   - https://api.open-meteo.com/v1/forecast  (forecast)
 *   - https://geocoding-api.open-meteo.com/v1/search (geocoding)
 * Both are free, no API key, 1-km grid (DWD ICON-EU for TR/EU, NOAA blend
 * for US).
 *
 * Response parsing is defensive: every field is optional; missing values
 * become `null`, never `undefined`, so callers can rely on `=== null`
 * checks without worrying about strict equality with `undefined`.
 */

export const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
export const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

export interface ForecastRequest {
  latitude: number;
  longitude: number;
  hourly?: readonly string[];
  current?: readonly string[];
  timezone?: string; // 'auto' | 'UTC' | IANA tz
  forecast_days?: 1 | 2 | 3 | 5 | 7;
}

/** Builds the Open-Meteo forecast URL with sensible PRD §3.1 defaults. */
export function buildForecastUrl(req: ForecastRequest): string {
  const params = new URLSearchParams();
  params.set('latitude', req.latitude.toFixed(4));
  params.set('longitude', req.longitude.toFixed(4));
  params.set(
    'current',
    (req.current ?? [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'wind_speed_10m',
      'wind_gusts_10m',
      'cloud_cover',
      'weather_code',
    ]).join(','),
  );
  params.set(
    'hourly',
    (req.hourly ?? ['precipitation', 'precipitation_probability', 'weather_code']).join(','),
  );
  params.set('timezone', req.timezone ?? 'auto');
  params.set('forecast_days', String(req.forecast_days ?? 1));
  params.set('wind_speed_unit', 'kmh');
  return `${FORECAST_BASE}?${params.toString()}`;
}

export interface GeocodeRequest {
  name: string;
  count?: number; // 1..10
  language?: 'en' | 'tr' | 'de';
  countryCode?: string; // ISO-3166-1 alpha2
}

export function buildGeocodeUrl(req: GeocodeRequest): string {
  const params = new URLSearchParams();
  params.set('name', req.name);
  params.set('count', String(req.count ?? 5));
  params.set('language', req.language ?? 'en');
  if (req.countryCode) params.set('countryCode', req.countryCode);
  return `${GEOCODING_BASE}?${params.toString()}`;
}

/** Open-Meteo WMO weather_code -> human-readable label. */
export function weatherCodeToLabel(code: number | null): string {
  if (code === null) return '—';
  // Subset of WMO 4677 codes commonly returned.
  switch (code) {
    case 0:
      return 'Clear';
    case 1:
    case 2:
    case 3:
      return 'Partly cloudy';
    case 45:
    case 48:
      return 'Fog';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 56:
    case 57:
      return 'Freezing drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing rain';
    case 71:
    case 73:
    case 75:
      return 'Snow';
    case 77:
      return 'Snow grains';
    case 80:
    case 81:
    case 82:
      return 'Rain showers';
    case 85:
    case 86:
      return 'Snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm w/ hail';
    default:
      return `Code ${code}`;
  }
}

/** Minimal typed view of the parts of the Open-Meteo payload we care about. */
export interface ParsedCurrent {
  temperatureC: number | null;
  feelsLikeC: number | null;
  humidityPct: number | null;
  precipitationMm: number | null;
  windKmh: number | null;
  gustKmh: number | null;
  cloudCoverPct: number | null;
  weatherCode: number | null;
  time: string | null;
}

export interface ParsedForecast {
  hours: ReadonlyArray<{
    time: string;
    precipitationMm: number | null;
    precipitationProbPct: number | null;
    weatherCode: number | null;
  }>;
}

export function parseCurrent(payload: unknown): ParsedCurrent {
  if (!isObject(payload)) return emptyCurrent();
  const current = payload['current'];
  if (!isObject(current)) return emptyCurrent();
  return {
    temperatureC: numOrNull(current['temperature_2m']),
    feelsLikeC: numOrNull(current['apparent_temperature']),
    humidityPct: numOrNull(current['relative_humidity_2m']),
    precipitationMm: numOrNull(current['precipitation']),
    windKmh: numOrNull(current['wind_speed_10m']),
    gustKmh: numOrNull(current['wind_gusts_10m']),
    cloudCoverPct: numOrNull(current['cloud_cover']),
    weatherCode: numOrNull(current['weather_code']),
    time: strOrNull(current['time']),
  };
}

export function parseHourlyPrecip(payload: unknown): ParsedForecast {
  if (!isObject(payload)) return { hours: [] };
  const hourly = payload['hourly'];
  if (!isObject(hourly)) return { hours: [] };
  const times = arrOfStrings(hourly['time']);
  const precip = arrOfNumsOrNull(hourly['precipitation']);
  const precipProb = arrOfNumsOrNull(hourly['precipitation_probability']);
  const codes = arrOfNumsOrNull(hourly['weather_code']);
  const out: Array<{
    time: string;
    precipitationMm: number | null;
    precipitationProbPct: number | null;
    weatherCode: number | null;
  }> = [];
  for (let i = 0; i < times.length; i++) {
    out.push({
      time: times[i] ?? '',
      precipitationMm: precip[i] ?? null,
      precipitationProbPct: precipProb[i] ?? null,
      weatherCode: codes[i] ?? null,
    });
  }
  return { hours: out };
}

// ---- internals ----

function emptyCurrent(): ParsedCurrent {
  return {
    temperatureC: null,
    feelsLikeC: null,
    humidityPct: null,
    precipitationMm: null,
    windKmh: null,
    gustKmh: null,
    cloudCoverPct: null,
    weatherCode: null,
    time: null,
  };
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function numOrNull(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  return null;
}

function strOrNull(v: unknown): string | null {
  return typeof v === 'string' ? v : null;
}

function arrOfStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

function arrOfNumsOrNull(v: unknown): Array<number | null> {
  if (!Array.isArray(v)) return [];
  return v.map(numOrNull);
}