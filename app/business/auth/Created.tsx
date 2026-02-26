import Button from "@/components/form/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Image, SafeAreaView, Text, View } from "react-native";

export default function Created({ navigation }: any) {


    return (
        <SafeAreaView className="flex-1 h-screen bg-white dark:bg-slate-950 px-2 items-center">
            <View className="w-full" />

            <Image
                source={require("@/assets/images/accountCreated.png")}
                className="w-[90%]"
                style={{ marginVertical: 40 }}
                resizeMode="contain"
            />

            <View className="items-center w-full">
                <Text className="text-[#2A347E] dark:text-indigo-400 text-2xl font-bold">
                    Account Created
                </Text>

                <Text className="!text-[17px] mt-4 mb-8 text-center leading-9 px-8 text-gray-600 dark:text-gray-300">
                    Welldone, your perseverance has finally paid off, all that is left for you is set your store location.
                </Text>
            </View>
            <View className="absolute bottom-20 w-full px-4" style={{ bottom: 100 }}>
                <Button
                    onPress={async () => { await AsyncStorage.setItem("settingMap", "true"); router.push("/auth/ProfilePicture"); }}
                    title="Set Business Logo"
                />
            </View>
        </SafeAreaView>
    );
}