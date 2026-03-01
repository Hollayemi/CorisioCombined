// Screen 1: Complete Registration
import Button from '@/components/form/Button';
import InputField, { SecureInputField } from '@/components/form/TextInput';
import { useStoreLoginMutation } from '@/redux/business/slices/authSlices';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { PageHeader } from './component';

interface LoginFormData {
    store: string;
    username: string;
    password: string;
}
export default function Login() {
    const router = useRouter();
    const [storeLogin, { isLoading }] = useStoreLoginMutation();
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
            await storeLogin(formData).then(() => router.push("/home"));
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="pt-6">
                    <PageHeader
                        hasImage
                        title="Welcome Back"
                        subtitle="Now that you've selected, let's set up your account so customers can find and book you easily."
                    />

                    <View className="px-6">

                        <InputField
                            label="Business Handle"
                            placeholder="Set your business handle e.g @corisio"
                            value={formData.store}
                            onChangeText={(text: string) => handleInputChange("store", text)}
                            leftPrefix="@"
                        />
                        {errors.store && (
                            <Text className="text-red-500 text-sm mt-1 ml-2">{errors.store}</Text>
                        )}
                        <InputField
                            label="Usename"
                            placeholder="Pick a username"
                            value={formData.username}
                            onChangeText={(text: string) => handleInputChange("username", text)}
                            keyboardType="phone-pad"
                            leftPrefix="+234"
                        />
                        {errors.username && (
                            <Text className="text-red-500 text-sm mt-1 ml-2">{errors.username}</Text>
                        )}
                        <SecureInputField
                            label="Password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChangeText={(text: string) => handleInputChange("password", text)}
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-sm mt-1 ml-2">{errors.password}</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            <View className="px-6 pb-6 pt-4">
                <Button title="Next" onPress={handleLogin} />
            </View>
        </SafeAreaView>
    );
};