import { Ionicons } from "@expo/vector-icons";
import { ChevronDownCircleIcon, ChevronUpCircleIcon } from "lucide-react-native";
import React, { ReactNode, useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

type prop = {
    placeholder: string;
    label: string;
    password?: boolean;
    others?: TextInputProps;
    keyboardType?: TextInputProps['keyboardType'];
    leftPrefix?: string;
    Icon?: ReactNode;
    multiline?: boolean;
    value: string;
    isValid?: boolean;
    error?: string | undefined;
    showStrengthIndicator?: boolean;
    onRightIconPress?: () => void;
    onChangeText: any;
    className?: string;
    onBlur?: any;
};

export default function InputField({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    leftPrefix,
    multiline = false,
    Icon,
    error = '',
    className = '',
    onRightIconPress,
    ...props
}: prop) {
    return (
        <View className={`mb-6 ${className}`}>
            <View className="flex-row items-center justify-between">
                <Text className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </Text>

            </View>
            <View className="relative">
                <View className="flex-row items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                    {leftPrefix && (
                        <View className="px-4 pr-0 py-4 ">
                            <Text className="text-gray-600 text-[15px] dark:text-gray-400 font-medium">
                                {leftPrefix}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        className={`flex-1 px-4 py-4 h-14 text-gray-900 dark:text-white text-[15px] ${multiline && 'h-60'}`}
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        multiline={multiline}
                        {...props}
                    />
                    {Icon && (
                        <TouchableOpacity onPress={onRightIconPress} className="px-4 py-4">
                            {Icon}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {error && <Text className="text-[12px] font-medium text-red-500 dark:text-gray-300 mt-1 -mb-2 !text-right">
                {error}
            </Text>}
        </View>
    );
};


export function Input2({
    placeholder,
    password,
    Icon,
    others = {},
    value,
    onChangeText,
    label,
    multiline,
    onBlur,
}: prop) {
    return (
        <View className="flex-row items-center justify-between rounded my-1 mt-5 w-full">
            <View className="flex-1">
                <Text className="text-[16px] text-[#7C7C7C] mb-2.5">{label}</Text>
                <View className="relative">
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        className="bg-transparent border border-[#C5C5C5] rounded p-4 text-[#424242] text-lg font-medium"
                        secureTextEntry={password ? true : false}
                        {...others}
                    />
                    {Icon && (
                        <View className="absolute right-3 top-4">
                            {Icon}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}


interface DaySelectorProps {
    days: string[];
    selectedDays: string[];
    onToggleDay: (day: string) => void;
}

export function DaySelector({ days, selectedDays, onToggleDay }: DaySelectorProps) {
    return (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Available Days
            </Text>
            <View className="flex-row flex-wrap gap-2">
                {days.map((day) => (
                    <TouchableOpacity
                        key={day}
                        onPress={() => onToggleDay(day)}
                        className={`px-4 py-2 rounded-full border ${selectedDays.includes(day)
                            ? 'bg-yellow-400 border-yellow-400'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        <Text
                            className={`text-sm font-medium ${selectedDays.includes(day)
                                ? 'text-black'
                                : 'text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {day}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// Time Picker Component
interface TimePickerProps {
    label: string;
    time: string;
    onTimeChange: (time: string) => void;
}
export function TimePicker({ label, time, onTimeChange }: TimePickerProps) {
    return (
        <View className="flex-row items-center justify-between py-3">
            <Text className="text-base text-gray-700 dark:text-gray-300 flex-1">
                {label}
            </Text>
            <View className="flex-row items-center">
                <TouchableOpacity className="p-2">
                    <ChevronUpCircleIcon size={20} className="text-gray-400" />
                </TouchableOpacity>
                <Text className="text-base font-medium text-gray-900 dark:text-white mx-4 min-w-[60px] text-center">
                    {time}
                </Text>
                <TouchableOpacity className="p-2">
                    <ChevronDownCircleIcon size={20} className="text-gray-400" />
                </TouchableOpacity>
            </View>
        </View>
    );
};




// Password Strength Indicator Component
export const PasswordStrengthIndicator = ({ password, isValid }: { password: string; isValid: boolean }) => {
    const requirements = [
        {
            text: 'At least 8 characters',
            met: password.length >= 8
        },
        {
            text: 'A mix of uppercase & lowercase letters',
            met: /[a-z]/.test(password) && /[A-Z]/.test(password)
        },
        {
            text: 'At least one number (0-9)',
            met: /\d/.test(password)
        },
        {
            text: 'At least one special character (@, #, $, etc.)',
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }
    ];
    const getStrength = () => {
        if (!password) return 0;
        if (password.length < 4) return 1;
        if (password.length < 6) return 2;
        if (password.length >= 8) return 3;
        return 3;
    };

    const strength = getStrength();

    return (
        <View className="flex-row gap-2 mt-2 mb-4 px-2">
            {[0, 1, 2, 3].map((level) => (
                <View
                    key={level}
                    className={`flex-1 h-1 rounded-full ${level <= strength ? isValid ? 'bg-green-500' : 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                />
            ))}
        </View>
    );
};

// Password Requirements Component
export const PasswordRequirements = ({ password }: { password: string }) => {
    const requirements = [
        {
            text: 'At least 8 characters',
            met: password.length >= 8
        },
        {
            text: 'A mix of uppercase & lowercase letters',
            met: /[a-z]/.test(password) && /[A-Z]/.test(password)
        },
        {
            text: 'At least one number (0-9)',
            met: /\d/.test(password)
        },
        {
            text: 'At least one special character (@, #, $, etc.)',
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        }
    ];

    return (
        <View className="mt-6">
            {requirements.map((req, index) => (
                <View key={index} className="flex-row items-center mb-3">
                    <View
                        className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${req.met
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                    >
                        {req.met && (
                            <Ionicons name="checkmark" size={12} color="white" />
                        )}
                    </View>
                    <Text
                        className={`text-sm ${req.met
                            ? 'text-green-600 dark:text-green-400 font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                            }`}
                    >
                        {req.text}
                    </Text>
                </View>
            ))}
        </View>
    );
};

// Secure Input Field Component (extends InputField)
export const SecureInputField = ({
    label,
    placeholder,
    value,
    error = '',
    className,
    onChangeText,
    isValid = false,
    showStrengthIndicator = false,
    ...props
}: prop) => {
    const [isSecure, setIsSecure] = useState(true);

    return (
        <View className={`mb-4 ${className}`}>
            <View className="flex-row items-center justify-between">
                <Text className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </Text>
            </View>
            <View className="relative">
                <View className="flex-row items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <TextInput
                        className="flex-1 px-4 py-4 text-gray-900 dark:text-white !text-[19px]"
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={isSecure}
                        {...props}
                    />
                    <TouchableOpacity
                        onPress={() => setIsSecure(!isSecure)}
                        className="px-4 py-4"
                    >
                        <Ionicons
                            name={isSecure ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            className="text-gray-400"
                        />
                    </TouchableOpacity>
                </View>
                {error && <Text className="text-[12px] font-medium text-red-500 dark:text-gray-300 mt-1 -mb-2 !text-right">
                    {error}
                </Text>}
            </View>
            {showStrengthIndicator && <PasswordStrengthIndicator isValid={isValid} password={value} />}
        </View>
    );
};
