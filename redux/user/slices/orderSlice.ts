import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}


interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    // Add other product fields
}



interface Order {
    id: string;
    products: Product[];
    total: number;
    status: string;
    createdAt: string;
    trackingNumber?: string;
}


interface getOrdersProp {
    status?: string;
    store?: string;
    branch?: string;
    limit?: string;
    page?: string;
}



// Order Slice
export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        // Create new order
        createOrder: builder.mutation<ApiResponse<Order>, any>({
            query: (orderData) => ({
                url: '/user/order',
                method: 'POST',
                data: orderData,
                params: { platform: "mobile" }
            }),
            invalidatesTags: ['Order'],
        }),

        // Get user orders
        getMyOrders: builder.query<ApiResponse<any>, getOrdersProp>({
            query: ({ status, store, branch, limit = 6, page = 1 }) => ({
                url: `/user/order`,
                method: "GET",
                params: { status, store, branch, limit, page },
                providesTags: ['Order']
            }),
        }),

        // Get single order
        getSingleOrder: builder.mutation<ApiResponse<Order>, string>({
            query: (orderId) => ({
                url: `/user/order/${orderId}`,
                method: 'POST',
            }),
        }),

        // Get order products
        getOrderProducts: builder.query<ApiResponse<Product[]>, string>({
            query: (orderId) => ({
                url: `/user/order/${orderId}`,
                method: "GET",
                providesTags: ['Order']
            }),
        }),

        // Calculate order price
        calculateOrderPrice: builder.mutation<ApiResponse<{ total: number }>, any>({
            query: (data) => ({
                url: '/user/order-price',
                method: 'POST',
                data: data,
            }),
        }),

        // Count orders
        countOrders: builder.query<ApiResponse<{ count: number }>, void>({
            query: () => ({
                url: '/user/order-count',
                method: "GET",
                providesTags: ['Order']
            }),
        }),

        // Track order
        trackOrder: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/user/order-track',
                method: "GET",
                providesTags: ['Order']
            }),
        }),

        // Update order
        updateOrder: builder.mutation<ApiResponse<Order>, { orderId: string; action: string }>({
            query: (data) => ({
                url: '/user/order-action',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Order'],
        }),

        // Delete order
        deleteOrder: builder.mutation<ApiResponse<any>, string>({
            query: (orderId) => ({
                url: `/user/delete-order/${orderId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Order'],
        }),

        // Get pending reviews
        getPendingReviews: builder.query<ApiResponse<any[]>, void>({
            query: () => ({
                url: '/user/pending-reviews',
                method: "GET",
                providesTags: ['Order']
            }),
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetSingleOrderMutation,
    useGetOrderProductsQuery,
    useCalculateOrderPriceMutation,
    useCountOrdersQuery,
    useTrackOrderQuery,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useGetPendingReviewsQuery,
} = orderApi;
