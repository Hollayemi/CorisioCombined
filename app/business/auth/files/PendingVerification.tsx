// app/business/auth/PendingVerification.tsx
import Button from "@/components/form/Button";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import {
    useGetProfileCompletionQuery,
} from "@/redux/business/slices/authSlice";
import { router } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function PendingVerification() {
    
    const { data, isLoading } = useGetProfileCompletionQuery();
    const completion = data?.data;

    const score = completion?.score ?? 0;
    const checklist = completion?.checklist ?? [];
    const barColor = score === 100 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

    console.log({data, isLoading});

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#2A347E" />
                <Text className="text-[14px] text-gray-500 dark:text-gray-400 mt-4">
                    Loading your profile…
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ProgressHeader currentStep={5} />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 pt-6 pb-10">
                    {/* ── Illustration ── */}
                    <View className="items-center my-6">
                        <View className="w-28 h-28 rounded-full bg-amber-50 dark:bg-amber-950 items-center justify-center border-4 border-amber-200 dark:border-amber-800">
                            <Text className="text-5xl">📋</Text>
                        </View>
                    </View>

                    {/* ── Store name ── */}
                    {/* {store?.storeName ? (
                        <Text className="text-[13px] font-semibold text-center text-[#2A347E] dark:text-[#FDB415] mb-1 uppercase tracking-widest">
                            {store.storeName}
                        </Text>
                    ) : null} */}

                    {/* ── Heading ── */}
                    <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
                        {/* {store?.onboardingStatus === "rejected"
                            ? "Application Rejected"
                            : "Application Under Review"} */}
                    </Text>
{/* 
                    {store?.onboardingStatus === "rejected" && store.rejectionReason ? (
                        <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-6">
                            <Text className="text-[13px] text-red-700 dark:text-red-400 text-center leading-5">
                                ⚠️ {store.rejectionReason}
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-[15px] text-center text-gray-600 dark:text-gray-400 leading-6 mb-8">
                            Our team will verify your store details, usually within 24–48 hours.
                            You'll be notified once approved.
                        </Text>
                    )} */}

                    {/* ── Error fetching checklist ── */}
                    {/* {isError ? (
                        <View className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-4 flex-row items-center justify-between">
                            <Text className="text-[13px] text-amber-800 dark:text-amber-300">
                                Could not load completion data.
                            </Text>
                            <Text
                                className="text-[13px] font-semibold text-[#2A347E] dark:text-[#FDB415]"
                                onPress={refetch}
                            >
                                Retry
                            </Text>
                        </View>
                    ) : null} */}

                    {/* ── Completion card ── */}
                    <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
                        {/* Score + bar */}
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-[14px] font-semibold text-gray-700 dark:text-gray-300">
                                Profile Completeness
                            </Text>
                            <Text className="font-bold text-[15px]" style={{ color: barColor }}>
                                {score}%
                            </Text>
                        </View>
                        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                            <View
                                className="h-2 rounded-full"
                                style={{ width: `${score}%`, backgroundColor: barColor }}
                            />
                        </View>

                        {/* Checklist rows — from live API */}
                        {checklist.map((field) => (
                            <View
                                key={field.field}
                                className="flex-row items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                                <View className="flex-row items-center">
                                    <View
                                        className={`w-5 h-5 rounded-full mr-3 items-center justify-center
                                            ${field.complete
                                                ? "bg-green-500"
                                                : "bg-gray-200 dark:bg-gray-600"
                                            }`}
                                    >
                                        <Text className="text-white text-[10px] font-bold">
                                            {field.complete ? "✓" : ""}
                                        </Text>
                                    </View>
                                    <Text
                                        className={`text-[14px] ${field.complete
                                            ? "text-gray-800 dark:text-gray-200"
                                            : "text-gray-400 dark:text-gray-500"
                                            }`}
                                    >
                                        {field.label}
                                        {field.required && !field.complete ? (
                                            <Text className="text-red-400"> *</Text>
                                        ) : null}
                                    </Text>
                                </View>
                                <Text
                                    className={`text-[12px] font-semibold ${field.complete
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-400"
                                        }`}
                                >
                                    +{field.points}pts
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Nudge if not 100% ── */}
                    {score < 100 ? (
                        <View className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-6">
                            <Text className="text-[13px] text-amber-800 dark:text-amber-300 leading-5">
                                💡 A complete profile is more likely to be approved and ranks higher in search results.
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 mb-6">
                            <Text className="text-[13px] text-green-700 dark:text-green-400 leading-5 text-center font-medium">
                                🎉 Your profile is 100% complete!
                            </Text>
                        </View>
                    )}

                    {/* ── Actions ── */}
                    <Button
                        title="Edit Profile"
                        onPress={() => router.push("/business/auth/files/ProfileSetup")}
                    />

                    <Button
                        title="Back to Home"
                        variant="outline"
                        onPress={() => router.replace("/business/(welcome)")}
                        className="mt-3"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
