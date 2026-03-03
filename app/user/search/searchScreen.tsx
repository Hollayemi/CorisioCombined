import CustomizeStatus from "@/components/chips/customizedStatus";
import { SearchBox2 } from "@/components/form/SearchBox";
import HomeWrapper from "@/components/wrapper/user";
import { useGetDiscoverMoreQuery, useGetUserSearchesQuery } from "@/redux/user/slices/userSlice2";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, NativeModules, Text, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import { formatName } from "../../../utils/get-initials";

const { StatusBarManager } = NativeModules;

export default function SearchScreen() {
    const [search, setSearch] = useState("");
    const { data, isLoading } = useGetUserSearchesQuery();
    const { data: sug, isLoading: sugIsLoading } = useGetDiscoverMoreQuery();
    const mySearches = data?.data?.searches || [];
    const suggestions = sug?.data || [];

    const isDark = useColorScheme() === 'dark'

    return (
        <HomeWrapper active="home" headerTitle="Search">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className={`px-[4%] pt-[${StatusBarManager.HEIGHT + 20}px] bg-white dark:bg-slate-950 flex-1`}>
                    <View className="flex-row items-center mt-2">
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={isDark ? "#eee" : "#28303F"}
                            className="h-[30px] w-[30px] hidden rounded-full dark:text-white"
                            onPress={() => router.back()}
                        />

                        <SearchBox2
                            placeholder="Search"
                            value={search}
                            onChange={(e: any) => setSearch(e)}
                            mystyles="w-full h-[45px] border border-gray-200 dark:border-slate-700"
                            autoFocus
                            onSubmit={() =>
                                router.push({
                                    pathname: "/user/search", params: {
                                        title: formatName(search),
                                    }
                                })
                            }
                        />
                    </View>

                    {mySearches.length > 0 && (
                        <View className="flex-row justify-between items-center my-4">
                            <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                                Search History
                            </Text>
                            <Ionicons
                                name="trash"
                                size={18}
                                color={isDark ? "#eee" : "#28303F"}
                                className="h-[30px] w-[30px] mt-2  rounded-full dark:text-white"
                                onPress={() => router.back()}
                            />
                        </View>
                    )}

                    <View className="flex-row flex-wrap mb-12">
                        {mySearches.map((each: any, i: any) => (
                            <CustomizeStatus
                                key={i}
                                label={formatName(each)}
                                text="disabled"
                                size="medium"
                                sx={{ marginBottom: 10 }}
                                onPress={() => setSearch(each)}
                            />
                        ))}
                    </View>

                    <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                        Discover more
                    </Text>
                    <View className="flex-row flex-wrap mt-5">
                        {suggestions?.map((each: any, i: any) => (
                            <CustomizeStatus
                                key={i}
                                label={formatName(each)}
                                text="disabled"
                                size="medium"
                                sx={{ marginBottom: 10 }}
                                onPress={() => setSearch(each)}
                            />
                        ))}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </HomeWrapper>
    );
}