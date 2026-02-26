import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import { router, useLocalSearchParams } from "expo-router";
import { timeSince } from "@/utils/format";

function NotificationBox({ info }: any) {
    const currYear =`${new Date().getFullYear()} `
    return (
        <Pressable
            onPress={() => {
                router.push({ pathname: "/user/home/notification/details", params: { data: JSON.stringify(info) } });
            }}
            className="justify-between flex-row bg-white dark:bg-slate-900 w-fit p-4"
        >
            <View className="flex-row items-start">
                <Image
                    source={require("@/assets/images/orderNotif.png")}
                    className="bg-amber-100 w-[45px] h-[45px] rounded-full"
                />
                <View className="pl-4">
                    <View className="flex-row justify-between items-center">
                        <Text
                            className={`text-[15px] relative mb-2 ${info.unread ? 'text-gray-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'} font-['Poppins_600SemiBold'] font-bold max-w-[80%]`}
                            numberOfLines={1}
                        >
                            {info?.title}
                        </Text>
                        <Text className="mt-0.5 absolute right-0  text-neutral-500 dark:text-neutral-400 font-['Poppins_500Medium'] text-xs">
                            {timeSince(info.date).replaceAll(currYear, " ")}
                        </Text>
                    </View>
                    <Text className="mt-0.5 text-neutral-600 dark:text-neutral-200 font-['Poppins_500Medium'] text-[11px] leading-[18px] w-[40%]">
                        {info.note}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

export default function IntervalContainer({ interval }: any) {
    const renderRightActions = (id: any) => (
        <AntDesign
            name="delete"
            size={20}
            color="red"
            className="absolute top-10 right-7"
            onPress={() => { }}
        />
    );

    return (
        <View>
            <Text className="text-lg text-gray-900 dark:text-white font-['Poppins_600SemiBold'] px-4">
                {interval._id}
            </Text>

            <SwipeListView
                className="bg-gray-200 dark:bg-slate-800"
                data={interval.info}
                rightOpenValue={-85}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item, index }: any) => (
                    <NotificationBox key={index} info={item} />
                )}
                renderHiddenItem={(e: any) => renderRightActions(e.item._id)}
            />
        </View>
    );
}