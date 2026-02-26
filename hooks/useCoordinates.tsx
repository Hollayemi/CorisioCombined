import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types
interface Coordinates {
    latitude: number;
    longitude: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    // Add other product fields
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Global location state manager (outside React components)
class LocationManager {
    private currentLocation: Coordinates | null = null;
    private listeners: ((location: Coordinates) => void)[] = [];
    private isWatching = false;
    private watchId: Location.LocationSubscription | null = null;

    // Calculate distance between two coordinates using Haversine formula
    private calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
        
        const R = 6371e3; // Earth's radius in meters
        const φ1 = coord1.latitude * Math.PI / 180;
        const φ2 = coord2.latitude * Math.PI / 180;
        const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
        const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    // Check if coordinates changed significantly (first 6 digits)
    private hasSignificantChange(oldCoord: Coordinates, newCoord: Coordinates): boolean {
        const oldLatStr = oldCoord.latitude.toFixed(6);
        const newLatStr = newCoord.latitude.toFixed(6);
        const oldLngStr = oldCoord.longitude.toFixed(6);
        const newLngStr = newCoord.longitude.toFixed(6);

        return oldLatStr !== newLatStr || oldLngStr !== newLngStr;
    }

    // Start watching location
    async startWatching() {
        if (this.isWatching) return;

        try {
            console.log(this.currentLocation)
            // Request permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                throw new Error('Location permission denied');
            }

            // Get initial location
            const initialLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            this.currentLocation = {
                latitude: initialLocation.coords.latitude,
                longitude: initialLocation.coords.longitude,
            };

            // Notify initial location
            this.notifyListeners(this.currentLocation);

            // Start watching for changes
            this.watchId = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 10000, // Check every 10 seconds
                    distanceInterval: 10, // Minimum 10 meters movement
                },
                (location) => {
                    const newCoords: Coordinates = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    };

                    // Check if location changed significantly
                    if (this.currentLocation) {
                        const distance = this.calculateDistance(this.currentLocation, newCoords);
                        const hasSignificantDigitChange = this.hasSignificantChange(this.currentLocation, newCoords);

                        // Update if moved 20+ meters OR first 6 digits changed
                        if (distance >= 20 || hasSignificantDigitChange) {
                            this.currentLocation = newCoords;
                            this.notifyListeners(newCoords);
                        }
                    } else {
                        this.currentLocation = newCoords;
                        this.notifyListeners(newCoords);
                    }
                }
            );

            this.isWatching = true;
        } catch (error) {
            console.error('Failed to start location watching:', error);
            throw error;
        }
    }

    // Stop watching location
    stopWatching() {
        if (this.watchId) {
            this.watchId.remove();
            this.watchId = null;
        }
        this.isWatching = false;
    }

    // Add listener
    addListener(callback: (location: Coordinates) => void) {
        this.listeners.push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    // Notify all listeners
    private notifyListeners(location: Coordinates) {
        this.listeners.forEach(listener => listener(location));
    }

    // Get current location
    getCurrentLocation(): Coordinates | null {
        return this.currentLocation;
    }
}

export default LocationManager

// Global instance
const locationManager = new LocationManager();

// Custom hook for location
export const useCurrentLocation = () => {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log("coordinates=======>", coordinates)

    useEffect(() => {
        let isMounted = true;

        const startLocationTracking = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Add listener for location updates
                const unsubscribe = locationManager.addListener((location) => {
                    if (isMounted) {
                        setCoordinates(location);
                        setIsLoading(false);
                    }
                });

                // Start watching if not already watching
                await locationManager.startWatching();

                // Get current location if available
                const currentLocation = locationManager.getCurrentLocation();
                console.log(currentLocation)

                if (currentLocation && isMounted) {
                    setCoordinates(currentLocation);
                    setIsLoading(false);
                }

                // Cleanup function
                return () => {
                    unsubscribe();
                };
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Location error');
                    setIsLoading(false);
                }
            }
        };

        const cleanup = startLocationTracking();

        return () => {
            isMounted = false;
            cleanup?.then(cleanupFn => cleanupFn?.());
        };
    }, []);

    return { coordinates, isLoading, error };
};

// RTK Query API with location integration
export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers, { getState }) => {
            // Add auth token if available
            const token = (getState() as any).auth?.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            // Add location headers
            const currentLocation = locationManager.getCurrentLocation();
            if (currentLocation) {
                headers.set('x-latitude', currentLocation.latitude.toString());
                headers.set('x-longitude', currentLocation.longitude.toString());
            }

            return headers;
        },
    }),
    tagTypes: ['Product', 'Location'],
    endpoints: (builder) => ({
        // Get location-based products
        getLocationBasedProducts: builder.query<ApiResponse<Product[]>, void>({
            query: () => {
                const location = locationManager.getCurrentLocation();
                return {
                    url: '/products',
                    params: location ? {
                        lat: location.latitude,
                        lng: location.longitude,
                    } : {},
                };
            },
            providesTags: ['Product', 'Location'],
        }),

        // Search products with location
        searchProductsWithLocation: builder.mutation<ApiResponse<Product[]>, { query: string }>({
            query: ({ query }) => {
                const location = locationManager.getCurrentLocation();
                return {
                    url: '/search',
                    method: 'POST',
                    body: {
                        query,
                        location: location ? {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        } : null,
                    },
                };
            },
            invalidatesTags: ['Product'],
        }),
    }),
});

// Location-aware wrapper for automatic refetching
export const useLocationBasedProducts = () => {
    const { coordinates } = useCurrentLocation();
    const coordinatesRef = useRef<Coordinates | null>(null);

    // Query that will refetch when location changes
    const result = productsApi.useGetLocationBasedProductsQuery(undefined, {
        // Skip if no coordinates yet
        skip: !coordinates,
    });

    useEffect(() => {
        // Check if location changed significantly
        if (coordinates && coordinatesRef.current) {
            const oldCoord = coordinatesRef.current;
            const newCoord = coordinates;

            const oldLatStr = oldCoord.latitude.toFixed(6);
            const newLatStr = newCoord.latitude.toFixed(6);
            const oldLngStr = oldCoord.longitude.toFixed(6);
            const newLngStr = newCoord.longitude.toFixed(6);

            // If first 6 digits changed, refetch
            if (oldLatStr !== newLatStr || oldLngStr !== newLngStr) {
                result.refetch();
            }
        }

        coordinatesRef.current = coordinates;
    }, [coordinates, result]);

    return {
        ...result,
        coordinates,
    };
};

export const { useGetLocationBasedProductsQuery, useSearchProductsWithLocationMutation } = productsApi;

// Utility function to manually trigger location-based refetch
export const refetchLocationBasedData = () => {
    const currentLocation = locationManager.getCurrentLocation();
    if (currentLocation) {
        // Manually invalidate location-based cache
        productsApi.util.invalidateTags(['Location']);
    }
};