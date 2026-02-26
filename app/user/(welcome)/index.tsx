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

const { StatusBarManager } = NativeModules;

export default function Step1({ navigation }: any) {
    const router = useRouter();
    return (
        <SafeAreaView className={`flex-1 justify-evenly bg-white px-[5%] ${Platform.OS === "android" ? `pt-1` : "pt-2.5"
            }`}>
            <Pressable
                onPress={() => {
                    navigation.navigate("/");
                }}
                className="hidden"
            >
                <Text className="text-xs text-black text-center rounded-full border border-black p-1 w-[45px]">
                    Skip
                </Text>
            </Pressable>

            <Image source={require("@/assets/images/Welcome/image1.png")} />

            <View className="!px-4">
                <Text className="text-[#2A347E] text-center text-[33px] font-bold tracking-tight leading-none">
                    Seamless Delivery,{"\n"} Elevated Shopping
                </Text>
                <Text className="text-[#181818] text-center !text-[16px] font-medium leading-[23px] tracking-tight mt-[3%]">
                    Experience shopping like never before, connect with trusted
                    sellers, and ensures swift, secure deliveries right to your
                    doorstep
                </Text>
            </View>

            <View className="items-center">
                <Image
                    source={require("@/assets/images/Welcome/step1.png")}
                    className="w-[38px] h-[22px] mt-[5%]"
                />
            </View>

            <Pressable
                onPress={() => {
                    router.push("/user/(welcome)/step2")
                }}
                className="items-center"
            >
                <Image
                    source={require("@/assets/images/Welcome/ProgressButton1.png")}
                    className="w-[60px] h-[60px] mt-[5%]"
                />
            </Pressable>
            <StatusBar style="dark" />
        </SafeAreaView>
    );
}