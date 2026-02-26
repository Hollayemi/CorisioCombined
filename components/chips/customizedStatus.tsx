import React from "react";
import { useColorScheme, View, ViewStyle } from "react-native";
import Chip from ".";

// Status mapping object
type ChipColor = "warning" | "success" | "primary" | "error" | "info" | "secondary" | "disabled";
interface StatusObj {
    title: string;
    color: ChipColor;
    darkColor: string;
}
export const statusObj: StatusObj[] = [
    { title: "unpaid", color: "warning", darkColor: "yellow-600" },
    { title: "paid", color: "warning", darkColor: "yellow-600" },
    { title: "processing", color: "success", darkColor: "green-600" },
    { title: "out_for_delivery", color: "primary", darkColor: "blue-600" },
    { title: "pickable", color: "primary", darkColor: "blue-600" },
    { title: "completed", color: "success", darkColor: "green-600" },
    { title: "active", color: "success", darkColor: "green-600" },
    { title: "inactive", color: "error", darkColor: "red-600" },
    { title: "pending", color: "info", darkColor: "sky-600" },
    { title: "refunded", color: "secondary", darkColor: "purple-600" },
    { title: "cancelled", color: "error", darkColor: "red-600" },
    { title: "disabled", color: "disabled", darkColor: "gray-600" },
];

// CustomizeStatus component
interface CustomizeStatusProps {
    text: string;
    label?: string;
    size?: "small" | "medium" | "large";
    rounded?: number;
    sx?: ViewStyle;
    onPress?: () => void;
}

export const CustomizeStatus = ({
    text,
    label,
    size = "small",
    sx,
    onPress,
    rounded = 4,
}: CustomizeStatusProps) => {
    const isDark = useColorScheme() === 'dark'
    // Find the matching status from the statusObj
    const status = statusObj.find(
        (e) => e.title === text.replace(/ /g, "_").toLowerCase()
    );

    // Size-based padding
    const paddingVertical = {
        small: 2,
        medium: 2.5,
        large: 3.5,
    }[size];

    return (
        <View className="m-1.5 shrink-0">
            <Chip
                rounded={rounded}
                skin="light"
                sx={[
                    {
                        paddingVertical,
                    },
                    sx,
                ]}
                onPress={onPress}
            >
                {label || status?.title.replace(/_/g, " ").toUpperCase()}
            </Chip>
        </View>
    );
};

export default CustomizeStatus;