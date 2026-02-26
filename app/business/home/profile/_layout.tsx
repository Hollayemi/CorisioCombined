import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="account/details/index" options={{ headerShown: false }} />
            <Stack.Screen name="account/password/index" options={{ headerShown: false }} />
            <Stack.Screen name="account/password/changePassword" options={{ headerShown: false }} />
            <Stack.Screen name="account/payments/index" options={{ headerShown: false }} />
            <Stack.Screen name="account/session/index" options={{ headerShown: false }} />
            <Stack.Screen name="account/notifications/index" options={{ headerShown: false }} />
            <Stack.Screen name="business/details/index" options={{ headerShown: false }} />
            <Stack.Screen name="business/availability/index" options={{ headerShown: false }} />
            <Stack.Screen name="business/availability/edit" options={{ headerShown: false }} />
            <Stack.Screen name="business/insights/index" options={{ headerShown: false }} />
            <Stack.Screen name="business/reviews/index" options={{ headerShown: false }} />
            <Stack.Screen name="business/map/index" options={{ headerShown: false }} />
            <Stack.Screen name="support/help/index" options={{ headerShown: false }} />
            <Stack.Screen name="support/website/index" options={{ headerShown: false }} />
        </Stack>
    );
}
