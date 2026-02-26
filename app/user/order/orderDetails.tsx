import Button from "@/components/form/Button";
import { orderStatusMessages } from "@/components/order/data";
import { Status } from "@/components/order/orderCard";
import { OrderStages } from "@/components/order/stages";
import HomeWrapper from "@/components/wrapper/user";
import { formatName } from "@/utils/get-initials";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import Card from "../cart/card";
import Balance from "../cart/checkout/balance";
import AddressCard from "../profile/address/card";
import PickerCard from "../profile/picker/card";


export default function OrderDetail() {
    const { data }: any = useLocalSearchParams()
    const result = JSON.parse(data || "{}")
    console.log(result.item)
    return (
        <HomeWrapper active="profile" headerTitle="Order Details">
            <ScrollView className="flex-1 px-[3%]">
                <Text className="text-2xl text-black dark:text-white font-semibold mt-4 mb-6">
                    Order No: {result.orderSlug}
                </Text>
                {/* <Text className="text-lg mt-5 mb-6 text-neutral-600 dark:text-neutral-300 font-semibold">
                    Order Details
                </Text> */}

                <View className="bg-neutral-100 rounded-md dark:bg-slate-900 p-2 px-4 mb-5">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-base text-black dark:text-white font-semibold">
                            {result.store}
                        </Text>
                        <Status status={result.currStatus} />
                    </View>

                    <FlatList
                        data={result.items}
                        renderItem={({ item }: any) => (
                            <Card
                                {...{ product: { ...item, prodName: item.name, images: [item.image] } }}
                                price={item.price}
                                checkout={true}
                                order
                            />
                        )}
                    />

                    <View>
                        <Text className="text-neutral-700 dark:text-neutral-300 font-medium mt-6">
                            <Text className="text-black dark:text-white font-semibold text-base mt-4.5 mr-2.5">
                                Shipping Method:
                            </Text>{" "}
                            {result.deliveryMedium && formatName(result.deliveryMedium)}
                        </Text>
                        <Text className="text-neutral-600 mt-1 dark:text-neutral-400 mb-10 text-base pr-[30px] leading-5 mt-1.25">
                            {
                                orderStatusMessages[
                                    result.currStatus
                                        .replaceAll(" ", "_")
                                        .toLowerCase()
                                ].note
                            }
                        </Text>
                        {/* <Divider className="my-5" /> */}
                        <Text className="text-lg mb-2.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                            Tracking details
                        </Text>
                        <OrderStages
                            statusHistory={result.statusHistory}
                            currStatus={result.currStatus}
                            details
                        />
                    </View>
                </View>

                <View className="mb-12">
                    <Text className="text-lg mt-5 mb-2.5 text-neutral-600 dark:text-neutral-300 font-semibold">
                        {result.deliveryMedium === "pickup"
                            ? "Picker"
                            : "Shipping Address"}
                    </Text>
                    {result.deliveryMedium === "pickup" ? (
                        <PickerCard item={result?.picker} />
                    ) : (
                        <AddressCard item={result?.shippingAddress} />
                    )}
                </View>

                <Balance amounts={{ originalPrice: result.totalAmount }} noVoucher />

                {result.currStatus === "Completed" && (
                    <View className="my-5">
                        <Button
                            title="Review Products"
                            onPress={() => router.push("/user/order/review")}
                        />
                    </View>
                )}
            </ScrollView>
        </HomeWrapper>
    );

}