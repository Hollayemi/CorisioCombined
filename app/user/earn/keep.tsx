import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ChevronLeft, Copy, ChevronRight, ChevronDown } from 'lucide-react-native';

const ReferralScreen = () => {
    const [showReferrals, setShowReferrals] = useState(false);

    const referrals = [
        { name: 'Giovanni', amount: '$1', status: 'Completed' },
        { name: 'Toba', amount: '$1', status: 'Completed' },
        { name: 'Elizabeth', amount: '', status: 'Pending' },
        { name: 'Tash', amount: '', status: 'Pending' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800">
                    <TouchableOpacity>
                        <ChevronLeft size={24} className="text-gray-800 dark:text-white" />
                    </TouchableOpacity>
                    <Text className="text-lg font-medium text-gray-800 dark:text-white">
                        Invite & Earn
                    </Text>
                    <View className="w-6" />
                </View>

                {/* Gift Box Section */}
                <View className="items-center px-6 py-8 bg-white dark:bg-gray-800">
                    {/* Gift Box Icon */}
                    <View className="relative mb-6">
                        <View className="w-24 h-24 bg-orange-500 rounded-xl items-center justify-center">
                            <View className="w-16 h-12 bg-yellow-400 rounded-lg" />
                        </View>
                        {/* Bow */}
                        <View className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <View className="w-8 h-4 bg-red-500 rounded-full" />
                            <View className="absolute top-1 left-1 w-6 h-2 bg-red-600 rounded-full" />
                        </View>
                        {/* Coins */}
                        <View className="absolute -top-1 -right-2 w-4 h-4 bg-yellow-400 rounded-full" />
                        <View className="absolute -top-3 right-2 w-3 h-3 bg-orange-400 rounded-full" />
                    </View>

                    <Text className="text-gray-800 dark:text-white text-base text-center mb-2">
                        Refer 10 FRIENDS and earn
                    </Text>
                    <Text className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                        $10
                    </Text>

                    {/* Referral Link */}
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4 w-full">
                        <Text className="flex-1 text-gray-600 dark:text-gray-300 text-sm">
                            Chris/connect/register
                        </Text>
                        <TouchableOpacity className="flex-row items-center ml-2">
                            <Copy size={16} className="text-gray-600 dark:text-gray-300 mr-1" />
                            <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                Copy
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Share Button */}
                    <TouchableOpacity className="w-full bg-blue-500 rounded-lg py-4 mb-6">
                        <Text className="text-white text-center font-semibold text-base">
                            Share & Earn Now
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Earnings Section */}
                <View className="bg-white dark:bg-gray-800 px-6 py-4 mt-1">
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center">
                            <Text className="text-gray-800 dark:text-white font-medium">
                                Total Earnings
                            </Text>
                            <View className="w-3 h-3 bg-orange-400 rounded-full ml-2" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
                            $2
                        </Text>
                    </View>

                    {/* Referrals Section */}
                    <TouchableOpacity
                        className="flex-row items-center justify-between py-3"
                        onPress={() => setShowReferrals(!showReferrals)}
                    >
                        <Text className="text-gray-800 dark:text-white font-medium">
                            Referrals
                        </Text>
                        <View className="flex-row items-center">
                            {!showReferrals && (
                                <ChevronRight size={20} className="text-gray-400" />
                            )}
                            {showReferrals && (
                                <>
                                    <Text className="text-gray-500 mr-2">2 of 10</Text>
                                    <ChevronDown size={20} className="text-gray-400" />
                                </>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* Referral List */}
                    {showReferrals && (
                        <View className="mt-2">
                            <View className="h-1 bg-blue-500 w-1/5 rounded-full mb-4" />

                            {referrals.map((referral, index) => (
                                <View key={index} className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center">
                                        <Text className="text-gray-500 mr-4 w-4">
                                            {index + 1}.
                                        </Text>
                                        <Text className="text-gray-800 dark:text-white">
                                            {referral.name}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        {referral.amount && (
                                            <Text className="text-gray-800 dark:text-white font-medium mr-2">
                                                {referral.amount}
                                            </Text>
                                        )}
                                        <Text
                                            className={`text-sm ${referral.status === 'Completed'
                                                    ? 'text-green-600'
                                                    : 'text-orange-500'
                                                }`}
                                        >
                                            {referral.status}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Bottom spacing */}
                <View className="h-8" />

                {/* Home indicator */}
                <View className="items-center pb-4">
                    <View className="w-32 h-1 bg-gray-800 dark:bg-white rounded-full" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ReferralScreen;