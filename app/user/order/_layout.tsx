import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="orderDetails" options={{ headerShown: false }} />
            <Stack.Screen name="review/index" options={{ headerShown: false }} />
        </Stack>
    );
}
