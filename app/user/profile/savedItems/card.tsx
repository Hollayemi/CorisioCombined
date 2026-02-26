import Rating from "@/components/rating";
import { useSaveItemMutation } from "@/redux/user/slices/saveItemSlice";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

export default function ItemsCard({ product, refetch, ...others }: any) {

    const [saveProduct, { isLoading }] = useSaveItemMutation()

    function calculateDiscountedPrice(originalPrice: any, discountPercentage: any) {
        const discountAmount = (originalPrice * discountPercentage) / 100;
        return originalPrice - discountAmount;
    }


    const payload = {
        productId: product._id,
        store: others.store,
        branch: others.branch,
    };

    return (
        <View className="flex-row justify-between my-4">
            <Image
                source={{ uri: product.images[0] }}
                className="object-cover rounded w-[85px] h-[85px]"
            />

            <View className="flex-1 mx-3">
                <Text className="text-neutral-600 dark:text-neutral-300 text-base font-medium font-['Poppins_500Medium']">
                    {product.prodName.length > 19
                        ? `${product.prodName.substring(0, 25)}...`
                        : product.prodName}
                </Text>

                <View className="flex-row items-center">
                    <Text className="text-slate-900 dark:text-white text-lg font-bold font-['Poppins_700Bold']">
                        {others.discount
                            ? calculateDiscountedPrice(
                                product.prodPrice,
                                others.discount
                            )
                            : product.prodPrice}
                    </Text>

                    {others.discount && (
                        <Text className="text-slate-900 dark:text-neutral-300 text-xs font-semibold font-['Poppins_600SemiBold'] line-through ml-2">
                            {product.prodPrice}
                        </Text>
                    )}

                    {others.discount && (
                        <Text className="text-red-500 text-xs font-semibold font-['Poppins_600SemiBold'] ml-2">
                            {others.discount}%
                        </Text>
                    )}
                </View>

                <Rating rate={others.star || 0} size={16} />
            </View>

            <View className="flex-col items-center">
                <Text
                    className="bg-indigo-900 dark:bg-indigo-800 py-2 px-6 rounded-full mb-5 text-white text-xs font-medium font-['Poppins_500Medium']"
                >
                    Buy Now
                </Text>

                {others.recentlyViewed ? <Text
                    className="dark:!text-gray-50 text-[16px] font-medium font-['Poppins_500Medium']"
                    onPress={() => saveProduct(payload).then(() => refetch())}
                >
                    <AntDesign name="heart" size={13} className="mr-3" /> Save
                </Text> : <Text
                    className="text-red-500 text-xs font-medium font-['Poppins_500Medium']"
                    onPress={() => saveProduct(payload).then(() => refetch())}
                >
                    <AntDesign name="delete" size={13} /> Remove
                </Text>}
            </View>
        </View>
    );
}