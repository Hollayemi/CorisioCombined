import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="category/index" options={{ headerShown: false }} />
            <Stack.Screen name="product/index" options={{ headerShown: false }} />
            <Stack.Screen name="notification/index" options={{ headerShown: false }} />
            <Stack.Screen name="notification/list" options={{ headerShown: false }} />
            <Stack.Screen name="notification/details" options={{ headerShown: false }} />
        </Stack>
    );
}
