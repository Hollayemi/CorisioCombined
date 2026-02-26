import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";

export default function PasswordChanged() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-950 p-[7%] items-center justify-center">
            <Image
                source={require("@/assets/images/passwordChange.png")}
                className="w-[300px] h-[300px]"
            />
            <Text className="text-center font-medium my-[5%] text-xl text-neutral-800 dark:text-white">
                Password changed {"\n"} Successfully
            </Text>
            <TouchableOpacity className="w-full">
                <Text className="bg-indigo-900 dark:bg-indigo-700 text-white mt-7 text-center text-lg py-[5%] rounded-full font-medium">
                    Done
                </Text>
            </TouchableOpacity>
        </View>
    );
}