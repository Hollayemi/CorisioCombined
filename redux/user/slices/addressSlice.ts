// store/api/addressApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// Common interfaces
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface saveAddress {
  address: string;
  state: string;
  city: string;
  postal_code: string;
  street?: string;
}

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Address'],
    endpoints: (builder) => ({

      // Register
      saveAddress: builder.mutation<ApiResponse<any>, saveAddress>({
        query: (data) => ({
          url: '/user/address',
          method: 'POST',
          data: data,
        }),
      }),
  
      // Verify OTP
      getAddresses: builder.query<ApiResponse<any>, void>({
        query: (data) => ({
          url: '/user/addresses',
          method: 'GET',
          data: data,
        }),
      }),
  
      asDefault: builder.mutation<ApiResponse<any>, any>({
        query: (data) => ({
          url: '/user/select',
          method: 'POST',
          data,
        }),
      }),
  
      // Forgot Password
      deleteAddress: builder.mutation<ApiResponse<any>, string >({
        query: (id) => ({
          url: `/user/address/delete/${id}`,
          method: 'DELETE',
          data: { id },
        }),
      }),
  
      // Reset Password
      updateAddress: builder.mutation<ApiResponse<any>, void>({
        query: (data) => ({
          url: '/user/address/edit',
          method: 'POST',
          data: data,
        }),
      }),
  
      
    }),
  });
  
  export const {
    useAsDefaultMutation,
    useDeleteAddressMutation,
    useGetAddressesQuery,
    useSaveAddressMutation,
    useUpdateAddressMutation
  } = addressApi;

