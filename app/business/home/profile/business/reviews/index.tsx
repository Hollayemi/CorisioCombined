import { Dropdown } from "@/components/dropdown";
import NoRecord from "@/components/noRecord";
import StoreWrapper from "@/components/wrapper/business";
import { useStoreData } from "@/hooks/useData";
import { useGetBranchFeedbacksQuery } from "@/redux/business/slices/branchSlice";
import { formatDate } from "@/utils/format";
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, RefreshControl, ScrollView, Text, useColorScheme, View } from "react-native";

export interface RatingBreakdown {
    stars: number;
    percentage: number;
    count: number;
}

export interface Review {
    id: number;
    username: string;
    picture: string;
    rate: number;
    message: string;
    date: string;
    productName: string;
}



export default function Reviews() {
    const { storeInfo } = useStoreData()
    const [activeTab, setActiveTab] = useState("Store Reviews");
    const { store, branch } = storeInfo.profile || {}
    const [searchProduct, setProductName] = useState("")
    const { data, isLoading, refetch } = useGetBranchFeedbacksQuery({ store, branch });
    const tabOffsetValue = useRef(new Animated.Value(0)).current;
    const [sortBy, setSortBy] = useState('Latest');
    const isDark = useColorScheme() === 'dark'
    const initialLayout = Dimensions.get("window").width - 35;
    const iconDarkColor = isDark ? "#eee" : "#333"

    const { store: storeReview, product } = data?.data || {}
    console.log({ storeReview, product })
    console.log({ _id: product?.[0]?._id })
    const { reviews, products, average, sum: totalReviews, ...others } = activeTab === "Product Reviews" ? product?.[0] || {} : store?.[0] || {};

    console.log({ products })

    const handleTabPress = (tabName: any, index: any) => {
        setActiveTab(tabName);
        Animated.spring(tabOffsetValue, {
            toValue: index,
            useNativeDriver: true,
        }).start();
    };

    const calcPercentage = (total: number, occurrences: number): number => {
        return total === 0 ? 0 : ((occurrences / total) * 100).toFixed(0) as unknown as number;
    };

    const ratingsBreakdown = [5, 4, 3, 2, 1].map((rate) => ({
        stars: rate, percentage: calcPercentage(totalReviews || 0, others[rate] || 0), count: others[rate],
    }))


    const RatingBar: React.FC<{ rating: RatingBreakdown }> = ({ rating }) => (
        <View className="flex-row items-center mb-2">
            <View className="flex-row items-center w-8">
                <Text className="text-sm text-gray-700 dark:text-gray-300 mr-1">
                    {rating.stars}
                </Text>
                <Text className="text-yellow-500 text-sm">★</Text>
            </View>

            <View className="flex-1 mx-3">
                <View className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <View
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${rating.percentage}%` }}
                    />
                </View>
            </View>

            <Text className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                {rating.percentage}%
            </Text>
        </View>
    );

    const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3">
            <View className="flex-row items-start mb-3">
                <View className="w-10 h-10 bg-gray-600 rounded-full items-center justify-center mr-3">
                    <Image
                        source={{ uri: review.picture }}
                        className="w-12 h-12 rounded-full !object-contain mr-2.5"
                    />
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-medium text-gray-900 dark:text-white">
                            {review.username}
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-yellow-500 mr-1">★</Text>
                            <Text className="text-sm font-medium text-gray-900 dark:text-white">
                                {review.rate.toFixed(1)}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(review.date)}  • {review.productName}
                    </Text>
                </View>
            </View>

            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                {review.message}
            </Text>
        </View>
    );
    return (
        <StoreWrapper headerTitle="Reviews" active="profile">
            <ScrollView
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
                showsVerticalScrollIndicator={false}
                className="flex-1 p-4 bg-gray-50 dark:bg-gray-900"
            >
                <View className="flex-row my-3 mb-4 !mx-3 bg-gray-100 dark:bg-slate-700 relative  rounded-full">
                    <Pressable
                        onPress={() =>
                            handleTabPress("Store Reviews", 0)
                        }
                        className={`flex-1  z-50 rounded-full overflow-hidden`}
                    >
                        <Text
                            className={`text-center p-3 py-4 font-semibold ${activeTab === "Store Reviews"
                                ? "text-black"
                                : "text-gray-500 dark:text-gray-200"
                                }`}
                        >
                            Store Reviews
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handleTabPress("Product Reviews", 1)}
                        className={`flex-1 z-50 rounded-full overflow-hidden`}
                    >
                        <Text
                            className={`text-center p-3 py-4  font-semibold ${activeTab === "Product Reviews"
                                ? "text-black"
                                : "text-gray-500 dark:text-gray-200"
                                }`}
                        >
                            Product Reviews
                        </Text>
                    </Pressable>
                    <Animated.View
                        className="absolute text-white dark:text-black bg-[#2A347E] dark:bg-[#FDB415] h-full w-1/2 ml-1 rounded-full z-10"
                        style={{
                            transform: [
                                {
                                    translateX: tabOffsetValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [
                                            -3,
                                            initialLayout / 2,
                                        ],
                                    }),
                                },
                            ],
                        }}
                    />
                </View>
                <View className="">
                    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                                All Ratings ({totalReviews || 0})
                            </Text>
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                                {/* {overallPercentage}% */}
                            </Text>
                        </View>

                        {/* Rating Breakdown */}
                        <View className="mb-4">
                            {ratingsBreakdown.map((rating) => (
                                <RatingBar key={rating.stars} rating={rating} />
                            ))}
                        </View>
                    </View>

                    {/* Reviews Section Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-medium text-gray-900 dark:text-white">
                            {reviews?.length || 0} Reviews
                        </Text>

                        {activeTab === "Product Reviews" && <Dropdown
                            options={products?.map((each: any) => (
                                { label: each, value: each })) || []}
                            selected={[searchProduct]} // Wrap in array since component expects array
                            onSelect={(selectedValues) => setProductName(selectedValues[0])}
                            className="mt-2 py-0 h-9 !w-fit max-w-[150px]"
                            textClass="!font-bold"
                            placeholder="Sort by Product"
                            multiple={false}
                        />}
                    </View>

                    {/* Reviews List */}
                    <View className="mb-6">
                        {reviews?.length ? reviews?.map((review: any) => (
                            <ReviewItem key={review.id} review={review} />
                        )) : <NoRecord text="No Rating " className="!h-40 !-mt-10 p-3" />}
                    </View>
                </View>
            </ScrollView>
        </StoreWrapper>
    )
}