import Button from "@/components/form/Button";
import ModalComponent from "@/components/modal";
import StoreWrapper from "@/components/wrapper/business";
import handleEmail, { handleCall, handleSMS } from "@/helper/contact";
import getStatus, { statusOptions } from "@/helper/orderStatus";
import {
    useUpdateOrderMutation
} from "@/redux/business/slices/orderSlice";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import {
    ActivityIndicator, Image, KeyboardAvoidingView, Modal, Platform, RefreshControl, ScrollView,
    Text, TextInput, TouchableOpacity,
    View
} from "react-native";

export default function OrderDetailScreen() {
    const { data }: any = useLocalSearchParams();
    const { isFetching, refetch, ...orderInfo } = JSON.parse(data || "{}")
    console.log({ isFetching, refetch })
    // const { data: orderData, isLoading: orderLoading, refetch: refetchOrder } =
    //     useFetchStoreOrdersQuery({ orderId });

    console.log({ orderInfo })
    // const { orders: orderInfo } = orderData?.data?.orders?.[0] || {};
    // console.log({ orderInfo })

    const { address, picker } = orderInfo || {}
    const [updateHandler, { isLoading: updating }] =
        useUpdateOrderMutation();

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showpickId, setShowPickId] = useState(false);
    const [pickId, setPickId] = useState("");
    const [comment, setComment] = useState("");
    const [newStatus, setNewStatus] = useState<any>({});

    const handleUpdate = async () => {
        await updateHandler({
            orderId: orderInfo?._id,
            comment,
            status: newStatus.label,
            pickerSlug: pickId,
        }).then(() => refetch())
    };

    const renderStatusModal = () => (
        <Modal
            visible={showStatusModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowStatusModal(false)}
        >
            <View className="flex-1 bg-black/50 justify-end ">
                <View
                    className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 "
                    style={{ paddingBottom: 50 }}
                >
                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
                    <Text className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-6">
                        Update Order Status
                    </Text>

                    {statusOptions.map((status) => (
                        <TouchableOpacity
                            key={status.label}
                            className="flex-row items-center py-4 border-b border-gray-200 dark:border-gray-700"
                            onPress={() => {
                                setNewStatus(status);
                                setShowStatusModal(false);
                                status.label === "Delivered" &&
                                    setShowPickId(true);
                            }}
                        >
                            <View
                                className={`w-4 h-4 rounded-full mr-4 ${status.bg} border-2 border-${status.color}-200`}
                            >
                                {newStatus === status.label && (
                                    <View
                                        className={`w-2 h-2 rounded-full bg-${status.color}-500 self-center mt-0.5`}
                                    />
                                )}
                            </View>
                            <Text
                                className={`font-medium ${newStatus === status.label
                                    ? status.text
                                    : "text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {status.label}
                            </Text>
                            {newStatus === status.label && (
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color="#10B981"
                                    className="ml-auto"
                                />
                            )}
                        </TouchableOpacity>
                    ))}

                    <Button className="!mt-4" size="small" title="Cancel" onPress={() => setShowStatusModal(false)} />
                </View>
            </View>
        </Modal>
    );

    const renderGetPickId = () => (
        <Modal
            visible={showpickId}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowPickId(false)}
        >
            <View className="flex-1 bg-black/50 justify-start ">
                <View
                    className="bg-white rounded-t-3xl p-6  rounded-b-3xl"
                    style={{ paddingVertical: 50 }}
                >
                    <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
                    <Text className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-6">
                        Confirm Picker by ID
                    </Text>
                    <TextInput
                        placeholder={"PIK-*********"}
                        placeholderTextColor="#9CA3AF"
                        value={pickId}
                        onChangeText={(e: any) => setPickId(e)}
                        className="text-gray-700 dark:text-gray-300 text-x px-3 h-12 py-0 border border-gray-300 rounded-md"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <TouchableOpacity
                        className="bg-blue-800 py-4 rounded-xl mt-6"
                        onPress={() => setShowPickId(false)}
                    >
                        <Text className="text-center text-white font-semibold">
                            Confirm
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <StoreWrapper
            headerTitle={
                <View className="w-4/6">
                    <Text className="font-bold text-lg text-gray-900 dark:text-gray-300">
                        {orderInfo?.orderId}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-300">
                        {orderInfo?.createdAt}
                    </Text>
                </View>
            }
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >

                <View className="flex-1">
                    <ScrollView
                        className="flex-1 pb-10"
                        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Status Card */}
                        <View className="mx-4 mt-4 bg-white dark:bg-gray-800  rounded-2xl p-5 shadow--sm border border-gray-200 dark:border-gray-700">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                                        Current Status
                                    </Text>
                                    {orderInfo.status && !updating ? (
                                        <View
                                            className={`px-4 py-2 rounded-full ${getStatus(orderInfo.status).bg
                                                } self-start`}
                                        >
                                            <Text
                                                className={`font-semibold ${getStatus(orderInfo.status)
                                                    .text
                                                    }`}
                                            >
                                                {orderInfo.status}
                                            </Text>
                                        </View>
                                    ) : (
                                        <ActivityIndicator />
                                    )}
                                </View>
                                <TouchableOpacity
                                    className="bg-blue-600 px-6 py-3 rounded-xl"
                                    onPress={() => setShowStatusModal(true)}
                                >
                                    <Text className="text-white font-semibold">
                                        Change Status
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Customer Info */}
                        <View className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow--sm border border-gray-200 dark:border-gray-700">
                            <Text className="font-bold text-lg text-gray-900 dark:text-gray-300 mb-4">
                                Customer
                            </Text>

                            <View className="flex-row items-center mb-4">
                                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                                    {!orderInfo.picture ? (
                                        <Text className="font-bold text-blue-600">
                                            {orderInfo.customerName
                                                ?.split(" ")
                                                ?.map((each: any) =>
                                                    each.substr(0, 1)
                                                )
                                                ?.splice(0, 2)
                                                ?.join("")}
                                        </Text>
                                    ) : (
                                        <Image
                                            source={{
                                                uri: orderInfo.picture,
                                            }}
                                            className="w-12 h-12 rounded-full mr-2"
                                            resizeMode="cover"
                                        />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-gray-900 dark:text-gray-300">
                                        {orderInfo.customerName}
                                    </Text>
                                    <Text className="text-sm text-gray-500 dark:text-gray-300">
                                        {orderInfo.items?.length} item(s)
                                    </Text>
                                </View>
                            </View>

                            <View className="space-y-3">
                                <TouchableOpacity
                                    className="flex-row items-center py-3 border-t border-gray-200 dark:border-gray-700"
                                    onPress={() =>
                                        handleEmail(orderInfo.email)
                                    }
                                >
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color="#6B7280"
                                    />
                                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                                        {orderInfo.email}
                                    </Text>
                                </TouchableOpacity>

                                {orderInfo.phone && (
                                    <View className="flex-row items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                                        <View className="flex-row items-center flex-1">
                                            <Ionicons
                                                name="call-outline"
                                                size={20}
                                                color="#6B7280"
                                            />
                                            <Text className="ml-3 text-gray-700 dark:text-gray-300">
                                                {orderInfo.phone}
                                            </Text>
                                        </View>
                                        <View className="flex-row space-x-2">
                                            <TouchableOpacity
                                                className="bg-green-100 p-2 rounded-full"
                                                onPress={() =>
                                                    handleCall(
                                                        orderInfo.phone
                                                    )
                                                }
                                            >
                                                <Ionicons
                                                    name="call"
                                                    size={16}
                                                    color="#059669"
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="bg-blue-100 p-2 rounded-full"
                                                onPress={() =>
                                                    handleSMS(
                                                        orderInfo.phone
                                                    )
                                                }
                                            >
                                                <Ionicons
                                                    name="chatbubble"
                                                    size={16}
                                                    color="#2563EB"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Pickup Info */}
                        <View className="mx-4 mt-4 bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-5 shadow--sm border border-gray-200">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="font-bold text-lg text-gray-900 dark:text-gray-300 capitalize">
                                    {orderInfo.deliveryMedium}
                                </Text>
                                <View className="bg-orange-100 px-3 py-1 rounded-full">
                                    <Text className="text-orange-700 text-xs font-medium">
                                        {!picker?.email
                                            ? "Self-Pickup"
                                            : picker
                                                ?.relationship}
                                    </Text>
                                </View>
                            </View>
                            {picker?.email ? (
                                <View className="flex-row items-center mb-4">
                                    <Image
                                        source={{
                                            uri: "https://corisio.com/images/more/2.png",
                                        }}
                                        className="w-12 h-12 rounded-full mr-2"
                                        resizeMode="cover"
                                    />
                                    <View className="flex-1">
                                        <Text className="font-semibold text-gray-900 dark:text-gray-300">
                                            {picker?.name}
                                        </Text>
                                        <Text className="text-sm text-gray-500 dark:text-gray-300">
                                            {picker.relationship}{" "}
                                            items
                                        </Text>
                                    </View>

                                    <View className="space-y-3">
                                        <TouchableOpacity
                                            className="flex-row items-center py-3 border-t border-gray-200 dark:border-gray-700"
                                            onPress={() =>
                                                handleEmail(
                                                    picker?.phone
                                                )
                                            }
                                        >
                                            <Ionicons
                                                name="mail-outline"
                                                size={20}
                                                color="#6B7280"
                                            />
                                            <Text className="ml-3 text-gray-700 dark:text-gray-300">
                                                {orderInfo.email}
                                            </Text>
                                        </TouchableOpacity>

                                        {orderInfo.phone && (
                                            <View className="flex-row items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                                                <View className="flex-row items-center flex-1">
                                                    <Ionicons
                                                        name="call-outline"
                                                        size={20}
                                                        color="#6B7280"
                                                    />
                                                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                                                        {orderInfo.phone}
                                                    </Text>
                                                </View>
                                                <View className="flex-row space-x-3 gap-4">
                                                    <TouchableOpacity
                                                        className="bg-green-100 p-2 rounded-full"
                                                        onPress={() =>
                                                            handleCall(
                                                                orderInfo
                                                                    .picker
                                                                    .phone
                                                            )
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="call"
                                                            size={16}
                                                            color="#059669"
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        className="bg-blue-100 p-2 rounded-full"
                                                        onPress={() =>
                                                            handleSMS(
                                                                orderInfo
                                                                    .picker
                                                                    .phone
                                                            )
                                                        }
                                                    >
                                                        <Ionicons
                                                            name="chatbubble"
                                                            size={16}
                                                            color="#2563EB"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <Text className="text-gray-600 dark:text-gray-300">
                                    Self-Pickup (Buyer is the picker)
                                </Text>
                            )}
                        </View>

                        {/* Delivery Address */}
                        {orderInfo.deliveryMedium !== "pickup" && (
                            <View className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow--sm border border-gray-200 dark:border-gray-700">
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="font-bold text-lg text-gray-900 dark:text-gray-300">
                                        Delivery Address
                                    </Text>
                                    <TouchableOpacity className="bg-blue-100 p-2 rounded-full">
                                        <Ionicons
                                            name="map-outline"
                                            size={16}
                                            color="#2563EB"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View className="flex-row">
                                    <Ionicons
                                        name="location-outline"
                                        size={20}
                                        color="#6B7280"
                                        className="mt-1"
                                    />
                                    <View className="ml-3 flex-1">
                                        <Text className="font-semibold text-gray-900 dark:text-gray-300 mb-1">
                                            {address?.address}
                                        </Text>
                                        <Text className="text-gray-600 dark:text-gray-300 leading-5">
                                            {address?.street || address?.address}
                                            {"\n"}
                                            {address?.city}
                                            {"\n"}
                                            {address?.state}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Order Items */}
                        <View className="mx-4 mt-4 bg-white dark:bg-gray-800 dark:border-gray-700  rounded-2xl p-5 shadow--sm border border-gray-200 ">
                            <Text className="font-bold text-lg text-gray-900 dark:text-gray-300 mb-4">
                                Order Items
                            </Text>

                            {
                                orderInfo.items?.map((item: any) => (
                                    <View
                                        key={item.id}
                                        className="flex-row items-center py-4 border-t border-gray-200 dark:border-gray-700"
                                    >
                                        <Image
                                            source={{
                                                uri: item?.image,
                                            }}
                                            className="w-16 h-16 rounded-xl mr-4"
                                            resizeMode="cover"
                                        />
                                        <View className="flex-1">
                                            <Text className="font-semibold text-gray-900 dark:text-gray-300 mb-1">
                                                {item.name}
                                            </Text>
                                            <Text className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                                                Qty: {item.quantity}
                                            </Text>
                                            <Text className="text-xs text-orange-600">
                                                {item.discount ||
                                                    "No discount Applied"}
                                            </Text>
                                        </View>
                                        <Text className="font-bold text-lg text-gray-900 dark:text-gray-300">
                                            {item.price}
                                        </Text>
                                    </View>
                                ))
                            }
                        </View>

                        {/* Order Summary */}
                        <View className="mx-4 mt-4 bg-white dark:bg-gray-800  rounded-2xl p-5 shadow--sm border border-gray-200 dark:border-gray-700">
                            <Text className="font-bold text-lg text-gray-900 dark:text-gray-300 mb-4">
                                Order Summary
                            </Text>

                            <View className="space-y-3">
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-gray-600 dark:text-gray-300">
                                        Subtotal
                                    </Text>
                                    <Text className="font-semibold text-gray-900 dark:text-gray-300">
                                        {orderInfo.totalPrice}
                                    </Text>
                                </View>
                                {orderInfo.discount && (
                                    <View className="flex-row justify-between py-2">
                                        <Text className="text-gray-600 dark:text-gray-300">
                                            Discount
                                        </Text>
                                        <Text className="font-semibold text-gray-900 dark:text-gray-300">
                                            ₦ {orderInfo.discount}
                                        </Text>
                                    </View>
                                )}
                                <View className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <View className="flex-row justify-between py-2">
                                        <Text className="font-bold text-lg text-gray-900 dark:text-gray-300">
                                            Total
                                        </Text>
                                        <Text className="font-bold text-xl text-green-600">
                                            ₦ {orderInfo.totalPrice}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>


                    </ScrollView>

                    {/* Bottom Action Bar */}

                    {renderStatusModal()}
                    {renderGetPickId()}
                </View>

                <ModalComponent
                    visible={!!newStatus.label}
                    onClose={() => setNewStatus('')}
                >
                    {/* Timeline & Comments */}
                    <View className=" ">
                        <Text className="font-bold text-lg text-gray-900 dark:text-gray-300 mb-4">
                            Timeline
                        </Text>

                        <View className="flex-row items-center mb-4">
                            <View
                                className={`w-4 h-4 rounded-full mr-4 ${newStatus.bg} border-2 border-${newStatus.color}-200`}
                            >
                                {newStatus.label && (
                                    <View
                                        className={`w-2 h-2 rounded-full bg-${newStatus.color}-500 self-center mt-0.5`}
                                    />
                                )}
                            </View>
                            <Text
                                className={`font-medium ${newStatus.label
                                    ? newStatus.text
                                    : "text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {newStatus.label}
                            </Text>
                        </View>

                        <TextInput
                            placeholder={" Leave a comment..."}
                            placeholderTextColor="#9CA3AF"
                            value={comment}
                            multiline
                            onChangeText={(e: any) => setComment(e)}
                            className="bg-gray-50 dark:bg-gray-600 dark:text-gray-200 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 mt-4 h-40"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <View className="bg-transparent mt-5">
                            <View className="flex-row space-x-3 gap-2">
                                <Button
                                    title="Download Receipt"
                                    variant="outline"
                                    className=" w-1/2"
                                    onPress={() => handleUpdate()}
                                />
                                <Button
                                    title="Update Order"
                                    isLoading={updating}
                                    className="flex-1 w-1/2"
                                    onPress={() => { handleUpdate(); setNewStatus(''); }}
                                />
                            </View>
                        </View>
                    </View>
                </ModalComponent>
            </KeyboardAvoidingView>
        </StoreWrapper>
    );
}
