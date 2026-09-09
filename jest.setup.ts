// Jest setup for TrailCast
// Mocks expo modules that touch native code; expo-sqlite is mocked to use a
// pure-JS in-memory SQLite via better-sqlite3 for migration/schema tests.
// The real expo-sqlite is exercised only on-device (PRD §6.1).

// Silence noisy logs in tests.
process.env.EXPO_OS = 'ios';
process.env.EXPO_PUBLIC_NO_TELEMETRY = '1';

// Mock expo-sqlite to expose a better-sqlite3-backed in-memory DB so
// migration SQL can be exercised in node. The mock is only active in tests.
jest.mock('expo-sqlite', () => {
  const Database = require('better-sqlite3');
  const openDatabaseAsync = async (name: string) => {
    const db = new Database(':memory:');
    return {
      execAsync: async (sql: string) => {
        db.exec(sql);
      },
      runAsync: async (sql: string, ...params: unknown[]) => {
        const stmt = db.prepare(sql);
        stmt.run(...params);
        return {
          lastInsertRowId: Number(db.lastInsertRowid) || 0,
          changes: db.changes,
        };
      },
      getAllAsync: async <T>(sql: string, ...params: unknown[]) => {
        const stmt = db.prepare(sql);
        return stmt.all(...params) as T[];
      },
      getFirstAsync: async <T>(sql: string, ...params: unknown[]) => {
        const stmt = db.prepare(sql);
        const row = stmt.get(...params);
        return (row ?? null) as T | null;
      },
      closeAsync: async () => {
        db.close();
      },
      _name: name,
    };
  };
  return { openDatabaseAsync };
});

// Mock expo-location: no real GPS in tests.
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: { latitude: 39.9334, longitude: 32.8597, accuracy: 10 },
    timestamp: Date.now(),
  })),
  reverseGeocodeAsync: jest.fn(async () => [{ city: 'Ankara', country: 'Turkey' }]),
}));

// Mock expo-router so useRouter + Link work in tests.
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Link: ({ children }: { children: React.ReactNode }) => children,
  Stack: ({ children }: { children: React.ReactNode }) => children,
  Tabs: ({ children }: { children: React.ReactNode }) => children,
}));