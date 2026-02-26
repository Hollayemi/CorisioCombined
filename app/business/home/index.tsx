import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from '@/hooks/useData';
import { useBriefRecentOrdersQuery } from '@/redux/business/slices/orderSlice';
import { useDashboardCardsQuery } from '@/redux/business/slices/storeSlice';
import { formatPrice } from '@/utils/format';
import { router } from 'expo-router';
import { ChevronDown, EyeClosed, Inbox, Store, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardIcons, StoreGrowthChat } from './components';
import { OrderStats } from './homeComponent/orders';
import ReferralScreen, { ShareReferral } from './homeComponent/referral';
import OrderListComponent from './orders/component';

const Homepage = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('Recent Orders');
    const [shareReferral, setShare] = useState<boolean>(false);
    const { data: orderData, isLoading: orderLoading, refetch: refetchOrders } =
        useBriefRecentOrdersQuery({ interval: "30 days" });
    const { orders = [], stats = {} } = orderData?.data || {};

    const { data: cards, refetch: refetchCards } = useDashboardCardsQuery()

    const [showBalance, setShowBalance] = useState(true);
    const { staffInfo, referral }: any = useStoreData();
    const { coin } = referral
    const { fullname, store, picture } = staffInfo || {};

    const tabs = ['Overview', 'Recent Orders', 'Referrals'] as const;
    type TabKey = typeof tabs[number];

    const statsData: any = {
        'Overview': cards?.data || {},
        'Recent Orders': {
            recent_sales: { stat: formatPrice(stats.totalSales, showBalance), growth: stats?.growth?.salesGrowth },
            unit_sold: { stat: stats.totalItems, growth: stats?.growth?.itemsGrowth },
            recent_orders: { stat: stats.totalOrders, growth: stats?.growth?.ordersGrowth }
        },
        'Referrals': { bookings: { stat: 25 }, earnings: { stat: 25000 }, rating: { stat: 82 }, reviews: { stat: 240 } },
    };


    const currentStats = statsData[activeTab];
    const currentKeys = Object.keys(currentStats)

    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };
    const isDark = useColorScheme() === 'dark'
    const insets = useSafeAreaInsets();
    const iconDarkColor = isDark ? "#eee" : "#333"

    return (
        <StoreWrapper noHeader active="home">
            {/* Header */}
            <View className="relative bg-white rounded-b-3xl dark:bg-gray-800">
                <View style={{ height: insets.top }} className="bg-white dark:bg-gray-800 overflow-hidden" />
                <Image
                    source={require("@/assets/images/gradient/home-gradient.png")}
                    className="absolute w-full  !object-left-right "
                />
                <View className="flex-row items-center justify-between px-4 py-3 ">
                    <View className="flex-row items-center">
                        <Image
                            source={picture ? { uri: picture } : require("@/assets/images/blank-profile.png")}
                            className="w-12 h-12 mr-4 rounded-full"
                        />
                        <View>
                            <Text className="text-gray-600 dark:text-gray-300 text-[16px]">Hi, {fullname}</Text>
                            <View className="flex-row items-center mt-2">
                                <Store size={15} color={iconDarkColor} />
                                <Text className="text-black dark:text-white text-[15px] font-medium ml-1 mr-2">{store}</Text>
                                <ChevronDown size={15} color={iconDarkColor} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/business/chat")} className="w-12 h-12 border border-2-gray-900 dark:border-gray-100 rounded-full items-center justify-center">
                        {/* <Image
                            source={isDark ? require("@/assets/images/light-notification.png") : require("@/assets/images/dark-notification.png")}
                            className="w-7 h-7"
                        /> */}
                        <Inbox size={25} color={iconDarkColor} />
                        <View className="absolute top-1 right-0 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
                            <Text className="text-white text-xs font-medium">
                                3
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Rating Stars and Wallet Balance */}
                <View className="flex-row items-center justify-between px-8 py-8 pb-12  border-b border-gray-100 dark:border-gray-700">
                    <View className="flex-row items-center">
                        <View className="flex-row items-center">
                            <Text className={`${!showBalance ? "text-4xl" : "text-2xl"} !font-bold text-black dark:text-white`}>
                                {formatPrice(coin || 0, showBalance, true)}
                            </Text>
                            <TouchableOpacity onPress={toggleBalanceVisibility} className="ml-2 mt-1">
                                <Text className="text-gray-400 text-lg">{!showBalance ? '👁️' : <EyeClosed size={17} color={iconDarkColor} />}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="items-end">
                        <Text className="text-gray-500 dark:text-gray-400 text-sm">Wallet Balance</Text>
                    </View>
                </View>
            </View>
            <View className="px-2 shadow-2xl bg-white dark:bg-gray-900">
                <View className="flex-row bg-gray-600 dark:bg-gray-700 rounded-full p-3 -mt-5">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 z-50 rounded-full ${activeTab === tab
                                ? 'bg-yellow-500'
                                : 'bg-transparent'
                                }`}
                        >
                            <Text className={`text-center font-medium ${activeTab === tab
                                ? 'text-black'
                                : 'text-gray-400'
                                }`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Stats Cards */}
            {activeTab === "Recent Orders" && <OrderStats currentKeys={currentKeys} currentStats={currentStats} />}

            <View className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4">
                <View className="flex-row items-center justify-between px-4 mb-4 mt-2 pr-4">
                    <Text className="text-lg font-semibold text-black dark:text-white">{activeTab}</Text>
                    {activeTab === "Referrals" && <ShareReferral setShare={setShare} />}
                </View>
                <ScrollView refreshControl={<RefreshControl refreshing={orderLoading} onRefresh={refetchCards} />} className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                    {activeTab === "Recent Orders" && (orders.length > 0 ? (
                        orders.map((order: any, i: number) => (
                            <OrderListComponent key={i} order={order} isFetching={orderLoading} refetch={refetchOrders} />
                        ))
                    ) : (
                        <View className="items-center justify-center py-8">
                            <Text className="text-gray-500 dark:text-gray-400 text-center">
                                No Order for {activeTab.toLowerCase()}
                            </Text>
                        </View>
                    ))}

                    {activeTab === "Overview" ?
                        <View className="flex-row flex-wrap justify-between items-center pb-4">
                            {currentKeys?.map((key: any, index: number) => {
                                const curr = currentStats[key as any]
                                const Icon = CardIcons[key as any]
                                return (
                                    <View
                                        key={index}
                                        className="bg-white dark:bg-gray-800 h-28 rounded-b-2xl  border border-gray-200 my-3 dark:border-gray-700 rounded-xl p-3"
                                        style={{ width: "48%" }}
                                    >
                                        <View className="flex-row justify-between h-14 items-start">
                                            <Text className="text-lg w-20 font-medium capitalize text-gray-500 dark:text-gray-200">
                                                {key.split("_").join(" ")}
                                            </Text>
                                            <View className=" flex-row justify-center items-center mr-1">
                                                <Icon
                                                    size={20}
                                                    color={iconDarkColor}
                                                />
                                            </View>
                                        </View>
                                        <View className="flex-row justify-between items-center">
                                            <Text className={`text-3xl font-bold text-gray-900 dark:text-gray-200`}>
                                                {curr?.price ? formatPrice(curr?.countNow || 0, showBalance) : curr?.countNow || 0}
                                            </Text>
                                            <Text className={`${parseInt(curr.growth) > 0 ? "text-green-500 bg-green-200 dark:bg-green-800 dark:text-green-400" : "text-red-500 bg-red-100 dark:!bg-red-800 dark:text-red-400"} ml-2 p-1 w-fit text-center rounded-full capitalize text-sm mb-1  `}>
                                                {parseFloat(curr.growth)?.toFixed(1)}{" "}
                                                {parseInt(curr.growth) > 0 ? <TrendingUp size={12} style={{ marginTop: 10 }} className="!mb-2" color="green" /> : <TrendingDown size={12} style={{ marginTop: 10 }} className="!mb-2" color="red" />}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })}
                            <View className="-ml-4">
                                <StoreGrowthChat hideCurrency={showBalance} />
                            </View>
                        </View>
                        :
                        <></>
                    }

                    {activeTab === "Referrals" && <ReferralScreen setShare={setShare} shareReferral={shareReferral} />}
                </ScrollView>
            </View>
        </StoreWrapper>
    );
};

export default Homepage;