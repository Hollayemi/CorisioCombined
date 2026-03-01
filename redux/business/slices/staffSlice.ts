
import { ApiResponse } from '@/helper/prop';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';
import { UploadImageRequest } from './branchSlice';

interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
    roleId: string;
    branchId: string;
    profilePicture?: string;
    isActive: boolean;
    permissions: Record<string, boolean>;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateStaffRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    roleId: string;
    branchId: string;
    password: string;
}

interface UpdateStaffRequest {
    fullname?: string;
    email?: string;
    phone?: string;
    two_fa?: string | boolean;
}

interface ChangePasswordRequest {
    staffId: string;
    currentPassword: string;
    newPassword: string;
}

interface ResetPasswordRequest {
    email: string;
}

export const staffApi = createApi({
    reducerPath: 'staffApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Staff', 'LoggedInStaff'],
    endpoints: (builder) => ({
        // Staff CRUD
        getAllBranchStaffs: builder.query<Staff[], void>({
            query: () => ({
                url: '/branch/staffs',
                method: 'GET',
            }),
            providesTags: ['Staff'],
        }),
        getOneStaff: builder.query<Staff, string>({
            query: (staffId) => ({
                url: `/branch/staff/${staffId}`,
                method: 'GET',
            }),
            providesTags: ['Staff'],
        }),

        getCurrentStaff: builder.query<Staff, void>({
            query: () => ({
                url: '/branch/staff',
                method: 'GET',
            }),
            providesTags: ['Staff'],
        }),

        addNewStaff: builder.mutation<Staff, CreateStaffRequest>({
            query: (staffData) => ({
                url: '/branch/staff',
                method: 'POST',
                staffData,
            }),
            invalidatesTags: ['Staff'],
        }),

        updateStaffDetails: builder.mutation<Staff, UpdateStaffRequest>({
            query: (staffData) => ({
                url: '/branch/staff',
                method: 'PATCH',
                data: staffData,
            }),
            invalidatesTags: ['Staff', 'LoggedInStaff'],
        }),

        removeStaff: builder.mutation<void, string>({
            query: (staffId) => ({
                url: `branch/staff/remove/${staffId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Staff'],
        }),

        // Staff Status & Actions
        updateStaffStatus: builder.mutation<Staff, {
            staffId: string;
            action: 'activate' | 'deactivate' | 'suspend';
        }>({
            query: ({ staffId, action }) => ({
                url: `branch/staff/${staffId}/${action}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Staff'],
        }),

        // Authentication & Profile
        getLoggedInStaff: builder.query<ApiResponse<Staff>, void>({
            query: () => ({
                url: '/stores/me',
                method: 'GET',
            }),
            providesTags: ['LoggedInStaff'],
        }),

        getSessions: builder.query<ApiResponse<any>, void>({
            query: () => ({
                url: '/branch/staffs/sessions',
                method: 'GET',
            }),
        }),


        updateProfilePic: builder.mutation<Staff, UploadImageRequest>({
            query: (data) => ({
                url: '/staff/update-picture',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Staff', 'LoggedInStaff'],
        }),

        changeStaffPassword: builder.mutation<void, ChangePasswordRequest>({
            query: (data) => ({
                url: '/branch/staff/change-password',
                method: 'POST',
                data,
            }),
        }),

        resetStaffPassword: builder.mutation<void, ResetPasswordRequest>({
            query: (data) => ({
                url: '/branch/staff/reset-password',
                method: 'POST',
                data,
            }),
        }),

        changeStaffEmail: builder.mutation<void, {
            staffId: string;
            newEmail: string;
            password: string;
        }>({
            query: (data) => ({
                url: '/staff/change-email',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Staff', 'LoggedInStaff'],
        }),
    }),
});

export const {
    useGetAllBranchStaffsQuery,
    useGetOneStaffQuery,
    useGetCurrentStaffQuery,
    useAddNewStaffMutation,
    useUpdateStaffDetailsMutation,
    useRemoveStaffMutation,
    useUpdateStaffStatusMutation,
    useGetLoggedInStaffQuery,
    useGetSessionsQuery,
    useUpdateProfilePicMutation,
    useChangeStaffPasswordMutation,
    useResetStaffPasswordMutation,
    useChangeStaffEmailMutation,
} = staffApi;