import Button from "@/components/form/Button";
import HomeWrapper from "@/components/wrapper/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

export default function OrderConfirmation() {
    return (
        <HomeWrapper >
            <ScrollView className="flex-1 bg-white dark:bg-slate-950">
                <View className="p-5  bg-white flex-col justify- dark:bg-slate-950">
                    <View>
                        <Text className="leading-6 text-[17px]  dark:text-gray-300">
                            Thank you! Your order has been placed and it will be
                            delivered to you soon.
                        </Text>

                        <View className="flex-row justify-center">
                            <Image
                                source={require("@/assets/images/delivery.png")}
                                className="w-[300px] h-[300px] mt-[10%]"
                            />
                        </View>

                        <Text className="font-bold leading-6 text-center text-lg mt-2.5 dark:text-white">
                            For more details, track your delivery status under
                        </Text>

                        <View className="flex-row justify-center items-center">
                            <Text className="font-extrabold leading-6 text-lg mt-2.5 text-indigo-900 dark:text-indigo-400">
                                Profile
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#233974"
                                className="mt-2.5 dark:text-indigo-400"
                            />
                            <Text className="font-extrabold leading-6 text-lg mt-2.5 text-indigo-900 dark:text-indigo-400">
                                Order
                            </Text>
                        </View>

                        <Text
                            className="font-medium self-center bg-indigo-50 w-[150px] px-9 rounded-full border border-indigo-900 leading-[55px] text-lg mt-10 text-indigo-900 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-400"
                            onPress={() => router.push("/user/order")}
                        >
                            View Orders
                        </Text>
                    </View>

                    <View className="my-10 mx-4">
                        <Button
                            title="Continue Shopping"
                            onPress={() => router.push("/user/home")}
                        />
                    </View>
                </View>
            </ScrollView>
        </HomeWrapper>
    );
}