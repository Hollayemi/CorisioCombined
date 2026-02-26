import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

const useGeolocation = (interval: number = 120000) => {
    const [coordinates, setCoordinates] = useState<{
        latitude: string | number | null;
        longitude: string | number | null;
    }>({ latitude: null, longitude: null });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const updateCoordinates = async () => {
            try {
                const { status } =
                    await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setError("Permission to access location was denied");
                    setLoading(false);
                    return;
                }

                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                if (location.coords.latitude !== null) {
                    const coord = {
                        latitude: location.coords.latitude.toFixed(8),
                        longitude: location.coords.longitude.toFixed(8),
                    }
                    await AsyncStorage.setItem("coord", JSON.stringify(coord))
                    setCoordinates(coord);
                } else {
                    const getCoord = await AsyncStorage.getItem("coord")
                    const coord = JSON.parse(getCoord || "{}")
                    console.log(coord)
                    setCoordinates(coord);
                }
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        updateCoordinates(); // Initial call
        const intervalId = setInterval(updateCoordinates, interval);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [interval]);

    return { coordinates, loading, error };
};

export default useGeolocation;
