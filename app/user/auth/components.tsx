import { GoogleAuthButton } from "@/components/webview/oauth";
import { server } from "@/config/server";
import { router } from "expo-router";
import { AppleIcon, Facebook } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type prop = {
    title?: string;
    description?: string;
};

export default function Heading({ description, title }: prop) {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    return (
        <View className="px-4">
            <Image
                source={!isDarkMode ? require("@/assets/images/logo2.png") : require("@/assets/images/logowhite.png")}
                className="h-[38px] w-[156px] my-[5%] mt-[15%]"
            />
            {description && title ? (
                <>
                    <Text className="text-[#2A347E] dark:text-gray-100 font-bold text-[22px] mt-[4%]">
                        {title}
                    </Text>
                    <Text className="text-[#5e5e5e] dark:text-gray-300 mt-[3%] w-[95%] leading-[20px] text-[15px]">
                        {description}
                    </Text>
                </>
            ) : null}
        </View>
    );
}


type footerProp = {
    login?: boolean
};

export function Footer({ login }: footerProp) {
    const [authUrl, setAuthUrl] = useState("")
    console.log({ authUrl })
    return (
        <>
            <View className="items-center mt-[5%]">
                <Text className="text-[#424242] dark:text-gray-400 text-sm font-bold">
                    <Text>{login ? "Don't have an account?" : "Have an account?"} </Text>
                    <Text
                        className="text-[#2A347E] dark:text-blue-600"
                        onPress={() => router.push(login ? "/user/auth/Signup1" : "/user/auth/Login")}
                    >
                        {login ? "Register" : "Log In"}
                    </Text>
                </Text>

                <Text className="text-[#7C7C7C] text-xs tracking-tight my-[5%] font-bold">
                    Or
                </Text>

                <View className="flex-row justify-evenly">
                    <View className="bg-[#EBF6FD] dark:bg-slate-950 h-[50px] w-[50px] rounded-full items-center justify-center">
                        <Facebook size={20} color="#3D6AD6" />
                    </View>

                    <TouchableOpacity onPress={() => setAuthUrl(`${server}/auth/google`)} className="bg-[#EBF6FD] dark:bg-slate-950 h-[50px] w-[50px] rounded-full items-center justify-center mx-[5%]">
                        <Image source={require("@/assets/images/google.png")} />
                    </TouchableOpacity>

                    <View className="bg-[#EBF6FD] dark:bg-slate-950 h-[50px] w-[50px] rounded-full items-center justify-center">
                        <AppleIcon size={20} color="black" />
                    </View>
                </View>

                {!login && (
                    <Text className="text-center p-[5%] text-xs leading-[20px]">
                        <Text>By continuing, you agree to the </Text>
                        <Text className="text-[#233974]">Library Terms {"\n"}Conditions </Text>
                        <Text> and </Text>
                        <Text className="text-[#233974]"> Privacy Policy</Text>
                    </Text>
                )}
            </View>
            <GoogleAuthButton />
            {/* <OAuthModal
                visible={!!authUrl}
                // url={authUrl}
                onSuccess={() => router.push('/cart/checkout/payment/confirmation')}
                onCancel={() => setAuthUrl('')}
                onError={() => setAuthUrl('')}
            /> */}
        </>
    );
}