import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useSaveProductFeedbacksMutation } from "@/redux/user/slices/feedbackSlice";
import {
    AntDesign,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Text,
    TextInput,
    View
} from "react-native";
import { timeSince } from "../../utils/format";
import GroupAvatar from "../collage";
import Button from "../form/Button";
import Rating from "../rating";
import { OrderStages } from "./stages";

export default function ReviewCard({
    statusHistory,
    navigation,
    rating,
    index,
    refetch,
    ...others
}: any) {
    const [feedbackHandler, { isLoading }] = useSaveProductFeedbacksMutation()
    const [ShowDetails, setShowDetails] = useState(false);
    const [toReview, setToReview] = useState(false);
    const [rate, setRate] = useState(0);
    const [reviewNote, setReviewNote] = useState("");

    const { store, branch, _id, prodId } = others;
    const reviewPayload = {
        productId: prodId,
        orderId: _id,
        store,
        branch,
        review: reviewNote,
        rate,
    };

    const orderDetails = () => {
        !rating ? setShowDetails(!ShowDetails) : setToReview((prev) => prev === others.prodId ? false : others.prodId);
    };
    return (
        <View className="border border-neutral-200 dark:border-slate-700 mb-3 rounded-xl overflow-hidden">
            <View className={`flex-row justify-between items-center p-5 ${ShowDetails ? 'bg-neutral-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'}`}>
                <GroupAvatar images={[others?.items?.image]} />
                <View className="flex-[0.95]">
                    <Text
                        className="text-neutral-600 dark:text-neutral-300 font-semibold text-[17px]"
                        onPress={orderDetails}
                    >
                        {!rating && "Order No:"}
                        {others.orderSlug}
                    </Text>
                    <View className="flex-row justify-between items-center">
                        <Text
                            className="text-sm font-semibold text-neutral-500 dark:text-neutral-400"
                            onPress={orderDetails}
                        >
                            {timeSince(others.createdAt)}
                        </Text>
                        <Status status={others.currStatus} />

                        <AntDesign
                            name={ShowDetails ? "up" : "down"}
                            size={14}
                            color="black"
                            className="text-black dark:!text-white"
                            onPress={orderDetails}
                        />
                    </View>
                    <Text className="text-neutral-500 dark:text-neutral-400 font-medium text-xs">
                        No of items: {others.quantity || others.items?.length}
                    </Text>
                </View>
            </View>

            {ShowDetails && (
                <>
                    <OrderStages statusHistory={statusHistory} />
                    <Text
                        className="w-full text-center bg-neutral-100 dark:bg-slate-800 py-2.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-2.5"
                        onPress={() =>
                            router.push({
                                pathname: "/user/order/orderDetails", params: {
                                    data: JSON.stringify({ statusHistory, ...others }),
                                }
                            })
                        }
                    >
                        View Order Details
                    </Text>
                </>
            )}

            {!statusHistory && (
                <View>
                    {others.items?.productId === toReview ? (
                        <View className="bg-neutral-100 dark:bg-slate-800 p-5">
                            <Rating
                                size={28}
                                rate={rate}
                                className="mb-2.5"
                                setClick={setRate}
                            />
                            <TextInput
                                selectionColor="#233974"
                                multiline
                                placeholder="Tell us more about your rating!"
                                onChangeText={(e) => setReviewNote(e)}
                                className="text-neutral-600 h-[150px] dark:text-neutral-300 mb-5 bg-white dark:bg-slate-900 text-justify p-2.5 text-lg"
                                placeholderTextColor="#9CA3AF"
                            />
                            <Button
                                title="Submit your review"
                                // isLoading={true}
                                size="small"
                                onPress={() => {
                                    feedbackHandler(reviewPayload).then(() => refetch());
                                    setRate(0);
                                    setReviewNote("")
                                }}
                            />

                        </View>
                    ) : (
                        <Text
                            className="w-full text-center bg-neutral-100 dark:bg-slate-800 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-2.5"
                            onPress={orderDetails}
                        >
                            Rate this product {"  "}
                            <MaterialCommunityIcons
                                name="star-shooting-outline"
                                size={20}
                                className="text-neutral-800 dark:text-neutral-200"
                            />
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

export function Status({ status }: { status?: string }) {
    const isDark = useColorScheme() === "dark"
    return (
        <View className="flex-row items-center mt-1.5">
            {!status ? (
                <AntDesign name="lock" size={17} color="green" />
            ) : status === "Completed" ? (
                <Ionicons
                    name="checkmark-done-circle"
                    size={17}
                    color="green"
                />
            ) : status === "Cancelled" ? (
                <MaterialIcons name="cancel" size={17} color="red" />
            ) : (
                <MaterialCommunityIcons
                    name="progress-clock"
                    size={17}
                    color={isDark ? "#f97316" : "#2A347E"}
                />
            )}
            <Text className="ml-1.5 text-neutral-800 dark:text-neutral-200">
                {!status
                    ? "In Progress"
                    : status === "Completed"
                        ? "Completed"
                        : status === "Cancelled"
                            ? "Cancelled"
                            : "In Progress"}
            </Text>
        </View>
    );
}