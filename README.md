# TrailCast

Offline-first, ad-free, single-screen **hyperlocal weather + activity journal** for trail runners, gravel cyclists, and casual hikers.

- Expo SDK 55 (RN 0.83, React 19.2) + TypeScript strict
- File-based routing via `expo-router`
- Local-only storage (`expo-sqlite`)
- Open-Meteo for forecast + geocoding (no API key, no billing)
- Zero analytics, zero crash reporting, zero ads

## Hızlı Başlangıç — Laptop'una İndir ve Çalıştır

### 1) Gereksinimler

- **Node.js 20+** (`node -v` ile kontrol et, yoksa https://nodejs.org)
- **Git**
- **Expo Go** uygulaması (iPhone/Android mağazadan — fiziksel cihazda test için)

> Node 20 önerilir. `nvm` kullanıyorsan: `nvm install 20 && nvm use 20`

### 2) Projeyi indir

```bash
git clone https://github.com/cnrsbtogll/Trailercast.git
cd Trailercast
# veya bu repo monorepo ise:
# cd apps/2026-W37-trailcast
```

> Klasör ismi `Trailercast` olacak. İçinde `package.json` varsa doğru yerdesin (`expo` orada olmalı).

### 3) Bağımlılıkları kur

```bash
npm install
```

İlk kurulum 1-2 dk sürer (1050+ paket). Hata alırsan:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 4) Çalıştır

**Expo Go ile (en kolay — telefon + laptop aynı Wi-Fi'da):**

```bash
npm start
# veya
npx expo start
```

Terminal'de çıkan **QR kodu** Expo Go ile okut → uygulama telefonunda açılır.

**Simülatör / Emülatör:**

```bash
npm run ios      # macOS + Xcode gerekir
npm run android  # Android Studio + emülatör gerekir
npm run web      # tarayıcıda dene (hızlı önizleme)
```

### 5) Doğrulama (opsiyonel ama önerilir)

```bash
npm run typecheck   # npx tsc --noEmit
npm run lint        # npx eslint .
npm test            # jest
```

Hepsi yeşil olmalı. Değilse `IMPLEMENTATION_LOG.md`'ye bak.

### Sık Karşılaşılan Sorunlar

- **QR okuyor ama bağlanmıyor:** Laptop ve telefon aynı Wi-Fi'da olmalı. Olmuyorsa `npx expo start --tunnel` dene.
- **`expo: command not found`:** `npx expo start` kullan (global kurmana gerek yok).
- **iOS build hatası:** Bu proje EAS Cloud Build bekler, lokal Xcode build'i şart değil. `npm run web` ile devam edebilirsin.
- **Port çakışması:** `npx expo start --port 19001` dene.

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
