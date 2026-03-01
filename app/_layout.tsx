import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
// Import global CSS file
import "../global.css";

// import { ChatDataProvider } from '@/context/chatContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { Image } from 'react-native';
import ToastContainer from "toastify-react-native";
import { server } from '@/config/server';

// Prevent the splash screen from auto-hiding before Asset loading is complete.
SplashScreen.preventAutoHideAsync();

function CustomSplashScreen({ setAppReady }: any) {
    useEffect(() => {
        const prepareApp = async () => {
            try {
                // 1. Check saved location
                let coords = await AsyncStorage.getItem('coords');
                if (!coords) {
                    // If not in storage, request location
                    const { status } = await Location.requestForegroundPermissionsAsync();
                    if (status === 'granted') {
                        const location = await Location.getCurrentPositionAsync({});
                        coords = JSON.stringify(location.coords);
                    }
                }

                // 2. Check if server is responding
                const res = await axios.get(`${server}/api/v1/products`);
                if (res.status === 200 && coords) {
                    setAppReady(true);
                }
            } catch (e) {

            } finally {
                SplashScreen.hideAsync(); // hide splash
            }
        };

        prepareApp();
    }, []);
    return (
        <View className={`h-full items-center justify-center bg-[#2A347E]`}>
            {/* Replace with your app logo */}
            <Image
                source={require("@/assets/images/splash.png")}
                className="w-full h-screen object-contain  absolute"
            />
            <View className="absolute flex-row items-center bottom-2 !text-white mb-16">
                {/* Tagline */}
                <ActivityIndicator
                    size="small"
                    color={'#FDB415'}
                />
                <Text className={`text-lg  ml-4 text-white `}>
                    Getting Ready
                </Text>
            </View>
            <StatusBar style="light" />
            {/* Loading indicator */}
        </View>
    );
}

function RootLayout() {
    const colorScheme = useColorScheme();
    const [startAfresh, setStartAfresh] = useState(false)
    const [appIsReady, setAppIsReady] = useState(false);
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        const checkHasRecord = async () => {
            const hasRecord = await AsyncStorage.getItem("hasRecord");
            console.log("hasRecord2", hasRecord);
            setStartAfresh(!!hasRecord)

        };
        checkHasRecord();
    }, [])

    console.log({ startAfresh })

    useEffect(() => {
        async function prepare() {
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));

            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        if (loaded) {
            prepare();
        }
    }, [loaded]);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady && loaded) {
          await SplashScreen.hideAsync();
        }
    }, [appIsReady, loaded]);

   if (!appIsReady || !loaded) {
        return <CustomSplashScreen setAppReady={setAppIsReady} />;
    }



    return (
        <View className="flex-1" onLayout={onLayoutRootView}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <ToastContainer
                    style={{
                        top: 0, // adjust offset from top
                        zIndex: 9999, // make sure it's above everything
                        paddingHorizontal: 0,

                    }}
                    toastStyle={{
                        backgroundColor: "#333",
                        borderRadius: 10,
                        padding: 0,
                    }}
                />
                {/* <ChatDataProvider> */}
                    <Stack>
                        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
                        <Stack.Screen name="user" options={{ headerShown: false }} />
                        <Stack.Screen name="business" options={{ headerShown: false }} />
                        <Stack.Screen name="broken" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                {/* </ChatDataProvider> */}
            </ThemeProvider>
        </View>
    );
}

export default RootLayout