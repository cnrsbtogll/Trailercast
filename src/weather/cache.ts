/**
 * TrailCast — on-device weather cache.
 *
 * In-memory cache keyed by `${latitude},${longitude}`. TTL is 10 minutes
 * (PRD §6.2.2). On-device only — never persisted to disk and never
 * uploaded.
 *
 * This module is intentionally framework-agnostic. The AsyncStorage
 * alternative would be AsyncStorage, but per PRD §6.2.3 we use SQLite
 * for the *journal* of past weather snapshots; the live cache stays in
 * memory because losing it on cold-start is fine — the forecast will
 * refetch within 10 minutes anyway.
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number; // epoch ms
}

const TTL_MS = 10 * 60 * 1000;

export class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  static keyFor(latitude: number, longitude: number, suffix: string): string {
    return `${latitude.toFixed(4)},${longitude.toFixed(4)}::${suffix}`;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number = TTL_MS): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  clear(): void {
    this.store.clear();
  }

  /** Drop everything older than its expiry; useful in tests. */
  pruneExpired(now: number = Date.now()): number {
    let dropped = 0;
    for (const [k, v] of this.store) {
      if (now > v.expiresAt) {
        this.store.delete(k);
        dropped += 1;
      }
    }
    return dropped;
  }
}