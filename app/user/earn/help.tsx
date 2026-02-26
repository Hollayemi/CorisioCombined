import HomeWrapper from '@/components/wrapper/user';
import { Camera, CheckCircle, MapPin, Package, Target, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, useColorScheme, View } from 'react-native';

const ReferralHelpPage = () => {

    const isDark = useColorScheme() === "dark"
    const iconColor = isDark ? "#eee" : "#555"
    const stages = [
        {
            id: 1,
            title: "Store Registration",
            icon: CheckCircle,
            color: "text-green-500",
            bgColor: "bg-green-100 dark:bg-slate-900",
            description: "As soon as a store signs up with your referral link, Stage 1 is automatically complete.",
            subtext: "You've helped someone join our platform. great job!"
        },
        {
            id: 2,
            title: "Store Location Setup",
            icon: MapPin,
            color: "text-blue-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            description: "The store must set their correct coordinates (latitude must be greater than 0) so customers can find them on the map.",
            subtext: "Without a location, customers can't get directions or see where the store is.",
            tip: "Setting their location helps people find them faster!"
        },
        {
            id: 3,
            title: "Add at Least 5 Products",
            icon: Package,
            color: "text-purple-500",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
            description: "The store should list 5 or more products to attract customers and start selling.",
            subtext: "More products = more chances to be found in search.",
            tip: "Help them upload product pictures and descriptions."
        },
        {
            id: 4,
            title: "Add at Least 1 Gallery Picture",
            icon: Camera,
            color: "text-orange-500",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
            description: "The store's gallery should have at least 1 clear photo showing their shop, products, or brand.",
            subtext: "Customers trust stores they can see."
        }
    ];

    const tips = [
        "Stay in touch with your referrals, guide them through the setup.",
        "Share why each stage matters so they're motivated.",
        "Celebrate when they hit milestones (e.g., 'Congrats, your store just reached Stage 3!')."
    ];

    const StageCard = ({ stage }: any) => {
        const IconComponent = stage.icon;

        return (
            <View className={`${stage.bgColor} rounded-xl p-4 mb-4 border border-gray-200 dark:border-gray-700`}>
                <View className="flex-row items-start space-x-3">
                    <View className={`${stage.bgColor} rounded-full px-2`}>
                        <IconComponent size={20} color={iconColor} className={stage.color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Stage {stage.id} – {stage.title}
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300 text-base leading-6 mb-2">
                            {stage.description}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-base italic mb-2">
                            {stage.subtext}
                        </Text>
                        {stage.tip && (
                            <View className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 border-l-2 border-yellow-400">
                                <Text className="text-yellow-800 dark:text-yellow-200 text-base font-medium">
                                    💡 {stage.tip}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };


    return (
        <HomeWrapper headerTitle="Help" active="earning">
            <SafeAreaView className={`flex-1 bg-gray-50 dark:bg-gray-900`}>


                <ScrollView className="flex-1 px-4 pb-6">
                    {/* Introduction */}
                    <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-2 my-4">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <TrendingUp size={24} color={isDark ? "#eee" : "#555"} className="text-white mr-3" />
                            <Text className="ml-4 text-xl font-bold dark:text-white">
                                How Store Referrals Work
                            </Text>
                        </View>
                        <Text className="dark:text-gray-200 text-base leading-6">
                            When you refer a store, you earn rewards as they progress through 4 main stages.
                            Each stage is independent they can be achieved in any order, and every stage achieved increases the store's progress.
                        </Text>
                    </View>

                    {/* Stages */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            🛠 The 4 Referral Stages
                        </Text>
                        {stages.map((stage) => (
                            <StageCard key={stage.id} stage={stage} />
                        ))}
                    </View>

                    {/* Progress Tracking */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            📊 How You Track Progress
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300 text-base mb-4 leading-6">
                            Each store you referred will show stage count (how many stages they've completed) and stages left (what's still pending).
                        </Text>
                        {/* <ProgressExample /> */}
                    </View>

                    {/* Earnings */}
                    <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 mb-6">
                        <View className="flex-row items-center space-x-2 mb-3">
                            {/* <Gift size={20} className="text-green-600 dark:text-green-400" /> */}
                            <Text className="text-lg font-bold text-green-800 dark:text-green-200">
                                💰 How You Earn
                            </Text>
                        </View>
                        <Text className="text-green-700 dark:text-green-300 text-base leading-6 mb-2">
                            You can set rewards or bonuses per stage achieved. The more stages your referred store completes, the more you earn.
                        </Text>
                        <Text className="text-green-600 dark:text-green-400 text-base">
                            Some milestones may have bigger rewards than others (optional, if your system works that way).
                        </Text>
                    </View>

                    {/* Tips */}
                    <View className="mb-6">
                        <View className="flex-row items-center space-x-2 mb-4">
                            {/* <Lightbulb size={20} className="text-yellow-500" /> */}
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">
                                💡 Tips for Referrers
                            </Text>
                        </View>
                        {tips.map((tip, index) => (
                            <View key={index} className="flex-row items-start space-x-3 mb-3">
                                <View className="w-2 h-2 bg-gray-200 mx-4 rounded-full mt-2" />
                                <Text className="text-gray-700 dark:text-gray-300 text-base leading-6 flex-1">
                                    {tip}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Success Banner */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <View className="flex-row items-center space-x-2 mb-2">
                            <Target size={20} color={iconColor} className="text-blue-600 dark:text-blue-400" />
                            <Text className="text-lg font-semibold ml-2 text-blue-800 dark:text-blue-200">
                                Success Strategy
                            </Text>
                        </View>
                        <Text className="text-blue-700 dark:text-blue-300 text-base leading-6">
                            The key to maximizing your referral earnings is to actively support your referred stores through each stage.
                            Guide them, celebrate their progress, and help them understand why each step matters for their success.
                        </Text>
                    </View>

                    {/* Bottom spacing */}
                    <View className="h-6" />
                </ScrollView>
            </SafeAreaView>
        </HomeWrapper>
    );
};

export default ReferralHelpPage;