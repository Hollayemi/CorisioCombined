import { SearchBox } from "@/components/form/SearchBox";
import HomeWrapper from "@/components/wrapper/user";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState } from "react";
import { View } from "react-native";
import DiscoverStore from "./tabs/nearStores";
import KnownStores from "./tabs/stores";

const Tab = createMaterialTopTabNavigator();

export default function ChatsList() {
    const [search, setSearch] = useState("");
    const isDark = useColorScheme() === "dark"

    const handleFilter = (e: any) => {
        setSearch(e);
        // const searchFilterFunction = (contact: any) =>
        //     contact.chatName.toLowerCase().includes(e.toLowerCase()) ||
        //     contact?.chat?.lastMessage?.message
        //         ?.toLowerCase()
        //         ?.includes(e.toLowerCase());

        // const filteredChatsArr = storeList.chat?.filter(searchFilterFunction);
        // setFilteredChat(filteredChatsArr);
    };


    return (
        <HomeWrapper headerTitle="Inbox">
            <View className="flex-1">
                <View className="px-2 mt-2 pb-2">
                    <SearchBox
                        value={search}
                        placeholder="Search for messages or stores"
                        onChange={handleFilter}
                    />
                </View>
                <Tab.Navigator
                    screenOptions={{
                        tabBarIndicatorStyle: {
                            backgroundColor: "transparent",
                            marginBottom: 1,
                            width: "50%",
                            marginLeft: 4,
                            borderBottomWidth: 3,
                            borderBottomColor: isDark ? "#eee" : "#2A347E",
                        },
                        tabBarActiveTintColor: isDark ? "#FDB415" : "#2A347E",
                        tabBarInactiveTintColor: isDark ? "#eee" : "#000",
                        tabBarLabelStyle: {
                            fontSize: 16,
                            fontWeight: "400",
                            textTransform: "capitalize",
                        },
                        tabBarStyle: {
                            elevation: 0,
                            // marginBottom: "5%",
                            overflow: "hidden",
                            backgroundColor: isDark ? "#020617" : "white",
                        },
                        tabBarIndicatorContainerStyle: {
                            backgroundColor: isDark ? "#020617" : "white",
                        },
                    }}
                    style={{ flex: 1, backgroundColor: "white" }}
                >
                    <Tab.Screen
                        name="Stores"
                        component={KnownStores}
                        initialParams={{ data: "" }}

                        key={`ongoing-`}

                    />
                    <Tab.Screen
                        name="Discover Stores"
                        component={DiscoverStore}
                        initialParams={{ data: "" }}
                    />

                </Tab.Navigator>

            </View>
        </HomeWrapper>
    );
}