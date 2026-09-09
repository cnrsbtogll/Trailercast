import { useSettings, formatTemp, formatWind } from '@/state/settings';

describe('useSettings', () => {
  beforeEach(() => {
    useSettings.getState().reset();
  });

  it('has the PRD-default values', () => {
    const s = useSettings.getState();
    expect(s.units).toBe('metric');
    expect(s.language).toBe('tr');
    expect(s.pro_unlocked).toBe(false);
  });

  it('flips units on setUnits', () => {
    useSettings.getState().setUnits('imperial');
    expect(useSettings.getState().units).toBe('imperial');
  });

  it('flips language on setLanguage', () => {
    useSettings.getState().setLanguage('en');
    expect(useSettings.getState().language).toBe('en');
  });

  it('flips pro_unlocked on setProUnlocked (gated by IAP, slice 7)', () => {
    useSettings.getState().setProUnlocked(true);
    expect(useSettings.getState().pro_unlocked).toBe(true);
  });

  it('reset returns to PRD defaults', () => {
    useSettings.getState().setUnits('imperial');
    useSettings.getState().setLanguage('de');
    useSettings.getState().setProUnlocked(true);
    useSettings.getState().reset();
    expect(useSettings.getState().units).toBe('metric');
    expect(useSettings.getState().language).toBe('tr');
    expect(useSettings.getState().pro_unlocked).toBe(false);
  });
});

describe('formatTemp', () => {
  it('formats Celsius in metric', () => {
    expect(formatTemp(18.4, 'metric')).toBe('18°C');
  });

  it('formats Fahrenheit in imperial', () => {
    expect(formatTemp(0, 'imperial')).toBe('32°F');
    expect(formatTemp(100, 'imperial')).toBe('212°F');
  });

  it('returns — for null', () => {
    expect(formatTemp(null, 'metric')).toBe('—');
  });
});

describe('formatWind', () => {
  it('formats km/h in metric', () => {
    expect(formatWind(14.4, 'metric')).toBe('14 km/h');
  });

  it('formats mph in imperial', () => {
    expect(formatWind(16.0934, 'imperial')).toBe('10 mph');
  });

  it('returns — for null', () => {
    expect(formatWind(null, 'imperial')).toBe('—');
  });
});