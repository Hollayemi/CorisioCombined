import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

// Page Title and Subtitle Component
import { Text } from 'react-native';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    hasImage?: boolean;
}

export default function Pattern({ }: {}) {
    return (
        <View className="relative !opacity-100">
            <Image
                source={require("@/assets/images/gradient/auth1.png")}
                className="!absolute -top-20 left-0"
            />
            <Image
                source={require("@/assets/images/gradient/auth2.png")}
                className="!absolute -top-10 left-0"
            />
        </View>
    );
}

export function PageHeader({ title, subtitle, hasImage }: PageHeaderProps) {
    const isDarkMode = useColorScheme() === 'dark'
    return (
        <View className={`px-6 mb-8 ${hasImage && 'pt-8'}`}>
            {hasImage && <Image
                source={!isDarkMode ? require("@/assets/images/logo2.png") : require("@/assets/images/logowhite.png")}
                className="h-[34px] w-[140px] my-3"
            />}
            <Text className="text-3xl font-bold text-blue-900 dark:text-white mb-2">
                {title}
            </Text>
            <Text className="text-[15px] text-gray-600 dark:text-gray-300 leading-7">
                {subtitle}
            </Text>
        </View>
    );
};

// Profile Picture Upload Component
export const ProfilePictureUpload = ({ handleUpload, localFiles = [] }: any) => {
    console.log("localFiles=>>>>>>>", localFiles[-1])
    return (
        <View className="items-center mb-8">
            <View className="relative">
                <View className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden">
                    {localFiles.length ? (
                        <Image
                            source={{
                                uri: localFiles[localFiles.length - 1]
                            }}
                            className="w-full h-full"
                        />
                    ) : (
                        <MaterialIcons
                            name="storefront"
                            size={60}
                            className="!text-gray-400 dark:text-gray-500"
                        />

                    )}
                </View>

                <TouchableOpacity
                    onPress={() => handleUpload(1)}
                    className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-600 rounded-full items-center justify-center border-4 border-white dark:border-black"
                >
                    <Ionicons name="camera" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Guidelines Component
export const ProfileGuidelines = () => {
    const guidelines: {
        icon: React.ComponentProps<typeof Ionicons>['name'];
        text: string;
        color: string;
    }[] = [
            {
                icon: "checkmark-circle",
                text: "Use a clear, high-quality photo (no blurry or dark images).",
                color: "!text-blue-600 dark:text-blue-400"
            },
            {
                icon: "checkmark-circle",
                text: "Your face should be visible (avoid group photos).",
                color: "!text-blue-600 dark:text-blue-400"
            },
            {
                icon: "checkmark-circle",
                text: "If you're a business, you can upload your brand logo instead.",
                color: "!text-blue-600 dark:text-blue-400"
            }
        ];

    return (
        <View className="mb-8">
            <Text className="text-[16px] font-semibold text-gray-600 dark:text-white mb-4">
                Guidelines for a Good Profile Picture:
            </Text>

            {guidelines.map((guideline, index) => (
                <View key={index} className="flex-row items-start mb-3">
                    <Ionicons
                        name={guideline.icon}
                        size={16}
                        className={`mt-0.5 mr-3 ${guideline.color}`}
                    />
                    <Text className="flex-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {guideline.text}
                    </Text>
                </View>
            ))}
        </View>
    );
};
