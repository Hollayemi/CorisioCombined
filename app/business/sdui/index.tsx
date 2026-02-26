// SDUIEngine.tsx - Main SDUI rendering engine
import { useSDUI } from '@/hooks/useSDUI';
import React, { useCallback, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Text,
    View
} from 'react-native';
import { SDUIRenderer } from './components';
import { SDUIEngineProps } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');


// Custom Button component with NativeWind support



// SDUI API Service

// Main SDUI Engine Component
export default function SDUIEngine({
    screenName,
    userType,
    appVersion,
    onComponentAction,
}: SDUIEngineProps) {
    const { components, loading, error, dismissComponent } = useSDUI(
        screenName,
        userType,
        appVersion
    );
     const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (screenName) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: screenHeight,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [screenName]);

    console.log(components)

    const handleComponentAction = useCallback((action: any, componentId: string) => {
        if (action?.action === 'dismiss') {
            dismissComponent(componentId);
        }
        onComponentAction?.(action, componentId);
    }, [dismissComponent, onComponentAction]);

    if (loading) {
        return (
            <View className="p-4">
                <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="p-4">
                <Text className="text-red-500 dark:text-red-400">Error: {error}</Text>
            </View>
        );
    }

    if (components.length === 0) {
        return null;
    }

    return (
        <View className="w-full h-screen absolute z-[100]  flex justify-center items-center">
            <Animated.View
                style={{ opacity: backdropAnim }}
                className="px-4 pt-20 w-full flex-1 bg-black/50"
            >
                {components.map((component) => (
                    <SDUIRenderer
                        key={component.id}
                        component={component.uiDefinition}
                        componentId={component.id}
                        onAction={(action: any) => handleComponentAction(action, component.id)}
                    />
                ))}
            </Animated.View>
            <View style={{ height: insets.bottom }} className="bg-transparent" />
        </View >
    );
};
