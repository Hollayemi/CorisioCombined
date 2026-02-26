import ModalComponent from '@/components/modal';
import HomeWrapper from '@/components/wrapper/user';
import { useUserData } from '@/hooks/useData';
import { useGetAgentInfoQuery } from '@/redux/user/slices/referralSlice';
import { router } from 'expo-router';
import { EyeClosed, Gift, ShareIcon, Store } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Share, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { AddBankAccountModal, Referrals, stageNote } from './components';

export default function ReferralScreen() {
    const { data, refetch, isLoading } = useGetAgentInfoQuery()
    const { referred: result = [], ...details } = data?.data?.[0] || {}
    const [share, setShare] = useState(false);
    const { userInfo } = useUserData() as any
    const [activeTab, setActiveTab] = useState("Ongoing Registration");
    const [stagesLeft, setStagesLeft] = useState<[]>([])
    const tabOffsetValue = useRef(new Animated.Value(0)).current;
    const [showBalance, setShowBalance] = useState(true);
    const [showAddBankModal, setShowAddBankModal] = useState(false);

    const shareToWhatsApp = async () => {
        const playStoreLink = "https://play.google.com/store/apps/details?id=corisio";
        const appStoreLink = "https://apps.apple.com/app/corisio/id123456789";

        const message = `
        Hey 👋,  
        \nI’m using Corisio, a fast way to find stores, products, and services near you. \n
Download the app here:\n🔹 Play Store: ${playStoreLink}\n🔹 App Store: ${appStoreLink}  
            \nUse my referral code **${userInfo?.username?.toUpperCase()}** when signing up and enjoy extra benefits 🎉
        `;
        // let url = "whatsapp://send?text=" + encodeURIComponent(message);

        // Linking.openURL(url).catch(() => {
        //     alert("Make sure WhatsApp is installed on your device");
        // });

        await Share.share({
            message: message.trim(),
        });
    };

    const handleTabPress = (tabName: any, index: any) => {
        setActiveTab(tabName);
        Animated.spring(tabOffsetValue, {
            toValue: index,
            useNativeDriver: true,
        }).start();
    };
    const formatPrice = (amount: any, noHide?: boolean) => {
        if (!showBalance && !noHide) return '₦ 🙈🙈🙈🙈';
        return `₦ ${amount.toLocaleString()}`;
    };
    const toggleBalanceVisibility = () => {
        setShowBalance(!showBalance);
    };
    const isDark = useColorScheme() === 'dark'
    const initialLayout = Dimensions.get("window").width - 35;
    const iconDarkColor = isDark ? "#eee" : "#333"


    return (
        <HomeWrapper
            dropdownItems={[
                { label: 'Add Account Details', value: 'statement', action: () => setShowAddBankModal(true) },
                { label: 'Help', value: 'help', action: () => router.push("/user/earn/help") },
            ]}
            headerTitle="Invite & Earn"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <SafeAreaView className="flex-1 bg-gray-50 dark:bg-slate-950">
                    <View className='p-2 py-6'>
                        <View className="h-48 rounded-2xl dark:bg-slate-900 overflow-hidden">
                            <View>
                                <Image
                                    source={require("@/assets/images/gradient/home-gradient.png")}
                                    className="absolute w-full  !object-top-left "
                                />
                                <View className='absolute right-0 top-20 opacity-35'>
                                    <Gift color={isDark ? "#000" : "#9ca3af"} size={150} />
                                </View>
                            </View>

                            <View className='p-6'>
                                <View className='flex-row justify-between'>
                                    <View className="flex-row items-center">
                                        <Store size={15} color={iconDarkColor} />
                                        <Text className="text-black dark:text-white text-[15px] font-medium ml-1 mr-2">Corisio for sellers</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setShare(true)} className="z-50 flex-row justify-center items-center !text-white">
                                        <ShareIcon size={18} color={iconDarkColor} />
                                    </TouchableOpacity>
                                </View>
                                <View className='flex-row justify-between items-end'>
                                    <Text className="text-gray-800 text-2xl mt-3 font-bold dark:text-white">
                                        Referral Program
                                    </Text>
                                </View>
                                <View className='flex-row justify-between'>
                                    <View>
                                        <Text className="text-gray-800 mt-7 text-lg dark:text-white">
                                            Total Amount Earned
                                        </Text>
                                        <View className='flex-row justify-between items-end'>
                                            <View className="flex-row items-center mt-2">
                                                <Text className="text-4xl !font-bold text-black dark:text-white">
                                                    {formatPrice(details?.coin || 0)}
                                                </Text>
                                                <TouchableOpacity onPress={toggleBalanceVisibility} className="ml-2 mt-1">
                                                    <Text className="text-gray-400 text-lg">{!showBalance ? '👁️' : <EyeClosed size={17} color={iconDarkColor} />}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View>
                                        <Text className="text-gray-800 mt-7 text-right text-lg dark:text-white">
                                            Pending
                                        </Text>
                                        <View className='flex-row justify-between items-end'>
                                            <View className="flex-row items-center mt-2">
                                                <Text className="text-4xl !font-bold text-black dark:text-white">
                                                    {formatPrice(details?.coin || 0, true)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex-1 px-3">
                        {/* Top Navigation Bar */}
                        <View className="flex-row mt-0 mb-4 bg-gray-100 dark:bg-slate-700 relative  rounded-full">
                            <Pressable
                                onPress={() =>
                                    handleTabPress("Ongoing Registration", 0)
                                }
                                className={`flex-1  z-50 rounded-full overflow-hidden`}
                            >
                                <Text
                                    className={`text-center p-3 py-4 font-semibold ${activeTab === "Ongoing Registration"
                                        ? "text-white dark:text-black"
                                        : "text-gray-500 dark:text-gray-200"
                                        }`}
                                >
                                    Ongoing Registration
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => handleTabPress("Completed Registration", 1)}
                                className={`flex-1 z-50 rounded-full overflow-hidden`}
                            >
                                <Text
                                    className={`text-center p-3 py-4  font-semibold ${activeTab === "Completed Registration"
                                        ? "text-white dark:text-black"
                                        : "text-gray-500 dark:text-gray-200"
                                        }`}
                                >
                                    Completed Registraition
                                </Text>
                            </Pressable>
                            <Animated.View
                                className="absolute text-white dark:text-black bg-[#2A347E] dark:bg-[#FDB415] h-full w-1/2 ml-1 rounded-full z-10"
                                style={{
                                    transform: [
                                        {
                                            translateX: tabOffsetValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [
                                                    -3,
                                                    initialLayout / 2,
                                                ],
                                            }),
                                        },
                                    ],
                                }}
                            />
                        </View>

                        {/* Animated Indicator */}

                        {/* Content Area */}
                        <View className="flex-1 justify-center items-center w-full">
                            {activeTab === "Ongoing Registration" && (
                                <Referrals
                                    isLoading={isLoading}
                                    refetch={refetch}
                                    setStagesLeft={setStagesLeft}
                                    data={result.filter((each: any) => each.stage < 4)}
                                />
                            )}
                            {activeTab === "Completed Registration" &&
                                <Referrals
                                    isLoading={isLoading}
                                    refetch={refetch}
                                    setStagesLeft={setStagesLeft}
                                    data={result.filter((each: any) => each.stage === 4)}
                                />}
                        </View>
                    </View>
                </SafeAreaView>
                <ModalComponent
                    visible={share}
                    onClose={() => setShare(false)}
                >
                    <View>
                        <View className="mb-6">
                            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                                Refer and earn more
                            </Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-center">
                                Copy your referral code and paste it into the required field during registration.
                            </Text>
                        </View>
                        <View style={{ borderTopEndRadius: 30, borderTopLeftRadius: 30 }} className='border !rounded-t-2xl border-gray-500 border-dashed h-20 mt-5'>
                            <Text className="text-gray-600 dark:text-gray-400 text-center py-3">
                                Referral Code
                            </Text>
                            <Text style={{ letterSpacing: 4 }} className="text-gray-600 text-2xl !uppercase dark:text-gray-300 text-center font-bold !tracking-wider">
                                {userInfo?.username?.toUpperCase()}
                            </Text>
                        </View>
                        <View className='h-14 mb-10'>
                            <Text onPress={shareToWhatsApp} className="text-gray-600 bg-green-500 text-xl dark:text-white text-center py-3">
                                Share On Whatsapp
                            </Text>
                        </View>

                        <View className='mb-10'>

                        </View>
                    </View>
                </ModalComponent>

                <ModalComponent
                    visible={Boolean(stagesLeft.length)}
                    onClose={() => setStagesLeft([])}
                >
                    <View>
                        <View className="mb-6">
                            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                                Stages Left
                            </Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-center">
                                Copy your referral code and paste it into the required field during registration.
                            </Text>
                        </View>

                        {stagesLeft.map(stage => (
                            <View className="mb-4">
                                <Text className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 capitalize">{stage}</Text>
                                <Text className="font-semibold text-gray-900 dark:text-gray-200 text-base mb-2 leading-8">{stageNote[stage]}</Text>
                            </View>
                        ))}

                        <View className='mb-10'>

                        </View>
                    </View>
                </ModalComponent>

                <ModalComponent
                    visible={showAddBankModal}
                    onClose={() => setShowAddBankModal(false)}
                >
                    <AddBankAccountModal
                        visible={showAddBankModal}
                        onClose={() => setShowAddBankModal(false)}
                    />
                </ModalComponent>
            </KeyboardAvoidingView>
        </HomeWrapper >
    );
};
