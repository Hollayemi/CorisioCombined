import React from "react";
import {
    Keyboard,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import Button from "@/components/form/Button";
import Input from "@/components/form/TextInput";
import { signupStep1 } from "@/config/props/auth";
import { setCredentials, useRegisterMutation } from "@/redux/user/slices/authSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import Heading, { Footer } from "./components";
import Step2ValidationSchema from "./schema/Step2.schema";


export default function Step2() {
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState("");
    const params = useLocalSearchParams<signupStep1>();
    const dispatch = useDispatch()
    const [registerHandler, { isLoading }] = useRegisterMutation()

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 px-2">
                    <Heading
                        description="We are almost there, just few more steps to go and we are good to go."
                        title="Thank you for your Patience"
                    />
                    <View className="px-4">
                        <Formik
                            validationSchema={Step2ValidationSchema}
                            initialValues={{
                                password: "",
                                confirmPassword: "",
                            }}
                            onSubmit={async (values) => {
                                setDisabled(true);
                                const payload = { ...params, password: values.password };
                                try {
                                    const result = await registerHandler(payload).unwrap()
                                    dispatch(setCredentials(result.user));
                                    router.push({ pathname: "/user/auth/Verify", params: { email: params.email, type: "createAccount" } })
                                    setDisabled(false)
                                } catch (error) {
                                    setDisabled(false)
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
                                    <View className="my-6">
                                        {message && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mb-2">
                                                {message}
                                            </Text>
                                        )}

                                        <Input
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                            label="Password"
                                            password
                                            placeholder="*********"
                                            Icon={
                                                errors.password && touched.password ? (
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
                                        {errors.password && touched.password && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                                {errors.password}
                                            </Text>
                                        )}

                                        <View className="mt-4">
                                            <Input
                                                onChangeText={handleChange("confirmPassword")}
                                                onBlur={handleBlur("confirmPassword")}
                                                value={values.confirmPassword}
                                                password
                                                placeholder="*********"
                                                label="Confirm Password"
                                                Icon={
                                                    errors.confirmPassword && touched.confirmPassword ? (
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
                                            {errors.confirmPassword && touched.confirmPassword && (
                                                <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                                    {errors.confirmPassword}
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    <View className="mt-16 mb-6">
                                        <Button
                                            title="Register"
                                            onPress={handleSubmit}
                                            disabled={!isValid || disabled || isLoading}
                                        />
                                    </View>
                                </>
                            )}
                        </Formik>
                    </View>
                    <View className="flex-1 justify-end pb-6">
                        <Footer />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}