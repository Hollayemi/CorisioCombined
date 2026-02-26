import NoRecord from "@/components/noRecord";
import HomeWrapper from "@/components/wrapper/user";
import { useGetSavedItemsQuery } from "@/redux/user/slices/saveItemSlice";
import React from "react";
import { FlatList, View } from "react-native";
import ItemsCard from "./card";

export default function SavedItems() {
    const { data, isLoading, refetch } = useGetSavedItemsQuery();
    const saved = data?.data || [];

    return (
        <HomeWrapper active="profile" headerTitle="Saved Items">
            <View className="flex-1 bg-white dark:bg-slate-950 px-[5%]">
                {saved.length > 0 ? (
                    <FlatList
                        className="mb-5 flex-1"
                        data={saved}
                        renderItem={({ item, index }: any) => (
                            <ItemsCard refetch={refetch} {...item} key={index} />
                        )}
                        keyExtractor={(item: any) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <NoRecord />
                )}
            </View>
        </HomeWrapper>
    );
}