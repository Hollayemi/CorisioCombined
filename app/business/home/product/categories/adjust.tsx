import { CategorySelector } from "@/components/category/selector";
import StoreWrapper from "@/components/wrapper/business";
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import { useEditShopInfoMutation, useGetCategoriesQuery } from "@/redux/business/slices/storeSlice";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";

export default function AdjustCategories() {
    const { data: savedCates, isLoading: loadingSaved, refetch: refetchSaved } = useGetCategoriesQuery()
    const { data: cates, isLoading, refetch } = useGetFeaturedCategoriesQuery(false);
    const [editShopInfo, { isLoading: saving }] = useEditShopInfoMutation()
    const categoryTree = cates ? cates?.data : [];
    const [selectedCategories, setSelectedCategories] = useState({
        main: [],
        subCategories: [],
        groups: []
    });

    const mySavedCarts = savedCates?.data?.categories || {
        main: [],
        subCategories: [],
        groups: []
    }
    useEffect(() => { setSelectedCategories(mySavedCarts) }, [savedCates])

    return (
        <StoreWrapper active="catalogue" headerTitle="Adjust Category">
            <ScrollView refreshControl={<RefreshControl onRefresh={refetchSaved} refreshing={loadingSaved} />} className="flex-1 mt-4">
                <View className="flex-1 h-full">
                    {(loadingSaved || isLoading) ? <ActivityIndicator /> :
                        <CategorySelector
                            categories={categoryTree}
                            refetch={refetch}
                            handleNext={() => editShopInfo({ categories: selectedCategories }).then(() => refetchSaved())}
                            isLoading={isLoading}
                            onSelectionChange={setSelectedCategories}
                            initialSelection={selectedCategories}
                        />}
                </View>
            </ScrollView>
        </StoreWrapper>
    )
}