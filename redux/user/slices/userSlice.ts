import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';
import { BankAccount } from '@/app/user/earn/components';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    user: any;
    phone: string;
    profilePicture?: string;
    // Add other user fields
}

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    // Add other product fields
}





interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}


// User Slice
export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['User', 'Notification', 'Search'],
    endpoints: (builder) => ({
        // Get user account
        getUserAccount: builder.query<any, void>({
            query: () => ({
                url: '/user/get-account',
                providesTags: ['User'],
                method: "GET"
            }),
        }),

        // Update user account
        updateUserAccount: builder.mutation<ApiResponse<User>, Partial<any>>({
            query: (userData: any) => ({
                url: '/user/update',
                method: 'POST',
                data: userData,
            }),
            invalidatesTags: ['User'],
        }),

        // Update profile picture
        updateProfilePicture: builder.mutation<ApiResponse<User>, any>({
            query: (formData: any) => ({
                url: '/user/update-picture',
                method: 'POST',
                data: formData,
            }),
            invalidatesTags: ['User'],
        }),

        // Get user searches
        getUserSearches: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/user/searches',
                providesTags: ['Search'],
                method: "GET"
            }),
        }),

        // Get suggestions
        getDiscoverMore: builder.query<ApiResponse<Product[]>, void>({
            query: () => ({ url: '/user/suggestions', method: "GET" }),
        }),

        // Notifications
        getUserNotifications: builder.query<ApiResponse<Notification[]>, void>({
            query: () => ({
                url: '/user/notification',
                providesTags: ['Notification'],
                method: "GET"
            }),
        }),

        viewAllNotifications: builder.query<ApiResponse<Notification[]>, void>({
            query: () => ({
                url: '/user/notification/view-all',
                providesTags: ['Notification'],
                method: "GET"
            }),
        }),

        updateNotifications: builder.mutation<ApiResponse<any>, { notificationIds: string[] }>({
            query: (data: any) => ({
                url: '/user/notification',
                method: 'PATCH',
                data: data,
            }),
            invalidatesTags: ['Notification'],
        }),

        deleteNotification: builder.mutation<ApiResponse<any>, { notificationId: string }>({
            query: ({ notificationId }: any) => ({
                url: '/user/notification/delete',
                method: 'DELETE',
                data: { notificationId },
            }),
            invalidatesTags: ['Notification'],
        }),

        subscribeToNotification: builder.mutation<ApiResponse<any>, { subscription: any }>({
            query: (data: any) => ({
                url: '/notifications/subscription',
                method: 'POST',
                data: data,
            }),
        }),

        createNotification: builder.mutation<ApiResponse<any>, Partial<Notification>>({
            query: (data: any) => ({
                url: '/user/notification',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Notification'],
        }),

        savePaymentAccount: builder.mutation<ApiResponse<any>, BankAccount>({
            query: (data: any) => ({
                url: '/payment/add-account',
                method: 'POST',
                data: data,
            }),
        }),

        getPaymentAccount: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/payment/accounts',
                method: 'GET',
            }),
        }),

        getPaymentLogs: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/payment/log',
                method: 'GET',
            }),
        }),


    }),
});


export const {
    useGetUserAccountQuery,
    useUpdateUserAccountMutation,
    useUpdateProfilePictureMutation,
    useGetUserSearchesQuery,
    useGetDiscoverMoreQuery,
    useGetUserNotificationsQuery,
    useViewAllNotificationsQuery,
    useUpdateNotificationsMutation,
    useDeleteNotificationMutation,
    useSubscribeToNotificationMutation,
    useCreateNotificationMutation,
    useSavePaymentAccountMutation,
    useGetPaymentAccountQuery,
    useGetPaymentLogsQuery,
} = userApi;
