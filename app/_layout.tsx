import { Stack } from 'expo-router';
import { BleProvider } from '~/contexts/BleContext';
import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <BleProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(device)"
            options={{
              title: 'Device',
              headerLargeTitle: true,
              headerLargeTitleShadowVisible: false,
              headerLargeStyle: { backgroundColor: 'transparent' },
              headerBackTitle: 'Back',
              headerBackVisible: true,
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </BleProvider>
  );
}
