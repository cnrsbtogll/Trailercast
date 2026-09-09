import { ANKARA_FIXTURE, BERLIN_FIXTURE, DEMO_FIXTURES } from '@/weather/fixtures';
import {
  parseCurrent,
  parseHourlyPrecip,
  weatherCodeToLabel,
} from '@/weather/openMeteo';

describe('weather fixtures (slice 2)', () => {
  it('Ankara fixture exposes every field the Today tab renders', () => {
    expect(ANKARA_FIXTURE.city).toBe('Ankara');
    expect(ANKARA_FIXTURE.capturedAt).toBe('2026-09-12T12:00:00Z');
    expect(ANKARA_FIXTURE.current.temperatureC).toBeCloseTo(23.4);
    expect(ANKARA_FIXTURE.current.weatherCode).toBe(2);
    expect(weatherCodeToLabel(ANKARA_FIXTURE.current.weatherCode)).toBe(
      'Partly cloudy',
    );
    expect(ANKARA_FIXTURE.precip.hours).toHaveLength(6);
  });

  it('Berlin fixture is colder + breezier than Ankara', () => {
    expect(BERLIN_FIXTURE.current.temperatureC ?? 100).toBeLessThan(
      ANKARA_FIXTURE.current.temperatureC ?? -100,
    );
    expect(BERLIN_FIXTURE.current.windKmh ?? 0).toBeGreaterThan(
      ANKARA_FIXTURE.current.windKmh ?? 100,
    );
  });

  it('fixtures conform to the parser output shapes', () => {
    // Round-trip the fixture through the parser shape: the Today tab
    // should not care whether the input came from fetch() or fixture.
    const cur = parseCurrent({
      current: {
        temperature_2m: ANKARA_FIXTURE.current.temperatureC,
        apparent_temperature: ANKARA_FIXTURE.current.feelsLikeC,
        relative_humidity_2m: ANKARA_FIXTURE.current.humidityPct,
        precipitation: ANKARA_FIXTURE.current.precipitationMm,
        wind_speed_10m: ANKARA_FIXTURE.current.windKmh,
        wind_gusts_10m: ANKARA_FIXTURE.current.gustKmh,
        cloud_cover: ANKARA_FIXTURE.current.cloudCoverPct,
        weather_code: ANKARA_FIXTURE.current.weatherCode,
        time: ANKARA_FIXTURE.current.time,
      },
    });
    expect(cur.temperatureC).toBeCloseTo(23.4);
    expect(cur.weatherCode).toBe(2);

    const precip = parseHourlyPrecip({
      hourly: {
        time: ANKARA_FIXTURE.precip.hours.map((h) => h.time),
        precipitation: ANKARA_FIXTURE.precip.hours.map((h) => h.precipitationMm),
        precipitation_probability: ANKARA_FIXTURE.precip.hours.map(
          (h) => h.precipitationProbPct,
        ),
        weather_code: ANKARA_FIXTURE.precip.hours.map((h) => h.weatherCode),
      },
    });
    expect(precip.hours).toHaveLength(6);
  });

  it('DEMO_FIXTURES is non-empty and anchors on Ankara (slice 2)', () => {
    expect(DEMO_FIXTURES.length).toBeGreaterThan(0);
    expect(DEMO_FIXTURES[0]?.city).toBe('Ankara');
  });
});