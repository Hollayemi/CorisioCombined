import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

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
export const viewsApi = createApi({
    reducerPath: 'viewsApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['View'],
    endpoints: (builder) => ({
        // Set view
        setView: builder.mutation<ApiResponse<any>, ViewProp>({
            query: (data) => ({
                url: '/user/view',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['View'],
        }),

        // Get views
        getMyViews: builder.query<ApiResponse<any[]>, void>({
            query: () => ({
                url: '/user/view',
                method: "GET",
                providesTags: ['View']
            }),
        }),
    }),
});

export const {
    useSetViewMutation,
    useGetMyViewsQuery,
} = viewsApi;