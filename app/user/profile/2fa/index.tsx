import { useUserData } from "@/hooks/useData";
import { useUpdateUserAccountMutation } from "@/redux/user/slices/userSlice2";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

export default function TwoFactorAuth() {
    const [updateUserAccount, { isLoading: updating }] = useUpdateUserAccountMutation()
    const { userInfo, refetchUser } = useUserData() as any;

    return (

        <View className="flex-1 flex justify-center bg-white dark:bg-slate-950 p-[7%] items-center">
            <Image
                source={require("@/assets/images/2fa.png")}
                className="w-[300px] h-[300px]"
            />

            <Text className="text-center font-['Poppins_600SemiBold'] font-bold my-[7%] text-indigo-900 dark:text-indigo-400 text-xl">
                Protect your account
            </Text>

            <Text className="text-center leading-9 font-['Poppins_400Regular'] mb-[5%] text-[16px] text-gray-800 dark:text-gray-300">
                Guarantee that it's really you trying to access your account with two-factor authentication (2FA)
            </Text>

            <Text className="text-center font-['Poppins_500Medium'] mb-[5%] text-indigo-900 dark:text-indigo-400 text-base">
                Process
            </Text>

            <Text className="text-center leading-9 font-['Poppins_400Regular'] mb-[5%] text-[16px] text-gray-800 dark:text-gray-300">
                A verification code will be sent to your registered email for verification.
            </Text>

            <Text
                className="bg-indigo-900 dark:bg-indigo-800 text-white mt-7 text-center text-lg py-4 rounded-full font-['Poppins_500Medium'] w-full"
                onPress={() => updateUserAccount({ two_fa: !userInfo.two_fa }).then(() => refetchUser())}
            >
                {userInfo.two_fa ? "Disable" : "Enable"} Two-Factor Authentication
            </Text>

            <Text
                className="mt-5 text-center font-['Poppins_500Medium'] text-gray-900 dark:text-gray-300 text-[16px]"
                onPress={() => router.back()}
            >
                Maybe Later
            </Text>
        </View>
    );
}