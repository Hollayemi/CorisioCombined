import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="Login"
                options={{
                    headerShown: false,
                    gestureEnabled: false,   // 🚫 disables swipe back
                    headerBackVisible: false // 🚫 hides back button
                }}
            />
            <Stack.Screen name="Signup1" options={{ headerShown: false }} />
            <Stack.Screen name="Signup2" options={{ headerShown: false }} />
            <Stack.Screen name="UpdatePassword" options={{ headerShown: false }} />
            <Stack.Screen name="created" options={{ headerShown: false }} />
            <Stack.Screen name="Verify" options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
        </Stack>
    );
}
