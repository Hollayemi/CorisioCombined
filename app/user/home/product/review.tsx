import Rating from "@/components/rating";
import { isAuthenticated } from "@/redux/user/api/axiosBaseQuery";
import { useGetProductFeedbacksQuery } from "@/redux/user/slices/feedbackSlice";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import ReviewTab from "./reviewTab";


interface ReviewProps {
    store: string;
    branch: string;
    searchParams?: {
        page?: number;
    };
}

export const ReviewStore: React.FC<ReviewProps> = ({
    store,
    branch,
    searchParams,
}) => {
    const dispatch = useDispatch();
    // const { data, isLoading } = useSWR(
    //     `/store/feedback/${store}/${branch}?page=${searchParams?.page || 1}`
    // );
    const data = { data: [] }
    const isLoading = false
    const summary = data && !isLoading ? data?.data[0] : {};
    const [page, setPage] = useState(1);
    const [review, setReview] = useState<string>("");
    const [star, setStar] = useState<number>(0);

    const feedbackPayload = {
        review,
        rate: star,
        store,
        branch,
    };

    return (
        <View className="dark:bg-slate-950">
            <View className="bg-white rounded-xl p-4 mt-5 dark:bg-slate-800">
                <ReviewTab
                    page={page}
                    showingPage={setPage}
                    summary={summary}
                />
            </View>

            {!isAuthenticated() && (
                <View className="bg-white rounded-xl p-5 mt-5 dark:bg-slate-800">
                    <Text className="font-bold text-lg dark:text-white">
                        Rate this store
                    </Text>
                    <Text className="text-xs mb-2.5 dark:text-gray-300">
                        Tell others what you think
                    </Text>

                    <Rating
                        rate={0}
                        // onFinishRating={(rating) => setStar(rating)}
                        size={30}
                    // className="py-2.5"
                    />

                    <TextInput
                        onChangeText={(text) => setReview(text)}
                        placeholder="Write your own review"
                        placeholderTextColor="#9e9e9e"
                        className="border border-gray-200 rounded-xl h-25 p-2.5 text-align-top dark:border-gray-600 dark:text-white dark:bg-slate-700"
                        multiline
                    />

                    <View className="items-end mt-5">
                        <Button
                            title="Send"
                            onPress={
                                () => { }
                                // shopFeedbackHandler(feedbackPayload, dispatch)
                            }
                            color="#6200ea"
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

interface ReviewComponentProp {
    productId: string;
}

export const Review = ({ productId }: ReviewComponentProp) => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetProductFeedbacksQuery({ productId, page })

    const summary = data?.data[0];

    return (
        summary && (
            <ReviewTab summary={summary} page={page} showingPage={setPage} />
        )
    );
};

export default Review;