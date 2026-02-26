import React, { ReactNode, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

interface ModalProp {
    onClose: () => void;
    children: ReactNode;
    visible: boolean;
}

export default function ModalComponent({ visible, onClose, children }: ModalProp) {
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
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
    }, [visible]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <Animated.View
                        style={{ opacity: backdropAnim }}
                        className="flex-1 bg-black/50"
                    >
                        <View
                            onStartShouldSetResponder={() => true}
                            className="absolute bottom-0 left-0 right-0"
                        >
                            <Animated.View
                                style={{
                                    transform: [{ translateY: slideAnim }],
                                }}
                                className="bg-white dark:bg-gray-800 rounded-t-3xl px-6 py-6"
                            >
                                <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full self-center mb-6" />
                                {children}
                                <View style={{ height: 10 }} className="bg-transparent" />
                            </Animated.View>
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}