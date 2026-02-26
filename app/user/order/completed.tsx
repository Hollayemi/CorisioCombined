import ReviewCard from "@/components/order/orderCard";
import React from "react";
import { FlatList, Text, View } from "react-native";


export default function Completed(prop: any) {
    const {
        route: { params },
        navigation
    } = prop;
    const data = params.data;

    return (

        <View className="flex-1 bg-white dark:bg-slate-950 !pt-6">
            <View className="h-5" />
            {data.length > 0 ? (
                <FlatList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <ReviewCard
                            {...item}
                            key={index}
                            navigation={navigation}
                        />
                    )}
                />
            ) : (
                <View className="flex-row justify-center h-[50%] items-center">
                    <Text className="text-neutral-500 dark:text-neutral-400">
                        No Completed Order
                    </Text>
                </View>
            )}
        </View>

    );
}