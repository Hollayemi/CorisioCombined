// Screen 1: Complete Registration
import Button from '@/components/form/Button';
import InputField from '@/components/form/storeTextInputs';
import ProgressHeader from '@/components/wrapper/business/headers/authHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { PageHeader } from './component';
import Step2ValidationSchema from './schema/Step2.schema';

export default function CompleteRegistrationScreen() {
    const params = useLocalSearchParams();
    console.log("params=====>", params);
    const { store, }: any = params;
    const parsedStore = store ? JSON.parse(store) : {};
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ProgressHeader
                    currentStep={2}
                />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pt-6">
                        <PageHeader
                            title="Personal Information"
                            subtitle="Now that you've selected, let's set up your account so customers can find and book you easily."
                        />
                        <Formik
                            validationSchema={Step2ValidationSchema}
                            initialValues={{
                                fullname: "",
                                username: "",
                                email: "",
                            }}
                            onSubmit={(values) => {
                                router.push({
                                    pathname: "/business/auth/Signup3",
                                    params: { values: JSON.stringify({ store: parsedStore, user: values }) }
                                });
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
                                    <InputField
                                        label="Full Name"
                                        placeholder="Enter your name"
                                        value={values.fullname}
                                        onChangeText={handleChange("fullname")}
                                        onBlur={handleBlur("fullname")}
                                        error={touched.fullname ? errors.fullname : ''}
                                    />

                                    <InputField
                                        label="Username"
                                        placeholder="Pick a username"
                                        value={values.username}
                                        onChangeText={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                        error={touched.username ? errors.username : ''}
                                    />

                                    <InputField
                                        label="Personal Email Address"
                                        placeholder="Enter your email address"
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        error={touched.email ? errors.email : ''}
                                        keyboardType="email-address"
                                    />

                                    <View className="pb-6 pt-20">
                                        <Button title="Next" onPress={handleSubmit} />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};