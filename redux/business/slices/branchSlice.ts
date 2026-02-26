
import { ApiResponse, setCoordinatesPayload } from '@/helper/prop';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

interface Branch {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    coordinates?: [number, number];
    images?: string[];
    storeId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CreateBranchRequest {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    coordinates?: [number, number];
}

interface ConnectBranchRequest {
    branchId: string;
    file?: File;
}

export interface UploadImageRequest {
    image: string;
    state: "add";
    type: "gallery" | "store_image" | "staff_image",
}

interface ProductSuggestion {
    id: string;
    productId: string;
    category: string;
    status: 'pending' | 'approved' | 'rejected';
}

export const branchApi = createApi({
    reducerPath: 'branchApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Branch', 'ProductSuggestion', 'BranchInfo'],
    endpoints: (builder) => ({
        // Branch CRUD
        getAllBranches: builder.query<Branch[], void>({
            query: () => ({
                url: '/branch/all',
                method: 'GET',
            }),
            providesTags: ['Branch'],
        }),

        getBranchInfo: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/branch/info',
                method: 'GET',
            }),
            providesTags: ['BranchInfo'],
        }),

        updateStoreInfo: builder.mutation<ApiResponse<any>, any>({
            query: (payload) => ({
                url: `/store/profile`,
                method: "PATCH",
                data: payload,
            }),
        }),

        createNewBranch: builder.mutation<Branch, CreateBranchRequest>({
            query: (branchData) => ({
                url: '/create/branch',
                method: 'POST',
                data: branchData,
            }),
            invalidatesTags: ['Branch'],
        }),

        editBranchInfo: builder.mutation<Branch, Partial<Branch>>({
            query: (branchData) => ({
                url: '/edit/branch',
                method: 'PUT',
                data: branchData,
            }),
            invalidatesTags: ['Branch', 'BranchInfo'],
        }),

        updateBranchLocation: builder.mutation<ApiResponse<any>, setCoordinatesPayload>({
            query: (locationData) => ({
                url: '/branch/location',
                method: 'PUT',
                data: locationData,
            }),
            invalidatesTags: ['Branch', 'BranchInfo'],
        }),

        deleteBranch: builder.mutation<void, string>({
            query: (branchId) => ({
                url: `delete/branch/${branchId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Branch'],
        }),

        connectBranch: builder.mutation<any, ConnectBranchRequest>({
            query: ({ branchId, file }) => {
                const formData = new FormData();
                formData.append('branchId', branchId);
                if (file) formData.append('file', file);

                return {
                    url: '/connect/branch',
                    method: 'POST',
                    data: formData,
                };
            },
            invalidatesTags: ['Branch'],
        }),

        // Branch Images
        uploadStorePicture: builder.mutation<any, UploadImageRequest>({
            query: (data) => ({
                url: '/branch/images',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Branch'],
        }),

        uploadStorePictureLink: builder.mutation<any, UploadImageRequest>({
            query: (data) => ({
                url: '/branch/images/link',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Branch'],
        }),

        deleteStoreFile: builder.mutation<void, { fileId: string }>({
            query: (data) => ({
                url: '/branch/file/delete',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['Branch'],
        }),

        // Product Suggestions
        loadAllSuggestions: builder.query<ProductSuggestion[], string>({
            query: (category) => ({
                url: `branch/product-suggestion/${category}`,
                method: 'GET',
            }),
            providesTags: ['ProductSuggestion'],
        }),

        productSuggestionsAction: builder.mutation<any, {
            suggestionId: string;
            action: 'approve' | 'reject';
        }>({
            query: (data) => ({
                url: '/branch/product-suggestion-action',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['ProductSuggestion'],
        }),

        // Location
        getNearBranches: builder.query<Branch[], {
            lat: number;
            lng: number;
            radius?: number;
        }>({
            query: (params) => ({
                url: '/branch/near',
                method: 'GET',
                params,
            }),
        }),

        getBranchFeedbacks: builder.query<any, { store: string, branch: string }>({
            query: ({ store, branch }) => ({
                url: `/store/feedback/${store}/${branch}`,
                method: 'GET',
            }),
            providesTags: ['Branch'],
        })
    }),
});

export const {
    useGetAllBranchesQuery,
    useGetBranchInfoQuery,
    useUpdateStoreInfoMutation,
    useCreateNewBranchMutation,
    useEditBranchInfoMutation,
    useDeleteBranchMutation,
    useUpdateBranchLocationMutation,
    useConnectBranchMutation,
    useUploadStorePictureMutation,
    useUploadStorePictureLinkMutation,
    useDeleteStoreFileMutation,
    useLoadAllSuggestionsQuery,
    useProductSuggestionsActionMutation,
    useGetNearBranchesQuery,
    useGetBranchFeedbacksQuery,
} = branchApi;