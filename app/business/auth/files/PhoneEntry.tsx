// app/business/auth/PhoneEntry.tsx
import ProgressHeader from "@/components/wrapper/business/headers/authHeader";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PageHeader, PhoneNumber } from "../component";

// Strip non-digits, remove leading zero, prepend +234

export default function PhoneEntry() {
    const { categories } = useLocalSearchParams<{ categories: string }>();


    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ProgressHeader currentStep={2} />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="pt-6">
                        <PageHeader
                            title="What's Your Number?"
                            subtitle="We'll send a one-time code to verify your store. No spam — promise."
                        />

                        <PhoneNumber pathname="/business/auth/files/PhoneVerify" data={{categories: categories ?? {}}} />

                        <View className="mt-6 flex-row justify-center">
                            <Text className="text-gray-500 dark:text-gray-400">
                                Already registered?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/business/auth/Login")}>
                                <Text className="text-yellow-500 dark:text-yellow-400 font-semibold">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
