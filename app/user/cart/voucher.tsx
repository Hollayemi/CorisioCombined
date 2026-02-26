import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Voucher() {
    return (
        <View className="flex-row items-center justify-between py-4 mx-0 ">
            <View className="flex-row items-center">
                <Ionicons
                    name="card"
                    size={18}
                    color="#2A347E"
                    className="dark:text-indigo-300"
                />
                <Text className="text-indigo-900 text-sm font-semibold mx-3.5 dark:text-indigo-300">
                    Voucher
                </Text>
            </View>
            <View className="flex-row items-center">
                <Text className="text-gray-900 text-sm font-medium ml-3.5 dark:text-gray-300">
                    Click to add or check Voucher
                </Text>
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#2A347E"
                    className="ml-2.5 dark:text-indigo-300"
                />
            </View>
        </View>
    );
}

export default Voucher;