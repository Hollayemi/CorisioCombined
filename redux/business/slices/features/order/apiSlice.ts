import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../api/axiosBaseQuery";

// Create API service
export const orderSlice = createApi({
    reducerPath: "orderSlice",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Password endpoints
        getStoreOrders: builder.query<ApiResponse, void>({
            query: () => ({
                url: "/branch/order-request",
                method: "GET",
            }),
        }),

        viewStoreOrder: builder.query<ApiResponse, string>({
            query: (orderId) => ({
                url: `/branch/order-request?order=${orderId}`,
                method: "GET",
            }),
        }),

        getOrderProducts: builder.query<ApiResponse, string>({
            query: (order) => ({
                url: `/branch/order-product/${order}`,
                method: "GET",
            }),
        }),

        updateStoreOrder: builder.mutation<ApiResponse, updatePayload>({
            query: (payload) => ({
                url: `/branch/order-update`,
                method: "POST",
                data: payload,
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetStoreOrdersQuery,
    useViewStoreOrderQuery,
    useGetOrderProductsQuery,
    useUpdateStoreOrderMutation,
} = orderSlice;

// Types
interface ApiResponse {
    type: "success" | "error";
    message: string;
    data?: any;
    to?: string;
}

interface updatePayload {
    orderId: string;
    comment?: string;
    status: string;
    pickerSlug: string;
}
