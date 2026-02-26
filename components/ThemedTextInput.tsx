// components/ThemedTextInput.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    className?: string;
};

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    className,
    ...props
}: ThemedTextInputProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const borderColor = useThemeColor(
        { light: "#E2E8F0", dark: "#4A5568" },
        "background"
    );
    const placeholderColor = useThemeColor(
        { light: "#94A3B8", dark: "#CBD5E0" },
        "background"
    );

    return (
        <TextInput
            style={[styles.input, { color, borderColor }, style]}
            placeholderTextColor={placeholderColor}
            className={className}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 15,
        fontSize: 16,
        width: "100%",
    },
});
