import NetInfo from "@react-native-community/netinfo"; // npm install @react-native-community/netinfo
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    BackHandler,
    Dimensions,
    Linking,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface ErrorPageProps {
    errorType?: "network" | "server" | "timeout" | "unknown";
    errorMessage?: string;
    onRetry?: () => Promise<void> | null;
}

const ModernErrorPage: React.FC = () => {
    const params = useLocalSearchParams();
    const {
        errorType = "unknown",
        errorMessage,
        onRetry = undefined,
    }: ErrorPageProps = params;
    const navigation = useNavigation();
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(100));
    const [isRetrying, setIsRetrying] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    useEffect(() => {
        // Check network connectivity
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsConnected(state.isConnected ?? false);
        });

        // Entry animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Rotation animation for loading
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        // Handle back button
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                navigation.goBack();
                return true;
            }
        );

        return () => {
            unsubscribe();
            backHandler.remove();
            rotateAnimation.stop();
        };
    }, []);

    const getErrorConfig = () => {
        switch (errorType) {
            case "network":
                return {
                    icon: "📡",
                    title: "Connection Lost",
                    subtitle: "Unable to connect to the internet",
                    description:
                        "Please check your internet connection and try again.",
                    color: "#2C337C",
                };
            case "server":
                return {
                    icon: "🔧",
                    title: "Server Maintenance",
                    subtitle: "Our servers are currently unavailable",
                    description:
                        "We're working to fix this issue. Please try again in a few minutes.",
                    color: "#ffa726",
                };
            case "timeout":
                return {
                    icon: "⏱️",
                    title: "Request Timeout",
                    subtitle: "The request took too long to complete",
                    description:
                        "The server is taking longer than expected to respond.",
                    color: "#ff7043",
                };
            default:
                return {
                    icon: "⚠️",
                    title: "Something Went Wrong",
                    subtitle: "An unexpected error occurred",
                    description:
                        "We encountered an unexpected problem. Please try again.",
                    color: "#e94560",
                };
        }
    };

    const config = getErrorConfig();

    const handleRetry = async () => {
        if (isRetrying) return;

        setIsRetrying(true);
        setRetryCount((prev) => prev + 1);

        try {
            if (onRetry) {
                await onRetry();
            } else {
                // Default retry behavior
                await new Promise((resolve) => setTimeout(resolve, 2000));
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert(
                "Retry Failed",
                "Unable to reconnect. Please check your connection and try again.",
                [{ text: "OK" }]
            );
        } finally {
            setIsRetrying(false);
        }
    };

    const handleGoHome = () => {
        router.push("/user/home");
    };

    const handleContactSupport = () => {
        Alert.alert("Contact Support", "Choose how you'd like to get help:", [
            {
                text: "Email Support",
                onPress: () => Linking.openURL("mailto:support@corisio.com"),
            },
            {
                text: "Call Support",
                onPress: () => Linking.openURL("tel:+2348147702684"),
            },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <View style={[styles.container, { backgroundColor: "#0f0f23" }]}>
            <StatusBar barStyle="light-content" backgroundColor="#0f0f23" />

            {/* Animated Background */}
            <View style={styles.backgroundContainer}>
                {Array.from({ length: 50 }).map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.floatingParticle,
                            {
                                left: Math.random() * width,
                                top: Math.random() * height,
                                opacity: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, Math.random() * 0.3],
                                }),
                            },
                        ]}
                    />
                ))}
            </View>

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Error Icon */}
                <View
                    style={[
                        styles.errorIconContainer,
                        { backgroundColor: config.color },
                    ]}
                >
                    <Text style={styles.errorIcon}>{config.icon}</Text>
                </View>

                {/* Error Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{config.title}</Text>
                    <Text style={styles.subtitle}>{config.subtitle}</Text>
                    <Text style={styles.description}>{config.description}</Text>

                    {errorMessage && (
                        <View style={styles.errorMessageContainer}>
                            <Text style={styles.errorMessage}>
                                Error: {errorMessage}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Connection Status */}
                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusIndicator,
                            {
                                backgroundColor: isConnected
                                    ? "#4caf50"
                                    : "#f44336",
                            },
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {isConnected
                            ? "Internet Connected"
                            : "No Internet Connection"}
                    </Text>
                </View>

                {/* Retry Count */}
                {retryCount > 0 && (
                    <Text style={styles.retryCount}>
                        Retry attempts: {retryCount}
                    </Text>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.retryButton,
                            { backgroundColor: config.color },
                            isRetrying && styles.buttonDisabled,
                        ]}
                        onPress={handleRetry}
                        disabled={isRetrying}
                        activeOpacity={0.8}
                    >
                        {isRetrying ? (
                            <Animated.View
                                style={{ transform: [{ rotate: spin }] }}
                            >
                                <Text style={styles.buttonIcon}>🔄</Text>
                            </Animated.View>
                        ) : (
                            <Text style={styles.buttonIcon}>🔄</Text>
                        )}
                        <Text style={styles.retryButtonText}>
                            {isRetrying ? "Retrying..." : "Try Again"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.homeButton]}
                        onPress={handleGoHome}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonIcon}>🏠</Text>
                        <Text style={styles.homeButtonText}>Go Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.supportButton]}
                        onPress={handleContactSupport}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonIcon}>📞</Text>
                        <Text style={styles.supportButtonText}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Help Section */}
                <View style={styles.helpContainer}>
                    <Text style={styles.helpTitle}>Troubleshooting Tips:</Text>
                    <Text style={styles.helpItem}>
                        • Check your internet connection
                    </Text>
                    <Text style={styles.helpItem}>
                        • Try switching between WiFi and mobile data
                    </Text>
                    <Text style={styles.helpItem}>
                        • Restart the app if the problem persists
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    backgroundContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    floatingParticle: {
        position: "absolute",
        width: 2,
        height: 2,
        borderRadius: 1,
        backgroundColor: "#ffffff",
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: 400,
    },
    errorIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    errorIcon: {
        fontSize: 40,
    },
    textContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: "#b0b0b0",
        textAlign: "center",
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: "#808080",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    errorMessageContainer: {
        marginTop: 15,
        padding: 10,
        backgroundColor: "#2a2a3e",
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#2C337C",
    },
    errorMessage: {
        fontSize: 14,
        color: "#2C337C",
        fontFamily: "monospace",
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#2a2a3e",
        borderRadius: 20,
    },
    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: 14,
        color: "#ffffff",
    },
    retryCount: {
        fontSize: 12,
        color: "#888888",
        marginBottom: 20,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 30,
    },
    button: {
        width: "100%",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        flexDirection: "row",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    retryButton: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    homeButton: {
        backgroundColor: "#2a2a3e",
        borderWidth: 1,
        borderColor: "#4a4a5e",
    },
    supportButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#555555",
    },
    buttonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
    supportButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#b0b0b0",
    },
    helpContainer: {
        alignItems: "flex-start",
        paddingHorizontal: 20,
        width: "100%",
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        marginBottom: 10,
    },
    helpItem: {
        fontSize: 14,
        color: "#888888",
        marginBottom: 5,
        lineHeight: 20,
    },
});

export default ModernErrorPage;
