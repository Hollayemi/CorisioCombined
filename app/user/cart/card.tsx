import { AntDesign, Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
// import {
//     addCartHandler,
//     changeQuantity,
//     savedQuantity,
// } from "../../redux/user/state/slices/home/cart";
import Button from "@/components/form/Button";
import ModalComponent from "@/components/modal";
import { useAddToCartMutation, useChangeCartQuantityMutation } from "@/redux/user/slices/cartSlice";
import { useSaveCartItemMutation } from "@/redux/user/slices/saveItemSlice";
import { removeOrAddToArray } from "@/utils/arrayFunction";
import { reshapePrice } from "@/utils/format";
import { Heart } from "lucide-react-native";

interface props {
    checkout: boolean;
    data: any;
}

export default function Card({ checkout, selected, refetchCart, selectCart, ...data }: any) {
    const [addOrRemoveCart, { isLoading: addingOrRemoving }] = useAddToCartMutation()
    const [saveCartItem, { isLoading: isSaving }] = useSaveCartItemMutation()
    const [changeQuantity, { isLoading: qytChanging }] = useChangeCartQuantityMutation()
    const [toDelete, setToDelete] = useState<boolean>(false);
    const payload = {
        productId: data?.productId,
        store: data?.store,
        branch: data?.branch,
    };

    const isSelected = selected?.includes(data.productId);

    return (
        <View className={`flex-row items-center my-1 ${!checkout && "p-3"} bg-gray-100 dark:bg-gray-900 justify-between flex-1 rounded-lg`}>
            {checkout ? null : (
                <Checkbox
                    value={isSelected}
                    onValueChange={() =>
                        removeOrAddToArray(data.productId, selected, selectCart)
                    }
                    color={isSelected ? "#2A347E" : undefined}
                />
            )}

            <Image
                source={{
                    uri: data?.product.images?.[0] || "@/assets/images/placeholder.png",
                }}
                className={`${checkout ? 'w-[60px] h-[60px]' : 'w-[70px] h-[70px]'}  object-cover rounded`}
            />

            <View className="flex-[0.9]">
                <Text
                    className={` text-lg mb-1.5 font-medium text-gray-600 dark:text-gray-300`}
                    numberOfLines={1}
                >
                    {data.product.prodName}
                </Text>

                <View className={`flex ${checkout ? 'flex-col items-stretch' : 'flex-row items-center'} justify-between`}>
                    <View className={`flex ${checkout ? 'flex-row' : 'flex-col'} justify-between`}>
                        <Text className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {reshapePrice(data.price)}
                        </Text>

                        <View className="flex-row items-center">
                            <Text className="text-xs font-medium text-gray-800 dark:text-gray-300">
                                {/* Size: {size.toLocaleUpperCase()} {"  "}{" "} */}
                                Color:
                            </Text>
                            <View className="w-2.5 h-2.5 rounded-full bg-red-500 ml-1" />
                        </View>
                    </View>

                    {checkout ?
                        <Text className=" text-gray-600 dark:text-gray-300 mt-1">
                            Quantity: {data.quantity}
                        </Text> : (
                            <View className="flex-row items-center">
                                <AntDesign
                                    name="minus-circle"
                                    size={20}
                                    color={data.quantity > 1 ? "#2A347E" : "#A3AAAE"}
                                    onPress={() =>
                                        changeQuantity(
                                            {
                                                id: data._id,
                                                operator: "-",
                                            },

                                        ).then(() => refetchCart())
                                    }
                                />
                                <Text className="mx-4 text-gray-800 dark:text-gray-200">
                                    {qytChanging ? <ActivityIndicator size="small" /> : data.quantity}
                                </Text>
                                <AntDesign
                                    name="plus-circle"
                                    size={20}
                                    color="#2A347E"
                                    onPress={() =>
                                        changeQuantity(
                                            {
                                                id: data._id,
                                                operator: "+",
                                            },

                                        ).then(() => refetchCart())
                                    }
                                />
                            </View>
                        )}
                </View>

                {checkout ? null : (
                    <View className="flex-row justify-between items-center mt-1">
                        <View className="flex-row items-center">
                            <Text className="text-indigo-900 font-medium text-[14px] dark:text-indigo-300">
                                {data.store}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={10}
                                color="#2A347E"
                                className="ml-1"
                            />
                        </View>

                        {addingOrRemoving ? <ActivityIndicator /> : <Text
                            className="text-red-500 font-medium text-sm dark:text-red-400 "
                            onPress={() => setToDelete(true)}
                        >
                            <AntDesign
                                name="delete"
                                size={15}
                                color="#FF4141"
                            />{" "}
                            Delete
                        </Text>}
                    </View>
                )}
            </View>
            <ModalComponent
                visible={!!toDelete}
                onClose={() => setToDelete(false)}
            >
                <View>
                    <View className="mb-6">
                        <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                            Remove from Cart?
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-center">
                            Are you sure you want to remove "{data.product.prodName}: from your cart?
                        </Text>
                    </View>
                    <View>
                        <Button
                            title="Remove From Cart"
                            isLoading={addingOrRemoving}
                            onPress={() => addOrRemoveCart(payload).then(() => refetchCart())}
                        />
                        <Button
                            title="Move To Wishlist"
                            className="mt-4 mb-10"
                            isLoading={isSaving}
                            IconBefore={<Heart color="red" />}
                            variant="outline"
                            onPress={() => saveCartItem(payload).then(() => refetchCart())}
                        />
                    </View>
                </View>
            </ModalComponent>
        </View>
    );
}