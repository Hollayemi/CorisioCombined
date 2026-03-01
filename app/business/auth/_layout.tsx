import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>

            {/* <Stack.Screen name="Category" options={{ headerShown: false }} /> */}
            <Stack.Screen name="files/PhoneEntry" options={{ headerShown: false }} />
            <Stack.Screen name="files/PhoneVerify" options={{ headerShown: false }} />
            <Stack.Screen name="files/ProfileSetup" options={{ headerShown: false }} />
            <Stack.Screen name="files/PendingVerification" options={{ headerShown: false }} />
            <Stack.Screen name="files/ProfilePicture" options={{ headerShown: false }} />
            <Stack.Screen name="files/Availability" options={{ headerShown: false }} />

            <Stack.Screen name="Signup1" options={{ headerShown: false }} />
            <Stack.Screen name="Signup2" options={{ headerShown: false }} />
            <Stack.Screen name="Signup3" options={{ headerShown: false }} />
            <Stack.Screen name="Availability" options={{ headerShown: false }} />
            <Stack.Screen name="ProfilePicture" options={{ headerShown: false }} />
            <Stack.Screen name="Category" options={{ headerShown: false }} />
            {/* other pages */}
            
            <Stack.Screen name="map" options={{ headerShown: false }} /> 
            <Stack.Screen name="Login" options={{ headerShown: false }} /> 
            <Stack.Screen name="UpdatePassword" options={{ headerShown: false }} />
            <Stack.Screen name="Created" options={{ headerShown: false }} />
            <Stack.Screen name="Verify" options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} /> 
        </Stack>
    );
}
