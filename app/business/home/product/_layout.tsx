import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="list" options={{ headerShown: false }} />
            <Stack.Screen name="new" options={{ headerShown: false }} />
            <Stack.Screen name="categories/adjust" options={{ headerShown: false }} />
        </Stack>
    );
}
