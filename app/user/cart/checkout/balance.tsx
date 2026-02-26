import React from "react";
import Voucher from "../voucher";
import { Text, View } from "react-native";
import { reshapePrice } from "@/utils/format";


export default function Balance({ amounts, noVoucher }: any) {
    return (
        <View className="p-3">
            {!noVoucher && <Voucher />}
            <Text className="text-gray-900 text-[17px] font-semibold dark:text-white">
                Summary
            </Text>

            {amounts?.originalPrice && (
                <View className="flex-row justify-between py-1 pt-3.5">
                    <Text className="text-gray-600 text-[15px] font-medium dark:text-gray-400">
                        Total items cost
                    </Text>
                    <Text className="text-gray-600 text-[15px] font-semibold dark:text-gray-400">
                        {reshapePrice(amounts?.originalPrice)}
                    </Text>
                </View>
            )}

            {amounts?.discountedPrice && (
                <View className="flex-row justify-between py-1">
                    <Text className="text-gray-600 text-[15px] font-medium dark:text-gray-400">
                        Saved
                    </Text>
                    <Text className="text-red-500 text-[15px] font-semibold dark:text-red-400">
                        - {reshapePrice(amounts?.discountedPrice)}
                    </Text>
                </View>
            )}

            <View className="flex-row justify-between pt-3.5 mb-10">
                <Text className="text-gray-900 text-[17px] font-semibold dark:text-white">
                    Total
                </Text>
                <Text className="text-gray-600 text-[17px] font-semibold dark:text-gray-300">
                    {reshapePrice(
                        amounts?.discountedPrice || amounts?.originalPrice
                    )}
                </Text>
            </View>
        </View>
    );
}