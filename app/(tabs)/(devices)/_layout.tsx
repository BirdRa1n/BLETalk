import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Dispositivos',
          headerLargeTitle: true,
          headerShadowVisible: false
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalhes'
        }}
      />
    </Stack>
  );
}
