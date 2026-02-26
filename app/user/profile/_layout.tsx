import { Stack } from "expo-router";

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="account/details/index" options={{ headerShown: false }} />
            <Stack.Screen name="picker/index" options={{ headerShown: false }} />
            <Stack.Screen name="picker/new" options={{ headerShown: false }} />
            <Stack.Screen name="address/index" options={{ headerShown: false }} />
            <Stack.Screen name="address/newAddress" options={{ headerShown: false }} />
            <Stack.Screen name="savedItems/index" options={{ headerShown: false }} />
            <Stack.Screen name="recentlyViewed/index" options={{ headerShown: false }} />
            {/* account */}
            
            <Stack.Screen name="account/changeEmail/index" options={{ headerShown: false }} />
            <Stack.Screen name="account/changeEmail/emailChanged" options={{ headerShown: false }} />

            <Stack.Screen name="account/changePassword/index" options={{ headerShown: false }} />
            <Stack.Screen name="account/changePassword/passwordChanged" options={{ headerShown: false }} />
            <Stack.Screen name="account/changePhoneNumber/index" options={{ headerShown: false }} />

            
            {/* 2fs */}
            <Stack.Screen name="2fa/index" options={{ headerShown: false }} />
            {/* customerSupport */}


            <Stack.Screen name="customerSupport/index" options={{ headerShown: false }} />
            {/* deleteAccount */}

            
            <Stack.Screen name="deleteAccount/index" options={{ headerShown: false }} />

        </Stack>
    );
}
