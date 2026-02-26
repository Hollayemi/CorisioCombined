import React from "react";
import { Text, View } from "react-native";

type prop = {
    title: string;
    Icon: any;
};

export default function Type({ title, Icon }: prop) {
    return (
        <View className="p-3 flex-col items-center">
            <View className="bg-indigo-50 dark:bg-indigo-900 w-[60px] h-[60px] flex-row content-center justify-center rounded-full items-center">
                {Icon}
            </View>
            <Text className="text-center font-['Poppins_400Regular'] text-xs max-w-[90px] py-1 text-gray-900 dark:text-white">
                {title}
            </Text>
        </View>
    );
}