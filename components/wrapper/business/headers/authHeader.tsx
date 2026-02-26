
// Header Component with Progress Steps
import Pattern from '@/components/pattern';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

/**
 * ProgressHeader Component
 * Displays a header with a back button and a progress bar indicating the current step in a multi-step process.
 *
 * @param {Object} props - Component properties
 * @param {number} props.currentStep - The current step in the process (1-indexed)
 * @param {number} props.totalSteps - The total number of steps in the process
 * @param {Function} props.onBack - Callback function to handle back navigation
 */

interface ProgressHeaderProps {
    currentStep?: number;
    totalSteps?: number;
    onBack?: () => void;
}

export default function ProgressHeader({ currentStep = 1, totalSteps = 5, onBack }: ProgressHeaderProps) {
    return (
        <View className="flex-row items-center justify-between px-4 py-4 bg-white dark:bg-gray-900">
            <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
                <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:!text-white" />
            </TouchableOpacity>

            <View className="flex-1 mx-4">
                <View className="flex-row items-center rounded-full overflow-hidden bg-gray-200 h-1.5">
                    <View
                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        className="h-1.5 bg-yellow-500"
                    />

                    {/* {Array.from({ length: totalSteps }, (_, index) => (
                        <React.Fragment key={index}>
                            <View
                                className={`h-1.5 flex-1  ${index < currentStep ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            />
                            {index < totalSteps - 1 && <View className="w-2" />}
                        </React.Fragment>
                    ))} */}
                </View>
            </View>
            <View className="w-full  absolute">
                <Pattern />
            </View>
            <View className="w-10 " />
        </View>
    );
};
