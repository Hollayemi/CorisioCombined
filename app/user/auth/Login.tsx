import Button from "@/components/form/Button";
import Input from "@/components/form/TextInput";
import { useAppDispatch } from "@/hooks/redux";
import { useUserData } from "@/hooks/useData";
import { setCredentials, useLoginMutation } from "@/redux/user/slices/authSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect } from "react";
import {
    BackHandler,
    Keyboard,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Heading, { Footer } from "./components";
import LoginValidationSchema from "./schema/login.schema";


export default function Login() {
    const [disabled, setDisabled] = React.useState(false);
    const { refetchUser }: any = useUserData()
    const [message, setMessage] = React.useState("");
    const dispatch = useAppDispatch();
    const [loginUser, { isLoading }] = useLoginMutation();

    useEffect(() => {
        const backAction = () => true; // return true to block back action
        const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => subscription.remove();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 px-2">
                <View className="pb-8">
                    <Heading
                        description="Your account is still available, just submit your account credentials and you have your account back."
                        title="Welcome back."
                    />
                </View>
                <View className="px-4">
                    <Formik
                        validationSchema={LoginValidationSchema}
                        initialValues={{
                            email: "",
                            password: "",
                        }}
                        onSubmit={async (values) => {
                            try {
                                setDisabled(true);
                                const loginData = {
                                    ...values,
                                    meta: {
                                        device: 'mobile',
                                        isMobile: true,
                                        via: 'app',
                                    },
                                };
                                await loginUser(loginData).then((result) => {
                                    if (result.data.type === "success") {
                                        dispatch(setCredentials(result.data.user));
                                        refetchUser()
                                        router.push("/user/home")
                                    }
                                });
                                setDisabled(false);
                            } catch (error) {
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
                                <View className="mb-6">
                                    {message && (
                                        <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                            {message}
                                        </Text>
                                    )}

                                    <Input
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                        others={{
                                            keyboardType: "email-address",
                                        }}
                                        label="Email"
                                        placeholder="JohnDoe@mail.com"
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
                                                    color="#233974 dark:#eee"
                                                />
                                            )
                                        }
                                    />
                                    {errors.email && touched.email && (
                                        <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                            {errors.email}
                                        </Text>
                                    )}

                                    <View className="mt-4">
                                        <Input
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                            placeholder="*********"
                                            label="Password"
                                            password
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
                                                        color="#233974 dark:#eee"
                                                    />
                                                )
                                            }
                                        />
                                        {errors.password && touched.password && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-3 mt-1">
                                                {errors.password}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <Text
                                    className="text-[#2A347E] dark:text-indigo-400 text-center text-sm font-['Poppins_400Regular'] my-4"
                                    onPress={() => router.push("/user/auth/ForgotPassword")}
                                >
                                    Forgot Password?
                                </Text>

                                <View className="mt-8 mb-6">
                                    <Button
                                        title="Next"
                                        onPress={() => handleSubmit()}
                                        disabled={!isValid || disabled || isLoading}
                                    />
                                </View>
                            </>
                        )}
                    </Formik>
                </View>

                <View className="flex-1 justify-end pb-6">
                    <Footer login />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}