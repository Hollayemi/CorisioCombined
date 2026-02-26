import React, { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, useColorScheme, View } from "react-native";
import { JSX } from "react/jsx-runtime";

type ButtonVariant = 'filled' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

type ButtonProps = {
    onPress: () => void;
    title: string | ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    IconAfter?: JSX.Element;
    IconBefore?: JSX.Element;
    mystyles?: object;
    className?: string;
    textSize?: number;
    textColor?: string;
    isLoading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
};

export default function Button({
    onPress,
    title,
    variant = 'filled',
    size = 'medium',
    IconAfter,
    IconBefore,
    disabled = false,
    mystyles,
    className = '',
    textSize,
    isLoading = false,
    loadingText,
    textColor,
    fullWidth = false,
}: ButtonProps) {

    // Size configurations
    const sizeConfig = {
        small: {
            height: 'h-[40px]',
            padding: 'py-2 px-4',
            fontSize: 14,
            iconSpacing: 'mr-2 ml-2'
        },
        medium: {
            height: 'h-[50px]',
            padding: 'py-3 px-6',
            fontSize: 15,
            iconSpacing: 'mr-3 ml-3'
        },
        large: {
            height: 'h-[56px]',
            padding: 'py-4 px-8',
            fontSize: 16,
            iconSpacing: 'mr-3 ml-3'
        }
    };

    const isDark = useColorScheme() === 'dark'
    const currentSize = sizeConfig[size];

    // Base styles
    const baseStyles = `rounded-full flex-row items-center justify-center ${currentSize.height} ${currentSize.padding} ${fullWidth ? 'w-full' : ''}`;

    // Variant styles
    const getVariantStyles = () => {
        if (disabled || isLoading) {
            if (variant === 'outline') {
                return 'bg-transparent border-2 border-gray-300 dark:border-gray-600';
            }
            return 'bg-gray-300 dark:bg-gray-700';
        }

        switch (variant) {
            case 'outline':
                return 'bg-transparent border-2 border-[#2A347E] dark:border-[#FDB415]';
            case 'filled':
            default:
                return 'bg-[#2A347E] dark:bg-[#FDB415]';
        }
    };

    // Text color based on variant and state
    const getTextColor = () => {
        if (textColor) return textColor;

        if (disabled || isLoading) {
            return variant === 'outline' ? '#9CA3AF' : '#6B7280';
        }

        return variant === 'outline' ? '#2A347E' : '#FFFFFF';
    };

    const getDarkTextColor = () => {
        if (textColor) return textColor;

        if (disabled || isLoading) {
            return variant === 'outline' ? '#6B7280' : '#9CA3AF';
        }

        return variant === 'outline' ? '#FDB415' : '#000';
    };

    // Loading indicator color
    const getLoadingColor = () => {
        if (disabled) return '#9CA3AF';
        return variant === 'outline' ? '#FDB415' : '#FFFFFF';
    };

    const getDarkLoadingColor = () => {
        if (disabled) return '#6B7280';
        return variant === 'outline' ? '#FDB415' : '#FFFFFF';
    };

    return (
        <Pressable
            className={`${baseStyles} ${getVariantStyles()} ${className}`}
            style={[
                {
                    opacity: (disabled || isLoading) ? 0.6 : 1,
                },
                mystyles
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            {/* Before Icon */}

            <View className={IconAfter || title ? currentSize.iconSpacing.split(' ')[0] : 'invisible w-14'}>
                {IconBefore && !isLoading && IconBefore}
            </View>


            {/* Loading Indicator */}
            {isLoading ? (
                <View className="flex-row items-center">
                    <ActivityIndicator
                        size="small"
                        color={getLoadingColor()}
                        className="dark:hidden"
                    />
                    <ActivityIndicator
                        size="small"
                        color={getDarkLoadingColor()}
                        className="hidden dark:flex"
                    />
                    {loadingText && (
                        <Text
                            className="ml-2 font-semibold"
                            style={{
                                fontSize: textSize || currentSize.fontSize,
                                color: getTextColor(),
                            }}
                        >
                            {loadingText}
                        </Text>
                    )}
                </View>
            ) : (
                <>
                    {/* Title */}
                    <Text
                        className={`font-semibold text-center ${(IconBefore || IconAfter) ? 'flex-1' : ''
                            }`}
                        style={{
                            fontSize: textSize || currentSize.fontSize,
                            color: getTextColor(),
                        }}
                    >
                        {!isDark && <Text className="dark:!hidden">{title}</Text>}
                        {isDark && <Text
                            className="dark:flex"
                            style={{ color: getDarkTextColor() }}
                        >
                            {title}
                        </Text>}
                    </Text>

                    {/* After Icon */}

                    <View className={IconBefore || title ? currentSize.iconSpacing.split(' ')[1] : 'invisible w-4 '}>
                        {IconAfter && IconAfter}
                    </View>

                </>
            )}
        </Pressable>
    );
}
