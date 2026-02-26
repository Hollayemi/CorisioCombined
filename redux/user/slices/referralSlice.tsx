import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface AccontProp {
    account_name: string,
    account_number: string,
    bank: string,
}

// Views Slice
export const referralApi = createApi({
    reducerPath: 'referralApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Refer'],
    endpoints: (builder) => ({
        // Set view
        setBankAccount: builder.mutation<ApiResponse<any>, AccontProp>({
            query: (data) => ({
                url: '/agent/account',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Refer'],
        }),

        // Get views
        getAgentInfo: builder.query<ApiResponse<any[]>, void>({
            query: () => ({
                url: '/agent',
                method: "GET",
                providesTags: ['Refer']
            }),
        }),
    }),
});

export const {
    useSetBankAccountMutation,
    useGetAgentInfoQuery,
} = referralApi;