import { fetchWeather, weatherCache } from '../src/weather/fetch';
import { FORECAST_BASE } from '../src/weather/openMeteo';

describe('fetchWeather', () => {
  beforeEach(() => {
    weatherCache.clear();
  });

  const mockPayload = {
    current: {
      temperature_2m: 18.5,
      apparent_temperature: 17.8,
      relative_humidity_2m: 55,
      precipitation: 0.0,
      wind_speed_10m: 12.4,
      wind_gusts_10m: 24.1,
      cloud_cover: 30,
      weather_code: 1,
      time: '2026-09-09T10:00',
    },
    hourly: {
      time: ['2026-09-09T10:00', '2026-09-09T11:00'],
      precipitation: [0.0, 0.5],
      precipitation_probability: [10, 40],
      weather_code: [1, 51],
    },
  };

  it('fetches from Open-Meteo and returns parsed current and precip data', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    } as unknown as Response);

    const data = await fetchWeather(39.9208, 32.8541, mockFetch as unknown as typeof fetch);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(FORECAST_BASE);
    expect(calledUrl).toContain('latitude=39.9208');
    expect(calledUrl).toContain('longitude=32.8541');

    expect(data.cached).toBe(false);
    expect(data.current.temperatureC).toBe(18.5);
    expect(data.current.feelsLikeC).toBe(17.8);
    expect(data.precip.hours).toHaveLength(2);
    expect(data.precip.hours[1]!.precipitationProbPct).toBe(40);
  });

  it('serves subsequent requests from cache within TTL', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockPayload,
    } as unknown as Response);

    const first = await fetchWeather(39.9208, 32.8541, mockFetch as unknown as typeof fetch);
    expect(first.cached).toBe(false);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const second = await fetchWeather(39.9208, 32.8541, mockFetch as unknown as typeof fetch);
    expect(second.cached).toBe(true);
    expect(second.current.temperatureC).toBe(18.5);
    expect(mockFetch).toHaveBeenCalledTimes(1); // not called again
  });

  it('throws an error when response is not ok', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as unknown as Response);

    await expect(
      fetchWeather(39.9208, 32.8541, mockFetch as unknown as typeof fetch),
    ).rejects.toThrow('Open-Meteo fetch failed: 500 Internal Server Error');
  });
});
