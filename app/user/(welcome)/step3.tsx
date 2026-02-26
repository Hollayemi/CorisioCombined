import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
    Image,
    NativeModules,
    Pressable,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { StatusBarManager } = NativeModules;

export default function Step3({ navigation }: any) {
    const router = useRouter()
    const insets = useSafeAreaInsets();
    useEffect(() => {
        const checkHasRecord = async () => {
            await AsyncStorage.setItem("hasRecord2", "truee");
        };
        checkHasRecord();
    }, [])
    return (

        <View className={`flex-1 justify-evenly bg-white
            }`}>
            <Image source={require("@/assets/images/Welcome/image3.png")} />

            <View className="px-3">
                <Text className="text-[#2A347E] text-center text-[33px] font-bold tracking-tight leading-none">
                    Welcome to Your{"\n"} Shopping Haven
                </Text>
                <Text className="text-[#181818] text-center !text-[16px] font-medium leading-[23px] tracking-tight mt-[3%]">
                    Step into a realm of endless choices, unbeatable prices, and
                    an enriching shopping journey tailored just for you.
                </Text>
            </View>

            <View className="items-center">
                <Image
                    source={require("@/assets/images/Welcome/step3.png")}
                    className="w-[38px] h-[22px] mt-2%]"
                />
            </View>

            <View className="items-center">
                <Pressable
                    onPress={() => {
                        router.push("/user/home");
                    }}
                    className="items-center"
                >
                    <Text className="text-white text-base font-bold bg-[#2A347E]  rounded-full text-center px-5 py-3  mt-[5%]">
                        Get Started
                    </Text>
                </Pressable>
            </View>
            <StatusBar style="dark" />
            <View style={{ height: insets.bottom }} className="" />
        </View>

    );
}