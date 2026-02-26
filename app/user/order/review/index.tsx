import Loader from "@/components/loader";
import ReviewCard from "@/components/order/orderCard";
import HomeWrapper from "@/components/wrapper/user";
import { useGetPendingReviewsQuery } from "@/redux/user/slices/orderSlice";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";


export default function Review() {
    const { data, isLoading, refetch } = useGetPendingReviewsQuery();
    const products = data ? data.data : [];
    return (
        <HomeWrapper active="profile" headerTitle="Pending Reviews">
            <View className="flex-1 p-2 bg-white dark:bg-slate-950">
                {!isLoading ? (
                    <FlatList
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
                        showsVerticalScrollIndicator={false}
                        data={products}
                        renderItem={({ item, index }) => (
                            <ReviewCard
                                {...{
                                    ...item,
                                    items: item.items,
                                    prodId: item.items.productId,
                                    quantity: item.items.quantity,
                                    createdAt: item.createdAt,
                                    currStatus: "Completed",
                                    orderItemId: item._id,
                                    branch: item.branch,
                                    store: item.store,
                                    orderSlug: item.items.name,
                                }}
                                refetch={refetch}
                                rating
                                index={index}
                            />
                        )}
                    />
                ) : (
                    <Loader />
                )}
            </View>
        </HomeWrapper>
    );
}
