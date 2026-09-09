import { render } from '@testing-library/react-native';
import { useSettings } from '@/state/settings';
import TodayScreen from '../app/(tabs)/index';

describe('TodayScreen', () => {
  beforeEach(() => {
    useSettings.getState().reset();
  });

  it('renders the screen scaffold with TR defaults', () => {
    const { getByTestId, getByText } = render(<TodayScreen />);
    expect(getByTestId('today-screen')).toBeTruthy();
    expect(getByTestId('today-hero')).toBeTruthy();
    expect(getByTestId('today-precip-strip')).toBeTruthy();
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