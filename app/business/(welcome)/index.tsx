import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

import { ImageSourcePropType } from "react-native";

interface OnboardingStep {
    id: number;
    title: string;
    subtitle: string;
    images: ImageSourcePropType;
    backgroundColor: string;
}

const OnboardingScreen: React.FC = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const steps: OnboardingStep[] = [
        {
            id: 1,
            title: "Welcome to CORISIO",
            subtitle:
                "Corisio connects users with nearby stores, showing real-time product availability,",
            images: require("@/assets/images/misc/pre1.png"),

            backgroundColor: "#f0f9ff",
        },
        {
            id: 2,
            title: "Corisio EasySell",
            subtitle:
                "Set up shop. Sell fast. Grow big. Sell smarter — no stress, no tech wahala.",
            images: require("@/assets/images/misc/pre2.png"),

            backgroundColor: "#fef3c7",
        },
        {
            id: 3,
            title: "Ready to Start?",
            subtitle:
                "Create an account in minutes to access exclusive features, track your activity, and stay updated.",
            images: require("@/assets/images/misc/pre0.png"),
            backgroundColor: "#f0fdf4",
        },
    ];

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => {
                const nextStep = (prev + 1) % steps.length;
                scrollViewRef.current?.scrollTo({
                    x: nextStep * screenWidth,
                    animated: true,
                });
                return nextStep;
            });
        }, 5000); // Change slide every 4 seconds

        return () => clearInterval(timer);
    }, []);

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentStep(index);
    };

    const handleSignIn = () => {
        console.log("Sign In pressed");
        // Navigate to sign in screen
    };

    const handleRegister = () => {
        console.log("Register pressed");
        // Navigate to registration screen
    };

    const renderStep = (step: OnboardingStep, index: number) => (
        <View
            key={step.id}
            className="flex-1 justify-center items-center px-6"
            style={{
                width: screenWidth,
                backgroundColor: step.backgroundColor,
            }}
        >
            {/* Images Section */}
            <View
                className="relative"
                style={{ height: 280, marginBottom: 70 }}
            >
                {/* Main large image */}
                <View className="relative">
                    <Image
                        source={step.images}
                        className=""
                        style={{
                            width: screenWidth - 12,
                            height: currentStep !== 2 ? 320 : 380,
                        }}
                        resizeMode="contain"
                    />
                </View>
            </View>

            {/* Content Section */}
            <View className="items-center px-4 mt-10 ">
                <Text
                    className="!text-3xl font-bold text-center mb-4 !mt-20"
                    style={{ color: "#2C337C" }}
                >
                    {step.title}
                </Text>
                <Text className="text-base text-gray-600 text-center leading-6 mb-8">
                    {step.subtitle}
                </Text>
            </View>

            {/* Show buttons only on the last step */}
            {index === steps.length - 1 && (
                <View className="w-full px-6 mt-8">
                    <TouchableOpacity
                        className="w-full py-4 rounded-full mb-4 shadow-sm"
                        style={{ backgroundColor: "#84cc16" }}
                        onPress={() => router.push("/business/auth/files/PhoneEntry")}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Registration
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full py-4 rounded-full"
                        style={{ backgroundColor: "#2C337C" }}
                        onPress={() => router.push("/business/auth/Login")}
                        activeOpacity={0.8}
                    >
                        <Text
                            className="text-center text-lg font-semibold"
                            style={{ color: "white" }}
                        >
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            {/* Main Content */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
            >
                {steps.map((step, index) => renderStep(step, index))}
            </ScrollView>

            {/* Page Indicators */}
            <View
                className="absolute bottom-32 left-0 right-0 flex-row justify-center"
                style={{ display: currentStep === 2 ? "none" : "flex" }}
            >
                {steps.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 mx-1 rounded-full ${index === currentStep ? "w-8" : "w-2"
                            }`}
                        style={{
                            backgroundColor:
                                index === currentStep ? "#2C337C" : "#d1d5db",
                        }}
                    />
                ))}
            </View>
        </View>
    );
};

export default OnboardingScreen;
