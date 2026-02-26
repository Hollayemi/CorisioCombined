import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useRouter } from "expo-router";
import { ArrowLeft, Heart } from "lucide-react-native"; // lucide icons
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function ProductViewHeader({
    addToCart,
    saveProduct,
    status,
}: {
    status: { inCart: boolean; isSaved: boolean }
        addToCart?: () => void;
        saveProduct?: () => void;
}) {
    const router = useRouter();
    const onBack = () => router.back();
    const color = useColorScheme()
    const isDark = color === "dark"
    return (
        <View className="flex-row items-center absolute top-0 left-0 w-full justify-between px-4 py-3 pt-14 z-50 bg-transparent">
            {/* Back Button */}
            <TouchableOpacity
                onPress={onBack}
                className="w-10 h-10 rounded-full text-black dark:text-gray-50 bg-gray-100 dark:bg-gray-950 items-center justify-center"
            >
                <ArrowLeft size={18} color={isDark ? "white" : "black"} />
            </TouchableOpacity>


            {/* Close Button */}
            <View className="flex-row items-center">
                <TouchableOpacity
                    onPress={addToCart}
                    className={`w-10 h-10  rounded-full bg-gray-100 dark:bg-gray-950 items-center justify-center
                        }`}
                >
                    <Heart size={17} color={status.isSaved ? "red" : isDark ? "white" : "black"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push("/user/cart")}
                    className={`w-10 h-10 ml-3  rounded-full bg-gray-100 dark:bg-gray-950 items-center justify-center
                        }`}
                >
                    <Image
                        source={!isDark ? require("@/assets/images/shopping-cart.png") : require("@/assets/images/shopping-cart-white.png")}
                        className="w-5 h-5 dark:tint-white"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
