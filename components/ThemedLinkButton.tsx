import { Link, type LinkProps } from "expo-router";
import { ReactElement } from "react";
import { Pressable, Text } from "react-native";

export type ThemedLinkProps = LinkProps & {
    theme?: "light" | "dark";
    icon?: ReactElement;
    lightColor?: string;
    darkColor?: string;
};

export function ThemedLinkButton({
    style,
    lightColor,
    darkColor,
    children,
    theme = "light",
    icon,
    className,
    ...otherProps
}: ThemedLinkProps) {
    return (
        <Link
            asChild
            {...otherProps}
            className={`flex items-center bg-[#2A347E] dark:bg-white justify-center h-16  ${className} !rounded-full `}
        >
            <Pressable className=" flex flex-row">
                {icon}
                <Text className="!text-2xl !font-bold text-white dark:text-[#2A347E]">
                    {children}
                </Text>
            </Pressable>
        </Link>
    );
}
