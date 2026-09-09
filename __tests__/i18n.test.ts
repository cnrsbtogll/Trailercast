import { t, STRINGS } from '@/i18n/strings';
import type { StringKey } from '@/i18n/strings';

describe('i18n strings', () => {
  it('all three locales return the same set of keys', () => {
    const keysOf = (lang: 'tr' | 'en' | 'de') =>
      Object.keys(STRINGS[lang]).sort();
    const trKeys = keysOf('tr');
    const enKeys = keysOf('en');
    const deKeys = keysOf('de');
    expect(trKeys).toEqual(enKeys);
    expect(enKeys).toEqual(deKeys);
    expect(trKeys.length).toBeGreaterThan(0);
  });

  it('TR is non-empty for every key', () => {
    expect(t('tr', 'today.header')).toBeTruthy();
    expect(t('tr', 'log.empty')).toBeTruthy();
    expect(t('tr', 'settings.title')).toBeTruthy();
  });

  it('EN and DE provide a translation (not the same string as TR)', () => {
    expect(t('en', 'today.header')).not.toBe(t('tr', 'today.header'));
    expect(t('de', 'today.header')).not.toBe(t('tr', 'today.header'));
    expect(t('en', 'today.header')).not.toBe(t('de', 'today.header'));
  });

  it('no key returns an empty string in any locale', () => {
    for (const lang of ['tr', 'en', 'de'] as const) {
      for (const k of Object.keys(STRINGS[lang]) as StringKey[]) {
        const value = t(lang, k);
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});