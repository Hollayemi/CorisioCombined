import Button from "@/components/form/Button";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NotificationAccess() {
    return (
        <View className="flex-1 bg-white dark:bg-slate-900 p-5 items-center justify-center">
            <Image
                source={require("@/assets/images/notification.png")}
                className="w-full aspect-square max-w-[350px]"
            />

            <Text className="text-center font-semibold text-2xl text-gray-900 dark:text-white font-poppins600">
                Don't miss out!
            </Text>

            <Text className="text-center font-normal text-lg text-gray-500 dark:text-gray-400 font-poppins400 ">
                Enable push notifications to grant access to receive instant updates on
                your mobile phone notification center about order confirmations,
                exciting promotions, and personalized recommendations.
            </Text>

            <View className="mb-6 mt-20">
                <Button
                    title="Enable Push Notification"
                    onPress={() => router.push("/user/home/notification/list")}
                />
            </View>
           
            <TouchableOpacity
                onPress={() => router.push("/user/home")}
            >
                <Text className="text-center font-medium text-lg text-gray-900 dark:text-gray-200 font-poppins500">
                    Maybe Later
                </Text>
            </TouchableOpacity>
        </View>
    );
}