import Button from '@/components/form/Button';
import InputField, { SecureInputField } from '@/components/form/storeTextInputs';
import ProgressHeader from '@/components/wrapper/business/headers/authHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { PageHeader } from './component';
import Step2ValidationSchema from './schema/Step2.schema';

export default function CompleteProfileScreen() {
    const { phoneNumber } = useLocalSearchParams<{ phoneNumber?: string }>();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ProgressHeader currentStep={4} totalSteps={4} />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pt-6">
                        <PageHeader
                            title="Complete your profile"
                            subtitle="Set up your store details so customers can find and trust your business."
                        />

                        <Formik
                            validationSchema={Step2ValidationSchema}
                            initialValues={{
                                businessName: '',
                                store: '',
                                fullname: '',
                                username: '',
                                email: '',
                                password: '',
                            }}
                            onSubmit={() => {
                                router.replace('/business/home');
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
                                <View className="px-6 pb-10">
                                    {phoneNumber ? (
                                        <View className="mb-4 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3">
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">Verified phone number</Text>
                                            <Text className="text-base font-semibold text-gray-900 dark:text-white">+234 {phoneNumber}</Text>
                                        </View>
                                    ) : null}

                                    <InputField
                                        label="Business/Brand Name"
                                        placeholder="Enter your business / brand name"
                                        value={values.businessName}
                                        error={touched.businessName ? errors.businessName : ''}
                                        onChangeText={handleChange('businessName')}
                                        onBlur={handleBlur('businessName')}
                                    />

                                    <InputField
                                        label="Business Handle"
                                        value={values.store}
                                        onChangeText={handleChange('store')}
                                        placeholder="Set your business handle e.g @corisio"
                                        onBlur={handleBlur('store')}
                                        error={touched.store ? errors.store : ''}
                                        leftPrefix="@"
                                    />

                                    <InputField
                                        label="Full Name"
                                        placeholder="Enter your name"
                                        value={values.fullname}
                                        onChangeText={handleChange('fullname')}
                                        onBlur={handleBlur('fullname')}
                                        error={touched.fullname ? errors.fullname : ''}
                                    />

                                    <InputField
                                        label="Username"
                                        placeholder="Pick a username"
                                        value={values.username}
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                        error={touched.username ? errors.username : ''}
                                    />

                                    <InputField
                                        label="Email Address"
                                        placeholder="Enter your email"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        error={touched.email ? errors.email : ''}
                                        keyboardType="email-address"
                                    />

                                    <SecureInputField
                                        label="Password"
                                        placeholder="Create a password"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        error={touched.password ? errors.password : ''}
                                    />

                                    <View className="pt-12">
                                        <Button title="Go to Dashboard" onPress={handleSubmit} disabled={!isValid} />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
