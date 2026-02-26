// screens/ProfileHomeScreen.tsx
import ModalComponent from '@/components/modal';
import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from '@/hooks/useData';
import { logoutUser } from '@/redux/business/slices/authSlice';
import { router } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import LogoutModal from './component';
import { accountSettingsItems, businessPerformanceItems, ProfileItem, supportItems } from './profileList';

interface ProfileSectionProps {
    title?: string;
    items: ProfileItem[];
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, items }) => {

    const isDark = useColorScheme() === 'dark'

    return (
        <View className="mb-6">
            {title && (
                <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-4">
                    {title}
                </Text>
            )}
            <View className="bg-white dark:bg-gray-800 rounded-lg mx-4">
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}

                        //@ts-ignore
                        onPress={() => router.push({ pathname: item.to, params: { data: JSON.stringify(item.parameters || {}) } })}
                        className={`flex-row items-center justify-between p-4 ${index !== items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                            }`}
                    >
                        <Text className="text-base text-gray-900 dark:text-white font-medium">
                            {item.name}
                        </Text>
                        <ChevronRightIcon size={20} color={isDark ? "#eee" : "#333"} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
};

const ProfileHomeScreen: React.FC = () => {
    const { staffInfo, storeInfo }: any = useStoreData();
    const dispatch = useDispatch()
    const isDark = useColorScheme() === 'dark'
    const [logoutModal, showLogoutModal] = useState<boolean>(false)
    const insets = useSafeAreaInsets();
    const handleItemPress = (item: ProfileItem) => {
        console.log('Navigate to:', item.to);
    };
    const handleLogout = () => {
        showLogoutModal(true)
    };

    return (
        <StoreWrapper noHeader active="profile">
            <View style={{ height: insets.bottom }} className="bg-white dark:bg-gray-900 !pb-10" />
            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900" showsVerticalScrollIndicator={false}>
                <View className=" p-4 my-6">
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 bg-black rounded-full items-center justify-center mr-4">
                            <Image
                                className="w-full h-full rounded-full"
                                source={!storeInfo?.profile?.profile_image ? require("@/assets/images/blank-profile.png") : { uri: storeInfo?.profile?.profile_image }}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                {storeInfo?.business?.businessName}
                            </Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                {storeInfo.profile.address}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Account Settings Section */}
                <ProfileSection
                    title="Account Settings"
                    items={accountSettingsItems}

                />

                {/* Business & Performance Section */}
                <ProfileSection
                    title="Business & Performance"
                    items={businessPerformanceItems}
                />

                {/* Support Section */}
                <ProfileSection
                    title="Support"
                    items={supportItems}
                />

                {/* Logout Button */}
                <View className="mx-4 mb-8">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4"
                    >
                        <Text className="text-base font-medium text-red-600 dark:text-red-400">
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ModalComponent
                visible={logoutModal}
                onClose={() => showLogoutModal(false)}
            >
                <LogoutModal
                    visible={logoutModal}
                    onClose={() => showLogoutModal(false)}
                    onActivate={() => { dispatch(logoutUser()); showLogoutModal(false) }}
                />
            </ModalComponent>
        </StoreWrapper>
    );
};

export default ProfileHomeScreen;