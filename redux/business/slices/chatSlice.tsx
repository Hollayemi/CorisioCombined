import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface ViewProp {
    productId: string,
    branchId: string,
    store: string,
    branch: string,
}

// Views Slice
export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Chat'],
    endpoints: (builder) => ({
        // Set view
        getUsersToChat: builder.query<ApiResponse<any>, any>({
            query: (params) => ({
                url: '/chat/users',
                method: 'GET',
                params,
                providesTags: ['Chat']
            }),
        }),

        // Get views
        getChatMessages: builder.query<ApiResponse<any[]>, any>({
            query: (params) => ({
                url: '/store/chat/messages',
                method: "GET",
                params,
                providesTags: ['Chat']
            }),
        }),
    }),
});

export const {
    useGetChatMessagesQuery,
    useGetUsersToChatQuery,
} = chatApi;