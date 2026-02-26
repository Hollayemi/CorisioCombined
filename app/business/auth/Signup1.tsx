import Button from '@/components/form/Button';
import InputField from '@/components/form/storeTextInputs';
import ProgressHeader from '@/components/wrapper/business/headers/authHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, View } from 'react-native';
import { PageHeader } from './component';
import Step1ValidationSchema from './schema/Step1.schema';

export default function PhoneNumberScreen() {
    const { categories: parsedCategories }: any = useLocalSearchParams();
    const categories = parsedCategories ? JSON.parse(parsedCategories) : {};

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ProgressHeader currentStep={2} totalSteps={4} />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="pt-6">
                        <PageHeader
                            title="Register your phone number"
                            subtitle="Add the business phone number customers can reach. We'll verify it in the next step."
                        />

                        <Formik
                            validationSchema={Step1ValidationSchema}
                            initialValues={{
                                phoneNumber: '',
                            }}
                            onSubmit={(values) => {
                                router.push({
                                    pathname: '/business/auth/Verify',
                                    params: {
                                        type: 'phoneVerification',
                                        phoneNumber: values.phoneNumber,
                                        categories: JSON.stringify(categories),
                                    },
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
                                        label="Business Phone Number"
                                        placeholder="Enter phone number"
                                        value={values.phoneNumber}
                                        leftPrefix="+234"
                                        onChangeText={handleChange('phoneNumber')}
                                        onBlur={handleBlur('phoneNumber')}
                                        error={touched.phoneNumber ? errors.phoneNumber : ''}
                                        keyboardType="phone-pad"
                                    />

                                    <View className="pb-6 pt-12">
                                        <Button title="Verify Phone" disabled={!isValid} onPress={handleSubmit} />
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
