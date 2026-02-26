import CategoryCard from "@/components/product/CategoryCard";
import HomeWrapper from "@/components/wrapper/user";
import { useGetAllCategoriesQuery } from "@/redux/user/slices/homeSlice";
import React from "react";
import { FlatList, Image, View } from "react-native";

export default function Category() {
    const { data } = useGetAllCategoriesQuery()
    const cates = data?.data || []
    return (
        <HomeWrapper headerTitle="Categories" active="home">
            <View className="flex-1 bg-white dark:bg-slate-900">
                <View className="px-2">
                    <Image
                        source={require("@/assets/images/categoryCover.png")}
                        className="w-full rounded-lg z-50"
                    /></View>

                <FlatList
                    contentContainerStyle={{
                        paddingBottom: 20,
                        gap: 0
                    }}
                    className="gap-4"

                    numColumns={4}
                    data={cates}
                    renderItem={({ item }: any) => (
                        <View className="">
                            <CategoryCard {...item} noMargin isCategory />
                        </View>
                    )}
                    keyExtractor={(item: any) => item.id}
                />
            </View>
        </HomeWrapper>
    );
}