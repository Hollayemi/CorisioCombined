import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="searchScreen" options={{ headerShown: false }} />
        </Stack>
    );
}
