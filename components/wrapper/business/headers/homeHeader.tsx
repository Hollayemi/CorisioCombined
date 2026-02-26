import { useStoreData } from "@/hooks/useData";
import { Image, Text, TouchableOpacity, View } from "react-native";

export function HomeHeader() {
    const { staffInfo }: any = useStoreData();
    const { fullname, picture } = staffInfo || {};
    return (
        <>
            <View className="flex-row  items-center justify-between pb-4 px-3 pt-16 bg-[#2C337C]">
                <View className="flex-row items-center space-x-3">
                    <Image
                        source={{ uri: picture || "https://via.placeholder.com/150" }}
                        className="w-12 h-12 rounded-full mr-3"
                    />
                    <View>
                        <Text className="text-lg text-white">
                            Welcome Back!
                        </Text>
                        <Text className="text-xl font-bold text-white">
                            {fullname} 👋
                        </Text>
                    </View>
                </View>
                <TouchableOpacity className="bg-white/20 p-3 rounded-full">
                    <Text className="text-white text-lg">⚙️</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
