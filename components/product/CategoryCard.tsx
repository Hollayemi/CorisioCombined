import React from "react";
import { Image, Text, View } from "react-native";

type prop = {
    icon?: string;
    label: string;
};

function CategoryCard({ label, icon }: prop) {
    return (
        <View className="my-2.5 relative max-w-[80px] min-w-[80px] min-h-[100px] mx-2 items-center">
            <View className="bg-gray-200/30 dark:bg-slate-800/50 rounded-full p-1">
                <Image
                    source={{ uri: icon }}
                    className="w-[60px] h-[60px] rounded-full object-cover"
                />
            </View>
            <Text className="text-gray-600 dark:text-gray-300 text-sm font-medium mt-2.5 text-center font-poppins500">
                {label}
            </Text>
        </View>
    );
}

export default CategoryCard;