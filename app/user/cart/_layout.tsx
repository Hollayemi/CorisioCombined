import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/index" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/shipping/index" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/payment/index" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/payment/confirmation" options={{ headerShown: false }} />
        </Stack>
    );
}
