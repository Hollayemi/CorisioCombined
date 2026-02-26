// screens/SecurityPasswordScreen.tsx
import ModalComponent from '@/components/modal';
import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from '@/hooks/useData';
import { formatDate, formatTime } from '@/utils/format';
import { Route, router } from 'expo-router';
import { ChevronRightIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import TwoFactorSetupModal from './component';

interface SecurityItem {
    id: number;
    name: string;
    type: "link" | "toggle";
    to?: Route;
    value?: boolean;
    description?: string;
}

const SecurityPasswordScreen: React.FC = () => {
    const { staffInfo, refetchStaff } = useStoreData()
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const isDark = useColorScheme() == 'dark'
    const securityItems: SecurityItem[] = [
        {
            id: 1,
            name: "Change Password",
            type: "link",
            to: "/home/profile/account/password/changePassword"
        },
        {
            id: 2,
            name: "Two-Factor Authentication",
            type: "toggle",
            value: Boolean(staffInfo.two_fa),
            description: "Add an extra layer of security to your account"
        },
        {
            id: 3,
            name: "Payment Details",
            type: "link",
            to: "/home/profile/account/payments"
        },
        {
            id: 4,
            name: "Session Management",
            type: "link",
            to: "/home/profile/account/session"
        },
    ];

    const handleItemPress = (item: SecurityItem) => {
        if (item.type === "link" && item.to) {
            router.push(item.to);
        }
    };

    const handleToggle = (itemId: number, newValue: boolean) => {

        console.log(newValue)
        setTwoFactorEnabled(true);

    };

    const SecurityItemComponent: React.FC<{ item: SecurityItem; isLast: boolean }> = ({ item, isLast }) => (
        <TouchableOpacity
            onPress={() => item.type === "link" && handleItemPress(item)}
            disabled={item.type === "toggle"}
            className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
        >
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {item.name}
                </Text>
                {item.description && (
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                    </Text>
                )}
            </View>

            {item.type === "link" ? (
                <ChevronRightIcon size={20} color={isDark ? "#eee" : "#333"} />
            ) : (
                <Switch
                    value={item.value}
                    onValueChange={() => setTwoFactorEnabled(true)}
                    trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                    thumbColor={item.value ? '#ffffff' : '#ffffff'}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <StoreWrapper headerTitle="Security & Password" active='profile'>
            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Security Settings */}
                    <View className="bg-white dark:bg-gray-800 rounded-lg mb-6">
                        {securityItems.map((item, index) => (
                            <SecurityItemComponent
                                key={item.id}
                                item={item}
                                isLast={index === securityItems.length - 1}
                            />
                        ))}
                    </View>

                    {/* Security Tips */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <Text className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Security Tips
                        </Text>
                        <Text className="text-base leading-8 text-blue-700 dark:text-blue-200">
                            • Use a strong, unique password for your account{'\n'}
                            • Enable two-factor authentication for extra security{'\n'}
                            • Regularly review your active sessions{'\n'}
                            • Keep your contact information up to date
                        </Text>
                    </View>

                    {/* Account Security Status */}
                    <View className="bg-white dark:bg-gray-800 rounded-lg p-4">
                        <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                            Account Security Status
                        </Text>

                        <View className="flex-row items-center mb-3">
                            <View className={`w-3 h-3 ${twoFactorEnabled ? 'bg-green-500' : 'bg-yellow-500'} rounded-full mr-3`} />
                            <Text className="text-base leading-8 text-gray-600 dark:text-gray-300">
                                Two-factor authentication {Boolean(staffInfo.two_fa) ? 'enabled' : 'disabled'}
                            </Text>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                            <Text className="text-base leading-8 text-gray-600 dark:text-gray-300">
                                Last login: {formatDate(staffInfo.lastLoggedin)} {formatTime(staffInfo.lastLoggedin)}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <ModalComponent
                visible={twoFactorEnabled}
                onClose={() => setTwoFactorEnabled(false)}
            >
                <TwoFactorSetupModal
                    refetchStaff={refetchStaff}
                    visible={twoFactorEnabled}
                    onClose={() => setTwoFactorEnabled(false)}
                    currently={Boolean(staffInfo.two_fa)}
                />
            </ModalComponent>
        </StoreWrapper>
    );
};

export default SecurityPasswordScreen;