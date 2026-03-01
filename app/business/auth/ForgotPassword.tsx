import Button from '@/components/form/Button';
import InputField from '@/components/form/TextInput';
import { useForgotPasswordMutation } from '@/redux/business/slices/authSlices';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Pattern from './component';
import ForgetPasswordValidationSchema from './schema/ForgetPassword.schema';




interface LoginFormData {
    email: string;

}
// Main Login Screen Component
export const LoginScreen = () => {
    const [sendEmail, { isLoading }] = useForgotPasswordMutation();
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
                                Forgot Password
                            </Text>
                            <Text className="text-[13px] text-white dark:text-gray-300 leading-relaxed">
                                Changing and easing the way you connect with professional services and order food.
                            </Text>
                        </View>

                        {/* Login Form */}

                        <Formik
                            validationSchema={ForgetPasswordValidationSchema}
                            initialValues={{
                                email: "",
                            }}
                            onSubmit={async (values) => {
                                try {
                                    await sendEmail({
                                        email: values.email,
                                        accountType: 'staff'
                                    }).unwrap()
                                    router.push({ pathname: "/auth/Verify", params: { email: values.email, type: "updatePassword", returnToken: "true" } })
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
                                <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-lg" style={{ height: '70%' }}>
                                    <View className='mb-12 h-[500px]' >
                                        <InputField
                                            label="Email Address"
                                            placeholder="Enter store address"
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            className="!mb-4"
                                            onBlur={handleBlur("email")}
                                            error={touched.email ? errors.email : ''}
                                            keyboardType="email-address"
                                        />
                                        <Button
                                            title={isLoading ? "Sending OTP ..." : "Send OTP"}
                                            onPress={handleSubmit}
                                            disabled={isLoading || !isValid}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => router.back()}

                                        className="mb-6 mt-20 self-center !text-center absolute bottom-0 !text-[#FDB415]"
                                    >
                                        <Text className="!text-[#FDB415] dark:!text-white font-medium">
                                            Back to Login
                                        </Text>
                                    </TouchableOpacity>
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