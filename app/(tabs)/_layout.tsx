import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';

/** Tiny inline icon — no asset bundling required for the scaffold. ponytail: emoji is colored glyph; use opacity for passive state instead of tint. */
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.42 }}>{label}</Text>;
}

export default function TabsLayout() {
  const language = useSettings((s) => s.language);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: { borderTopColor: '#E2E8F0' },
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#F8FAFC',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(language, 'today.header'),
          tabBarLabel: t(language, 'today.header'),
          tabBarIcon: ({ focused }) => <TabIcon label="☀" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: t(language, 'log.title'),
          tabBarLabel: t(language, 'log.title'),
          tabBarIcon: ({ focused }) => <TabIcon label="✎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t(language, 'settings.title'),
          tabBarLabel: t(language, 'settings.title'),
          tabBarIcon: ({ focused }) => <TabIcon label="⚙" focused={focused} />,
        }}
      />
    </Tabs>
  );
}