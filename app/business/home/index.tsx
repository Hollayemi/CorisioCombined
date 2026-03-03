import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from '@/hooks/useData';
import {
    useGetMyStoreAnalyticsQuery,
    useGetProfileCompletionQuery
} from '@/redux/business/slices/storeInfoSlice';

import { useGetMyReferralsQuery, useGetReferralStatsQuery } from '@/redux/business/slices/referralSlice';
import { formatPrice } from '@/utils/format';
import { router } from 'expo-router';
import {
    ChevronDown,
    CircleCheck,
    CircleDashed,
    Eye,
    EyeClosed,
    Inbox,
    MousePointerClick,
    Search,
    Store,
    TrendingUp,
    Zap,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReferralScreen, { ShareReferral, summaryPills } from './homeComponent/referral';

// ─── Boost level colours ──────────────────────────────────────────────────────
const BOOST_COLORS: Record<string, { bg: string; text: string; label: string }> = {
    none: { bg: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-300', label: 'No Boost' },
    bronze: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', label: 'Bronze' },
    silver: { bg: 'bg-slate-200 dark:bg-slate-600', text: 'text-slate-700 dark:text-slate-200', label: 'Silver' },
    gold: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', label: 'Gold 🏆' },
};

// ─── Analytics stat card ───────────────────────────────────────────────────────
const AnalyticsCard = ({
    label,
    value,
    icon: Icon,
    iconColor,
    growth,
}: {
    label: string;
    value: string | number;
    icon: any;
    iconColor: string;
    growth?: number;
}) => {
    const isDark = useColorScheme() === 'dark';
    return (
        <View
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 my-2"
            style={{ width: '48%' }}
        >
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-sm w-20 capitalize text-gray-500 dark:text-gray-300 leading-5">
                    {label}
                </Text>
                <Icon size={18} color={iconColor} />
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</Text>
            {typeof growth === 'number' && (
                <View className="flex-row items-center mt-1">
                    <TrendingUp size={12} color={growth >= 0 ? '#22c55e' : '#ef4444'} />
                    <Text
                        className={`text-xs ml-1 ${growth >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                            }`}
                    >
                        {growth >= 0 ? '+' : ''}{growth}%
                    </Text>
                </View>
            )}
        </View>
    );
};

// ─── Boost banner ─────────────────────────────────────────────────────────────
const BoostBanner = ({
    level,
    expiresAt,
    totalReferrals,
    daysRemaining,
}: {
    level: string;
    expiresAt?: string;
    totalReferrals: number;
    daysRemaining?: number;
}) => {
    const colors = BOOST_COLORS[level] ?? BOOST_COLORS.none;
    return (
        <View className={`${colors.bg} rounded-2xl p-4 mb-4 flex-row items-center justify-between`}>
            <View className="flex-row items-center flex-1">
                <Zap size={20} color="#f59e0b" />
                <View className="ml-3">
                    <Text className={`font-bold text-base ${colors.text}`}>
                        {colors.label} Boost {level !== 'none' ? 'Active' : ''}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {level === 'none'
                            ? 'Refer stores to unlock a boost'
                            : `${totalReferrals} referral${totalReferrals !== 1 ? 's' : ''}${daysRemaining != null ? ` · ${daysRemaining}d left` : ''}`}
                    </Text>
                </View>
            </View>
            {level === 'none' && (
                <TouchableOpacity onPress={() => router.push('/business/home')}>
                    <Text className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
                        Refer →
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// ─── Profile completion tab ───────────────────────────────────────────────────
const ProfileCompletionTab = () => {
    const { data, isLoading, refetch } = useGetProfileCompletionQuery();
    const completion = data?.data;

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center py-12">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!completion) {
        return (
            <View className="flex-1 items-center justify-center py-12">
                <Text className="text-gray-500 dark:text-gray-400 mb-4">
                    Could not load profile data
                </Text>
                <TouchableOpacity onPress={refetch} className="bg-blue-500 px-6 py-2 rounded-full">
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { score, readyForVerification, checklist } = completion;
    const required = checklist.filter((c) => c.required);
    const optional = checklist.filter((c) => !c.required);

    const scoreColor =
        score >= 85 ? 'text-green-600 dark:text-green-400' :
            score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-500 dark:text-red-400';

    const barColor =
        score >= 85 ? 'bg-green-500' :
            score >= 60 ? 'bg-yellow-500' :
                'bg-red-500';

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
            showsVerticalScrollIndicator={false}
            className="flex-1"
        >
            {/* Score card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 mx-1">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-semibold text-gray-700 dark:text-gray-200">
                        Profile Completion
                    </Text>
                    <Text className={`text-3xl font-bold ${scoreColor}`}>{score}%</Text>
                </View>
                {/* Progress bar */}
                <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <View
                        className={`h-full rounded-full ${barColor}`}
                        style={{ width: `${score}%` }}
                    />
                </View>
                {readyForVerification && (
                    <View className="flex-row items-center mt-3 bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                        <CircleCheck size={16} color="#22c55e" />
                        <Text className="text-green-700 dark:text-green-300 text-sm font-medium ml-2">
                            Ready for verification!
                        </Text>
                    </View>
                )}
                {!readyForVerification && (
                    <Text className="text-xs text-gray-400 mt-2">
                        Complete required fields to become eligible for verification
                    </Text>
                )}
            </View>

            {/* Required checklist */}
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
                REQUIRED
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl mb-4 mx-1 overflow-hidden">
                {required.map((item, i) => (
                    <View
                        key={item.field}
                        className={`flex-row items-center justify-between px-4 py-4 ${i < required.length - 1
                            ? 'border-b border-gray-100 dark:border-gray-700'
                            : ''
                            }`}
                    >
                        <View className="flex-row items-center flex-1">
                            {item.complete ? (
                                <CircleCheck size={20} color="#22c55e" />
                            ) : (
                                <CircleDashed size={20} color="#9ca3af" />
                            )}
                            <Text
                                className={`ml-3 text-base font-medium ${item.complete
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-400 dark:text-gray-500'
                                    }`}
                            >
                                {item.label}
                            </Text>
                        </View>
                        <Text
                            className={`text-sm font-semibold ${item.complete
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            +{item.points}pts
                        </Text>
                    </View>
                ))}
            </View>

            {/* Optional checklist */}
            <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
                OPTIONAL (BOOSTS YOUR SCORE)
            </Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl mb-6 mx-1 overflow-hidden">
                {optional.map((item, i) => (
                    <View
                        key={item.field}
                        className={`flex-row items-center justify-between px-4 py-4 ${i < optional.length - 1
                            ? 'border-b border-gray-100 dark:border-gray-700'
                            : ''
                            }`}
                    >
                        <View className="flex-row items-center flex-1">
                            {item.complete ? (
                                <CircleCheck size={20} color="#22c55e" />
                            ) : (
                                <CircleDashed size={20} color="#9ca3af" />
                            )}
                            <Text
                                className={`ml-3 text-base font-medium ${item.complete
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-400 dark:text-gray-500'
                                    }`}
                            >
                                {item.label}
                            </Text>
                        </View>
                        <Text
                            className={`text-sm font-semibold ${item.complete
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            +{item.points}pts
                        </Text>
                    </View>
                ))}
            </View>

            {/* Edit CTA */}
            {!readyForVerification && (
                <TouchableOpacity
                    onPress={() => router.push('/business/home/profile/business/details')}
                    className="bg-blue-600 rounded-full py-4 mx-1 mb-8 items-center"
                >
                    <Text className="text-white font-semibold text-base">
                        Complete Your Profile
                    </Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const Homepage = () => {
    const tabs = ['Overview', 'Profile', 'Referrals'] as const;
    type TabKey = typeof tabs[number];

    const [activeTab, setActiveTab] = useState<TabKey>('Overview');
    const [shareReferral, setShare] = useState<boolean>(false);
    const [showBalance, setShowBalance] = useState(true);

    // Store header data (name, picture, etc.)
    const { storeInfo, refetchStore, storeIsLoading, referral }: any = useStoreData();
    const { data: referralListData } = useGetMyReferralsQuery();
    const { data: referralStatsData } = useGetReferralStatsQuery();

    const refSummary = referralListData?.data?.summary;   // drives tab badge + strip
    const refStats = referralStatsData?.data;
    const { coin } = referral ?? {};

    // Overview: analytics
    const {
        data: analyticsData,
        isLoading: analyticsLoading,
        refetch: refetchAnalytics,
    } = useGetMyStoreAnalyticsQuery();

    // Overview: store info (for boost banner)

    const analytics = analyticsData?.data;
    const myStore = storeInfo?.store || {};

    const isDark = useColorScheme() === 'dark';
    const iconDarkColor = isDark ? '#eee' : '#333';
    const insets = useSafeAreaInsets();

    const isOverviewLoading = analyticsLoading || storeIsLoading;



    const handleRefresh = () => {
        refetchAnalytics();
        refetchStore();
    };

    // Analytics cards config
    const analyticCards = analytics
        ? [
            {
                label: 'Profile Views',
                value: analytics.profileViews,
                icon: Eye,
                iconColor: '#6366f1',
            },
            {
                label: 'Search Appearances',
                value: analytics.searchAppearances,
                icon: Search,
                iconColor: '#0ea5e9',
            },
            {
                label: 'Click-Throughs',
                value: analytics.clickThroughs,
                icon: MousePointerClick,
                iconColor: '#f59e0b',
            },
            {
                label: 'CTR',
                value: analytics.ctr,
                icon: TrendingUp,
                iconColor: '#22c55e',
            },
        ]
        : [];

    return (
        <StoreWrapper noHeader active="home">
            {/* ── Header ── */}
            <View className="relative bg-white rounded-b-3xl dark:bg-gray-800">
                <View style={{ height: insets.top }} className="bg-white dark:bg-gray-800" />
                <Image
                    source={require('@/assets/images/gradient/home-gradient.png')}
                    className="absolute w-full"
                />
                <View className="flex-row items-center justify-between px-4 py-3">
                    <View className="flex-row items-center">
                        <Image
                            source={
                                myStore.profile_image
                                    ? { uri: myStore.profile_image }
                                    : require('@/assets/images/blank-profile.png')
                            }
                            className="w-12 h-12 mr-4 rounded-full"
                        />
                        <View>
                            <Text className="text-gray-600 dark:text-gray-300 text-[16px]">
                                Hi, {myStore.ownerInfo?.name}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <Store size={15} color={iconDarkColor} />
                                <Text className="text-black dark:text-white text-[15px] font-medium ml-1 mr-2">
                                    {myStore?.storeName ?? "----"}
                                </Text>
                                <ChevronDown size={15} color={iconDarkColor} />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/business/chat')}
                        className="w-12 h-12 border border-2-gray-900 dark:border-gray-100 rounded-full items-center justify-center"
                    >
                        <Inbox size={25} color={iconDarkColor} />
                        <View className="absolute top-1 right-0 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
                            <Text className="text-white text-xs font-medium">3</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Wallet balance */}
                <View className="flex-row items-center justify-between px-8 py-8 pb-12 border-b border-gray-100 dark:border-gray-700">
                    <View className="flex-row items-center">
                        <Text className={`${!showBalance ? 'text-4xl' : 'text-2xl'} font-bold text-black dark:text-white`}>
                            {formatPrice(coin || 0, showBalance, true)}
                        </Text>
                        <TouchableOpacity onPress={() => setShowBalance((v) => !v)} className="ml-2 mt-1">
                            {!showBalance ? (
                                <Eye size={17} color={iconDarkColor} />
                            ) : (
                                <EyeClosed size={17} color={iconDarkColor} />
                            )}
                        </TouchableOpacity>
                    </View>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">Wallet Balance</Text>
                </View>
            </View>

            {/* ── Tab Bar ── */}
            <View className="px-2 shadow-2xl bg-white dark:bg-gray-900">
                <View className="flex-row bg-gray-600 dark:bg-gray-700 rounded-full p-3 -mt-5">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={1}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-3 z-50 rounded-full ${activeTab === tab ? 'bg-yellow-500' : 'bg-transparent'
                                }`}
                        >
                            <Text
                                className={`text-center font-medium ${activeTab === tab ? 'text-black' : 'text-gray-400'
                                    }`}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* ── Tab Content ── */}
            <View className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4">
                <View className="flex-row items-center justify-between px-4 mb-4 mt-2">
                    {/* <Text className="text-lg font-semibold text-black dark:text-white">{activeTab}</Text> */}

                    {activeTab === 'Referrals' && (
                        <View className="px-4 mb-3 mt-2 w-full">
                            {/* Title row */}
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-lg font-semibold text-black dark:text-white">
                                    Referrals
                                </Text>
                                <ShareReferral setShare={setShare} />
                            </View>

                            {/* Live summary strip — visible as soon as the query resolves */}
                            {refSummary && (
                                <View className="flex-row gap-2 flex-wrap">
                                    {summaryPills.map(({ key, label, bg, text }) => (
                                        <View key={key} className={`flex-row items-center px-3 py-1.5 rounded-full ${bg}`}>
                                            <Text className={`text-sm font-bold mr-1 ${text}`}>
                                                {refSummary[key]}
                                            </Text>
                                            <Text className={`text-sm ${text}`}>{label}</Text>
                                        </View>
                                    ))}

                                    {/* Boost level pill — only when store has an active tier */}
                                    {refStats?.boost?.level && refStats.boost.level !== 'none' && (
                                        <View className="flex-row items-center px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                                            <Zap size={12} color="#ca8a04" />
                                            <Text className="text-sm font-bold text-yellow-700 dark:text-yellow-300 ml-1 capitalize">
                                                {refStats.boost.level}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* ── Overview ── */}
                {activeTab === 'Overview' && (
                    <ScrollView
                        refreshControl={
                            <RefreshControl refreshing={isOverviewLoading} onRefresh={handleRefresh} />
                        }
                        className="flex-1 px-4"
                        showsVerticalScrollIndicator={false}
                    >
                        {isOverviewLoading ? (
                            <ActivityIndicator size="large" color="#3b82f6" className="mt-8" />
                        ) : (
                            <>
                                {/* Boost banner */}
                                {myStore?.boost && (
                                    <BoostBanner
                                        level={myStore.boost.level}
                                        expiresAt={analytics?.boost?.expiresAt}
                                        totalReferrals={myStore.boost.totalReferrals}
                                    />
                                )}

                                {/* Analytics stat cards */}
                                <View className="flex-row flex-wrap justify-between pb-4">
                                    {analyticCards.map((card) => (
                                        <AnalyticsCard key={card.label} {...card} />
                                    ))}
                                </View>

                                {/* Validated referrals callout */}
                                {analytics && (
                                    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                                Validated Referrals
                                            </Text>
                                            <Text className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                                {analytics.validatedReferrals}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => setActiveTab('Referrals')}
                                            className="bg-yellow-400 px-4 py-2 rounded-full"
                                        >
                                            <Text className="text-black font-semibold text-sm">
                                                View All
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                )}

                {/* ── Profile Completion ── */}
                {activeTab === 'Profile' && (
                    <View className="flex-1 px-4">
                        <ProfileCompletionTab />
                    </View>
                )}

                {/* ── Referrals ── */}

                {activeTab === 'Referrals' && (
                    <View className="flex-1 px-4">
                        <ReferralScreen
                            shareReferral={shareReferral}
                            setShare={setShare}
                        />
                    </View>
                )}
            </View>
        </StoreWrapper>
    );
};

export default Homepage;