import Button from "@/components/form/Button";
import StoreWrapper from "@/components/wrapper/business";
import { useStoreData } from "@/hooks/useData";
import { router } from "expo-router";
import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

export interface DaySchedule {
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
}

export default function Availability() {

    const { storeInfo = {}, refetchStore, storeIsLoading } = useStoreData();
    const { profile = {}, business } = storeInfo;
    const { openingHours = {} } = profile;

    const daysOrder = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ];

    const schedule: DaySchedule[] = daysOrder.map((day) => {
        const data = openingHours[day] || { from: '', to: '', isset: false };
        return {
            day: day.charAt(0).toUpperCase() + day.slice(1),
            startTime: data.from?.trim() || '--',
            endTime: data.to?.trim() || '--',
            isOpen: data.isset || false,
        };
    });

    const handleEditAvailability = () => {
        console.log('Edit service availability');
        // Navigate to edit screen or show modal
    };

    const ScheduleItem: React.FC<{ daySchedule: DaySchedule; isLast: boolean }> = ({
        daySchedule,
        isLast
    }) => (
        <View
            className={`flex-row items-center justify-between p-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
        >
            <Text className="text-base font-medium text-gray-900 dark:text-white">
                {daySchedule.day}
            </Text>

            <Text className="text-base text-gray-500 dark:text-gray-400">
                {daySchedule.isOpen
                    ? `${daySchedule.startTime} - ${daySchedule.endTime}`
                    : 'Closed'}
            </Text>
        </View>
    );

    return (
        <StoreWrapper headerTitle="Availability" active="profile">
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={storeIsLoading}
                        onRefresh={refetchStore}
                    />
                }
                className="flex-1 bg-gray-50 dark:bg-gray-900"
            >
                <View className="p-4">
                    {/* Location Hours Header */}
                    <View className="mb-6 ">
                        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Location Hours
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {schedule.filter((d) => d.isOpen).length} day(s) open per week
                        </Text>
                    </View>

                    {/* Schedule List */}
                    <View className="bg-white dark:bg-gray-800 rounded-lg mb-6">
                        {schedule.map((daySchedule, index) => (
                            <ScheduleItem
                                key={daySchedule.day}
                                daySchedule={daySchedule}
                                isLast={index === schedule.length - 1}
                            />
                        ))}
                    </View>

                    <Button
                        size="small"
                        onPress={() =>
                            router.push('/business/home/profile/business/availability/edit')
                        }
                        title="Edit Service Availability"
                    />

                    {/* Info Card */}
                    <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-6">
                        <Text className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                            Business Hours
                        </Text>
                        <Text className="text-base text-green-700 dark:text-green-200 leading-5">
                            Your service availability helps customers know when they can come for their products. Keep it updated for better customer
                            experience.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </StoreWrapper>
    );
}
