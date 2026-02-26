import Button from "@/components/form/Button";
import StoreWrapper from "@/components/wrapper/business";
import { useStoreData } from "@/hooks/useData";
import { useUpdateStoreInfoMutation } from "@/redux/business/slices/branchSlice";
import React, { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';


export interface NotificationSetting {
    id: number;
    name: string;
    description?: string;
    enabled: boolean;
}

export default function Notifications() {
    const [updateStoreInfo, { isLoading }] = useUpdateStoreInfoMutation()
    const { storeInfo, refetchStore } = useStoreData()
    const profile = storeInfo?.profile || {};
    type NotificationsType = {
        isset: boolean;
        low_stock: number;
        isset_low_stock: boolean;
        out_of_stock: boolean;
        restock_reminder: boolean;
    };

    type EmailNotificationType = {
        isset: boolean;
        order_confirmation: boolean;
        shipping_updates: boolean;
        account_activity: boolean;
        customer_inquires: boolean;
    };

    type NotifType = {
        notifications: NotificationsType;
        email_notification: EmailNotificationType;
    };

    const [notif, setNotif] = useState<NotifType>({
        notifications: {
            isset: profile?.notifications?.isset || false,
            low_stock: profile?.notifications?.low_stock || 0,
            isset_low_stock: profile?.notifications?.isset_low_stock || false,
            out_of_stock: profile?.notifications?.out_of_stock || false,
            restock_reminder: profile?.notifications?.restock_reminder || false,
        },
        email_notification: {
            isset: profile?.email_notification?.isset || false,
            order_confirmation:
                profile?.email_notification?.order_confirmation || false,
            shipping_updates:
                profile?.email_notification?.shipping_updates || false,
            account_activity:
                profile?.email_notification?.account_activity || false,
            customer_inquires:
                profile?.email_notification?.customer_inquires || false,
        },
    });

    const handleInputChange = (platform: string, field: any, value: boolean) => {
        setNotif((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform as keyof NotifType],
                [field]: value,
            },
        }));
    };
    const NotificationItem = ({ platform, isLast }: { platform: keyof NotifType; isLast: boolean }) => {
        return Object.keys(notif[platform]).map((each, idx, arr) => {
            // Type assertion for each property name
            const key = each as keyof typeof notif[typeof platform];
            const enabled = notif[platform][key];
            console.log(enabled);

            return (
                each !== "isset" && <View
                    key={each}
                    className={`flex-row items-center justify-between p-4 ${idx !== arr.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                        }`}
                >
                    <Text className="text-base capitalize font-medium text-gray-900 dark:text-white flex-1">
                        {each.split('_').join(" ")}
                    </Text>

                    <Switch
                        value={!!enabled}
                        onValueChange={(newValue) =>
                            handleInputChange(platform, each, newValue)
                        }
                        trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                        thumbColor={enabled ? '#ffffff' : '#ffffff'}
                    />
                </View>
            );
        });
    };

    return (
        <StoreWrapper headerTitle="Notification" active="profile">

            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Notification Settings */}
                    <View className="bg-white dark:bg-gray-800 rounded-lg mb-6">
                        {Object.keys(notif).map((platform, index) => (
                            <NotificationItem
                                key={platform}
                                platform={platform as keyof NotifType}
                                isLast={false}
                            />
                        ))}
                    </View>

                    {/* Info Card */}
                    <View className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                        <Text className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                            Notification Preferences
                        </Text>
                        <Text className="text-sm text-yellow-700 dark:text-yellow-200 leading-5">
                            You can customize which notifications you receive. Important security notifications cannot be disabled.
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View className="px-4 py-3 dark:bg-gray-900">
                <Button title="Save Changes" size="medium" className="!min-w-48 !m-3" onPress={() => updateStoreInfo(notif).then(() => refetchStore())} />
            </View>
        </StoreWrapper>
    )

}