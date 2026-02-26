import { Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";


export default function Pattern() {
    return (
        <View className="relative opacity-100">
            <Image
                source={require("@/assets/images/gradient/auth1.png")}
                className="!absolute -top-40 left-0"
            />
            <Image
                source={require("@/assets/images/gradient/auth2.png")}
                className="!absolute -top-40 left-0"
            />
        </View>
    );
}

export function Back({
    label,
    labelClass,
}: {
    label?: string;
    labelClass?: string;
}) {
    const router = useRouter();

    return (
        <View className="flex-row items-center ">
            <Pressable
                onPress={() => router.back()}
                style={[]}
                className={`
                w-14 h-14 rounded-full flex items-center justify-center 
                bg-gray-200/60 dark:bg-gray-700/60 
                border border-gray-300 dark:border-gray-600 
                backdrop-blur-3xl active:opacity-60
            `}
            >
                <MaterialIcons
                    name="arrow-back"
                    className="!text-gray-700 dark:!text-gray-200 "
                    size={20}
                />
            </Pressable>

            {label && (
                <ThemedText className={` ml-5 font-bold text-2xl ${labelClass}`}>
                    {label}
                </ThemedText>
            )}
        </View>
    );
}
