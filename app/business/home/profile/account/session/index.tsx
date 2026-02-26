import StoreWrapper from '@/components/wrapper/business';
import { useGetSessionsQuery } from '@/redux/business/slices/staffSlice';
import { formatDate } from '@/utils/format';
import { ComputerIcon, LucidePhone, Trash } from 'lucide-react-native';
import React from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export interface DeviceSession {
    id: number;
    deviceName: string;
    deviceType: 'ANDROID' | 'IOS' | 'WEB';
    lastActive: string;
    status: 'Active' | 'Inactive';
}


export default function SessionManagementScreen() {
    const { data, isLoading, refetch } = useGetSessionsQuery()
    const { devices = [] } = data?.data[0] || {}
    const reversed = [...devices].reverse()
    const sessions: DeviceSession[] = reversed.map((each: any) => ({
        id: 1,
        deviceName: `${each.model} (${each.os})`,
        deviceType: each.deviceType,
        lastActive: formatDate(each.date),
        status: 'Active'
    }))



    const handleTerminateSession = (sessionId: number, deviceName: string) => {
        Alert.alert(
            'Terminate Session',
            `Are you sure you want to terminate the session for ${deviceName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Terminate',
                    style: 'destructive'
                }
            ]
        );
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'PHONE':
                return <LucidePhone size={20} className="text-blue-600 dark:text-blue-400" />;
            case 'WEB':
                return <ComputerIcon size={20} className="text-blue-600 dark:text-blue-400" />;
            default:
                return <LucidePhone size={20} className="text-blue-600 dark:text-blue-400" />;
        }
    };

    const SessionItem: React.FC<{ session: DeviceSession }> = ({ session }) => (
        <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 py-6 mb-3 flex-row items-center">
            <View className="w-10 h-10 bg-blue-100 dark:bg-yellow-500 rounded-lg items-center justify-center mr-3">
                {getDeviceIcon(session.deviceType.toUpperCase())}
            </View>

            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {session.deviceName}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {session.lastActive} • {session.status}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => handleTerminateSession(session.id, session.deviceName)}
                className="w-10 h-10 items-center justify-center"
            >
                <Trash size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <StoreWrapper headerTitle="Session Management" active='profile'>
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />} className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Description */}
                    <Text className="text-base text-gray-600 dark:text-gray-400 mb-6 leading-6">
                        These are the device that are currently logged into your account recently.
                    </Text>

                    {/* Sessions List */}
                    <View className="mb-6">
                        {sessions.map((session) => (
                            <SessionItem key={session.id} session={session} />
                        ))}
                    </View>

                    {/* Info Card */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <Text className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            💡 Security Tip
                        </Text>
                        <Text className="text-base text-blue-700 dark:text-blue-200 leading-8">
                            If you notice any unfamiliar devices, terminate their sessions immediately and change your password.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </StoreWrapper>
    );
};