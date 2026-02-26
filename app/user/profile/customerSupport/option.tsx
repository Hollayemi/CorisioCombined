import React from "react";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type prop = {
    title: string;
    Icon: any;
    desc?: string;
};

export default function Option({ title, Icon, desc }: prop) {
    return (
        <View className="py-[2%] px-[5%] w-[33%] flex-row justify-between bg-neutral-100 dark:bg-gray-800 my-5 rounded-xl items-center">
            <View className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-full w-auto items-center">
                {Icon}
            </View>

            <View className="flex-1 mx-3">
                <Text className="font-['Poppins_500Medium'] text-sm py-1 text-gray-900 dark:text-white">
                    {title}
                </Text>
                {desc && (
                    <Text className="font-['Poppins_400Regular'] text-xs py-1 text-neutral-500 dark:text-neutral-400">
                        {desc}
                    </Text>
                )}
            </View>

            <AntDesign
                name="right"
                size={24}
                color="black"
                className="dark:text-white"
            />
        </View>
    );
}