
import { ApiResponse } from '@/helper/prop';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Staff'],
    endpoints: (builder) => ({
        getTransactions: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/payment/log',
                method: 'GET',
            }),
            providesTags: ['Staff'],
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

        deletePaymentAccount: builder.mutation<ApiResponse<any>, { id: string }>({
            query: ({ id }) => ({
                url: '/payment/accounts/' + id,
                method: 'Delete',
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
    useGetTransactionsQuery,
    useSavePaymentAccountMutation,
    useDeletePaymentAccountMutation,
    useGetPaymentAccountQuery,
    useGetPaymentLogsQuery,
} = paymentApi

export interface BankAccount {
    type: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}