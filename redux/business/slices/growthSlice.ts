
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./api/axiosBaseQuery";

// Create API service
export const growthApi = createApi({
    reducerPath: "growthApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        // Store endpoints
        getBranchInfo: builder.mutation<ApiResponse, StorePayload>({
            query: (payload) => ({
                url: "/store/new",
                method: "POST",
                data: payload,
            }),
        }),

        getStoreDetails: builder.query<ApiResponse, void>({
            query: () => ({
                url: "/store",
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
                invalidatesTags: ["storeInfo"],
            }),
        }),

        getStoreGrowth: builder.query<ApiResponse, analyticsPayload>({
            query: ({ dateFrom, dateTo, interval }) => ({
                url: `/store/growth?startDate=${dateFrom}&endDate=${dateTo}&interval=${interval}`,
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
            }),
        }),

        getStoreCategoriesGrowth: builder.query<ApiResponse, analyticsPayload>({
            query: ({ dateFrom, dateTo, interval }) => ({
                url: `/store/category-sales?startDate=${dateFrom}&endDate=${dateTo}&interval=${interval}`,
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
            }),
        }),

        getStoreProductsGrowth: builder.query<ApiResponse, analyticsPayload>({
            query: ({ dateFrom, dateTo, interval }) => ({
                url: `/store/product-count?start=${dateFrom}&end=${dateTo}&interval=${interval.toLowerCase()}`,
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
            }),
        }),

        getStoreSalesGrowth: builder.query<ApiResponse, analyticsPayload>({
            query: ({ dateFrom, dateTo, interval }) => ({
                url: `/store/sales-count?start=${dateFrom}&end=${dateTo}&interval=${interval.toLowerCase()}`,
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
            }),
        }),

        getFeaturedCategories: builder.query<ApiResponse, string | boolean | void>({
            query: (for_store) => ({
                url: `/configure/categories/thread?for_store=${for_store ? "true" : "false"}`,
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
            }),
        }),

        updateBranchImages: builder.mutation<ApiResponse, updateImagesPayload>({
            query: (payload) => ({
                url: "/branch/images",
                method: "POST",
                data: payload,
                providesTags: ["storeInfo"],
            }),
        }),

        getStaffAccount: builder.query<ApiResponse, void>({
            query: () => ({
                url: "/store/get-account",
                method: "GET",
                forceRefetch: ({
                    currentArg,
                    previousArg,
                }: {
                    currentArg: any;
                    previousArg: any;
                }) => currentArg !== previousArg,
            }),
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetFeaturedCategoriesQuery,
    useGetStoreDetailsQuery,
    useGetStoreGrowthQuery,
    useGetStoreProductsGrowthQuery,
    useGetStoreSalesGrowthQuery,
    useGetStoreCategoriesGrowthQuery,
    useGetBranchInfoMutation,
    useUpdateBranchImagesMutation,
    useGetStaffAccountQuery,
} = growthApi;

// Types
interface ApiResponse {
    type: "success" | "error";
    message: string;
    accessToken?: any;
    data?: any;
    to?: string;
}

interface StorePayload {
    // Define your store creation payload
    [key: string]: any;
}

interface analyticsPayload {
    dateFrom: string;
    dateTo: string;
    interval: string;
}

interface updateImagesPayload {
    image: any;
    type: "gallery" | "profile_image";
    state: "add" | "remove";
}

// AppDispatch type from your store setup
type AppDispatch = any; // Replace with your actual dispatch type
