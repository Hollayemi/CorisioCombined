import { ReactElement } from "react";
import { Pressable, type PressableProps, Text } from "react-native";

export type Props = PressableProps & {
    theme?: "light" | "dark";
    icon?: ReactElement;
    label?: string;
    lightColor?: string;
    darkColor?: string;
};

export function ThemedPressable({
    style,
    lightColor,
    darkColor,
    label,
    theme = "light",
    icon,
    disabled,
    className,
    ...otherProps
}: Props) {
    return (
        <Pressable
            {...otherProps}
            className={`flex-row items-center bg-[#2A347E] dark:bg-white justify-center !h-16  ${className} !rounded-full ${
                disabled && "!bg-gray-400"
            }`}
        >
            {icon}
            <Text className="!text-2xl !font-bold text-white dark:text-[#2A347E]">
                {label}
            </Text>
        </Pressable>
    );
}
