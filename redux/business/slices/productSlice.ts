import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from './api/axiosBaseQuery';

// Create API service
export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        uploadProduct: builder.mutation<ApiResponse, saveProducts>({
            query: (payload) => ({
                url: "/stores/product",
                method: "POST",
                data: payload,
            }),
        }),

        updateProduct: builder.mutation<ApiResponse, saveProducts>({
            query: (payload) => ({
                url: "/stores/product/edit",
                method: "POST",
                data: payload,
            }),
        }),

        updateProductStatus: builder.mutation<ApiResponse, any>({
            query: (payload) => ({
                url: "/stores/product/status",
                method: "PUT",
                data: payload,
            }),
        }),

        // Password endpoints
        getStoreProducts: builder.query<ApiResponse, { category?: string }>({
            query: (params) => ({
                url: "/stores/products",
                method: "GET",
                params,
            }),
        }),

        getOneProducts: builder.query<ApiResponse, { id: string }>({
            query: ({ id }) => ({
                url: "/stores/get-one-product/" + id,
                method: "GET",
            }),
        }),

        // number of products, categories and sub categorues
        getStoreFilesCount: builder.query<ApiResponse, void>({
            query: () => ({
                url: "/stores/files-count",
                method: "GET",
            }),
        }),
    }),
});


// Export hooks for usage in components
export const {
    useUploadProductMutation,
    useUpdateProductMutation,
    useUpdateProductStatusMutation,
    useGetStoreProductsQuery,
    useGetOneProductsQuery,
    useGetStoreFilesCountQuery
} = productApi;


// Types
interface ApiResponse {
    type: "success" | "error";
    message: string;
    accessToken?: any;
    data?: any;
    to?: string;
}


interface saveProducts {
    prodName: string;
    prodPrice: string;
    prodKey: string;
    prodInfo: string;
    specifications: { sizes?: any[] };
    images: any[];
    newImages: any[];
    totInStock: string;
    subCollectionName: string;
    collectionName: string;
    category: string;
    subcategory: string;
    productGroup: string;
    delivery: string[];
    _id?: string;
}
