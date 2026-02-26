import StoreLocationOnboarding from "@/components/map/expoMap";
import { View } from "react-native";

interface StoreLocation {
    latitude: number;
    longitude: number;
    address?: string;
}

export default function MapScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
            <StoreLocationOnboarding />
        </View>
    );
}
