
import { Ionicons } from '@expo/vector-icons';
import React, {  } from 'react';
import {
    TouchableOpacity,
    View
} from 'react-native';

export const CustomCheckbox = ({
    checked,
    indeterminate = false,
    onPress,
    size = 'medium'
}: any) => {
    const sizeClasses = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`${sizeClasses} border-2 rounded mr-3 items-center justify-center ${checked || indeterminate
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}
        >
            {checked && (
                <Ionicons name="checkmark" size={size === 'small' ? 10 : 12} color="white" />
            )}
            {indeterminate && !checked && (
                <View className="w-2 h-0.5 bg-white" />
            )}
        </TouchableOpacity>
    );
};
