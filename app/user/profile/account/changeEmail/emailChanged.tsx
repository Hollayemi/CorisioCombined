import React from "react";
import { Image, Text, View } from "react-native";

export default function EmailChanged() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-950 p-[7%] items-center justify-center">
            <Image
                source={require("@/assets/images/emailChanged.png")}
                className="w-[300px] h-[300px]"
            />
            <Text className="text-center font-normal text-2xl my-[5%] text-neutral-800 dark:text-white">
                Email Address changed {"\n"} Successfully
            </Text>
            <Text className="bg-indigo-900 dark:bg-indigo-700 text-white mt-12 text-center text-lg py-[3%] rounded-full w-full font-medium">
                Done
            </Text>
        </View>
    );
}