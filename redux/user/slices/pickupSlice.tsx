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




interface PickupAgent {
    id: string;
    name: string;
    phone: string;
    address: string;
}



// Pickup Agent Slice
export const pickupApi = createApi({
    reducerPath: 'pickupApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Pickup'],
    endpoints: (builder) => ({
        // Add pickup agent
        addPickupAgent: builder.mutation<ApiResponse<PickupAgent>, Partial<PickupAgent>>({
            query: (data) => ({
                url: '/user/pickup',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Pickup'],
        }),

        // Get pickup agents
        getPickupAgents: builder.query<ApiResponse<PickupAgent[]>, void>({
            query: () => ({
                url: '/user/pickers',
                method: "GET",
                providesTags: ['Pickup']
            }),
        }),

        // Delete pickup agent
        deletePickupAgent: builder.mutation<ApiResponse<any>, string>({
            query: (pickupId) => ({
                url: `/user/pickup/${pickupId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Pickup'],
        }),
    }),
});


export const {
    useAddPickupAgentMutation,
    useGetPickupAgentsQuery,
    useDeletePickupAgentMutation,
} = pickupApi;

