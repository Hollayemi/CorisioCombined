// ========================
// 1. store-api.ts - Store & Shop Information
// ========================

import { ApiResponse } from '@/helper/prop';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

interface Store {
    id: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
}

interface StoreRole {
    id: string;
    name: string;
    permissions: Record<string, boolean>;
}

interface StoreConfig {
    roles: StoreRole[];
    permissions: string[];
}

interface CreateStoreRequest {
    name: string;
    description?: string;
    address: string;
    phone: string;
    email: string;
}


export const storeApi = createApi({
    reducerPath: 'storeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Store', 'StoreRole', 'StoreConfig'],
    endpoints: (builder) => ({
        // Store Management
        getStoreDetails: builder.query<ApiResponse<any>, { category?: boolean }>({
            query: (params) => ({
                url: '/store',
                method: 'GET',
                params
            }),
            providesTags: ['Store'],
        }),

        getStoreByName: builder.query<Store, string>({
            query: (storeName) => ({
                url: `/store/get-store-by-name/${storeName}`,
                method: 'GET',
            }),
            providesTags: ['Store'],
        }),

        getShopInfoBrief: builder.query<Partial<Store>, void>({
            query: () => ({
                url: '/brief/store',
                method: 'GET',
            }),
            providesTags: ['Store'],
        }),

        createNewBusiness: builder.mutation<Store, CreateStoreRequest>({
            query: (storeData) => ({
                url: '/store/new',
                method: 'POST',
                data: storeData,
            }),
            invalidatesTags: ['Store'],
        }),

        editShopInfo: builder.mutation<ApiResponse<any>, any>({
            query: (storeData) => ({
                url: '/store/edit',
                method: 'PUT',
                data: storeData,
            }),
            invalidatesTags: ['Store'],
        }),

        // Role Management
        getGeneralStoreConfig: builder.query<StoreConfig, void>({
            query: () => ({
                url: '/store/roles',
                method: 'GET',
            }),
            providesTags: ['StoreConfig'],
        }),

        createRole: builder.mutation<StoreRole, Omit<StoreRole, 'id'>>({
            query: (roleData) => ({
                url: '/store/role',
                method: 'POST',
                data: roleData,
            }),
            invalidatesTags: ['StoreConfig'],
        }),

        updatePermission: builder.mutation<StoreRole, StoreRole>({
            query: (roleData) => ({
                url: '/store/role',
                method: 'PUT',
                data: roleData,
            }),
            invalidatesTags: ['StoreConfig'],
        }),

        deleteRole: builder.mutation<void, string>({
            query: (roleId) => ({
                url: '/store/role',
                method: 'DELETE',
                data: { roleId },
            }),
            invalidatesTags: ['StoreConfig'],
        }),

        // Files & Categories
        getFilesCount: builder.query<{ count: number }, void>({
            query: () => ({
                url: '/store/files-count',
                method: 'GET',
            }),
        }),

        loadMyFiles: builder.query<any[], void>({
            query: () => ({
                url: '/store/files',
                method: 'GET',
            }),
        }),

        getCategoriesAndCount: builder.query<any[], void>({
            query: () => ({
                url: '/store/brief-categories',
                method: 'GET',
            }),
        }),

        getStoreFilledCategories: builder.query<any[], void>({
            query: () => ({
                url: '/store/filled-categories',
                method: 'GET',
            }),
        }),

        getExpandCategories: builder.query<any[], void>({
            query: () => ({
                url: '/store/expand-categories',
                method: 'GET',
            }),
        }),
        getCategories: builder.query<any, void>({
            query: () => ({
                url: '/store/categories',
                method: 'GET',
            }),
        }),

        dashboardCards: builder.query<any, void>({
            query: () => ({
                url: '/dashboard/cards',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetStoreDetailsQuery,
    useGetStoreByNameQuery,
    useGetShopInfoBriefQuery,
    useCreateNewBusinessMutation,
    useEditShopInfoMutation,
    useGetGeneralStoreConfigQuery,
    useCreateRoleMutation,
    useUpdatePermissionMutation,
    useDeleteRoleMutation,
    useGetFilesCountQuery,
    useLoadMyFilesQuery,
    useGetCategoriesAndCountQuery,
    useGetStoreFilledCategoriesQuery,
    useGetExpandCategoriesQuery,
    useGetCategoriesQuery,
    useDashboardCardsQuery,
} = storeApi;