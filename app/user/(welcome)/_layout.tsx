import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="step2" options={{ headerShown: false }} />
            <Stack.Screen name="step3" options={{ headerShown: false }} />
        </Stack>
    );
}
