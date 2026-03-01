import Button from '@/components/form/Button';
import InputField, { SecureInputField } from '@/components/form/storeTextInputs';
import { useStoreData } from '@/hooks/useData';
import { useStoreLoginMutation } from '@/redux/business/slices/authSlices';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Pattern, { PhoneNumber } from './component';


// Social Login Button Component
export const SocialButton = ({ icon, label, onPress, backgroundColor = "bg-white" }: any) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`${backgroundColor} dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-6 flex-row items-center justify-center mb-3`}
        >
            <Ionicons name={icon} size={20} color="#4285F4" />
            <Text className="text-gray-700 dark:text-gray-300 font-medium ml-3">
                {label}
            </Text>
        </TouchableOpacity>
    );
};


interface LoginFormData {
    store: string;
    username: string;
    password: string;
}
// Main Login Screen Component
export const LoginScreen = () => {
    const [storeLogin, { isLoading }] = useStoreLoginMutation();
    const { refetchStore } = useStoreData()
    const insets = useSafeAreaInsets();
    const [formData, setFormData] = useState<LoginFormData>({
        store: "",
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState<Partial<LoginFormData>>({});

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormData> = {};

        if (!formData.store.trim()) {
            newErrors.store = "Store name is required";
        }

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (validateForm()) {
            await storeLogin(formData).then((res: any) => {
                if (res?.data?.type === "success") {
                    refetchStore()
                    router.push("/business/home")
                }
            });
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login');
    };

    const handleFacebookLogin = () => {
        console.log('Facebook login');
    };

    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-[#2A347E] dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="w-full h-20 opacity-40 absolute">
                    <Pattern />
                </View>
                <ScrollView
                    className="flex-1 "
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View className="flex-1 justify-end  pt-12 ">

                        <View className="mb-12 px-6">
                            <Text className="text-4xl font-bold text-white dark:text-white mb-4 leading-tight">
                                Welcome Back
                            </Text>
                            <Text className="text-[13px] text-white dark:text-gray-300 leading-relaxed">
                                Changing and easing the way you connect with professional services and order food.
                            </Text>
                        </View>

                        {/* Login Form */}
                        <View className="bg-white dark:bg-gray-800 rounded-t-3xl py-4 shadow-lg">
                            <PhoneNumber
                                pathname="/business/auth/files/PhoneVerify"
                                data={{ from: "login" }}
                            />
                            
                            

                            {/* Register Link */}
                            <View className="flex-row justify-center pt-4">
                                <Text className="text-gray-600 dark:text-gray-400">
                                    Don't have an account?{' '}
                                </Text>
                                <TouchableOpacity onPress={() => router.push('/business/auth/Category')}>
                                    <Text className="!text-yellow-500 dark:text-white font-semibold">
                                        Register
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={{ height: insets.bottom }} className="bg-white dark:bg-gray-800" />
        </SafeAreaView>
    );
};

// Usage Example
export default function App() {
    return <LoginScreen />;
}