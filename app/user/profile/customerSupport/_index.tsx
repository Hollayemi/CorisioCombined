import HomeWrapper from "@/components/wrapper/user";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import typeData, { optionData, } from "./data";
import Option from "./option";
import Type from "./type";

export default function CustomerSupport() {
    return (
        <HomeWrapper active="profile" headerTitle="Customer Support">
            <View className="flex-1 bg-white dark:bg-slate-950 py-4">
                <View className="flex-row items-center px-6 mb-7">
                    <Image
                        source={require("@/assets/images/customerSupport.png")}
                        className="w-[60px] h-[60px]"
                    />
                    <Text className="font-bold text-lg ml-[5%] text-neutral-800 dark:text-white">
                        <Text className="text-indigo-900 dark:text-indigo-400">Hi</Text> how can we{" "}
                        <Text className="text-indigo-900 dark:text-indigo-400">help</Text>
                        {"\n"} you today?
                    </Text>
                </View>

                <FlatList
                    className="w-full"
                    contentContainerStyle={{
                        paddingHorizontal: "4%",
                        paddingBottom: 20,
                    }}
                    numColumns={3}
                    data={typeData}
                    renderItem={({ item }: any) => <Type {...item} />}
                    keyExtractor={(item: any) => item.id}
                    ListFooterComponentStyle={{ width: "100%" }}
                    ListFooterComponent={
                        <FlatList
                            data={optionData}
                            renderItem={({ item }: any) => <Option {...item} />}
                            keyExtractor={(item: any) => item.id}
                            contentContainerStyle={{ paddingHorizontal: "4%" }}
                        />
                    }
                />
            </View>
        </HomeWrapper>
    );
}