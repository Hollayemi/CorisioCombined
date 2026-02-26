import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PopularAdsProps {
    store: string;
    title: string;
    brief: string;
    image: any;
    url: string;
}

const PopularAd: React.FC<PopularAdsProps> = ({
    store,
    title,
    brief,
    image,
    url,
}) => {

    const truncateText = (str: string, num: number) => {
        return str?.length > num ? str.substring(0, num) + "..." : str;
    };

    return (
        <View className="w-80 h-40 bg-yellow-50 dark:bg-slate-800 rounded-2xl px-5 py-2.5 mx-1 flex-row">
            <View className="flex-1 pr-2 relative">
                <Text className="text-xs font-bold dark:text-gray-300">
                    {store}
                </Text>
                <Text className="text-lg font-extrabold mt-3 dark:text-white">
                    {title}
                </Text>
                <Text className="text-red-500 dark:text-red-400 text-xs mt-2">
                    {truncateText(brief, 50)}
                </Text>

                <TouchableOpacity
                    className="absolute bottom-0 left-0"
                    onPress={() => { }}
                    activeOpacity={0.7}
                >
                    <Text className="text-xs underline dark:text-gray-300">
                        Discover Now
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="flex-1">
                <Image
                    source={image} //{{ uri: image }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

export default PopularAd;