import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useUserData } from "@/hooks/useData";
import { router } from "expo-router";
import React from "react";
import { Image, NativeModules, Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HeaderProps = {
    title: any;
    navigation: any;
    app?: boolean;
    noBack?: boolean;
};

const { StatusBarManager } = NativeModules;

export default function HomeHeader() {
    const { userInfo }: any = useUserData()
    const insets = useSafeAreaInsets();
    const color = useColorScheme()
    const isDark = color === "dark"
    return (
        <View
            className={`px-6 pb-2 ${
                        Platform.OS === "android" ? `pt-[50px]` : ""
                    } pt-16 flex-row justify-between items-center bg-white dark:bg-slate-950 pt-[${insets.top + 20}px]`}
        >
            <View className="flex-row items-center space-x-3">
                <Image
                    source={userInfo.picture ? { uri: userInfo.picture } : require("@/assets/images/customerSupport.png")}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <View className={`flex justify-start `}>
                    <Text
                        className="text-black dark:text-white text-[15px] font-black font-poppins500 flex-shrink"
                        numberOfLines={1}
                    >
                        {userInfo.username}
                    </Text>
                    <Text
                        className="text-gray-500 dark:text-gray-200 text-[12px] font-medium font-poppins500 flex-shrink"
                        numberOfLines={1}
                    >
                        {userInfo.email}
                    </Text>
                </View>
            </View>


            <View className="flex-row  space-x-6 justify-between">
                <TouchableOpacity
                    onPress={() => router.push("/user/cart")}
                >
                    <Image
                        source={!isDark ? require("@/assets/images/shopping-cart.png") : require("@/assets/images/shopping-cart-white.png")}
                        className="w-7 h-7 dark:tint-white"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push("/user/home/notification")}
                    className="ml-7"
                >
                    <Image
                        source={isDark ? require("@/assets/images/light-notification.png") : require("@/assets/images/dark-notification.png")}
                        className="w-7 h-7 dark:tint-white"
                    />
                </TouchableOpacity>
            </View>

        </View>
    );
}