import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface SocialButtonProps {
    provider: 'google' | 'facebook' | 'apple';
    onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
    provider,
    onPress,
}) => {
    const getProviderIcon = () => {
        switch (provider) {
            case 'facebook':
                return 'f';
            case 'google':
                return 'G';
            case 'apple':
                return '';
            default:
                return '';
        }
    };

    const getProviderColor = () => {
        switch (provider) {
            case 'facebook':
                return 'text-blue-600';
            case 'google':
                return 'text-red-500';
            case 'apple':
                return 'text-black dark:text-white';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <TouchableOpacity
            className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg items-center justify-center mx-2"
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text className={`font-bold text-lg ${getProviderColor()}`}>
                {getProviderIcon()}
            </Text>
        </TouchableOpacity>
    );
};