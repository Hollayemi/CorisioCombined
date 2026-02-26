import Button from '@/components/form/Button';
import OTPInput from '@/components/form/otp';
import ProgressHeader from '@/components/wrapper/business/headers/authHeader';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Keyboard, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { PageHeader } from './component';

type VerifyParams = {
    phoneNumber?: string;
    email?: string;
    type?: 'phoneVerification' | 'createAccount' | 'updatePassword';
    categories?: string;
};

export default function Verify() {
    const params = useLocalSearchParams<VerifyParams>();
    const { phoneNumber, email, type = 'phoneVerification', categories } = params;

    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const otpValue = otp.join('');
    const isDisabled = otp.includes('');

    const handleVerifyOtp = () => {
        if (type === 'phoneVerification') {
            router.push({
                pathname: '/business/auth/Signup2',
                params: {
                    phoneNumber,
                    categories,
                },
            });
            return;
        }

        if (type === 'createAccount') {
            router.push('/business/auth/Created');
            return;
        }

        router.push('/business/auth/UpdatePassword');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
                <ProgressHeader currentStep={3} totalSteps={4} />
                <View className="px-6 pt-8">
                    <PageHeader
                        title="Verify phone number"
                        subtitle={`Enter the 6-digit code sent to ${phoneNumber ? `+234 ${phoneNumber}` : email ?? 'your contact'}.`}
                    />

                    <View className="py-10 w-full">
                        <OTPInput
                            inputRefs={inputRefs}
                            otp={otp}
                            setOTP={setOTP}
                        />
                    </View>

                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-10">
                        Didn&apos;t get a code? <Text className="text-yellow-500">Resend</Text>
                    </Text>
                </View>

                <View className="mt-auto px-6 pb-10">
                    <Button
                        onPress={handleVerifyOtp}
                        title={otpValue.length === 6 ? 'Continue' : 'Enter OTP'}
                        disabled={isDisabled}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
