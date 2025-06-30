import { Tabs } from 'expo-router';
import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(devices)"
        options={{
          title: 'Dispositivos',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />
        }}
      />
    </Tabs>
  );
}
