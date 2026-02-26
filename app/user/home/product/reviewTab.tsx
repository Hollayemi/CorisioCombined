import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
// import OptionsMenu from "../../components/option-menu";
// import MyPagination from "../../components/pagination";
import OptionsMenu from "@/components/option-menu";
import Rating from "@/components/rating";
import { Ionicons } from "@expo/vector-icons";
import Coment from "./comment";

interface RatingDisplayLengthProps {
    rate: number;
    percentage: number;
    freq: number;
}

const RatingDisplayLength: React.FC<RatingDisplayLengthProps> = ({
    rate,
    percentage,
    freq,
}) => {
    const getColor = (color: number): string => {
        if (color >= 85) return "bg-green-500 dark:!bg-green-300";
        if (color >= 70) return "bg-teal-500 dark:!bg-teal-300";
        if (color >= 50 && color < 70) return "bg-blue-500 dark:!bg-blue-300";
        if (color > 30 && color < 50) return "bg-gray-500 dark:!bg-gray-300";
        return "bg-red-500 dark:!bg-red-300";
    };

    return (
        <View className="flex-row items-center mt-3">
            <Text className="dark:text-white">{rate}</Text>
            <View className="flex-1 mx-2.5 bg-gray-200 h-1.5 rounded-full dark:bg-gray-600">
                <View
                    className={`h-full rounded-full ${getColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                />
            </View>
            <Text className="dark:text-gray-300">{freq} Ratings</Text>
        </View>
    );
};

const calcPercentage = (total: number, occurrences: number): number => {
    return total === 0 ? 0 : (occurrences / total) * 100;
};

interface ReviewTabProps {
    summary: any;
    page: number;
    showingPage: any;
}

const ReviewTab: React.FC<ReviewTabProps> = ({
    summary,
    page,
    showingPage,
}) => {
    const [option, setOption] = useState<string>("March 2023 - October 2023");
    const { reviews, average, sum, ...others } = summary;

    return reviews?.length ? (
        <ScrollView className="dark:bg-slate-950">
            <View className="px-2.5 py-3.5">
                <View className="flex-row items-center justify-between w-full">
                    <Text className="font-bold text-xl dark:text-white">
                        Product Review ({sum})
                    </Text>
                    {/* <OptionsMenu
                        Component={() => (
                            <View className="flex-row items-center">
                                <Text className="mr-2.5 dark:text-white">
                                    {option || "Select Date Range"}
                                </Text>
                                <Ionicons
                                    name="chevron-down-circle"
                                    size={15}
                                    className="dark:text-white"
                                />
                            </View>
                        )}
                        options={[
                            "January 2021 - December 2021",
                            "March 2022 - October 2022",
                            "March 2023 - October 2023",
                        ].map((x: any) => {
                            return { key: x, label: x };
                        })}
                        setSelectedValue={setOption}
                        selectedValue={option}
                    /> */}
                </View>

                <View className="flex-row justify-between mt-8">
                    <View className="flex-1 mt-2">
                        <Text className="dark:text-gray-300">Average Rating</Text>
                        <View className="flex-row items-center mt-2.5">
                            <Text className="font-bold text-2xl mr-2 dark:text-white">
                                {average.toFixed(1) || 4.7}
                            </Text>
                            <Rating rate={average || 0} size={15} />
                        </View>
                        {/* <Text className="dark:text-gray-400">Average rating this year</Text> */}
                    </View>
                    <View className="flex-1">
                        {[5, 4, 3, 2, 1].map((rate) => (
                            <RatingDisplayLength
                                key={rate}
                                rate={rate}
                                percentage={calcPercentage(sum, summary[rate])}
                                freq={summary[rate]}
                            />
                        ))}
                    </View>
                </View>

                {summary.reviews.map((item: any, i: number) => (
                    <Coment
                        key={i}
                        id={i}
                        rating={item.rate}
                        comment={item.message}
                        date={item.date}
                        user={item.username}
                        image={item.picture || "/images/customerSupport.png"}
                    />
                ))}

                {/* <MyPagination
                    setCurrentPage={showingPage}
                    currentPage={page}
                    totalItems={sum || 0}
                    itemsPerPage={7}
                /> */}
            </View>
        </ScrollView>
    ) : (
        <View className="justify-center items-center h-50 dark:bg-slate-950">
            <Text className="dark:text-white">No Reviews Yet</Text>
        </View>
    );
};

export default ReviewTab
