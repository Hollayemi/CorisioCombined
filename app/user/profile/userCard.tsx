import { useColorScheme } from "@/hooks/useColorScheme.web"
import { useUserData } from "@/hooks/useData"
import { Entypo } from "@expo/vector-icons"
import { router } from "expo-router"
import { Image, Text, TouchableOpacity, View } from "react-native"

export default function UserCard() {
    const { userInfo }: any = useUserData()
    const isDark = useColorScheme() === "dark"
    return (
        <TouchableOpacity onPress={() => router.push("/user/profile/account/details")}>
            <View className="flex-row h-20 rounded-full p-4 px-6 items-center space-x-3 bg-neutral-100 dark:bg-slate-900">
                <Image
                    source={userInfo.picture ? { uri: userInfo.picture } : require("@/assets/images/customerSupport.png")}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <View className={`flex justify-start `}>
                    <Text
                        className="text-black dark:text-white !pr-20 !text-[20px] font-bold font-poppins500 flex-shrink"
                        numberOfLines={1}
                    >
                        {userInfo?.fullname}
                    </Text>
                    <Text
                        className="text-gray-500 mt-1 dark:text-gray-200 text-[12px] font-medium font-poppins500 flex-shrink"
                        numberOfLines={1}
                    >
                        {userInfo.email}
                    </Text>
                </View>
                <Entypo
                    name="chevron-right"
                    size={18}
                    className="mt-2 mr-6 absolute right-0"
                    color={isDark ? "#eee" : "#333"}
                />
            </View>
        </TouchableOpacity>
    )
}