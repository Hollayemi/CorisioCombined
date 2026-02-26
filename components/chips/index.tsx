import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface ChipProps {
    sx?: any;
    skin?: "light" | "dark" | "outlined";
    color?: "primary" | "secondary" | "success" | "error" | "warning" | "info" | "disabled";
    rounded?: "sm" | "md" | "lg" | "full" | number;
    children?: React.ReactNode;
    onPress?: () => void;
    darkColor?: string; // Tailwind color for dark mode
}

const Chip = ({
    sx = {},
    skin = "dark",
    color = "primary",
    rounded = "md",
    children,
    onPress,
    darkColor,
    ...rest
}: ChipProps) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    // Color mappings for both light and dark modes
    const colorMap = {
        primary: {
            light: "bg-[#2A347E]",
            dark: darkColor || "bg-gray-400",
            text: "text-white",
            lightText: "text-white"
        },
        secondary: {
            light: "bg-yellow-500",
            dark: darkColor || "bg-yellow-600",
            text: "text-white",
            lightText: "text-yellow-900"
        },
        success: {
            light: "bg-green-100",
            dark: darkColor || "bg-green-800",
            text: "text-green-800",
            lightText: "text-green-900"
        },
        error: {
            light: "bg-red-100",
            dark: darkColor || "bg-red-800",
            text: "text-red-800",
            lightText: "text-red-900"
        },
        warning: {
            light: "bg-yellow-100",
            dark: darkColor || "bg-yellow-800",
            text: "text-yellow-800",
            lightText: "text-yellow-900"
        },
        info: {
            light: "bg-blue-100",
            dark: darkColor || "bg-blue-800",
            text: "text-blue-800",
            lightText: "text-blue-900"
        },
        disabled: {
            light: "bg-gray-200",
            dark: darkColor || "bg-gray-700",
            text: "text-gray-500",
            lightText: "text-gray-700"
        }
    };

    // Get rounded class
    const getRoundedClass = () => {
        if (typeof rounded === 'number') return `rounded-[${rounded}px]`;
        return {
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full"
        }[rounded] || "rounded-md";
    };

    // Determine styles based on skin and mode
    const getStyles = () => {
        const baseStyles = [
            "flex-row items-center py-1.5 px-3 !rounded-full",
            getRoundedClass(),
            sx
        ].join(' ');

        if (skin === "outlined") {
            const borderColor = isDarkMode
                ? colorMap[color].dark.replace('bg-', 'border-')
                : colorMap[color].light.replace('bg-', 'border-');
            return [
                baseStyles,
                `border ${borderColor}`,
                isDarkMode ? colorMap[color].text : colorMap[color].lightText,
                "bg-transparent"
            ].join(' ');
        }

        if (skin === "light") {
            return [
                baseStyles,
                isDarkMode ? colorMap[color].dark : colorMap[color].light,
                isDarkMode ? colorMap[color].text : colorMap[color].lightText
            ].join(' ');
        }

        // Default dark skin
        return [
            baseStyles,
            isDarkMode ? colorMap[color].dark : colorMap[color].light,
            colorMap[color].text
        ].join(' ');
    };

    const chipStyles = getStyles();
    const textStyles = "text-sm font-medium";

    if (onPress) {
        return (
            <TouchableOpacity className={chipStyles} onPress={onPress} {...rest}>
                <Text className={textStyles}> {children} </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View className={chipStyles} {...rest}>
            <Text className={textStyles}> {children} </Text>
        </View>
    );
};

export default Chip;