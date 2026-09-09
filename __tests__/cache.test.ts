import { TTLCache } from '@/weather/cache';

describe('TTLCache', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns null when nothing is stored', () => {
    const c = new TTLCache<number>();
    expect(c.get('k')).toBeNull();
  });

  it('stores and retrieves a value within the TTL', () => {
    const c = new TTLCache<{ a: number }>();
    c.set('k', { a: 1 }, 1000);
    expect(c.get('k')).toEqual({ a: 1 });
  });

  it('expires entries after the TTL', () => {
    const c = new TTLCache<{ a: number }>();
    c.set('k', { a: 1 }, 1000);
    jest.advanceTimersByTime(1001);
    expect(c.get('k')).toBeNull();
  });

  it('drops only expired entries in pruneExpired', () => {
    const c = new TTLCache<number>();
    c.set('live', 1, 10_000);
    c.set('soon', 2, 100);
    jest.advanceTimersByTime(200);
    const dropped = c.pruneExpired();
    expect(dropped).toBe(1);
    expect(c.get('live')).toBe(1);
    expect(c.get('soon')).toBeNull();
  });

  it('builds a stable key from lat/lon + suffix', () => {
    const k1 = TTLCache.keyFor(39.9334, 32.8597, 'current');
    const k2 = TTLCache.keyFor(39.93341, 32.85971, 'current');
    expect(k1).toBe(k2); // 4 decimals → same key
  });

  it('clear wipes everything', () => {
    const c = new TTLCache<number>();
    c.set('a', 1);
    c.set('b', 2);
    c.clear();
    expect(c.get('a')).toBeNull();
    expect(c.get('b')).toBeNull();
  });
});