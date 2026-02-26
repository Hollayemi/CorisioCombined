import { useAddToCartMutation } from "@/redux/user/slices/cartSlice";
import { useSaveItemMutation } from "@/redux/user/slices/saveItemSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useUserData } from "../../hooks/useData";
import { formatDistance } from "../../utils/format";
import Button from "../form/Button";
import Rating from "../rating";

type prop = {
    image?: string;
    category?: boolean;
    prodName: string;
    price?: string | number;
    oldPrice?: string | number;
    rating?: number;
    off?: string;
    type?: string;
    noMargin?: boolean;
    product?: any;
};

function BigCard(props: object) {
    const [addCartHandler, { isLoading }] = useAddToCartMutation()

    const [saveProduct, { isLoading: saving }] = useSaveItemMutation()
    const { prodPrice, prodName, type, star, images, distance, navigation, ...product } = props as any;
    const { cartedProds, savedProds, refetchCart, refetchSavedItems } = useUserData() as any;

    const payload = {
        productId: product?._id,
        store: product?.store,
        branch: product?.branch,
    };

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "/user/home/product", params: { product: JSON.stringify(props) }
            })}
            className="w-[48%] p-2 border border-gray-200 dark:border-gray-700 m-0.5 rounded-xl my-2.5 relative"
        >
            <View className="my-0 relative min-h-[100px] items-start">
                <Image
                    source={{
                        uri: images?.[0] || "https://res.cloudinary.com/xmart/image/upload/v1725629754/corisio/demo/22_un3lp1.png",
                    }}
                    className="min-w-[100px] min-h-[100px] object-contain rounded-lg w-full h-40"
                />

                <Text
                    className="text-gray-600 dark:text-gray-300 text-[15px] font-['Poppins_500Medium'] mt-2.5 text-left"
                    numberOfLines={1}
                >
                    {prodName}
                </Text>

                {prodPrice && (
                    <View className="flex-row items-center my-1">
                        <Text className="text-gray-900 dark:text-white text-sm font-['Poppins_700Bold']">
                            # {prodPrice}
                        </Text>
                        {type !== "flash" && (
                            <Text className="text-gray-900 dark:text-gray-300 text-[9px] font-['Poppins_500Medium'] line-through ml-1">
                                # {prodPrice}
                            </Text>
                        )}
                    </View>
                )}

                {type !== "flash" && (
                    <View className="flex-row justify-between items-center w-full">
                        <Rating rate={star || 0} size={13} />
                        <Text className="text-sm ml-2.5 text-gray-600 dark:text-gray-400">
                            {formatDistance(distance)}
                        </Text>
                    </View>
                )}

                <Button
                    size="small"
                    title={cartedProds.includes(product?._id) ? "Remove from cart" : "Add to cart"}
                    onPress={() => addCartHandler(payload).then(() => refetchCart())}
                    className="!h-7 mt-5 w-full rounded-md"
                // className={`rounded-[5px] !p-1 !h-8 mt-4 ${cartedProds.includes(product?._id)
                //     ? 'bg-[#CA9010]'
                //     : 'bg-[#fcb415]'
                //     }`}
                />
            </View>

            <TouchableOpacity
                className="mt-3.5 absolute -top-2.5 right-1 bg-white dark:bg-gray-800 rounded-full p-0.5"
                onPress={() => saveProduct(payload).then(() => refetchSavedItems())}
            >
                <MaterialIcons
                    name="favorite-outline"
                    size={20}
                    color={savedProds.includes(product?._id) ? "red" : "black"}
                />
            </TouchableOpacity>
        </TouchableOpacity >
    );
}

export default BigCard;