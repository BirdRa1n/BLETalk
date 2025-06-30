import { Stack } from 'expo-router';
import { BleProvider } from '~/contexts/BleContext';
import '../global.css';

export default function RootLayout() {
  return (
    <BleProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </BleProvider>
  );
}
