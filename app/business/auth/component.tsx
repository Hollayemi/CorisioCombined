import Button from "@/components/form/Button";
import { useSendOtpMutation } from "@/redux/business/slices/authSlice";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Image, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

// Page Title and Subtitle Component
import { normalisePhone } from '@/utils/format';
import { Route, router } from 'expo-router';
import { Text } from 'react-native';
import { ActivityIndicator } from "react-native";

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
export const ProfilePictureUpload = ({ handleUpload, localFiles = [], image, isUploading }: any) => {
    console.log("localFiles=>>>>>>>", localFiles[-1])
    return (
        <View className="items-center mb-8">
            <View className="relative">
                <View className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden">
                    {localFiles.length || image ? (
                        <Image
                            source={{
                                uri: localFiles[localFiles.length - 1] || image
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
                    {isUploading ? <ActivityIndicator /> : <Ionicons name="camera" size={20} color="white" />}
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




export const PhoneNumber = ({pathname, data}:{pathname: Route, data?:any}) => {
    const { categories, ...passData } = data ? data : {};
    const [phone, setPhone] = useState(""); // raw digit string, e.g. "08012345678"
    const [error, setError] = useState("");
    const inputRef = useRef<TextInput>(null);


    const formatDisplay = (digits: string): string => {
        const d = digits.slice(0, 11);
        if (d.length <= 4) return d;
        if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
        return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
    };
    

    // ── RTK Query ───────────────────────────────────────────────────────────
    const [sendOtp, { isLoading }] = useSendOtpMutation();

    const validate = (): boolean => {
        if (phone.replace(/\D/g, "").length < 10) {
            setError("Please enter a valid Nigerian phone number");
            return false;
        }
        setError("");
        return true;
    };

    const handleSendOtp = async () => {
        if (!validate()) return;

        const phoneNumber = normalisePhone(phone);

        try {
            // POST /stores/auth/send-otp → { phoneNumber }
            // Response: { success, data: { phoneNumber, message, otp? } }
            await sendOtp({ phoneNumber, category: JSON.parse(categories || "{}") }).then((res) => {
                console.log({res});
                router.push({
                    pathname: (pathname || "/business/auth/files/PhoneVerify") as any,
                    params: { phone: phoneNumber, ...passData },
                });
            })
            setError("");

        } catch (err: any) {
            console.log("Error sending OTP:", err);
            const status = err?.status;
            if (status === 429) {
                setError("You've requested too many OTPs. Try again in 10 minutes.");
            } else {
                setError(err?.data?.message ?? "Could not send OTP. Check your connection.");
            }
        }
    };

    return (
        <View className="px-6 mt-2">
            {/* ── Phone input card ── */}
            <View
                className={`flex-row items-center border-2 rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden
                                    ${error
                        ? "border-red-400 dark:border-red-500"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
            >
                <View className="flex-row items-center px-4 py-4 border-r border-gray-200 dark:border-gray-700">
                    <Text className="text-xl mr-1">🇳🇬</Text>
                    <Text className="text-[15px] font-semibold text-gray-700 dark:text-gray-300 ml-1">
                        +234
                    </Text>
                </View>

                <TextInput
                    ref={inputRef}
                    className="flex-1 px-4 py-4 text-[16px] text-gray-900 dark:text-white"
                    placeholder="0XX XXXX XXXX"
                    placeholderTextColor="#9CA3AF"
                    value={formatDisplay(phone)}
                    onChangeText={(t) => {
                        setPhone(t.replace(/\D/g, "").slice(0, 11));
                        if (error) setError("");
                    }}
                    keyboardType="phone-pad"
                    maxLength={14}
                    returnKeyType="done"
                    onSubmitEditing={handleSendOtp}
                />
            </View>

            {error ? (
                <Text className="text-red-500 dark:text-red-400 text-[12px] mt-2 ml-1">
                    {error}
                </Text>
            ) : null}

            <View className="mt-4 bg-blue-50 dark:bg-blue-950 rounded-xl px-4 py-3 flex-row items-start">
                <Text className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">ℹ️</Text>
                <Text className="text-[13px] text-blue-700 dark:text-blue-300 flex-1 leading-5">
                    A 6-digit code will be sent via SMS. Standard rates may apply.
                </Text>
            </View>

            <View className="mt-8">
                <Button
                    title="Send OTP"
                    onPress={handleSendOtp}
                    isLoading={isLoading}
                    loadingText="Sending…"
                    disabled={phone.replace(/\D/g, "").length < 10 || isLoading}
                />
            </View>

        </View>
    )
}