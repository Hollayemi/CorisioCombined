import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Import global CSS file
// import AndroidSafeAreaView from "@/components/ui/AndroidSaveArea";
import { StoreDataProvider } from "@/context/storeContext";
import { isAuthenticated } from "@/redux/business/slices/api/axiosBaseQuery";
import { store } from "@/redux/business/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function BusinessLayout() {
    
    return (
        <SafeAreaProvider>
            {/* <AndroidSafeAreaView
                style={{ flex: 1, backgroundColor: "#f9fafb" }}
            > */}
            <Provider store={store}>
                <StoreDataProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        {!isAuthenticated() && <Stack.Screen
                            name="(welcome)"
                            options={{ headerShown: false }}
                        />}
                        <Stack.Screen name="home" options={{ headerShown: false }} />
                        <Stack.Screen name="chat" options={{ headerShown: false }} />
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                        <Stack.Screen name="broken" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </StoreDataProvider>
            </Provider>
            <StatusBar style="auto" />

            {/* </AndroidSafeAreaView> */}
        </SafeAreaProvider>
    );
}
