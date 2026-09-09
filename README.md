# TrailCast

Offline-first, ad-free, single-screen **hyperlocal weather + activity journal** for trail runners, gravel cyclists, and casual hikers.

- Expo SDK 55 (RN 0.83, React 19.2) + TypeScript strict
- File-based routing via `expo-router`
- Local-only storage (`expo-sqlite`)
- Open-Meteo for forecast + geocoding (no API key, no billing)
- Zero analytics, zero crash reporting, zero ads

## Engineering status

See `IMPLEMENTATION_LOG.md` for the slice ledger and per-tick progress.

## Local checks

```bash
npm install
npx tsc --noEmit
npx eslint .
npx jest --ci
```

## Project layout

```
app/                  # expo-router routes
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx         # Today tab
    log.tsx           # Log tab
    settings.tsx      # Settings tab
src/
  db/                 # schema + migrations
  weather/            # Open-Meteo client + cache
  state/              # Zustand stores
  i18n/               # TR / EN / DE strings
__tests__/            # jest-expo tests
```

## Hard constraints (from PRD)

1. No analytics, no crash reporting, no ad SDK.
2. No map tiles in v1.0.
3. No accounts; device-local only; export is user-initiated.
4. No store submission without explicit user approval.
5. "Data Not Collected" must remain literally true.