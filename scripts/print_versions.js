// print installed versions
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
for (const p of ['expo', 'expo-router', 'expo-sqlite', 'react', 'react-native', 'react-native-screens', 'react-native-gesture-handler', 'react-native-reanimated', 'react-native-safe-area-context', 'better-sqlite3', 'jest-expo']) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', p, 'package.json'), 'utf8'));
    console.log(p, pkg.version);
  } catch (e) {
    console.log(p, 'NOT INSTALLED', e.message);
  }
}