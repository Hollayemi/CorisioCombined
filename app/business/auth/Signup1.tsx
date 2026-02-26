// Screen 1: Complete Registration
import Button from '@/components/form/Button';
import InputField from '@/components/form/storeTextInputs';
import ProgressHeader from '@/components/wrapper/business/headers/authHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from "formik";
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { PageHeader } from './component';
import Step1ValidationSchema from './schema/Step1.schema';

export default function CompleteRegistrationScreen() {
    const { categories: parsedCategories }: any = useLocalSearchParams()
    const categories = parsedCategories ? JSON.parse(parsedCategories) : {};
    console.log("categories=====>", categories)
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ProgressHeader
                    currentStep={1}
                />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pt-6">
                        <PageHeader
                            title="Complete Your Registration"
                            subtitle="Now that you've selected, let's set up your account so customers can find and book you easily."
                        />
                        <Formik
                            validationSchema={Step1ValidationSchema}
                            initialValues={{
                                businessName: "",
                                store: "",
                                businessEmail: "",
                                businessLine: "",
                            }}
                            onSubmit={(values) => {
                                router.push({
                                    pathname: "/business/auth/Signup2", params: {
                                        store:
                                            JSON.stringify({ ...values, store: values.store.toLowerCase(), categories })
                                    }
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
                                        label="Business/Brand Name"
                                        placeholder="Enter your business / brand name"
                                        value={values.businessName}
                                        error={touched.businessName ? errors.businessName : ''}
                                        onChangeText={handleChange("businessName")}
                                        onBlur={handleBlur("businessName")}

                                    />

                                    <InputField
                                        label="Business Handle"
                                        value={values.store}
                                        onChangeText={handleChange("store")}
                                        placeholder="Set your business handle e.g @corisio"
                                        onBlur={handleBlur("store")}
                                        error={touched.store ? errors.store : ''}
                                        leftPrefix="@"
                                    />

                                    <InputField
                                        label="Business Email Address (optional)"
                                        placeholder="Enter your business email address"
                                        value={values.businessEmail}
                                        onChangeText={handleChange("businessEmail")}
                                        onBlur={handleBlur("businessEmail")}
                                        error={touched.businessEmail ? errors.businessEmail : ''}
                                        keyboardType="email-address"
                                    />

                                    <InputField
                                        label="Business Phone Number (optional)"
                                        placeholder="Enter your phone number"
                                        value={values.businessLine}
                                        leftPrefix="+234"
                                        onChangeText={handleChange("businessLine")}
                                        onBlur={handleBlur("businessLine")}
                                        error={touched.businessLine ? errors.businessLine : ''}
                                        keyboardType="phone-pad"
                                    />

                                    <View className="pb-6 pt-12">
                                        <Button title="Next" disabled={!isValid} onPress={handleSubmit} />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};