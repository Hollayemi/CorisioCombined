import Button from '@/components/form/Button';
import { PasswordRequirements, SecureInputField } from '@/components/form/TextInput';
import { logoutUser, useResetPasswordMutation } from '@/redux/business/slices/authSlices';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Pattern from './component';
import Step3ValidationSchema from './schema/step3.schema';




interface LoginFormData {
    email: string;

}
// Main Login Screen Component
export const LoginScreen = () => {
    const params: any = useLocalSearchParams()
    const { token, email } = params;
    const dispatch = useDispatch()
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const [disabled, setDisabled] = React.useState<boolean>(false);

    const insets = useSafeAreaInsets();


    return (
        <SafeAreaView edges={["top"]} className="flex-1 bg-[#2A347E] dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="w-full h-20 opacity-40 absolute">
                    <Pattern />
                </View>
                <ScrollView
                    className="flex-1 "
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View className="flex-1 justify-end  pt-12 ">

                        <View className="mb-12 px-6">
                            <Text className="text-4xl font-bold text-white dark:text-white mb-4 leading-tight">
                                Reset Password
                            </Text>
                            <Text className="text-[13px] text-white dark:text-gray-300 leading-relaxed">
                                Create a strong and secure password to protect your account. Make sure it's something you can remember but hard for others to guess.
                            </Text>
                        </View>

                        <Formik
                            validationSchema={Step3ValidationSchema}
                            initialValues={{
                                password: "",
                                confirmPassword: "",
                            }}
                            onSubmit={async (values) => {
                                setDisabled(true);
                                try {
                                    await resetPassword({ token, email, password: values.password }).unwrap()
                                    dispatch(logoutUser())
                                    router.push("/auth/Login");
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
                                <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-lg" style={{ height: '80%' }}>
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
                                        title="Reset Password"
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
            <View style={{ height: insets.bottom }} className="bg-white dark:bg-gray-800" />
        </SafeAreaView>
    );
};

// Usage Example
export default function App() {
    return <LoginScreen />;
}