import Button from "@/components/form/Button";
import StoreWrapper from "@/components/wrapper/business";
import { useStoreData } from "@/hooks/useData";
import { useUpdateStoreProfileMutation } from "@/redux/business/slices/storeInfoSlice";
import { useState } from "react";
import { Alert, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { DaySelector, TimePicker } from "./components";

// types/availability.ts
interface DaysObj {
    from: string;
    to: string;
    isset: boolean;
}

export interface Days {
    monday: DaysObj;
    tuesday: DaysObj;
    wednesday: DaysObj;
    thursday: DaysObj;
    friday: DaysObj;
    saturday: DaysObj;
    sunday: DaysObj;
}


export default function Availability() {
    const [updateStore, { isLoading }] = useUpdateStoreProfileMutation()
    const { storeInfo = {}, refetchStore, storeIsLoading } = useStoreData();
    const { openingHours } = storeInfo.store || {};
    const [availability, setAvailability] = useState<Days>(openingHours);

    console.log(openingHours)

    const handleToggleDay = (day: keyof Days) => {
        setAvailability(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                isset: !prev[day]?.isset
            }
        }));
    };

    const handleTimeChange = (day: keyof Days, timeType: 'from' | 'to', newTime: string) => {
        setAvailability(prev => {
            const dayData = prev[day];
            const updatedDay = {
                ...dayData,
                [timeType]: newTime
            };

            // Validate that opening time is before closing time
            if (timeType === 'from' || timeType === 'to') {
                const fromTime = timeType === 'from' ? newTime : dayData.from;
                const toTime = timeType === 'to' ? newTime : dayData.to;

                if (fromTime >= toTime) {
                    Alert.alert(
                        'Invalid Time',
                        'Opening time must be before closing time'
                    );
                    return prev; // Don't update if invalid
                }
            }

            return {
                ...prev,
                [day]: updatedDay
            };
        });
    };

    const validateAndSave = () => {
        // Check if at least one day is selected
        const selectedDays = Object.keys(availability).filter(
            key => availability[key as keyof Days].isset
        );



        if (selectedDays.length === 0) {
            Alert.alert(
                'No Days Selected',
                'Please select at least one day for your availability'
            );
            return;
        }

        // Validate all selected days have valid times
        for (const dayKey of selectedDays) {
            const day = availability[dayKey as keyof Days];
            if (day.from >= day.to) {
                Alert.alert(
                    'Invalid Schedule',
                    `Opening time must be before closing time for ${dayKey}`
                );
                return;
            }
        }

        updateStore({ openingHours: availability }).then(() => refetchStore())

        // Log the final availability object
        console.log('Final availability:', availability);

    };

    const getActiveDays = () => {
        return Object.keys(availability).filter(
            key => availability[key as keyof Days].isset
        );
    };

    const dayLabels: Record<keyof Days, string> = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    };

    return (
        <StoreWrapper headerTitle="Edit Availability" active="profile">
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={storeIsLoading}
                        onRefresh={refetchStore}
                    />
                } className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pt-6">
                        <View className="px-6">
                            {/* Day Selection */}
                            <DaySelector
                                availability={availability}
                                onToggleDay={handleToggleDay}
                            />

                            {/* Summary of selected days */}
                            <View className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <Text className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                    Selected Days: {getActiveDays().length}
                                </Text>
                                <Text className="text-xs text-blue-700 dark:text-blue-200">
                                    {getActiveDays().length > 0
                                        ? getActiveDays().map(day => dayLabels[day as keyof Days]).join(', ')
                                        : 'No days selected'
                                    }
                                </Text>
                            </View>

                            {/* Opening Times */}
                            <View className="mb-6">
                                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Opening Time
                                </Text>
                                {Object.keys(availability).map((dayKey) => {
                                    const day = dayKey as keyof Days;
                                    return (
                                        <TimePicker
                                            key={`opening-${day}`}
                                            label={dayLabels[day]}
                                            time={availability[day]?.from || '00:00'}
                                            onTimeChange={(time) => handleTimeChange(day, 'from', time)}
                                            disabled={!availability[day].isset}
                                        />
                                    );
                                })}
                            </View>

                            {/* Closing Times */}
                            <View className="mb-6">
                                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Closing Time
                                </Text>
                                {Object.keys(availability).map((dayKey) => {
                                    const day = dayKey as keyof Days;
                                    return (
                                        <TimePicker
                                            key={`closing-${day}`}
                                            label={dayLabels[day]}
                                            time={availability[day].to || '00:00'}
                                            onTimeChange={(time) => handleTimeChange(day, 'to', time)}
                                            disabled={!availability[day].isset}
                                        />
                                    );
                                })}
                            </View>

                            {/* Schedule Preview */}
                            <View className="mb-6 p-4 py-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                                    Schedule Preview
                                </Text>
                                {Object.keys(availability).map((dayKey) => {
                                    const day = dayKey as keyof Days;
                                    const dayData = availability[day];
                                    return (
                                        <View key={day} className="flex-row justify-between items-center py-2">
                                            <Text className={`text-base ${dayData.isset
                                                ? 'text-gray-900 dark:text-white font-medium'
                                                : 'text-gray-400 dark:text-gray-600'
                                                }`}>
                                                {dayLabels[day]}
                                            </Text>
                                            <Text className={`text-base ${dayData.isset
                                                ? 'text-gray-700 dark:text-gray-300'
                                                : 'text-gray-400 dark:text-gray-600'
                                                }`}>
                                                {dayData.isset
                                                    ? `${dayData.from} - ${dayData.to}`
                                                    : 'Closed'
                                                }
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View className="px-6 pb-6 pt-4">
                    <Button title="Save Availability" isLoading={isLoading} onPress={validateAndSave} />
                </View>
            </SafeAreaView>
        </StoreWrapper>
    );
}