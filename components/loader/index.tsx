import React, { useEffect } from "react";
import { View, Animated } from "react-native";

const Loader = () => {
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true, // Changed to true for better performance
                }),
                Animated.timing(spinValue, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();

        return () => animation.stop(); // Cleanup animation on unmount
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View className="flex-1 justify-center items-center">
            <Animated.View
                className="w-20 h-25 flex-row justify-around items-center"
                style={{ transform: [{ rotate: spin }] }}
            >
                <View className="w-2.5 h-2.5 bg-blue-800 dark:bg-blue-500 rounded-full" />
                <View className="w-2.5 h-2.5 bg-blue-800 dark:bg-blue-500 rounded-full" />
                <View className="w-2.5 h-2.5 bg-blue-800 dark:bg-blue-500 rounded-full" />
            </Animated.View>
        </View>
    );
};

export default Loader;