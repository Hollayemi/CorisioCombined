import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native"; // lucide icons
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { HeaderDropdown } from "./dropdown";

export default function InScreenHeader({
    rightIcon,
    title,
    dropdownItems,
    rightIconFunction,
}: {
    rightIcon?: React.ReactNode;
    title?: string | React.ReactNode | undefined | null;
    dropdownItems?: Array<any>
    rightIconFunction?: (a: any) => void;
}) {
    const router = useRouter();
    const onBack = () => router.back();
    return (
        <View className="flex-row items-center z-50 justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b pt-14 border-gray-100 dark:border-gray-950">
            {/* Back Button */}
            <TouchableOpacity
                onPress={onBack}
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
            >
                <ArrowLeft size={20} color="gray" />
            </TouchableOpacity>

            {/* Title */}
            <Text className="text-2xl !w-fit font-semibold text-gray-950 dark:text-gray-100">
                {title}
            </Text>

            {/* Close Button */}
            {dropdownItems ? <HeaderDropdown
                items={dropdownItems}
                onSelect={(item: any) => item.action()}
            /> : <TouchableOpacity
                onPress={rightIconFunction}
                className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-950 items-center justify-center ${!rightIcon ? "invisible" : ""
                    }`}
            >
                {rightIcon && rightIcon}

            </TouchableOpacity>}
        </View>
    );
}
