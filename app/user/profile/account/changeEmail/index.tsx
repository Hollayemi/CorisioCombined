import Button from "@/components/form/Button";
import OTPInput from "@/components/form/otp";
import HomeWrapper from "@/components/wrapper/user";
import { useChangeEmailMutation, useResendOtpMutation } from "@/redux/user/slices/authSlice";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import changeEmailSchema from "./schema/changeEmail.schema";

export default function ChangeEmail() {
    const [changeEmailHandler, { isLoading }] = useChangeEmailMutation()
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation()
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const checkDisable = otp.includes("");

    return (
        <HomeWrapper active="profile" headerTitle="Change Email">
            <View className="flex-1">
                <Formik
                    validationSchema={changeEmailSchema}
                    initialValues={{
                        password: "",
                        email: "",
                        confirmEmail: "",
                    }}
                    onSubmit={async (values) => {
                        resendOtp(
                            {
                                email: values.email,
                                accountType: "user",
                            },
                        );
                        setOtpSent(true)
                    }}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        isValid,
                    }) => (
                        <View className="px-[5%] pb-[5%] bg-white dark:bg-slate-950 h-full flex-col justify-between">
                            <ScrollView className="h-[80%]">
                                <Text className="font-['Poppins_500Medium'] text-large py-4 text-gray-900 dark:text-white">
                                    Your Password
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 rounded-md dark:border-gray-700 px-[5%]">
                                    <TextInput
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        className="bg-transparent font-['Poppins_500Medium'] text-large py-4 text-gray-900 dark:text-white w-[90%]"
                                        value={values.password}
                                        secureTextEntry={true}
                                        selectionColor="#1f1f1f"
                                    />
                                </View>
                                {errors.password && touched.password && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.password}
                                    </Text>
                                )}

                                <Text className="font-['Poppins_500Medium'] text-sm my-3 mt-7 text-gray-900 dark:text-white">
                                    New Email Address
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 rounded-md dark:border-gray-700 px-[5%]">
                                    <TextInput
                                        placeholder="Enter the new email"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        className="bg-transparent font-['Poppins_500Medium'] text-large py-4 text-gray-900 dark:text-white w-[90%]"
                                        value={values.email}
                                        selectionColor="#1f1f1f"
                                    />
                                </View>
                                {errors.email && touched.email && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.email}
                                    </Text>
                                )}

                                <Text className="font-['Poppins_500Medium'] text-sm my-3 mt-7 text-gray-900 dark:text-white">
                                    Confirm New Email Address
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 rounded-md dark:border-gray-700 px-[5%]">
                                    <TextInput
                                        placeholder="Confirm the new email"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleChange("confirmEmail")}
                                        onBlur={handleBlur("confirmEmail")}
                                        className="bg-transparent font-['Poppins_500Medium'] text-large py-4 text-gray-900 dark:text-white w-[90%]"
                                        value={values.confirmEmail}
                                        selectionColor="#1f1f1f"
                                    />
                                </View>
                                {errors.confirmEmail && touched.confirmEmail && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.confirmEmail}
                                    </Text>
                                )}


                                <Button className="mt-12 mb-10" onPress={() => handleSubmit()} disabled={Boolean(errors.confirmEmail)} title={!otpSent ? ` Resend OTP` : "Request Otp"} />


                                {otpSent && <View className="mt-7">
                                    <OTPInput
                                        inputRefs={inputRefs}
                                        otp={otp}
                                        setOTP={setOTP}
                                        gray={Boolean(errors.confirmEmail)}
                                    />
                                </View>}
                            </ScrollView>

                            {checkDisable ? null : (
                                <Text
                                    className={`${!isValid ? 'bg-gray-400 dark:bg-gray-600' : 'bg-indigo-900 dark:bg-indigo-800'} text-white mt-7 text-center text-lg py-4 rounded-full font-['Poppins_500Medium']`}
                                    disabled={!isValid}
                                    onPress={() => {
                                        changeEmailHandler(
                                            {
                                                newEmailAddress: values.email,
                                                password: values.password,
                                                otp: otp.join(""),
                                            },
                                        ).then(() => router.push("/user/profile/account/changeEmail/emailChanged"));
                                    }}
                                >
                                    Save Changes
                                </Text>
                            )}
                        </View>
                    )}
                </Formik>
            </View>
        </HomeWrapper>
    );
}