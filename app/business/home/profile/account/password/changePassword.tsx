// screens/ChangePasswordScreen.tsx
import Button from '@/components/form/Button';
import ModalComponent from '@/components/modal';
import StoreWrapper from '@/components/wrapper/business';
import { logoutUser, useChangePasswordMutation } from '@/redux/business/slices/authSlices';
import { EyeClosed, EyeIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { OtpVerificationModal } from './component';

interface PasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface PasswordVisibility {
    current: boolean;
    new: boolean;
    confirm: boolean;
}

const PasswordInput: React.FC<{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    showPassword: boolean;
    onToggleVisibility: () => void;
    placeholder: string;
}> = ({ label, value, onChangeText, showPassword, onToggleVisibility, placeholder }) => (
    <View className="mb-6">
        <Text className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
        </Text>
        <View className="relative">
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className="bg-white h-12 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 pr-12 text-gray-900 dark:text-white"
            />
            <TouchableOpacity
                onPress={onToggleVisibility}
                className="absolute right-3 top-3"
            >
                {showPassword ? (
                    <EyeClosed size={20} className="text-gray-400 dark:text-gray-500" />
                ) : (
                    <EyeIcon size={20} className="text-gray-400 dark:text-gray-500" />
                )}
            </TouchableOpacity>
        </View>
    </View>
);

const ChangePasswordScreen: React.FC = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation()
    const dispatch = useDispatch()
    const [showOtpModal, setShowOtpModal] = useState<boolean>(true)
    const [passwords, setPasswords] = useState<PasswordForm>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState<PasswordVisibility>({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validatePasswords = (): boolean => {
        if (!passwords.oldPassword) {
            Alert.alert('Error', 'Please enter your current password');
            return false;
        }

        if (passwords.newPassword.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters long');
            return false;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return false;
        }

        if (passwords.oldPassword === passwords.newPassword) {
            Alert.alert('Error', 'New password must be different from current password');
            return false;
        }

        return true;
    };

    const handleChangePassword = async () => {
        if (!validatePasswords()) return;

        changePassword(passwords).then((result: any) => result.type === "success" && dispatch(logoutUser()));

        // Alert.alert(
        //     'Success',
        //     'Password changed successfully',
        //     [{
        //         text: 'OK',
        //         onPress: () => {
        //             // Navigate back or reset form
        //             setPasswords({
        //                 oldPassword: '',
        //                 newPassword: '',
        //                 confirmPassword: '',
        //             });
        //         }
        //     }]
        // );

    };

    const getPasswordStrength = (password: string): { strength: string; color: string; width: string } => {
        if (password.length === 0) return { strength: '', color: '', width: '0%' };

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 2) return { strength: 'Weak', color: 'bg-red-500', width: '25%' };
        if (score < 4) return { strength: 'Medium', color: 'bg-yellow-500', width: '50%' };
        if (score < 5) return { strength: 'Strong', color: 'bg-green-500', width: '75%' };
        return { strength: 'Very Strong', color: 'bg-green-600', width: '100%' };
    };

    const passwordStrength = getPasswordStrength(passwords.newPassword) || {};
    console.log({ passwordStrength, type: typeof passwordStrength })



    const isFormValid = passwords.oldPassword &&
        passwords.newPassword &&
        passwords.confirmPassword &&
        passwords.newPassword === passwords.confirmPassword &&
        passwords.newPassword.length >= 8;

    return (
        <StoreWrapper headerTitle="Security & Password" active='profile'>
            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                        {/* Current Password */}
                        <PasswordInput
                            label="Current Password"
                            value={passwords.oldPassword}
                            onChangeText={(text) => setPasswords(prev => ({ ...prev, oldPassword: text }))}
                            showPassword={showPassword.current}
                            onToggleVisibility={() => togglePasswordVisibility('current')}
                            placeholder="Enter your current password"
                        />

                        {/* New Password */}
                        <PasswordInput
                            label="New Password"
                            value={passwords.newPassword}
                            onChangeText={(text) => setPasswords(prev => ({ ...prev, newPassword: text }))}
                            showPassword={showPassword.new}
                            onToggleVisibility={() => togglePasswordVisibility('new')}
                            placeholder="Enter your new password"
                        />

                        {/* Password Strength Indicator */}
                        {passwords.newPassword.length > 0 && (
                            <View className="mb-4">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                                        Password Strength
                                    </Text>
                                    <Text className={`text-xs font-medium ${passwordStrength?.strength === 'Weak' ? 'text-red-500' :
                                        passwordStrength?.strength === 'Medium' ? 'text-yellow-500' :
                                            'text-green-500'
                                        }`}>
                                        {passwordStrength?.strength}
                                    </Text>
                                </View>
                                <View className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                                    {/* {passwordStrength.color && (
                                        <View
                                            className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                                            // style={{ width: passwordStrength.width }}
                                        />
                                    )} */}
                                </View>

                            </View>
                        )}

                        {/* Confirm New Password */}
                        <PasswordInput
                            label="Confirm New Password"
                            value={passwords.confirmPassword}
                            onChangeText={(text) => setPasswords(prev => ({ ...prev, confirmPassword: text }))}
                            showPassword={showPassword.confirm}
                            onToggleVisibility={() => togglePasswordVisibility('confirm')}
                            placeholder="Confirm your new password"
                        />

                        {/* Password Match Indicator */}
                        {passwords.confirmPassword.length > 0 && (
                            <View className="mb-4">
                                <Text className={`text-xs ${passwords.newPassword === passwords.confirmPassword
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {passwords.newPassword === passwords.confirmPassword
                                        ? '✓ Passwords match'
                                        : '✗ Passwords do not match'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Password Requirements */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <Text className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Password Requirements:
                        </Text>
                        <Text className="text-base text-blue-700 dark:text-blue-200 leading-8">
                            • At least 8 characters long{'\n'}
                            • Include uppercase and lowercase letters{'\n'}
                            • Include at least one number{'\n'}
                            • Include at least one special character
                        </Text>
                    </View>

                    {/* Change Password Button */}
                </View>
            </ScrollView>
            <View className='pb-4 px-4 bg-gray-50 dark:bg-gray-900'>
                <Button
                    isLoading={isLoading}
                    onPress={handleChangePassword}
                    title="Change"
                />
            </View>

            <ModalComponent
                visible={showOtpModal}
                onClose={() => setShowOtpModal(false)}
            >
                <OtpVerificationModal
                    visible={showOtpModal}
                    onClose={() => setShowOtpModal(false)}
                    onContinue={() => { }}
                    email="ore****@gmail.com"
                />
            </ModalComponent>
        </StoreWrapper>
    );
};

export default ChangePasswordScreen;