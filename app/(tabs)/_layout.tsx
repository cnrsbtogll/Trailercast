import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSettings } from '@/state/settings';
import { t } from '@/i18n/strings';

/** Tiny inline icon — no asset bundling required for the scaffold. */
function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 18 }}>{label}</Text>;
}

export default function TabsLayout() {
  const language = useSettings((s) => s.language);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#64748B',
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#F8FAFC',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(language, 'today.header'),
          tabBarLabel: t(language, 'today.header'),
          tabBarIcon: () => <TabIcon label="☀" />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: t(language, 'log.title'),
          tabBarLabel: t(language, 'log.title'),
          tabBarIcon: () => <TabIcon label="✎" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t(language, 'settings.title'),
          tabBarLabel: t(language, 'settings.title'),
          tabBarIcon: () => <TabIcon label="⚙" />,
        }}
      />
    </Tabs>
  );
}