// store/api/feedbackApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface saveProductFeedbacks {
    productId: string;
    orderId: string,
    store: string;
    branch: string;
    review: string,
    rate: string | number;
}

export const feedbackApi = createApi({
    reducerPath: 'feedbackApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Feedback'],
    endpoints: (builder) => ({

        saveProductFeedbacks: builder.mutation<ApiResponse<any>, saveProductFeedbacks>({
            query: (data) => ({
                url: '/product/feedback',
                method: 'POST',
                data: data,
            }),
        }),

        getProductFeedbacks: builder.query<ApiResponse<any>, { productId: string, page: string | number }>({
            query: ({productId, page}) => ({
                url: `/product/feedback/${productId}`,
                params: { page },
                method: 'GET',
            }),
        }),


        saveStoreFeedbacks: builder.mutation<ApiResponse<any>, saveProductFeedbacks>({
            query: (data) => ({
                url: '/product/feedback',
                method: 'POST',
                data: data,
            }),
        }),

        getStoreFeedbacks: builder.query<ApiResponse<any>, { store: string; branch: string }>({
            query: ({ store, branch }) => ({
                url: `/store/feedback/${store}/${branch}`,
                method: 'GET',
            }),
        }),



    }),
});

export const {
    useSaveProductFeedbacksMutation,
    useGetProductFeedbacksQuery,
    useSaveStoreFeedbacksMutation,
    useGetStoreFeedbacksQuery
} = feedbackApi;

