import StoreWrapper from '@/components/wrapper/business';
import { HeaderDropdown } from '@/components/wrapper/business/headers/dropdown';
import { useStoreGrowthAnalytics } from '../../../../hooks/useAnalyics';
import { useGetStoreGrowthQuery } from '@/redux/business/slices/growthSlice';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoriesGrowthChart from './categories';

const TransactionScreen = () => {
    const insets = useSafeAreaInsets();
    const { queryParams, refetch, isLoading } = useStoreGrowthAnalytics({
        queryMutation: useGetStoreGrowthQuery,
    });
    return (
        <StoreWrapper noHeader active='earnings'>
            <View className="flex-1">
                <View style={{ height: insets.top }} className="!bg-[#2A347E]" />
                <View className="relative w-full h-1/2 bg-[#2A347E] overflow-auto">
                    <View className="flex-row items-center z-50 justify-between px-4 py-3">
                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-12 h-12 rounded-full bg-[#37429b] items-center justify-center"
                        >
                            <ArrowLeft size={20} color="white" />
                        </TouchableOpacity>

                        {/* Title */}
                        <Text className="text-2xl !w-fit font-semibold text-white dark:text-gray-100">
                            Earnings
                        </Text>

                        {/* Close Button */}
                        <HeaderDropdown
                            items={[
                                { label: 'Request Account Statement', value: 'statement', action: () => router.push('/business/home/product/new') },
                                { label: 'Withdraw', value: 'withdraw' },
                            ]}
                            onSelect={(item: any) => item.action()}
                            clickComponent={<View

                                className="w-12 h-12 rounded-full bg-[#37429b] items-center justify-center"
                            >
                                <MoreHorizontal size={20} color="white" />
                            </View>}
                        />
                    </View>
                    <CategoriesGrowthChart defaultParams={queryParams} />
                </View>
                <View className='relative'>
                    <View className="px-4 pt-8 pb-4 absolute z-50 -bottom-20 w-full ">
                        {/* Outflow Card */}
                        <TouchableOpacity className="bg-white dark:bg-[#FDB415] rounded-t-2xl p-4 py-2">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-600 text-lg">Outflow</Text>
                                <ChevronRight size={20} color="#555" />
                            </View>
                            <Text className="text-gray-800 text-2xl font-semibold mt-1">₦15,000</Text>

                        </TouchableOpacity>

                        {/* Inflow Card */}
                        <TouchableOpacity className="bg-white dark:bg-gray-800 rounded-b-2xl p-4 py-2 shadow-sm">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-gray-600 dark:text-gray-400 text-lg">Inflow</Text>
                                <ChevronRight size={20} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-900 dark:text-white text-2xl font-semibold mt-1">₦27,729</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="h-full bg-gray-50  pt-16 dark:bg-gray-900">
                    <ScrollView refreshControl={<RefreshControl refreshing={isLoading} className='pt-10' onRefresh={refetch} />} className="relative">
                        {/* Header Cards */}

                        {/* Latest Transactions Section */}
                        <View className="px-4 mt-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-gray-900 dark:text-white text-lg font-semibold">Latest Transactions</Text>
                                <TouchableOpacity>
                                    <Text className="text-indigo-600 dark:text-indigo-400 text-lg">See All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Transaction Items */}
                            <View className="space-y-4">
                                {/* Outgoing Transaction 1 */}
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-3">
                                            <ArrowUpRight size={20} color="#6B7280" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-900 dark:text-white text-lg font-medium">Outgoing</Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm">15 Mar</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-gray-900 dark:text-white text-lg font-semibold">₦5,000</Text>
                                        <Text className="text-orange-500 text-sm font-medium">Processing</Text>
                                    </View>
                                </View>

                                {/* Incoming Transaction */}
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-3">
                                            <ArrowDownLeft size={20} color="#6B7280" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-900 dark:text-white text-lg font-medium">Incoming</Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm">15 Mar</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-gray-900 dark:text-white text-lg font-semibold">₦1,500</Text>
                                        <Text className="text-green-500 text-sm font-medium">Success</Text>
                                    </View>
                                </View>

                                {/* Outgoing Transaction 2 */}
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-3">
                                            <ArrowUpRight size={20} color="#6B7280" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-900 dark:text-white text-lg font-medium">Outgoing</Text>
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm">14 Mar</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-gray-900 dark:text-white text-lg font-semibold">₦7,500</Text>
                                        <Text className="text-red-500 text-sm font-medium">Failed</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <StatusBar style="light" />
        </StoreWrapper>
    );
};

export default TransactionScreen;
