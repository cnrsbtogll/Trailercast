import {
  buildForecastUrl,
  parseCurrent,
  parseHourlyPrecip,
  parseDaily,
  type ParsedCurrent,
  type ParsedForecast,
  type ParsedDaily,
} from './openMeteo';
import { TTLCache } from './cache';

export interface WeatherData {
  current: ParsedCurrent;
  precip: ParsedForecast;
  daily: ParsedDaily;
  cached: boolean;
  fetchedAt: string; // ISO timestamp
}

// 10-minute in-memory cache instance (PRD §6.2.2)
export const weatherCache = new TTLCache<WeatherData>();

/**
 * Fetches current weather and next hours precipitation from Open-Meteo API.
 * Uses 10-min in-memory cache.
 */
export async function fetchWeather(
  latitude: number,
  longitude: number,
  customFetch: typeof fetch = fetch,
): Promise<WeatherData> {
  const cacheKey = TTLCache.keyFor(latitude, longitude, 'forecast');
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const url = buildForecastUrl({
    latitude,
    longitude,
    forecast_days: 7,
    timezone: 'auto',
  });

  const response = await customFetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo fetch failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const current = parseCurrent(data);
  const precip = parseHourlyPrecip(data);
  const daily = parseDaily(data);

  const result: WeatherData = {
    current,
    precip,
    daily,
    cached: false,
    fetchedAt: new Date().toISOString(),
  };

  weatherCache.set(cacheKey, result);
  return result;
}