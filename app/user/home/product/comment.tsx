import React from "react";

import Rating from "@/components/rating";
import { formatDate } from "@/utils/format";
import { Image, Text, View } from "react-native";
import { Review } from "./data";
export default function Coment({ comment, date, image, user, rating, id }: Review) {
    console.log(date)
    return (
        <View
            key={id}
            className="flex-row mt-7 px-0 dark:bg-slate-950"
        >
            <Image
                source={{ uri: image }}
                className="w-12 h-12 rounded-full !object-contain mr-2.5"
            />
            <View className="pl-2.5 " style={{ width: "90%" }}>
                <Text className="text-black text-base font-semibold mb-1 dark:text-white">
                    {user}
                </Text>
                <Text className="text-gray-600 text-[13px] leading-6 font-normal pr-5 dark:text-gray-300">
                    {comment}
                </Text>
                <View className="flex-row items-center mt-3">
                    <Rating size={13} rate={rating} />
                    <Text className="text-xs font-medium ml-2.5 dark:text-gray-400">
                        {formatDate(date)}
                    </Text>
                </View>
            </View>
        </View>
    );
}