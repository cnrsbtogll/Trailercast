/**
 * TrailCast — demo fixture data for offline/dev mode.
 *
 * ponytail: typed fixture matching WeatherData shape. Used when live fetch
 * fails or GPS is denied. Minimal — just enough to render the Today tab.
 */
export interface FixtureCurrent {
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

export interface FixtureData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
  current: FixtureCurrent;
  precip: {
    hours: ReadonlyArray<{
      time: string;
      precipitationMm: number | null;
      precipitationProbPct: number | null;
      weatherCode: number | null;
    }>;
  };
  daily: {
    days: ReadonlyArray<{
      date: string;
      weatherCode: number | null;
      tempMaxC: number | null;
      tempMinC: number | null;
      precipProbMaxPct: number | null;
      windMaxKmh: number | null;
    }>;
  };
  cached: boolean;
  fetchedAt: string;
}

/** Ankara fixture (used by the Today tab offline fallback + tests). */
export const ANKARA_FIXTURE: FixtureData = {
  city: 'Ankara',
  country: 'Turkey',
  latitude: 39.9255,
  longitude: 32.8662,
  capturedAt: '2026-09-12T12:00:00Z',
  current: {
    temperatureC: 23.4,
    feelsLikeC: 24,
    humidityPct: 42,
    precipitationMm: 0,
    windKmh: 9,
    gustKmh: 14,
    cloudCoverPct: 30,
    weatherCode: 2,
    time: '2026-09-12T12:00:00Z',
  },
  precip: {
    hours: [
      { time: '2026-09-12T12:00', precipitationMm: 0, precipitationProbPct: 10, weatherCode: 2 },
      { time: '2026-09-12T13:00', precipitationMm: 0, precipitationProbPct: 10, weatherCode: 2 },
      { time: '2026-09-12T14:00', precipitationMm: 0, precipitationProbPct: 12, weatherCode: 2 },
      { time: '2026-09-12T15:00', precipitationMm: 0, precipitationProbPct: 15, weatherCode: 2 },
      { time: '2026-09-12T16:00', precipitationMm: 0.3, precipitationProbPct: 45, weatherCode: 61 },
      { time: '2026-09-12T17:00', precipitationMm: 0, precipitationProbPct: 5, weatherCode: 2 },
    ],
  },
  daily: { days: [] },
  cached: false,
  fetchedAt: '2026-09-12T12:05:00Z',
};

/** Berlin fixture: colder + breezier than Ankara (test contrast). */
export const BERLIN_FIXTURE: FixtureData = {
  city: 'Berlin',
  country: 'Germany',
  latitude: 52.52,
  longitude: 13.405,
  capturedAt: '2026-09-12T12:00:00Z',
  current: {
    temperatureC: 16.1,
    feelsLikeC: 15,
    humidityPct: 65,
    precipitationMm: 0.4,
    windKmh: 22,
    gustKmh: 31,
    cloudCoverPct: 80,
    weatherCode: 61,
    time: '2026-09-12T12:00:00Z',
  },
  precip: {
    hours: [
      { time: '2026-09-12T12:00', precipitationMm: 0.4, precipitationProbPct: 70, weatherCode: 61 },
      { time: '2026-09-12T13:00', precipitationMm: 0.2, precipitationProbPct: 60, weatherCode: 61 },
      { time: '2026-09-12T14:00', precipitationMm: 0, precipitationProbPct: 45, weatherCode: 61 },
      { time: '2026-09-12T15:00', precipitationMm: 0, precipitationProbPct: 30, weatherCode: 3 },
      { time: '2026-09-12T16:00', precipitationMm: 0, precipitationProbPct: 15, weatherCode: 3 },
      { time: '2026-09-12T17:00', precipitationMm: 0, precipitationProbPct: 5, weatherCode: 2 },
    ],
  },
  daily: { days: [] },
  cached: false,
  fetchedAt: '2026-09-12T12:05:00Z',
};

export const DEMO_FIXTURES: FixtureData[] = [ANKARA_FIXTURE];