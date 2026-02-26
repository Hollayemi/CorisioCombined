import OrderStatus from "@/app/user/order/data";
import OptionsMenu from "@/components/option-menu";
import Stepper from "@/components/order/stepper";
import { getCommonValuesInArrays } from "@/utils/arrayFunction";
import { formatName } from "@/utils/get-initials";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import Card from "../card";
import { useColorScheme } from "@/hooks/useColorScheme.web";


function CardRow({ payload, updatePayload, order, ...otherItems }: any) {
    const {
        _id: { store },
        fromBranch,
    } = otherItems;
    const deliveryType = payload.delivery[store];
    const getCommonDeliveryMethods = getCommonValuesInArrays(
        ...fromBranch.map((x: any) => x?.product?.delivery || ["pickup"])
    );
    // console.log(fromBranch)
    const picker = payload.picker[store];
    const [collapse, setCollapse] = useState(true);
    const isDark = useColorScheme() === "dark"
    return (
        <View className="bg-gray-100 mt-5 p-5 dark:bg-gray-900 rounded-lg">
            <View className="flex-row justify-between mb-2">
                <Text className="text-gray-900 capitalize font-semibold text-s dark:text-white">
                    {store}
                </Text>
                {deliveryType === "waybilling" && (
                    <Text className="text-gray-900 font-medium text-[10px] dark:text-gray-300">
                        Await Invoice
                    </Text>
                )}
            </View>

            <FlatList
                className="flex-1"
                data={fromBranch}
                renderItem={({ item }: any) => (
                    <Card {...item} checkout={true} />
                )}
                keyExtractor={(item: any) => item.id}
            />

            <View className="flex-row justify-between items-center py-3">
                <OptionsMenu
                    Component={() => (
                        <View className="p-2.5 rounded border border-gray-300 p- my-1 dark:border-gray-800 dark:bg-slate-900">
                            <Text className="text-gray-600 font-medium text-[16px] dark:text-gray-200">
                                <Text className="text-gray-900 font-semibold text-[16px]  mr-2.5 dark:text-white">
                                    Select Shipping Method:
                                </Text>{" "}
                                {deliveryType && formatName(deliveryType)}
                            </Text>
                            <Text className="text-gray-500 mt-1 text-sm dark:text-gray-200">
                                Delivery is between July 26 and August 1 (7 - 13 Days).
                            </Text>
                            <Entypo
                                name="chevron-down"
                                size={18}
                                className="mt-4 mr-4 absolute right-0"
                                color={isDark ?"#eee" : "#333"}
                            />
                        </View>
                    )}
                    others={{ label: "Delivery Method" }}
                    options={getCommonDeliveryMethods.map((x: any) => {
                        return { label: formatName(x), key: x };
                    })}
                    selectedValue={deliveryType}
                    setSelectedValue={(x: string) =>
                        updatePayload((prev: any) => {
                            return {
                                ...prev,
                                delivery: { ...prev.delivery, [store]: x },
                            };
                        })
                    }
                />

            </View>

            {order && collapse && (
                <View>
                    <FlatList
                        className="mt-5"
                        data={OrderStatus}
                        renderItem={({ item, index }) => (
                            <Stepper
                                {...item}
                                last={index === OrderStatus.length - 1}
                            />
                        )}
                    />

                    <Text
                        className="w-full text-center bg-gray-300 p-1 text-sm font-poppins600 text-gray-900 mt-2.5 dark:bg-slate-700 dark:text-white"
                        onPress={() => {
                            setCollapse(false);
                        }}
                    >
                        Collapse All
                    </Text>
                </View>
            )}
        </View>
    );
}

export default CardRow;