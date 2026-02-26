import ReviewCard from "@/components/order/orderCard";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function Ongoing(prop: any) {
    const {
        navigation,
        route: { params },
    } = prop;


    const [data, setData] = useState(params.data)

    useEffect(() => setData(params.data), [params])

    return (
        <View className="flex-1 bg-white dark:bg-slate-950 !pt-6">
     
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
                        No Ongoing Order
                    </Text>
                </View>
            )}
        </View>
    );
}