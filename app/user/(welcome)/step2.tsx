import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Image,
    NativeModules,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { StatusBarManager } = NativeModules;

export default function Step2({ navigation }: any) {
    const router = useRouter()
    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView className={`flex-1 justify-evenly bg-white ${Platform.OS === "android" ? `pt-[${StatusBarManager.HEIGHT + 20}px]` : "pt-2.5"
            }`}>
            <Pressable
                onPress={() => {
                    router.push("/user/(welcome)")
                }}
                className="hidden"
            >
                <Text className="text-xs text-black text-center rounded-full border border-black p-1 w-[45px]">
                    Skip
                </Text>
            </Pressable>

            <Image source={require("@/assets/images/Welcome/image2.png")} />

            <View className="px-3">
                <Text className="text-[#2A347E] text-center text-[33px] font-bold tracking-tight leading-none">
                    Discover Convenience {"\n"}at Your Fingertips
                </Text>
                 <Text className="text-[#181818] text-center !text-[16px] font-medium leading-[23px] tracking-tight mt-[3%]">
                    Unlock a world of curated products, seamless transactions, and
                    personalized shopping recommendations, all in one app.
                </Text>
            </View>

            <View className="items-center">
                <Image
                    source={require("@/assets/images/Welcome/step2.png")}
                    className="w-[38px] h-[22px] mt-[2%]"
                />
            </View>

            <Pressable
                onPress={() => {
                    router.push("/user/(welcome)/step3");
                }}
                className="items-center"
            >
                <Image
                    source={require("@/assets/images/Welcome/ProgressButton2.png")}
                    className="w-[60px] h-[60px] mt-[2%]"
                />
            </Pressable>
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}