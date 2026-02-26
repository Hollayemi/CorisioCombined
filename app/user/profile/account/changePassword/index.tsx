import Button from "@/components/form/Button";
import OTPInput from "@/components/form/otp";
import HomeWrapper from "@/components/wrapper/user";
import { useUserData } from "@/hooks/useData";
import { useChangePasswordMutation, useResendOtpMutation } from "@/redux/user/slices/authSlice";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import changePasswordSchema from "./schema/changePassword.schema";

export default function ChangePhoneNumber() {
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation()
    const [changePasswordHandler, { isLoading: changing }] = useChangePasswordMutation()
    const dispatch = useDispatch();
    const [isCounting, setIsCounting] = useState(false);
    const [otpSent, setOtpSent] = useState(false)
    const { userInfo } = useUserData() as any;
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const checkDisable = otp.includes("");

    return (
        <HomeWrapper active="profile" headerTitle="Change Password">
            <View className="flex-1">
                <Formik
                    validationSchema={changePasswordSchema}
                    initialValues={{
                        oldPassword: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={async (values) => {
                        resendOtp(
                            {
                                email: userInfo.email,
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
                                <Text className="font-['Poppins_500Medium'] text-base my-3 pb-1 text-gray-900 dark:text-white">
                                    Old Password
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 rounded-md dark:border-gray-700 px-[5%]">
                                    <TextInput
                                        placeholder="**********"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleChange("oldPassword")}
                                        onBlur={handleBlur("oldPassword")}
                                        className="bg-transparent font-['Poppins_500Medium'] text-lg my-3 pb-1 text-gray-900 dark:text-white w-[90%]"
                                        value={values.oldPassword}
                                        secureTextEntry={true}
                                        selectionColor="#1f1f1f"
                                    />
                                </View>
                                {errors.oldPassword && touched.oldPassword && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.oldPassword}
                                    </Text>
                                )}

                                <Text className="font-['Poppins_500Medium'] text-base mt-7 mb-3 text-gray-900 dark:text-white">
                                    New Password
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 rounded-md dark:border-gray-700 px-[5%]">
                                    <TextInput
                                        placeholder="**********"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        className="bg-transparent font-['Poppins_500Medium'] text-lg my-3 pb-1 text-gray-900 dark:text-white w-[90%]"
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

                                <Text className="font-['Poppins_500Medium'] text-base mt-7 mb-3 text-gray-900 dark:text-white">
                                    Confirm New Password
                                </Text>
                                <View className="flex-row w-full items-center border border-gray-200 rounded-md dark:border-gray-700 px-[5%]">
                                    <TextInput
                                        placeholder="Enter the new password"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                        className="bg-transparent font-['Poppins_500Medium'] text-lg my-3 pb-1 text-gray-900 dark:text-white w-[90%]"
                                        value={values.confirmPassword}
                                        secureTextEntry={true}
                                        selectionColor="#1f1f1f"
                                    />
                                </View>
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.confirmPassword}
                                    </Text>
                                )}

                                <Button className="mt-12 mb-10" onPress={() => handleSubmit()} disabled={Boolean(errors.confirmPassword)} title={!otpSent ? ` Resend OTP` : "Request Otp"} />


                                {otpSent && <View className="mt-7">
                                    <OTPInput
                                        inputRefs={inputRefs}
                                        otp={otp}
                                        setOTP={setOTP}
                                        gray={Boolean(errors.confirmPassword)}
                                    />
                                </View>}
                            </ScrollView>

                            {checkDisable ? null : (
                                <Text
                                    className={`${!isValid ? 'bg-gray-400 dark:bg-gray-600' : 'bg-indigo-900 dark:bg-indigo-800'} text-white mt-7 text-center text-lg py-3 rounded-full font-['Poppins_500Medium']`}
                                    disabled={!isValid}
                                    onPress={() => {
                                        changePasswordHandler(
                                            {
                                                oldPassword: values.oldPassword,
                                                confirmPassword: values.confirmPassword,
                                                newPassword: values.password,
                                                isMobile: true,
                                            }
                                        ).then(() => router.push("/user/profile/account/changePassword/passwordChanged"));
                                    }}
                                >
                                    Change password
                                </Text>
                            )}
                        </View>
                    )}
                </Formik>
            </View>
        </HomeWrapper>
    );
}