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

interface CartItem {
    productId: string,
    variation?: any
    store?: string,
    quantity?: string | number
    branch?: string,
}



export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        // Add to cart
        addToCart: builder.mutation<ApiResponse<any>, CartItem>({
            query: (data) => ({
                url: '/user/cart',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Cart'],
        }),

        // Get user cart
        getMyCart: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/user/cart',
                method: "GET",
                providesTags: ['Cart']
            }),
        }),

        // Get cart groups
        getCartGroups: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/user/cart-group',
                method: "GET",
                providesTags: ['Cart']
            }),
        }),

        // Get single cart item
        getSingleCartItem: builder.query<ApiResponse<CartItem>, string>({
            query: (productId) => ({
                url: `/user/cart/${productId}`,
                method: "GET",
                providesTags: ['Cart']
            }),
        }),

        // Change quantity
        changeCartQuantity: builder.mutation<ApiResponse<CartItem>, { id: string; operator: string }>({
            query: (data) => ({
                url: '/user/cart-qty',
                method: 'GET',
                params: data,
            }),
            invalidatesTags: ['Cart'],
        }),

        // Delete bulk cart items
        deleteBulkCart: builder.mutation<ApiResponse<any>, { productIds: string[] }>({
            query: (data) => ({
                url: '/user/cart/delete-bulk',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});



export const {
    useAddToCartMutation,
    useGetMyCartQuery,
    useGetCartGroupsQuery,
    useGetSingleCartItemQuery,
    useChangeCartQuantityMutation,
    useDeleteBulkCartMutation,
} = cartApi;
