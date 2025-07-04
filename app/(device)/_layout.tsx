import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Info',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}