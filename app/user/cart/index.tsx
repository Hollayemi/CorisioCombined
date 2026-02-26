import Alert from "@/components/alert";
import Button from "@/components/form/Button";
import Loader from "@/components/loader";
import HomeWrapper from "@/components/wrapper/user";
import { useUserData } from "@/hooks/useData";
import { reshapePrice } from "@/utils/format";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import Card from "./card";
import Voucher from "./voucher";


type prop = {
    navigation: any;
};

export default function Cart() {
    const { data: addrs }: any = {}
    const addresses = addrs?.data || [];
    const addr = addresses[0] || {};
    const { cartedProds, cartData, cartIsLoading, refetchCart } = useUserData() as any;
    const [selected, selectCart] = useState([]);
    return false ? (
        <View className="h-full justify-center items-center dark:bg-slate-950">
            <Loader />
        </View>
    ) : (
        <HomeWrapper headerTitle={`My Cart(${cartedProds.length})`}>
            <View className="flex-col justify-between flex-1 pt-2  px-2.5 bg-white dark:bg-slate-950">
                <Alert
                    label="You have a discount voucher for this products"
                    type="action"
                    onPress={() => { }}
                />
                <View className="flex-row justify-between py-4 mx-3 border-b border-gray-300 dark:border-gray-700">
                    <View className="flex-row items-center">
                        <Checkbox
                            value={selected.length === cartedProds.length && cartedProds.length > 0}
                            onValueChange={(e) => {
                                const checked = e;
                                selectCart(() => (checked ? cartedProds : []));
                            }}
                            color={selected.length === cartedProds.length ? "#2A347E" : undefined}
                        />
                        <Text className="font-medium text-sm text-gray-600 ml-3.5 dark:text-gray-300">
                            Select Items
                        </Text>
                    </View>
                    <Text className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        {reshapePrice(cartData?.discountAmount || 0)} ({cartedProds.length})
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={cartIsLoading} onRefresh={refetchCart} />
                    }
                    className="flex-1"
                >
                    <View>
                        {cartData?.products?.length > 0 ? cartData?.products?.map((item: any, index: any) => (
                            <View className="h-32" key={item.id || index}>
                                <Card
                                    selected={selected}
                                    selectCart={selectCart}
                                    refetchCart={refetchCart}
                                    {...item}
                                />
                            </View>
                        )) : (
                            <View>
                                <Text>No Item found</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View>
                    <View className="mx-0 border-t border-b border-gray-300 dark:border-gray-700 mt-2.5">
                        <Voucher />
                    </View>

                    <View className="p-5 flex-row justify-between items-center hidden">
                        <View className="flex-[0.7]">
                            <Text className="text-gray-800 text-base font-medium mb-1 dark:text-gray-200">
                                Shipping Address
                            </Text>
                            <Text className="text-gray-500 text-sm leading-5 dark:text-gray-400">
                                {`${addr?.address}, ${addr?.state}, ${addr?.city} (${addr?.postal_code})`}
                            </Text>
                        </View>
                        <Text className="py-2.5 px-7 border border-indigo-900 text-indigo-900 text-xs rounded-xl dark:text-indigo-300 dark:border-indigo-300">
                            Change
                        </Text>
                    </View>

                    <View className="p-5 flex-row justify-between">
                        <View className="flex-[0.7] w-36">
                            <Text className="text-gray-800 text-sm font-medium dark:text-gray-200">
                                Total Price
                            </Text>
                            <Text className="text-gray-800 text-lg font-bold dark:text-gray-100">
                                {reshapePrice(cartData?.discountAmount)}
                            </Text>
                        </View>
                        <Button
                            title={`Checkout (${selected.length || cartedProds.length})`}
                            onPress={() => {
                                try {
                                    router.push({ pathname: "/user/cart/checkout", params: { selected } });
                                } catch (error) { }
                            }}
                            disabled={cartedProds?.length < 1}
                        />
                    </View>
                </View>
            </View>
        </HomeWrapper>
    );
}