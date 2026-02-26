import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { formatDistance } from "../../utils/format";
import Rating from "../rating";

type prop = {
    image?: string;
    category?: boolean;
    prodName: string;
    price?: string | number;
    oldPrice?: string | number;
    rating?: number;
    branchId?: string;
    off?: string;
    type?: string;
    noMargin?: boolean;
    distance?: number;
    navigation?: any;
    images?: string[];
    prodPrice?: string | number;
    star?: number;
};

function ProductCard(props: prop) {
    const {
        off,
        prodPrice,
        prodName,
        type,
        branchId,
        star,
        images,
        noMargin,
        distance,
    } = props;

    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: "/user/home/product", params: { product: JSON.stringify({ branchId: branchId ?? "", ...props }) }
            })}
            activeOpacity={0.8}
        >
            <View className={`my- relative max-w-[120px] min-w-[100px] min-h-[100px] ${noMargin ? "mx-0" : "mx-2.5"} items-start`}>
                {type === "flash" ? (
                    <Text className="text-red-500 text-xs font-medium leading-[22px] bg-white dark:bg-slate-950 px-1 absolute top-0 right-0 rounded">
                        {off}%
                    </Text>
                ) : null}

                <Image
                    source={{
                        uri: images?.[0] || "https://res.cloudinary.com/xmart/image/upload/v1725629754/corisio/demo/22_un3lp1.png",
                    }}
                    className="min-w-[100px] min-h-[100px] w-full !max-w-full h-auto rounded-none object-cover"
                />

                <Text
                    className="text-gray-600 dark:text-gray-300 text-xs font-medium mt-2.5 text-left font-poppins500 truncate"
                    numberOfLines={1}
                >
                    {prodName}
                </Text>

                {prodPrice ? (
                    <View className="flex-row items-center">
                        <Text className="text-gray-900 dark:text-white text-sm font-bold font-poppins700">
                            ₦ {prodPrice}
                        </Text>
                        {type !== "flash" ? (
                            <Text className="text-gray-900 dark:text-gray-400 text-[9px] font-medium font-poppins500 line-through ml-1">
                                ₦ {prodPrice}
                            </Text>
                        ) : null}
                    </View>
                ) : null}

                {type !== "flash" || distance ? (
                    <View className="flex-row justify-between items-center h-4 ">
                        <Rating rate={star || 3} size={12} />
                        <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                            {formatDistance(distance?.toString())}
                        </Text>
                    </View>
                ) : null}
            </View>
        </TouchableOpacity >
    );
}

export default ProductCard;