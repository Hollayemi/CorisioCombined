import Button from "@/components/form/Button";
import OTPInput from "@/components/form/otp";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/user/slices/authSlice";
import { RouteProp } from "@react-navigation/native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, SafeAreaView, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import Heading from "./components";

type props = {
    email: string;
    type: 'createAccount' | "updatePassword";
}
type ParamsList = {
    verify: props;
};

type VerifyProp = RouteProp<ParamsList, 'verify'>;

// Countdown duration in seconds
const RESEND_COUNTDOWN = 60;

export default function Verify({ route }: { route: VerifyProp }) {
    const params = useLocalSearchParams<props>()
    const { type, email } = params;
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [message, setMessage] = React.useState("");
    const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
    const [isCountdownActive, setIsCountdownActive] = useState(true);

    const checkDisable = otp.includes("");
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation()

    // Countdown timer effect
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (isCountdownActive && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsCountdownActive(false);
        }

        return () => clearTimeout(timer);
    }, [countdown, isCountdownActive]);

    const handleResendOtp = async () => {
        try {
            await resendOtp({ email, accountType: "user" }).unwrap();
            setCountdown(RESEND_COUNTDOWN);
            setIsCountdownActive(true);
            setMessage("New OTP sent successfully!");
        } catch (error) {
            setMessage("Failed to resend OTP. Please try again.");
        }
    };

    const redirectType: any = {
        createAccount: "/auth/created",
        updatePassword: "/auth/UpdatePassword"
    }

    const handleVerifyOtp = async (otp: string, type: string) => {
        try {
            if (type === "createAccount") {
                await verifyOtp({ otp, email }).unwrap()
                router.push("/user/auth/created");
            } else if (type === "updatePassword") {
                const result = await verifyOtp({ otp, email, returnToken: true }).unwrap()
                router.push({ pathname: "/user/auth/UpdatePassword", params: { token: result.token, email } });
            }


        } catch (error) {
        } finally {
            setOTP(["", "", "", "", "", ""]);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 px-5 items-center">
                <View className="w-full mt-10">
                    <Heading
                        description="A verification code has been sent to your email, check it and use the code to verify your account."
                        title="Verify your email"
                    />
                </View>

                {message && isCountdownActive && (
                    <Text className="text-xs text-green-500 dark:text-gray-100 mt-2">
                        {message}
                    </Text>
                )}

                <View className="py-10 w-full">
                    <OTPInput
                        inputRefs={inputRefs}
                        otp={otp}
                        setOTP={setOTP}
                    />
                </View>

                <Text className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center">
                    <Text>Didn't receive code? </Text>
                    {isCountdownActive ? (
                        <Text className="text-gray-500">
                            Resend in {countdown}s
                        </Text>
                    ) : (
                        <Text
                            className="text-[#2A347E] dark:text-indigo-400"
                            onPress={handleResendOtp}
                            disabled={resending}
                        >
                            {resending ? "Sending..." : "Resend"}
                        </Text>
                    )}
                </Text>
                <View className="absolute bottom-20 w-full px-4" style={{ bottom: 100 }}>
                    <Button
                        onPress={() => handleVerifyOtp(otp.join(""), type)}
                        title="Verify"
                        disabled={checkDisable || isLoading || resending}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}