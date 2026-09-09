import { render } from '@testing-library/react-native';
import {
  WeatherCard,
  PrecipStripCard,
  MetricsRow,
} from '@/components/WeatherCard';
import { ANKARA_FIXTURE } from '@/weather/fixtures';

describe('WeatherCard (slice 2)', () => {
  it('renders the temperature, condition label, and feels-like', () => {
    const { getByText, getByTestId } = render(
      <WeatherCard current={ANKARA_FIXTURE.current} />,
    );
    expect(getByTestId('today-hero')).toBeTruthy();
    expect(getByText('23°')).toBeTruthy();
    expect(getByText('Partly cloudy')).toBeTruthy();
    expect(getByText(/22°/)).toBeTruthy();
  });

  it('falls back to em-dashes when fields are null', () => {
    const { getByText } = render(
      <WeatherCard
        current={{
          temperatureC: null,
          feelsLikeC: null,
          humidityPct: null,
          precipitationMm: null,
          windKmh: null,
          gustKmh: null,
          cloudCoverPct: null,
          weatherCode: null,
          time: null,
        }}
      />,
    );
    expect(getByText('—°')).toBeTruthy();
    expect(getByText('—')).toBeTruthy();
  });

  it('PrecipStripCard renders one cell per hour with mm + prob', () => {
    const { getByTestId } = render(
      <PrecipStripCard hours={ANKARA_FIXTURE.precip.hours} />,
    );
    expect(getByTestId('today-precip-strip')).toBeTruthy();
    expect(getByTestId('strip-12:00')).toBeTruthy();
    expect(getByTestId('strip-17:00')).toBeTruthy();
  });

  it('MetricsRow renders wind / humidity / cloud with values', () => {
    const { getByText } = render(<MetricsRow current={ANKARA_FIXTURE.current} />);
    expect(getByText('14 km/h')).toBeTruthy();
    expect(getByText('48%')).toBeTruthy();
    expect(getByText('55%')).toBeTruthy();
  });
});