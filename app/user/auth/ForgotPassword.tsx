import React from "react";
import { SafeAreaView, Text, TouchableWithoutFeedback, View } from "react-native";

import Button from "@/components/form/Button";
import Input from "@/components/form/TextInput";
import { useForgotPasswordMutation } from "@/redux/user/slices/authSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import { Keyboard } from "react-native";
import Heading from "./components";
import ForgetPasswordValidationSchema from "./schema/ForgetPassword.schema";

export default function ForgetPassword({ navigation }: any) {
    const [sendEmail, { isLoading }] = useForgotPasswordMutation()

    interface PopupProps {
        message: string;
        type?: string;
    }

    const [message, setMessage] = React.useState("");
    const [pop, setPopMessage] = React.useState<PopupProps | null>(null);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 px-2">

                <Heading
                    description="Lost your password? Don't worry, Enter your email to receive an OTP for password reset"
                    title="Forgot Password"
                />

                <Formik
                    validationSchema={ForgetPasswordValidationSchema}
                    initialValues={{
                        email: "",
                    }}
                    onSubmit={async (values) => {
                        try {
                            await sendEmail({
                                email: values.email
                            }).unwrap()
                            router.push({ pathname: "/user/auth/Verify", params: { email: values.email, type: "updatePassword", returnToken: "true" } })
                        } catch (error) {
                        }
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
                        <>
                            <View className="my-6 px-5">
                                {message && (
                                    <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mb-2">
                                        {message}
                                    </Text>
                                )}

                                <Input
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                    label="Email"
                                    placeholder="creativebox@gmail.com"
                                    Icon={
                                        errors.email && touched.email ? (
                                            <MaterialIcons
                                                name="error-outline"
                                                size={24}
                                                color="red"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={24}
                                                color="#233974 dark:#818CF8"
                                            />
                                        )
                                    }
                                />
                                {errors.email && touched.email && (
                                    <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                        {errors.email}
                                    </Text>
                                )}
                            </View>
                            <View className="absolute bottom-20" style={{ bottom: 60 }}>
                                <View className="mt-16 mb-6 px-4">
                                    <Button
                                        title="Submit"
                                        onPress={handleSubmit}
                                        disabled={!isValid || isLoading}
                                    />
                                </View>

                                <Text
                                    className="text-[#2A347E] dark:text-indigo-400 text-center text-sm font-medium my-5"
                                    onPress={() => router.push("/user/auth/Login")}
                                >
                                    Back to Log In
                                </Text>
                            </View>
                        </>
                    )}
                </Formik>
            </SafeAreaView >
        </TouchableWithoutFeedback>
    );
}