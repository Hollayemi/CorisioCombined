import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from './api/axiosBaseQuery';

// Create API service
export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        uploadProduct: builder.mutation<ApiResponse, saveProducts>({
            query: (payload) => ({
                url: "/stores/products/new",
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
                url: `/stores/products/${payload.id}/availability`,
                method: "PATCH",
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
                url: "/stores/products/" + id,
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
    label: string;
    price: string;
    prodKey: string;
    description: string;
    specifications: { sizes?: any[] };
    images: any[];
    newImages: any[];
    totalInStock: string;
    subCollectionName: string;
    collectionName: string;
    category: string;
    subcategory: string;
    productGroup: string;
    condition: string;
    _id?: string;
}
