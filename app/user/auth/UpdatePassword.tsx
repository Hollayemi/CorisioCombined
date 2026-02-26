import Button from "@/components/form/Button";
import Input from "@/components/form/TextInput";
import { logoutUser, useResetPasswordMutation } from "@/redux/user/slices/authSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
    Keyboard,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useDispatch } from "react-redux";
import Heading from "./components";
import Step2ValidationSchema from "./schema/Step2.schema";

type props = {
    email: string;
    token: string
}
export default function UpdatePassword() {
    const params = useLocalSearchParams<props>()
    const { token, email } = params;
    const dispatch = useDispatch()
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 px-2">
                <View className="">
                    <Heading
                        description="Since you have verified your email, all left now is to update your password."
                        title="Update Password"
                    />
                </View>

                <Formik
                    validationSchema={Step2ValidationSchema}
                    initialValues={{
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={async (values) => {
                        setDisabled(true);
                        try {
                            await resetPassword({ token, email, password: values.password }).unwrap()
                            dispatch(logoutUser())
                            router.push("/user/home");
                        } catch (error) {
                        } finally {
                            setDisabled(false);
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
                            <View className="my-4 px-4">
                                {disabled && (
                                    <></>
                                )}
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
                                            errors.confirmPassword &&
                                                touched.confirmPassword ? (
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
                                    {errors.confirmPassword &&
                                        touched.confirmPassword && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                                {errors.confirmPassword}
                                            </Text>
                                        )}
                                </View>
                            </View>

                            <View className="absolute bottom-20 w-full px-4" style={{ bottom: 100 }}>
                                <Button
                                    title="Update"
                                    onPress={handleSubmit}
                                    disabled={!isValid || disabled || isLoading}
                                />
                            </View>
                        </>
                    )}
                </Formik>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}