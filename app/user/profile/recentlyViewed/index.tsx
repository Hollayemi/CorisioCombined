import ItemsCard from "@/app/user/profile/savedItems/card";
import NoRecord from "@/components/noRecord";
import HomeWrapper from "@/components/wrapper/user";
import { useGetMyViewsQuery } from "@/redux/user/slices/viewSlice";
import React from "react";
import { FlatList, View } from "react-native";

export default function RecentlyViewed() {
    const { data, isLoading } = useGetMyViewsQuery();
    const viewed = data?.data || [];

    return (
        <HomeWrapper active="profile" headerTitle="Recently Viewed">
            <View className="flex-1 bg-white dark:bg-slate-950 px-[5%]">
                {viewed.length > 0 ? (
                    <FlatList
                        className="mb-5 flex-1"
                        data={viewed}
                        renderItem={({ item, index }: any) => (
                            <ItemsCard {...item} recentlyViewed={true} key={index} />
                        )}
                        keyExtractor={(item: any) => item.id}
                    />
                ) : (
                    <NoRecord />
                )}
            </View>
        </HomeWrapper>
    );
}