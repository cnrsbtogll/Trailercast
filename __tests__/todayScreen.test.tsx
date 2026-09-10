import { render } from '@testing-library/react-native';
import { useSettings } from '@/state/settings';
import TodayScreen from '../app/(tabs)/index';

describe('TodayScreen', () => {
  beforeEach(() => {
    useSettings.getState().reset();
    jest.spyOn(require('@/weather/fetch'), 'fetchWeather').mockResolvedValue({
      current: {
        temperatureC: 23.4,
        feelsLikeC: 22.1,
        humidityPct: 48,
        precipitationMm: 0.0,
        windKmh: 14.2,
        gustKmh: 22.5,
        cloudCoverPct: 55,
        weatherCode: 2,
        time: '2026-09-12T12:00',
      },
      precip: {
        hours: [
          { time: '2026-09-12T12:00', precipitationMm: 0.0, precipitationProbPct: 5, weatherCode: 2 },
        ],
      },
      cached: false,
      fetchedAt: new Date().toISOString(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the screen scaffold with TR defaults', async () => {
    const { getByTestId, getByText, findByTestId } = render(<TodayScreen />);
    expect(getByTestId('today-screen')).toBeTruthy();
    // wait for live fetch to resolve and cards to appear
    expect(await findByTestId('today-hero')).toBeTruthy();
    expect(await findByTestId('today-precip-strip')).toBeTruthy();
    expect(getByText('Bugün')).toBeTruthy(); // TR: today.header
  });

  it('switches header language to EN when the store is updated', () => {
    useSettings.getState().setLanguage('en');
    const { getByText } = render(<TodayScreen />);
    expect(getByText('Today')).toBeTruthy();
  });

  it('switches header language to DE when the store is updated', () => {
    useSettings.getState().setLanguage('de');
    const { getByText } = render(<TodayScreen />);
    expect(getByText('Heute')).toBeTruthy();
  });
});