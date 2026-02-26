import Button from "@/components/form/Button";
import OTPInput from "@/components/form/otp";
import { useUpdateStaffDetailsMutation } from "@/redux/business/slices/staffSlice";
import { useRef, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface TwoFactorSetupModalProps {
    visible: boolean;
    currently: boolean;
    onClose: () => void;
    refetchStaff: any;
}

export default function TwoFactorSetupModal({ visible, onClose, currently, refetchStaff }: TwoFactorSetupModalProps) {
    const [updateStaffDetails, { isLoading }] = useUpdateStaffDetailsMutation()
    if (!visible) return null;


    return (
        <View className="p-4">
            {/* Illustration */}
            <View className="items-center mb-6">
                <Image source={require("@/assets/images/2fa.png")} className="w-60 h-36" />
            </View>

            {/* Content */}
            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Set up 2FA for your account
            </Text>

            <Text className="text-base text-gray-600 dark:text-gray-300 text-center mb-8 leading-8">
                Activate two factor authentication to have an extra layer of security on your account.
                Transactions and login will require otp from email to proceed.
            </Text>



            <Button
                className="!mt-0"
                size="small"
                title={!currently ? "Activate Now" : "Deactivate"}
                onPress={() => { updateStaffDetails({ two_fa: !currently }).then(() => refetchStaff()); onClose() }}
            />
        </View>
    );
};


interface OtpVerificationModalProps {
    visible: boolean;
    onClose: () => void;
    onContinue: (otp: string) => void;
    email: string;
}

// OTP Verification Modal Content
export function OtpVerificationModal({ visible, onClose, onContinue, email }: OtpVerificationModalProps) {
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    if (!visible) return null;

    const handleResendCode = () => {
        console.log('Resending OTP code');
    };

    // const handleContinue = () => {
    //     onContinue(otp);
    // };

    return (
        <View className="p-4">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white  mb-6">
                Otp Verification
            </Text>

            <Text className="text-base text-gray-600 dark:text-gray-300  mb-2">
                A 4 - digit verification has been sent to your email address
            </Text>

            <Text className="text-base font-medium text-gray-900 dark:text-white  mb-8">
                {email}
            </Text>

            {/* OTP Input - Using your OTP component */}
            <View className="mb-6">
                <View className=" w-full">
                    <OTPInput
                        inputRefs={inputRefs}
                        otp={otp}
                        setOTP={setOTP}
                    />
                </View>
            </View>

            <View className="flex-row justify-center items-center mb-8">
                <Text className="text-center text-base text-gray-600 dark:text-gray-300">
                    You didn't receive any code?{' '}
                </Text>
                <TouchableOpacity onPress={handleResendCode}>
                    <Text className="text-orange-500 font-medium ml-2">Resend Code</Text>
                </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <Button onPress={() => { }} className="!mx-0" title="Continue" />

        </View>
    );
};
