
// components/form/TextInput.tsx
import { ChevronDownCircleIcon, ChevronUpCircleIcon } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

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


interface DaySelectorProps {
    availability: Days;
    onToggleDay: (day: keyof Days) => void;
}

export function DaySelector({ availability, onToggleDay }: DaySelectorProps) {
    const days: { key: keyof Days; label: string }[] = [
        { key: 'sunday', label: 'Sunday' },
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
    ];

    return (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Available Days
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {days.map((day) => (
                    <TouchableOpacity
                        key={day.key}
                        onPress={() => onToggleDay(day.key)}
                        className={`px-4 py-2 rounded-full border ${availability[day.key]?.isset
                            ? 'bg-yellow-400 border-yellow-400'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${availability[day.key]?.isset
                                ? 'text-black'
                                : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {day.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

// Time Picker Component with increment/decrement functionality
interface TimePickerProps {
    label: string;
    time: string;
    onTimeChange: (time: string) => void;
    disabled?: boolean;
}

export function TimePicker({ label, time, onTimeChange, disabled = false }: TimePickerProps) {
    const incrementTime = () => {
        if (disabled) return;

        const [hours, minutes] = time.split(':').map(Number);
        let newHours = hours;
        let newMinutes = minutes + 30; // Increment by 30 minutes

        if (newMinutes >= 60) {
            newMinutes = 0;
            newHours += 1;
        }

        if (newHours >= 24) {
            newHours = 0;
        }

        const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        onTimeChange(newTime);
    };

    const decrementTime = () => {
        if (disabled) return;

        const [hours, minutes] = time.split(':').map(Number);
        let newHours = hours;
        let newMinutes = minutes - 30; // Decrement by 30 minutes

        if (newMinutes < 0) {
            newMinutes = 30;
            newHours -= 1;
        }

        if (newHours < 0) {
            newHours = 23;
        }

        const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        onTimeChange(newTime);
    };

    const formatDisplayTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const isDark = useColorScheme() === 'dark'

    return (
        <View className={`flex-row items-center justify-between py-3 ${disabled ? 'opacity-50' : ''
            }`}>
            <Text className="text-base text-gray-700 dark:text-gray-300 flex-1">
                {label}
            </Text>
            <View className="flex-row items-center">
                <TouchableOpacity
                    className="p-2"
                    onPress={incrementTime}
                    disabled={disabled}
                >
                    <ChevronUpCircleIcon
                        size={20}
                        color={disabled ? isDark ? "#eee" : "#333" : isDark ? "#eee" : "#333"}
                    />
                </TouchableOpacity>
                <Text className="text-base w-16 font-medium text-gray-900 dark:text-white mx-4 min-w-[80px] text-center">
                    {formatDisplayTime(time)}
                </Text>
                <TouchableOpacity
                    className="p-2"
                    onPress={decrementTime}
                    disabled={disabled}
                >
                    <ChevronDownCircleIcon
                        size={20}
                        color={disabled ? isDark ? "#eee" : "#333" : isDark ? "#eee" : "#333"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
