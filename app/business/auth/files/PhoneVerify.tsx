// app/business/auth/PhoneVerify.tsx
import Button from "@/components/form/Button";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/business/slices/authSlice";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Keyboard,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { PageHeader } from "../component";

const RESEND_COUNTDOWN = 60;
const OTP_LENGTH = 6;

export default function PhoneVerify() {
    const { phone, categories, from } = useLocalSearchParams<{
        phone: string;
        categories: string;
        from?: string;
    }>();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
    const [isCountingDown, setIsCountingDown] = useState(true);
    const [error, setError] = useState("");

    const inputRefs = useRef<(TextInput | null)[]>(Array(OTP_LENGTH).fill(null));
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // ── RTK Query mutations ─────────────────────────────────────────────────
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    // ── Countdown timer ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!isCountingDown) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsCountingDown(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isCountingDown]);

    // ── Auto-submit when all 6 digits filled ────────────────────────────────
    useEffect(() => {
        if (otp.every((d) => d !== "")) {
            handleVerify(otp.join(""));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
        ]).start();
    };

    const handleInput = (text: string, index: number) => {
        const digit = text.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError("");
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (code: string) => {
        if (isVerifying || code.length !== OTP_LENGTH) return;
        setError("");

        try {
            // POST /stores/auth/verify-otp → { phoneNumber, otp }
            // Response: { success, data: { store, token, refreshToken } }
            // setCredentials is dispatched automatically in authSlice onQueryStarted
            const response = await verifyOtp({ phoneNumber: phone, otp: code }).unwrap();

            const status = response.data?.store?.onboardingStatus;

            // Route based on where the store is in the onboarding funnel
            if (status === "verified" || from === "login") {
                router.replace("/business/home");
            } else  {
                // "phone_verified" | "registered" → go fill profile
                router.push({
                    pathname: "/business/auth/files/ProfileSetup",
                    params: { categories: categories ?? "" },
                });
            }
        } catch (err: any) {
            shake();
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();

            const status = err?.status;
            if (status === 401) {
                setError("Incorrect code. Please try again.");
            } else if (status === 410) {
                setError("This code has expired. Please request a new one.");
            } else {
                setError(err?.data?.message ?? "Verification failed. Please try again.");
            }
        }
    };

    const handleResend = async () => {
        if (isResending || isCountingDown) return;

        try {
            // POST /stores/auth/resend-otp → { phoneNumber }
            await resendOtp({ phoneNumber: phone }).unwrap();

            setOtp(Array(OTP_LENGTH).fill(""));
            setCountdown(RESEND_COUNTDOWN);
            setIsCountingDown(true);
            setError("");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err?.data?.message ?? "Failed to resend. Please try again.");
        }
    };

    const maskedPhone = phone
        ? `${phone.slice(0, 7)} *** ${phone.slice(-4)}`
        : "";

    const formatCountdown = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
                <ProgressHeader currentStep={3} />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="pt-6">
                        <PageHeader
                            title="Verify Your Number"
                            subtitle={`Enter the 6-digit code sent to ${maskedPhone}`}
                        />

                        <View className="px-6">
                            {/* ── OTP boxes ── */}
                            <Animated.View
                                style={{ transform: [{ translateX: shakeAnim }] }}
                                className="flex-row justify-between mt-4 mb-2"
                            >
                                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                                    <TextInput
                                        key={i}
                                        ref={(ref) => { inputRefs.current[i] = ref; }}
                                        value={otp[i]}
                                        onChangeText={(t) => handleInput(t, i)}
                                        onKeyPress={({ nativeEvent }) =>
                                            handleKeyPress(nativeEvent.key, i)
                                        }
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        textContentType="oneTimeCode"
                                        selectTextOnFocus
                                        className={`w-[48px] h-[56px] rounded-2xl border-2 text-center text-[22px] font-bold
                                            ${otp[i]
                                                ? "border-[#2A347E] dark:border-[#FDB415] bg-blue-50 dark:bg-yellow-950 text-[#2A347E] dark:text-[#FDB415]"
                                                : error
                                                    ? "border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950 text-red-500"
                                                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                            }`}
                                    />
                                ))}
                            </Animated.View>

                            {error ? (
                                <Text className="text-red-500 dark:text-red-400 text-[13px] text-center mt-2">
                                    {error}
                                </Text>
                            ) : null}

                            {/* ── Countdown / Resend ── */}
                            <View className="flex-row justify-center mt-6">
                                <Text className="text-gray-500 dark:text-gray-400 text-[14px]">
                                    Didn't receive a code?{" "}
                                </Text>
                                {isCountingDown ? (
                                    <Text className="text-[14px] font-semibold text-gray-400 dark:text-gray-500">
                                        Resend in {formatCountdown(countdown)}
                                    </Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResend} disabled={isResending}>
                                        <Text className="text-[14px] font-semibold text-[#2A347E] dark:text-[#FDB415]">
                                            {isResending ? "Sending…" : "Resend OTP"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* ── Manual verify button (fallback if auto-submit fails) ── */}
                            <View className="mt-8">
                                <Button
                                    title="Verify"
                                    onPress={() => handleVerify(otp.join(""))}
                                    isLoading={isVerifying}
                                    loadingText="Verifying…"
                                    disabled={isVerifying || otp.some((d) => d === "")}
                                />
                            </View>

                            {/* ── Wrong number ── */}
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="mt-5 self-center"
                            >
                                <Text className="text-[13px] text-gray-500 dark:text-gray-400 text-center">
                                    Wrong number?{" "}
                                    <Text className="text-[#2A347E] dark:text-[#FDB415] font-semibold">
                                        Change it
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
