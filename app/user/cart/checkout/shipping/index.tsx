import Button from "@/components/form/Button";
import { MethodForDelivery } from "@/components/shipping/method";
import HomeWrapper from "@/components/wrapper/user";
import { useGetAddressesQuery } from "@/redux/user/slices/addressSlice";
import { useGetPickupAgentsQuery } from "@/redux/user/slices/pickupSlice";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, View } from "react-native";

type ShippingOption = {
    title: string;
    desc: string;
    coming?: boolean;
};

const Data: ShippingOption[] = [
    {
        title: "Pick-up",
        desc: "If you have anyone or you are close to the location and can pick up the order.",
    },
    {
        title: "Way-Billing",
        desc: "The vendor waybills the order to your desired or indicated location and you pay the waybill fee.",
    },
    {
        title: "Courier Service",
        desc: "The goods are being delivered by a courier service under the company's service.",
        coming: true,
    },
];

function ShippingMethod() {
    const { data: addrs }: any = useGetAddressesQuery();
    const { data: agents } = useGetPickupAgentsQuery()
    const pickers = agents?.data || [];
    const addresses = addrs?.data || [];
    const { data }: any = useLocalSearchParams()
    const result = JSON.parse(data)
    const { payload, paying } = result
    const [newPayload, updatePayload] = useState(payload);
    console.log({ addrs })

    return (
        <HomeWrapper headerTitle="Shipping Method" active="cart">
            <View className="p-5 flex-1 flex-col justify-between">
                <FlatList
                    data={Object.keys(payload.delivery)}
                    renderItem={({ item, index }: any) => (
                        <View key={index}>
                            <MethodForDelivery
                                store={item}
                                type={newPayload.delivery[item]}
                                selectedValue={newPayload.picker[item]}
                                addresses={addresses}
                                pickers={pickers}
                                updatePayload={updatePayload}
                            />
                        </View>
                    )}
                    keyExtractor={(item) => item}
                />

                <View className="">
                    <Button
                        title="Next"
                        onPress={() =>
                            router.push({
                                pathname: "/user/cart/checkout/payment", params: {
                                    data: JSON.stringify({ payload: newPayload, paying }),
                                }
                            })
                        }
                    />
                </View>
            </View>

        </HomeWrapper>
    );
}

export default ShippingMethod;