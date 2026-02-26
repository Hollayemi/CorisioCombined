import NoRecord from "@/components/noRecord";
import StoreWrapper from "@/components/wrapper/business";
import { useFetchStoreOrdersQuery } from "@/redux/business/slices/orderSlice";
import React, { useState } from "react";
import {
    RefreshControl, ScrollView, Text,
    TouchableOpacity,
    View
} from "react-native";
import OrderListComponent from "./component";



export default function SoldProducts() {
    const [status, seStatus] = useState<TabKey>('Paid');
    const { data, isLoading, refetch } = useFetchStoreOrdersQuery({ status: status === "Processing" ? "Processing,Out for delivery, Pickable" : status });

    const { orders = [] } = data?.data || {};
    const tabs = ['Paid', 'Processing', 'Cancelled', 'Completed'] as const;
    type TabKey = typeof tabs[number];

    return (
        <StoreWrapper headerTitle="Orders" >
            {/* Time Filter Tabs */}
            <View className="px-2 shadow-2xl bg-white dark:bg-gray-900">
                <View className="flex-row bg-gray-600 dark:bg-gray-700 rounded-full p-3 mt-5">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => seStatus(tab)}
                            className={`flex-1 py-3 rounded-full ${status === tab
                                ? 'bg-yellow-500'
                                : 'bg-transparent'
                                }`}
                        >
                            <Text className={`text-center font-medium ${status === tab
                                ? 'text-black'
                                : 'text-gray-400'
                                }`}>
                                {tab === "Paid" ? "Waiting" : tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Order List */}
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4">
                <Text className="text-lg font-semibold px-4 mb-4 text-black dark:text-white">Recent Orders</Text>
                <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />} className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                    {orders.length > 0 ? (
                        orders.map((order: any, i: number) => (
                            <OrderListComponent key={i} order={order} isFetching={isLoading} refetch={refetch} />
                        ))
                    ) : (
                        <NoRecord />
                    )}
                </ScrollView>
            </View>
        </StoreWrapper>
    );
}
