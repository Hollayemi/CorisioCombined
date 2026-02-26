import LocationMap from "@/components/map/userExpoMap";
import type { Route } from 'expo-router';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

interface StoreLocation {
    latitude: number;
    longitude: number;
    address?: string;
}

type PathParams = {
    path: Route
}

export default function MapScreen() {
    const params = useLocalSearchParams<PathParams>()
    const [location, setMapData] = useState()
    const backTo = params.path as Route
    useEffect(() => {
        location && router.push({ pathname: "/user/profile/address/newAddress", params: { data: JSON.stringify(location || "{}") } })
    }, [location])

    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
            <LocationMap backTo={backTo} setMapData={setMapData} />
        </View>
    );
}