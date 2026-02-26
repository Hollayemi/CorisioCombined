import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { formatDistance, timeSince } from "../../utils/format";

export default function MessageView(prop: any) {
    const { chatName, picture, lastMessage, chat, storeUnread, userUnread, discover, ...others } = prop;
    const navigation = useNavigation<any>();
    const { feedback } = lastMessage || {};
    const image = picture || others?.profile_image

    return (
        <Pressable
            className="justify-between flex-row bg-gray-50 border-b !border-gray-200 dark:!border-gray-800 dark:bg-slate-950 p-4 px-5"
            onPress={() => {
                router.push({
                    pathname: "/business/chat/userChat", params: {
                        ...prop,
                        chatId: others._id,
                        name: chatName || others?.businessName,
                        image: image,
                    }
                });
            }}
        >
            <View className="flex-row items-start w-[83%] relative">
                <Image
                    source={image ? { uri: image } : require("@/assets/images/customerSupport.png")}
                    className="rounded-full w-14 h-14"
                />
                <View className="ml-4 flex justify-center">
                    <Text className="text-lg capitalize mt-2 leading-4 text-indigo-900 dark:text-white font-semibold">
                        {(chatName || others?.businessName || "").replaceAll("_", " ")}
                    </Text>
                    <Text
                        className=" text-gray-900 w-60 leading-5 mt-2 text-sm dark:!text-gray-50 font-['Poppins_400Regular']"
                        numberOfLines={2}
                    >
                        {lastMessage?.message || others?.about_store || ""}
                    </Text>
                </View>
            </View>

            <View className="mr-0 flex-col items-end !absolute right-0 mt-2">
                <Text numberOfLines={1} className={`text-gray-900  mt-4 mr-2  text-right w-20  dark:text-gray-300 font-['Poppins_500Medium']  ${discover ? "text-md mt-4 mr-3" : "text-xs"}`}>
                    {lastMessage ? timeSince(lastMessage?.time) : formatDistance(others?.distance || "")}
                </Text>

                {storeUnread ? (
                    <View className="bg-indigo-900 dark:bg-indigo-700 p-0.5 w-5 h-5 mt-0.5 mx-2 rounded-full justify-center items-center">
                        <Text className="font-['Poppins_600SemiBold'] text-white text-[10px]">
                            {storeUnread}
                        </Text>
                    </View>
                ) : null}

                {discover ? null : feedback?.isSent ?
                    <MaterialIcons
                        name={userUnread ? "done" : "done-all"}
                        size={15}
                        color="gray"
                        className="mt-2 mr-2.5 dark:text-gray-400"
                    /> : <MaterialIcons
                        name={"access-time"}
                        size={15}
                        color="gray"
                        className="mt-3 mr-2.5 dark:text-gray-400"
                    />}
            </View>
        </Pressable>
    );
}