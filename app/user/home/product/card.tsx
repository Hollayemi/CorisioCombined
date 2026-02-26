import React from "react";
import { View, Image, Text } from "react-native";
import Rating from "@/components/rating";
import { Similar } from "./data";

export default function Card({ price, rating, description }: Similar) {
    return (
        <View className="rounded border border-gray-300 ml-5 w-56 dark:border-gray-600 dark:bg-slate-800">
            <Image
                source={require("@/assets/images/demo/2.png")}
                className="object-cover h-44 w-full"
            />
            <View className="p-2.5">
                <Text
                    className="text-sm font-medium mb-1 dark:text-white"
                    numberOfLines={1}
                >
                    {description}
                </Text>
                <Text className="text-base font-bold text-gray-900 mb-2.5 dark:text-white">
                    ₦{price}
                </Text>
                <Rating rate={4} size={15} />
            </View>
        </View>
    );
}