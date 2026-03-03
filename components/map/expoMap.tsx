
import toaster from "@/config/toaster";
import { useUpdateStoreProfileMutation } from "@/redux/business/slices/storeInfoSlice";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

interface StoreLocation {
    latitude: number;
    longitude: number;
    address?: string;
    state?: string;
    street?: string;
    city?: string;
}
// interface getData {
//     currentLocation: StoreLocation | null;
//     setCurrentLocation: (e: any) => void;
//     selectedLocation: StoreLocation | null;
//     setSelectedLocation: (e: any) => void;
// }

const StoreLocationOnboarding = () => {
    const params: any = useLocalSearchParams()
    const [currentLocation, setCurrentLocation] =
        useState<StoreLocation | null>(null);
    const [selectedLocation, setSelectedLocation] =
        useState<StoreLocation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);

    const router = useRouter()
    const [updateHandler, { isLoading: updateLoading, isError }] = useUpdateStoreProfileMutation();

    // Request location permissions
    const requestLocationPermission = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === "granted");
            return status === "granted";
        } catch (error) {
            console.log("Permission error:", error);
            return false;
        }
    };

    // Get current location
    const getCurrentLocation = async () => {
        try {
            setIsLoading(true);
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const coords: StoreLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setCurrentLocation(coords);
            setSelectedLocation(coords); // Auto-select current location

            // Get address
            const address = await getAddressFromCoords(
                coords.latitude,
                coords.longitude
            );
            if (address) {
                setSelectedLocation({ ...coords, ...address });
            }
        } catch (error) {
            console.log("Location error:", error);
            Alert.alert(
                "Location Error",
                "Unable to get your current location. Please enable GPS and try again.",
                [
                    { text: "Cancel" },
                    { text: "Retry", onPress: getCurrentLocation },
                ]
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Reverse geocoding
    const getAddressFromCoords = async (
        latitude: number,
        longitude: number
    ): Promise<any | null> => {
        try {
            const result = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });
            if (result.length > 0) {
                const addr = result[0];
                return {
                    city: addr.city,
                    state: addr.region,
                    street: addr.street,
                    address: `${addr.street || ""} ${addr.city || ""} ${addr.region || ""
                        } ${addr.country || ""}`.trim(),
                };
            }
        } catch (error) {
            console.log("Geocoding error:", error);
        }
        return null;
    };

    // Initialize location
    useEffect(() => {
        const initLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                await getCurrentLocation();
            } else {
                setIsLoading(false);
                Alert.alert(
                    "Permission Required",
                    "Location access is required to set up your store location.",
                    [
                        { text: "Cancel" },
                        {
                            text: "Grant Permission",
                            onPress: requestLocationPermission,
                        },
                    ]
                );
            }
        };

        initLocation();
    }, []);

    // Confirm store location
    const handleConfirmLocation = async () => {
        if (!selectedLocation) {
            Alert.alert("Error", "Please select your store location");
            return;
        }
        console.log(selectedLocation)
        const result = await updateHandler({
            address: {
                raw: selectedLocation.address,
                lga: selectedLocation.city,
                state: selectedLocation.state,
                ...(selectedLocation && {
                    coordinates: {
                        type: "Point",
                        coordinates: [selectedLocation.latitude, selectedLocation.longitude], // [lng, lat]
                    },
                }),
            },
        }).unwrap();
        toaster(result);
        const jsonParam = JSON.parse(params.data || params || {})
        console.log(params)
        if (result.type === "success" && jsonParam.type === "registration") {
            router.push("/user/auth/Login")
        }else if (result.type === "success" && jsonParam.type === "redirect") {
            router.push(jsonParam.from || "/auth/Login")
        }
        
        try {
            // Here you would save the store location to your backend
            const storeLocationData = {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                address:
                    selectedLocation.address ||
                    `${selectedLocation.latitude.toFixed(
                        6
                    )}, ${selectedLocation.longitude.toFixed(6)}`,
                timestamp: new Date().toISOString(),
            };

            console.log("Store location data:", storeLocationData);


        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to save store location. Please try again."
            );
        } finally {
            setIsConfirming(false);
        }
    };

    // Manual location adjustment
    const handleAdjustLocation = () => {
        Alert.alert(
            "Adjust Location",
            "In a full map interface, you would drag the pin to your exact store location.",
            [
                {
                    text: "Use Current Location",
                    onPress: () => getCurrentLocation(),
                },
                {
                    text: "Manual Entry",
                    onPress: () => {
                        // You could add manual coordinate entry here
                        Alert.prompt(
                            "Enter Coordinates",
                            "Format: latitude,longitude",
                            (text) => {
                                const coords = text.split(",");
                                if (coords.length === 2) {
                                    const lat = parseFloat(coords[0].trim());
                                    const lng = parseFloat(coords[1].trim());
                                    if (!isNaN(lat) && !isNaN(lng)) {
                                        setSelectedLocation({
                                            latitude: lat,
                                            longitude: lng,
                                        });
                                    }
                                }
                            }
                        );
                    },
                },
                { text: "Cancel" },
            ]
        );
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center ">
                <ActivityIndicator size="large" color="#2C337C" />
                <Text className="mt-4 text-gray-600 dark:text-gray-100">
                    Getting your location...
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-200 text-center px-6 mt-2">
                    This will help customers find your store
                </Text>
            </View>
        );
    }

    if (!locationPermission) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-6">
                <Text className="text-2xl mb-4" style={{ color: "#2C337C" }}>
                    📍
                </Text>
                <Text
                    className="text-xl font-bold mb-2"
                    style={{ color: "#2C337C" }}
                >
                    Location Access Required
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                    To help customers find your store on Corisio, we need to
                    know your store&apos;s location.
                </Text>
                <TouchableOpacity
                    onPress={requestLocationPermission}
                    style={{ backgroundColor: "#2C337C" }}
                    className="px-8 py-4 rounded-lg"
                >
                    <Text className="text-white font-semibold">
                        Grant Location Access
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const coordinate = {
        latitude: 6.5244, // Example: Lagos, Nigeria
        longitude: 3.3792,
    };

    return (
        <View className="flex-1 bg-white">
            {currentLocation && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="Store Location"
                    />
                </MapView>
            )}
            {/* Map Placeholder - In real implementation, this would be MapView */}
            <View className="flex-1  invisible justify-center items-center  my-4 rounded-lg">
                <Text className="text-6xl mb-4">🗺️</Text>
                <Text
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#2C337C" }}
                >
                    Interactive Map Goes Here
                </Text>
                <Text className="text-gray-600 text-center px-4">
                    In the actual app, store owners would see a map where they
                    can drag a pin to their exact store location
                </Text>

                {/* Pin Icon */}
                <View className="mt-8 items-center">
                    <Text className="text-4xl" style={{ color: "#fb923c" }}>
                        📍
                    </Text>
                    <Text className="text-sm text-gray-500 mt-2">
                        Draggable Pin
                    </Text>
                </View>
            </View>

            <View className="bg-white py-4">
                {/* Current Location Info */}
                {selectedLocation && (
                    <View className="mx-6 mb-4 p-4 bg-gray-50 rounded-lg">
                        <Text className="text-sm text-gray-600 mb-1">
                            Store Location:
                        </Text>
                        <Text
                            className="font-semibold mb-1"
                            style={{ color: "#2C337C" }}
                        >
                            {selectedLocation.address || "Getting address..."}
                        </Text>
                        <Text className="text-sm font-mono text-gray-500">
                            {selectedLocation.latitude.toFixed(6)},{" "}
                            {selectedLocation.longitude.toFixed(6)}
                        </Text>
                    </View>
                )}

                {/* Action Buttons */}
                <View className="px-6 pb-8">
                    <TouchableOpacity
                        onPress={handleAdjustLocation}
                        style={{ borderColor: "#2C337C" }}
                        className="border-2 py-3 rounded-lg mb-3"
                    >
                        <Text
                            style={{ color: "#2C337C" }}
                            className="text-center font-semibold"
                        >
                            Adjust Location
                        </Text>
                    </TouchableOpacity>

                    {updateLoading ? (
                        <ActivityIndicator className="py-4 rounded-lg" />
                    ) : (
                        <TouchableOpacity
                            onPress={handleConfirmLocation}
                            disabled={!selectedLocation || isConfirming}
                            style={{
                                backgroundColor: selectedLocation
                                    ? "#2C337C"
                                    : "#d1d5db",
                                opacity: isConfirming ? 0.7 : 1,
                            }}
                            className="py-4 rounded-lg"
                        >
                            <Text className="text-white text-center text-lg font-semibold">
                                {isConfirming
                                    ? "Saving Store Location..."
                                    : "Confirm Store Location"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Text className="text-xs text-gray-500 text-center mt-3">
                        💡 Customers will see your store on the map and can
                        navigate to you
                    </Text>
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default StoreLocationOnboarding;
