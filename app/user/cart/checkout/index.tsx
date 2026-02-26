import Alert from "@/components/alert";
import Button from "@/components/form/Button";
import Method from "@/components/shipping/method";
import HomeWrapper from "@/components/wrapper/user";
import { useUserData } from "@/hooks/useData";
import { useGetCartGroupsQuery } from "@/redux/user/slices/cartSlice";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Balance from "./balance";
import CardRow from "./cardRow";

export default function Checkout() {
    const params = useLocalSearchParams()
    const {
        cartedProds,
        userInfo: { selectedAddress, selectedBilling },
        showAlert,
    } = useUserData() as any;
    const { data: carts, error, refetch } = useGetCartGroupsQuery()

    useFocusEffect(
        useCallback(() => {
            refetch(); // runs every time the screen is focused
        }, [])
    );

    const groupedCart = carts ? carts.data.result : [];
    const amounts = carts ? carts.data.total : [];

    const [payload, updatePayload] = useState({
        ids: cartedProds,
        delivery: {},
        picker: {},
        shippingAddress: selectedAddress || {},
    });

    return (
        <HomeWrapper headerTitle="Checkout" active="cart">
            <View className="flex-1 bg-white dark:bg-slate-950">
                <Alert
                    label="Before making an order, make sure the address is correct 
                            and matches your expected delivery location."
                    type="warning"
                />
                <FlatList
                    ListHeaderComponent={
                        <>
                            {selectedAddress?._id ? (
                                <Method
                                    title={selectedAddress?.state}
                                    desc={`${selectedAddress?.address}, ${selectedAddress?.city}, ${selectedAddress?.state}.`}
                                    view
                                />
                            ) : null}
                        </>
                    }
                    className="flex-1 p-3"
                    data={groupedCart}
                    renderItem={({ item }: any) => (
                        <CardRow
                            {...item}
                            updatePayload={updatePayload}
                            payload={payload}
                            checkout={true}
                        />
                    )}
                    ListFooterComponent={
                        <>
                            <Balance amounts={amounts} />
                        </>
                    }
                />

                <Text className="text-gray-900 text-sm bg-gray-100 border-t-4 border-t-white dark:!border-t-gray-800 px-10 py-5 leading-5 dark:bg-slate-900 dark:text-gray-300">
                    Upon clicking "Proceed to payment", I confirm that I have read
                    and acknowledged{" "}
                    <Text className="text-indigo-900 font-semibold dark:text-indigo-400">
                        all terms and conditions.
                    </Text>
                </Text>

                <View className="p-5 dark:bg-slate-900">
                    <Button
                        title="Proceed to Payment"
                        onPress={() => {
                            try {
                                const getPickers = Object.keys(payload.delivery);
                                const stores = groupedCart.map(
                                    (x: any) => x._id.store
                                );
                                const noDeliv = stores.filter(
                                    (item: string) => !getPickers.includes(item)
                                );
                                console.log(noDeliv)
                                if (!noDeliv.length) {
                                    router.push({
                                        pathname: "/user/cart/checkout/shipping", params: {
                                            data: JSON.stringify({
                                                payload,
                                                paying:
                                                    amounts?.discountedPrice ||
                                                    amounts?.originalPrice,
                                            })
                                        }
                                    });
                                } else {
                                    showAlert({
                                        title: "Omission",
                                        message: `No delivery option set for (${noDeliv.join(
                                            " and "
                                        )})`,
                                    });
                                }
                            } catch (error) { }
                        }}
                    />
                </View>
            </View>
        </HomeWrapper>
    );
}