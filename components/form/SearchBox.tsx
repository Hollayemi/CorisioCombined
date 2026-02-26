import React from "react";
import type { TextInputProps } from "react-native";
import { Image, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

type SearchBoxProps = {
    placeholder: string;
    value: string;
    onChange: any;
    mystyles?: string;
    onWhite?: boolean;
    onSubmit?: (e:any) => void
} & TextInputProps;

export function SearchBox({ placeholder, value, onChange, onWhite = true, mystyles, ...props }: SearchBoxProps) {
    const isDark = useColorScheme() === 'dark'
    return (
        <View className={`rounded-full p-2 py-1.5 h-12 ${onWhite ? "bg-gray-100" : "bg-white"} mt-2 dark:bg-slate-900 flex-row items-center ${mystyles}`}>
            <View className="flex-row items-center gap-5 ml-2.5">
                <Image
                    source={isDark ? require("@/assets/images/search-light.png") :require("@/assets/images/search.png")}
                    className={isDark ? "w-7 h-7" : "w-6 h-6"}
                />
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#848080"
                    value={value}
                    onChangeText={onChange}
                    selectionColor="#848080"
                    className="font-medium text-gray-500 dark:text-gray-100 text-[16px] flex-[0.98] font-poppins500"
                    {...props}
                />
            </View>
        </View>
    );
}

export function SearchBox2({ placeholder, value, onChange, onSubmit, mystyles, ...props }: SearchBoxProps) {
    const isDark = useColorScheme() === 'dark'
    return (
        <View className={`rounded-full p-3 bg-white dark:bg-slate-800 flex-row items-center ${mystyles}`}>
            <View className="flex-row items-center gap-5 ml-2.5">
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#848080"
                    value={value}
                    onChangeText={onChange}
                    selectionColor="#848080"
                    className="font-medium text-black dark:text-white text-[15px] flex-[0.98] pl-2.5 font-poppins500"
                    {...props}
                />
                <TouchableOpacity onPress={onSubmit}>
                    <Image
                        source={isDark ? require("@/assets/images/search-light.png") : require("@/assets/images/search.png")}
                        className="w-6 h-6"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}