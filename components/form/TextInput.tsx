import React, { JSX } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

type prop = {
    placeholder: string;
    label: string;
    password?: boolean;
    others?: TextInputProps;
    Icon?: JSX.Element;
    value: string;
    onChangeText: any;
    onBlur: any;
};

export default function Input({
    placeholder,
    password,
    Icon,
    value,
    others = {},
    onChangeText,
    label,
    onBlur,
}: prop) {
    return (
        <View className="flex-row items-center justify-between rounded-md bg-[#e1e4f1]  dark:bg-slate-800 px-[4%] pt-2 pb-2 my-2">
            <View className="flex-[0.5]">
                <Text className="text-sm text-[#474545] dark:text-[#eee] ">{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    placeholder={placeholder}
                    className="bg- text-[#242222] py-0 !w-80 dark:text-gray-100   h-8 text-[15px] font-medium"
                    secureTextEntry={password ? true : false}
                    {...others}
                />
            </View>
            {Icon}
        </View>
    );
}


export function Input2({
    placeholder,
    password,
    Icon,
    others = {},
    value,
    onChangeText,
    label,
    onBlur,
}: prop) {
    return (
        <View className="flex-row items-center justify-between rounded my-1 mt-8 w-full">
            <View className="flex-1">
                <Text className="text-[16px] text-gray-500 dark:text-gray-400 mb-2.5">{label}</Text>
                <View className="relative">
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className="bg-transparent border border-[#C5C5C5] dark:!border-gray-600 rounded-lg px-4 pb-2 h-12 text-[#424242] dark:text-gray-200 text-lg font-medium"
                        secureTextEntry={password ? true : false}
                        {...others}
                    />
                    {Icon && (
                        <View className="absolute right-3 top-4">
                            {Icon}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}