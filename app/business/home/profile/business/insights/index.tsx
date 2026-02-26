
import CategoriesGrowthChart from "@/app/business/home/analytics/categories";
import StoreWrapper from "@/components/wrapper/business";
import { useStoreGrowthAnalytics } from "@/hooks/useAnalyics";
import { useGetStoreGrowthQuery } from "@/redux/business/slices/growthSlice";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";


export default function Insights() {
    const [showCalendar, setShowCalendar] = useState(false);
    const { data, isLoading, selectedInterval, setSelectedInterval, dateRange, setDayFrom, setDayTo, queryParams, refetch } =
        useStoreGrowthAnalytics({
            queryMutation: useGetStoreGrowthQuery,
        });

    console.log("Growth Data: ", data);
    return (
        <StoreWrapper headerTitle="Insights" active="profile">
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />} className="flex-1 p-2 py-4" showsVerticalScrollIndicator={false}>
                <CategoriesGrowthChart defaultParams={queryParams} />
            </ScrollView>
        </StoreWrapper>
    )
}
