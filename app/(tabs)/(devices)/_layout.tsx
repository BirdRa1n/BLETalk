import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Devices',
                    headerShown: true,
                    headerLargeTitle: true,
                    headerLargeTitleShadowVisible: false,
                    headerLargeStyle: { backgroundColor: 'transparent' },
                }}
            />
        </Stack>
    );
}