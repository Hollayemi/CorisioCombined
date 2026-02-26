import { ApiResponse, updateOrderPayload } from '@/helper/prop';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

interface Order {
    id: string;
    orderId: string;
    customerId: string;
    customerName: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Cancelled';
    pickerId?: string;
    pickerName?: string;
    deliveryAddress: string;
    paymentMethod: string;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    createdAt: string;
    updatedAt: string;
}

interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: string;
    segment: 'new' | 'regular' | 'vip' | 'inactive';
    createdAt: string;
}

interface PurchaseHistory {
    customerId: string;
    orders: Order[];
    totalSpent: number;
    averageOrderValue: number;
    orderFrequency: string;
}

interface OrderCount {
    pending: number;
    confirmed: number;
    processing: number;
    completed: number;
    cancelled: number;
    total: number;
}

interface CustomerSegmentation {
    new: number;
    regular: number;
    vip: number;
    inactive: number;
    total: number;
}

export const ordersCustomersApi = createApi({
    reducerPath: 'ordersCustomersApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Order', 'Customer', 'Cart', 'OrderCount'],
    endpoints: (builder) => ({
        // Orders
        fetchStoreOrders: builder.query<ApiResponse<any>, {
            page?: number;
            limit?: number;
            status?: string;
            interval?: string;
            orderId?: string;
        }>({
            query: (params) => ({
                url: '/branch/order-request',
                method: 'GET',
                params,
            }),
            providesTags: ['Order'],
        }),

        BriefRecentOrders: builder.query<ApiResponse<any>, {
            page?: number;
            limit?: number;
            status?: string;
            interval?: string;
            orderId?: string;
        }>({
            query: (params) => ({
                url: '/branch/orders-brief',
                method: 'GET',
                params,
            }),
            providesTags: ['Order'],
        }),

        fetchOrderProducts: builder.query<ApiResponse<any>, string>({
            query: (orderId) => ({
                url: `branch/order-product/${orderId}`,
                method: 'GET',
            }),
            providesTags: ['Order'],
        }),

        listOrderItems: builder.query<OrderItem[], string>({
            query: (orderId) => ({
                url: `branch/order/${orderId}`,
                method: 'GET',
            }),
            providesTags: ['Order'],
        }),

        getStoreOrderCount: builder.query<OrderCount, void>({
            query: () => ({
                url: '/branch/order-count',
                method: 'GET',
            }),
            providesTags: ['OrderCount'],
        }),

        // Order Actions
        fetchOrderByPicker: builder.mutation<Order[], { pickerId: string }>({
            query: (data) => ({
                url: '/branch/picker-order',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Order'],
        }),

        confirmPicker: builder.mutation<void, {
            orderId: string;
            pickerId: string;
        }>({
            query: (data) => ({
                url: '/branch/confirm-picker',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Order'],
        }),

        updateOrder: builder.mutation<Order, updateOrderPayload>({
            query: (data) => ({
                url: '/branch/order-update',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Order', 'OrderCount'],
        }),

        // Customers
        getCustomers: builder.query<Customer[], {
            page?: number;
            limit?: number;
            segment?: string;
            search?: string;
        }>({
            query: (params) => ({
                url: '/branch/customers',
                method: 'GET',
                params,
            }),
            providesTags: ['Customer'],
        }),

        getCustomerSegmentation: builder.query<CustomerSegmentation, void>({
            query: () => ({
                url: '/branch/customers/segment',
                method: 'GET',
            }),
            providesTags: ['Customer'],
        }),

        getPurchaseHistory: builder.query<PurchaseHistory, {
            customerId: string;
            startDate?: string;
            endDate?: string;
        }>({
            query: (params) => ({
                url: '/branch/customers/history',
                method: 'GET',
                params,
            }),
            providesTags: ['Customer'],
        }),

        // Carts
        getMyCarts: builder.query<any[], {
            page?: number;
            limit?: number;
        }>({
            query: (params) => ({
                url: '/branch/cart-products',
                method: 'GET',
                params,
            }),
            providesTags: ['Cart'],
        }),
    }),
});

export const {
    useFetchStoreOrdersQuery,
    useBriefRecentOrdersQuery,
    useFetchOrderProductsQuery,
    useListOrderItemsQuery,
    useGetStoreOrderCountQuery,
    useFetchOrderByPickerMutation,
    useConfirmPickerMutation,
    useUpdateOrderMutation,
    useGetCustomersQuery,
    useGetCustomerSegmentationQuery,
    useGetPurchaseHistoryQuery,
    useGetMyCartsQuery,
} = ordersCustomersApi;
