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


interface Store {
    id: string;
    name: string;
    image: string;
    followedAt: string;
}


// Following Stores Slice
export const followingApi = createApi({
    reducerPath: 'followingApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Following'],
    endpoints: (builder) => ({
        // Follow store
        followStore: builder.mutation<ApiResponse<any>, { storeId: string }>({
            query: (data) => ({
                url: '/user/following',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Following'],
        }),

        // Get following stores
        getFollowingStores: builder.query<ApiResponse<Store[]>, void>({
            query: () => ({
                url: '/user/following',
                method: "GET",
                providesTags: ['Following']
            }),
        }),
    }),
});


export const {
    useFollowStoreMutation,
    useGetFollowingStoresQuery,
} = followingApi;
