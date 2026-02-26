import { SearchBox } from "@/components/form/SearchBox";
import HomeWrapper from "@/components/wrapper/user";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import React, { useState } from "react";
import { View } from "react-native";
import KnownStores from "./tabs/customers";

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


                <KnownStores />

            </View>
        </HomeWrapper>
    );
}