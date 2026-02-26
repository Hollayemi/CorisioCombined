import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface latLng {
    lat?: string | number | null,
    lng?: string | number | null
}

interface searchProp extends latLng {
    search: string
}

interface ViewProp {
    productId: string,
    branchId: string,
    store: string,
    branch: string,
}

// Views Slice
export const storeApi = createApi({
    reducerPath: 'storeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Store', 'Search'],
    endpoints: (builder) => ({
        // Set view
        getStoresNearby: builder.query<ApiResponse<any>, latLng>({
            query: (params) => ({
                url: '/home/near-stores',
                method: 'GET',
                params,
            }),
            providesTags: ['Search'],
        }),

        // Get views
        searchStore: builder.query<ApiResponse<any[]>, searchProp>({
            query: (params) => ({
                url: '/store-search',
                method: "GET",
                params,
                providesTags: ['Search']
            }),
        }),

        getStoreInfo: builder.query<ApiResponse<any>, { store?: string; branch?: string, branchId?: string }>({
            query: (params) => ({
                url: '/branch/info',
                method: "GET",
                params,
                providesTags: ['View']
            }),
        }),

        getStoreCategories: builder.query<ApiResponse<any>, { store?: string; branch?: string}>({
            query: (params) => ({
                url: '/store/all-categories',
                method: "GET",
                params,
            }),
        }),
        getStoreProducts: builder.query<ApiResponse<any>, any>({
            query: (params) => ({
                url: '/store/products-campaign',
                method: "GET",
                params,
            }),
        }),
    }),
});

export const {
    useGetStoresNearbyQuery,
    useSearchStoreQuery,
    useGetStoreInfoQuery,
    useGetStoreCategoriesQuery,
    useGetStoreProductsQuery,
} = storeApi;