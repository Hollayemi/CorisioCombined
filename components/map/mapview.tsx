import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Platform,
    ScrollView,
    TextInput,
} from "react-native";

interface Location {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
}

interface CustomLocation {
    latitude: string;
    longitude: string;
}

const ExpoLocationSelector = () => {
    // Predefined locations (you can customize these)
    const [predefinedLocations] = useState<Location[]>([
        {
            id: "1",
            name: "Lagos Island",
            address: "Lagos Island, Lagos State, Nigeria",
            latitude: 6.4541,
            longitude: 3.3947,
        },
        {
            id: "2",
            name: "Victoria Island",
            address: "Victoria Island, Lagos State, Nigeria",
            latitude: 6.4281,
            longitude: 3.4219,
        },
        {
            id: "3",
            name: "Ikeja",
            address: "Ikeja, Lagos State, Nigeria",
            latitude: 6.5951,
            longitude: 3.3379,
        },
        {
            id: "4",
            name: "Abuja City Center",
            address: "Central Business District, Abuja, Nigeria",
            latitude: 9.0579,
            longitude: 7.4951,
        },
        {
            id: "5",
            name: "Port Harcourt",
            address: "Port Harcourt, Rivers State, Nigeria",
            latitude: 4.8156,
            longitude: 7.0498,
        },
    ]);

    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null
    );
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customLocation, setCustomLocation] = useState<CustomLocation>({
        latitude: "",
        longitude: "",
    });
    const [isConfirming, setIsConfirming] = useState(false);

    // Generate random location
    const generateRandomLocation = () => {
        const randomLat = 6.5 + (Math.random() - 0.5) * 2; // Around Lagos area
        const randomLng = 3.4 + (Math.random() - 0.5) * 2;

        const randomLocation: Location = {
            id: "random",
            name: "Random Location",
            address: `Generated coordinates`,
            latitude: randomLat,
            longitude: randomLng,
        };

        setSelectedLocation(randomLocation);
        setShowCustomInput(false);
    };

    // Handle predefined location selection
    const handleLocationSelect = (location: Location) => {
        setSelectedLocation(location);
        setShowCustomInput(false);
    };

    // Handle custom coordinates input
    const handleCustomLocationSubmit = () => {
        const lat = parseFloat(customLocation.latitude);
        const lng = parseFloat(customLocation.longitude);

        if (isNaN(lat) || isNaN(lng)) {
            Alert.alert("Error", "Please enter valid coordinates");
            return;
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            Alert.alert("Error", "Coordinates out of range");
            return;
        }

        const customLoc: Location = {
            id: "custom",
            name: "Custom Location",
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng,
        };

        setSelectedLocation(customLoc);
        setShowCustomInput(false);
    };

    // Confirm selected location
    const handleConfirmLocation = () => {
        if (!selectedLocation) {
            Alert.alert("Error", "Please select a location");
            return;
        }

        setIsConfirming(true);

        // Simulate API call
        setTimeout(() => {
            Alert.alert(
                "Location Confirmed",
                `Selected: ${
                    selectedLocation.name
                }\nCoordinates: ${selectedLocation.latitude.toFixed(
                    6
                )}, ${selectedLocation.longitude.toFixed(6)}`,
                [{ text: "OK" }]
            );
            setIsConfirming(false);
        }, 1000);
    };

    // Reset selection
    const handleReset = () => {
        setSelectedLocation(null);
        setShowCustomInput(false);
        setCustomLocation({ latitude: "", longitude: "" });
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View style={styles.header} className="px-6 py-4 bg-white">
                <Text style={[styles.headerTitle, { color: "#2C337C" }]}>
                    Select Location
                </Text>
                <Text className="text-gray-600 text-sm">
                    Choose from predefined locations or enter custom coordinates
                </Text>
            </View>

            <ScrollView className="flex-1 px-6">
                {/* Selected Location Display */}
                {selectedLocation && (
                    <View
                        style={styles.selectedCard}
                        className="mb-6 p-4 rounded-lg"
                    >
                        <Text className="text-gray-600 text-sm mb-1">
                            Selected Location:
                        </Text>
                        <Text
                            style={[styles.locationName, { color: "#2C337C" }]}
                        >
                            {selectedLocation.name}
                        </Text>
                        <Text className="text-gray-600 text-sm mb-2">
                            {selectedLocation.address}
                        </Text>
                        <Text
                            style={{ color: "#2C337C" }}
                            className="font-mono text-sm"
                        >
                            {selectedLocation.latitude.toFixed(6)},{" "}
                            {selectedLocation.longitude.toFixed(6)}
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View className="mb-6">
                    <TouchableOpacity
                        onPress={generateRandomLocation}
                        style={[
                            styles.actionButton,
                            { backgroundColor: "#fb923c" },
                        ]}
                        className="mb-3 py-3 rounded-lg"
                    >
                        <Text className="text-white text-center font-semibold">
                            🎲 Generate Random Location
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowCustomInput(!showCustomInput)}
                        style={[
                            styles.actionButton,
                            { backgroundColor: "#2C337C" },
                        ]}
                        className="mb-3 py-3 rounded-lg"
                    >
                        <Text className="text-white text-center font-semibold">
                            📍 Enter Custom Coordinates
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Custom Coordinates Input */}
                {showCustomInput && (
                    <View
                        style={styles.customInputCard}
                        className="mb-6 p-4 rounded-lg border-2"
                    >
                        <Text
                            style={[styles.sectionTitle, { color: "#2C337C" }]}
                            className="mb-3"
                        >
                            Enter Coordinates
                        </Text>

                        <View className="mb-3">
                            <Text className="text-gray-600 text-sm mb-1">
                                Latitude:
                            </Text>
                            <TextInput
                                value={customLocation.latitude}
                                onChangeText={(text) =>
                                    setCustomLocation((prev) => ({
                                        ...prev,
                                        latitude: text,
                                    }))
                                }
                                placeholder="e.g., 6.5244"
                                keyboardType="numeric"
                                style={styles.input}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </View>

                        <View className="mb-3">
                            <Text className="text-gray-600 text-sm mb-1">
                                Longitude:
                            </Text>
                            <TextInput
                                value={customLocation.longitude}
                                onChangeText={(text) =>
                                    setCustomLocation((prev) => ({
                                        ...prev,
                                        longitude: text,
                                    }))
                                }
                                placeholder="e.g., 3.3792"
                                keyboardType="numeric"
                                style={styles.input}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleCustomLocationSubmit}
                            style={[
                                styles.submitButton,
                                { backgroundColor: "#2C337C" },
                            ]}
                            className="py-2 rounded-lg"
                        >
                            <Text className="text-white text-center font-semibold">
                                Set Location
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Predefined Locations */}
                <View className="mb-6">
                    <Text
                        style={[styles.sectionTitle, { color: "#2C337C" }]}
                        className="mb-3"
                    >
                        Popular Locations
                    </Text>

                    {predefinedLocations.map((location) => (
                        <TouchableOpacity
                            key={location.id}
                            onPress={() => handleLocationSelect(location)}
                            style={[
                                styles.locationCard,
                                selectedLocation?.id === location.id &&
                                    styles.selectedLocationCard,
                            ]}
                            className="mb-3 p-4 rounded-lg border"
                        >
                            <Text
                                style={[
                                    styles.locationName,
                                    { color: "#2C337C" },
                                ]}
                            >
                                {location.name}
                            </Text>
                            <Text className="text-gray-600 text-sm mb-1">
                                {location.address}
                            </Text>
                            <Text className="text-gray-500 text-xs font-mono">
                                {location.latitude.toFixed(4)},{" "}
                                {location.longitude.toFixed(4)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomPanel} className="px-6 py-4 bg-white">
                <View className="flex-row space-x-3">
                    {selectedLocation && (
                        <TouchableOpacity
                            onPress={handleReset}
                            style={styles.resetButton}
                            className="flex-1 py-3 border-2 rounded-lg"
                        >
                            <Text
                                style={{ color: "#2C337C" }}
                                className="text-center font-semibold"
                            >
                                Reset
                            </Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleConfirmLocation}
                        disabled={!selectedLocation || isConfirming}
                        style={[
                            styles.confirmButton,
                            {
                                backgroundColor: selectedLocation
                                    ? "#2C337C"
                                    : "#d1d5db",
                                opacity: isConfirming ? 0.7 : 1,
                                flex: selectedLocation ? 2 : 1,
                            },
                        ]}
                        className="py-3 rounded-lg"
                    >
                        <Text className="text-white text-center font-semibold">
                            {isConfirming
                                ? "Confirming..."
                                : "Confirm Location"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    selectedCard: {
        backgroundColor: "#f8fafc",
        borderWidth: 2,
        borderColor: "#2C337C",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    locationName: {
        fontSize: 16,
        fontWeight: "600",
    },
    locationCard: {
        borderColor: "#e5e7eb",
        backgroundColor: "#fff",
    },
    selectedLocationCard: {
        borderColor: "#2C337C",
        backgroundColor: "#f8fafc",
    },
    customInputCard: {
        borderColor: "#fb923c",
        backgroundColor: "#fff7ed",
    },
    input: {
        fontSize: 16,
    },
    actionButton: {
        // Styles handled by className and inline styles
    },
    submitButton: {
        // Styles handled by className and inline styles
    },
    bottomPanel: {
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingBottom: Platform.OS === "ios" ? 30 : 20,
    },
    resetButton: {
        borderColor: "#2C337C",
    },
    confirmButton: {
        // Styles handled by className and inline styles
    },
});

export default ExpoLocationSelector;
