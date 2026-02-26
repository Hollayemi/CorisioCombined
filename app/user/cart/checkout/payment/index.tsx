import Button from "@/components/form/Button";
import PaystackPaymentModal from "@/components/webview/pay";
import HomeWrapper from "@/components/wrapper/user";
import { useCreateOrderMutation } from "@/redux/user/slices/orderSlice";
import { reshapePrice } from "@/utils/format";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import OptionList from "./card";

export default function PaymentOption() {
    const { data }: any = useLocalSearchParams()
    const [authUrl, setAuthUrl] = useState('');
    const [selected, setSelectedValue] = useState<"paystack" | "crypto">("paystack")
    const [addNewOrder] = useCreateOrderMutation()
    const result = JSON.parse(data)


    return (
        <HomeWrapper headerTitle="Payment Method" active="cart">
            <ScrollView className="bg-white px-5 pt-5 dark:bg-slate-950">
                <View className="h-full flex-col justify-between">
                    <View>
                        <View className="flex-row px-0">
                            <OptionList
                                type="paystack"
                                brief="Pay with bank transfer or credit card"
                                selected={selected}
                                onPress={() => setSelectedValue("paystack")}
                            />
                            <OptionList
                                type="crypto"
                                brief="Pay with Cryptocurrency"
                                selected={selected}
                                onPress={() => setSelectedValue("crypto")}
                            />
                        </View>

                        <View className="mt-10">
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-lg font-bold dark:text-white">
                                    Total to pay
                                </Text>
                                <Text className="text-lg font-bold dark:text-white">
                                    {reshapePrice(result.paying)}
                                </Text>
                            </View>

                            <View className="bg-gray-100 p-2.5 mt-7.5 rounded-md dark:bg-slate-900">
                                <Text className="text-gray-900 leading-7 mb-1.5 dark:text-gray-300">
                                    We want to assure you that your payment security
                                    is our top priority. We've partnered with a
                                    verified and trusted payment vendor to ensure
                                    your transactions are handled securely. Rest
                                    assured, we do not store or have access to your
                                    sensitive card details.
                                </Text>
                                <Text className="text-gray-900 font-bold mt-2.5 leading-6 mb-1.5 dark:text-gray-300">
                                    Here's how it works:
                                </Text>
                                <Text className="text-gray-900 leading-6 mb-1.5 dark:text-gray-300">
                                    When you make a payment, you'll be directed to
                                    our secure payment gateway.
                                </Text>
                                <Text className="text-gray-900 leading-6 mb-1.5 dark:text-gray-300">
                                    Enter your card details and complete the
                                    transaction securely.
                                </Text>
                                <Text className="text-gray-900 leading-6 mb-1.5 dark:text-gray-300">
                                    Our trusted payment vendor handles the
                                    transaction, keeping your details safe.
                                </Text>
                                <Text className="text-gray-900 leading-6 mb-1.5 dark:text-gray-300">
                                    Once the payment is processed, you'll receive a
                                    confirmation from us.
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
            </ScrollView>
            <View className="mb-5 px-4">
                <Button
                    title={`Pay Now ${reshapePrice(result.paying)}`}
                    onPress={async () => await addNewOrder({ ...result.payload, paymentInfo: { method: selected } }).unwrap().then((result: any) => { console.log(result); setAuthUrl(result.data.paymentUrl) })}
                />
            </View>
            <PaystackPaymentModal
                visible={!!authUrl}
                authorizationUrl={authUrl}
                onSuccess={() => router.push('/user/cart/checkout/payment/confirmation')}
                onCancel={() => setAuthUrl('')}
                onError={() => setAuthUrl('')}
            />
        </HomeWrapper>
    );
}