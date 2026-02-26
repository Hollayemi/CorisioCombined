import Button from "@/components/form/Button";
import OTPInput from "@/components/form/otp";
import HomeWrapper from "@/components/wrapper/user";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import PhoneNumberChanged from "./phoneNumberChanged";


export default function ChangePhoneNumber() {
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const [otpSent, setOtpSent] = useState(false)
    const [done, setDone] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isCounting, setIsCounting] = useState(false);

    useEffect(() => {
        let countdown: any;

        if (isCounting) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
            }, 1000);
        }

        return () => clearInterval(countdown);
    }, [isCounting]);

    const handleButtonClick = () => {
        setTimer(30);
        setIsCounting(true);
        setOtpSent(true)

        setTimeout(() => {
            setIsCounting(false);
        }, 30000);
    };

    return (
        <HomeWrapper active="profile" headerTitle="Change Phone Number">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <View className="flex-1">
                        {!done ? (
                            <View className="flex-1 bg-white dark:bg-slate-950 p-[5%]">
                                <Text className="font-['Poppins_500Medium'] text-base my-4 text-gray-900 dark:text-white">
                                    Previous Phone Number
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 dark:border-gray-700 px-[5%] mb-5">
                                    <Text className="font-['Poppins_500Medium'] text-xs my-4 text-gray-900 dark:text-white mr-2.5">
                                        +234
                                    </Text>
                                    <TextInput
                                        placeholder="8138956133"
                                        placeholderTextColor="#9CA3AF"
                                        className="bg-transparent font-['Poppins_500Medium'] text-sm my-4 text-gray-900 dark:text-white w-[90%]"
                                        keyboardType="number-pad"
                                        selectionColor="#1f1f1f"
                                    />
                                </View>

                                <Text className="font-['Poppins_500Medium'] text-base my-4 text-gray-900 dark:text-white">
                                    New Phone Number
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 dark:border-gray-700 px-[5%]">
                                    <Text className="font-['Poppins_500Medium'] text-xs my-4 text-gray-900 dark:text-white mr-2.5">
                                        +234
                                    </Text>
                                    <TextInput
                                        placeholder="8123456789"
                                        placeholderTextColor="#9CA3AF"
                                        className="bg-transparent font-['Poppins_500Medium'] text-sm my-4 text-gray-900 dark:text-white w-[90%]"
                                        keyboardType="number-pad"
                                        selectionColor="#1f1f1f"
                                    />
                                </View>

                                <Button className="mt-12 mb-10" onPress={handleButtonClick} isLoading={isCounting} title={isCounting ? ` Resend ( ${timer} )` : "Request Otp"} />

                                {isCounting ? <Text
                                    className={`text-gray-400 dark:text-gray-600 my-7 text-center text-lg`}
                                    onPress={handleButtonClick}
                                >
                                    {isCounting ? ` Resend ( ${timer} )` : "Request Otp"}
                                </Text> : null}

                                {(isCounting || otpSent) && (
                                    <View>
                                        <OTPInput inputRefs={inputRefs}
                                            otp={otp}
                                            setOTP={setOTP} />
                                    </View>
                                )}
                            </View>
                        ) : (
                            <PhoneNumberChanged />
                        )}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </HomeWrapper >
    );
}