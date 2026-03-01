import Button from "@/components/form/Button";
import { PasswordRequirements, SecureInputField } from "@/components/form/storeTextInputs";
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import toaster from "@/config/toaster";
import { useCreateNewStoreMutation } from "@/redux/business/slices/authSlices";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from "react-native";
import { PageHeader } from "./component";
import Step3ValidationSchema from "./schema/step3.schema";

export default function SetUpPasswordScreen() {
    const { values }: any = useLocalSearchParams();
    const parsedValues = values ? JSON.parse(values) : {};
    const [password, setPassword] = useState('');
    const [createStore, { isLoading, isSuccess, isError }] =
        useCreateNewStoreMutation();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ProgressHeader currentStep={3} />
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pt-6">
                        <PageHeader
                            title="Set Up Your Password"
                            subtitle="Create a strong and secure password to protect your account. Make sure it's something you can remember but hard for others to guess."
                        />

                        <Formik
                            validationSchema={Step3ValidationSchema}
                            initialValues={{
                                password: "",
                                confirmPassword: "",
                            }}
                            onSubmit={async (values) => {
                                parsedValues.user.password = values.password;
                                const result = await createStore(parsedValues).unwrap();
                                const { accessToken, type, message } = result;
                                toaster({ type, message });

                                if (type === "success") {
                                    router.push({
                                        pathname: "/business/auth/Verify",
                                        params: {
                                            email: parsedValues.user.email,
                                            type: "createAccount",
                                        },
                                    })
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
                                <View className="px-6">
                                    <SecureInputField
                                        label="Password"
                                        placeholder="Enter your password"
                                        value={values.password}
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        isValid={touched.password ? !errors.password : true}
                                        showStrengthIndicator={true}
                                    />

                                    <SecureInputField
                                        label="Confirm Password"
                                        placeholder="Confirm your password"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        onBlur={handleBlur("confirmPassword")}
                                        error={touched.confirmPassword ? errors.confirmPassword : ''}
                                    />

                                    <PasswordRequirements password={values.password} />
                                    <Button
                                        title="Create Account"
                                        isLoading={isLoading}
                                        onPress={handleSubmit}
                                        className="mb-6 !mt-20"
                                        disabled={!isValid}
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}