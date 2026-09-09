import {
  buildForecastUrl,
  buildGeocodeUrl,
  parseCurrent,
  parseHourlyPrecip,
  weatherCodeToLabel,
  FORECAST_BASE,
  GEOCODING_BASE,
} from '@/weather/openMeteo';

describe('Open-Meteo URL builder', () => {
  it('builds the forecast URL with PRD §3.1 defaults', () => {
    const url = buildForecastUrl({ latitude: 39.9334, longitude: 32.8597 });
    expect(url.startsWith(FORECAST_BASE)).toBe(true);
    expect(url).toContain('latitude=39.9334');
    expect(url).toContain('longitude=32.8597');
    expect(url).toContain('timezone=auto');
    expect(url).toContain('forecast_days=1');
    expect(url).toContain('temperature_2m');
    expect(url).toContain('precipitation');
    expect(url).toContain('wind_speed_10m');
  });

  it('uses km/h wind unit (no mph surprises)', () => {
    const url = buildForecastUrl({ latitude: 0, longitude: 0 });
    expect(url).toContain('wind_speed_unit=kmh');
  });

  it('trims coordinates to 4 decimals', () => {
    const url = buildForecastUrl({ latitude: 39.933412345, longitude: 32.859798765 });
    expect(url).toContain('latitude=39.9334');
    expect(url).toContain('longitude=32.8598');
  });

  it('honors explicit hourly / current overrides', () => {
    const url = buildForecastUrl({
      latitude: 0,
      longitude: 0,
      hourly: ['temperature_2m'],
      current: ['temperature_2m'],
    });
    expect(url).toContain('hourly=temperature_2m');
    expect(url).toContain('current=temperature_2m');
    expect(url).not.toContain('precipitation_probability');
  });

  it('builds geocode URL with sensible defaults', () => {
    const url = buildGeocodeUrl({ name: 'Ankara' });
    expect(url.startsWith(GEOCODING_BASE)).toBe(true);
    expect(url).toContain('name=Ankara');
    expect(url).toContain('count=5');
    expect(url).toContain('language=en');
  });

  it('geocode URL honors country filter', () => {
    const url = buildGeocodeUrl({ name: 'Istanbul', countryCode: 'TR' });
    expect(url).toContain('countryCode=TR');
  });
});

describe('parseCurrent', () => {
  it('parses a typical Open-Meteo current block', () => {
    const cur = parseCurrent({
      current: {
        temperature_2m: 18.4,
        apparent_temperature: 17.1,
        relative_humidity_2m: 62,
        precipitation: 0.0,
        wind_speed_10m: 14.2,
        wind_gusts_10m: 22.5,
        cloud_cover: 40,
        weather_code: 2,
        time: '2026-09-08T12:00',
      },
    });
    expect(cur.temperatureC).toBeCloseTo(18.4);
    expect(cur.feelsLikeC).toBeCloseTo(17.1);
    expect(cur.humidityPct).toBe(62);
    expect(cur.windKmh).toBeCloseTo(14.2);
    expect(cur.gustKmh).toBeCloseTo(22.5);
    expect(cur.cloudCoverPct).toBe(40);
    expect(cur.weatherCode).toBe(2);
    expect(cur.time).toBe('2026-09-08T12:00');
  });

  it('returns all-null payload when current is missing', () => {
    const cur = parseCurrent({});
    expect(cur.temperatureC).toBeNull();
    expect(cur.time).toBeNull();
  });

  it('tolerates non-object payloads', () => {
    expect(parseCurrent(null).temperatureC).toBeNull();
    expect(parseCurrent('not an object').temperatureC).toBeNull();
    expect(parseCurrent([1, 2]).temperatureC).toBeNull();
  });

  it('coerces NaN and Infinity to null', () => {
    const cur = parseCurrent({ current: { temperature_2m: NaN, wind_speed_10m: Infinity } });
    expect(cur.temperatureC).toBeNull();
    expect(cur.windKmh).toBeNull();
  });
});

describe('parseHourlyPrecip', () => {
  it('zips parallel arrays', () => {
    const out = parseHourlyPrecip({
      hourly: {
        time: ['2026-09-08T12:00', '2026-09-08T13:00', '2026-09-08T14:00'],
        precipitation: [0.0, 0.4, 1.2],
        precipitation_probability: [10, 60, 90],
        weather_code: [1, 61, 63],
      },
    });
    expect(out.hours).toHaveLength(3);
    expect(out.hours[0]).toEqual({
      time: '2026-09-08T12:00',
      precipitationMm: 0.0,
      precipitationProbPct: 10,
      weatherCode: 1,
    });
    expect(out.hours[2]?.precipitationProbPct).toBe(90);
  });

  it('returns empty hours when hourly block missing', () => {
    expect(parseHourlyPrecip({}).hours).toEqual([]);
    expect(parseHourlyPrecip(null).hours).toEqual([]);
  });
});

describe('weatherCodeToLabel', () => {
  it('maps the WMO codes used in the strip', () => {
    expect(weatherCodeToLabel(0)).toBe('Clear');
    expect(weatherCodeToLabel(61)).toBe('Rain');
    expect(weatherCodeToLabel(95)).toBe('Thunderstorm');
  });

  it('handles unknown codes gracefully', () => {
    expect(weatherCodeToLabel(999)).toBe('Code 999');
    expect(weatherCodeToLabel(null)).toBe('—');
  });
});