import { useGetStoresNearbyQuery } from '@/redux/user/slices/storeSlice';
import { formatDistance } from '@/utils/format';
import * as Location from "expo-location";
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { mapDarkConfig } from "./components";

const { width, height } = Dimensions.get('window');

// Sample route coordinates (for demonstration)
const routeCoordinates = [
    {
        latitude: 37.78825,
        longitude: -122.4324,
    },
    {
        latitude: 37.78925,
        longitude: -122.4334,
    },
    {
        latitude: 37.78725,
        longitude: -122.4314,
    },
];

interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
    state?: string;
    street?: string;
    city?: string;
}


const MapPage = () => {
    const { paramData }: any = useLocalSearchParams()
    const { storeCoordinates } = JSON.parse(paramData || "{}")
    console.log({ storeCoordinates })
    const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
    const coords = { lat: currentLocation?.latitude, lng: currentLocation?.longitude }
    const { data: rawNear, isLoading: nearStoreLoading, refetch: refetchNearStore } = useGetStoresNearbyQuery(coords)
    const nearStores = rawNear?.data || []
    const [selectedLocation, setSelectedLocation] =
        useState<LocationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);

    const isDark = useColorScheme() === "dark"
    const mapRef = useRef<MapView | null>(null);
    type Store = typeof nearStores[number];
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [showRoute, setShowRoute] = useState(storeCoordinates ? true : false);

    const routeCoordinates = [
        {
            latitude: storeCoordinates[0],
            longitude: storeCoordinates[1],
        },
        {
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
        },

    ];

    // Request location permissions
    const requestLocationPermission = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === "granted");
            return status === "granted";
        } catch (error) {
            return false;
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
        }
        return null;
    };

    // Get current location
    const getCurrentLocation = async () => {
        try {
            setIsLoading(true);
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const coords: LocationData = {
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
                    "Allow location access so we can connect you with nearby stores.",
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

    console.log({ currentLocation })

    // Manual location adjustment
    const handleAdjustLocation = () => {
        Alert.alert(
            "Adjust Location",
            "In a full map interface, you would drag the pin to your exact location.",
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
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#2C337C" />
                <Text className="mt-4 text-gray-600">
                    Getting your location...
                </Text>
                <Text className="text-sm text-gray-500 text-center px-6 mt-2">
                    This will help you get the nearest store
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
                    Granting location access allows Corisio to connect you with nearby stores.
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


    // Current location (example coordinates - San Francisco)
    const myLocation = {
        latitude: typeof currentLocation?.latitude === 'number' ? currentLocation?.latitude : 0,
        longitude: typeof currentLocation?.longitude === 'number' ? currentLocation?.longitude : 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const handleStorePress = (store: any) => {
        setSelectedStore(store);
        mapRef.current?.animateToRegion({
            latitude: store.coordinates[0],
            longitude: store.coordinates[1],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        }, 1000);
    };

    const toggleRoute = () => {
        setShowRoute(!showRoute);
    };

    const mapStyle = isDark ? mapDarkConfig : [];

    return (
        <View className="flex-1 bg-white dark:bg-slate-900">
            {/* Full Screen Map */}
            <MapView
                ref={mapRef}
                className="flex-1"
                style={{ width, height }}
                initialRegion={myLocation}
                customMapStyle={mapStyle}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* Store Markers */}
                {nearStores.map((store: any) => (
                    <Marker
                        key={store.branchId}
                        coordinate={{ latitude: store?.coordinates?.[0], longitude: store?.coordinates?.[1] }}
                        title={store.businessName}
                        description={`${store.address} • ${formatDistance(store.distance)}`}
                        pinColor={selectedStore?.branchId === store.branchId ? '#3B82F6' : '#EF4444'}
                        onPress={() => setSelectedStore(store)}
                    >
                        <View className="w-[120px] items-center">
                            <View
                                className={`px-2 py-1 rounded-xl shadow-md ios:shadow-black android:elevation-3
                                        ${selectedStore?.branchId === store.branchId ? 'bg-blue-500' : 'bg-red-500'}
                                        `}
                            >
                                <Text className="text-white text-xs font-semibold" numberOfLines={1}>
                                    {store.businessName}
                                </Text>
                            </View>

                            {/* Profile picture pin */}
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: "/user/store", params: { branchId: store.branchId } })}
                                className={`w-10 h-10 rounded-full border-2 overflow-hidden mt-1
                                     ${selectedStore?.branchId === store.branchId ? 'border-blue-500' : 'border-red-500'}
                                `}
                            >
                                <Image
                                    source={{ uri: store.profile_image }}
                                    className="w-full h-full"
                                    resizeMode="cover"

                                />
                            </TouchableOpacity>
                        </View>
                    </Marker>
                ))}

                <Marker
                    coordinate={myLocation}
                    title="You are here"
                    pinColor="#10B981"
                />

                {/* Route Polyline */}
                {showRoute && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#3B82F6"
                        strokeWidth={4}
                    // strokePattern={[1]}
                    />
                )}
            </MapView>


            {/* Route Toggle Button */}
            <TouchableOpacity
                onPress={() => router.back()} //toggleRoute
                className="w-12 h-12 z-50 absolute top-16 left-4 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
            >
                <ArrowLeft size={20} color="gray" />
            </TouchableOpacity>

            {/* Store Cards - Horizontal Scroll */}
            <View className="absolute bottom-0 left-0 right-0  backdrop-blur-sm">
                <View className="px-4 py-3">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                        Stores Near You
                    </Text>
                    <ScrollView
                        horizontal
                        className="flex-row"
                        contentContainerStyle={{ paddingRight: 16 }}
                    >
                        {nearStores.map((store: any) => (
                            <TouchableOpacity
                                key={store.branchId}
                                onPress={() => handleStorePress(store)}
                                className={`mr-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden w-60 ${selectedStore?.id === store.id ? 'border-2 border-blue-500' : ''
                                    }`}
                            >
                                <Image
                                    source={{ uri: store.profile_image }}
                                    className="w-full h-32 object-cover"
                                />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-start mb-0">
                                        <Text numberOfLines={1} className="text-lg font-semibold text-slate-900 dark:text-white flex-1">
                                            {store.businessName}
                                        </Text>
                                        <View className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                                            <Text className="text-yellow-800 dark:text-yellow-200 text-xs font-medium">
                                                ⭐ {store.rating}
                                            </Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                                            {store.address}
                                        </Text>
                                        <View className='flex-row justify-between items-center'>
                                            <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                📍 {formatDistance(store.distance)}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => router.push({ pathname: "/user/store", params: { branchId: store.branchId } })}
                                                className="Rounded-full text-white"
                                            >
                                                <Text className="text-blue-600 dark:text-blue-400 text-sm rounded-full font-medium bg-gray-200 dark:bg-slate-700 py-1 px-2">
                                                    Open Store
                                                </Text>
                                                Open Store
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

export default MapPage;