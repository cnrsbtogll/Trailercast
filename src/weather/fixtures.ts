/**
 * TrailCast — fixture weather data for Day-1 / slice 2.
 *
 * The PRD calls for a hardcoded fixture ("Ankara, 2026-09-12 12:00 UTC")
 * on the Today-tab skeleton so the screen can be verified before any
 * network call exists. This module exports the typed fixture shape the
 * Today tab renders when the real Open-Meteo client (slice 3) is not
 * yet wired.
 *
 * Two flags here:
 *  - shape matches `parseCurrent` + `parseHourlyPrecip` output so the
 *    Today tab renders the same component in fixture-mode and live-mode.
 *  - no network, no clock-dependence — values are deterministic.
 */
import type {
  ParsedCurrent as CurrentWeather,
  ParsedForecast as HourlyPrecipitation,
} from '@/weather/openMeteo';

export interface TodayFixture {
  readonly city: string;
  readonly capturedAt: string; // ISO timestamp the fixture pretends to be from
  readonly current: CurrentWeather;
  readonly precip: HourlyPrecipitation;
}

/**
 * Anchor fixture — Ankara, 2026-09-12 12:00 UTC. Values chosen to read
 * plausibly as a "warm, partly cloudy, light afternoon shower rolling in"
 * pattern that exercises every UI field (temp, feels, humidity, wind,
 * gust, cloud cover, precip probability, precip mm).
 */
export const ANKARA_FIXTURE: TodayFixture = {
  city: 'Ankara',
  capturedAt: '2026-09-12T12:00:00Z',
  current: {
    temperatureC: 23.4,
    feelsLikeC: 22.1,
    humidityPct: 48,
    precipitationMm: 0.0,
    windKmh: 14.2,
    gustKmh: 22.5,
    cloudCoverPct: 55,
    weatherCode: 2, // Partly cloudy
    time: '2026-09-12T12:00',
  },
  precip: {
    hours: [
      { time: '2026-09-12T12:00', precipitationMm: 0.0, precipitationProbPct: 5,  weatherCode: 2 },
      { time: '2026-09-12T13:00', precipitationMm: 0.0, precipitationProbPct: 12, weatherCode: 2 },
      { time: '2026-09-12T14:00', precipitationMm: 0.4, precipitationProbPct: 35, weatherCode: 61 },
      { time: '2026-09-12T15:00', precipitationMm: 1.2, precipitationProbPct: 65, weatherCode: 63 },
      { time: '2026-09-12T16:00', precipitationMm: 0.8, precipitationProbPct: 55, weatherCode: 61 },
      { time: '2026-09-12T17:00', precipitationMm: 0.2, precipitationProbPct: 25, weatherCode: 2 },
    ],
  },
};

/** Berlin fixture — colder, breezier, less cloud. */
export const BERLIN_FIXTURE: TodayFixture = {
  city: 'Berlin',
  capturedAt: '2026-09-12T12:00:00Z',
  current: {
    temperatureC: 14.8,
    feelsLikeC: 12.9,
    humidityPct: 71,
    precipitationMm: 0.0,
    windKmh: 18.4,
    gustKmh: 27.0,
    cloudCoverPct: 78,
    weatherCode: 3, // Overcast
    time: '2026-09-12T12:00',
  },
  precip: {
    hours: [
      { time: '2026-09-12T12:00', precipitationMm: 0.0, precipitationProbPct: 18, weatherCode: 3 },
      { time: '2026-09-12T13:00', precipitationMm: 0.2, precipitationProbPct: 32, weatherCode: 61 },
      { time: '2026-09-12T14:00', precipitationMm: 0.6, precipitationProbPct: 48, weatherCode: 61 },
      { time: '2026-09-12T15:00', precipitationMm: 0.9, precipitationProbPct: 60, weatherCode: 63 },
      { time: '2026-09-12T16:00', precipitationMm: 0.5, precipitationProbPct: 45, weatherCode: 61 },
      { time: '2026-09-12T17:00', precipitationMm: 0.1, precipitationProbPct: 22, weatherCode: 3 },
    ],
  },
};

/**
 * Demo fixtures used by the Day-1 / slice-2 Today tab. Live data
 * replaces this in slice 3 once the Open-Meteo client lands.
 */
export const DEMO_FIXTURES: readonly TodayFixture[] = [ANKARA_FIXTURE];